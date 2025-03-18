import type { ModalCallbacks } from '../_internal/types';
import { type OpenMakeOfferModalArgs, makeOfferModal$ } from './store';

export type ShowMakeOfferModalArgs = Exclude<
	OpenMakeOfferModalArgs,
	'callbacks'
>;

export const useMakeOfferModal = (callbacks?: ModalCallbacks) => ({
	show: (args: ShowMakeOfferModalArgs): void =>
		makeOfferModal$.open({ ...args, callbacks }),
	close: (): void => makeOfferModal$.close(),
});
