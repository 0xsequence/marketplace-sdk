import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hash, Hex } from 'viem';
import type { Currency } from '../../../../types';

const initialState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	collectibleId: '',
	collectionName: '',
	collectionType: undefined,
	listingPrice: {
		amountRaw: '0',
		currency: {} as Currency,
	},
	quantity: '1',
	expiry: new Date(addDays(new Date(), 7).toJSON()),

	onError: undefined as undefined | ((error: Error) => void),
	onSuccess: undefined as undefined | ((hash: Hash) => void),

	open: (args: {
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		onSuccess?: (hash?: Hash) => void;
		onError?: (error: Error) => void;
	}) => {
		createListingModal$.collectionAddress.set(args.collectionAddress);
		createListingModal$.chainId.set(args.chainId);
		createListingModal$.collectibleId.set(args.collectibleId);
		createListingModal$.onSuccess.set(args.onSuccess);
		createListingModal$.onError.set(args.onError);
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
	},
};

export const createListingModal$ = observable(initialState);
