import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { ShowSwitchChainModalArgs } from '.';

export interface SwitchChainModalState {
	isOpen: boolean;
	chainIdToSwitchTo: number | undefined;
	isSwitching: boolean;
}

const initialContext: SwitchChainModalState = {
	isOpen: false,
	chainIdToSwitchTo: undefined,
	isSwitching: false,
};

export const switchChainModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: ShowSwitchChainModalArgs) => ({
			...context,
			isOpen: true,
			chainIdToSwitchTo: event.chainIdToSwitchTo,
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			chainIdToSwitchTo: undefined,
			isSwitching: false,
		}),
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(switchChainModalStore, (state) => state.context.isOpen);

export const useChainIdToSwitchTo = () =>
	useSelector(
		switchChainModalStore,
		(state) => state.context.chainIdToSwitchTo,
	);
