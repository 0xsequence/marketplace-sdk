import type { IconProps } from '@0xsequence/design-system';
import { createStore } from '@xstate/store';
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

const initialState: SuccessfulPurchaseModalState = {
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

type OpenEvent = SuccessfulPurchaseModalState['state'] & {
	type: 'open';
	callbacks?: ModalCallbacks;
	defaultCallbacks?: ModalCallbacks;
};

export const successfulPurchaseModal$ = createStore({
	context: initialState,
	on: {
		open: (context, event: OpenEvent) => ({
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
			...initialState,
		}),
	},
});

export const open = (
	args: SuccessfulPurchaseModalState['state'] & {
		callbacks?: ModalCallbacks;
		defaultCallbacks?: ModalCallbacks;
	},
) => {
	successfulPurchaseModal$.send({ type: 'open', ...args });
};

export const close = () => {
	successfulPurchaseModal$.send({ type: 'close' });
};
