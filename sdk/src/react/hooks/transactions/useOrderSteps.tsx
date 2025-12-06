import {
	type SignatureStep,
	type Step,
	StepType,
	type TransactionStep,
} from '@0xsequence/api-client';
import {
	BaseError,
	type Hex,
	isHex,
	UserRejectedRequestError as ViemUserRejectedRequestError,
} from 'viem';
import {
	useChainId,
	useSendTransaction,
	useSignMessage,
	useSignTypedData,
	useSwitchChain,
} from 'wagmi';
import {
	ChainSwitchError,
	TransactionExecutionError,
	TransactionSignatureError,
	UserRejectedRequestError,
} from '../../../utils/_internal/error/transaction';
import { createLogger } from '../../_internal/logger';

const useTransactionOperations = () => {
	const { sendTransactionAsync } = useSendTransaction();
	const { signMessageAsync } = useSignMessage();
	const { signTypedDataAsync } = useSignTypedData();
	const { switchChainAsync } = useSwitchChain();
	const logger = createLogger('TransactionOperations');

	const switchChain = async (chainId: number) => {
		logger.debug('Switching chain', { targetChainId: chainId });

		try {
			await switchChainAsync({ chainId });
			logger.info('Chain switch successful', { chainId });
		} catch (e) {
			const error = e as Error;
			logger.error('Chain switch failed', error);

			if (error.name === 'UserRejectedRequestError') {
				throw new UserRejectedRequestError();
			}
			throw new ChainSwitchError(0, chainId);
		}
	};

	const signMessage = async (stepItem: SignatureStep) => {
		try {
			if (stepItem.id === StepType.signEIP191) {
				logger.debug('Signing with EIP-191', { data: stepItem.data });
				const message = isHex(stepItem.data)
					? { raw: stepItem.data }
					: stepItem.data;
				return await signMessageAsync({ message });
			}
			if (stepItem.id === StepType.signEIP712) {
				if (!stepItem.signature) {
					throw new Error('EIP-712 step missing signature data');
				}

				logger.debug('Signing with EIP-712', {
					domain: stepItem.signature.domain,
					types: stepItem.signature.types,
				});
				return await signTypedDataAsync({
					domain: stepItem.signature.domain,
					types: stepItem.signature.types,
					primaryType: stepItem.signature.primaryType,
					message: stepItem.signature.value,
				});
			}
		} catch (e) {
			const error = e as TransactionSignatureError;
			logger.error('Signature failed', error);

			if (error.cause instanceof BaseError) {
				const viemError = error.cause;
				if (viemError instanceof ViemUserRejectedRequestError) {
					throw new UserRejectedRequestError();
				}
			}

			throw new TransactionSignatureError(stepItem.id, error as Error);
		}
	};

	const sendTransaction = async (
		chainId: number,
		stepItem: TransactionStep,
	): Promise<Hex> => {
		logger.debug('Sending transaction', {
			chainId,
			to: stepItem.to,
			value: stepItem.value,
		});

		try {
			return await sendTransactionAsync({
				chainId,
				to: stepItem.to,
				data: stepItem.data,
				value: stepItem.value || 0n,
			});
		} catch (e) {
			const error = e as TransactionExecutionError;
			logger.error('Transaction failed', error);

			if (error.cause instanceof BaseError) {
				const viemError = error.cause;
				if (viemError instanceof ViemUserRejectedRequestError) {
					throw new UserRejectedRequestError();
				}
			}

			throw new TransactionExecutionError(
				stepItem.id || 'unknown',
				error as Error,
			);
		}
	};

	return {
		switchChain,
		signMessage,
		sendTransaction,
	};
};

export const useOrderSteps = () => {
	const { switchChain, signMessage, sendTransaction } =
		useTransactionOperations();

	const currentChainId = useChainId();

	const executeStep = async ({
		step,
		chainId,
	}: {
		step: Step;
		chainId: number;
	}) => {
		if (chainId !== currentChainId) {
			await switchChain(chainId);
		}

		let result: Hex | undefined;

		switch (step.id) {
			case StepType.signEIP191:
			case StepType.signEIP712:
				result = await signMessage(step);
				break;
			case StepType.buy:
			case StepType.sell:
			case StepType.tokenApproval:
			case StepType.createListing:
			case StepType.createOffer:
			case StepType.cancel:
				result = await sendTransaction(chainId, step);
				break;
			default:
				throw new Error(`Cannot execute step type: ${step.id}`);
		}

		return result;
	};

	return {
		executeStep,
	};
};
