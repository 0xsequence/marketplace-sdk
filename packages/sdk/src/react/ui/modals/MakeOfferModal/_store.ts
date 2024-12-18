import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { Currency, OrderbookKind, Price } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type MakeOfferModalState = BaseModalState & {
	orderbookKind: OrderbookKind;
	collectibleId: string;
	offerPrice: Price;
	offerPriceChanged: boolean;
	quantity: string;
	expiry: Date;
	invalidQuantity: boolean;
};

const initialState: MakeOfferModalState & {
	open: (args: {
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		orderbookKind: OrderbookKind;
		callbacks?: ModalCallbacks;
	}) => void;
	close: () => void;
} = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	collectibleId: '',
	orderbookKind: OrderbookKind.reservoir,
	callbacks: undefined,
	offerPrice: {
		amountRaw: '1',
		currency: {} as Currency,
	},
	// to track if the user has changed the price, so we know if it's 1 default or user input
	offerPriceChanged: false,
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),

	open: (args) => {
		makeOfferModal$.collectionAddress.set(args.collectionAddress);
		makeOfferModal$.chainId.set(args.chainId);
		makeOfferModal$.collectibleId.set(args.collectibleId);
		makeOfferModal$.orderbookKind.set(args.orderbookKind);
		makeOfferModal$.callbacks.set(args.callbacks);
		makeOfferModal$.isOpen.set(true);
	},

	close: () => {
		makeOfferModal$.isOpen.set(false);
		makeOfferModal$.callbacks.set(undefined);
	},
};

export const makeOfferModal$ = observable(initialState);
