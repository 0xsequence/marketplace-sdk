import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';
import type { Order, TransactionSteps } from '../../../_internal';

export type SellModalProps = {
	collectionAddress: Hex;
	chainId: number;
	tokenId: string;
	order: Order;
};

type onErrorCallback = (error: Error) => void;
type onSuccessCallback = ({
	hash,
	orderId,
}: { hash?: Hex; orderId?: string }) => void;

const initialContext = {
	isOpen: false,
	props: null as unknown as SellModalProps,
	onError: (() => {}) as onErrorCallback,
	onSuccess: (() => {}) as onSuccessCallback,
	sellIsBeingProcessed: false,
	steps: {
		approval: {
			exist: false,
			isExecuting: false,
			execute: () => Promise.resolve(),
		},
		transaction: {
			exist: false,
			isExecuting: false,
			execute: () => Promise.resolve(),
		},
	} as TransactionSteps,
};

export const sellModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			context,
			event: {
				props: SellModalProps;
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
			sellIsBeingProcessed: false,
		}),

		setSellIsBeingProcessed: (context, event: { value: boolean }) => ({
			...context,
			sellIsBeingProcessed: event.value,
		}),

		updateSteps: (context, event: { steps: TransactionSteps }) => ({
			...context,
			steps: event.steps,
		}),
	},
});

export const useSellModalProps = () =>
	useSelector(sellModalStore, (state) => state.context.props);

export const useIsOpen = () =>
	useSelector(sellModalStore, (state) => state.context.isOpen);

export const useOnError = () =>
	useSelector(sellModalStore, (state) => state.context.onError);

export const useOnSuccess = () =>
	useSelector(sellModalStore, (state) => state.context.onSuccess);

export const useSteps = () =>
	useSelector(sellModalStore, (state) => state.context.steps);

export const useSellIsBeingProcessed = () =>
	useSelector(sellModalStore, (state) => state.context.sellIsBeingProcessed);
