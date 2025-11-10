import { useWaasFeeOptions } from '@0xsequence/connect';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import {
	useCollectionDetail,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import {
	computeFlowState,
	executeNextStep,
} from '../../_internal/helpers/flow-state';
import {
	createApprovalGuard,
	createFinalTransactionGuard,
} from '../../_internal/helpers/step-guards';
import type {
	ApprovalStep,
	FeeStep,
	ModalSteps,
	TransactionStep,
} from '../../_internal/types/steps';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-generate-sell-transaction';

/**
 * SellModal steps type
 * Uses the common ModalSteps pattern with 'sell' as the final step
 */
export type SellSteps = ModalSteps<'sell'>;

export function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();

	const collectionQuery = useCollectionDetail({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});
	const currencyQuery = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});

	const { walletKind, isWaaS } = useConnectorMetadata();

	const sellSteps = useGenerateSellTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		seller: address,
		marketplace: state.order?.marketplace,
		walletType: walletKind,
		ordersData: state.order
			? [
					{
						orderId: state.order.orderId,
						quantity: state.order.quantityRemaining,
						tokenId: state.tokenId,
					},
				]
			: undefined,
	});

	const { approve, sell } = useSellMutations(sellSteps.data);

	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;

	// ============================================
	// STEP GUARDS
	// ============================================

	const approveGuard = useMemo(() => {
		return createApprovalGuard({
			isFormValid: true, // No form validation for sell modal
			txReady: !!sellSteps.data?.approveStep,
			walletConnected: !!address,
		});
	}, [sellSteps.data?.approveStep, address]);

	const sellGuard = useMemo(() => {
		return createFinalTransactionGuard({
			isFormValid: true, // No form validation for sell modal
			txReady: !!sellSteps.data?.sellStep,
			walletConnected: !!address,
			requiresApproval: !!sellSteps.data?.approveStep && !approve.isSuccess,
			approvalComplete: approve.isSuccess,
		});
	}, [
		sellSteps.data?.sellStep,
		sellSteps.data?.approveStep,
		address,
		approve.isSuccess,
	]);

	// ============================================
	// STEPS (using common types)
	// ============================================

	// Fee step (WaaS only)
	const feeStep: FeeStep | undefined = useMemo(() => {
		if (!isWaaS) return undefined;

		return {
			status: waas.isVisible ? 'selecting' : 'complete',
			isSponsored,
			isSelecting: waas.isVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
			cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		};
	}, [isWaaS, waas.isVisible, isSponsored, waas.selectedFeeOption]);

	// Approval step (conditional)
	const approvalStep: ApprovalStep | undefined = useMemo(() => {
		if (!sellSteps.data?.approveStep) return undefined;

		const guard = approveGuard();

		return {
			status: approve.isSuccess
				? 'complete'
				: approve.isPending
					? 'pending'
					: approve.error
						? 'error'
						: 'idle',
			canExecute: guard.canProceed,
			isPending: approve.isPending,
			isComplete: approve.isSuccess,
			isDisabled: !guard.canProceed,
			disabledReason: guard.reason || null,
			error: approve.error,
			result:
				approve.data?.type === 'transaction'
					? { type: 'transaction', hash: approve.data.hash }
					: null,
			execute: async () => {
				const result = approveGuard();
				if (!result.canProceed) {
					throw new Error(result.reason);
				}
				await approve.mutateAsync();
			},
			reset: () => approve.reset(),
		};
	}, [
		sellSteps.data?.approveStep,
		approve.isSuccess,
		approve.isPending,
		approve.error,
		approve.data,
		approveGuard,
		approve,
	]);

	// Sell step (always present)
	const sellStep: TransactionStep = useMemo(() => {
		const guard = sellGuard();

		return {
			status: sell.isSuccess
				? 'complete'
				: sell.isPending
					? 'pending'
					: sell.error
						? 'error'
						: 'idle',
			canExecute: guard.canProceed,
			isPending: sell.isPending,
			isComplete: sell.isSuccess,
			isDisabled: !guard.canProceed,
			disabledReason: guard.reason || null,
			error: sell.error,
			result:
				sell.data?.type === 'transaction'
					? { type: 'transaction', hash: sell.data.hash }
					: null,
			execute: async () => {
				const result = sellGuard();
				if (!result.canProceed) {
					throw new Error(result.reason);
				}
				await sell.mutateAsync();
			},
		};
	}, [sell.isSuccess, sell.isPending, sell.error, sell.data, sellGuard, sell]);

	// Build steps object
	const steps: SellSteps = {
		...(feeStep ? { fee: feeStep } : {}),
		...(approvalStep ? { approval: approvalStep } : {}),
		sell: sellStep,
	};

	// Compute flow state
	const flow = computeFlowState(steps as unknown as ModalSteps);

	// Error aggregation
	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error;

	// Execute next step helper
	const executeNext = async () => {
		return executeNextStep(steps as unknown as ModalSteps);
	};

	return {
		isOpen: state.isOpen,
		close: state.closeModal,

		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collection: collectionQuery.data,
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount,
		},

		// Flow state and steps
		steps,
		flow,
		executeNext,

		// Loading states
		isLoading:
			collectionQuery.isLoading ||
			currencyQuery.isLoading ||
			sellSteps.isLoading,
		error,

		// Queries for advanced usage
		queries: {
			collection: collectionQuery,
			currency: currencyQuery,
		},
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
