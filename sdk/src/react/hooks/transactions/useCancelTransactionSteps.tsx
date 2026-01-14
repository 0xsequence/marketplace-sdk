import type { Address } from '@0xsequence/api-client';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { NoWalletConnectedError } from '../../../utils/_internal/error/transaction';
import {
	getQueryClient,
	type MarketplaceKind,
	StepType,
} from '../../_internal';
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
	collectionAddress: Address;
	chainId: number;
	setSteps: React.Dispatch<React.SetStateAction<TransactionStep>>;
	onSuccess?: ({ hash, orderId }: { hash?: string; orderId?: string }) => void;
	onError?: (error: Error) => void;
}

export const useCancelTransactionSteps = ({
	collectionAddress,
	chainId,
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
			console.debug('onError callback not provided:', error);
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
