import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';
import type { ShowTransferModalArgs } from '.';

export type TransferModalView =
	| 'enterReceiverAddress'
	| 'followWalletInstructions';

export interface TransferModalState {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Hex;
	tokenId: bigint;
	quantity: bigint;
	receiverAddress: string;
	transferIsProcessing: boolean;
	view: TransferModalView;
	hash: Hex | undefined;
	onSuccess: ((data: { hash: Hex }) => void) | undefined;
	onError: ((error: Error) => void) | undefined;
}

const initialContext: TransferModalState = {
	isOpen: false,
	chainId: 0,
	collectionAddress: '0x' as Hex,
	tokenId: 0n,
	quantity: 1n,
	receiverAddress: '',
	transferIsProcessing: false,
	view: 'enterReceiverAddress',
	hash: undefined,
	onSuccess: undefined,
	onError: undefined,
};

export const transferModalStore = createStore({
	context: initialContext,
	on: {
		open: (_context, event: ShowTransferModalArgs) => ({
			...initialContext,
			isOpen: true,
			chainId: event.chainId,
			collectionAddress: event.collectionAddress,
			tokenId: event.tokenId,
			view: 'enterReceiverAddress' as const,
			onSuccess: event.callbacks?.onSuccess,
			onError: event.callbacks?.onError,
		}),

		updateTransferDetails: (
			context,
			event: {
				receiverAddress?: string;
				quantity?: bigint;
			},
		) => ({
			...context,
			...(event.receiverAddress !== undefined && {
				receiverAddress: event.receiverAddress,
			}),
			...(event.quantity !== undefined && { quantity: event.quantity }),
		}),

		startTransfer: (context) => ({
			...context,
			transferIsProcessing: true,
			view: 'followWalletInstructions' as const,
		}),

		completeTransfer: (context, event: { hash: Hex }) => {
			if (context.onSuccess) {
				context.onSuccess({ hash: event.hash });
			}

			return {
				...context,
				hash: event.hash,
				transferIsProcessing: false,
			};
		},

		failTransfer: (context, event: { error: Error }) => {
			if (context.onError) {
				context.onError(event.error);
			}

			return {
				...context,
				transferIsProcessing: false,
				view: 'enterReceiverAddress' as const,
			};
		},

		close: () => initialContext,
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(transferModalStore, (state) => state.context.isOpen);

export const useModalState = () =>
	useSelector(transferModalStore, (state) => state.context);

export const useView = () =>
	useSelector(transferModalStore, (state) => state.context.view);

export const useHash = () =>
	useSelector(transferModalStore, (state) => state.context.hash);

export const transferDetailsSelector = transferModalStore.select((state) => ({
	receiverAddress: state.receiverAddress,
	quantity: state.quantity,
}));

export const transferConfigSelector = transferModalStore.select((state) => ({
	chainId: state.chainId,
	collectionAddress: state.collectionAddress,
	tokenId: state.tokenId,
}));
