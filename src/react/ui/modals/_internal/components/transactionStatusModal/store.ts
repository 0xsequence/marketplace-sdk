import type { TransactionStatus } from '@0xsequence/indexer';
import type { StepType } from '@internal';
import { observable } from '@legendapp/state';
import type { Price } from '@types';
import type { Hex } from 'viem';
import type { ShowTransactionStatusModalArgs } from '.';

export type ConfirmationStatus = {
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
};

export type TransactionStatusExtended = TransactionStatus | 'PENDING';

export type StatusOrderType =
	| Pick<
			typeof StepType,
			'sell' | 'createListing' | 'createOffer' | 'buy'
	  >[keyof Pick<
			typeof StepType,
			'sell' | 'createListing' | 'createOffer' | 'buy'
	  >]
	| 'transfer';

export interface TransactionStatusModalState {
	isOpen: boolean;
	open: (args: ShowTransactionStatusModalArgs) => void;
	close: () => void;
	state: {
		hash: Hex | undefined;
		status: TransactionStatusExtended;
		type: StatusOrderType | undefined;
		price: Price | undefined;
		collectionAddress: Hex;
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
		price,
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
			price,
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
		price: undefined,
		collectionAddress: '' as Hex,
		chainId: '',
		tokenId: '',
		getTitle: undefined,
		getMessage: undefined,
		type: undefined,
	},
};

export const transactionStatusModal$ = observable(initialState);
