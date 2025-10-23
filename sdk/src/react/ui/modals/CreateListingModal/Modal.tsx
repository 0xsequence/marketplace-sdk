'use client';

import * as dnum from 'dnum';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { OrderbookKind } from '../../../../types';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import type { ContractType } from '../../../_internal';
import {
	useBalanceOfCollectible,
	useCollectible,
	useMarketplaceConfig,
	useModalData,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
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
import TransactionDetails from '../_internal/components/transactionDetails';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useCreateListing } from './hooks/useCreateListing';
import { useCreateListingModalActions } from './hooks/useCreateListingModalActions';
import {
	createListingModalStore,
	useCreateListingModalState,
	useIsOpen,
} from './store';

export const CreateListingModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) return null;

	return <Modal />;
};

const Modal = () => {
	// ✅ Get essential modal state from store (following SellModal pattern)
	const {
		collectionAddress,
		chainId,
		listingPrice,
		collectibleId,
		orderbookKind,
		callbacks,
		quantity,
		invalidQuantity,
		expiry,
	} = useCreateListingModalState();

	// ✅ Use consolidated modal data hook (like SellModal)
	const modalData = useModalData({
		chainId,
		collectionAddress,
		currencyAddress: listingPrice.currency.contractAddress as `0x${string}`,
	});

	// ✅ Get marketplace config separately
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const { isWaaS } = useConnectorMetadata();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	// ✅ Collectible data (specific to this modal)
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

	const { address } = useAccount();

	const { data: balance } = useBalanceOfCollectible({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: address ?? undefined,
	});

	// ✅ Derive collection config - no memo needed (following SellModal pattern)
	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const collectionOrderbookKind = collectionConfig?.destinationMarketplace;

	// ✅ Derive data during render (following SellModal patterns)
	const balanceWithDecimals = balance?.balance
		? dnum.toNumber(
				dnum.from([BigInt(balance.balance), collectible?.decimals || 0]),
			)
		: 0;

	const listingInput = {
		contractType: modalData.data.collection?.type as ContractType,
		listing: {
			tokenId: collectibleId,
			quantity: parseUnits(quantity, collectible?.decimals || 0).toString(),
			expiry: dateToUnixTime(expiry),
			currencyAddress: listingPrice.currency.contractAddress,
			pricePerToken: listingPrice.amountRaw,
		},
	};

	const {
		isLoading,
		approvalNeeded,
		tokenApprovalIsLoading,
		isError: tokenApprovalIsError,
	} = useCreateListing({
		listingInput,
		chainId,
		collectionAddress,
		orderbookKind: orderbookKind || collectionOrderbookKind,
		callbacks,
		closeMainModal: () => createListingModalStore.send({ type: 'close' }),
	});

	// ✅ Use consolidated actions hook following SellModal patterns
	const {
		executeApproval,
		createListing,
		approvalExecuting,
		createListingExecuting,
		generatingSteps,
	} = useCreateListingModalActions({
		listingInput,
		chainId,
		collectionAddress,
		orderbookKind:
			orderbookKind ??
			collectionOrderbookKind ??
			OrderbookKind.sequence_marketplace_v2,
		callbacks,
		approvalNeeded,
	});

	// ✅ Derive loading and processing states (following SellModal pattern)
	const isLoadingData = modalData.loading.any || collectibleIsLoading;
	const isProcessing =
		isLoading || generatingSteps || approvalExecuting || createListingExecuting;

	const {
		shouldHideActionButton: shouldHideListButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	// ✅ Enhanced error handling (following SellModal + MakeOfferModal pattern)
	const error =
		collectibleError ||
		modalData.errors.collection ||
		modalData.errors.currencies;

	// ✅ Error modal conditions
	if (collectibleIsError || modalData.hasError || tokenApprovalIsError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={() => createListingModalStore.send({ type: 'close' })}
				title="List item for sale"
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
				onClose={() => createListingModalStore.send({ type: 'close' })}
				title="List item for sale"
				message="No currencies are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

	// ✅ Simple handlers - no useCallback needed (following SellModal pattern)
	const handleCreateListing = () => {
		if (isWaaS) {
			selectWaasFeeOptionsStore.send({ type: 'show' });
		}
		createListing();
	};

	const handleApproveToken = () => {
		executeApproval();
	};

	const handleClose = () => {
		createListingModalStore.send({ type: 'close' });
		selectWaasFeeOptionsStore.send({ type: 'hide' });
	};

	// ✅ Derive button states - no useMemo needed (following SellModal pattern)
	const listCtaLabel = getActionLabel('List item for sale');

	const isDisabled =
		invalidQuantity || listingPrice.amountRaw === '0' || isProcessing;

	// ✅ Simple CTA configuration - derived inline (following SellModal pattern)
	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: handleApproveToken,
			hidden: !approvalNeeded,
			pending: approvalExecuting,
			variant: 'glass' as const,
			disabled: isDisabled || tokenApprovalIsLoading,
		},
		{
			label: listCtaLabel,
			onClick: handleCreateListing,
			pending: createListingExecuting,
			testid: 'create-listing-submit-button',
			disabled: approvalNeeded || isDisabled || tokenApprovalIsLoading,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			isOpen={true}
			chainId={Number(chainId)}
			onClose={handleClose}
			title="List item for sale"
			ctas={ctas}
			modalLoading={isLoadingData}
			spinnerContainerClassname="h-[220px]"
			hideCtas={shouldHideListButton}
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
					handleCreateListing();
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
			<div className="flex w-full flex-col gap-1">
				<PriceInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={listingPrice}
					onPriceChange={(newPrice) => {
						createListingModalStore.send({
							type: 'updateListingPrice',
							price: newPrice,
						});
					}}
					onCurrencyChange={(newCurrency) => {
						createListingModalStore.send({
							type: 'updateListingPrice',
							price: { ...listingPrice, currency: newCurrency },
						});
					}}
					disabled={shouldHideListButton}
					orderbookKind={orderbookKind}
					modalType="listing"
				/>

				{listingPrice.amountRaw !== '0' && (
					<FloorPriceText
						tokenId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						price={listingPrice}
					/>
				)}
			</div>
			{modalData.data.collection?.type === 'ERC1155' && balance && (
				<QuantityInput
					quantity={quantity}
					invalidQuantity={invalidQuantity}
					onQuantityChange={(quantity) =>
						createListingModalStore.send({
							type: 'updateQuantity',
							quantity,
						})
					}
					onInvalidQuantityChange={(invalid) =>
						createListingModalStore.send({
							type: 'setInvalidQuantity',
							invalid,
						})
					}
					decimals={collectible?.decimals || 0}
					maxQuantity={balanceWithDecimals.toString()}
					disabled={shouldHideListButton}
				/>
			)}
			<ExpirationDateSelect
				date={expiry}
				onDateChange={(date) =>
					createListingModalStore.send({
						type: 'updateExpiry',
						expiry: date,
					})
				}
				disabled={shouldHideListButton}
			/>
			<TransactionDetails
				collectibleId={collectibleId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={listingPrice}
				currencyImageUrl={listingPrice.currency.imageUrl}
				includeMarketplaceFee={false}
			/>

			{waasFeeOptionsShown && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						// Processing state is now handled in the actions hook, no need to set here
					}}
					titleOnConfirm="Processing listing..."
				/>
			)}

			{/* 🆕 Enhanced error handling moved to ActionModal - no need for manual ErrorDisplay */}
		</ActionModal>
	);
};
