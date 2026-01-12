import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { ShowSwitchChainModalArgs } from '.';

export type SwitchChainErrorModalState = {
	isOpen: boolean;
	chainIdToSwitchTo: number | undefined;
	isSwitching: boolean;
};

const initialContext: SwitchChainErrorModalState = {
	isOpen: false,
	chainIdToSwitchTo: undefined,
	isSwitching: false,
};

export const switchChainErrorModalStore = createStore({
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
	useSelector(switchChainErrorModalStore, (state) => state.context.isOpen);

export const useChainIdToSwitchTo = () =>
	useSelector(
		switchChainErrorModalStore,
		(state) => state.context.chainIdToSwitchTo,
	);
