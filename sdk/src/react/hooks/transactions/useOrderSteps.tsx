import {
	BaseError,
	type Hex,
	hexToBigInt,
	isHex,
	type TypedDataDomain,
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
import { type Step, StepType } from '../../_internal/api';
import { createLogger } from '../../_internal/logger';
import type { SignatureStep, TransactionStep } from '../../_internal/utils';

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
				logger.debug('Signing with EIP-712', {
					domain: stepItem.domain,
					types: stepItem.signature?.types,
				});
				return await signTypedDataAsync({
					// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
					domain: stepItem.signature!.domain as TypedDataDomain,
					// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
					types: stepItem.signature!.types,
					// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
					primaryType: stepItem.signature!.primaryType,
					// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
					message: stepItem.signature!.value,
				});
			}
		} catch (e) {
			const error = e as TransactionSignatureError;
			logger.error('Signature failed', error);

			if (error.cause instanceof BaseError) {
				const viemError = error.cause as BaseError;
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
				value: hexToBigInt(stepItem.value || '0x0'),
				...(stepItem.maxFeePerGas && {
					maxFeePerGas: hexToBigInt(stepItem.maxFeePerGas),
				}),
				...(stepItem.maxPriorityFeePerGas && {
					maxPriorityFeePerGas: hexToBigInt(stepItem.maxPriorityFeePerGas),
				}),
				...(stepItem.gas && {
					gas: hexToBigInt(stepItem.gas),
				}),
			});
		} catch (e) {
			const error = e as TransactionExecutionError;
			logger.error('Transaction failed', error);

			if (error.cause instanceof BaseError) {
				const viemError = error.cause as BaseError;
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

/**
 * Executes marketplace order steps including transactions and signatures
 *
 * This hook provides a unified interface for executing different types of steps
 * required in marketplace operations. It handles chain switching, message signing
 * (EIP-191 and EIP-712), and transaction sending with proper error handling.
 *
 * @returns Order step execution interface
 * @returns returns.executeStep - Function to execute a single marketplace step
 *
 * @example
 * Basic step execution:
 * ```typescript
 * const { executeStep } = useOrderSteps();
 *
 * // Execute a transaction step
 * const txHash = await executeStep({
 *   step: {
 *     id: StepType.buy,
 *     to: '0x...',
 *     data: '0x...',
 *     value: '0x...'
 *   },
 *   chainId: 137
 * });
 * ```
 *
 * @example
 * Processing multiple steps:
 * ```typescript
 * const { executeStep } = useOrderSteps();
 *
 * // Process steps from a marketplace operation
 * for (const step of steps) {
 *   try {
 *     const result = await executeStep({
 *       step,
 *       chainId: requiredChainId
 *     });
 *
 *     if (step.id === StepType.tokenApproval) {
 *       console.log('Approval tx:', result);
 *     } else if (step.id === StepType.createListing) {
 *       console.log('Listing created:', result);
 *     }
 *   } catch (error) {
 *     if (error instanceof UserRejectedRequestError) {
 *       console.log('User cancelled the operation');
 *       break;
 *     }
 *     throw error;
 *   }
 * }
 * ```
 *
 * @remarks
 * - Automatically switches chains if the current chain doesn't match required
 * - Supports all marketplace step types: buy, sell, list, offer, cancel, approve
 * - Handles both transaction steps and signature steps (EIP-191, EIP-712)
 * - Provides typed errors for better error handling
 * - Uses wagmi hooks internally for blockchain interactions
 *
 * @throws {UserRejectedRequestError} When user rejects the request in wallet
 * @throws {ChainSwitchError} When chain switching fails
 * @throws {TransactionSignatureError} When signature fails
 * @throws {TransactionExecutionError} When transaction execution fails
 *
 * @see {@link StepType} - Enum of all supported step types
 * @see {@link useProcessStep} - Higher-level hook that uses this internally
 * @see {@link Step} - The step object structure
 */
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
				result = await signMessage(step as SignatureStep);
				break;
			case StepType.signEIP712:
				result = await signMessage(step as SignatureStep);
				break;
			case StepType.buy:
			case StepType.sell:
			case StepType.tokenApproval:
			case StepType.createListing:
			case StepType.createOffer:
			case StepType.cancel:
				result = await sendTransaction(chainId, step as TransactionStep);
				break;
			case StepType.unknown:
				throw new Error('Unknown step type');
			default: {
				const _exhaustiveCheck: never = step.id;
				console.error(_exhaustiveCheck);
			}
		}

		return result;
	};

	return {
		executeStep,
	};
};
