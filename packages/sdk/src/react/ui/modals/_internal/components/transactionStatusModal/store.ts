import { observable } from '@legendapp/state';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { ShowTransactionStatusModalArgs } from '.';
import type { Price } from '../../../../../../types';
import type { TransactionType } from '../../../../../_internal/transaction-machine/types';
import type { ModalCallbacks } from '../../types';

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
		orderId: string | undefined;
		status: TransactionStatus;
		type: TransactionType | undefined;
		price: Price | undefined;
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		callbacks?: ModalCallbacks;
		queriesToInvalidate?: QueryKey[];
		confirmations?: number;
		blocked?: boolean;
	};
}

export const initialState: TransactionStatusModalState = {
	isOpen: false,
	open: ({
		hash,
		orderId,
		price,
		collectionAddress,
		chainId,
		collectibleId,
		type,
		callbacks,
		queriesToInvalidate,
		confirmations,
		blocked,
	}) => {
		transactionStatusModal$.state.set({
			...transactionStatusModal$.state.get(),
			hash,
			orderId,
			price,
			collectionAddress,
			chainId,
			collectibleId,
			type,
			callbacks,
			queriesToInvalidate,
			confirmations,
			blocked,
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
		orderId: undefined,
		status: 'PENDING',
		price: undefined,
		collectionAddress: '' as Hex,
		chainId: '',
		collectibleId: '',
		type: undefined,
		callbacks: undefined,
		queriesToInvalidate: [],
		confirmations: -1,
		blocked: false,
	},
};

export const transactionStatusModal$ = observable(initialState);
