import { Observable, observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { ShowTransferModalArgs } from '.';
import type { CollectionType } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

export interface TransferModalState {
	isOpen: boolean;
	open: (args: ShowTransferModalArgs) => void;
	close: () => void;
	state: {
		chainId: string;
		collectionAddress: Hex;
		collectionType?: CollectionType | undefined;
		collectibleId: string;
		quantity: string;
		receiverAddress: string;
		callbacks?: ModalCallbacks;
	};
	view: 'enterReceiverAddress' | 'followWalletInstructions' | undefined;
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
		transferModal$.state.set({
			...initialState.state,
		});
		transferModal$.view.set('enterReceiverAddress');
		transferModal$.hash.set(undefined);
	},
	state: {
		receiverAddress: '',
		collectionAddress: '0x',
		chainId: '',
		collectibleId: '',
		quantity: '1',
	},
	view: 'enterReceiverAddress',
	hash: undefined,
};

export const transferModal$: Observable<TransferModalState> = observable(initialState);
