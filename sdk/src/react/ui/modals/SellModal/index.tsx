import type { ModalCallbacks } from '../_internal/types';
import { type SellModalProps, sellModalStore } from './store';

export const useSellModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: SellModalProps) =>
			sellModalStore.send({ type: 'open', props: args, ...callbacks }),
		close: () => sellModalStore.send({ type: 'close' }),
	};
};
