import type { Hex } from 'viem';
import { WalletInstanceNotFoundError } from '../../../utils/_internal/error/transaction';
import {
	ExecuteType,
	getMarketplaceClient,
	getQueryClient,
	type MarketplaceKind,
	type Step,
	StepType,
} from '../../_internal';
import type {
	SignatureStep,
	TransactionStep as walletTransactionStep,
} from '../../_internal/utils';
import { useWallet } from '../../_internal/wallet/useWallet';
import type { ModalCallbacks } from '../../ui/modals/_internal/types';
import { useConfig } from '../config/useConfig';
import {
	invalidateQueriesOnCancel,
	updateQueriesOnCancel,
} from '../util/optimisticCancelUpdates';
import { useEnsureChain } from '../utils/useEnsureChain';
import type { TransactionStep } from './useCancelOrder';
import { useGenerateCancelTransaction } from './useGenerateCancelTransaction';

interface UseCancelTransactionStepsArgs {
	collectionAddress: string;
	chainId: number;
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
	const { wallet, isLoading, isError } = useWallet();
	const { ensureChainAsync } = useEnsureChain();
	const walletIsInitialized = wallet && !isLoading && !isError;
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(sdkConfig);
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({
		chainId,
	});

	const getCancelSteps = async ({
		orderId,
		marketplace,
	}: {
		orderId: string;
		marketplace: MarketplaceKind;
	}) => {
		try {
			const address = await wallet?.address();

			if (!address) {
				throw new Error('Wallet address not found');
			}

			const steps = await generateCancelTransactionAsync({
				chainId,
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
			await ensureChainAsync(Number(chainId));

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

						updateQueriesOnCancel({
							orderId,
							queryClient,
						});
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

					updateQueriesOnCancel({
						orderId: reservoirOrderId,
						queryClient,
					});
				}

				setSteps((prev) => ({
					...prev,
					isExecuting: false,
				}));
			}
		} catch (error) {
			invalidateQueriesOnCancel({
				queryClient,
			});

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
			chainId: String(chainId),
			signature: signature as string,
			method: signatureStep.post?.method as string,
			endpoint: signatureStep.post?.endpoint as string,
			body: signatureStep.post?.body,
			executeType: ExecuteType.order,
		});

		return result.orderId;
	};

	return {
		cancelOrder,
	};
};
