import { type Observable, observable } from '@legendapp/state';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { ShowTransactionStatusModalArgs } from '.';
import type { Price } from '../../../../../../types';
import type { TransactionType } from '../../../../../_internal/types';
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
		type: TransactionType;
		price: Price | undefined;
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		callbacks?: ModalCallbacks;
		queriesToInvalidate?: QueryKey[];
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
		type: undefined as unknown as TransactionType,
		callbacks: undefined,
		queriesToInvalidate: [],
	},
};

export const transactionStatusModal$: Observable<TransactionStatusModalState> =
	observable(initialState);
