'use client';

import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { FeeOption } from '../../../../../../types/waas-types';

interface SelectWaasFeeOptionsContext {
	id: string | undefined;
	selectedFeeOption: FeeOption | undefined;
	isVisible: boolean;
}

export const selectWaasFeeOptionsStore = createStore({
	context: {
		id: undefined,
		selectedFeeOption: undefined,
		isVisible: false,
	} as SelectWaasFeeOptionsContext,
	on: {
		show: (context) => ({
			...context,
			isVisible: true,
		}),
		hide: () => ({
			id: undefined,
			selectedFeeOption: undefined,
			isVisible: false,
		}),
		setSelectedFeeOption: (
			context,
			event: { feeOption: FeeOption | undefined },
		) => ({
			...context,
			selectedFeeOption: event.feeOption,
		}),
	},
});

// React hooks
export const useSelectWaasFeeOptionsStore = () => {
	const isVisible = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.isVisible,
	);
	const id = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.id,
	);
	const selectedFeeOption = useSelector(
		selectWaasFeeOptionsStore,
		(state) => state.context.selectedFeeOption,
	);

	return {
		isVisible,
		id,
		selectedFeeOption,
		show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
		hide: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		setSelectedFeeOption: (feeOption: FeeOption | undefined) =>
			selectWaasFeeOptionsStore.send({
				type: 'setSelectedFeeOption',
				feeOption,
			}),
	};
};
