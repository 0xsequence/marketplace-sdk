import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
	useCollectibleMetadata,
	useCollectionMetadata,
	useConfig,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import { useSelectWaasFeeOptionsStore } from '../../_internal/components/selectWaasFeeOptions/store';
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

export type SellModalSteps = {
	fee?: FeeStep;
	approval?: ApprovalStep;
	sell: TransactionStep;
};

export function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();
	const config = useConfig();

	const collectibleQuery = useCollectibleMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
	});

	const collectionQuery = useCollectionMetadata({
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

	const transactionData = useGenerateSellTransaction({
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

	const { approve, sell } = useSellMutations(transactionData.data);

	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } =
		useWaasFeeOptions(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;

	useEffect(() => {
		if (
			!isSponsored &&
			!waas.isVisible &&
			!!pendingFeeOptionConfirmation?.options
		) {
			waas.show();
		}
	}, [
		pendingFeeOptionConfirmation?.options,
		isSponsored,
		waas.isVisible,
		waas,
	]);

	const steps: SellModalSteps = {} as SellModalSteps;

	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;

		steps.fee = {
			label: 'Select Fee',
			status: feeSelected ? 'success' : waas.isVisible ? 'selecting' : 'idle',
			isSponsored,
			isSelecting: waas.isVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => waas.show(),
			cancel: () => waas.hide(),
		};
	}

	const approveResult =
		approve.data &&
		'type' in approve.data &&
		approve.data.type === 'transaction'
			? { type: 'transaction' as const, hash: approve.data.hash }
			: null;

	if (transactionData.data?.approveStep) {
		const approvalGuard = createApprovalGuard({
			isFormValid: true,
			txReady: !!transactionData.data?.approveStep,
			walletConnected: !!address,
		});
		const guardResult = approvalGuard();

		steps.approval = {
			label: 'Approve',
			status: approve.isSuccess
				? 'success'
				: approve.isPending
					? 'pending'
					: approve.error
						? 'error'
						: 'idle',
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isDisabled: !guardResult.canProceed,
			disabledReason: guardResult.error?.message || null,
			error: approve.error,
			canExecute: guardResult.canProceed,
			result: approveResult,
			execute: async () => {
				await approve.mutateAsync();
			},
			reset: () => approve.reset(),
		};
	}

	const sellGuard = createFinalTransactionGuard({
		isFormValid: true,
		txReady: !!transactionData.data?.sellStep,
		walletConnected: !!address,
		requiresApproval: !!transactionData.data?.approveStep && !approve.isSuccess,
		approvalComplete: approve.isSuccess || !transactionData.data?.approveStep,
	});
	const sellGuardResult = sellGuard();

	const sellResult =
		sell.data && 'type' in sell.data
			? sell.data.type === 'transaction'
				? { type: 'transaction' as const, hash: sell.data.hash }
				: sell.data.type === 'signature'
					? sell.data.orderId
						? { type: 'signature' as const, orderId: sell.data.orderId }
						: null
					: null
			: null;

	steps.sell = {
		label: 'Accept Offer',
		status: sell.isSuccess
			? 'success'
			: sell.isPending
				? 'pending'
				: sell.error
					? 'error'
					: 'idle',
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isDisabled: !sellGuardResult.canProceed,
		disabledReason: sellGuardResult.error?.message || null,
		error: sell.error,
		canExecute: sellGuardResult.canProceed,
		result: sellResult,
		execute: async () => {
			await sell.mutateAsync();
		},
	};

	const flow = computeFlowState(steps);
	const error =
		transactionData.error ||
		collectibleQuery.error ||
		collectionQuery.error ||
		currencyQuery.error;

	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) {
			rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		}
		waas.hide();
		state.closeModal();
	};

	return {
		isOpen: state.isOpen,
		close: handleClose,
		item: {
			tokenId: state.tokenId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
		},
		collection: collectionQuery.data,
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount,
		},

		steps,
		flow,

		loading: {
			collectible: collectibleQuery.isLoading,
			collection: collectionQuery.isLoading,
			currency: currencyQuery.isLoading,
			steps: transactionData.isLoading,
		},

		transactions: {
			approve:
				approveResult?.type === 'transaction' ? approveResult.hash : undefined,
			sell: sellResult?.type === 'transaction' ? sellResult.hash : undefined,
		},

		error,
		queries: {
			collectible: collectibleQuery,
			collection: collectionQuery,
			currency: currencyQuery,
		},

		get actions() {
			const needsApproval =
				this.steps.approval && this.steps.approval.status !== 'success';

			return {
				approve: needsApproval
					? {
							label: this.steps.approval?.label,
							onClick: this.steps.approval?.execute || (() => {}),
							loading: this.steps.approval?.isPending,
							disabled: this.steps.approval?.isDisabled,
							testid: 'sell-modal-approve-button',
						}
					: undefined,
				sell: {
					label: this.steps.sell.label,
					onClick: this.steps.sell.execute,
					loading: this.steps.sell.isPending,
					disabled: this.steps.sell.isDisabled,
					testid: 'sell-modal-accept-button',
				},
			};
		},
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
