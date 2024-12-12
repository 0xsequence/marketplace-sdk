import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { useState } from 'react';
import type { Hex } from 'viem';
import { collectableKeys, ContractType, StepType } from '../../../_internal';
import { useCollectible, useCollection, useCurrencies } from '../../../hooks';
import { useMakeOffer } from '../../../hooks/useMakeOffer';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import type { ModalCallbacks } from '../_internal/types';
import { makeOfferModal$ } from './_store';
import {
	getMakeOfferTransactionMessage,
	getMakeOfferTransactionTitle,
} from './_utils/getMakeOfferTransactionTitleMessage';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '../_internal/types';
import type { QueryKey } from '@tanstack/react-query';

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

type TransactionStatusModalReturn = ReturnType<
	typeof useTransactionStatusModal
>;

const ModalContent = observer(
	({
		showTransactionStatusModal,
	}: {
		showTransactionStatusModal: TransactionStatusModalReturn['show'];
	}) => {
		const state = makeOfferModal$.get();
		const { collectionAddress, chainId, offerPrice, collectibleId } = state;
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

		const { isLoading: currenciesIsLoading } = useCurrencies({
			chainId,
			collectionAddress,
		});

		const { getMakeOfferSteps } = useMakeOffer({
			chainId,
			collectionAddress,
			onTransactionSent: (hash) => {
				if (!hash) return;
				showTransactionStatusModal({
					hash,
					price: makeOfferModal$.offerPrice.get(),
					collectionAddress,
					chainId,
					tokenId: collectibleId,
					getTitle: getMakeOfferTransactionTitle,
					getMessage: (params) =>
						getMakeOfferTransactionMessage(params, collectible?.name || ''),
					type: StepType.createOffer,
					queriesToInvalidate: collectableKeys.all as unknown as QueryKey[],
				});
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

		const { isLoading, steps, refreshSteps } = getMakeOfferSteps({
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

		if (collectableIsLoading || collectionIsLoading || currenciesIsLoading) {
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

	const checkingSteps = transactionState?.steps.checking;

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: approve,
			hidden:
				!transactionState?.approval.needed ||
				transactionState?.approval.processed,
			pending: checkingSteps || transactionState?.approval.processing,
			variant: 'glass' as const,
			disabled: checkingSteps || transactionState?.approval.processing,
				disabled: makeOfferModal$.invalidQuantity.get(),
		},
		{
			label: 'Make offer',
			onClick: execute,
			pending:
				transactionState?.steps.checking ||
				transactionState?.transaction.executing,
			disabled:
				transactionState?.transaction.executing ||
				insufficientBalance ||
				offerPrice.amountRaw === '0' ||
				transactionState?.approval.processing ||
				transactionState?.approval.needed ||
					makeOfferModal$.invalidQuantity.get(),
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
