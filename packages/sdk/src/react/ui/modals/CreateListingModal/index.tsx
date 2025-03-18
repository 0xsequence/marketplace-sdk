import type { ModalCallbacks } from '../_internal/types';
import { type OpenCreateListingModalArgs, createListingModal$ } from './store';

type ShowCreateListingModalArgs = Exclude<
	OpenCreateListingModalArgs,
	'callbacks'
>;

export const useCreateListingModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowCreateListingModalArgs): void =>
			createListingModal$.open({ ...args, callbacks }),
		close: (): void => createListingModal$.close(),
	};
};
