import { useWaasFeeOptions } from '@0xsequence/connect';
import { useAccount } from 'wagmi';
import { useConnectorMetadata, useCurrency } from '../../../../hooks';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-generate-sell-transaction';

export type SellStepId = 'waasFee' | 'approve' | 'sell';

export function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();

	const _collectionQuery = useCollectionDetail({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});
	const currencyQuery = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
	});

	const { walletKind, isWaaS } = useConnectorMetadata();

	const sellSteps = useGenerateSellTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		seller: address,
		marketplace: state.order.marketplace,
		walletType: walletKind,
		ordersData: [
			{
				orderId: state.order.orderId,
				quantity: state.order.quantityRemaining,
				tokenId: state.tokenId,
			},
		],
	});

	const { approve, sell } = useSellMutations(sellSteps.data);

	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;

	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collection.error ||
		currency.error
	);

	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collection.error ||
		currency.error;

	// Build steps object with clear named properties
	const feeStep =
		isWaaS && waas.isVisible
			? {
					status: (waas.selectedFeeOption || isSponsored
						? 'complete'
						: waas.isVisible
							? 'selecting'
							: 'idle') as 'idle' | 'selecting' | 'complete',
					isSponsored,
					isSelecting: waas.isVisible,
					selectedOption: waas.selectedFeeOption,
					cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
				}
			: undefined;

	// Get transaction hashes (typed as ProcessStepResult)
	const approveTxHash =
		approve.data &&
		'type' in approve.data &&
		approve.data.type === 'transaction'
			? approve.data.hash
			: null;

	const sellTxHash =
		sell.data && 'type' in sell.data && sell.data.type === 'transaction'
			? sell.data.hash
			: null;

	const sellOrderId =
		sell.data && 'type' in sell.data && sell.data.type === 'signature'
			? sell.data.orderId
			: null;

	const approveStep =
		sellSteps.data?.approveStep && !approve.isSuccess
			? {
					status: (approve.isSuccess
						? 'complete'
						: approve.isPending
							? 'pending'
							: approve.error
								? 'error'
								: 'idle') as 'idle' | 'pending' | 'complete' | 'error',
					canExecute: !!sellSteps.data?.approveStep,
					isPending: approve.isPending,
					isComplete: approve.isSuccess,
					error: approve.error || null,
					txHash: approveTxHash,
					execute: async () => {
						await approve.mutateAsync();
					},
				}
			: undefined;

	const sellStep = {
		status: (sell.isSuccess
			? 'complete'
			: sell.isPending
				? 'pending'
				: sell.error
					? 'error'
					: 'idle') as 'idle' | 'pending' | 'complete' | 'error',
		canExecute:
			!!sellSteps.data?.sellStep && (!approveStep || approveStep.isComplete),
		isPending: sell.isPending,
		isComplete: sell.isSuccess,
		error: sell.error || null,
		txHash: sellTxHash,
		orderId: sellOrderId,
		execute: async () => {
			await sell.mutateAsync();
		},
	};

	// Determine current and next steps
	let currentStep: 'fee' | 'approve' | 'sell' = 'sell';
	let nextStepValue: 'fee' | 'approve' | 'sell' | null = null;

	if (feeStep && feeStep.status !== 'complete') {
		currentStep = 'fee';
		nextStepValue = 'fee';
	} else if (approveStep && !approveStep.isComplete) {
		currentStep = 'approve';
		nextStepValue = 'approve';
	} else if (!sellStep.isComplete) {
		currentStep = 'sell';
		nextStepValue = 'sell';
	} else {
		currentStep = 'sell';
		nextStepValue = null;
	}

	// Calculate progress
	const totalProgressSteps = (feeStep ? 1 : 0) + (approveStep ? 1 : 0) + 1; // fee? + approve? + sell
	let completedProgressSteps = 0;

	if (feeStep && feeStep.status === 'complete') completedProgressSteps++;
	if (approveStep?.isComplete) completedProgressSteps++;
	if (sellStep.isComplete) completedProgressSteps++;

	const progressPercent = Math.round(
		(completedProgressSteps / totalProgressSteps) * 100,
	);

	// FLAT API
	return {
		// Modal state
		isOpen: state.isOpen,
		close: state.closeModal,

		// Item data
		item: {
			tokenId: state.tokenId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			collection: collection.data,
		},

		// Offer data
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount,
		},

		// Steps (named properties for obvious flow)
		steps: {
			fee: feeStep,
			approve: approveStep,
			sell: sellStep,
		},

		// Global state
		isLoading:
			collection.isLoading || currency.isLoading || sellSteps.isLoading,
		isPending,
		isComplete: sellStep.isComplete,
		currentStep,
		nextStep: nextStepValue,
		progress: progressPercent,
		error,

		// Legacy for backward compatibility with Modal.tsx
		flow: {
			steps: [
				...(feeStep
					? [
							{
								id: 'waasFee' as const,
								label: 'Select Fee',
								status: feeStep.status,
								isPending: false,
								isSuccess: feeStep.status === 'complete',
								isError: false,
								run: () => {
									selectWaasFeeOptionsStore.send({ type: 'show' });
									return Promise.resolve();
								},
							},
						]
					: []),
				...(approveStep
					? [
							{
								id: 'approve' as const,
								label: 'Approve Token',
								status: approveStep.status,
								isPending: approveStep.isPending,
								isSuccess: approveStep.isComplete,
								isError: !!approveStep.error,
								run: approveStep.execute,
							},
						]
					: []),
				{
					id: 'sell' as const,
					label: 'Accept Offer',
					status: sellStep.status,
					isPending: sellStep.isPending,
					isSuccess: sellStep.isComplete,
					isError: !!sellStep.error,
					run: sellStep.execute,
				},
			],
			nextStep: nextStepValue
				? {
						id: nextStepValue,
						label:
							nextStepValue === 'fee'
								? 'Select Fee'
								: nextStepValue === 'approve'
									? 'Approve Token'
									: 'Accept Offer',
						status: 'idle',
						isPending: false,
						isSuccess: false,
						isError: false,
						run: async () => {},
					}
				: undefined,
			status: (isPending
				? 'pending'
				: hasError
					? 'error'
					: sellStep.isComplete
						? 'success'
						: 'idle') as 'idle' | 'pending' | 'success' | 'error',
			isPending,
			totalSteps: totalProgressSteps,
			completedSteps: completedProgressSteps,
			progress: progressPercent,
		},
		loading: {
			collection: collection.isLoading,
			currency: currency.isLoading,
			steps: sellSteps.isLoading,
		},
		transactions: {
			approve: approveStep?.txHash || undefined,
			sell: sellStep.txHash || undefined,
		},
		feeSelection: feeStep?.isSelecting
			? {
					isSponsored,
					isSelecting: feeStep.isSelecting,
					selectedOption: feeStep.selectedOption,
					balance:
						feeStep.selectedOption &&
						'balanceFormatted' in feeStep.selectedOption
							? { formattedValue: feeStep.selectedOption.balanceFormatted }
							: undefined,
					cancel: feeStep.cancel,
				}
			: undefined,
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
