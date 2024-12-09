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
import { useEffect, useState } from 'react';
import {
	TransactionState,
	TransactionType,
} from '../../../_internal/transaction-machine/execute-transaction';
import { useTransactionMachine } from '../../../_internal/transaction-machine/useTransactionMachine';

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
	const [isLoading, setIsLoading] = useState(false);
	const [transactionState, setTransactionState] =
		useState<TransactionState | null>(null);
	const machine = useTransactionMachine(
		{
			collectionAddress,
			chainId,
			collectibleId: tokenId,
			type: TransactionType.SELL,
		},
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		sellModal$.close,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	useEffect(() => {
		if (!currency || !machine || transactionState?.steps.checked || !order)
			return;

		machine
			.refreshStepsGetState({
				orderId: order?.orderId,
				marketplace: order?.marketplace,
			})
			.then((state) => {
				if (!state.steps) return;

				setTransactionState(state);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error loading make offer steps', error);
				setIsLoading(false);
			});
	}, [currency, machine, order]);

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

	const handleStepExecution = async () => {
		await transactionState?.transaction.execute({
			type: TransactionType.SELL,
			props: {
				orderId: order?.orderId,
				marketplace: order?.marketplace,
			},
		});
	};

	return (
		<ActionModal
			store={sellModal$}
			onClose={sellModal$.close}
			title="You have an offer"
			ctas={[
				{
					label: 'Accept',
					onClick: () => handleStepExecution(),
					pending: transactionState?.steps.checking || isLoading,
					disabled: transactionState?.steps.checking || isLoading,
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
