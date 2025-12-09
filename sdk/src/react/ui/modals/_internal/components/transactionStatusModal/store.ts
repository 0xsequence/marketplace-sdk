import type { QueryKey } from '@tanstack/react-query';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hex } from 'viem';
import type { Price } from '../../../../../../types';
import type { TransactionType } from '../../../../../_internal/types';
import type { ShowTransactionStatusModalArgs } from '.';

export type ConfirmationStatus = {
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
	isTimeout: boolean;
};

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

interface TransactionStatusModalContext {
	isOpen: boolean;
	hash: Hex | undefined;
	orderId: string | undefined;
	status: TransactionStatus;
	transactionType: TransactionType | undefined;
	price: Price | undefined;
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
	queriesToInvalidate?: QueryKey[];
}

const initialContext: TransactionStatusModalContext = {
	isOpen: false,
	hash: undefined,
	orderId: undefined,
	status: 'PENDING',
	transactionType: undefined,
	price: undefined,
	collectionAddress: '0x0000000000000000000000000000000000000000',
	chainId: 0,
	tokenId: 0n,
	queriesToInvalidate: [],
};

export const transactionStatusModalStore = createStore({
	context: initialContext,
	on: {
		open: (
			context,
			event: Omit<ShowTransactionStatusModalArgs, 'type'> & {
				transactionType: TransactionType;
			},
		) => ({
			...context,
			isOpen: true,
			hash: event.hash,
			orderId: event.orderId,
			price: event.price,
			collectionAddress: event.collectionAddress,
			chainId: event.chainId,
			tokenId: event.tokenId,
			transactionType: event.transactionType,
			queriesToInvalidate: event.queriesToInvalidate,
			status: 'PENDING' as TransactionStatus,
		}),

		close: () => ({
			...initialContext,
		}),

		updateStatus: (context, event: { status: TransactionStatus }) => ({
			...context,
			status: event.status,
		}),
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(transactionStatusModalStore, (state) => state.context.isOpen);

export const useTransactionStatusModalState = () =>
	useSelector(transactionStatusModalStore, (state) => state.context);

export const useTransactionHash = () =>
	useSelector(transactionStatusModalStore, (state) => state.context.hash);

export const useTransactionType = () =>
	useSelector(
		transactionStatusModalStore,
		(state) => state.context.transactionType,
	);

export const useTransactionDetails = () =>
	useSelector(transactionStatusModalStore, (state) => ({
		hash: state.context.hash,
		orderId: state.context.orderId,
		transactionType: state.context.transactionType,
		status: state.context.status,
		chainId: state.context.chainId,
	}));

export const useCollectibleInfo = () =>
	useSelector(transactionStatusModalStore, (state) => ({
		collectionAddress: state.context.collectionAddress,
		tokenId: state.context.tokenId,
		chainId: state.context.chainId,
		price: state.context.price,
	}));
