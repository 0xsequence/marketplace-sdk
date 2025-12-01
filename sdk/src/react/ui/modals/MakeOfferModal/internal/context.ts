import { useWaasFeeOptions } from '@0xsequence/connect';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../../utils/date';
import { type ContractType, OfferType } from '../../../../_internal';
import {
	useCollectibleMarketLowestListing,
	useCollectibleMetadata,
	useCollectionMetadata,
	useConnectorMetadata,
	useCurrencyList,
	useTokenCurrencyBalance,
} from '../../../../hooks';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { computeFlowState } from '../../_internal/helpers/flow-state';
import {
	createApprovalGuard,
	createFinalTransactionGuard,
} from '../../_internal/helpers/step-guards';
import type {
	ApprovalStep,
	FeeStep,
	TransactionStep,
} from '../../_internal/types/steps';
import {
	filterCurrenciesForOrderbook,
	getDefaultCurrency,
} from './helpers/currency';
import { parseInput } from './helpers/dnum-utils';
import { isFormValid, validateOfferForm } from './helpers/validation';
import { useOfferMutations } from './offer-mutations';
import { useMakeOfferModalState } from './store';
import { useGenerateOfferTransaction } from './use-generate-offer-transaction';

export type MakeOfferModalSteps = {
	fee?: FeeStep;
	approval?: ApprovalStep;
	offer: TransactionStep;
};

