import { useWaasFeeOptions } from '@0xsequence/connect';
import type { Hex } from 'viem';
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
import { computeFlowState } from '../../_internal/helpers/flow-state';
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
 * Result type from processStep mutation
 */
type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

/**
 * SellModal step configuration
 * Uses named properties for better DX and type safety
 */
export type SellModalSteps = ModalSteps<'sell'> & {
	fee?: FeeStep;
	approval?: ApprovalStep;
	sell: TransactionStep;
};

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
						tokenId: BigInt(state.tokenId),
					},
				]
			: undefined,
	});

	const { approve, sell } = useSellMutations(sellSteps.data);

	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;

	// ============================================
	// BUILD STEPS OBJECT (NAMED PROPERTIES)
	// ============================================

	const steps: SellModalSteps = {} as SellModalSteps;

	// Fee step (WaaS only)
	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;

		steps.fee = {
			status: feeSelected ? 'complete' : waas.isVisible ? 'selecting' : 'idle',
			isSponsored,
			isSelecting: waas.isVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
			cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		};
	}

	// Approval step (if needed)
	if (sellSteps.data?.approveStep && !approve.isSuccess) {
		const approvalGuard = createApprovalGuard({
			isFormValid: true, // No form validation for SellModal
			txReady: !!sellSteps.data?.approveStep,
			walletConnected: !!address,
		});
		const guardResult = approvalGuard();

		const approveData = approve.data as ProcessStepResult | undefined;
		steps.approval = {
			status: approve.isSuccess
				? 'complete'
				: approve.isPending
					? 'pending'
					: approve.error
						? 'error'
						: 'idle',
			isPending: approve.isPending,
			isComplete: approve.isSuccess,
			isDisabled: !guardResult.canProceed,
			disabledReason: guardResult.reason || null,
			error: approve.error,
			canExecute: guardResult.canProceed,
			result:
				approveData && approveData.type === 'transaction'
					? { type: 'transaction' as const, hash: approveData.hash }
					: null,
			execute: async () => approve.mutate(),
			reset: () => {
				// No reset needed for SellModal approval
			},
		};
	}

	// Sell step (always present)
	const sellGuard = createFinalTransactionGuard({
		isFormValid: true, // No form validation for SellModal
		txReady: !!sellSteps.data?.sellStep,
		walletConnected: !!address,
		requiresApproval: !!sellSteps.data?.approveStep,
		approvalComplete: approve.isSuccess || !sellSteps.data?.approveStep,
	});
	const sellGuardResult = sellGuard();

	const sellData = sell.data as ProcessStepResult | undefined;
	steps.sell = {
		status: sell.isSuccess
			? 'complete'
			: sell.isPending
				? 'pending'
				: sell.error
					? 'error'
					: 'idle',
		isPending: sell.isPending,
		isComplete: sell.isSuccess,
		isDisabled: !sellGuardResult.canProceed,
		disabledReason: sellGuardResult.reason || null,
		error: sell.error,
		canExecute: sellGuardResult.canProceed,
		result:
			sellData && sellData.type === 'transaction'
				? { type: 'transaction' as const, hash: sellData.hash }
				: null,
		execute: async () => sell.mutate(),
	};

	// ============================================
	// COMPUTE FLOW STATE
	// ============================================

	const flow = computeFlowState(steps as unknown as ModalSteps);

	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error;

	// ============================================
	// RETURN CONTEXT
	// ============================================

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

		steps,
		flow,

		loading: {
			collection: collectionQuery.isLoading,
			currency: currencyQuery.isLoading,
			steps: sellSteps.isLoading,
		},

		transactions: {
			approve:
				approve.data?.type === 'transaction' ? approve.data.hash : undefined,
			sell: sell.data?.type === 'transaction' ? sell.data.hash : undefined,
		},

		error,
		queries: {
			collection: collectionQuery,
			currency: currencyQuery,
		},
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
