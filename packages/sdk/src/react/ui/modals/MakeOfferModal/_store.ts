import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import type { Currency, Price } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type MakeOfferModalState = BaseModalState & {
	collectibleId: string;
	offerPrice: Price;
	quantity: string;
	expiry: Date;
	invalidQuantity: boolean;
};


const initialState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	collectibleId: '',
	callbacks: undefined,
	offerPrice: {
		amountRaw: '0',
		currency: {} as Currency,
	},
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
} as const;

const state: MakeOfferModalState & {
	open: (args: {
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		callbacks?: ModalCallbacks;
	}) => void;
	close: () => void;
} = {
	...initialState,
	open: (args) => {
		makeOfferModal$.collectionAddress.set(args.collectionAddress);
		makeOfferModal$.chainId.set(args.chainId);
		makeOfferModal$.collectibleId.set(args.collectibleId);
		makeOfferModal$.callbacks.set(args.callbacks);
		makeOfferModal$.isOpen.set(true);
	},
	close: () => {
		(Object.keys(initialState) as Array<keyof typeof initialState>).forEach((key) => {
			// @ts-expect-error
			makeOfferModal$[key].set(initialState[key]);
		});
	},
} as const;

export const makeOfferModal$ = observable(state);
