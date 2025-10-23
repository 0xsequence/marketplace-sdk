import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { addDays } from 'date-fns/addDays';
import type { Address } from 'viem';
import { type Currency, OrderbookKind } from '../../../../types';
import type { CollectionType } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

export type OpenCreateListingModalArgs = {
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

interface CreateListingState extends BaseModalState {
	collectibleId: string;
	collectionName: string;
	orderbookKind: OrderbookKind | undefined;
	collectionType: CollectionType | undefined;
	listingPrice: {
		amountRaw: string;
		currency: Currency;
	};
	quantity: string;
	invalidQuantity: boolean;
	expiry: Date;
}

const initialListingPrice = {
	amountRaw: '0',
	currency: {} as Currency,
};

const initialContext: CreateListingState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	collectibleId: '',
	collectionName: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionType: undefined,
	listingPrice: { ...initialListingPrice },
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	callbacks: undefined,
};

export const createListingModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			context,
			event: {
				args: OpenCreateListingModalArgs;
			},
		) => ({
			...context,
			isOpen: true,
			collectionAddress: event.args.collectionAddress,
			chainId: event.args.chainId,
			collectibleId: event.args.collectibleId,
			orderbookKind:
				event.args.orderbookKind ?? OrderbookKind.sequence_marketplace_v2,
			callbacks: event.args.callbacks,
		}),

		close: () => ({
			...initialContext,
		}),

		updateListingPrice: (
			context,
			event: {
				price: {
					amountRaw: string;
					currency: Currency;
				};
			},
		) => ({
			...context,
			listingPrice: event.price,
		}),

		updateQuantity: (
			context,
			event: {
				quantity: string;
			},
		) => ({
			...context,
			quantity: event.quantity,
		}),

		setInvalidQuantity: (
			context,
			event: {
				invalid: boolean;
			},
		) => ({
			...context,
			invalidQuantity: event.invalid,
		}),

		updateExpiry: (
			context,
			event: {
				expiry: Date;
			},
		) => ({
			...context,
			expiry: event.expiry,
		}),

		setCollectionType: (
			context,
			event: {
				collectionType: CollectionType;
			},
		) => ({
			...context,
			collectionType: event.collectionType,
		}),

		setCollectionName: (
			context,
			event: {
				collectionName: string;
			},
		) => ({
			...context,
			collectionName: event.collectionName,
		}),
	},
});

export const useIsOpen = () =>
	useSelector(createListingModalStore, (state) => state.context.isOpen);

export const useCreateListingModalState = () => {
	return useSelector(createListingModalStore, (state) => ({
		collectibleId: state.context.collectibleId,
		collectionAddress: state.context.collectionAddress,
		chainId: state.context.chainId,
		collectionName: state.context.collectionName,
		orderbookKind: state.context.orderbookKind,
		collectionType: state.context.collectionType,
		listingPrice: state.context.listingPrice,
		quantity: state.context.quantity,
		invalidQuantity: state.context.invalidQuantity,
		expiry: state.context.expiry,
		callbacks: state.context.callbacks,
	}));
};
