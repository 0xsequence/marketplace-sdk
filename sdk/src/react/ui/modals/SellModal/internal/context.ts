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

export function useSellModal() {
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
			run: () => approve.mutate(),
			pending: () => approve.isPending,
		},
		sell: {
			id: 'sell' as const,
			label: 'Accept Offer',
			include: () => true,
			isComplete: () => false, // completes on success handler
			run: () => sell.mutate(),
			pending: () => sell.isPending,
		},
	};

	const internalSteps = Object.values(stepDefs).filter(
		(step) => step.include() && !step.isComplete,
	);

	const steps = internalSteps.map((step) => ({
		id: step.id,
		label: step.label,
		isComplete: step.isComplete(),
		isPending: step.pending(),
		run: step.run,
	}));

	return {
		isOpen: state.isOpen,
		close: state.closeModal,

		item: {
			tokenId: state.tokenId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			collection,
		},
		offer: {
			order: state.order as Order,
			currency,
			priceAmount: state.order.priceAmount,
		},

		flow: {
			steps,
			nextStep: steps.find((step) => !step.isComplete && !step.isPending),
		},
	};
}
