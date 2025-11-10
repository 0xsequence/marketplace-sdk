import { useWaasFeeOptions } from '@0xsequence/connect';
import { addDays } from 'date-fns/addDays';
import type { Dnum } from 'dnum';
import { toNumber } from 'dnum';
import { useEffect, useMemo, useRef } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../../utils/date';
import type { ContractType, Currency } from '../../../../_internal';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useConnectorMetadata,
	useMarketCurrencies,
	useMarketplaceConfig,
} from '../../../../hooks';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
// Import pure helper functions
import {
	filterCurrenciesForOrderbook,
	getDefaultCurrency,
	isCurrencySupported,
	isNativeCurrency,
} from './helpers/currency';
import {
	fromBigIntString,
	parseInput,
	toBigIntString,
} from './helpers/dnum-utils';
import {
	type ApprovalDependencies,
	isApprovalInvalidated as checkApprovalInvalidated,
	getInvalidationReason,
} from './helpers/invalidation';
import {
	computeStepDisabledState,
	createApproveStepGuard,
	createFormStepGuard,
	createListStepGuard,
	type GuardResult,
} from './helpers/step-guards';
import {
	isFormValid as checkFormValid,
	type FormValidation,
	getValidationErrors,
	validateListingForm,
} from './helpers/validation';
import { useListingMutations } from './listing-mutations';
import { createListingModalStore, useCreateListingModalState } from './store';
import { useGenerateListingTransaction } from './use-generate-listing-transaction';

export type ListingStepId = 'form' | 'waasFee' | 'approve' | 'list';

export type Step = {
	id: ListingStepId;
	label: string;
	description?: string;
	status: string;
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	isDisabled?: boolean;
	disabledReason?: string | null;
	isInvalidated?: boolean;
	invalidationReason?: string | null;
	validationErrors?: Record<string, string | null> | null;
	guard: () => GuardResult; // NEW: Step guard function
	run: () => Promise<unknown>; // Can return void or ProcessStepResult
};

export type ListStep = Step & { id: 'list' };
export type ListingSteps = [...Step[], ListStep];

