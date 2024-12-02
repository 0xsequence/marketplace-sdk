import { observable } from '@legendapp/state';
import type { Order } from '../../../_internal';
import type { ShowBuyModalArgs } from '.';
import type { ModalCallbacks } from '../_internal/types';

export interface BuyModalState {
	isOpen: boolean;
	open: (args: ShowBuyModalArgs & { callbacks?: ModalCallbacks; defaultCallbacks?: ModalCallbacks }) => void;
	close: () => void;
	state: {
		order: Order;
		quantity: string;
	};
	callbacks?: ModalCallbacks;
}

export const initialState: BuyModalState = {
	isOpen: false,
	open: ({ callbacks, defaultCallbacks, ...args }: ShowBuyModalArgs & { callbacks?: ModalCallbacks; defaultCallbacks?: ModalCallbacks }) => {
		buyModal$.state.set({
			...buyModal$.state.get(),
			order: args.order,
		});
		buyModal$.callbacks.set(callbacks || defaultCallbacks);
		buyModal$.isOpen.set(true);
	},
	close: () => {
		buyModal$.isOpen.set(false);
		buyModal$.callbacks.set(undefined);
		buyModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		order: undefined as unknown as Order,
		quantity: '1',
	},
	callbacks: undefined,
};

export const buyModal$ = observable(initialState);
