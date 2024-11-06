import { type Observable, observable } from '@legendapp/state';

export interface ActionModalState {
	isOpen: boolean;
}

export function createActionModalStore() {
	return observable<ActionModalState>({
		isOpen: false,
	});
}

export function openModal(store: Observable<ActionModalState>) {
	store.isOpen.set(true);
}

export function closeModal(store: Observable<ActionModalState>) {
	store.isOpen.set(false);
}
