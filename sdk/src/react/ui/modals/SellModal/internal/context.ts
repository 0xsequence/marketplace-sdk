import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
import type {
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../../../types/waas-types';
import type { Order } from '../../../../_internal';
import {
	useCollectionDetail,
	useConfig,
	useConnectorMetadata,
	useCurrency,
	useWaasFeeStep,
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
export type WaasFee = {
	feeOptionConfirmation: WaasFeeOptionConfirmation;
	selectedOption: FeeOptionExtended | undefined;
	optionConfirmed: boolean;
	waasFeeSelectionError?: Error;
	setSelectedFeeOption: (option: FeeOptionExtended | undefined) => void;
	confirmFeeOption: (id: string, address: string | null) => void;
	rejectFeeOption: (id: string) => void;
	setOptionConfirmed: (confirmed: boolean) => void;
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

	// Use unified WaaS fee management hook
	const waasFeeStep = useWaasFeeStep({
		enabled: isWaaS && state.isOpen,
	});

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
		waasFeeConfirmation:
			isWaaS && waasFeeStep
				? {
						feeOptionConfirmation: waasFeeStep.waasFee.feeOptionConfirmation,
						selectedOption: waasFeeStep.waasFee.selectedOption,
						optionConfirmed: waasFeeStep.waasFee.optionConfirmed,
						confirmFeeOption: waasFeeStep.waasFee.confirmFeeOption,
						setOptionConfirmed: waasFeeStep.waasFee.setOptionConfirmed,
					}
				: undefined,
	});

	const steps = [];

	// WaaS fee selection step (only in manual mode)
	if (waasFeeStep) {
		steps.push(waasFeeStep);
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
	const feeStepInSteps = steps.find((s) => s.id === 'waas-fee-selection');
	const feeNeedsConfirmation =
		feeStepInSteps &&
		!feeStepInSteps.isSuccess &&
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
		if (waasFeeStep?.waasFee.selectedOption) {
			waasFeeStep.waasFee.setSelectedFeeOption(undefined);
			waasFeeStep.waasFee.setOptionConfirmed(false);
		}

		if (waasFeeStep?.waasFee.feeOptionConfirmation?.id) {
			waasFeeStep.waasFee.rejectFeeOption(
				waasFeeStep.waasFee.feeOptionConfirmation.id,
			);
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
