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

	// Placeholder return for next commit
	return {} as any;
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
