'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../types/waas-types';

interface UseWaasFeeSelectionOptions {
	onCancel?: () => void;
}

export interface WaasFeeSelectionState {
	isVisible: boolean;
	selectedFeeOption: FeeOption | undefined;
	pendingConfirmation: WaasFeeOptionConfirmation | undefined;
	confirmed: boolean;

	setSelectedFeeOption: (option: FeeOption | undefined) => void;
	handleConfirm: () => void;
	handleCancel: () => void;
	reset: () => void;
}

export const useWaasFeeSelection = (
	options?: UseWaasFeeSelectionOptions,
): WaasFeeSelectionState => {
	const [isVisible, setIsVisible] = useState(false);
	const [selectedFeeOption, setSelectedFeeOption] = useState<
		FeeOption | undefined
	>();
	const [confirmed, setConfirmed] = useState(false);

	const [pendingConfirmation, confirmFeeOption, rejectFeeOption] =
		useWaasFeeOptions();

	useEffect(() => {
		if (pendingConfirmation && !isVisible) {
			setIsVisible(true);
			if (
				pendingConfirmation.options &&
				pendingConfirmation.options.length > 0
			) {
				setSelectedFeeOption(pendingConfirmation.options[0] as FeeOption);
			}
		}
	}, [pendingConfirmation, isVisible]);

	const handleConfirm = () => {
		if (!selectedFeeOption?.token || !pendingConfirmation?.id) {
			return;
		}

		confirmFeeOption(
			pendingConfirmation.id,
			selectedFeeOption.token.contractAddress || zeroAddress,
		);

		setConfirmed(true);
	};

	const handleCancel = () => {
		if (pendingConfirmation?.id) {
			rejectFeeOption(pendingConfirmation.id);
		}
		setIsVisible(false);
		options?.onCancel?.();
	};

	const reset = () => {
		setIsVisible(false);
		setSelectedFeeOption(undefined);
		setConfirmed(false);
	};

	return {
		isVisible,
		selectedFeeOption,
		pendingConfirmation,
		confirmed,

		// Actions
		setSelectedFeeOption,
		handleConfirm,
		handleCancel,
		reset,
	};
};
