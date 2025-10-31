import { useAccount } from 'wagmi';
import {
	useCollectionDetail,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
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

	const { walletKind } = useConnectorMetadata();

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

	const steps = [];

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
		collectionQuery.error ||
		currencyQuery.error
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
