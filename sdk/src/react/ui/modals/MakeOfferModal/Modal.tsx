'use client';

import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { useState } from 'react';
import { parseUnits } from 'viem';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import { ContractType } from '../../../_internal';
import { useWallet } from '../../../_internal/wallet/useWallet';
import {
	useCollectible,
	useCollection,
	useLowestListing,
	useMarketCurrencies,
} from '../../../hooks';
import { useBuyModal } from '../BuyModal';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptions$ } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useMakeOffer } from './hooks/useMakeOffer';
import {
	makeOfferModal,
	makeOfferModalStore,
	useExpiry,
	useInvalidQuantity,
	useIsOpen,
	useModalState,
	useOfferIsBeingProcessed,
	useOfferPrice,
	useOfferPriceChanged,
	useQuantity,
	useSteps,
} from './store';

export const MakeOfferModal = () => {
	const isOpen = useIsOpen();
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const state = useModalState();
	const {
		collectionAddress,
		chainId,
		collectibleId,
		orderbookKind,
		callbacks,
	} = state;
	const offerPrice = useOfferPrice();
	const offerPriceChanged = useOfferPriceChanged();
	const invalidQuantity = useInvalidQuantity();
	const steps = useSteps();
	const quantity = useQuantity();
	const expiry = useExpiry();
	const offerIsBeingProcessed = useOfferIsBeingProcessed();
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const {
		data: collectible,
		isLoading: collectableIsLoading,
		isError: collectableIsError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const { wallet } = useWallet();
	const isProcessing = offerIsBeingProcessed;

	const {
		shouldHideActionButton: shouldHideOfferButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible: selectWaasFeeOptions$.isVisible.get(),
		selectedFeeOption:
			selectWaasFeeOptions$.selectedFeeOption.get() as FeeOption,
	});

	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const {
		data: currencies,
		isLoading: currenciesLoading,
		isError: currenciesIsError,
	} = useMarketCurrencies({
		chainId,
		includeNativeCurrency: false,
	});
	const modalLoading =
		collectableIsLoading || collectionIsLoading || currenciesLoading;

	const { isLoading, executeApproval, makeOffer } = useMakeOffer({
		offerInput: {
			contractType: collection?.type as ContractType,
			offer: {
				tokenId: collectibleId,
				quantity: parseUnits(quantity, collectible?.decimals || 0).toString(),
				expiry: dateToUnixTime(expiry),
				currencyAddress: offerPrice.currency.contractAddress,
				pricePerToken: offerPrice.amountRaw,
			},
		},
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal: () => makeOfferModal.close(),
		steps$: makeOfferModal.steps as any,
	});

	const buyModal = useBuyModal(callbacks);

	const { data: lowestListing } = useLowestListing({
		tokenId: collectibleId,
		chainId,
		collectionAddress,
		filter: {
			currencies: [offerPrice.currency.contractAddress],
		},
	});

	if (collectableIsError || collectionIsError || currenciesIsError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={makeOfferModal.close}
				title="Make an offer"
			/>
		);
	}

	if (!modalLoading && (!currencies || currencies.length === 0)) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={makeOfferModal.close}
				title="Make an offer"
				message="No ERC-20s are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

	const handleMakeOffer = async () => {
		makeOfferModal.offerIsBeingProcessed.set(true);

		try {
			if (wallet?.isWaaS) {
				selectWaasFeeOptions$.isVisible.set(true);
			}

			await makeOffer({
				isTransactionExecuting: wallet?.isWaaS
					? getNetwork(Number(chainId)).type !== NetworkType.TESTNET
					: false,
			});
		} catch (error) {
			console.error('Make offer failed:', error);
		} finally {
			makeOfferModal.offerIsBeingProcessed.set(false);
			makeOfferModal.steps.transaction.isExecuting.set(false);
		}
	};

	const offerCtaLabel = getActionLabel('Make offer');

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps.approval.exist,
			pending: steps.approval.isExecuting,
			variant: 'glass' as const,
			disabled:
				invalidQuantity ||
				isLoading ||
				insufficientBalance ||
				offerPrice.amountRaw === '0' ||
				!offerPriceChanged,
		},
		{
			label: offerCtaLabel,
			onClick: () => handleMakeOffer(),
			pending: steps?.transaction.isExecuting || offerIsBeingProcessed,
			disabled:
				steps.approval.isExecuting ||
				steps.approval.exist ||
				offerPrice.amountRaw === '0' ||
				insufficientBalance ||
				isLoading ||
				invalidQuantity,
		},
	];

	return (
		<>
			<ActionModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={() => {
					makeOfferModal.close();
					selectWaasFeeOptions$.hide();
					makeOfferModal.steps.transaction.isExecuting.set(false);
				}}
				title="Make an offer"
				ctas={ctas}
				modalLoading={modalLoading}
				spinnerContainerClassname="h-[188px]"
				hideCtas={shouldHideOfferButton}
			>
				<TokenPreview
					collectionName={collection?.name}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					chainId={chainId}
				/>

				<PriceInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={offerPrice}
					onPriceChange={(newPrice) => {
						makeOfferModalStore.send({ type: 'setOfferPrice', ...newPrice });
						makeOfferModalStore.send({
							type: 'setOfferPriceChanged',
							changed: true,
						});
					}}
					includeNativeCurrency={false}
					checkBalance={{
						enabled: true,
						callback: (state) => setInsufficientBalance(state),
					}}
					disabled={shouldHideOfferButton}
				/>

				{collection?.type === ContractType.ERC1155 && (
					<QuantityInput
						quantity={quantity}
						invalidQuantity={invalidQuantity}
						onQuantityChange={(newQuantity) =>
							makeOfferModalStore.send({
								type: 'setQuantity',
								quantity: newQuantity,
							})
						}
						onInvalidQuantityChange={(invalid) =>
							makeOfferModalStore.send({ type: 'setInvalidQuantity', invalid })
						}
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
							onBuyNow={() => {
								makeOfferModal.close();

								if (lowestListing) {
									buyModal.show({
										chainId,
										collectionAddress,
										collectibleId,
										orderId: lowestListing.orderId,
										marketplace: lowestListing.marketplace,
										marketplaceType: 'market',
										quantityDecimals: lowestListing.quantityDecimals,
										quantityRemaining: Number(lowestListing.quantityRemaining),
									});
								}
							}}
						/>
					)}
				<ExpirationDateSelect
					date={expiry}
					onDateChange={(newDate) =>
						makeOfferModalStore.send({ type: 'setExpiry', expiry: newDate })
					}
					disabled={shouldHideOfferButton}
				/>

				{waasFeeOptionsShown && (
					<SelectWaasFeeOptions
						chainId={Number(chainId)}
						onCancel={() => {
							makeOfferModal.offerIsBeingProcessed.set(false);
							makeOfferModal.steps.transaction.isExecuting.set(false);
						}}
						titleOnConfirm="Processing offer..."
					/>
				)}
			</ActionModal>
		</>
	);
};
