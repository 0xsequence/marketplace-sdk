import { observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { CollectionType } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import type { ShowTransferModalArgs } from '.';

export type TransferModalView =
	| 'enterReceiverAddress'
	| 'followWalletInstructions'
	| undefined;

export interface TransferModalState {
	isOpen: boolean;
	open: (args: ShowTransferModalArgs) => void;
	close: () => void;
	state: {
		chainId: number;
		collectionAddress: Hex;
		collectionType?: CollectionType | undefined;
		collectibleId: string;
		quantity: string;
		receiverAddress: string;
		callbacks?: ModalCallbacks;
		transferIsBeingProcessed: boolean;
	};
	view: TransferModalView;
	hash: Hex | undefined;
}

export const initialState: TransferModalState = {
	isOpen: false,
	open: ({
		chainId,
		collectionAddress,
		collectibleId,
		callbacks,
	}: ShowTransferModalArgs) => {
		transferModal$.state.set({
			...transferModal$.state.get(),
			chainId,
			collectionAddress,
			collectibleId,
			callbacks,
		});
		transferModal$.isOpen.set(true);
	},
	close: () => {
		transferModal$.isOpen.set(false);
		transferModal$.state.receiverAddress.set('');
		transferModal$.state.transferIsBeingProcessed.set(false);
		transferModal$.view.set('enterReceiverAddress');
		transferModal$.hash.set(undefined);
	},
	state: {
		receiverAddress: '',
		collectionAddress: '0x',
		chainId: 0,
		collectibleId: '',
		quantity: '1',
		transferIsBeingProcessed: false,
	},
	view: 'enterReceiverAddress',
	hash: undefined,
};

export const transferModal$ = observable(initialState);
