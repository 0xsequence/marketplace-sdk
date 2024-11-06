import { observable } from '@legendapp/state';
import type { ShowTransferModalArgs } from '.';
import type { TokenMetadata } from '@types';

export interface TransferModalState {
	isOpen: boolean;
	open: (args: ShowTransferModalArgs) => void;
	close: () => void;
	transfer: () => void;
	nextStep: () => void;
	state: {
		chainId: number;
		collectionAddress: string;
		receiverWalletAddress: string;
		collectibleMetadata: TokenMetadata | null;
		// TODO: Replace it with Step interface later
		step: number;
		isWalletProcessing: boolean;
		isTransactionProcessing: boolean;
	};
}

export const initialState: TransferModalState = {
	isOpen: false,
	open: ({
		chainId,
		collectionAddress,
		collectibleMetadata,
	}: ShowTransferModalArgs) => {
		transferModal$.state.set({
			...transferModal$.state.get(),
			chainId,
			collectionAddress,
			receiverWalletAddress: '',
			collectibleMetadata,
			step: 0,
		});
		transferModal$.isOpen.set(true);
	},
	close: () => {
		transferModal$.isOpen.set(false);
		transferModal$.state.set({
			...initialState.state,
		});
	},
	transfer: () => {
		transferModal$.state.isWalletProcessing.set(true);
		transferModal$.nextStep();
	},
	nextStep: () => {
		transferModal$.state.step.set(transferModal$.state.step.get() + 1);
	},
	state: {
		chainId: 0,
		collectionAddress: '',
		receiverWalletAddress: '',
		collectibleMetadata: null,
		step: 0,
		isWalletProcessing: false,
		isTransactionProcessing: false,
	},
};

export const transferModal$ = observable(initialState);
