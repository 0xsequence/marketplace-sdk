export {
	type CreateListingModalContext,
	useCreateListingModalContext,
} from './internal/context';

import {
	createListingModalStore,
	type OpenCreateListingModalArgs,
} from './internal/store';

export type ShowCreateListingModalArgs = OpenCreateListingModalArgs;

export const useCreateListingModal = () => {
	return {
		show: (args: ShowCreateListingModalArgs) =>
			createListingModalStore.send({ type: 'open', ...args }),
		close: () => createListingModalStore.send({ type: 'close' }),
	};
};

export type { OpenCreateListingModalArgs } from './internal/store';
export { CreateListingModal } from './Modal';
