import {
	ApproveTokenMessageCallbacks,
	SellCollectibleMessageCallbacks,
	SwitchNetworkMessageCallbacks,
} from '@internal';
import { observable } from '@legendapp/state';
import type { Order, Price } from '@types';

export interface ReceivedOfferModalState {
	isOpen: boolean;
	open: (args: ReceivedOfferModalState['state']) => void;
	close: () => void;
	state: {
		collectionAddress: string;
		chainId: string;
		tokenId: string;
		order: Order | undefined;
		price: Price | undefined;
		messages?: {
			approveToken?: ApproveTokenMessageCallbacks;
			sellCollectible?: SellCollectibleMessageCallbacks;
			switchNetwork?: SwitchNetworkMessageCallbacks;
		};
	};
}

export const initialState: ReceivedOfferModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		tokenId,
		order,
		price,
		messages,
	}: ReceivedOfferModalState['state']) => {
		receivedOfferModal$.state.set({
			...receivedOfferModal$.state.get(),
			collectionAddress,
			chainId,
			tokenId,
			order,
			price,
			messages,
		});
		receivedOfferModal$.isOpen.set(true);
	},
	close: () => {
		receivedOfferModal$.isOpen.set(false);
		receivedOfferModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		collectionAddress: '',
		chainId: '',
		tokenId: '',
		order: undefined,
		price: undefined,
	},
};

export const receivedOfferModal$ = observable(initialState);
