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

type OpenEvent = ShowTransferModalArgs & { type: 'open' };
type SetReceiverAddressEvent = { type: 'setReceiverAddress'; address: string };
type SetQuantityEvent = { type: 'setQuantity'; quantity: string };
type SetTransferIsBeingProcessedEvent = {
	type: 'setTransferIsBeingProcessed';
	isProcessing: boolean;
};
type SetViewEvent = { type: 'setView'; view: TransferModalView };
type SetHashEvent = { type: 'setHash'; hash: Hex | undefined };
type SetCollectionTypeEvent = {
	type: 'setCollectionType';
	collectionType: CollectionType | undefined;
};

export const transferModal$ = createStore({
	context: initialState,
	on: {
		open: (context, event: OpenEvent) => ({
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
		setReceiverAddress: (context, event: SetReceiverAddressEvent) => ({
			...context,
			state: {
				...context.state,
				receiverAddress: event.address,
			},
		}),
		setQuantity: (context, event: SetQuantityEvent) => ({
			...context,
			state: {
				...context.state,
				quantity: event.quantity,
			},
		}),
		setTransferIsBeingProcessed: (
			context,
			event: SetTransferIsBeingProcessedEvent,
		) => ({
			...context,
			state: {
				...context.state,
				transferIsBeingProcessed: event.isProcessing,
			},
		}),
		setView: (context, event: SetViewEvent) => ({
			...context,
			view: event.view,
		}),
		setHash: (context, event: SetHashEvent) => ({
			...context,
			hash: event.hash,
		}),
		setCollectionType: (context, event: SetCollectionTypeEvent) => ({
			...context,
			state: {
				...context.state,
				collectionType: event.collectionType,
			},
		}),
	},
});

export const open = (args: ShowTransferModalArgs) => {
	transferModal$.send({ type: 'open', ...args });
};

export const close = () => {
	transferModal$.send({ type: 'close' });
};
