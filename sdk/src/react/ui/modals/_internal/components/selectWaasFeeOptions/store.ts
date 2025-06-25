'use client';

import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';

interface SelectWaasFeeOptionsContext {
	selectedFeeOption: FeeOption | undefined;
	pendingFeeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
	isVisible: boolean;
}

export const selectWaasFeeOptionsStore = createStore({
	context: {
		selectedFeeOption: undefined,
		pendingFeeOptionConfirmation: undefined,
		isVisible: false,
	} as SelectWaasFeeOptionsContext,
	on: {
		show: (context) => ({
			...context,
			isVisible: true,
		}),
		hide: () => ({
			selectedFeeOption: undefined,
			pendingFeeOptionConfirmation: undefined,
			isVisible: false,
		}),
		setSelectedFeeOption: (context, event: { feeOption: FeeOption | undefined }) => ({
			...context,
			selectedFeeOption: event.feeOption,
		}),
		setPendingFeeOptionConfirmation: (
			context,
			event: { confirmation: WaasFeeOptionConfirmation | undefined }
		) => ({
			...context,
			pendingFeeOptionConfirmation: event.confirmation,
		}),
	},
});

// React hooks
export const useSelectWaasFeeOptionsStore = () => {
	const isVisible = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.isVisible
	);
	const selectedFeeOption = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.selectedFeeOption
	);
	const pendingFeeOptionConfirmation = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.pendingFeeOptionConfirmation
	);

	return {
		isVisible,
		selectedFeeOption,
		pendingFeeOptionConfirmation,
		show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
		hide: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		setSelectedFeeOption: (feeOption: FeeOption | undefined) =>
			selectWaasFeeOptionsStore.send({ type: 'setSelectedFeeOption', feeOption }),
		setPendingFeeOptionConfirmation: (confirmation: WaasFeeOptionConfirmation | undefined) =>
			selectWaasFeeOptionsStore.send({ type: 'setPendingFeeOptionConfirmation', confirmation }),
	};
};

// Temporary backward compatibility layer for WaasFeeOptionsSelect component
// which still uses Legend State's Observable pattern
const createMockObservable = <T>(
	getter: () => T,
	setter: (value: T) => void
) => {
	return {
		get: getter,
		set: setter,
		peek: getter, // Legend State method
		onChange: () => () => {}, // Legend State method - returns unsubscribe function
		delete: () => {}, // Legend State method
		assign: () => {}, // Legend State method
	};
};

export const selectWaasFeeOptions$ = {
	isVisible: createMockObservable(
		() => selectWaasFeeOptionsStore.getSnapshot().context.isVisible,
		(value: boolean) => {
			selectWaasFeeOptionsStore.send({ type: value ? 'show' : 'hide' });
		}
	),
	selectedFeeOption: createMockObservable(
		() => selectWaasFeeOptionsStore.getSnapshot().context.selectedFeeOption,
		(value: FeeOption | undefined) => {
			selectWaasFeeOptionsStore.send({ type: 'setSelectedFeeOption', feeOption: value });
		}
	),
	pendingFeeOptionConfirmation: createMockObservable(
		() => selectWaasFeeOptionsStore.getSnapshot().context.pendingFeeOptionConfirmation,
		(value: WaasFeeOptionConfirmation | undefined) => {
			selectWaasFeeOptionsStore.send({ type: 'setPendingFeeOptionConfirmation', confirmation: value });
		}
	),
	hide: () => {
		selectWaasFeeOptionsStore.send({ type: 'hide' });
	},
};