export function useCreateListingModalContext() {
	const state = useCreateListingModalState();
	const { address } = useAccount();
	const { isWaaS } = useConnectorMetadata();

	// Data fetching
	const {
		data: collectible,
		isLoading: collectibleIsLoading,
		error: collectibleError,
	} = useCollectible({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		collectibleId: state.collectibleId,
	});

	const {
		data: collection,
		isLoading: collectionIsLoading,
		error: collectionError,
	} = useCollection({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});

	const {
		data: allCurrencies,
		isLoading: currenciesLoading,
		error: currenciesError,
	} = useMarketCurrencies({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		includeNativeCurrency: true,
	});

	const { data: balance } = useBalanceOfCollectible({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		collectableId: state.collectibleId,
		userAddress: address ?? undefined,
	});

	const { data: marketplaceConfig } = useMarketplaceConfig();

	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === state.collectionAddress,
	);

	const orderbookKind =
		state.orderbookKind || collectionConfig?.destinationMarketplace;

	// Convert balance to Dnum for consistent handling
	const balanceDnum: Dnum | undefined = useMemo(() => {
		if (!balance?.balance || !collectible?.decimals) return undefined;
		return fromBigIntString(balance.balance, collectible.decimals);
	}, [balance?.balance, collectible?.decimals]);

	const balanceWithDecimals = balanceDnum ? toNumber(balanceDnum) : 0;

	// DERIVE: Filter currencies using pure function
	const availableCurrencies = useMemo(
		() =>
			filterCurrenciesForOrderbook(
				allCurrencies || [],
				orderbookKind,
				state.chainId,
			),
		[allCurrencies, orderbookKind, state.chainId],
	);

	// DERIVE: Selected currency (from user selection OR default)
	const selectedCurrency = useMemo(() => {
		// If user explicitly selected, find it
		if (state.currencyAddress) {
			const found = availableCurrencies.find(
				(c) =>
					c.contractAddress.toLowerCase() ===
					state.currencyAddress?.toLowerCase(),
			);
			if (found) return found;
		}

		// Otherwise, derive default
		return (
			getDefaultCurrency(availableCurrencies, orderbookKind) || ({} as Currency)
		);
	}, [state.currencyAddress, availableCurrencies, orderbookKind]);

	// DERIVE: Expiry date from days
	const expiryDate = useMemo(
		() => addDays(new Date(), state.expiryDays),
		[state.expiryDays],
	);

	// DERIVE: Price as Dnum (safe decimal handling)
	const priceDnum: Dnum = useMemo(
		() => parseInput(state.priceInput, selectedCurrency?.decimals ?? 18),
		[state.priceInput, selectedCurrency?.decimals],
	);

	// DERIVE: Price in wei (for smart contract calls)
	const priceInWei = useMemo(() => toBigIntString(priceDnum), [priceDnum]);

	// DERIVE: Quantity as Dnum (safe decimal handling)
	const quantityDnum: Dnum = useMemo(
		() => parseInput(state.quantityInput, collectible?.decimals ?? 0),
		[state.quantityInput, collectible?.decimals],
	);

	// DERIVE: Quantity in smallest unit (for smart contract calls)
	const quantityInSmallestUnit = useMemo(
		() => toBigIntString(quantityDnum),
		[quantityDnum],
	);

	// VALIDATE: Using pure function with Dnum values
	const validation: FormValidation = useMemo(
		() =>
			validateListingForm({
				price: priceDnum,
				quantity: quantityDnum,
				selectedCurrency,
				expiryDate,
				balance: balanceDnum,
			}),
		[priceDnum, quantityDnum, selectedCurrency, expiryDate, balanceDnum],
	);

	const isFormValid = checkFormValid(validation);
	const validationErrors = getValidationErrors(validation);

	// Transaction generation (only when form is valid)
	const listingSteps = useGenerateListingTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		contractType: collection?.type as ContractType,
		orderbook: orderbookKind,
		owner: address,
		listing: {
			tokenId: state.collectibleId,
			quantity: quantityInSmallestUnit,
			expiry: dateToUnixTime(expiryDate),
			currencyAddress: selectedCurrency.contractAddress || '',
			pricePerToken: priceInWei,
		},
		additionalFees: [],
	});

	// Mutations (pass derived price/currency data)
	const { approve, list } = useListingMutations(listingSteps.data, {
		priceInWei,
		currencyAddress: selectedCurrency.contractAddress as Address,
		currencyDecimals: selectedCurrency.decimals ?? 18,
	});

	// WaaS integration
	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;

	// Invalidation tracking (using pure functions)
	const approvalDependencies: ApprovalDependencies = useMemo(
		() => ({
			currency: selectedCurrency.contractAddress as Address | undefined,
			collectionAddress: state.collectionAddress,
		}),
		[selectedCurrency.contractAddress, state.collectionAddress],
	);

	const prevApprovalDeps = useRef(approvalDependencies);

	// Detect if approval-critical fields changed
	const isApprovalInvalidated = useMemo(
		() =>
			checkApprovalInvalidated(
				prevApprovalDeps.current,
				approvalDependencies,
				approve.isSuccess,
			),
		[approvalDependencies, approve.isSuccess],
	);

	const invalidationReason = useMemo(
		() =>
			isApprovalInvalidated
				? getInvalidationReason(prevApprovalDeps.current, approvalDependencies)
				: null,
		[isApprovalInvalidated, approvalDependencies],
	);

	// Reset approval if invalidated
	useEffect(() => {
		if (isApprovalInvalidated) {
			console.log(
				'[CreateListingModal] Approval invalidated - currency changed',
			);
			approve.reset();
			prevApprovalDeps.current = approvalDependencies;
		}
	}, [isApprovalInvalidated, approve, approvalDependencies]);

	// Step orchestration (ALWAYS show steps, gate with disabled states)
	const steps: Step[] = [];

	// Step 1: Form (always visible)
	const formStepGuard = createFormStepGuard({
		isFormValid,
		validationErrors,
	});

	steps.push({
		id: 'form' satisfies ListingStepId,
		label: 'Set Listing Details',
		description: 'Price, quantity, and expiry',
		status: isFormValid ? 'success' : 'idle',
		isPending: false,
		isSuccess: isFormValid,
		isError: false,
		isDisabled: false,
		validationErrors: !isFormValid ? validationErrors : null,
		guard: formStepGuard,
		run: async () => {
			const guardResult = formStepGuard();
			if (!guardResult.canProceed) {
				throw new Error(guardResult.reason || 'Form validation failed');
			}
		},
	});

	// Step 2: WaaS fee selection if needed
	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;
		steps.push({
			id: 'waasFee' satisfies ListingStepId,
			label: 'Select Fee',
			status: feeSelected ? 'success' : 'idle',
			isPending: false,
			isSuccess: feeSelected,
			isError: false,
			guard: () => ({ canProceed: true }),
			run: () => {
				selectWaasFeeOptionsStore.send({ type: 'show' });
				return Promise.resolve();
			},
		});
	}

	// Step 3: Approve (ALWAYS show if approval is/was needed, gate with disabled state)
	const requiresApproval = listingSteps.data?.approveStep;
	if (requiresApproval || !isFormValid || approve.isSuccess) {
		const approveDisabledState = computeStepDisabledState('approve', {
			isFormValid,
			txReady: !!listingSteps.data?.approveStep,
			requiresApproval: !!requiresApproval,
			approvalComplete: approve.isSuccess,
			walletConnected: !!address,
		});

		const approveStepGuard = createApproveStepGuard({
			isFormValid,
			txReady: !!listingSteps.data?.approveStep,
			walletConnected: !!address,
		});

		steps.push({
			id: 'approve' satisfies ListingStepId,
			label: 'Approve Token',
			description: 'Allow marketplace to access your tokens',
			status: approve.isSuccess
				? 'success'
				: approve.isPending
					? 'pending'
					: 'idle',
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isError: !!approve.error,
			isDisabled: approveDisabledState.isDisabled,
			disabledReason: approveDisabledState.disabledReason,
			isInvalidated: isApprovalInvalidated,
			invalidationReason,
			guard: approveStepGuard,
			run: async () => {
				const guardResult = approveStepGuard();
				if (!guardResult.canProceed) {
					throw new Error(guardResult.reason || 'Cannot approve at this time');
				}
				return approve.mutateAsync();
			},
		});
	}

	// Step 4: List (ALWAYS show, gate with disabled state)
	const listDisabledState = computeStepDisabledState('list', {
		isFormValid,
		txReady: !!listingSteps.data?.listStep,
		requiresApproval: !!requiresApproval,
		approvalComplete: approve.isSuccess,
		walletConnected: !!address,
	});

	const listStepGuard = createListStepGuard({
		isFormValid,
		txReady: !!listingSteps.data?.listStep,
		requiresApproval: !!requiresApproval,
		approvalComplete: approve.isSuccess,
		walletConnected: !!address,
		isApprovalInvalidated,
	});

	steps.push({
		id: 'list' satisfies ListingStepId,
		label: 'Create Listing',
		description: 'Sign transaction to create your listing',
		status: list.status,
		isPending: list.isPending,
		isSuccess: list.isSuccess,
		isError: !!list.error,
		isDisabled: listDisabledState.isDisabled,
		disabledReason: listDisabledState.disabledReason,
		guard: listStepGuard,
		run: async () => {
			const guardResult = listStepGuard();
			if (!guardResult.canProceed) {
				throw new Error(guardResult.reason || 'Cannot list at this time');
			}
			return list.mutateAsync();
		},
	});

	// Computed state
	const nextStep = steps.find(
		(step) => step.status === 'idle' && !step.isDisabled,
	);
	const isPending =
		approve.isPending || list.isPending || listingSteps.isLoading;
	const hasError = !!(
		approve.error ||
		list.error ||
		listingSteps.error ||
		collectibleError ||
		collectionError ||
		currenciesError
	);
	const totalSteps = steps.length;
	const completedSteps = steps.filter((s) => s.isSuccess).length;

	const flowStatus: 'idle' | 'pending' | 'success' | 'error' = isPending
		? 'pending'
		: hasError
			? 'error'
			: completedSteps === totalSteps
				? 'success'
				: 'idle';

	// WaaS fee selection UI state
	const feeSelection = waas.isVisible
		? {
				isSponsored,
				isSelecting: waas.isVisible,
				selectedOption: waas.selectedFeeOption,
				balance:
					waas.selectedFeeOption && 'balanceFormatted' in waas.selectedFeeOption
						? { formattedValue: waas.selectedFeeOption.balanceFormatted }
						: undefined,
				cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
			}
		: undefined;

	const error =
		approve.error ||
		list.error ||
		listingSteps.error ||
		collectibleError ||
		collectionError ||
		currenciesError;

	// Find approve and list steps from the steps array
	const approveStepFromArray = steps.find((s) => s.id === 'approve');
	const listStepFromArray = steps.find((s) => s.id === 'list')!;

	// Build steps object with clear named properties
	const feeStep =
		isWaaS && waas.isVisible
			? {
					status: (waas.selectedFeeOption || isSponsored
						? 'complete'
						: 'idle') as 'idle' | 'complete',
					isSponsored,
					isSelecting: waas.isVisible,
					selectedOption: waas.selectedFeeOption,
					cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
				}
			: undefined;

	const approveStep = approveStepFromArray
		? {
				status: (approveStepFromArray.isSuccess
					? 'complete'
					: approveStepFromArray.isPending
						? 'pending'
						: approveStepFromArray.isError
							? 'error'
							: 'idle') as 'idle' | 'pending' | 'complete' | 'error',
				canExecute: !approveStepFromArray.isDisabled && isFormValid,
				isPending: approveStepFromArray.isPending,
				isComplete: approveStepFromArray.isSuccess,
				isDisabled: approveStepFromArray.isDisabled,
				disabledReason: approveStepFromArray.disabledReason,
				error: approveStepFromArray.isError
					? (new Error('Approval failed') as Error)
					: null,
				txHash: approve.data?.type === 'transaction' ? approve.data.hash : null,
				invalidated: isApprovalInvalidated,
				invalidationReason: approveStepFromArray.invalidationReason || null,
				execute: async () => {
					await approveStepFromArray.run();
				},
			}
		: undefined;

	const listStepObj = {
		status: (listStepFromArray.isSuccess
			? 'complete'
			: listStepFromArray.isPending
				? 'pending'
				: listStepFromArray.isError
					? 'error'
					: 'idle') as 'idle' | 'pending' | 'complete' | 'error',
		canExecute:
			!listStepFromArray.isDisabled &&
			isFormValid &&
			(!approveStepFromArray || approveStepFromArray.isSuccess),
		isPending: listStepFromArray.isPending,
		isComplete: listStepFromArray.isSuccess,
		isDisabled: listStepFromArray.isDisabled,
		disabledReason: listStepFromArray.disabledReason,
		error: listStepFromArray.isError
			? (new Error('Listing failed') as Error)
			: null,
		txHash: list.data?.type === 'transaction' ? list.data.hash : null,
		orderId: null, // TODO: Get from transaction result
		execute: async () => {
			await listStepFromArray.run();
		},
	};

	// Determine current and next steps
	const formStepStatus = isFormValid
		? ('complete' as const)
		: ('idle' as const);
	let currentStep: 'form' | 'fee' | 'approve' | 'list' = 'form';
	let nextStepValue: 'fee' | 'approve' | 'list' | null = null;

	if (!isFormValid) {
		currentStep = 'form';
		nextStepValue = null;
	} else if (feeStep && feeStep.status !== 'complete') {
		currentStep = 'fee';
		nextStepValue = 'fee';
	} else if (approveStep && !approveStep.isComplete) {
		currentStep = 'approve';
		nextStepValue = 'approve';
	} else if (!listStepObj.isComplete) {
		currentStep = 'list';
		nextStepValue = 'list';
	} else {
		currentStep = 'list';
		nextStepValue = null;
	}

	// Calculate progress
	const totalProgressSteps = 1 + (feeStep ? 1 : 0) + (approveStep ? 1 : 0) + 1; // form + fee? + approve? + list
	let completedProgressSteps = 0;

	if (formStepStatus === 'complete') completedProgressSteps++;
	if (feeStep && feeStep.status === 'complete') completedProgressSteps++;
	if (approveStep?.isComplete) completedProgressSteps++;
	if (listStepObj.isComplete) completedProgressSteps++;

	const progressPercent = Math.round(
		(completedProgressSteps / totalProgressSteps) * 100,
	);

	// FLAT API
	return {
		// Modal state
		isOpen: state.isOpen,
		close: state.closeModal,

		// Item data
		item: {
			tokenId: state.collectibleId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			collectible: collectible,
			collection: collection,
			balance: balance,
			balanceWithDecimals,
		},

		// Form (flat)
		form: {
			// Values
			price: state.priceInput,
			priceError: validation.price.error,
			priceInWei,
			quantity: state.quantityInput,
			quantityError: validation.quantity.error,
			quantityInSmallestUnit,
			currency: selectedCurrency,
			currencies: availableCurrencies,
			expiry: expiryDate,
			expiryDays: state.expiryDays,
			isValid: isFormValid,
			errors: validationErrors,

			// Actions
			setPrice: (value: string) =>
				createListingModalStore.send({ type: 'updatePrice', value }),
			setQuantity: (value: string) =>
				createListingModalStore.send({ type: 'updateQuantity', value }),
			setCurrency: (currency: Currency) =>
				createListingModalStore.send({
					type: 'selectCurrency',
					address: currency.contractAddress as Address,
				}),
			setExpiryDays: (days: number) =>
				createListingModalStore.send({ type: 'updateExpiryDays', days }),
		},

		// Steps (named properties for obvious flow)
		steps: {
			form: {
				status: formStepStatus,
				isValid: isFormValid,
				errors: validationErrors,
			},
			fee: feeStep,
			approve: approveStep,
			list: listStepObj,
		},

		// Global state
		isLoading: collectibleIsLoading || collectionIsLoading || currenciesLoading,
		isPending,
		isComplete: listStepObj.isComplete,
		currentStep,
		nextStep: nextStepValue,
		progress: progressPercent,
		error,

		// Legacy for backward compatibility with Modal.tsx (can remove later)
		listing: {
			price: {
				amountRaw: priceInWei,
				currency: selectedCurrency,
			},
			quantity: state.quantityInput,
			expiry: expiryDate,
			currencies: allCurrencies,
			orderbookKind,
		},
		currencies: {
			all: allCurrencies || [],
			available: availableCurrencies,
			selected: selectedCurrency,
			isLoading: currenciesLoading,
			validation: {
				hasAvailableCurrencies: availableCurrencies.length > 0,
				isSelected: !!selectedCurrency.contractAddress,
				isSupported: isCurrencySupported(selectedCurrency, availableCurrencies),
				error: !availableCurrencies.length
					? 'No currencies configured for this marketplace'
					: !selectedCurrency.contractAddress
						? 'Select a currency'
						: null,
			},
			select: (currency: Currency) => {
				createListingModalStore.send({
					type: 'selectCurrency',
					address: currency.contractAddress as Address,
				});
			},
			isNative: isNativeCurrency,
			isSupported: (currency: Currency) =>
				isCurrencySupported(currency, availableCurrencies),
			getDefault: () => getDefaultCurrency(availableCurrencies, orderbookKind),
		},
		flow: {
			steps: steps as ListingSteps,
			nextStep,
			status: flowStatus,
			isPending,
			totalSteps,
			completedSteps,
			progress: progressPercent,
			formValid: isFormValid,
			hasInvalidatedSteps: isApprovalInvalidated,
		},
		loading: {
			collectible: collectibleIsLoading,
			collection: collectionIsLoading,
			currencies: currenciesLoading,
			steps: listingSteps.isLoading,
		},
		feeSelection,
	};
}

export type CreateListingModalContext = ReturnType<
	typeof useCreateListingModalContext
>;
