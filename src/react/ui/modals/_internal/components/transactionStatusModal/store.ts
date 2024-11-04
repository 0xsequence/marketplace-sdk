import { observable } from '@legendapp/state';
import { ShowTransactionStatusModalArgs as ShowTransactionStatusModalArgs } from '.';
import { TransactionStatus } from '@0xsequence/indexer';
import { Hex } from 'viem';
import { StepType } from '@internal';

export type ConfirmationStatus = {
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
};

export type TransactionStatusExtended = TransactionStatus | 'PENDING';

export type StatusOrderType = Pick<
	typeof StepType,
	'sell' | 'createListing' | 'createOffer' | 'buy'
>[keyof Pick<
	typeof StepType,
	'sell' | 'createListing' | 'createOffer' | 'buy'
>];

export interface TransactionStatusModalState {
	isOpen: boolean;
	open: (args: ShowTransactionStatusModalArgs) => void;
	close: () => void;
	state: {
		hash: Hex | undefined;
		status: TransactionStatusExtended;
		type: StatusOrderType | undefined;
		collectionAddress: string;
		chainId: string;
		tokenId: string;
		getTitle?: (params: ConfirmationStatus) => string;
		getMessage?: (params: ConfirmationStatus) => string;
	};
}

export const initialState: TransactionStatusModalState = {
	isOpen: false,
	open: ({
		hash,
		collectionAddress,
		chainId,
		tokenId,
		getTitle,
		getMessage,
		type,
	}) => {
		transactionStatusModal$.state.set({
			...transactionStatusModal$.state.get(),
			hash,
			collectionAddress,
			chainId,
			tokenId,
			getTitle,
			getMessage,
			type,
		});
		transactionStatusModal$.isOpen.set(true);
	},
	close: () => {
		transactionStatusModal$.isOpen.set(false);
		transactionStatusModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		hash: undefined,
		status: 'PENDING',
		collectionAddress: '',
		chainId: '',
		tokenId: '',
		getTitle: undefined,
		getMessage: undefined,
		type: undefined,
	},
};

export const transactionStatusModal$ = observable(initialState);
