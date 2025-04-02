import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hash } from 'viem';
import type { MarketplaceKind } from '../../../_internal';

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
	props: null as unknown as BuyModalProps,
	onError: (() => {}) as onErrorCallback,
	onSuccess: (() => {}) as onSuccessCallback,
	quantity: undefined as number | undefined,
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

		setQuantity: (context, event: { quantity: number }) => ({
			...context,
			quantity: event.quantity,
		}),
	},
});

export const useIsOpen = () =>
	useSelector(buyModalStore, (state) => state.context.isOpen);

export const useBuyModalProps = () =>
	useSelector(buyModalStore, (state) => state.context.props);

export const useOnError = () =>
	useSelector(buyModalStore, (state) => state.context.onError);

export const useOnSuccess = () =>
	useSelector(buyModalStore, (state) => state.context.onSuccess);

export const useQuantity = () =>
	useSelector(buyModalStore, (state) => state.context.quantity);
