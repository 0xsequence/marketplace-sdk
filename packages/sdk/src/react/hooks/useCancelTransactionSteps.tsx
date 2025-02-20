import {
	ExecuteType,
	getMarketplaceClient,
	getQueryClient,
	type MarketplaceKind,
	type Step,
	StepType,
} from '../_internal';
import { useWallet } from '../_internal/wallet/useWallet';
import type { ModalCallbacks } from '../ui/modals/_internal/types';
import { useConfig } from './useConfig';
import { useGenerateCancelTransaction } from './useGenerateCancelTransaction';
import type {
	SignatureStep,
	TransactionStep,
	TransactionStep as walletTransactionStep,
} from '../_internal/utils';
import type { Hex } from 'viem';
import { useSwitchChainModal } from '../ui/modals/_internal/components/switchChainModal';
import {
	ChainSwitchUserRejectedError,
	WalletInstanceNotFoundError,
} from '../../utils/_internal/error/transaction';

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
	const { wallet, isLoading, isError } = useWallet();
	const walletIsInitialized = wallet && !isLoading && !isError;
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({
		chainId,
	});

	const getWalletChainId = async () => {
		return await wallet?.getChainId();
	};
	const switchChain = async () => {
		await wallet?.switchChain(Number(chainId));
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
		try {
			const address = await wallet?.address();

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
		}
	};

	const cancelOrder = async ({
		orderId,
		marketplace,
	}: {
		orderId: string;
		marketplace: MarketplaceKind;
	}) => {
		const queryClient = getQueryClient();
		if (!walletIsInitialized) {
			throw new WalletInstanceNotFoundError();
		}

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

			let hash: Hex | undefined;
			let reservoirOrderId: string | undefined;

			if (transactionStep && wallet) {
				hash = await executeTransaction({ transactionStep });

				if (hash) {
					await wallet.handleConfirmTransactionStep(hash, Number(chainId));

					if (onSuccess && typeof onSuccess === 'function') {
						onSuccess({ hash });
					}

					queryClient.invalidateQueries();

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

				queryClient.invalidateQueries();

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
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: {
		transactionStep: Step;
	}): Promise<Hex | undefined> => {
		const hash = await wallet?.handleSendTransactionStep(
			Number(chainId),
			transactionStep as walletTransactionStep,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: {
		signatureStep: Step;
	}) => {
		const signature = await wallet?.handleSignMessageStep(
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
