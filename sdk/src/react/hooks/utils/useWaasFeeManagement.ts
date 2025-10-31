'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../types/waas-types';
import {
	AutoSelectFeeOptionError,
	useAutoSelectFeeOption,
} from '../../hooks/utils/useAutoSelectFeeOption';
import { useConfig } from '../config/useConfig';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

interface UseWaasFeeManagementOptions {
	isProcessing: boolean;
	onCancel?: () => void;
	onAutoSelectError?: (error: Error | undefined) => void;
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

/**
 * A React hook that manages WaaS (Wallet as a Service) fee option selection and confirmation flow.
 * 
 * This hook handles the complete lifecycle of WaaS fee management including:
 * - Automatic or manual fee option selection based on configuration
 * - Fee option confirmation and rejection
 * - UI state management for fee selection components
 * - Balance validation and error handling
 * 
 * WaaS fee options allow users to pay transaction fees using different tokens (ERC-20 or native)
 * when using Sequence's Wallet as a Service. The hook supports both automatic selection
 * (where the first affordable option is chosen) and manual selection (where users choose).
 *
 * @param options - Configuration options for the hook
 * @param options.isProcessing - Whether a transaction is currently being processed
 * @param options.onCancel - Optional callback fired when fee selection is cancelled
 * @param options.onAutoSelectError - Optional callback fired when automatic fee selection fails
 *
 * @returns {WaasFeeManagementState} Object containing:
 * 
 * **State Properties:**
 * - `isVisible` - Whether the fee selection UI should be visible
 * - `selectedFeeOption` - Currently selected fee option (token and amount)
 * - `pendingConfirmation` - Pending fee option confirmation from WaaS provider
 * - `confirmed` - Whether the selected fee option has been confirmed
 * 
 * **UI Control Properties:**
 * - `shouldHideActionButton` - Whether to hide the main action button during fee selection
 * - `waasFeeOptionsShown` - Whether fee options UI should be displayed
 * - `isWaaS` - Whether the current wallet connection is using WaaS
 * - `isProcessingWithWaaS` - Whether processing is active with a WaaS wallet
 * 
 * **Action Methods:**
 * - `setSelectedFeeOption` - Function to update the selected fee option
 * - `handleConfirm` - Function to confirm the selected fee option
 * - `handleCancel` - Function to cancel fee selection and reject pending confirmation
 * - `reset` - Function to reset all state to initial values
 * - `getActionLabel` - Function to get appropriate action button label based on state
 *
 * @example
 * ```tsx
 * // Basic usage in a transaction modal
 * function TransferModal() {
 *   const [isProcessing, setIsProcessing] = useState(false);
 *   
 *   const waasFees = useWaasFeeManagement({
 *     isProcessing,
 *     onCancel: () => {
 *       setIsProcessing(false);
 *       console.log('Fee selection cancelled');
 *     },
 *     onAutoSelectError: (error) => {
 *       if (error) {
 *         console.error('Auto-select failed:', error.message);
 *         setIsProcessing(false);
 *       }
 *     },
 *   });
 *
 *   const { waasFeeOptionsShown, shouldHideActionButton, getActionLabel } = waasFees;
 *
 *   return (
 *     <div>
 *       <button 
 *         onClick={() => setIsProcessing(true)}
 *         hidden={shouldHideActionButton}
 *       >
 *         {getActionLabel('Transfer', 'Loading fee options...')}
 *       </button>
 *       
 *       {waasFeeOptionsShown && (
 *         <SelectWaasFeeOptions 
 *           chainId={chainId}
 *           waasFees={waasFees}
 *           titleOnConfirm="Processing transfer..."
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useWaasFeeOptions} - Lower-level hook for WaaS fee option management
 * @see {@link useAutoSelectFeeOption} - Hook for automatic fee option selection
 * @see {@link SelectWaasFeeOptions} - UI component that uses this hook
 */
export const useWaasFeeManagement = (
	options: UseWaasFeeManagementOptions,
): WaasFeeManagementState => {
	const { isProcessing, onCancel, onAutoSelectError } = options;
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
	const autoSelectResult = useAutoSelectFeeOption({
		enabled:
			!!pendingConfirmation?.id && waasFeeOptionSelectionType === 'automatic',
	});

	const isProcessingWithWaaS = isProcessing && isWaaS;

	const shouldHideActionButton =
		waasFeeOptionSelectionType === 'automatic'
			? false
			: isProcessingWithWaaS && isVisible === true && !!selectedFeeOption;

	const waasFeeOptionsShown =
		waasFeeOptionSelectionType === 'automatic'
			? false
			: isWaaS && isProcessing && isVisible;

	// Auto-select fee option effect
	useEffect(() => {
		if (
			waasFeeOptionSelectionType === 'automatic' &&
			autoSelectResult &&
			pendingConfirmation?.id &&
			pendingConfirmation.options &&
			pendingConfirmation.options.length > 0
		) {
			autoSelectResult()
				.then((result) => {
					if (result.selectedOption && pendingConfirmation?.id) {
						setSelectedFeeOption(result.selectedOption as FeeOption);

						confirmFeeOption(
							pendingConfirmation.id,
							result.selectedOption.token.contractAddress || zeroAddress,
						);
						setConfirmed(true);
					}
				})
				.catch((error: Error) => {
					if (
						error.message ===
						AutoSelectFeeOptionError.InsufficientBalanceForAnyFeeOption
					) {
						onAutoSelectError?.(new Error(error.message));
					}
				});
		}
	}, [
		waasFeeOptionSelectionType,
		autoSelectResult,
		pendingConfirmation?.id,
		pendingConfirmation?.options,
		onAutoSelectError,
		confirmFeeOption,
	]);

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
