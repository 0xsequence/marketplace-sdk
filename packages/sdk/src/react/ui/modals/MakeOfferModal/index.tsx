import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { parseUnits, type Hex } from 'viem';
import {
	ContractType,
	OrderbookKind,
	collectableKeys,
} from '../../../_internal';
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
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../_internal/types';
import { makeOfferModal$ } from './_store';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import { useCurrencyOptions } from '../../../hooks/useCurrencyOptions';

export type ShowMakeOfferModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	orderbookKind: OrderbookKind;
};

export const useMakeOfferModal = (defaultCallbacks?: ModalCallbacks) => ({
	show: (args: ShowMakeOfferModalArgs) =>
		makeOfferModal$.open({ ...args, callbacks: defaultCallbacks }),
	close: makeOfferModal$.close,
});

export const MakeOfferModal = () => {
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={makeOfferModal$.isOpen}>
			<ModalContent showTransactionStatusModal={showTransactionStatusModal} />
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
		const {
			collectionAddress,
			chainId,
			offerPrice,
			collectibleId,
			orderbookKind,
		} = state;
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
		const { isLoading: currenciesIsLoading } = useCurrencies({
			chainId,
			currencyOptions,
		});

		const { getMakeOfferSteps } = useMakeOffer({
			chainId,
			collectionAddress,
			orderbookKind,
			onTransactionSent: (hash, orderId) => {
				if (!hash && !orderId) return;

				showTransactionStatusModal({
					hash,
					orderId,
					price: makeOfferModal$.offerPrice.get(),
					collectionAddress,
					chainId,
					collectibleId,
					type: TransactionType.OFFER,
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
				quantity: parseUnits(
					makeOfferModal$.quantity.get(),
					collectible?.decimals || 0,
				).toString(),
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

		if (collectableIsError || collectionIsError) {
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
				onClick: () => handleStepExecution(() => steps?.approval.execute()),
				hidden: !steps?.approval.isPending,
				pending: steps?.approval.isExecuting,
				variant: 'glass' as const,
				disabled: makeOfferModal$.invalidQuantity.get(),
			},
			{
				label: 'Make offer',
				onClick: () => handleStepExecution(() => steps?.transaction.execute()),
				pending: steps?.transaction.isExecuting || isLoading,
				disabled:
					steps?.approval.isPending ||
					offerPrice.amountRaw === '0' ||
					insufficientBalance ||
					isLoading ||
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
						$quantity={makeOfferModal$.quantity}
						$invalidQuantity={makeOfferModal$.invalidQuantity}
						decimals={collectible?.decimals || 0}
						maxQuantity={String(Number.MAX_SAFE_INTEGER)}
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
	},
);
