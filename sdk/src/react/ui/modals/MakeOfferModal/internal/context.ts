import { type ContractType, OrderbookKind } from '@0xsequence/api-client';
import type { Dnum } from 'dnum';
import { useMemo } from 'react';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../../utils/date';
import { getConduitAddressForOrderbook } from '../../../../../utils/getConduitAddressForOrderbook';
import {
	useCollectibleMarketLowestListing,
	useCollectibleMetadata,
	useCollectionMetadata,
	useConfig,
	useConnectorMetadata,
	useCurrencyList,
	useTokenCurrencyBalance,
} from '../../../../hooks';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import { useSelectWaasFeeOptionsStore } from '../../_internal/components/selectWaasFeeOptions/store';
import {
	filterCurrenciesForOrderbook,
	getDefaultCurrency,
} from '../../_internal/helpers/currency';
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
import { isFormValid, validateOfferForm } from './helpers/validation';
import { useERC20Allowance } from './hooks';
import { useOfferMutations } from './offer-mutations';
import { useMakeOfferModalState } from './store';

export type MakeOfferModalSteps = {
	fee?: FeeStep;
	approval?: ApprovalStep;
	offer: TransactionStep;
};

export function useMakeOfferModalContext() {
	const state = useMakeOfferModalState();
	const { address } = useAccount();
	const config = useConfig();

	const collectibleQuery = useCollectibleMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
	});

	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});

	const currenciesQuery = useCurrencyList({
		chainId: state.chainId,
		includeNativeCurrency: false,
	});

	const lowestListingQuery = useCollectibleMarketLowestListing({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
	});

	const { isWaaS, isSequence } = useConnectorMetadata();
	const canBeBundled =
		isSequence && state.orderbookKind === OrderbookKind.sequence_marketplace_v2;

	const availableCurrencies = useMemo(() => {
		if (!currenciesQuery.data) return [];
		return filterCurrenciesForOrderbook(
			currenciesQuery.data,
			state.orderbookKind,
			state.chainId,
		);
	}, [currenciesQuery.data, state.orderbookKind, state.chainId]);

	const selectedCurrency = useMemo(() => {
		if (state.currencyAddress) {
			return (
				availableCurrencies.find(
					(c) => c.contractAddress === state.currencyAddress,
				) || null
			);
		}
		return getDefaultCurrency(
			availableCurrencies,
			state.orderbookKind,
			'offer',
		);
	}, [state.currencyAddress, availableCurrencies, state.orderbookKind]);

	const currencyBalanceQuery = useTokenCurrencyBalance({
		currencyAddress: selectedCurrency?.contractAddress,
		chainId: state.chainId,
		userAddress: address,
		query: {
			enabled: !!selectedCurrency?.contractAddress && !!address,
		},
	});

	const expiryDate = useMemo(
		() => new Date(Date.now() + state.expiryDays * 24 * 60 * 60 * 1000),
		[state.expiryDays],
	);

	const priceDnum = [
		state.priceInput ? BigInt(state.priceInput) : 0n,
		selectedCurrency?.decimals ?? 0,
	] as Dnum;
	const priceRaw = priceDnum[0];

	const quantityDnum = [BigInt(state.quantityInput), 0] as Dnum;
	const quantityRaw = BigInt(state.quantityInput);

	const balanceDnum =
		currencyBalanceQuery.data?.value !== undefined && selectedCurrency?.decimals
			? ([currencyBalanceQuery.data.value, selectedCurrency.decimals] as const)
			: undefined;

	const lowestListingDnum =
		lowestListingQuery.data?.priceAmount && selectedCurrency?.decimals
			? ([
					BigInt(lowestListingQuery.data.priceAmount),
					selectedCurrency.decimals,
				] as const)
			: undefined;

	const validation = validateOfferForm({
		price: priceDnum,
		quantity: quantityDnum,
		balance: balanceDnum,
		lowestListing: lowestListingDnum,
		orderbookKind: state.orderbookKind,
	});

	const formIsValid = isFormValid(validation);

	// Get the spender address for the selected orderbook
	const spenderAddress = getConduitAddressForOrderbook(state.orderbookKind);

	const allowanceQuery = useERC20Allowance({
		tokenAddress: selectedCurrency?.contractAddress,
		spenderAddress,
		chainId: state.chainId,
		enabled:
			!!selectedCurrency?.contractAddress &&
			!!address &&
			!!spenderAddress &&
			state.isOpen &&
			!canBeBundled,
	});

	const totalPriceNeeded = priceRaw * quantityRaw;

	const needsApproval = useMemo(() => {
		if (canBeBundled) return false;
		if (allowanceQuery.allowance === undefined) return true;

		return allowanceQuery.allowance < totalPriceNeeded;
	}, [allowanceQuery.allowance, totalPriceNeeded]);

	const { approve, makeOffer } = useOfferMutations({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		contractType: collectionQuery.data?.type as ContractType | undefined,
		orderbookKind: state.orderbookKind,
		offer: {
			tokenId: state.tokenId,
			quantity: quantityRaw,
			expiry: dateToUnixTime(expiryDate),
			currencyAddress: selectedCurrency?.contractAddress ?? zeroAddress,
			pricePerToken: priceRaw,
		},
		currencyDecimals: selectedCurrency?.decimals ?? 18,
		needsApproval,
	});

	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } =
		useWaasFeeOptions(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible =
		waas.isVisible || (!isSponsored && !!pendingFeeOptionConfirmation?.options);

	const steps: MakeOfferModalSteps = {} as MakeOfferModalSteps;

	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;

		steps.fee = {
			label: 'Select Fee',
			status: feeSelected
				? 'success'
				: isFeeSelectionVisible
					? 'selecting'
					: 'idle',
			isSponsored,
			isSelecting: isFeeSelectionVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => waas.show(),
			cancel: () => waas.hide(),
		};
	}

	const approveData = approve.data;
	const approveTransactionHash =
		approveData && 'type' in approveData && approveData.type === 'transaction'
			? approveData.hash
			: undefined;

	if (needsApproval && !approve.isSuccess && !canBeBundled) {
		const approvalGuard = createApprovalGuard({
			isFormValid: formIsValid,
			txReady: true,
			walletConnected: !!address,
		});
		const guardResult = approvalGuard();

		steps.approval = {
			label: 'Approve',
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
			execute: async () => {
				await approve.mutateAsync();
			},
			reset: () => approve.reset(),
		};
	}

	const offerGuard = createFinalTransactionGuard({
		isFormValid: formIsValid,
		txReady: true,
		walletConnected: !!address,
		requiresApproval: needsApproval && !approve.isSuccess,
		approvalComplete: approve.isSuccess || !needsApproval,
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
		execute: async () => {
			await makeOffer.mutateAsync();
		},
	};

	const flow = computeFlowState(steps);

	const error =
		allowanceQuery.error ||
		collectibleQuery.error ||
		collectionQuery.error ||
		currenciesQuery.error;

	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) {
			rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		}
		waas.hide();
		state.closeModal();
	};

	return {
		isOpen: state.isOpen,
		close: handleClose,

		item: {
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			tokenId: state.tokenId,
			orderbookKind: state.orderbookKind,
		},

		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collectible: collectibleQuery.data,
		collection: collectionQuery.data,

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

		form: {
			price: {
				input: state.priceInput,
				update: state.updatePriceInput,
				touch: state.touchPriceInput,
				isTouched: state.isPriceTouched,
			},
			quantity: {
				input: state.quantityInput,
				update: state.updateQuantityInput,
				touch: state.touchQuantityInput,
				isTouched: state.isQuantityTouched,
				validation: validation.quantity,
			},
			expiry: {
				update: state.updateExpiryDays,
			},
			isValid: formIsValid,
			validation: {
				price: validation.price,
				quantity: validation.quantity,
				balance: validation.balance,
				openseaCriteria: validation.openseaCriteria,
			},
			errors: {
				price: state.isPriceTouched ? validation.price.error : undefined,
				quantity: state.isQuantityTouched
					? validation.quantity.error
					: undefined,
				balance: state.isPriceTouched ? validation.balance.error : undefined,
				openseaCriteria: state.isPriceTouched
					? validation.openseaCriteria?.error
					: undefined,
			},
		},

		currencies: {
			available: availableCurrencies,
			selected: selectedCurrency,
			select: state.updateCurrency,
			isConfigured: availableCurrencies.length > 0,
		},

		steps,
		flow,

		loading: {
			collectible: collectibleQuery.isLoading,
			collection: collectionQuery.isLoading,
			currencies: currenciesQuery.isLoading,
			allowance: allowanceQuery.isLoading,
		},

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

		// Computed helpers for simpler consumption
		get formError() {
			if (!this.currencies.isConfigured) {
				return 'No ERC-20 currencies are configured for this marketplace';
			}
			return (
				this.form.errors.price ||
				this.form.errors.quantity ||
				this.form.errors.balance ||
				this.form.errors.openseaCriteria
			);
		},

		get actions() {
			const needsApprovalAction =
				this.steps.approval &&
				this.steps.approval.status !== 'success' &&
				priceRaw > 0n;
			const currenciesBlocked = !this.currencies.isConfigured;

			return {
				approve:
					needsApprovalAction && !canBeBundled
						? {
								label: this.steps.approval?.label,
								onClick: this.steps.approval?.execute || (() => {}),
								loading: this.steps.approval?.isPending,
								disabled: this.steps.approval?.isDisabled || currenciesBlocked,
								testid: 'make-offer-approve-button',
							}
						: undefined,
				offer: {
					label: this.steps.offer.label,
					onClick: this.steps.offer.execute,
					loading: this.steps.offer.isPending,
					disabled: this.steps.offer.isDisabled || currenciesBlocked,
					variant: needsApprovalAction ? ('ghost' as const) : undefined,
					testid: 'make-offer-button',
				},
			};
		},
	};
}

export type MakeOfferModalContext = ReturnType<typeof useMakeOfferModalContext>;
