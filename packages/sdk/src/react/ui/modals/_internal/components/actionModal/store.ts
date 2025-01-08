import { type Observable, observable } from '@legendapp/state';
import type { ChainId } from '../../../../../_internal';
import type { Address } from 'viem';

export interface ActionModalState {
	isOpen: boolean;
	chainId: ChainId | null;
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
