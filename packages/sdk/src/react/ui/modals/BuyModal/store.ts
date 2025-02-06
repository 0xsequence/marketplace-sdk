import { observable } from '@legendapp/state';
import type { ShowBuyModalArgs } from '.';
import type { Order } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

const buyState = {
	order: undefined as unknown as Order,
	quantity: '1',
	modalId: 0,
	invalidQuantity: false,
	checkoutModalIsLoading: false,
	checkoutModalLoaded: false,
} as const;

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
		checkoutModalIsLoading: boolean;
		checkoutModalLoaded: boolean;
	};
	setCheckoutModalIsLoading: (isLoading: boolean) => void;
	setCheckoutModalLoaded: (isLoaded: boolean) => void;
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
			checkoutModalIsLoading: false,
			checkoutModalLoaded: false,
		});
		buyModal$.callbacks.set(callbacks || defaultCallbacks);
		buyModal$.isOpen.set(true);
	},
	close: () => {
		buyModal$.isOpen.set(false);
		buyModal$.callbacks.set(undefined);
		buyModal$.state.set(buyState);
	},
	state: buyState,
	setCheckoutModalIsLoading: (isLoading: boolean) => {
		buyModal$.state.checkoutModalIsLoading.set(isLoading);
	},
	setCheckoutModalLoaded: (isLoaded: boolean) => {
		buyModal$.state.checkoutModalLoaded.set(isLoaded);
	},
	callbacks: undefined,
};

export const buyModal$ = observable(initialState);
