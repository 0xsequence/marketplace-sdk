/**
 * Unified context hook for MakeOfferModal
 * Provides a flat, headless-first API for building custom offer UIs
 *
 * This hook consolidates:
 * - Data fetching (collectible, collection, currencies, balances)
 * - Form state and validation (pure functions)
 * - Step orchestration (approve, offer)
 * - Transaction mutations (using TanStack Query)
 *
 * All decimal handling uses dnum for precision safety
 */

import { useWaasFeeOptions } from '@0xsequence/connect';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Dnum } from 'dnum';
import * as dnum from 'dnum';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type { OrderbookKind } from '../../../../../types';
import { dateToUnixTime } from '../../../../../utils/date';
import {
	type ContractType,
	type Currency,
	OfferType,
} from '../../../../_internal';
import {
	useCollectible,
	useCollectibleBalance,
	useCollection,
	useConnectorMetadata,
	useLowestListing,
	useMarketCurrencies,
} from '../../../../hooks';
import { useSelectWaasFeeOptionsStore } from '../../_internal/components/selectWaasFeeOptions/store';
import { parseInput, toBigIntString } from '../../_internal/helpers/dnum-utils';
import {
	computeFlowState,
	executeNextStep,
} from '../../_internal/helpers/flow-state';
import {
	createApproveStepGuard,
	createOfferStepGuard,
} from '../../_internal/helpers/step-guards';
import type {
	ApprovalStep,
	FeeStep,
	FlowState,
	ModalSteps,
	TransactionStep,
} from '../../_internal/types/steps';
import {
	filterCurrenciesForOrderbook,
	getDefaultCurrency,
} from './helpers/currency';
import { isFormValid, validateOfferForm } from './helpers/validation';
import { useOfferMutations } from './offer-mutations';
import { useMakeOfferModalState } from './store';
import { useGenerateOfferTransaction } from './use-generate-offer-transaction';

/**
 * MakeOfferModal steps type
 * Uses the common ModalSteps pattern with 'offer' as the final step
 */
export type MakeOfferSteps = ModalSteps<'offer'>;

/**
 * MakeOfferModal context type
 * Extends the base ModalContext with offer-specific fields
 */
export type MakeOfferModalContext = {
	// Modal state
	isOpen: boolean;
	close: () => void;

	// Item data
	item: {
		tokenId: string;
		collectionAddress: Address;
		chainId: number;
		collectible?: TokenMetadata;
		collection?: ContractInfo;
		balance?: Dnum;
		balanceWithDecimals?: string;
		orderbookKind?: OrderbookKind;
	};

	// Offer details
	offer: {
		price: {
			input: string;
			amountRaw: string;
			currency: Currency | null;
			dnum: Dnum;
		};
		quantity: {
			input: string;
			parsed: string;
			dnum: Dnum;
		};
		expiry: Date;
	};

	// Form controls
	form: {
		price: {
			input: string;
			update: (value: string) => void;
			validation: {
				isValid: boolean;
				error: string | null;
			};
		};
		quantity: {
			input: string;
			update: (value: string) => void;
			validation: {
				isValid: boolean;
				error: string | null;
			};
		};
		expiry: {
			date: Date;
			update: (days: number) => void;
		};
		isValid: boolean;
		errors: Record<string, string | null>;
	};

	// Currencies
	currencies: {
		all: Currency[];
		available: Currency[];
		selected: Currency | null;
		select: (address: Address) => void;
	};

	// Steps (using common types)
	steps: MakeOfferSteps;

	// Flow state (computed)
	flow: FlowState;

	// Execute next step in the flow
	executeNext: () => Promise<{ stepName: string } | null>;

	// Loading and error states
	isLoading: boolean;
	error: Error | null;

	// Queries (for v2 ActionModal pattern)
	queries: {
		collectible: UseQueryResult<TokenMetadata | undefined>;
		collection: UseQueryResult<ContractInfo | undefined>;
		currencies: UseQueryResult<Currency[] | undefined>;
	};
};

// ============================================
// CONTEXT HOOK
// ============================================

