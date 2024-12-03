import { observable } from '@legendapp/state';
import type { SwitchChainErrorType } from 'viem';
import type { ShowSwitchChainModalArgs } from '.';
import type { ChainId } from '../../../../../_internal';

export interface SwitchChainModalState {
	isOpen: boolean;
	open: (args: ShowSwitchChainModalArgs) => void;
	close: () => void;
	state: {
		chainIdToSwitchTo: ChainId | undefined;
		isSwitching: boolean;
		onSuccess: (() => void) | undefined;
		onError: undefined | ((error: SwitchChainErrorType) => void);
	};
}

export const initialState: SwitchChainModalState = {
	isOpen: false,
	open: ({ chainIdToSwitchTo, onError, onSuccess }) => {
		switchChainModal$.state.set({
			...switchChainModal$.state.get(),
			chainIdToSwitchTo,
			onError,
			onSuccess,
		});
		switchChainModal$.isOpen.set(true);
	},
	close: () => {
		switchChainModal$.isOpen.set(false);
		switchChainModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		chainIdToSwitchTo: undefined,
		onError: undefined,
		onSuccess: undefined,
		isSwitching: false,
	},
};

export const switchChainModal$ = observable(initialState);
