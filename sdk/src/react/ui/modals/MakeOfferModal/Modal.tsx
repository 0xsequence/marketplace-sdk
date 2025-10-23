'use client';

import { useState } from 'react';
import type { Address } from 'viem';
import type { FeeOption } from '../../../../types/waas-types';
import { ContractType, OrderbookKind } from '../../../_internal';
import {
	useCollectible,
	useLowestListing,
	useMarketplaceConfig,
	useModalData,
} from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useBuyModal } from '../BuyModal';
import { useMakeOfferActions } from './hooks/useMakeOfferActions';
import {
	makeOfferModalStore,
	useIsOpen,
	useMakeOfferModalState,
} from './store';

export const MakeOfferModal = () => {
	const isOpen = useIsOpen();
	if (!isOpen) return null;
	return <Modal />;
};

const Modal = () => {
	// ✅ Get essential modal state from store (following SellModal pattern)
	const {
		collectionAddress,
		chainId,
		collectibleId,
		orderbookKind,
		callbacks,
		offerPrice,
		offerPriceChanged,
		quantity,
		expiry,
	} = useMakeOfferModalState();

	// ✅ Use consolidated modal data hook (like SellModal)
	const modalData = useModalData({
		chainId,
		collectionAddress,
		currencyAddress: offerPrice.currency.contractAddress as Address | undefined,
	});

	// ✅ Validation state (minimal) - following SellModal simplification
	const [invalidQuantity, setInvalidQuantity] = useState(false);
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [openseaLowestPriceCriteriaMet, setOpenseaLowestPriceCriteriaMet] =
		useState(true);

	// ✅ Additional hooks for specific data
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const buyModal = useBuyModal(callbacks);

	// ✅ Collectible data (not in modalData, so fetch separately)
	const {
		data: collectible,
		isLoading: collectibleIsLoading,
		isError: collectibleIsError,
		error: collectibleError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	const { data: lowestListing } = useLowestListing({
		tokenId: collectibleId,
		chainId,
		collectionAddress,
		filter: {
			currencies: [offerPrice.currency.contractAddress],
		},
	});

	// ✅ Derive collection config - no memo needed
	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const collectionOrderbookKind = collectionConfig?.destinationMarketplace;

	// ✅ Simple derived state - use modalData
	const isLoadingData = modalData.loading.any || collectibleIsLoading;

	// ✅ Main actions hook with all business logic
	const {
		handleMakeOffer,
		handleApproval,
		approvalNeeded,
		isProcessing,
		isApproving,
		showWaasFeeOptions,
		errors: actionErrors,
	} = useMakeOfferActions({
		tokenId: collectibleId,
		collectionAddress,
		chainId,
		callbacks,
		orderbookKind: orderbookKind || collectionOrderbookKind,
		collectionType: modalData.data.collection?.type as ContractType | undefined,
		collectibleDecimals: collectible?.decimals,
		offerPrice,
		quantity,
		expiry,
	});

	// ✅ WaaS fee options helpers
	const {
		shouldHideActionButton: shouldHideOfferButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible: showWaasFeeOptions,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	// ✅ Enhanced error handling (following SellModal pattern)
	const error =
		collectibleError ||
		modalData.errors.collection ||
		modalData.errors.currencies ||
		actionErrors.find((e) => e.error)?.error;

	// ✅ Error modal conditions
	if (collectibleIsError || modalData.hasError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={() => makeOfferModalStore.send({ type: 'close' })}
				title="Make an offer"
			/>
		);
	}

	if (
		!isLoadingData &&
		(!modalData.data.currencies || modalData.data.currencies.length === 0)
	) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={() => makeOfferModalStore.send({ type: 'close' })}
				title="Make an offer"
				message="No ERC-20s are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

	// ✅ Simple handlers - no useCallback needed
	const handleBuyNow = () => {
		makeOfferModalStore.send({ type: 'close' });
		if (lowestListing) {
			buyModal.show({
				chainId,
				collectionAddress,
				collectibleId,
				orderId: lowestListing.orderId,
				marketplace: lowestListing.marketplace,
			});
		}
	};

	const handleClose = () => {
		makeOfferModalStore.send({ type: 'close' });
		selectWaasFeeOptionsStore.send({ type: 'hide' });
	};

	// ✅ Derive button states - no useMemo needed
	const offerCtaLabel = getActionLabel('Make offer');

	const isDisabled =
		invalidQuantity ||
		insufficientBalance ||
		offerPrice.amountRaw === '0' ||
		!offerPriceChanged ||
		(orderbookKind === OrderbookKind.opensea && !openseaLowestPriceCriteriaMet);

	// ✅ Simple CTA configuration - derived inline
	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: handleApproval,
			hidden: !approvalNeeded,
			pending: isApproving,
			variant: 'glass' as const,
			disabled: isDisabled || isProcessing,
		},
		{
			label: offerCtaLabel,
			onClick: handleMakeOffer,
			pending: isProcessing && !isApproving,
			disabled: approvalNeeded || isDisabled || isProcessing,
		},
	];

	return (
		<ActionModal
			isOpen={true}
			chainId={Number(chainId)}
			onClose={handleClose}
			title="Make an offer"
			ctas={ctas}
			modalLoading={isLoadingData}
			spinnerContainerClassname="h-[188px]"
			hideCtas={shouldHideOfferButton}
			error={error}
			onErrorDismiss={() => {
				// Note: Reset functionality will be handled by the actions hook internally
				// For now, we let ActionModal handle error dismissal
			}}
			onErrorAction={(error, action) => {
				// Handle smart error actions
				console.log('Error action triggered:', action.type, error.name);
				if (action.type === 'retry') {
					// Retry the failed operation
					if (actionErrors.some((e) => e.error)) {
						handleMakeOffer();
					}
				}
			}}
			errorPosition="bottom"
		>
			<TokenPreview
				collectionName={modalData.data.collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				chainId={chainId}
			/>

			<PriceInput
				chainId={chainId}
				collectionAddress={collectionAddress}
				price={offerPrice}
				onPriceChange={(newPrice) => {
					makeOfferModalStore.send({ type: 'updatePrice', price: newPrice });
				}}
				onCurrencyChange={(newCurrency) => {
					makeOfferModalStore.send({
						type: 'updateCurrency',
						currency: newCurrency,
					});
				}}
				includeNativeCurrency={false}
				checkBalance={{
					enabled: true,
					callback: setInsufficientBalance,
				}}
				setOpenseaLowestPriceCriteriaMet={setOpenseaLowestPriceCriteriaMet}
				orderbookKind={orderbookKind || collectionOrderbookKind}
				modalType="offer"
				disabled={shouldHideOfferButton}
			/>

			{modalData.data.collection?.type === ContractType.ERC1155 && (
				<QuantityInput
					quantity={quantity}
					invalidQuantity={invalidQuantity}
					onQuantityChange={(newQuantity) =>
						makeOfferModalStore.send({
							type: 'updateQuantity',
							quantity: newQuantity,
						})
					}
					onInvalidQuantityChange={setInvalidQuantity}
					decimals={collectible?.decimals || 0}
					maxQuantity={String(Number.MAX_SAFE_INTEGER)}
					disabled={shouldHideOfferButton}
				/>
			)}

			{offerPrice.amountRaw !== '0' &&
				offerPriceChanged &&
				!insufficientBalance && (
					<FloorPriceText
						tokenId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						price={offerPrice}
						onBuyNow={handleBuyNow}
					/>
				)}

			<ExpirationDateSelect
				date={expiry}
				onDateChange={(date) =>
					makeOfferModalStore.send({ type: 'updateExpiry', expiry: date })
				}
				disabled={shouldHideOfferButton}
			/>

			{waasFeeOptionsShown && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						// Processing state is now handled in the actions hook, no need to set here
					}}
					titleOnConfirm="Processing offer..."
				/>
			)}

			{/* 🆕 Enhanced error handling moved to ActionModal - no need for manual ErrorDisplay */}
		</ActionModal>
	);
};
