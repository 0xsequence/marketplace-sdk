import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
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

const initialContext: TransferModalState = {
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

export const transferModalStore = createStore({
	context: initialContext,
	on: {
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
			...initialContext,
		}),
		setView: (context, event: { view: TransferModalView }) => ({
			...context,
			view: event.view,
		}),
		setHash: (context, event: { hash: Hex | undefined }) => ({
			...context,
			hash: event.hash,
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
		setTransferIsBeingProcessed: (
			context,
			event: { isProcessing: boolean },
		) => ({
			...context,
			state: {
				...context.state,
				transferIsBeingProcessed: event.isProcessing,
			},
		}),
		updateState: (context, event: Partial<TransferModalState['state']>) => ({
			...context,
			state: {
				...context.state,
				...event,
			},
		}),
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(transferModalStore, (state) => state.context.isOpen);

export const useModalState = () =>
	useSelector(transferModalStore, (state) => state.context.state);

export const useView = () =>
	useSelector(transferModalStore, (state) => state.context.view);

export const useHash = () =>
	useSelector(transferModalStore, (state) => state.context.hash);
