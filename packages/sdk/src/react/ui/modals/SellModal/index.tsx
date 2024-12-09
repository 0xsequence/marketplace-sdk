import { Show, observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { sellModal$ } from './_store';
import { useCollection, useCurrencies } from '../../../hooks';
import { type Order } from '../../../_internal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '..//_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '..//_internal/types';
import useSell from '../../../hooks/useSell';

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

export const SellModal = () => {
	return (
		<Show if={sellModal$.isOpen}>
			<ModalContent />
		</Show>
	);
};

const ModalContent = observer(() => {
	const { tokenId, collectionAddress, chainId, order } = sellModal$.get();
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
	const currency = currencies?.find(
		(c) => c.contractAddress === order?.priceCurrencyAddress,
	);
	const { transactionState, execute } = useSell({
		closeModalFn: sellModal$.close,
		collectionAddress,
		chainId,
		collectibleId: tokenId,
		orderId: order!.orderId,
		quantity: order!.quantityInitial,
		marketplace: order!.marketplace,
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

	return (
		<ActionModal
			store={sellModal$}
			onClose={sellModal$.close}
			title="You have an offer"
			ctas={[
				{
					label: 'Accept',
					onClick: execute,
					pending:
						transactionState?.steps.checking ||
						transactionState?.transaction.executing,
					disabled:
						transactionState?.steps.checking ||
						transactionState?.transaction.executing,
				},
			]}
		>
			<TransactionHeader
				title="Offer received"
				currencyImageUrl={currency?.imageUrl}
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
				currencyImageUrl={currency?.imageUrl}
			/>
		</ActionModal>
	);
});
