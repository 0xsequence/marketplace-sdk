import { useWaasFeeOptions } from '@0xsequence/connect';
import { is, se } from 'date-fns/locale';
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

	const steps = [];

	// Step 1: WaaS fee selection if needed, TODO: this need to be refactored to be headless and we need to take care of fees from both transactions
	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;
		steps.push({
			id: 'waasFee' as const,
			label: 'Select Fee',
			status: feeSelected ? 'success' : 'idle',
			isPending: feeSelected,
			isSuccess: feeSelected,
			isError: false,
			run: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
		});
	}

	// Step 2: Approve (if needed)
	if (sellSteps.data?.approveStep && !approve.isSuccess) {
		steps.push({
			id: 'approve' as const,
			label: 'Approve Token',
			status: approve.status,
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isError: !!approve.error,
			run: () => approve.mutate(),
		});
	}

	// Step 3: Sell
	// TODO: sell step never completes here, it completes via the success callback
	steps.push({
		id: 'sell' as const,
		label: 'Accept Offer',
		status: sell.status,
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isError: !!sell.error,
		run: () => sell.mutate(),
	});

	const nextStep = steps.find((step) => step.status === 'idle');

	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(approve.error || sell.error || sellSteps.error);
	const flowStatus = isPending ? 'pending' : hasError ? 'error' : 'success';

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
