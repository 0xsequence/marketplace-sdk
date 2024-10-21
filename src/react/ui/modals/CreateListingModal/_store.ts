import { observable } from '@legendapp/state';
import type { Price } from '@types';
import type { ShowCreateListingModalArgs } from '.';

export interface CreateListingModalState {
	isOpen: boolean;
	open: (args: ShowCreateListingModalArgs) => void;
	close: () => void;
	state: {
		collectionName: string;
		listingPrice?: Price;
		collectionAddress: string;
		chainId: string;
		collectibleId: string;
		quantity: string;
		expirationDate?: Date;
	};
}

export const initialState: CreateListingModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		collectibleId,
	}: ShowCreateListingModalArgs) => {
		createListingModal$.state.set({
			...createListingModal$.state.get(),
			collectionAddress,
			chainId,
			collectibleId,
		});
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
		createListingModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		collectionName: '',
		listingPrice: undefined,
		collectionAddress: '',
		chainId: '',
		collectibleId: '',
		quantity: '1',
		expirationDate: undefined,
	},
};

export const createListingModal$ = observable(initialState);
