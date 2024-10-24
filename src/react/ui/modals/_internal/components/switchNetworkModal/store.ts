import { observable } from '@legendapp/state';
import type { ShowSwitchChainModalArgs } from '.';

export interface SwitchChainModalState {
	isOpen: boolean;
	open: (args: ShowSwitchChainModalArgs) => void;
	close: () => void;
	state: {
		chainIdToSwitchTo?: number;
		onSwitchChain?: () => void;
	};
}

export const initialState: SwitchChainModalState = {
	isOpen: false,
	open: ({ chainIdToSwitchTo, onSwitchChain }) => {
		switchChainModal$.state.set({
			...switchChainModal$.state.get(),
			chainIdToSwitchTo,
			onSwitchChain,
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
		onSwitchChain: () => {},
	},
};

export const switchChainModal$ = observable(initialState);
