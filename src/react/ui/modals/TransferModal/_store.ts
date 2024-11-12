import { observable } from '@legendapp/state';
import type { ShowTransferModalArgs } from '.';
import type { Hex } from 'viem';
import type { CollectionType } from '@internal';
import { TransferCollectiblesCallbacks } from '../../../../types/messages';

export interface TransferModalState {
	isOpen: boolean;
	open: (args: ShowTransferModalArgs) => void;
	close: () => void;
	state: {
		chainId: string;
		collectionAddress: Hex;
		collectionType?: CollectionType | undefined;
		tokenId: string;
		quantity: string;
		receiverAddress: string;
		callbacks?: TransferCollectiblesCallbacks;
	};
	view: 'enterReceiverAddress' | 'followWalletInstructions' | undefined;
	hash: Hex | undefined;
}

export const initialState: TransferModalState = {
	isOpen: false,
	open: ({
		chainId,
		collectionAddress,
		tokenId,
		callbacks
	}: ShowTransferModalArgs) => {
		transferModal$.state.set({
			...transferModal$.state.get(),
			chainId,
			collectionAddress,
			tokenId,
			callbacks
		});
		transferModal$.isOpen.set(true);
	},
	close: () => {
		transferModal$.isOpen.set(false);
		transferModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		receiverAddress: '',
		collectionAddress: '0x',
		chainId: '',
		tokenId: '',
		quantity: '1',
	},
	view: 'enterReceiverAddress',
	hash: undefined,
};

export const transferModal$ = observable(initialState);
