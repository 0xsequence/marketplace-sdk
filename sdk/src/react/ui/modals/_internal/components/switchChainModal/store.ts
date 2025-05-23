import { observable } from '@legendapp/state';
import type { SwitchChainError } from 'viem';
import type { ShowSwitchChainModalArgs } from '.';

export interface SwitchChainModalState {
	isOpen: boolean;
	open: (args: ShowSwitchChainModalArgs) => void;
	close: () => void;
	state: {
		chainIdToSwitchTo: number | undefined;
		isSwitching: boolean;
		onSuccess: (() => void) | undefined;
		onError: undefined | ((error: SwitchChainError) => void);
		onClose: (() => void) | undefined;
	};
}

export const initialState: SwitchChainModalState = {
	isOpen: false,
	open: ({ chainIdToSwitchTo, onError, onSuccess, onClose }) => {
		switchChainModal$.state.set({
			...switchChainModal$.state.get(),
			chainIdToSwitchTo,
			onError,
			onSuccess,
			onClose,
		});
		switchChainModal$.isOpen.set(true);
	},
	close: () => {
		switchChainModal$.isOpen.set(false);
	},
	state: {
		chainIdToSwitchTo: undefined,
		onError: undefined,
		onSuccess: undefined,
		onClose: undefined,
		isSwitching: false,
	},
};

export const switchChainModal$ = observable(initialState);
