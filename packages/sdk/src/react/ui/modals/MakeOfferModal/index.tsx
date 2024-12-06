import { Show, observer } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
import type { Hex } from 'viem';
import { ContractType } from '../../../_internal';
import { useCollection, useCurrencies } from '../../../hooks';
import { useMakeOffer } from '../../../hooks/useMakeOffer';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import { makeOfferModal$ } from './_store';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '../_internal/types';

export type ShowMakeOfferModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
};

export const useMakeOfferModal = (defaultCallbacks?: ModalCallbacks) => ({
	show: (args: ShowMakeOfferModalArgs) =>
		makeOfferModal$.open({ ...args, callbacks: defaultCallbacks }),
	close: makeOfferModal$.close,
});

export const MakeOfferModal = () => {
	return (
		<Show if={makeOfferModal$.isOpen}>
			<ModalContent />
		</Show>
	);
};

const ModalContent = observer(() => {
	const state = makeOfferModal$.get();
	const { collectionAddress, chainId, offerPrice, collectibleId } = state;
	const [insufficientBalance, setInsufficientBalance] = useState(false);

	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const { isLoading: currenciesIsLoading } = useCurrencies({
		chainId,
		collectionAddress,
	});

	const { getMakeOfferSteps } = useMakeOffer({
		chainId,
		collectionAddress,
		collectibleId,
		onTransactionSent: (hash) => {
			if (!hash) return;

			makeOfferModal$.close();
		},
		onSuccess: (hash) => {
			if (typeof makeOfferModal$.callbacks?.onSuccess === 'function') {
				makeOfferModal$.callbacks.onSuccess(hash);
			} else {
				console.debug('onSuccess callback not provided:', hash);
			}
		},
		onError: (error) => {
			if (typeof makeOfferModal$.callbacks?.onError === 'function') {
				makeOfferModal$.callbacks.onError(error);
			} else {
				console.debug('onError callback not provided:', error);
			}
		},
	});

	const dateToUnixTime = (date: Date) =>
		Math.floor(date.getTime() / 1000).toString();

	const currencyAddress = offerPrice.currency.contractAddress;

	const {
		isLoading: makeOfferStepsLoading,
		steps,
		refreshSteps,
	} = getMakeOfferSteps({
		contractType: collection!.type as ContractType,
		offer: {
			tokenId: collectibleId,
			quantity: makeOfferModal$.quantity.get(),
			expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
			currencyAddress,
			pricePerToken: offerPrice.amountRaw,
		},
	});

	useEffect(() => {
		if (!currencyAddress) return;
		refreshSteps();
	}, [currencyAddress]);

	if (collectionIsLoading || currenciesIsLoading) {
		return (
			<LoadingModal
				store={makeOfferModal$}
				onClose={makeOfferModal$.close}
				title="Make an offer"
			/>
		);
	}

	if (collectionIsError) {
		return (
			<ErrorModal
				store={makeOfferModal$}
				onClose={makeOfferModal$.close}
				title="Make an offer"
			/>
		);
	}

	const handleStepExecution = async (execute?: any) => {
		if (!execute) return;
		try {
			await refreshSteps();
			await execute();
		} catch (error) {
			makeOfferModal$.callbacks?.onError?.(error as Error);
		}
	};

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: () => handleStepExecution(() => steps?.approval.approve()),
			hidden: !steps?.approval.isReadyToApprove || steps?.approval.approved,
			pending: steps?.approval.isApproving || makeOfferStepsLoading,
			variant: 'glass' as const,
		},
		{
			label: 'Make offer',
			onClick: () => handleStepExecution(() => steps?.transaction.execute()),
			pending: steps?.transaction.isExecuting || makeOfferStepsLoading,
			disabled:
				steps?.approval.isReadyToApprove ||
				offerPrice.amountRaw === '0' ||
				steps?.approval.isReadyToApprove ||
				insufficientBalance ||
				makeOfferStepsLoading,
		},
	];

	return (
		<ActionModal
			store={makeOfferModal$}
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
				checkBalance={{
					enabled: true,
					callback: (state) => setInsufficientBalance(state),
				}}
			/>

			{collection?.type === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					$quantity={makeOfferModal$.quantity}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
				/>
			)}

			{!!offerPrice && (
				<FloorPriceText
					tokenId={collectibleId}
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={offerPrice}
				/>
			)}

			<ExpirationDateSelect $date={makeOfferModal$.expiry} />
		</ActionModal>
	);
});
