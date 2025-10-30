import { useWaasFeeOptions } from '@0xsequence/connect';
import { useAccount } from 'wagmi';
import type { Order } from '../../../../_internal';
import {
	useCollectionDetail,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-generate-sell-transaction';

export type SellStepId = 'waasFee' | 'approve' | 'sell';
export type Step = {
	id: SellStepId;
	label: string;
	status: string;
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	run: () => Promise<void>;
};

export type SellStep = Step & { id: 'sell' };

export type SellSteps = [...Step[], SellStep];

export function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();

	const collection = useCollectionDetail({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});
	const currency = useCurrency({
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
		ordersData: [
			{
				orderId: state.order?.orderId,
				quantity: state.order?.quantityRemaining,
				tokenId: state.tokenId,
			},
		],
		query: {
			enabled: !!state.isOpen,
		},
	});

	const { approve, sell } = useSellMutations(sellSteps.data);

	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;

	const steps = [];

	// Step 1: WaaS fee selection if needed, TODO: this need to be refactored to be headless and we need to take care of fees from both transactions
	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;
		steps.push({
			id: 'waasFee' satisfies SellStepId,
			label: 'Select Fee',
			status: feeSelected ? 'success' : 'idle',
			isPending: false,
			isSuccess: feeSelected,
			isError: false, // TODO: Fee loading errors not accessible from useWaasFeeOptions
			run: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
		});
	}

	// Step 2: Approve (if needed)
	if (sellSteps.data?.approveStep && !approve.isSuccess) {
		steps.push({
			id: 'approve' satisfies SellStepId,
			label: 'Approve Token',
			status: approve.status,
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isError: !!approve.error,
			run: () => approve.mutate(),
		});
	}

	// Step 3: Sell
	// TODO: sell step never completes here, it completes via the success callback, we need to change this
	steps.push({
		id: 'sell' satisfies SellStepId,
		label: 'Accept Offer',
		status: sell.status,
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isError: !!sell.error,
		run: () => sell.mutate(),
	});

	const nextStep = steps.find((step) => step.status === 'idle');

	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collection.error ||
		currency.error
	);

	const totalSteps = steps.length;
	const completedSteps = steps.filter((s) => s.isSuccess).length;
	const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

	const flowStatus: 'idle' | 'pending' | 'success' | 'error' = isPending
		? 'pending'
		: hasError
			? 'error'
			: completedSteps === totalSteps
				? 'success'
				: 'idle';

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

	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collection.error ||
		currency.error;

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
			order: state.order,
			currency: currency.data,
			priceAmount: state.order?.priceAmount,
		},

		flow: {
			steps: steps as SellSteps,
			nextStep,
			status: flowStatus,
			isPending,
			totalSteps,
			completedSteps,
			progress,
		},

		loading: {
			collection: collection.isLoading,
			currency: currency.isLoading,
			steps: sellSteps.isLoading,
		},

		transactions: {
			approve:
				approve.data?.type === 'transaction' ? approve.data.hash : undefined,
			sell: sell.data?.type === 'transaction' ? sell.data.hash : undefined,
		},

		feeSelection,
		error,
		queries: {
			collection,
			currency,
		},
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
