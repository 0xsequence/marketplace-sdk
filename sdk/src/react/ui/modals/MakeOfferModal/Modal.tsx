'use client';

import { observer, Show, use$ } from '@legendapp/state/react';
import { useState } from 'react';
import { parseUnits } from 'viem';
import { dateToUnixTime } from '../../../../utils/date';
import { ContractType, OrderbookKind } from '../../../_internal';
import {
	useCollectibleDetail,
	useCollectibleMarketLowestListing,
	useCollectionDetail,
	useConnectorMetadata,
	useMarketCurrencies,
	useMarketplaceConfig,
	useWaasFeeStep,
} from '../../../hooks';
import { useRoyalty } from '../../../hooks/utils/useRoyalty';
import {
	ActionModal,
	type CtaAction,
} from '../_internal/components/baseModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import { useBuyModal } from '../BuyModal';
import { useMakeOffer } from './hooks/useMakeOffer';
import { makeOfferModal$ } from './store';

export const MakeOfferModal = () => {
	return <Show if={makeOfferModal$.isOpen}>{() => <Modal />}</Show>;
};

const Modal = observer(() => {
	const state = makeOfferModal$.get();
	const {
		collectionAddress,
		chainId,
		offerPrice,
		offerPriceChanged,
		invalidQuantity,
		tokenId,
		orderbookKind: orderbookKindProp,
		callbacks,
	} = state;
	const { isWaaS } = useConnectorMetadata();

	// WaaS fee management
	const waasFeeStep = useWaasFeeStep({
		enabled: isWaaS && makeOfferModal$.isOpen.get(),
	});

	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const orderbookKind =
		orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = makeOfferModal$.steps;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [openseaLowestPriceCriteriaMet, setOpenseaLowestPriceCriteriaMet] =
		useState(true);
	const collectibleQuery = useCollectibleDetail({
		chainId,
		collectionAddress,
		tokenId,
	});
	//const isProcessing = makeOfferModal$.offerIsBeingProcessed.get();

	const collectionQuery = useCollectionDetail({
		chainId,
		collectionAddress,
	});
	const marketCurrenciesQuery = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency: false,
	});

	const royaltyQuery = useRoyalty({
		chainId,
		collectionAddress,
		tokenId,
	});

	const modalLoading =
		collectibleQuery.isLoading ||
		collectionQuery.isLoading ||
		marketCurrenciesQuery.isLoading ||
		royaltyQuery.isLoading;

	const {
		isLoading,
		executeApproval,
		makeOffer,
		tokenApprovalIsLoading,
		error: makeOfferError,
	} = useMakeOffer({
		offerInput: {
			contractType: collectionQuery.data?.type as ContractType,
			offer: {
				tokenId,
				quantity: parseUnits(
					makeOfferModal$.quantity.get(),
					collectibleQuery.data?.decimals || 0,
				),
				expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
				currencyAddress: offerPrice.currency.contractAddress,
				pricePerToken: offerPrice.amountRaw,
			},
		},
		chainId,
		collectionAddress,
		callbacks,
		orderbookKind,
		closeMainModal: () => makeOfferModal$.close(),
		steps$,
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

	const erc20NotConfiguredError =
		!modalLoading &&
		(!marketCurrenciesQuery.data || marketCurrenciesQuery.data.length === 0)
			? new Error(
					'No ERC-20s are configured for the marketplace, contact the marketplace owners',
				)
			: undefined;

	const buyModal = useBuyModal(callbacks);

	const lowestListingQuery = useCollectibleMarketLowestListing({
		tokenId,
		chainId,
		collectionAddress,
		filter: {
			currencies: [offerPrice.currency.contractAddress],
		},
	});

	const handleMakeOffer = async () => {
		makeOfferModal$.offerIsBeingProcessed.set(true);

		try {
			await makeOffer({
				isTransactionExecuting: !!isWaaS,
			});
		} catch (error) {
			console.error('Make offer failed:', error);
			throw error as Error;
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error('Approve TOKEN failed:', error);
			throw error as Error;
		});
	};

	const primaryAction = {
		label: 'Make offer',
		actionName: 'offer',
		onClick: handleMakeOffer,
		loading:
			steps$?.transaction.isExecuting.get() ||
			makeOfferModal$.offerIsBeingProcessed.get(),
		testid: 'make-offer-submit-button',
		disabled:
			steps$.approval.exist.get() ||
			tokenApprovalIsLoading ||
			offerPrice.amountRaw === 0n ||
			invalidQuantity ||
			insufficientBalance ||
			(orderbookKind === OrderbookKind.opensea &&
				!openseaLowestPriceCriteriaMet) ||
			isLoading ||
			makeOfferModal$.offerIsBeingProcessed.get() ||
			!!(isWaaS && waasFeeStep && !waasFeeStep.waasFee.optionConfirmed),
	};

	const secondaryAction = {
		label: 'Approve TOKEN',
		actionName: 'currency spending approval',
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		loading: steps$?.approval.isExecuting.get(),
		variant: 'secondary' as const,
		disabled:
			invalidQuantity ||
			offerPrice.amountRaw === '0' ||
			steps$?.approval.isExecuting.get() ||
			tokenApprovalIsLoading ||
			isLoading,
	};

	const queries = {
		collection: collectionQuery,
		collectible: collectibleQuery,
		royalty: royaltyQuery,
		lowestListing: lowestListingQuery,
	};

	return (
		<ActionModal
			chainId={Number(chainId)}
			type="offer"
			onClose={() => {
				makeOfferModal$.close();
			}}
			title="Make an offer"
			primaryAction={primaryAction}
			secondaryAction={secondaryAction as CtaAction}
			onErrorDismiss={() => {
				makeOfferModal$.close();
			}}
			queries={queries}
			externalError={makeOfferError || erc20NotConfiguredError}
			//transactionIsBeingProcessed={isProcessing}
			//setTransactionIsBeingProcessed={(isBeingProcessed) => {
			//	makeOfferModal$.offerIsBeingProcessed.set(isBeingProcessed);
			//}}
			/*onWaasFeeSelectionCancel={() => {
		//	makeOfferModal$.offerIsBeingProcessed.set(false);
		//	steps$.transaction.isExecuting.set(false);
		//}}*/
		>
			{({ collection, collectible, royalty, lowestListing }) => {
				// Show fee selection UI if manual confirmation needed
				if (
					waasFeeStep &&
					waasFeeStep.waasFee.feeOptionConfirmation &&
					!waasFeeStep.waasFee.optionConfirmed &&
					waasFeeStep.waasFee.selectedOption
				) {
					return (
						<SelectWaasFeeOptions
							chainId={chainId}
							feeOptionConfirmation={waasFeeStep.waasFee.feeOptionConfirmation}
							selectedOption={waasFeeStep.waasFee.selectedOption}
							onSelectedOptionChange={waasFeeStep.waasFee.setSelectedFeeOption}
							onConfirm={() => {
								waasFeeStep.waasFee.confirmFeeOption(
									waasFeeStep.waasFee.feeOptionConfirmation.id,
									waasFeeStep.waasFee.selectedOption?.token.contractAddress as
										| string
										| null,
								);
								waasFeeStep.waasFee.setOptionConfirmed(true);
							}}
							optionConfirmed={waasFeeStep.waasFee.optionConfirmed}
						/>
					);
				}

				return (
					<>
						<TokenPreview
							collectionName={collection?.name}
							collectionAddress={collectionAddress}
							tokenId={tokenId}
							chainId={chainId}
						/>

						<PriceInput
							chainId={chainId}
							collectionAddress={collectionAddress}
							price={offerPrice}
							onPriceChange={(newPrice) => {
								makeOfferModal$.offerPrice.set(newPrice);
								makeOfferModal$.offerPriceChanged.set(true);
							}}
							onCurrencyChange={(newCurrency) => {
								makeOfferModal$.offerPrice.currency.set(newCurrency);
							}}
							includeNativeCurrency={false}
							checkBalance={{
								enabled: true,
								callback: (state) => setInsufficientBalance(state),
							}}
							setOpenseaLowestPriceCriteriaMet={(state) =>
								setOpenseaLowestPriceCriteriaMet(state)
							}
							orderbookKind={orderbookKind}
							modalType="offer"
							feeData={{
								royaltyPercentage: royalty ? Number(royalty.percentage) : 0,
							}}
						/>

						{collection?.type === ContractType.ERC1155 && (
							<QuantityInput
								quantity={use$(makeOfferModal$.quantity)}
								invalidQuantity={use$(makeOfferModal$.invalidQuantity)}
								onQuantityChange={(quantity) =>
									makeOfferModal$.quantity.set(quantity)
								}
								onInvalidQuantityChange={(invalid) =>
									makeOfferModal$.invalidQuantity.set(invalid)
								}
								decimals={collectible?.decimals || 0}
								maxQuantity={String(Number.MAX_SAFE_INTEGER)}
							/>
						)}

						{offerPrice.amountRaw !== 0n &&
							offerPriceChanged &&
							!insufficientBalance && (
								<FloorPriceText
									tokenId={tokenId}
									chainId={chainId}
									collectionAddress={collectionAddress}
									price={offerPrice}
									onBuyNow={() => {
										makeOfferModal$.close();

										if (lowestListing) {
											buyModal.show({
												chainId,
												collectionAddress,
												tokenId,
												orderId: lowestListing.orderId,
												marketplace: lowestListing.marketplace,
											});
										}
									}}
								/>
							)}
						<ExpirationDateSelect
							date={makeOfferModal$.expiry.get()}
							onDateChange={(date) => makeOfferModal$.expiry.set(date)}
						/>
					</>
				);
			}}
		</ActionModal>
	);
});
