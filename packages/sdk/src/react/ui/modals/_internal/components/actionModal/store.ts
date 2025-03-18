import { type Observable, observable } from '@legendapp/state';
import type { Address } from 'viem';
import type { ChainId } from '../../../../../_internal';

export interface ActionModalState {
	isOpen: boolean;
	chainId: ChainId | null;
	collectionAddress: Address | null;
}

export function createActionModalStore(): any {
	return observable<ActionModalState>({
		isOpen: false,
		chainId: null,
		collectionAddress: null,
	});
}

export function openModal(store: Observable<ActionModalState>): void {
	store.isOpen.set(true);
}

export function closeModal(store: Observable<ActionModalState>): void {
	store.isOpen.set(false);
}
