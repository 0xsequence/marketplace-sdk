import { observable } from '@legendapp/state';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { ShowTransactionStatusModalArgs } from '.';
import type { Price } from '../../../../../../types';
import { TransactionType } from '../../../../../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../../types';

export type ConfirmationStatus = {
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
	isTimeout: boolean;
};

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

export interface TransactionStatusModalState {
	isOpen: boolean;
	open: (args: ShowTransactionStatusModalArgs) => void;
	close: () => void;
	state: {
		hash: Hex | undefined;
		status: TransactionStatus;
		type: TransactionType | undefined;
		price: Price | undefined;
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		getTitle?: (params: ConfirmationStatus) => string;
		getMessage?: (params: ConfirmationStatus) => string;
		callbacks?: ModalCallbacks;
		queriesToInvalidate?: QueryKey[];
		confirmations?: number;
	};
}

export const initialState: TransactionStatusModalState = {
	isOpen: false,
	open: ({
		hash,
		price,
		collectionAddress,
		chainId,
		collectibleId,
		getTitle,
		getMessage,
		type,
		callbacks,
		queriesToInvalidate,
		confirmations
	}) => {
		transactionStatusModal$.state.set({
			...transactionStatusModal$.state.get(),
			hash,
			price,
			collectionAddress,
			chainId,
			collectibleId,
			getTitle,
			getMessage,
			type,
			callbacks,
			queriesToInvalidate,
			confirmations
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
		collectibleId: '',
		getTitle: undefined,
		getMessage: undefined,
		type: undefined,
		callbacks: undefined,
		queriesToInvalidate: [],
		confirmations: -1
	},
};

export const transactionStatusModal$ = observable(initialState);
