import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hash, Hex } from 'viem';
import { OrderbookKind, type Currency } from '../../../../types';
import type { ModalCallbacks } from '../_internal/types';

const initialState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: '',
	collectionType: undefined,
	listingPrice: {
		amountRaw: '0',
		currency: {} as Currency,
	},
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	callbacks: undefined as ModalCallbacks | undefined,

	onError: undefined as undefined | ((error: Error) => void),
	onSuccess: undefined as undefined | ((hash: Hash) => void),

	open: (args: {
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		orderbookKind: OrderbookKind;
		callbacks?: ModalCallbacks;
		defaultCallbacks?: ModalCallbacks;
		onSuccess?: (hash?: Hash) => void;
		onError?: (error: Error) => void;
	}) => {
		createListingModal$.collectionAddress.set(args.collectionAddress);
		createListingModal$.chainId.set(args.chainId);
		createListingModal$.collectibleId.set(args.collectibleId);
		createListingModal$.orderbookKind.set(args.orderbookKind);
		createListingModal$.callbacks.set(args.callbacks || args.defaultCallbacks);
		createListingModal$.onSuccess.set(args.onSuccess);
		createListingModal$.onError.set(args.onError);
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
		createListingModal$.callbacks.set(undefined);
	},
};

export const createListingModal$ = observable(initialState);
