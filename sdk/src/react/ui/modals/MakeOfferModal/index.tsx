import type { ModalCallbacks } from '../_internal/types';
import { makeOfferModalStore, type OpenMakeOfferModalArgs } from './store';

export type ShowMakeOfferModalArgs = Exclude<
	OpenMakeOfferModalArgs,
	'callbacks'
>;

export const useMakeOfferModal = (callbacks?: ModalCallbacks) => ({
	show: (args: ShowMakeOfferModalArgs) =>
		makeOfferModalStore.send({ type: 'open', args: { ...args, callbacks } }),
	close: () => makeOfferModalStore.send({ type: 'close' }),
});
