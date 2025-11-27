import { useWaasFeeOptions } from '@0xsequence/connect';
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
	TransactionStep,
} from '../../_internal/types/steps';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-generate-sell-transaction';

/**
 * SellModal step configuration
 * Uses named properties for better DX and type safety
 */
export type SellModalSteps = {
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

	const steps: SellModalSteps = {} as SellModalSteps;

	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;

		steps.fee = {
			label: 'Select Fee',
			status: feeSelected ? 'complete' : waas.isVisible ? 'selecting' : 'idle',
			isSponsored,
			isSelecting: waas.isVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
			cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		};
	}

	if (sellSteps.data?.approveStep) {
		const approvalGuard = createApprovalGuard({
			isFormValid: true,
			txReady: !!sellSteps.data?.approveStep,
			walletConnected: !!address,
		});
		const guardResult = approvalGuard();

		const approveTransactionHash =
			approve.data &&
			'type' in approve.data &&
			approve.data.type === 'transaction'
				? approve.data.hash
				: undefined;

		steps.approval = {
			label: 'Approve Token',
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
			result: approveTransactionHash
				? { type: 'transaction', hash: approveTransactionHash }
				: null,
			execute: async () => approve.mutate(),
			reset: () => {},
		};
	}

	const sellGuard = createFinalTransactionGuard({
		isFormValid: true,
		txReady: !!sellSteps.data?.sellStep,
		walletConnected: !!address,
		requiresApproval: !!sellSteps.data?.approveStep,
		approvalComplete: approve.isSuccess || !sellSteps.data?.approveStep,
	});
	const sellGuardResult = sellGuard();

	const sellTransactionHash =
		sell.data && 'type' in sell.data && sell.data.type === 'transaction'
			? sell.data.hash
			: undefined;

	steps.sell = {
		label: 'Accept Offer',
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
		result: sellTransactionHash
			? { type: 'transaction', hash: sellTransactionHash }
			: null,
		execute: async () => sell.mutate(),
	};

	const flow = computeFlowState(steps);

	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error;

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
