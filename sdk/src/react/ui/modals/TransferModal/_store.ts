import { createStore } from '@xstate/store';
import type { Hex } from 'viem';
import type { ShowTransferModalArgs } from '.';
import type { CollectionType } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

export type TransferModalView =
	| 'enterReceiverAddress'
	| 'followWalletInstructions'
	| undefined;

export interface TransferModalState {
	isOpen: boolean;
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

export const transferModal$ = createStore<TransferModalState>(initialState, {
	open: (context, event: ShowTransferModalArgs) => ({
		...context,
		isOpen: true,
		state: {
			...context.state,
			chainId: event.chainId,
			collectionAddress: event.collectionAddress,
			collectibleId: event.collectibleId,
			callbacks: event.callbacks,
		},
	}),
	close: () => ({
		...initialState,
	}),
	setReceiverAddress: (context, event: { address: string }) => ({
		...context,
		state: {
			...context.state,
			receiverAddress: event.address,
		},
	}),
	setQuantity: (context, event: { quantity: string }) => ({
		...context,
		state: {
			...context.state,
			quantity: event.quantity,
		},
	}),
	setTransferIsBeingProcessed: (context, event: { isProcessing: boolean }) => ({
		...context,
		state: {
			...context.state,
			transferIsBeingProcessed: event.isProcessing,
		},
	}),
	setView: (context, event: { view: TransferModalView }) => ({
		...context,
		view: event.view,
	}),
	setHash: (context, event: { hash: Hex | undefined }) => ({
		...context,
		hash: event.hash,
	}),
	setCollectionType: (
		context,
		event: { collectionType: CollectionType | undefined },
	) => ({
		...context,
		state: {
			...context.state,
			collectionType: event.collectionType,
		},
	}),
});

export const open = (args: ShowTransferModalArgs) => {
	transferModal$.send({ type: 'open', ...args });
};

export const close = () => {
	transferModal$.send({ type: 'close' });
};
