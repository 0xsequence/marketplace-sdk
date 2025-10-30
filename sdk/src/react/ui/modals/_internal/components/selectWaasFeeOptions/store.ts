'use client';

/**
 * @deprecated This store is deprecated and should not be used directly.
 * Components should now receive WaaS state via props instead of accessing this global store.
 * This file is kept for backward compatibility only and will be removed in a future version.
 *
 * Migration: Pass WaaS state via props to SelectWaasFeeOptions component instead.
 * See WAAS_MIGRATION_STATUS.md for migration guide.
 */

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

/**
 * @deprecated Use local state management in modal components instead
 */
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
/**
 * @deprecated Use local state management in modal components instead
 */
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
