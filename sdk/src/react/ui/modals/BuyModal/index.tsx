import type { ModalCallbacks } from '../_internal/types';
import { type BuyModalProps, buyModalStore } from './store';

export const useBuyModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: BuyModalProps) =>
			buyModalStore.send({ type: 'open', props: args, ...callbacks }),
		close: () => buyModalStore.send({ type: 'close' }),
	};
};
