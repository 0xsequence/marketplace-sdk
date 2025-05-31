import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';

type SelectWaasFeeOptionsState = {
	selectedFeeOption: FeeOption | undefined;
	pendingFeeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
	isVisible: boolean;
};

const initialState: SelectWaasFeeOptionsState = {
	selectedFeeOption: undefined,
	pendingFeeOptionConfirmation: undefined,
	isVisible: false,
};

export const selectWaasFeeOptions$ = createStore<SelectWaasFeeOptionsState>(
	initialState,
	{
		hide: () => ({
			...initialState,
		}),
		setVisible: (context, event: { isVisible: boolean }) => ({
			...context,
			isVisible: event.isVisible,
		}),
		setSelectedFeeOption: (
			context,
			event: { feeOption: FeeOption | undefined },
		) => ({
			...context,
			selectedFeeOption: event.feeOption,
		}),
		setPendingFeeOptionConfirmation: (
			context,
			event: { confirmation: WaasFeeOptionConfirmation | undefined },
		) => ({
			...context,
			pendingFeeOptionConfirmation: event.confirmation,
		}),
	},
);

export const hide = () => {
	selectWaasFeeOptions$.send({ type: 'hide' });
};

// Selector hooks
export const useIsVisible = () =>
	useSelector(selectWaasFeeOptions$, (state) => state.context.isVisible);

export const useSelectedFeeOption = () =>
	useSelector(
		selectWaasFeeOptions$,
		(state) => state.context.selectedFeeOption,
	);

export const usePendingFeeOptionConfirmation = () =>
	useSelector(
		selectWaasFeeOptions$,
		(state) => state.context.pendingFeeOptionConfirmation,
	);

// Rename store for consistency
export const selectWaasFeeOptionsStore = selectWaasFeeOptions$;
