import { observable } from '@legendapp/state';
import type { ShowBuyModalArgs } from '.';
import type { Order } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

const buyState = {
	order: undefined as unknown as Order,
	quantity: '1',
	invalidQuantity: false,
	checkoutModalIsLoading: false,
	checkoutModalLoaded: false,
	purchaseProcessing: false,
	customProviderCallback: null,
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
		invalidQuantity: boolean;
		checkoutModalIsLoading: boolean;
		checkoutModalLoaded: boolean;
		purchaseProcessing: boolean;
		customProviderCallback?:
			| ((args: { data: string; value: string }) => void)
			| null;
	};
	setCheckoutModalIsLoading: (isLoading: boolean) => void;
	setCheckoutModalLoaded: (isLoaded: boolean) => void;
	setPurchaseProcessing: (isProcessing: boolean) => void;
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
			invalidQuantity: false,
			checkoutModalIsLoading: false,
			checkoutModalLoaded: false,
			purchaseProcessing: false,
			customProviderCallback: args.customProviderCallback,
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
	setPurchaseProcessing: (isProcessing: boolean) => {
		buyModal$.state.purchaseProcessing.set(isProcessing);
	},
	callbacks: undefined,
};

export const buyModal$ = observable(initialState);
