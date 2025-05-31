import type { IconProps } from '@0xsequence/design-system';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { ComponentType } from 'react';
import type { TokenMetadata } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

export interface SuccessfulPurchaseModalState {
	isOpen: boolean;
	state: {
		collectibles: TokenMetadata[];
		totalPrice: string;
		explorerName: string;
		explorerUrl: string;
		ctaOptions?: {
			ctaLabel: string;
			ctaOnClick: () => void;
			ctaIcon?: ComponentType<IconProps>;
		};
	};
	callbacks?: ModalCallbacks;
}

const initialContext: SuccessfulPurchaseModalState = {
	isOpen: false,
	state: {
		collectibles: [],
		totalPrice: '0',
		explorerName: '',
		explorerUrl: '',
		ctaOptions: undefined,
	},
	callbacks: undefined,
};

export const successfulPurchaseModalStore = createStore({
	context: initialContext,
	on: {
		open: (
			context,
			event: SuccessfulPurchaseModalState['state'] & {
				callbacks?: ModalCallbacks;
				defaultCallbacks?: ModalCallbacks;
			},
		) => ({
			...context,
			isOpen: true,
			state: {
				collectibles: event.collectibles,
				totalPrice: event.totalPrice,
				explorerName: event.explorerName,
				explorerUrl: event.explorerUrl,
				ctaOptions: event.ctaOptions,
			},
			callbacks: event.callbacks || event.defaultCallbacks,
		}),
		close: () => ({
			...initialContext,
		}),
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(successfulPurchaseModalStore, (state) => state.context.isOpen);

export const useModalState = () =>
	useSelector(successfulPurchaseModalStore, (state) => state.context.state);

export const useCallbacks = () =>
	useSelector(successfulPurchaseModalStore, (state) => state.context.callbacks);

// For backward compatibility with the old API
export const successfulPurchaseModal = {
	open: (
		args: SuccessfulPurchaseModalState['state'] & {
			callbacks?: ModalCallbacks;
			defaultCallbacks?: ModalCallbacks;
		},
	) => successfulPurchaseModalStore.send({ type: 'open', ...args }),
	close: () => successfulPurchaseModalStore.send({ type: 'close' }),
	state: {
		get: () => successfulPurchaseModalStore.getSnapshot().context.state,
	},
};
