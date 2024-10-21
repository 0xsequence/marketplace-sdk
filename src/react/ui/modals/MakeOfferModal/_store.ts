import { observable } from '@legendapp/state';
import type { Price } from '@types';
import type { ShowMakeOfferModalArgs } from '.';

export interface MakeOfferModalState {
	isOpen: boolean;
	open: (args: ShowMakeOfferModalArgs) => void;
	close: () => void;
	state: {
		collectionName: string;
		offerPrice?: Price;
		quantity: string;
		collectionAddress: string;
		chainId: string;
		collectibleId: string;
	};
}

export const initialState: MakeOfferModalState = {
	isOpen: false,

	open: ({
		collectionAddress,
		chainId,
		collectibleId,
	}: ShowMakeOfferModalArgs) => {
		makeOfferModal$.state.set({
			...makeOfferModal$.state.get(),
			collectionAddress,
			chainId,
			collectibleId,
		});
		makeOfferModal$.isOpen.set(true);
	},

	close: () => {
		makeOfferModal$.isOpen.set(false);
		makeOfferModal$.state.set({
			...initialState.state,
		});
	},

	state: {
		collectionName: '',
		offerPrice: undefined,
		quantity: '1',
		collectionAddress: '',
		chainId: '',
		collectibleId: '',
	},
};

export const makeOfferModal$ = observable(initialState);