/**
 * Main context hook for MakeOfferModal
 * Use this hook to access all offer modal state and actions
 *
 * @example
 * ```tsx
 * function CustomOfferUI() {
 *   const { form, steps, currencies } = useMakeOfferModalContext();
 *
 *   return (
 *     <div>
 *       <input value={form.price.input} onChange={e => form.price.update(e.target.value)} />
 *       <button onClick={steps.offer.execute} disabled={steps.offer.isDisabled}>
 *         Make Offer
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMakeOfferModalContext(): MakeOfferModalContext {
	const state = useMakeOfferModalState();
	const { address } = useAccount();

	// ============================================
	// DATA FETCHING
	// ============================================

	const collectibleQuery = useCollectible({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		collectibleId: state.collectibleId,
	});

	const collectionQuery = useCollection({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});

	const currenciesQuery = useMarketCurrencies({
		chainId: state.chainId,
	});

	const {
		data: collectible,
		isLoading: collectibleLoading,
		error: collectibleError,
	} = collectibleQuery;

	const {
		data: collection,
		isLoading: collectionLoading,
		error: collectionError,
	} = collectionQuery;

	const {
		data: currencies,
		isLoading: currenciesLoading,
		error: currenciesError,
	} = currenciesQuery;

	const { data: lowestListing } = useLowestListing({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.collectibleId,
	});

	// Fetch balance directly (instead of from store)
	const { data: balanceData } = useCollectibleBalance({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		collectableId: state.collectibleId,
		userAddress: address,
	});

	// ============================================
	// DERIVED STATE
	// ============================================

	// Derive WaaS state from connector metadata
	const { isWaaS } = useConnectorMetadata();
	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const feeIsSponsored = (pendingFee?.options?.length ?? -1) === 0;

	// Balance
	const balanceDnum: Dnum | undefined = useMemo(() => {
		if (!balanceData?.balance || collectible?.decimals === undefined)
			return undefined;
		return [BigInt(balanceData.balance), collectible.decimals];
	}, [balanceData?.balance, collectible?.decimals]);

	// Available currencies (filtered by orderbook)
	const availableCurrencies = useMemo(() => {
		if (!currencies) return [];
		return filterCurrenciesForOrderbook(
			currencies,
			state.orderbookKind,
			state.chainId,
		);
	}, [currencies, state.orderbookKind, state.chainId]);

	// Selected currency
	const selectedCurrency = useMemo(() => {
		if (state.currencyAddress) {
			return (
				availableCurrencies.find(
					(c) => c.contractAddress === state.currencyAddress,
				) || null
			);
		}
		return getDefaultCurrency(availableCurrencies, state.orderbookKind);
	}, [state.currencyAddress, availableCurrencies, state.orderbookKind]);

	// Expiry date - simple calculation, no memoization needed
	const now = new Date();
	const expiryDate = new Date(
		now.getTime() + state.expiryDays * 24 * 60 * 60 * 1000,
	);

	// Price as Dnum
	const priceDnum: Dnum = useMemo(() => {
		return parseInput(state.priceInput, selectedCurrency?.decimals || 18);
	}, [state.priceInput, selectedCurrency?.decimals]);

	// Simple function call - no memoization needed
	const priceRaw = toBigIntString(priceDnum);

	// Quantity as Dnum
	const quantityDnum: Dnum = useMemo(() => {
		return parseInput(state.quantityInput, collectible?.decimals || 0);
	}, [state.quantityInput, collectible?.decimals]);

	// Simple function call - no memoization needed
	const quantityRaw = toBigIntString(quantityDnum);

	// Lowest listing as Dnum (for OpenSea validation)
	const lowestListingDnum: Dnum | undefined = useMemo(() => {
		if (!lowestListing?.priceAmount || !selectedCurrency?.decimals) {
			return undefined;
		}
		return [BigInt(lowestListing.priceAmount), selectedCurrency.decimals];
	}, [lowestListing?.priceAmount, selectedCurrency?.decimals]);

	// ============================================
	// VALIDATION
	// ============================================

	const validation = useMemo(() => {
		return validateOfferForm({
			price: priceDnum,
			quantity: quantityDnum,
			balance: balanceDnum,
			lowestListing: lowestListingDnum,
			orderbookKind: state.orderbookKind,
		});
	}, [
		priceDnum,
		quantityDnum,
		balanceDnum,
		lowestListingDnum,
		state.orderbookKind,
	]);

	// Simple function call on already-memoized value - no additional memoization needed
	const formIsValid = isFormValid(validation);

	// ============================================
	// TRANSACTION GENERATION
	// ============================================

	// Generate transaction steps (only when form is valid)
	const offerSteps = useGenerateOfferTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		contractType: collection?.type as ContractType,
		orderbook: state.orderbookKind,
		maker: address,
		offer: {
			tokenId: state.collectibleId,
			quantity: quantityRaw,
			expiry: dateToUnixTime(expiryDate),
			currencyAddress: selectedCurrency?.contractAddress || '',
			pricePerToken: priceRaw,
		},
		additionalFees: [],
		offerType: OfferType.item,
	});

	const { approve, makeOffer } = useOfferMutations(offerSteps.data, {
		priceRaw,
		currencyAddress: selectedCurrency?.contractAddress as Address,
		currencyDecimals: selectedCurrency?.decimals ?? 18,
	});

	const feeStep: FeeStep | undefined = useMemo(() => {
		if (!isWaaS) return undefined;

		return {
			status: waas.isVisible ? 'selecting' : 'complete',
			isSponsored: feeIsSponsored,
			isSelecting: waas.isVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => waas.show(),
			cancel: () => waas.hide(),
		};
	}, [isWaaS, waas, feeIsSponsored]);

	// Approve step (conditional)
	const approveStepGuard = useMemo(() => {
		return createApproveStepGuard({
			isFormValid: formIsValid,
			txReady: !!offerSteps.data?.approveStep,
			walletConnected: !!address,
		});
	}, [formIsValid, address, offerSteps.data?.approveStep]);

	const approvalStep: ApprovalStep | undefined = useMemo(() => {
		if (!offerSteps.data?.approveStep) return undefined;

		const guard = approveStepGuard();

		return {
			status: approve.isSuccess
				? 'complete'
				: approve.isPending
					? 'pending'
					: approve.error
						? 'error'
						: 'idle',
			canExecute: guard.canProceed,
			isPending: approve.isPending,
			isComplete: approve.isSuccess,
			isDisabled: !guard.canProceed,
			disabledReason: guard.reason || null,
			error: approve.error,
			result:
				approve.data?.type === 'transaction'
					? { type: 'transaction', hash: approve.data.hash }
					: null,
			execute: async () => {
				const result = approveStepGuard();
				if (!result.canProceed) {
					throw new Error(result.reason);
				}
				await approve.mutateAsync();
			},
			reset: () => approve.reset(),
		};
	}, [
		offerSteps.data?.approveStep,
		approve.isSuccess,
		approve.isPending,
		approve.error,
		approve.data,
		approveStepGuard,
		approve,
	]);

	const offerStepGuard = useMemo(() => {
		return createOfferStepGuard({
			isFormValid: formIsValid,
			txReady: !!offerSteps.data?.offerStep,
			walletConnected: !!address,
			requiresApproval: !!approvalStep,
			approvalComplete: approvalStep?.isComplete || false,
		});
	}, [formIsValid, address, approvalStep, offerSteps.data?.offerStep]);

	const offerStep: TransactionStep = useMemo(() => {
		const guard = offerStepGuard();

		return {
			status: makeOffer.isSuccess
				? 'complete'
				: makeOffer.isPending
					? 'pending'
					: makeOffer.error
						? 'error'
						: 'idle',
			canExecute: guard.canProceed,
			isPending: makeOffer.isPending,
			isComplete: makeOffer.isSuccess,
			isDisabled: !guard.canProceed,
			disabledReason: guard.reason || null,
			error: makeOffer.error,
			result:
				makeOffer.data?.type === 'transaction'
					? { type: 'transaction', hash: makeOffer.data.hash }
					: makeOffer.data?.type === 'signature'
						? { type: 'signature', orderId: makeOffer.data.orderId ?? '' }
						: null,
			execute: async () => {
				const result = offerStepGuard();
				if (!result.canProceed) {
					throw new Error(result.reason);
				}
				await makeOffer.mutateAsync();
			},
		};
	}, [
		makeOffer.isSuccess,
		makeOffer.isPending,
		makeOffer.error,
		makeOffer.data,
		offerStepGuard,
		makeOffer,
	]);

	// Build steps object for flow computation
	const steps: MakeOfferSteps = {
		...(feeStep ? { fee: feeStep } : {}),
		...(approvalStep ? { approval: approvalStep } : {}),
		offer: offerStep,
	};

	// Compute flow state using utility function
	const flow = computeFlowState(steps as unknown as ModalSteps);

	// Global error aggregation
	const error =
		collectibleError ||
		collectionError ||
		currenciesError ||
		approve.error ||
		makeOffer.error ||
		null;

	// Execute next step helper
	const executeNext = async () => {
		return executeNextStep(steps as unknown as ModalSteps);
	};

	return {
		isOpen: state.isOpen,
		close: state.closeModal,

		item: {
			tokenId: state.collectibleId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			collectible,
			collection,
			balance: balanceDnum,
			balanceWithDecimals: balanceDnum ? dnum.format(balanceDnum) : undefined,
			orderbookKind: state.orderbookKind,
		},

		offer: {
			price: {
				input: state.priceInput,
				amountRaw: priceRaw,
				currency: selectedCurrency,
				dnum: priceDnum,
			},
			quantity: {
				input: state.quantityInput,
				parsed: quantityRaw,
				dnum: quantityDnum,
			},
			expiry: expiryDate,
		},

		form: {
			price: {
				input: state.priceInput,
				update: (value: string) => state.updatePriceInput(value),
				validation: validation.price,
			},
			quantity: {
				input: state.quantityInput,
				update: (value: string) => state.updateQuantityInput(value),
				validation: validation.quantity,
			},
			expiry: {
				date: expiryDate,
				update: (days: number) => state.updateExpiryDays(days),
			},
			isValid: formIsValid,
			errors: {
				price: validation.price.error,
				quantity: validation.quantity.error,
				balance: validation.balance.error,
				openseaCriteria: validation.openseaCriteria?.error ?? null,
			},
		},

		currencies: {
			all: currencies || [],
			available: availableCurrencies,
			selected: selectedCurrency,
			select: (address) => state.updateCurrency(address),
		},

		steps,
		flow,
		executeNext,

		isLoading: collectibleLoading || collectionLoading || currenciesLoading,
		error,

		queries: {
			collectible: collectibleQuery,
			collection: collectionQuery,
			currencies: currenciesQuery,
		},
	};
}
