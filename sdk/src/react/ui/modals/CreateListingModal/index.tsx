import type { ModalCallbacks } from '../_internal/types';
import {
	createListingModalStore,
	type OpenCreateListingModalArgs,
} from './store';

type ShowCreateListingModalArgs = Omit<OpenCreateListingModalArgs, 'callbacks'>;

export const useCreateListingModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowCreateListingModalArgs) =>
			createListingModalStore.send({
				type: 'open',
				...args,
				callbacks,
			}),
		close: () => createListingModalStore.send({ type: 'close' }),
	};
};