export function useMakeOfferModalContext() {
	const state = useMakeOfferModalState();
	const { address } = useAccount();

	// ============================================
	// DATA FETCHING
	// ============================================

	const collectibleQuery = useCollectibleMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
	});

	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});

	// For offers, native currency is not supported - only ERC-20 tokens
	const currenciesQuery = useCurrencyList({
		chainId: state.chainId,
		includeNativeCurrency: false,
	});

	const lowestListingQuery = useCollectibleMarketLowestListing({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
	});

	const { isWaaS } = useConnectorMetadata();

	// ============================================
	// DERIVED STATE
	// ============================================

	// Keep useMemo for array filtering - creates new array reference
	const availableCurrencies = useMemo(() => {
		if (!currenciesQuery.data) return [];
		return filterCurrenciesForOrderbook(
			currenciesQuery.data,
			state.orderbookKind,
			state.chainId,
		);
	}, [currenciesQuery.data, state.orderbookKind, state.chainId]);

	// Keep useMemo - depends on availableCurrencies and does array.find
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

	// Fetch currency balance for the selected currency (for offer validation)
	const currencyBalanceQuery = useTokenCurrencyBalance({
		currencyAddress: selectedCurrency?.contractAddress as Address | undefined,
		chainId: state.chainId,
		userAddress: address,
		query: {
			enabled: !!selectedCurrency?.contractAddress && !!address,
		},
	});

	// Expiry date calculation - no useMemo needed, Date creation is cheap
	const expiryDate = new Date(
		Date.now() + state.expiryDays * 24 * 60 * 60 * 1000,
	);

	// Price as Dnum - no useMemo needed, parseInput is cheap and no downstream memoized consumers
	const priceDnum = parseInput(
		state.priceInput,
		selectedCurrency?.decimals || 18,
	);
	// Extract raw bigint value from Dnum tuple for contract calls and components
	const priceRaw = priceDnum[0];

	// Quantity as Dnum - no useMemo needed
	const quantityDnum = parseInput(
		state.quantityInput,
		collectibleQuery.data?.decimals || 0,
	);
	// Extract raw bigint value from Dnum tuple
	const quantityRaw = quantityDnum[0];

	// Currency balance as Dnum - for validating user has enough currency for the offer
	const balanceDnum =
		currencyBalanceQuery.data?.value !== undefined && selectedCurrency?.decimals
			? ([currencyBalanceQuery.data.value, selectedCurrency.decimals] as const)
			: undefined;

	// Lowest listing as Dnum - no useMemo needed
	const lowestListingDnum =
		lowestListingQuery.data?.priceAmount && selectedCurrency?.decimals
			? ([
					BigInt(lowestListingQuery.data.priceAmount),
					selectedCurrency.decimals,
				] as const)
			: undefined;

	// ============================================
	// VALIDATION
	// ============================================

	// No useMemo needed - validateOfferForm is cheap and no downstream memoized consumers
	const validation = validateOfferForm({
		price: priceDnum,
		quantity: quantityDnum,
		balance: balanceDnum,
		lowestListing: lowestListingDnum,
		orderbookKind: state.orderbookKind,
	});

	const formIsValid = isFormValid(validation);

	// ============================================
	// TRANSACTION GENERATION
	// ============================================

	const transactionData = useGenerateOfferTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		contractType: collectionQuery.data?.type as ContractType,
		orderbook: state.orderbookKind,
		maker: address,
		offer: {
			tokenId: state.tokenId,
			quantity: quantityRaw,
			expiry: dateToUnixTime(expiryDate),
			currencyAddress:
				selectedCurrency?.contractAddress ??
				('0x0000000000000000000000000000000000000000' as Address),
			pricePerToken: priceRaw,
		},
		additionalFees: [],
		offerType: OfferType.item,
	});

	const { approve, makeOffer } = useOfferMutations(transactionData.data, {
		priceRaw: priceRaw.toString(),
		currencyAddress: selectedCurrency?.contractAddress as Address,
		currencyDecimals: selectedCurrency?.decimals ?? 18,
	});

	// ============================================
	// STEPS
	// ============================================

	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;

	const steps: MakeOfferModalSteps = {} as MakeOfferModalSteps;

	// Fee step (WaaS only)
	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;

		steps.fee = {
			label: 'Select Fee',
			status: feeSelected ? 'success' : waas.isVisible ? 'selecting' : 'idle',
			isSponsored,
			isSelecting: waas.isVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
			cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		};
	}

	// Approval step (conditional)
	if (transactionData.data?.approveStep) {
		const approvalGuard = createApprovalGuard({
			isFormValid: formIsValid,
			txReady: !!transactionData.data?.approveStep,
			walletConnected: !!address,
		});
		const guardResult = approvalGuard();

		const approveTransactionHash =
			approve.data &&
			'type' in approve.data &&
			approve.data.type === 'transaction'
				? approve.data.hash
				: undefined;

		steps.approval = {
			label: 'Approve TOKEN',
			status: approve.isSuccess
				? 'success'
				: approve.isPending
					? 'pending'
					: approve.error
						? 'error'
						: 'idle',
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isDisabled: !guardResult.canProceed,
			disabledReason: guardResult.error?.message || null,
			error: approve.error,
			canExecute: guardResult.canProceed,
			result: approveTransactionHash
				? { type: 'transaction', hash: approveTransactionHash }
				: null,
			execute: async () => approve.mutate(),
			reset: () => approve.reset(),
		};
	}

	// Offer step (always present)
	const offerGuard = createFinalTransactionGuard({
		isFormValid: formIsValid,
		txReady: !!transactionData.data?.offerStep,
		walletConnected: !!address,
		requiresApproval: !!transactionData.data?.approveStep,
		approvalComplete: approve.isSuccess || !transactionData.data?.approveStep,
	});
	const offerGuardResult = offerGuard();

	const offerTransactionHash =
		makeOffer.data &&
		'type' in makeOffer.data &&
		makeOffer.data.type === 'transaction'
			? makeOffer.data.hash
			: undefined;

	steps.offer = {
		label: 'Make Offer',
		status: makeOffer.isSuccess
			? 'success'
			: makeOffer.isPending
				? 'pending'
				: makeOffer.error
					? 'error'
					: 'idle',
		isPending: makeOffer.isPending,
		isSuccess: makeOffer.isSuccess,
		isDisabled: !offerGuardResult.canProceed,
		disabledReason: offerGuardResult.error?.message || null,
		error: makeOffer.error,
		canExecute: offerGuardResult.canProceed,
		result: offerTransactionHash
			? { type: 'transaction', hash: offerTransactionHash }
			: makeOffer.data?.type === 'signature'
				? { type: 'signature', orderId: makeOffer.data.orderId ?? '' }
				: null,
		execute: async () => makeOffer.mutate(),
	};

	const flow = computeFlowState(steps);

	const error =
		approve.error ||
		makeOffer.error ||
		transactionData.error ||
		collectibleQuery.error ||
		collectionQuery.error ||
		currenciesQuery.error;

	return {
		isOpen: state.isOpen,
		close: state.closeModal,

		// Item data - grouped under `item` to match Modal.tsx expectations
		item: {
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			tokenId: state.tokenId,
			orderbookKind: state.orderbookKind,
		},

		// Keep flat access for backwards compatibility
		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collectible: collectibleQuery.data,
		collection: collectionQuery.data,

		// Offer data
		offer: {
			price: {
				input: state.priceInput,
				amountRaw: priceRaw,
				currency: selectedCurrency,
			},
			quantity: {
				input: state.quantityInput,
				parsed: quantityRaw,
			},
			expiry: expiryDate,
		},

		// Form controls - restructured to match Modal.tsx expectations
		form: {
			price: {
				input: state.priceInput,
				update: state.updatePriceInput,
			},
			quantity: {
				input: state.quantityInput,
				update: state.updateQuantityInput,
				validation: validation.quantity,
			},
			expiry: {
				update: state.updateExpiryDays,
			},
			isValid: formIsValid,
			errors: {
				price: validation.price.error,
				quantity: validation.quantity.error,
				balance: validation.balance.error,
				openseaCriteria: validation.openseaCriteria?.error,
			},
		},

		// Currencies
		currencies: {
			available: availableCurrencies,
			selected: selectedCurrency,
			select: state.updateCurrency,
		},

		// Steps and flow
		steps,
		flow,

		// Loading states
		loading: {
			collectible: collectibleQuery.isLoading,
			collection: collectionQuery.isLoading,
			currencies: currenciesQuery.isLoading,
			steps: transactionData.isLoading,
		},

		// Transaction hashes
		transactions: {
			approve:
				approve.data?.type === 'transaction' ? approve.data.hash : undefined,
			offer:
				makeOffer.data?.type === 'transaction'
					? makeOffer.data.hash
					: undefined,
		},

		error,
		queries: {
			collectible: collectibleQuery,
			collection: collectionQuery,
			currencies: currenciesQuery,
			lowestListing: lowestListingQuery,
		},
	};
}

export type MakeOfferModalContext = ReturnType<typeof useMakeOfferModalContext>;
