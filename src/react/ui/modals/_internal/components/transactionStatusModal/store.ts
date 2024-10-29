import { observable } from '@legendapp/state';
import { ShowTransactionStatusModalArgs as ShowTransactionStatusModalArgs } from '.';
import { TransactionStatus } from '@0xsequence/indexer';
import { Address, Hex } from 'viem';

export type TransactionStatusExtended = TransactionStatus | 'PENDING';

export interface TransactionStatusModalState {
	isOpen: boolean;
	open: (args: ShowTransactionStatusModalArgs) => void;
	close: () => void;
	state: {
		hash: Hex | undefined;
		status: TransactionStatusExtended;
		collectionAddress: string;
		chainId: string;
		tokenId: string;
		getTitle?: (
			isConfirmed: boolean,
			isConfirming: boolean,
			isFailed: boolean,
		) => string;
		getMessage?: (
			isConfirmed: boolean,
			isConfirming: boolean,
			isFailed: boolean,
		) => string;
		creatorAddress?: Address;
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
		creatorAddress,
	}) => {
		transactionStatusModal$.state.set({
			...transactionStatusModal$.state.get(),
			hash,
			collectionAddress,
			chainId,
			tokenId,
			getTitle,
			getMessage,
			creatorAddress,
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
		creatorAddress: undefined,
	},
};

export const transactionStatusModal$ = observable(initialState);
