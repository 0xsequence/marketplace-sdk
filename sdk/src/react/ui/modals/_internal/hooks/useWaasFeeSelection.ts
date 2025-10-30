'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../types/waas-types';
import { useAutoSelectFeeOption } from '../../../..';
import type { WaasFeeOptionSelectionType } from '../types';

interface UseWaasFeeSelectionOptions {
	onCancel?: () => void;
	waasFeeOptionSelectionType?: WaasFeeOptionSelectionType;
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
	const autoSelectedFeeOptionPromise = useAutoSelectFeeOption({
		pendingFeeOptionConfirmation: pendingConfirmation
			? {
					id: pendingConfirmation.id,
					options: pendingConfirmation.options as FeeOption[],
					chainId: pendingConfirmation.chainId,
				}
			: {
					id: '',
					options: undefined,
					chainId: 0,
				},
		enabled:
			!!pendingConfirmation &&
			options?.waasFeeOptionSelectionType === 'automatic',
	});

	useEffect(() => {
		if (
			options?.waasFeeOptionSelectionType === 'automatic' &&
			autoSelectedFeeOptionPromise
		) {
			autoSelectedFeeOptionPromise.then((res) => {
				if (res.selectedOption) {
					setSelectedFeeOption(res.selectedOption);
				}
			});
		}
	}, [autoSelectedFeeOptionPromise, options?.waasFeeOptionSelectionType]);

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
		pendingConfirmation: pendingConfirmation as
			| WaasFeeOptionConfirmation
			| undefined,
		confirmed,

		// Actions
		setSelectedFeeOption,
		handleConfirm,
		handleCancel,
		reset,
	};
};
