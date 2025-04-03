'use client';

import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { Show, observer } from '@legendapp/state/react';
import { useState } from 'react';
import { parseUnits } from 'viem';
import { dateToUnixTime } from '../../../../utils/date';
import { ContractType } from '../../../_internal';
import { useWallet } from '../../../_internal/wallet/useWallet';
import {
	useCollectible,
	useCollection,
	useCurrencies,
	useLowestListing,
} from '../../../hooks';
import { useBuyModal } from '../BuyModal';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { waasFeeOptionsModal$ } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
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
	const feeOptionsVisible = waasFeeOptionsModal$.isVisible.get();
	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = makeOfferModal$.offerIsBeingProcessed.get();
	const isWaaS = wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;
	const selectedFeeOption = waasFeeOptionsModal$.selectedFeeOption.get();
	const shouldHideOfferButton =
		!isTestnet &&
		isProcessingWithWaaS &&
		feeOptionsVisible === true &&
		!!selectedFeeOption;

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
	} = useCurrencies({
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
		filters: {
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
			if (wallet?.isWaaS) {
				waasFeeOptionsModal$.isVisible.set(true);
			}

			await makeOffer({
				isTransactionExecuting: wallet?.isWaaS ? !isTestnet : false,
			});
		} catch (error) {
			console.error('Make offer failed:', error);
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	// if it's testnet, we don't need to show the fee options
	const offerCtaLabel = isProcessing
		? isWaaS && !isTestnet
			? 'Loading fee options'
			: 'Make offer'
		: 'Make offer';

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
				!offerPriceChanged,
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
				invalidQuantity,
		},
	];

	const showWaasFeeOptions =
		wallet?.isWaaS &&
		makeOfferModal$.offerIsBeingProcessed.get() &&
		feeOptionsVisible;

	return (
		<>
			<ActionModal
				isOpen={makeOfferModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={() => {
					makeOfferModal$.close();
					waasFeeOptionsModal$.hide();
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
					$price={makeOfferModal$.offerPrice}
					onPriceChange={() => makeOfferModal$.offerPriceChanged.set(true)}
					includeNativeCurrency={false}
					checkBalance={{
						enabled: true,
						callback: (state) => setInsufficientBalance(state),
					}}
					disabled={shouldHideOfferButton}
				/>

				{collection?.type === ContractType.ERC1155 && (
					<QuantityInput
						$quantity={makeOfferModal$.quantity}
						$invalidQuantity={makeOfferModal$.invalidQuantity}
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

								if (lowestListing?.order) {
									buyModal.show({
										chainId,
										collectionAddress,
										tokenId: collectibleId,
										order: lowestListing.order,
									});
								}
							}}
						/>
					)}
				<ExpirationDateSelect
					$date={makeOfferModal$.expiry}
					disabled={shouldHideOfferButton}
				/>

				{showWaasFeeOptions && (
					<SelectWaasFeeOptions
						chainId={Number(chainId)}
						onCancel={() => {
							makeOfferModal$.offerIsBeingProcessed.set(false);
							steps$.transaction.isExecuting.set(false);
							waasFeeOptionsModal$.hide();
						}}
						titleOnConfirm="Processing offer..."
					/>
				)}
			</ActionModal>
		</>
	);
});
