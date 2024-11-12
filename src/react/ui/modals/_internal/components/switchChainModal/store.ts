import { observable } from '@legendapp/state';
import type { ShowSwitchChainModalArgs } from '.';
import type { SwitchChainCallbacks } from '../../../../../../types/messages';

export interface SwitchChainModalState {
	isOpen: boolean;
	open: (args: ShowSwitchChainModalArgs) => void;
	close: () => void;
	state: {
		chainIdToSwitchTo?: number;
		onSwitchChain?: () => void;
		isSwitching: boolean;
		callbacks?: SwitchChainCallbacks;
	};
}

export const initialState: SwitchChainModalState = {
	isOpen: false,
	open: ({ chainIdToSwitchTo, onSwitchChain, callbacks }) => {
		switchChainModal$.state.set({
			...switchChainModal$.state.get(),
			chainIdToSwitchTo,
			onSwitchChain,
			callbacks
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
		isSwitching: false,
	},
};

export const switchChainModal$ = observable(initialState);
