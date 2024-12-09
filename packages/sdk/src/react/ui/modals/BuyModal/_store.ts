import { observable } from '@legendapp/state';
import type { Order } from '../../../_internal';
import type { ShowBuyModalArgs } from '.';
import type { ModalCallbacks } from '../_internal/types';

export interface BuyModalState {
	isOpen: boolean;
	open: (
		args: ShowBuyModalArgs & {
			callbacks?: ModalCallbacks;
			defaultCallbacks?: ModalCallbacks;
		},
	) => void;
	close: () => void;
	state: {
		order: Order;
		quantity: string;
		modalId: number;
		invalidQuantity: boolean;
	};
	callbacks?: ModalCallbacks;
}

export const initialState: BuyModalState = {
	isOpen: false,
	open: ({
		callbacks,
		defaultCallbacks,
		...args
	}: ShowBuyModalArgs & {
		callbacks?: ModalCallbacks;
		defaultCallbacks?: ModalCallbacks;
	}) => {
		buyModal$.state.set({
			quantity: args.order.quantityAvailableFormatted,
			order: args.order,
			modalId: buyModal$.state.modalId.get() + 1,
			invalidQuantity: false,
		});
		buyModal$.callbacks.set(callbacks || defaultCallbacks);
		buyModal$.isOpen.set(true);
	},
	close: () => {
		buyModal$.isOpen.set(false);
	},
	state: {
		order: undefined as unknown as Order,
		quantity: '1',
		modalId: 0,
		invalidQuantity: false,
	},
	callbacks: undefined,
};

export const buyModal$ = observable(initialState);
