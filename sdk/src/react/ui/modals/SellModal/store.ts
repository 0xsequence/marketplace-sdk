import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';
import type { Order } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

export type OpenSellModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: string;
	order: Order;
	callbacks?: ModalCallbacks;
};

type SellModalState = OpenSellModalArgs & { isOpen: boolean };

const initialContext: SellModalState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	tokenId: '',
	order: null as unknown as Order,
	callbacks: undefined,
};

export const sellModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (context, event: OpenSellModalArgs) => ({
			...context,
			isOpen: true,
			...event,
		}),
		close: () => ({ ...initialContext }),
	},
});

// Public hook for opening/closing modal
export const useSellModal = () => {
	const state = useSelector(sellModalStore, (state) => state.context);

	return {
		...state,
		show: (args: OpenSellModalArgs) =>
			sellModalStore.send({ type: 'open', ...args }),
		close: () => sellModalStore.send({ type: 'close' }),
	};
};

// Internal hook for accessing store state
export const useSellModalState = () => {
	const { isOpen, tokenId, collectionAddress, chainId, order, callbacks } =
		useSelector(sellModalStore, (state) => state.context);

	const closeModal = () => sellModalStore.send({ type: 'close' });
	const currencyAddress = order?.priceCurrencyAddress as Address | undefined;

	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		order,
		callbacks,
		closeModal,
		currencyAddress,
	};
};
