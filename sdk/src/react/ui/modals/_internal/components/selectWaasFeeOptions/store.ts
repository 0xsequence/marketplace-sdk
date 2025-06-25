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
});

// React hooks
export const useSelectWaasFeeOptionsStore = () => {
	const isVisible = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.isVisible,
	);
	const selectedFeeOption = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.selectedFeeOption,
	);
	const pendingFeeOptionConfirmation = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.pendingFeeOptionConfirmation,
	);

	return {
		isVisible,
		selectedFeeOption,
		pendingFeeOptionConfirmation,
		show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
		hide: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		setSelectedFeeOption: (feeOption: FeeOption | undefined) =>
			selectWaasFeeOptionsStore.send({
				type: 'setSelectedFeeOption',
				feeOption,
			}),
		setPendingFeeOptionConfirmation: (
			confirmation: WaasFeeOptionConfirmation | undefined,
		) =>
			selectWaasFeeOptionsStore.send({
				type: 'setPendingFeeOptionConfirmation',
				confirmation,
			}),
	};
};
