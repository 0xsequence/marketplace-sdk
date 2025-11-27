'use client';

import { NetworkType } from '@0xsequence/network';
import { observer, Show, use$ } from '@legendapp/state/react';
import { useState } from 'react';
import { parseUnits } from 'viem';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import { getNetwork } from '../../../../utils/network';
import { ContractType, OrderbookKind } from '../../../_internal';
import {
	useCollectibleDetail,
	useCollectibleMarketLowestListing,
	useCollectionDetail,
	useMarketCurrencies,
	useMarketplaceConfig,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import { useRoyalty } from '../../../hooks/utils/useRoyalty';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
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
	const { isWaaS } = useConnectorMetadata();
	const isProcessing = makeOfferModal$.offerIsBeingProcessed.get();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	const {
		shouldHideActionButton: shouldHideOfferButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

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
		executeApproval,
		makeOffer,
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
	});

	const erc20NotConfiguredError =
		!modalLoading &&
		(!marketCurrenciesQuery.data || marketCurrenciesQuery.data.length === 0)
			? new Error(
					'No ERC-20s are configured for the marketplace, contact the marketplace owners',
				)
			: undefined;

	const buyModal = useBuyModal({ callbacks });

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
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await makeOffer({
				isTransactionExecuting: isWaaS
					? getNetwork(Number(chainId)).type !== NetworkType.TESTNET
					: false,
			});
		} catch (error) {
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

	const offerCtaLabel = getActionLabel('Make offer');

	const primaryAction = {
		label: offerCtaLabel,
		actionName: 'offer',
		onClick: () => handleMakeOffer(),
		loading:
			steps$?.transaction.isExecuting.get() ||
			makeOfferModal$.offerIsBeingProcessed.get(),
		disabled:
			steps$.approval.isExecuting.get() ||
			steps$.approval.exist.get() ||
			offerPrice.amountRaw === 0n ||
			invalidQuantity ||
			insufficientBalance ||
			(orderbookKind === OrderbookKind.opensea &&
				!openseaLowestPriceCriteriaMet) ||
			makeOfferModal$.offerIsBeingProcessed.get(),
	};

	const secondaryAction = {
		label: 'Approve TOKEN',
		actionName: 'currency spending approval',
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		loading: steps$.approval.isExecuting.get(),
		variant: 'secondary' as const,
		disabled: makeOfferModal$.offerIsBeingProcessed.get(),
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
			onClose={() => {
				makeOfferModal$.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
				steps$.transaction.isExecuting.set(false);
			}}
			type="offer"
			title="Make an offer"
			primaryAction={primaryAction}
			secondaryAction={secondaryAction}
			queries={queries}
			onErrorDismiss={() => {
				makeOfferModal$.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
				steps$.transaction.isExecuting.set(false);
			}}
			externalError={makeOfferError || erc20NotConfiguredError}
		>
			{({ collection, collectible, royalty, lowestListing }) => (
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
						disabled={shouldHideOfferButton}
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
							disabled={shouldHideOfferButton}
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
						disabled={shouldHideOfferButton}
					/>

					{waasFeeOptionsShown && (
						<SelectWaasFeeOptions
							chainId={Number(chainId)}
							onCancel={() => {
								makeOfferModal$.offerIsBeingProcessed.set(false);
								steps$.transaction.isExecuting.set(false);
							}}
							titleOnConfirm="Processing offer..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
});
