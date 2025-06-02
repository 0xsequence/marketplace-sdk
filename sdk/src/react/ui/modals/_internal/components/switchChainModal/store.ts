import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { SwitchChainError } from 'viem';
import type { ShowSwitchChainModalArgs } from '.';

export interface SwitchChainModalState {
	isOpen: boolean;
	chainIdToSwitchTo: number | undefined;
	isSwitching: boolean;
	onSuccess: (() => void) | undefined;
	onError: undefined | ((error: SwitchChainError) => void);
	onClose: (() => void) | undefined;
}

const initialContext: SwitchChainModalState = {
	isOpen: false,
	chainIdToSwitchTo: undefined,
	isSwitching: false,
	onSuccess: undefined,
	onError: undefined,
	onClose: undefined,
};

export const switchChainModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: ShowSwitchChainModalArgs) => ({
			...context,
			isOpen: true,
			chainIdToSwitchTo: event.chainIdToSwitchTo,
			onSuccess: event.onSuccess,
			onError: event.onError,
			onClose: event.onClose,
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			chainIdToSwitchTo: undefined,
			isSwitching: false,
			onSuccess: undefined,
			onError: undefined,
			onClose: undefined,
		}),
		setSwitching: (context, event: { isSwitching: boolean }) => ({
			...context,
			isSwitching: event.isSwitching,
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

export const useIsSwitching = () =>
	useSelector(switchChainModalStore, (state) => state.context.isSwitching);

export const useOnSuccess = () =>
	useSelector(switchChainModalStore, (state) => state.context.onSuccess);

export const useOnError = () =>
	useSelector(switchChainModalStore, (state) => state.context.onError);

export const useOnClose = () =>
	useSelector(switchChainModalStore, (state) => state.context.onClose);
