import { Show, observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { sellModal$ } from './_store';
import { useCollection, useCurrencies } from '../../../hooks';
import {
	balanceQueries,
	collectableKeys,
	StepType,
	type Order,
} from '../../../_internal';
import { useSell } from '../../../hooks/useSell';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '..//_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '..//_internal/types';
import {
	getSellTransactionMessage,
	getSellTransactionTitle,
} from './_utils/getSellTransactionTitleMessage';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import type { QueryKey } from '@tanstack/react-query';

export type ShowSellModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
};

export const useSellModal = (defaultCallbacks?: ModalCallbacks) => ({
	show: (args: ShowSellModalArgs) =>
		sellModal$.open({ ...args, callbacks: defaultCallbacks }),
	close: sellModal$.close,
});

export const SellModal = () => (
	<Show if={sellModal$.isOpen}>
		<ModalContent />
	</Show>
);

const ModalContent = observer(() => {
	const { tokenId, collectionAddress, chainId, order } = sellModal$.get();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { data: collectible } = useCollection({
		chainId,
		collectionAddress,
	});

	const { sell } = useSell({
		collectionAddress,
		chainId,
		onTransactionSent: (hash) => {
			if (!hash) return;
			showTransactionStatusModal({
				hash: hash,
				price: {
					amountRaw: order!.priceAmount,
					currency: currencies!.find(
						(currency) =>
							currency.contractAddress === order!.priceCurrencyAddress,
					)!,
				},
				collectionAddress,
				chainId,
				tokenId,
				getTitle: getSellTransactionTitle,
				getMessage: (params) =>
					getSellTransactionMessage(params, collectible?.name || ''),
				type: StepType.sell,
				queriesToInvalidate: [
					...collectableKeys.all,
					balanceQueries.all,
				] as unknown as QueryKey[],
			});
		},
		onSuccess: (hash) => {
			sellModal$.callbacks?.onSuccess?.(hash);
			sellModal$.close();
		},
		onError: (error) => {
			sellModal$.callbacks?.onError?.(error);
		},
	});

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const { data: currencies, isLoading: currenciesLoading } = useCurrencies({
		chainId,
		collectionAddress,
	});

	if (collectionLoading || currenciesLoading) {
		return (
			<LoadingModal
				store={sellModal$}
				onClose={sellModal$.close}
				title="You have an offer"
			/>
		);
	}

	if (collectionError || order === undefined) {
		return (
			<ErrorModal
				store={sellModal$}
				onClose={sellModal$.close}
				title="You have an offer"
			/>
		);
	}

	const currency = currencies?.find(
		(c) => c.contractAddress === order?.priceCurrencyAddress,
	);

	return (
		<ActionModal
			store={sellModal$}
			onClose={sellModal$.close}
			title="You have an offer"
			ctas={[
				{
					label: 'Accept',
					onClick: () =>
						sell({
							orderId: order?.orderId,
							marketplace: order?.marketplace,
						}),
				},
			]}
		>
			<TransactionHeader
				title="Offer received"
				chainId={Number(chainId)}
				date={order && new Date(order.createdAt)}
			/>
			<TokenPreview
				collectionName={collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={tokenId}
				chainId={chainId}
			/>
			<TransactionDetails
				collectibleId={tokenId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={
					currency
						? {
								amountRaw: order?.priceAmount,
								currency,
							}
						: undefined
				}
			/>
		</ActionModal>
	);
});
