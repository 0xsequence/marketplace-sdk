import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';
import { OrderbookKind } from '../../../../../types';
import type { ModalCallbacks } from '../../_internal/types';

export type OpenMakeOfferModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

type MakeOfferModalState = OpenMakeOfferModalArgs & {
	isOpen: boolean;
	priceInput: string;
	currencyAddress?: Address;
	quantityInput: string;
	expiryDays: number;
};

const initialContext: MakeOfferModalState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	tokenId: 0n,
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	priceInput: '',
	currencyAddress: undefined,
	quantityInput: '1',
	expiryDays: 7,
	callbacks: undefined,
};

export const makeOfferModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (_context, event: OpenMakeOfferModalArgs) => ({
			...initialContext,
			isOpen: true,
			...event,
			expiryDays: 7,
			priceInput: '',
			quantityInput: '1',
		}),
		close: () => ({ ...initialContext }),

		updatePrice: (context, event: { value: string }) => ({
			...context,
			priceInput: event.value,
		}),
		selectCurrency: (context, event: { address: Address }) => ({
			...context,
			currencyAddress: event.address,
		}),
		updateQuantity: (context, event: { value: string }) => ({
			...context,
			quantityInput: event.value,
		}),
		updateExpiryDays: (context, event: { days: number }) => ({
			...context,
			expiryDays: event.days,
		}),
	},
});

export const useMakeOfferModal = () => {
	const state = useSelector(makeOfferModalStore, (state) => state.context);

	return {
		...state,
		show: (args: OpenMakeOfferModalArgs) =>
			makeOfferModalStore.send({ type: 'open', ...args }),
		close: () => makeOfferModalStore.send({ type: 'close' }),
	};
};

export const useMakeOfferModalState = () => {
	const {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		orderbookKind,
		callbacks,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
	} = useSelector(makeOfferModalStore, (state) => state.context);

	const closeModal = () => makeOfferModalStore.send({ type: 'close' });
	const updatePriceInput = (value: string) =>
		makeOfferModalStore.send({ type: 'updatePrice', value });
	const updateCurrency = (address: Address) =>
		makeOfferModalStore.send({ type: 'selectCurrency', address });
	const updateQuantityInput = (value: string) =>
		makeOfferModalStore.send({ type: 'updateQuantity', value });
	const updateExpiryDays = (days: number) =>
		makeOfferModalStore.send({ type: 'updateExpiryDays', days });

	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		orderbookKind,
		callbacks,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
		closeModal,
		updatePriceInput,
		updateCurrency,
		updateQuantityInput,
		updateExpiryDays,
	};
};
