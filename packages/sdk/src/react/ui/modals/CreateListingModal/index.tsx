import type { ModalCallbacks } from '../_internal/types';
import { createListingModal$, type OpenCreateListingModalArgs } from './store';

type ShowCreateListingModalArgs = Exclude<
	OpenCreateListingModalArgs,
	'callbacks'
>;

export const useCreateListingModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowCreateListingModalArgs) =>
			createListingModal$.open({ ...args, callbacks }),
		close: () => createListingModal$.close(),
	};
};
