import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';

export interface ActionModalState {
	isOpen: boolean;
	chainId: number | null;
	collectionAddress: Address | null;
}

const initialContext: ActionModalState = {
	isOpen: false,
	chainId: null,
	collectionAddress: null,
};

export const actionModalStore = createStore({
	context: initialContext,
	on: {
		open: (
			context,
			event: { chainId: number; collectionAddress: Address },
		) => ({
			...context,
			isOpen: true,
			chainId: event.chainId,
			collectionAddress: event.collectionAddress,
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			chainId: null,
			collectionAddress: null,
		}),
	},
});

// Selector hooks
export const useActionModalState = () =>
	useSelector(actionModalStore, (state) => state.context);

export const useIsActionModalOpen = () =>
	useSelector(actionModalStore, (state) => state.context.isOpen);

export const useActionModalChainId = () =>
	useSelector(actionModalStore, (state) => state.context.chainId);

export const useActionModalCollectionAddress = () =>
	useSelector(actionModalStore, (state) => state.context.collectionAddress);

export function openModal(chainId: number, collectionAddress: Address) {
	actionModalStore.send({ type: 'open', chainId, collectionAddress });
}

export function closeModal() {
	actionModalStore.send({ type: 'close' });
}
