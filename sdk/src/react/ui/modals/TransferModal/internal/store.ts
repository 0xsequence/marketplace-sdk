import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from '@0xsequence/api-client';
import { useAccount } from 'wagmi';
import type { CollectionType } from '../../../../_internal';
import { useEnsureCorrectChain, useListBalances } from '../../../../hooks';

export type ShowTransferModalArgs = {
	collectionAddress: Address;
	tokenId: bigint;
	chainId: number;
	collectionType?: CollectionType;
};

export type UseTransferModalArgs = {
	prefetch?: {
		tokenId: bigint;
		chainId: number;
		collectionAddress: Address;
	};
};

type TransferModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
	collectionType?: CollectionType;
	receiverInput: string;
	quantityInput: bigint;
	isReceiverTouched: boolean;
	isQuantityTouched: boolean;
};

const initialContext: TransferModalState = {
	isOpen: false,
	chainId: 0,
	collectionAddress: '' as Address,
	tokenId: 0n,
	collectionType: undefined,
	receiverInput: '',
	quantityInput: 1n,
	isReceiverTouched: false,
	isQuantityTouched: false,
};

export const transferModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (_context, event: ShowTransferModalArgs) => ({
			...initialContext,
			...event,
			isOpen: true,
			quantityInput: 1n,
			isReceiverTouched: false,
			isQuantityTouched: false,
		}),
		close: () => ({ ...initialContext }),
		updateReceiver: (context, event: { value: string }) => ({
			...context,
			receiverInput: event.value,
		}),
		touchReceiver: (context) => ({
			...context,
			isReceiverTouched: true,
		}),
		updateQuantity: (context, event: { value: bigint }) => ({
			...context,
			quantityInput: event.value,
			isQuantityTouched: true,
		}),
		touchQuantity: (context) => ({
			...context,
			isQuantityTouched: true,
		}),
	},
});

export const useTransferModalState = () => {
	const state = useSelector(transferModalStore, (snapshot) => snapshot.context);
	return {
		...state,
		closeModal: () => transferModalStore.send({ type: 'close' }),
		updateReceiverInput: (value: string) =>
			transferModalStore.send({ type: 'updateReceiver', value }),
		touchReceiverInput: () =>
			transferModalStore.send({ type: 'touchReceiver' }),
		updateQuantityInput: (value: bigint) =>
			transferModalStore.send({ type: 'updateQuantity', value }),
		touchQuantityInput: () =>
			transferModalStore.send({ type: 'touchQuantity' }),
	};
};

export const useTransferModal = (args?: UseTransferModalArgs) => {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const { address: accountAddress } = useAccount();

	useListBalances({
		chainId: args?.prefetch?.chainId ?? 0,
		contractAddress: args?.prefetch?.collectionAddress,
		tokenId: args?.prefetch?.tokenId,
		accountAddress,
		query: { enabled: !!accountAddress && !!args?.prefetch },
	});

	const show = (openArgs: ShowTransferModalArgs) => {
		const targetChainId = Number(openArgs.chainId);
		ensureCorrectChain(targetChainId, {
			onSuccess: () => transferModalStore.send({ type: 'open', ...openArgs }),
		});
	};

	return {
		show,
		close: () => transferModalStore.send({ type: 'close' }),
	};
};
