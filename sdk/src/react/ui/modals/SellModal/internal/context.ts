import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
import type {
	FeeOptionExtended,
	WaasFeeConfirmationState,
	WaasFeeOptionConfirmation,
} from '../../../../../types/waas-types';
import type { Order } from '../../../../_internal';
import {
	useAutoSelectFeeOption,
	useCollectionDetail,
	useConfig,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-generate-sell-transaction';

/**
 * WaaS fee option state and controls.
 *
 * Contains the current fee selection state, available options, and methods to
 * select/confirm fee options for WaaS wallets.
 *
 * @example
 * ```tsx
 * const context = useSellModalContext();
 * const feeStep = context.flow.steps.find(s => s.id === 'waas-fee-selection');
 *
 * if (feeStep?.id === 'waas-fee-selection') {
 *   const { waasFee } = feeStep;
 *   return (
 *     <div>
 *       {waasFee.feeOptionConfirmation.options.map(option => (
 *         <button
 *           key={option.token.contractAddress}
 *           onClick={() => waasFee.setSelectedFeeOption(option)}
 *           disabled={!option.hasEnoughBalanceForFee}
 *         >
 *           {option.token.symbol}: {option.token.balanceFormatted}
 *         </button>
 *       ))}
 *       <button
 *         onClick={() => {
 *           waasFee.confirmFeeOption(
 *             waasFee.feeOptionConfirmation.id,
 *             waasFee.selectedOption.token.contractAddress
 *           );
 *           waasFee.setOptionConfirmed(true);
 *         }}
 *         disabled={!waasFee.selectedOption?.hasEnoughBalanceForFee}
 *       >
 *         Confirm
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export type WaasFee = Omit<
	WaasFeeConfirmationState,
	'feeOptionConfirmation'
> & {
	feeOptionConfirmation: WaasFeeOptionConfirmation;
	waasFeeSelectionError?: Error;
	setSelectedFeeOption: (option: FeeOptionExtended | undefined) => void;
	rejectFeeOption: (id: string) => void;
};

export type SellStepId = 'waas-fee-selection' | 'approve' | 'sell';

/**
 * Base step type for sell modal flow.
 *
 * Each step represents a stage in the sell process (fee selection, approval, sell).
 * Steps have status tracking and a run method to execute the step.
 */
export type Step = {
	id: SellStepId;
	label: string;
	status: string;
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	run: () => void;
};

/**
 * WaaS fee selection step.
 *
 * Only present when using a WaaS wallet in manual mode. Contains fee option
 * state and controls for custom UI implementations.
 *
 * @example
 * ```tsx
 * const context = useSellModalContext();
 * const feeStep = context.flow.steps.find(
 *   (s): s is WaasFeeSelectionStep => s.id === 'waas-fee-selection'
 * );
 *
 * if (feeStep) {
 *   // Build custom fee selection UI
 *   return <CustomFeeSelector waasFee={feeStep.waasFee} />;
 * }
 * ```
 */
export type WaasFeeSelectionStep = Step & {
	id: 'waas-fee-selection';
	waasFee: WaasFee;
};

export type SellStep = Step & { id: 'sell' };

/**
 * Type-safe sell steps array.
 *
 * Guarantees at least one step (sell), with optional fee selection and approval steps.
 */
export type SellSteps = [...Step[], SellStep];

export type OnSuccessCallback =
	| (({
			hash,
			orderId,
			offer,
	  }: {
			hash?: Hash;
			orderId?: string;
			offer?: Order | undefined;
	  }) => void)
	| {
			callback: ({
				hash,
				orderId,
				offer,
			}: {
				hash?: Hash;
				orderId?: string;
				offer?: Order | undefined;
			}) => void;
			showDefaultTxStatusModal?: boolean;
	  };

type UseSellModalContextParams = {
	onSuccess?: OnSuccessCallback;
};

/**
 * Sell modal context hook.
 *
 * Manages the entire sell flow including WaaS fee selection, token approval,
 * and sell transaction execution.
 *
 * @example
 * ```tsx
 * // Basic usage with default UI
 * const context = useSellModalContext();
 *
 * @example
 * ```tsx
 * // Custom UI with fee selection
 * const context = useSellModalContext();
 * const feeStep = context.flow.steps.find(
 *   (s): s is WaasFeeSelectionStep => s.id === 'waas-fee-selection'
 * );
 *
 * if (feeStep) {
 *   return (
 *     <CustomFeeSelector
 *       options={feeStep.waasFee.feeOptionConfirmation.options}
 *       selected={feeStep.waasFee.selectedOption}
 *       onSelect={feeStep.waasFee.setSelectedFeeOption}
 *       onConfirm={() => {
 *         feeStep.waasFee.confirmFeeOption(
 *           feeStep.waasFee.feeOptionConfirmation.id,
 *           feeStep.waasFee.selectedOption.token.contractAddress
 *         );
 *         feeStep.waasFee.setOptionConfirmed(true);
 *       }}
 *     />
 *   );
 * }
 * ```
 */

export function useSellModalContext({
	onSuccess,
}: UseSellModalContextParams = {}) {
	const state = useSellModalState();
	const config = useConfig();
	const { isWaaS, walletKind } = useConnectorMetadata();
	const { address } = useAccount();
	const [selectedFeeOption, setSelectedFeeOption] = useState<
		FeeOptionExtended | undefined
	>(undefined);
	const [optionConfirmed, setOptionConfirmed] = useState(false);
	const [waasFeeSelectionError, setWaasFeeSelectionError] = useState<
		Error | undefined
	>(undefined);
	const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] =
		useWaasFeeOptions();
	const autoSelectFeeOption = useAutoSelectFeeOption({
		enabled: config.waasFeeOptionSelectionType === 'automatic',
	});

	// Automatic mode: Auto-select and auto-confirm
	useEffect(() => {
		if (config.waasFeeOptionSelectionType !== 'automatic') {
			return;
		}

		if (!feeOptionConfirmation?.id) {
			return;
		}

		// Skip if already confirmed
		if (optionConfirmed) {
			return;
		}

		autoSelectFeeOption()
			.then((result) => {
				if (!result.selectedOption) {
					console.warn(
						'[WaaS Fee Auto-Selection] No fee option could be auto-selected',
					);
					setWaasFeeSelectionError(
						new Error('No fee option with sufficient balance available'),
					);
					return;
				}

				console.log(
					'[WaaS Fee Auto-Selection] Auto-selected fee option:',
					result.selectedOption.token.symbol,
				);

				// Set the selected option in state
				setSelectedFeeOption(result.selectedOption);

				// Auto-confirm immediately
				confirmFeeOption(
					feeOptionConfirmation.id,
					result.selectedOption.token.contractAddress as string | null,
				);
				setOptionConfirmed(true);

				console.log(
					'[WaaS Fee Auto-Selection] Fee option confirmed automatically',
				);
			})
			.catch((error) => {
				if (error.message === 'Balances are still loading') {
					console.log(
						'[WaaS Fee Auto-Selection] Balances still loading, will retry...',
					);
					return;
				}
				console.error('[WaaS Fee Auto-Selection] Error:', error.message);
				setWaasFeeSelectionError(error);
			});
	}, [
		config.waasFeeOptionSelectionType,
		autoSelectFeeOption,
		confirmFeeOption,
		feeOptionConfirmation,
		optionConfirmed,
	]);

	// Manual mode: Pre-select for UI but don't confirm
	useEffect(() => {
		if (config.waasFeeOptionSelectionType === 'automatic') {
			return;
		}

		const options = feeOptionConfirmation?.options as FeeOptionExtended[];
		if (!options || options.length === 0) {
			return;
		}

		// Pre-select first option with balance, or just first option
		const firstOptionWithBalance = options.find(
			(o) => o.hasEnoughBalanceForFee,
		);
		setSelectedFeeOption(firstOptionWithBalance || options[0]);
	}, [config.waasFeeOptionSelectionType, feeOptionConfirmation]);

	const collectionQuery = useCollectionDetail({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});
	const currencyQuery = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});

	const sellSteps = useGenerateSellTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		seller: address,
		marketplace: state.order?.marketplace,
		walletType: walletKind,
		ordersData: state.order
			? [
					{
						orderId: state.order.orderId,
						quantity: state.order.quantityRemaining,
						tokenId: state.tokenId,
					},
				]
			: undefined,
	});

	const { approve, sell } = useSellMutations({
		tx: sellSteps.data,
		onSuccess,
		waasFeeConfirmation: isWaaS
			? {
					feeOptionConfirmation,
					selectedOption: selectedFeeOption,
					optionConfirmed,
					confirmFeeOption,
					setOptionConfirmed,
				}
			: undefined,
	});

	const steps = [];

	// WaaS fee selection step (only in manual mode)
	if (
		isWaaS &&
		feeOptionConfirmation &&
		config.waasFeeOptionSelectionType !== 'automatic'
	) {
		steps.push({
			id: 'waas-fee-selection' satisfies SellStepId,
			label: 'Select Fee Option',
			status: optionConfirmed
				? 'success'
				: selectedFeeOption
					? 'idle'
					: 'pending',
			isPending: !selectedFeeOption,
			isSuccess: optionConfirmed,
			isError: !!waasFeeSelectionError,
			waasFee: {
				feeOptionConfirmation: feeOptionConfirmation,
				selectedOption: selectedFeeOption,
				optionConfirmed: optionConfirmed,
				waasFeeSelectionError: waasFeeSelectionError,
				setSelectedFeeOption: setSelectedFeeOption,
				confirmFeeOption: confirmFeeOption,
				rejectFeeOption: rejectFeeOption,
				setOptionConfirmed: setOptionConfirmed,
			},
			run: () => {},
		});
	}

	// Approval step (if needed)
	if (sellSteps.data?.approveStep && !approve.isSuccess) {
		steps.push({
			id: 'approve' satisfies SellStepId,
			label: 'Approve Token',
			status: approve.status,
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isError: !!approve.error,
			run: () => approve.mutate(),
		});
	}

	// Sell step
	// TODO: sell step never completes here, it completes via the success callback, we need to change this
	steps.push({
		id: 'sell' satisfies SellStepId,
		label: 'Accept Offer',
		status: sell.status,
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isError: !!sell.error,
		run: () => sell.mutate(),
	});
	// Determine if fee confirmation is blocking
	const feeStep = steps.find((s) => s.id === 'waas-fee-selection');
	const feeNeedsConfirmation =
		feeStep &&
		!feeStep.isSuccess &&
		config.waasFeeOptionSelectionType !== 'automatic';

	// Next executable step (fee selection blocks all other steps in manual mode)
	const nextStep = steps.find((step) => {
		// Skip fee selection step itself
		if (step.id === 'waas-fee-selection') return false;

		// Only consider idle steps
		if (step.status !== 'idle') return false;

		// Block if fee needs confirmation
		if (feeNeedsConfirmation) return false;

		return true;
	});

	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error
	);

	const mainSteps = steps.filter((s) => s.id !== 'waas-fee-selection');
	const totalSteps = mainSteps.length;
	const completedSteps = mainSteps.filter((s) => s.isSuccess).length;
	const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

	const mainStepsCompleted = mainSteps.filter((s) => s.isSuccess).length;
	const flowStatus: 'idle' | 'pending' | 'success' | 'error' = isPending
		? 'pending'
		: hasError
			? 'error'
			: mainStepsCompleted === totalSteps
				? 'success'
				: 'idle';

	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error;

	const handleClose = () => {
		if (selectedFeeOption) {
			setSelectedFeeOption(undefined);
			setOptionConfirmed(false);
		}

		if (feeOptionConfirmation?.id) {
			rejectFeeOption(feeOptionConfirmation.id);
		}

		state.closeModal();

		sell.reset();
		approve.reset();
	};

	return {
		isOpen: state.isOpen,
		close: handleClose,

		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collection: collectionQuery.data,
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount,
		},

		flow: {
			steps,
			nextStep,
			status: flowStatus,
			isPending,
			totalSteps,
			completedSteps,
			progress,
		},

		loading: {
			collection: collectionQuery.isLoading,
			currency: currencyQuery.isLoading,
			steps: sellSteps.isLoading,
		},

		transactions: {
			approve:
				approve.data?.type === 'transaction' ? approve.data.hash : undefined,
			sell: sell.data?.type === 'transaction' ? sell.data.hash : undefined,
		},

		error,
		queries: {
			collection: collectionQuery,
			currency: currencyQuery,
		},
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
