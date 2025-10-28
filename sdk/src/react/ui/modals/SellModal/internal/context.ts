import { useWaasFeeOptions } from '@0xsequence/connect';
import { useAccount } from 'wagmi';
import type { Order } from '../../../../_internal';
import {
	useCollection,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-genrate-sell-transaction';

const getStepStatus = (
	isComplete: boolean,
	isPending: boolean,
	hasError: boolean,
) => {
	if (hasError) return 'error' as const;
	if (isPending) return 'pending' as const;
	if (isComplete) return 'success' as const;
	return 'idle' as const;
};

export function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();

	const collection = useCollection({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});
	const currency = useCurrency({
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

	const stepDefs = {
		fee: {
			//TODO: this step needs to be refactored
			id: 'waasFee' as const,
			label: 'Select Fee',
			include: () => isWaaS,
			isComplete: () => isSponsored || !!waas.selectedFeeOption,
			run: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
			pending: () => false,
		},
		approve: {
			id: 'approve' as const,
			label: 'Approve Token',
			include: () => !!sellSteps.data?.approveStep,
			isComplete: () => approve.isSuccess || !!sellSteps.data?.approveStep,
			state: () => approve.state,
			run: () => approve.mutate(),
			pending: () => approve.isPending,
		},
		sell: {
			id: 'sell' as const,
			label: 'Accept Offer',
			include: () => true,
			isComplete: () => false, // TODO: completes on success handler (this needs to be refactored)
			run: () => sell.mutate(),
			pending: () => sell.isPending,
		},
	};

	const internalSteps = Object.values(stepDefs).filter(
		(step) => step.include() && !step.isComplete(),
	);

	const steps = internalSteps.map((step) => {
		const isComplete = step.isComplete();
		const isPending = step.pending();
		const stepError = false; // Could track per-step errors if needed

		return {
			id: step.id,
			label: step.label,
			status: getStepStatus(isComplete, isPending, stepError),
			isPending,
			isSuccess: isComplete,
			isError: stepError,
			run: step.run,
		};
	});

	const nextStep = steps.find((step) => step.status === 'idle');

	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(approve.error || sell.error || sellSteps.error);
	const allComplete = steps.every((s) => s.isSuccess);
	const flowStatus = getStepStatus(allComplete, isPending, hasError);

	const totalSteps = steps.length;
	const completedSteps = steps.filter((s) => s.isSuccess).length;

	const feeSelection = waas.isVisible
		? {
				isSponsored,
				isSelecting: waas.isVisible,
				selectedOption: waas.selectedFeeOption,
				balance:
					waas.selectedFeeOption && 'balanceFormatted' in waas.selectedFeeOption
						? { formattedValue: waas.selectedFeeOption.balanceFormatted }
						: undefined,
				cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
			}
		: undefined;

	const error = approve.error || sell.error || sellSteps.error;

	return {
		isOpen: state.isOpen,
		close: state.closeModal,

		item: {
			tokenId: state.tokenId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			collection: collection.data,
		},
		offer: {
			order: state.order as Order,
			currency: currency.data,
			priceAmount: state.order.priceAmount,
		},

		flow: {
			steps,
			nextStep,
			status: flowStatus,
			isPending,
			totalSteps,
			completedSteps,
		},

		feeSelection,
		error,
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
