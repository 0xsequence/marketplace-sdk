import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';
import type { Order } from '../../../../_internal';
import { useMarketplaceConfig } from '../../../hooks';

export type OpenSellModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
	order: Order;
};

type SellModalState = Omit<OpenSellModalArgs, 'order'> & {
	isOpen: boolean;
	order: Order | null;
};

const initialContext: SellModalState = {
	isOpen: false,
	collectionAddress: '0x0000000000000000000000000000000000000000',
	chainId: 0,
	tokenId: 0n,
	order: null,
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
	const { isOpen, tokenId, collectionAddress, chainId, order } = useSelector(
		sellModalStore,
		(state) => state.context,
	);

	const { data: marketplaceConfig } = useMarketplaceConfig();
	const orderbookKind = marketplaceConfig?.market.collections.find(
		(collection) => collection.itemsAddress === collectionAddress,
	)?.destinationMarketplace;

	const closeModal = () => sellModalStore.send({ type: 'close' });
	const currencyAddress = order?.priceCurrencyAddress;

	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		order,
		orderbookKind,
		closeModal,
		currencyAddress,
	};
};
