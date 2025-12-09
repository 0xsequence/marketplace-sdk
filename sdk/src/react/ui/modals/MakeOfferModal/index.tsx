export {
	type MakeOfferModalContext,
	useMakeOfferModalContext,
} from './internal/context';

import {
	makeOfferModalStore,
	type OpenMakeOfferModalArgs,
} from './internal/store';

export type ShowMakeOfferModalArgs = OpenMakeOfferModalArgs;

export const useMakeOfferModal = () => {
	return {
		show: (args: ShowMakeOfferModalArgs) =>
			makeOfferModalStore.send({ type: 'open', ...args }),
		close: () => makeOfferModalStore.send({ type: 'close' }),
	};
};
