import type { IconProps } from '@0xsequence/design-system';
import { Observable, observable } from '@legendapp/state';
import type { ComponentType } from 'react';
import type { TokenMetadata } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

export interface SuccessfulPurchaseModalState {
	isOpen: boolean;
	open: (
		args: SuccessfulPurchaseModalState['state'] & {
			callbacks?: ModalCallbacks;
			defaultCallbacks?: ModalCallbacks;
		},
	) => void;
	close: () => void;
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
	open: ({
		collectibles,
		totalPrice,
		explorerName,
		explorerUrl,
		ctaOptions,
		callbacks,
		defaultCallbacks,
	}: SuccessfulPurchaseModalState['state'] & {
		callbacks?: ModalCallbacks;
		defaultCallbacks?: ModalCallbacks;
	}) => {
		successfulPurchaseModal$.state.set({
			...successfulPurchaseModal$.state.get(),
			collectibles,
			totalPrice,
			explorerName,
			explorerUrl: explorerUrl,
			ctaOptions,
		});
		successfulPurchaseModal$.callbacks.set(callbacks || defaultCallbacks);
		successfulPurchaseModal$.isOpen.set(true);
	},
	close: () => {
		successfulPurchaseModal$.isOpen.set(false);
		successfulPurchaseModal$.callbacks.set(undefined);
		successfulPurchaseModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		collectibles: [],
		totalPrice: '0',
		explorerName: '',
		explorerUrl: '',
		ctaOptions: undefined,
	},
	callbacks: undefined,
};

export const successfulPurchaseModal$: Observable<SuccessfulPurchaseModalState> = observable(initialState);
