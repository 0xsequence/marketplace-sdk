import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';

export type ModalType = 'buy' | 'list' | 'offer' | 'sell' | 'transfer' | null;

interface ModalStoreContext {
	activeModal: ModalType;
}

const modalStore = createStore({
	context: { activeModal: null } as ModalStoreContext,
	on: {
		open: (_, event: { modal: ModalType }) => ({
			activeModal: event.modal,
		}),
		close: () => ({ activeModal: null }),
	},
});

export const useActiveModal = () =>
	useSelector(modalStore, (state) => state.context.activeModal);

export const openModal = (modal: ModalType) =>
	modalStore.send({ type: 'open', modal });

export const closeModal = () => modalStore.send({ type: 'close' });
