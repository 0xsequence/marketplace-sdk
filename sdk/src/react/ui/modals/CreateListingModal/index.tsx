export {
	type CreateListingModalContext,
	useCreateListingModalContext,
} from './internal/context';

import {
	createListingModalStore,
	type OpenCreateListingModalArgs,
} from './internal/store';

export type ShowCreateListingModalArgs = Exclude<
	OpenCreateListingModalArgs,
	'callbacks'
>;

import type { ModalCallbacks } from '../_internal/types';

export const useCreateListingModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowCreateListingModalArgs) =>
			createListingModalStore.send({ type: 'open', ...args, callbacks }),
		close: () => createListingModalStore.send({ type: 'close' }),
	};
};

export type { OpenCreateListingModalArgs } from './internal/store';
export { CreateListingModal } from './Modal';
