import type { ComponentType } from 'react';

import type { IconProps } from '@0xsequence/design-system';
import { observable } from '@legendapp/state';
import type { TokenMetadata } from '../../../_internal';

export interface SuccessfulPurchaseModalState {
	isOpen: boolean;
	open: (args: SuccessfulPurchaseModalState['state']) => void;
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
}

const initialState: SuccessfulPurchaseModalState = {
	isOpen: false,
	open: ({
		collectibles,
		totalPrice,
		explorerName,
		explorerUrl,
		ctaOptions,
	}: SuccessfulPurchaseModalState['state']) => {
		successfulPurchaseModal$.state.set({
			...successfulPurchaseModal$.state.get(),
			collectibles,
			totalPrice,
			explorerName,
			explorerUrl: explorerUrl,
			ctaOptions,
		});
		successfulPurchaseModal$.isOpen.set(true);
	},
	close: () => {
		successfulPurchaseModal$.isOpen.set(false);
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
};

export const successfulPurchaseModal$ = observable(initialState);
