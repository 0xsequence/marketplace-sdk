import { createStore } from '@xstate/store';
import type { Order } from '../../../_internal';

type View = 'checkout' | 'quantity' | 'loading' | 'error';

const initialContext = {
	isOpen: false,
	order: null as Order | null,
	view: 'loading' as View,
	quantity: 1,
};

export const buyModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (context, event: { order: Order }) => ({
			...context,
			order: event.order,
			isOpen: true,
		}),
		close: (context) => ({
			...context,
			isOpen: false,
		}),
		setView: (context, event: { view: View }) => ({
			...context,
			view: event.view,
		}),
		setQuantity: (context, event: { quantity: number }) => ({
			...context,
			quantity: event.quantity,
		}),
	},
});
