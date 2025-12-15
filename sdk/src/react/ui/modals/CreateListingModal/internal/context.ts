import type { Dnum } from 'dnum';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../../utils/date';
import { type ContractType, OrderbookKind } from '../../../../_internal';
import {
	useCollectibleBalance,
	useCollectibleMetadata,
	useCollectionMetadata,
	useConfig,
	useConnectorMetadata,
	useCurrencyList,
	useMarketplaceConfig,
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
import { isFormValid, validateListingForm } from './helpers/validation';
import { useListingMutations } from './listing-mutations';
import { useCreateListingModalState } from './store';

export type CreateListingModalSteps = {
	fee?: FeeStep;
	approval?: ApprovalStep;
	listing: TransactionStep;
};

export function useCreateListingModalContext() {
	const state = useCreateListingModalState();
	const { address } = useAccount();
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const orderbookKind = marketplaceConfig?.market.collections.find(
		(collection) => collection.itemsAddress === state.collectionAddress,
	)?.destinationMarketplace;
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
		includeNativeCurrency: true,
	});

	const collectibleBalanceQuery = useCollectibleBalance({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
		userAddress: address ?? undefined,
		query: {
			enabled: !!address && collectionQuery.data?.type === 'ERC1155',
		},
	});

	const { isWaaS, isSequence } = useConnectorMetadata();
	const canBeBundled =
		isSequence && orderbookKind === OrderbookKind.sequence_marketplace_v2;

	const availableCurrencies = useMemo(() => {
		if (!currenciesQuery.data) return [];
		return filterCurrenciesForOrderbook(
			currenciesQuery.data,
			orderbookKind,
			state.chainId,
		);
	}, [currenciesQuery.data, orderbookKind, state.chainId]);

	const selectedCurrency = useMemo(() => {
		if (state.currencyAddress) {
			return (
				availableCurrencies.find(
					(c) => c.contractAddress === state.currencyAddress,
				) || null
			);
		}
		return getDefaultCurrency(availableCurrencies, orderbookKind, 'listing');
	}, [state.currencyAddress, availableCurrencies, orderbookKind]);

	const expiryDate = useMemo(
		() => new Date(Date.now() + state.expiryDays * 24 * 60 * 60 * 1000),
		[state.expiryDays],
	);

	const priceDnum: Dnum = useMemo(() => {
		if (!state.priceInput || state.priceInput === '') {
			return [0n, selectedCurrency?.decimals ?? 18];
		}
		try {
			return [
				BigInt(state.priceInput),
				selectedCurrency?.decimals ?? 18,
			] as Dnum;
		} catch {
			return [0n, selectedCurrency?.decimals ?? 18];
		}
	}, [state.priceInput, selectedCurrency?.decimals]);
	const priceRaw = priceDnum[0];

	const quantityDnum: Dnum = useMemo(() => {
		if (!state.quantityInput || state.quantityInput === '') {
			return [0n, collectibleQuery.data?.decimals ?? 0];
		}
		try {
			return [
				BigInt(state.quantityInput),
				collectibleQuery.data?.decimals ?? 0,
			] as Dnum;
		} catch {
			return [0n, collectibleQuery.data?.decimals ?? 0];
		}
	}, [state.quantityInput, collectibleQuery.data?.decimals]);
	const quantityRaw = quantityDnum[0];

	const balanceDnum: Dnum | undefined = useMemo(() => {
		if (
			collectibleBalanceQuery.data?.balance !== undefined &&
			collectibleQuery.data?.decimals !== undefined
		) {
			return [
				BigInt(collectibleBalanceQuery.data.balance),
				collectibleQuery.data.decimals,
			];
		}
		return undefined;
	}, [collectibleBalanceQuery.data?.balance, collectibleQuery.data?.decimals]);

	const validation = useMemo(
		() =>
			validateListingForm({
				price: priceDnum,
				quantity: quantityDnum,
				balance: balanceDnum,
			}),
		[priceDnum, quantityDnum, balanceDnum],
	);

	const formIsValid = isFormValid(validation);

	const { approve, createListing, needsApproval, nftApprovalQuery } =
		useListingMutations({
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			contractType: collectionQuery.data?.type as ContractType | undefined,
			orderbookKind,
			listing: {
				tokenId: state.tokenId,
				quantity: quantityRaw,
				expiry: dateToUnixTime(expiryDate).toString(),
				currencyAddress:
					selectedCurrency?.contractAddress ??
					('0x0000000000000000000000000000000000000000' as Address),
				pricePerToken: priceRaw,
			},
			currencyDecimals: selectedCurrency?.decimals ?? 18,
			nftApprovalEnabled:
				!!address &&
				!!collectionQuery.data?.type &&
				!!orderbookKind &&
				state.isOpen &&
				!canBeBundled,
		});

	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } =
		useWaasFeeOptions(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible =
		waas.isVisible || (!isSponsored && !!pendingFeeOptionConfirmation?.options);

	const steps: CreateListingModalSteps = {} as CreateListingModalSteps;

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

	if (needsApproval && !approve.isSuccess) {
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

	const listingGuard = createFinalTransactionGuard({
		isFormValid: formIsValid,
		txReady: true,
		walletConnected: !!address,
		requiresApproval: needsApproval && !approve.isSuccess,
		approvalComplete: approve.isSuccess || !needsApproval,
	});
	const listingGuardResult = listingGuard();

	const listingData = createListing.data;
	const listingTransactionHash = listingData?.hash;
	const listingOrderId = listingData?.orderId;

	steps.listing = {
		label: 'Create Listing',
		status: createListing.isSuccess
			? 'success'
			: createListing.isPending
				? 'pending'
				: createListing.error
					? 'error'
					: 'idle',
		isPending: createListing.isPending,
		isSuccess: createListing.isSuccess,
		isDisabled: !listingGuardResult.canProceed,
		disabledReason: listingGuardResult.error?.message || null,
		error: createListing.error,
		canExecute: listingGuardResult.canProceed,
		result: listingTransactionHash
			? { type: 'transaction', hash: listingTransactionHash }
			: listingOrderId
				? { type: 'signature', orderId: listingOrderId }
				: null,
		execute: async () => {
			await createListing.mutateAsync();
		},
	};

	const flow = computeFlowState(steps);

	const error =
		nftApprovalQuery.error ||
		collectibleQuery.error ||
		collectionQuery.error ||
		currenciesQuery.error ||
		collectibleBalanceQuery.error;

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
			orderbookKind: orderbookKind as OrderbookKind,
		},

		listing: {
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
			},
			errors: {
				price: state.isPriceTouched ? validation.price.error : undefined,
				quantity: state.isQuantityTouched
					? validation.quantity.error
					: undefined,
				balance: state.isQuantityTouched
					? validation.balance?.error
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
			collectibleBalance: collectibleBalanceQuery.isLoading,
			nftApproval: nftApprovalQuery.isLoading,
		},

		transactions: {
			approve: approveTransactionHash,
			listing: listingTransactionHash,
		},

		error,
		queries: {
			collectible: collectibleQuery,
			collection: collectionQuery,
			currencies: currenciesQuery,
			collectibleBalance: collectibleBalanceQuery,
		},

		// Computed helpers for simpler consumption
		get formError() {
			if (!this.currencies.isConfigured) {
				return 'No ERC-20 currencies are configured for this marketplace';
			}
			return (
				this.form.errors.price ||
				this.form.errors.quantity ||
				this.form.errors.balance
			);
		},

		get actions() {
			const needsApprovalAction =
				this.steps.approval && this.steps.approval.status !== 'success';
			const currenciesBlocked = !this.currencies.isConfigured;

			return {
				approve:
					needsApprovalAction && !canBeBundled
						? {
								label: this.steps.approval?.label,
								onClick: this.steps.approval?.execute || (() => {}),
								loading: this.steps.approval?.isPending,
								disabled: this.steps.approval?.isDisabled || currenciesBlocked,
								testid: 'create-listing-approve-button',
							}
						: undefined,
				listing: {
					label: this.steps.listing.label,
					onClick: this.steps.listing.execute,
					loading: this.steps.listing.isPending,
					disabled: this.steps.listing.isDisabled || currenciesBlocked,
					variant: needsApprovalAction ? ('ghost' as const) : undefined,
					testid: 'create-listing-submit-button',
				},
			};
		},
	};
}

export type CreateListingModalContext = ReturnType<
	typeof useCreateListingModalContext
>;
