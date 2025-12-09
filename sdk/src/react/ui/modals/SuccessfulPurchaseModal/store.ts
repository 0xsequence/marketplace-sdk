import type { Metadata } from '@0xsequence/api-client';
import type { IconProps } from '@0xsequence/design-system';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { ComponentType } from 'react';

type TokenMetadata = Metadata.TokenMetadata;

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
};

export const successfulPurchaseModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: SuccessfulPurchaseModalState['state'] & {}) => ({
			...context,
			isOpen: true,
			state: {
				collectibles: event.collectibles,
				totalPrice: event.totalPrice,
				explorerName: event.explorerName,
				explorerUrl: event.explorerUrl,
				ctaOptions: event.ctaOptions,
			},
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
