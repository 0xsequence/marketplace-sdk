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

type SetVisibleEvent = { type: 'setVisible'; isVisible: boolean };
type SetSelectedFeeOptionEvent = {
	type: 'setSelectedFeeOption';
	feeOption: FeeOption | undefined;
};
type SetPendingFeeOptionConfirmationEvent = {
	type: 'setPendingFeeOptionConfirmation';
	confirmation: WaasFeeOptionConfirmation | undefined;
};

export const selectWaasFeeOptions$ = createStore({
	context: initialState,
	on: {
		hide: () => ({ ...initialState }),
		setVisible: (context, event: SetVisibleEvent) => ({
			...context,
			isVisible: event.isVisible,
		}),
		setSelectedFeeOption: (context, event: SetSelectedFeeOptionEvent) => ({
			...context,
			selectedFeeOption: event.feeOption,
		}),
		setPendingFeeOptionConfirmation: (
			context,
			event: SetPendingFeeOptionConfirmationEvent,
		) => ({
			...context,
			pendingFeeOptionConfirmation: event.confirmation,
		}),
	},
});

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
