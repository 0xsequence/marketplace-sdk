import { type Observable, observable } from '@legendapp/state';
import type { Address } from 'viem';

export interface ActionModalState {
	isOpen: boolean;
	chainId: number | null;
	collectionAddress: Address | null;
}

export function createActionModalStore() {
	return observable<ActionModalState>({
		isOpen: false,
		chainId: null,
		collectionAddress: null,
	});
}

export function openModal(store: Observable<ActionModalState>) {
	store.isOpen.set(true);
}

export function closeModal(store: Observable<ActionModalState>) {
	store.isOpen.set(false);
}
