import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type {  Hex } from 'viem';
import type { Currency } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type CreateListingModalState = BaseModalState & {
	collectibleId: string;
	listingPrice: {
		amountRaw: string;
		currency: Currency;
	};
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
	listingPrice: {
		amountRaw: '0',
		currency: {} as Currency,
	},
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
} as const;

const state: CreateListingModalState & {
	open: (args: {
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		callbacks?: ModalCallbacks;
	}) => void;
	close: () => void;
} = {
	...structuredClone(initialState),
	open: (args) => {
		createListingModal$.collectionAddress.set(args.collectionAddress);
		createListingModal$.chainId.set(args.chainId);
		createListingModal$.collectibleId.set(args.collectibleId);
		createListingModal$.callbacks.set(args.callbacks);
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		(Object.keys(initialState) as Array<keyof typeof initialState>).forEach((key) => {
			// @ts-expect-error
			createListingModal$[key].set(initialState[key]);
		});
	},
} as const;

export const createListingModal$ = observable(state);
