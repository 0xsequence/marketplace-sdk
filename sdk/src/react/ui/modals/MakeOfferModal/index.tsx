import type { ModalCallbacks } from '../_internal/types';
import {
	makeOfferModalStore,
	type OpenMakeOfferModalArgs,
} from './internal/store';

export type ShowMakeOfferModalArgs = Exclude<
	OpenMakeOfferModalArgs,
	'callbacks'
>;

export const useMakeOfferModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowMakeOfferModalArgs) =>
			makeOfferModalStore.send({ type: 'open', ...args, callbacks }),
		close: () => makeOfferModalStore.send({ type: 'close' }),
	};
};
