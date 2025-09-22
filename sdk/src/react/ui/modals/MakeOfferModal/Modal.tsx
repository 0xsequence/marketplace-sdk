'use client';

import { NetworkType } from '@0xsequence/network';
import { observer, Show, use$ } from '@legendapp/state/react';
import { useState } from 'react';
import { parseUnits } from 'viem';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import { getNetwork } from '../../../../utils/network';
import { ContractType } from '../../../_internal';
import {
	useCollectible,
	useCollection,
	useLowestListing,
	useMarketCurrencies,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
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
		collectibleId,
		orderbookKind,
		callbacks,
	} = state;
	const steps$ = makeOfferModal$.steps;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [openseaLowestPriceCriteriaMet, setOpenseaLowestPriceCriteriaMet] =
		useState(false);
	const {
		data: collectible,
		isLoading: collectableIsLoading,
		isError: collectableIsError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
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
				quantity: parseUnits(
					makeOfferModal$.quantity.get(),
					collectible?.decimals || 0,
				).toString(),
				expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
				currencyAddress: offerPrice.currency.contractAddress,
				pricePerToken: offerPrice.amountRaw,
			},
		},
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal: () => makeOfferModal$.close(),
		steps$: steps$,
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
				isOpen={makeOfferModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={makeOfferModal$.close}
				title="Make an offer"
			/>
		);
	}

	if (!modalLoading && (!currencies || currencies.length === 0)) {
		return (
			<ErrorModal
				isOpen={makeOfferModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={makeOfferModal$.close}
				title="Make an offer"
				message="No ERC-20s are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

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
			console.error('Make offer failed:', error);
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const offerCtaLabel = getActionLabel('Make offer');

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps$.approval.exist.get(),
			pending: steps$.approval.isExecuting.get(),
			variant: 'glass' as const,
			disabled:
				invalidQuantity ||
				isLoading ||
				insufficientBalance ||
				offerPrice.amountRaw === '0' ||
				!offerPriceChanged ||
				!openseaLowestPriceCriteriaMet,
		},
		{
			label: offerCtaLabel,
			onClick: () => handleMakeOffer(),
			pending:
				steps$?.transaction.isExecuting.get() ||
				makeOfferModal$.offerIsBeingProcessed.get(),
			disabled:
				steps$.approval.isExecuting.get() ||
				steps$.approval.exist.get() ||
				offerPrice.amountRaw === '0' ||
				insufficientBalance ||
				isLoading ||
				invalidQuantity ||
				!openseaLowestPriceCriteriaMet,
		},
	];

	return (
		<ActionModal
			isOpen={makeOfferModal$.isOpen.get()}
			chainId={Number(chainId)}
			onClose={() => {
				makeOfferModal$.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
				steps$.transaction.isExecuting.set(false);
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
				disabled={shouldHideOfferButton}
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

			{offerPrice.amountRaw !== '0' &&
				offerPriceChanged &&
				!insufficientBalance && (
					<FloorPriceText
						tokenId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						price={offerPrice}
						onBuyNow={() => {
							makeOfferModal$.close();

							if (lowestListing) {
								buyModal.show({
									chainId,
									collectionAddress,
									collectibleId,
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
		</ActionModal>
	);
});
