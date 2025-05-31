import type { QueryKey } from '@tanstack/react-query';
import { createStore } from '@xstate/store';
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
	state: {
		hash: Hex | undefined;
		orderId: string | undefined;
		status: TransactionStatus;
		type: TransactionType;
		price: Price | undefined;
		collectionAddress: Hex;
		chainId: number;
		collectibleId: string;
		callbacks?: ModalCallbacks;
		queriesToInvalidate?: QueryKey[];
	};
}

export const initialState: TransactionStatusModalState = {
	isOpen: false,
	state: {
		hash: undefined,
		orderId: undefined,
		status: 'PENDING',
		price: undefined,
		collectionAddress: '' as Hex,
		chainId: 0,
		collectibleId: '',
		type: undefined as unknown as TransactionType,
		callbacks: undefined,
		queriesToInvalidate: [],
	},
};

export const transactionStatusModal$ = createStore<TransactionStatusModalState>(
	initialState,
	{
		open: (context, event: ShowTransactionStatusModalArgs) => ({
			...context,
			isOpen: true,
			state: {
				...context.state,
				hash: event.hash,
				orderId: event.orderId,
				price: event.price,
				collectionAddress: event.collectionAddress,
				chainId: event.chainId,
				collectibleId: event.collectibleId,
				type: event.type,
				callbacks: event.callbacks,
				queriesToInvalidate: event.queriesToInvalidate,
			},
		}),
		close: () => ({
			...initialState,
		}),
		setStatus: (context, event: { status: TransactionStatus }) => ({
			...context,
			state: {
				...context.state,
				status: event.status,
			},
		}),
	},
);

export const open = (args: ShowTransactionStatusModalArgs) => {
	transactionStatusModal$.send({ type: 'open', ...args });
};

export const close = () => {
	transactionStatusModal$.send({ type: 'close' });
};

export const setStatus = (status: TransactionStatus) => {
	transactionStatusModal$.send({ type: 'setStatus', status });
};
