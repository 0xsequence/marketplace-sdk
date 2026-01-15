import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';

export type ModalType = 'buy' | 'list' | 'offer' | 'sell' | 'transfer' | null;

type ModalStoreContext = {
	activeModal: ModalType;
};

const initialContext: ModalStoreContext = {
	activeModal: null,
};

export const modalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (_context, event: { modal: ModalType }) => ({
			activeModal: event.modal,
		}),
		close: () => ({ ...initialContext }),
	},
});

export const useActiveModal = () =>
	useSelector(modalStore, (state) => state.context.activeModal);

export const openModal = (modal: ModalType) =>
	modalStore.send({ type: 'open', modal });

export const closeModal = () => modalStore.send({ type: 'close' });
