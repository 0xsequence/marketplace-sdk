'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../types/waas-types';
import { useAutoSelectFeeOption } from '../../../..';
import { useConfig } from '../../../../hooks/config/useConfig';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';

interface UseWaasFeeManagementOptions {
	isProcessing: boolean;
	onCancel?: () => void;
}

export interface WaasFeeManagementState {
	isVisible: boolean;
	selectedFeeOption: FeeOption | undefined;
	pendingConfirmation: WaasFeeOptionConfirmation | undefined;
	confirmed: boolean;

	// UI control state
	shouldHideActionButton: boolean;
	waasFeeOptionsShown: boolean;
	isWaaS: boolean;
	isProcessingWithWaaS: boolean;

	setSelectedFeeOption: (option: FeeOption | undefined) => void;
	handleConfirm: () => void;
	handleCancel: () => void;
	reset: () => void;
	getActionLabel: (defaultLabel: string, loadingLabel?: string) => string;
}

export const useWaasFeeManagement = (
	options: UseWaasFeeManagementOptions,
): WaasFeeManagementState => {
	const { isProcessing, onCancel } = options;
	const config = useConfig();
	const { isWaaS } = useConnectorMetadata();
	const waasFeeOptionSelectionType =
		config.waasFeeOptionSelectionType || 'automatic';
	const [isVisible, setIsVisible] = useState(false);
	const [selectedFeeOption, setSelectedFeeOption] = useState<
		FeeOption | undefined
	>();
	const [confirmed, setConfirmed] = useState(false);
	const [pendingConfirmation, confirmFeeOption, rejectFeeOption] =
		useWaasFeeOptions();
	
	// Auto-select fee option for automatic mode
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
			!!pendingConfirmation && waasFeeOptionSelectionType === 'automatic',
	});

	// UI control calculations
	const isProcessingWithWaaS = isProcessing && isWaaS;

	const shouldHideActionButton =
		waasFeeOptionSelectionType === 'automatic'
			? false
			: isProcessingWithWaaS &&
				isVisible === true &&
				!!selectedFeeOption;

	const waasFeeOptionsShown =
		waasFeeOptionSelectionType === 'automatic'
			? false
			: isWaaS && isProcessing && isVisible;

	// Auto-select fee option effect
	useEffect(() => {
		if (
			waasFeeOptionSelectionType === 'automatic' &&
			autoSelectedFeeOptionPromise
		) {
			autoSelectedFeeOptionPromise.then((res) => {
				if (res.selectedOption) {
					setSelectedFeeOption(res.selectedOption);
				}
			});
		}
	}, [autoSelectedFeeOptionPromise, waasFeeOptionSelectionType]);

	// Handle pending confirmation visibility
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
		onCancel?.();
	};

	const reset = () => {
		setIsVisible(false);
		setSelectedFeeOption(undefined);
		setConfirmed(false);
	};

	const getActionLabel = (
		defaultLabel: string,
		loadingLabel = 'Loading fee options',
	) => {
		if (waasFeeOptionSelectionType === 'automatic') {
			return defaultLabel;
		}

		if (isProcessing) {
			return isWaaS ? loadingLabel : defaultLabel;
		}
		return defaultLabel;
	};

	return {
		isVisible,
		selectedFeeOption,
		pendingConfirmation: pendingConfirmation as
			| WaasFeeOptionConfirmation
			| undefined,
		confirmed,

		// UI control state
		shouldHideActionButton,
		waasFeeOptionsShown,
		isWaaS,
		isProcessingWithWaaS,

		setSelectedFeeOption,
		handleConfirm,
		handleCancel,
		reset,
		getActionLabel,
	};
};
