import { observable } from '@legendapp/state';
import type { ShowTransferModalArgs } from '.';
import { Hex } from 'viem';
import { Messages } from '../../../../types/messages';
import { CollectionType } from '@internal';

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
		messages?: Messages;
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
		messages,
	}: ShowTransferModalArgs) => {
		transferModal$.state.set({
			...transferModal$.state.get(),
			chainId,
			collectionAddress,
			tokenId,
			messages,
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
