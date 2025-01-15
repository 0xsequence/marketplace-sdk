import { Show, observer, use$ } from '@legendapp/state/react';
import { useState } from 'react';
import { parseUnits, zeroAddress } from 'viem';
import { dateToUnixTime } from '../../../../utils/date';
import { ContractType, OrderbookKind } from '../../../_internal';
import {
	useCollectible,
	useCollection,
	useCurrencies,
	useCurrencyOptions,
} from '../../../hooks';
import { useMakeOffer } from './hooks/useMakeOffer';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import { makeOfferModal$ } from './store';
import { Box } from '@0xsequence/design-system';

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

	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const currencyOptions = useCurrencyOptions({ collectionAddress });
	const {
		data: currencies,
		isLoading: currenciesLoading,
		isError: currenciesIsError,
	} = useCurrencies({
		chainId,
		currencyOptions,
	});

	const selectedCurrency = use$(makeOfferModal$.offerPrice.currency);

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

	if (collectableIsLoading || collectionIsLoading || currenciesLoading) {
		return (
			<LoadingModal
				isOpen={makeOfferModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={makeOfferModal$.close}
				title="Make an offer"
			/>
		);
	}

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

	const invalidCurrency =
		selectedCurrency?.contractAddress === zeroAddress &&
		orderbookKind !== OrderbookKind.sequence_marketplace_v2;

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
			label: 'Make offer',
			onClick: () => makeOffer(),
			pending: steps$.transaction.isExecuting.get(),
			disabled:
				steps$.approval.isExecuting.get() ||
				steps$.approval.exist.get() ||
				offerPrice.amountRaw === '0' ||
				insufficientBalance ||
				isLoading ||
				invalidQuantity ||
				offerPrice.amountRaw === '0' ||
				invalidCurrency,
		},
	];

	const secoundCurrencyAsDefault =
		orderbookKind !== OrderbookKind.sequence_marketplace_v2 &&
		currencies &&
		currencies[0]?.contractAddress !== zeroAddress;

	return (
		<>
			<ActionModal
				isOpen={makeOfferModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={() => makeOfferModal$.close()}
				title="Make an offer"
				ctas={ctas}
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
					$listingPrice={makeOfferModal$.offerPrice}
					onPriceChange={() => makeOfferModal$.offerPriceChanged.set(true)}
					secoundCurrencyAsDefault={secoundCurrencyAsDefault}
					checkBalance={{
						enabled: true,
						callback: (state) => setInsufficientBalance(state),
					}}
				/>

				{collection?.type === ContractType.ERC1155 && (
					<QuantityInput
						$quantity={makeOfferModal$.quantity}
						$invalidQuantity={makeOfferModal$.invalidQuantity}
						decimals={collectible?.decimals || 0}
						maxQuantity={String(Number.MAX_SAFE_INTEGER)}
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
						/>
					)}
				<ExpirationDateSelect $date={makeOfferModal$.expiry} />

				{invalidCurrency && (
					<Box color="negative" fontSize="small">
						Native currency offers are not supported on this marketplace. Please
						select another currency to continue
					</Box>
				)}
			</ActionModal>
		</>
	);
});
