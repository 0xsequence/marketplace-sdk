import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { NoWalletConnectedError } from '../../../utils/_internal/error/transaction';
import {
	getQueryClient,
	type MarketplaceKind,
	StepType,
} from '../../_internal';
import type { ModalCallbacks } from '../../ui/modals/_internal/types';
import { waitForTransactionReceipt } from '../../utils/waitForTransactionReceipt';
import { useConfig } from '../config/useConfig';
import {
	invalidateQueriesOnCancel,
	updateQueriesOnCancel,
} from '../util/optimisticCancelUpdates';
import { useEnsureCorrectChain } from '../utils/useEnsureCorrectChain';
import type { TransactionStep } from './useCancelOrder';
import { useGenerateCancelTransaction } from './useGenerateCancelTransaction';
import { useProcessStep } from './useProcessStep';

interface UseCancelTransactionStepsArgs {
	collectionAddress: string;
	chainId: number;
	callbacks?: ModalCallbacks;
	setSteps: React.Dispatch<React.SetStateAction<TransactionStep>>;
	onSuccess?: ({ hash, orderId }: { hash?: string; orderId?: string }) => void;
	onError?: (error: Error) => void;
}

/**
 * Handles the low-level transaction steps for cancelling marketplace orders
 *
 * This hook manages the detailed flow of generating and executing cancel transactions,
 * including chain switching, transaction/signature generation, and optimistic updates.
 * It's typically used internally by higher-level hooks like `useCancelOrder`.
 *
 * @param params - Configuration for transaction steps
 * @param params.collectionAddress - The NFT collection contract address
 * @param params.chainId - The blockchain network ID
 * @param params.callbacks - Optional modal callbacks for UI feedback
 * @param params.setSteps - State setter for tracking transaction step status
 * @param params.onSuccess - Callback when cancellation succeeds with hash and orderId
 * @param params.onError - Callback when cancellation fails
 *
 * @returns Object containing the cancelOrder function
 * @returns returns.cancelOrder - Async function to execute order cancellation
 *
 * @example
 * Basic usage (typically internal):
 * ```typescript
 * const [steps, setSteps] = useState<TransactionStep>({
 *   exist: false,
 *   isExecuting: false,
 *   execute: () => Promise.resolve()
 * });
 *
 * const { cancelOrder } = useCancelTransactionSteps({
 *   collectionAddress: '0x...',
 *   chainId: 137,
 *   setSteps,
 *   onSuccess: ({ hash, orderId }) => {
 *     console.log(`Order ${orderId} cancelled in tx ${hash}`);
 *   }
 * });
 *
 * await cancelOrder({
 *   orderId: '123',
 *   marketplace: MarketplaceKind.sequence_marketplace_v2
 * });
 * ```
 *
 * @example
 * With error handling:
 * ```typescript
 * const { cancelOrder } = useCancelTransactionSteps({
 *   collectionAddress,
 *   chainId,
 *   setSteps,
 *   onError: (error) => {
 *     if (error.message.includes('No wallet connected')) {
 *       showConnectWalletModal();
 *     } else {
 *       showErrorToast(error.message);
 *     }
 *   }
 * });
 * ```
 *
 * @remarks
 * - Automatically switches to the correct chain if needed
 * - Handles both transaction-based and signature-based cancellations
 * - Performs optimistic query updates for better UX
 * - Invalidates relevant queries after successful cancellation
 * - The `setSteps` callback is used to track execution state
 *
 * @throws {NoWalletConnectedError} When no wallet is connected
 * @throws {Error} When no transaction or signature step is found
 *
 * @see {@link useCancelOrder} - Higher-level hook that uses this internally
 * @see {@link useGenerateCancelTransaction} - Generates the cancel transaction
 * @see {@link useProcessStep} - Processes individual transaction steps
 */
export const useCancelTransactionSteps = ({
	collectionAddress,
	chainId,
	callbacks,
	setSteps,
	onSuccess,
	onError,
}: UseCancelTransactionStepsArgs) => {
	const { address } = useAccount();
	const { ensureCorrectChainAsync } = useEnsureCorrectChain();
	const sdkConfig = useConfig();
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({
		chainId,
	});
	const { processStep } = useProcessStep();

	const getCancelSteps = async ({
		orderId,
		marketplace,
	}: {
		orderId: string;
		marketplace: MarketplaceKind;
	}) => {
		try {
			if (!address) {
				throw new NoWalletConnectedError();
			}

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
		if (!address) {
			throw new NoWalletConnectedError();
		}

		try {
			await ensureCorrectChainAsync(Number(chainId));

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

			if (transactionStep) {
				const result = await processStep(transactionStep, chainId);

				if (result.type === 'transaction') {
					hash = result.hash;

					await waitForTransactionReceipt({
						txHash: hash,
						chainId,
						sdkConfig,
					});

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
				const result = await processStep(signatureStep, chainId);

				if (result.type === 'signature') {
					reservoirOrderId = result.orderId;

					if (
						onSuccess &&
						typeof onSuccess === 'function' &&
						reservoirOrderId
					) {
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

	return {
		cancelOrder,
	};
};
