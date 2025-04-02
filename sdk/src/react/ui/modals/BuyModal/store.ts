import { createStore } from '@xstate/store';
import type { Address, Hash } from 'viem';
import type { MarketplaceKind } from '../../../_internal';

export type View = 'checkout' | 'quantity' | 'loading' | 'error';

export type BuyModalProps = {
	orderId: string;
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	marketplace: MarketplaceKind;
};

export type onSuccessCallback = ({
	hash,
	orderId,
}: {
	hash?: Hash;
	orderId?: string;
}) => void;
export type onErrorCallback = (error: Error) => void;

const initialContext = {
	isOpen: false,
	props: null as BuyModalProps | null,
	view: 'loading' as View,
	onError: (() => {}) as onErrorCallback,
	onSuccess: (() => {}) as onSuccessCallback,
	quantity: 1,
};

export const buyModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			context,
			event: {
				props: BuyModalProps;
				onError?: onErrorCallback;
				onSuccess?: onSuccessCallback;
			},
		) => ({
			...context,
			props: event.props,
			onError: event.onError ?? context.onError,
			onSuccess: event.onSuccess ?? context.onSuccess,
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
