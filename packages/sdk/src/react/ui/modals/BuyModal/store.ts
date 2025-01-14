import { observable } from '@legendapp/state';
import type { ShowBuyModalArgs } from '.';
import type { Order } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

type BuyModalState = {
	isOpen: boolean;
	order: Order;
	quantity: string;
	invalidQuantity: boolean;
	callbacks?: ModalCallbacks;
};

type Actions = {
	open: (
		args: ShowBuyModalArgs & {
			callbacks?: ModalCallbacks;
			defaultCallbacks?: ModalCallbacks;
		},
	) => void;
	close: () => void;
};

const initialState: BuyModalState = {
	isOpen: false,
	order: undefined as unknown as Order,
	quantity: '1',
	invalidQuantity: false,
	callbacks: undefined,
};

const actions: Actions = {
	open: ({ callbacks, defaultCallbacks, ...args }) => {
		buyModal$.quantity.set(args.order.quantityAvailableFormatted);
		buyModal$.order.set(args.order);
		buyModal$.invalidQuantity.set(false);
		buyModal$.callbacks.set(callbacks || defaultCallbacks);
		buyModal$.isOpen.set(true);
	},
	close: () => {
		buyModal$.isOpen.set(false);
		buyModal$.set({ ...initialState, ...actions });
	},
};

export const buyModal$ = observable<BuyModalState & Actions>({
	...initialState,
	...actions,
});
