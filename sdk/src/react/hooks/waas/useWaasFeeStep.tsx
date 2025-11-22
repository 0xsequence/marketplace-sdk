'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { useCallback, useEffect, useState } from 'react';
import type {
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../types/waas-types';

export type WaasFeeSelectionStep = {
	id: 'waas-fee-selection';
	label: string;
	status: string;
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	waasFee: {
		feeOptionConfirmation: WaasFeeOptionConfirmation;
		selectedOption: FeeOptionExtended | undefined;
		optionConfirmed: boolean;
		waasFeeSelectionError: Error | undefined;
		setSelectedFeeOption: (option: FeeOptionExtended | undefined) => void;
		confirmFeeOption: (id: string, address: string | null) => void;
		rejectFeeOption: (id: string) => void;
		setOptionConfirmed: (confirmed: boolean) => void;
	};
	run: () => void;
};

export function useWaasFeeStep({
	enabled = true,
}: {
	enabled?: boolean;
} = {}): WaasFeeSelectionStep | null {
	const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] =
		useWaasFeeOptions();

	const [selectedOption, setSelectedOption] = useState<
		FeeOptionExtended | undefined
	>(undefined);
	const [optionConfirmed, setOptionConfirmed] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);

	// Reset state when confirmation ID changes
	useEffect(() => {
		if (feeOptionConfirmation?.id) {
			setSelectedOption(undefined);
			setOptionConfirmed(false);
			setError(undefined);
		}
	}, [feeOptionConfirmation?.id]);

	// Auto-select first option if available and none selected
	useEffect(() => {
		if (
			feeOptionConfirmation?.options &&
			feeOptionConfirmation.options.length > 0 &&
			!selectedOption
		) {
			setSelectedOption(feeOptionConfirmation.options[0] as FeeOptionExtended);
		}
	}, [feeOptionConfirmation, selectedOption]);

	const createStep = useCallback((): WaasFeeSelectionStep | null => {
		if (!enabled || !feeOptionConfirmation) return null;

		return {
			id: 'waas-fee-selection',
			label: 'Select Fee Option',
			status: optionConfirmed ? 'success' : selectedOption ? 'idle' : 'pending',
			isPending: !selectedOption,
			isSuccess: optionConfirmed,
			isError: !!error,
			waasFee: {
				feeOptionConfirmation,
				selectedOption,
				optionConfirmed,
				waasFeeSelectionError: error,
				setSelectedFeeOption: setSelectedOption,
				confirmFeeOption,
				rejectFeeOption,
				setOptionConfirmed,
			},
			run: () => {},
		};
	}, [
		enabled,
		feeOptionConfirmation,
		selectedOption,
		optionConfirmed,
		error,
		confirmFeeOption,
		rejectFeeOption,
	]);

	return createStep();
}
