import {
	ExecuteType,
	getMarketplaceClient,
	MarketplaceKind,
	Step,
	StepType,
} from '../_internal';
import { useWallet } from '../_internal/transaction-machine/useWallet';
import { ModalCallbacks } from '../ui/modals/_internal/types';
import { useConfig } from './useConfig';
import { useGenerateCancelTransaction } from './useGenerateCancelTransaction';
import { TransactionStep } from './useCancelOrder';
import { SignatureStep } from '../_internal/transaction-machine/utils';
import { useGetReceiptFromHash } from './useGetReceiptFromHash';
import { Hex } from 'viem';
import { useSwitchChainModal } from '../ui/modals/_internal/components/switchChainModal';
import { ChainSwitchUserRejectedError } from '../../utils/_internal/error/transaction';

interface UseCancelTransactionStepsArgs {
	collectionAddress: string;
	chainId: string;
	callbacks?: ModalCallbacks;
	setSteps: React.Dispatch<React.SetStateAction<TransactionStep>>;
	onSuccess?: ({ hash, orderId }: { hash?: string; orderId?: string }) => void;
	onError?: (error: Error) => void;
}

export const useCancelTransactionSteps = ({
	collectionAddress,
	chainId,
	callbacks,
	setSteps,
	onSuccess,
	onError,
}: UseCancelTransactionStepsArgs) => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { wallet } = useWallet();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const { waitForReceipt } = useGetReceiptFromHash();
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({
		chainId,
		onSuccess: (steps) => {
			if (!steps) return;
		},
	});

	const getWalletChainId = async () => {
		return await wallet?.getChainId();
	};
	const switchChain = async () => {
		if (!wallet) return;

		await wallet.switchChain(Number(chainId));
	};
	const checkAndSwitchChain = async () => {
		const walletChainId = await getWalletChainId();
		const isWaaS = wallet?.isWaaS;
		const chainIdMismatch = walletChainId !== Number(chainId);

		return new Promise((resolve, reject) => {
			if (chainIdMismatch) {
				if (isWaaS) {
					switchChain().then(resolve).catch(reject);
				} else {
					showSwitchChainModal({
						chainIdToSwitchTo: chainId,
						onSuccess: () => resolve({ chainId: chainId }),
						onError: (error) => reject(error),
						onClose: () => reject(new ChainSwitchUserRejectedError()),
					});
				}
			} else {
				resolve({ chainId: chainId });
			}
		});
	};

	const getCancelSteps = async ({
		orderId,
		marketplace,
	}: {
		orderId: string;
		marketplace: MarketplaceKind;
	}) => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateCancelTransactionAsync({
				collectionAddress,
				maker: address,
				marketplace,
				orderId,
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
			throw error;
		}
	};

	const cancelOrder = async ({
		orderId,
		marketplace,
	}: {
		orderId: string;
		marketplace: MarketplaceKind;
	}) => {
		if (!wallet) return;

		try {
			await checkAndSwitchChain();

			setSteps((prev) => ({
				...prev,
				isExecuting: true,
			}));

			const cancelSteps = await getCancelSteps({
				orderId,
				marketplace,
			});
			const transactionStep = cancelSteps?.find(
				(step) => step.id === StepType.cancel,
			);
			const signatureStep = cancelSteps?.find(
				(step) => step.id === StepType.signEIP712,
			);

			console.debug('transactionStep', transactionStep);
			console.debug('signatureStep', signatureStep);

			if (!transactionStep && !signatureStep) {
				throw new Error('No transaction or signature step found');
			}

			let hash: Hex | undefined, reservoirOrderId: string | undefined;

			if (transactionStep && wallet) {
				hash = await executeTransaction({ transactionStep });

				if (hash) {
					await waitForReceipt(hash);

					if (onSuccess && typeof onSuccess === 'function') {
						onSuccess({ hash });
					}

					setSteps((prev) => ({
						...prev,
						isExecuting: false,
					}));
				}
			}

			if (signatureStep) {
				reservoirOrderId = await executeSignature({ signatureStep });

				if (onSuccess && typeof onSuccess === 'function') {
					onSuccess({ orderId: reservoirOrderId });
				}

				setSteps((prev) => ({
					...prev,
					isExecuting: false,
				}));
			}
		} catch (error) {
			setSteps((prev) => ({
				...prev,
				isExecuting: false,
			}));

			if (onError && typeof onError === 'function') {
				onError(error as Error);
			}

			throw error;
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: {
		transactionStep: Step;
	}): Promise<Hex | undefined> => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as any,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: {
		signatureStep: Step;
	}) => {
		if (!wallet) return;

		const signature = await wallet.handleSignMessageStep(
			signatureStep as SignatureStep,
		);

		const result = await marketplaceClient.execute({
			signature: signature as string,
			executeType: ExecuteType.order,
			body: signatureStep.post?.body,
		});

		return result.orderId;
	};

	return {
		cancelOrder,
	};
};
