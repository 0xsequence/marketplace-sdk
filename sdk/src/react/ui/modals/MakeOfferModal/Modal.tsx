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
	useCurrencyList,
	useMarketplaceConfig,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import { useRoyalty } from '../../../hooks/utils/useRoyalty';
import { ErrorLogBox } from '../../components/_internals/ErrorLogBox';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useWaasFeeSelection } from '../_internal/hooks/useWaasFeeSelection';
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
		orderbookKind: orderbookKindProp,
		callbacks,
	} = state;
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const [error, setError] = useState<Error | undefined>(undefined);

	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const orderbookKind =
		orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = makeOfferModal$.steps;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [openseaLowestPriceCriteriaMet, setOpenseaLowestPriceCriteriaMet] =
		useState(true);
	const {
		data: collectible,
		isLoading: collectableIsLoading,
		isError: collectableIsError,
	} = useCollectibleDetail({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const { isWaaS } = useConnectorMetadata();
	const isProcessing = makeOfferModal$.offerIsBeingProcessed.get();

	const waasFees = useWaasFeeSelection({
		onCancel: () => {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		},
	});

	const {
		shouldHideActionButton: shouldHideOfferButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible: waasFees.isVisible,
		selectedFeeOption: waasFees.selectedFeeOption as FeeOption,
	});

	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollectionDetail({
		chainId,
		collectionAddress,
	});
	const {
		data: currencies,
		isLoading: currenciesLoading,
		isError: currenciesIsError,
	} = useCurrencyList({
		chainId,
		includeNativeCurrency: false,
	});

	const { data: royalty, isLoading: royaltyLoading } = useRoyalty({
		chainId,
		collectionAddress,
		collectibleId,
	});

	const modalLoading =
		collectableIsLoading ||
		collectionIsLoading ||
		currenciesLoading ||
		royaltyLoading;

	const {
		isLoading,
		executeApproval,
		makeOffer,
		isError: approvalIsError,
	} = useMakeOffer({
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
		callbacks,
		orderbookKind,
		closeMainModal: () => makeOfferModal$.close(),
		steps$: steps$,
	});

	const buyModal = useBuyModal(callbacks);

	const { data: lowestListing } = useCollectibleMarketLowestListing({
		tokenId: collectibleId,
		chainId,
		collectionAddress,
		filter: {
			currencies: [offerPrice.currency.contractAddress],
		},
	});

	if (
		collectableIsError ||
		collectionIsError ||
		currenciesIsError ||
		approvalIsError
	) {
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
			await makeOffer({
				isTransactionExecuting: isWaaS
					? getNetwork(Number(chainId)).type !== NetworkType.TESTNET
					: false,
			});
		} catch (error) {
			console.error('Make offer failed:', error);
			setError(error as Error);
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error('Approve TOKEN failed:', error);
			setError(error as Error);
		});
	};

	const offerCtaLabel = getActionLabel('Make offer');

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: handleApproveToken,
			hidden: !steps$.approval.exist.get(),
			pending: steps$.approval.isExecuting.get(),
			variant: 'ghost' as const,
			disabled:
				invalidQuantity ||
				isLoading ||
				insufficientBalance ||
				offerPrice.amountRaw === '0' ||
				!offerPriceChanged ||
				(orderbookKind === OrderbookKind.opensea &&
					!openseaLowestPriceCriteriaMet),
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
				(orderbookKind === OrderbookKind.opensea &&
					!openseaLowestPriceCriteriaMet),
		},
	];

	return (
		<ActionModal
			isOpen={makeOfferModal$.isOpen.get()}
			chainId={Number(chainId)}
			onClose={() => {
				makeOfferModal$.close();
				waasFees.reset();
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
					waasFees={waasFees}
					titleOnConfirm="Processing offer..."
				/>
			)}

			{error && (
				<ErrorLogBox
					title="An error occurred while making an offer"
					message="Please try again"
					error={error}
				/>
			)}
		</ActionModal>
	);
});
