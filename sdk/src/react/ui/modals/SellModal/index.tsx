import type { ModalCallbacks } from '../_internal/types';
import { type OpenSellModalArgs, sellModal } from './store';

type ShowSellModalArgs = Exclude<OpenSellModalArgs, 'callbacks'>;

export const useSellModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowSellModalArgs) => sellModal.open({ ...args, callbacks }),
		close: () => sellModal.close(),
	};
};
