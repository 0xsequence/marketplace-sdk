import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { parseUnits } from 'viem';
import {
	type Order,
	balanceQueries,
	collectableKeys,
} from '../../../_internal';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import { useCollection, useCurrencies } from '../../../hooks';
import { useCurrencyOptions } from '../../../hooks/useCurrencyOptions';
import { useSell } from '../../../hooks/useSell';
import { ErrorModal } from '..//_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '..//_internal/types';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { sellModal$ } from './_store';

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
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={sellModal$.isOpen}>
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
		const { tokenId, collectionAddress, chainId, order, callbacks } =
			sellModal$.get();
		const { data: collectible } = useCollection({
			chainId,
			collectionAddress,
		});

		const { sell } = useSell({
			collectionAddress,
			chainId,
			enabled: sellModal$.isOpen.get(),
			onSwitchChainRefused: () => {
				sellModal$.close();
			},
			onTransactionSent: (hash) => {
				if (!hash) return;
				showTransactionStatusModal({
					hash: hash,
					price: order
						? {
								amountRaw: order.priceAmount,
								currency: currencies?.find(
									(currency) =>
										currency.contractAddress === order.priceCurrencyAddress,
								) ?? {
									chainId: Number(chainId),
									contractAddress: order.priceCurrencyAddress,
									name: 'Unknown',
									symbol: 'UNK',
									decimals: 18,
									imageUrl: '',
									exchangeRate: 0,
									defaultChainCurrency: false,
									nativeCurrency: false,
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
								},
							}
						: undefined,
					collectionAddress,
					chainId,
					collectibleId: tokenId,
					type: TransactionType.SELL,
					queriesToInvalidate: [
						...collectableKeys.all,
						balanceQueries.all,
					] as unknown as QueryKey[],
					callbacks,
				});
				sellModal$.close();
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
		const currencyOptions = useCurrencyOptions({ collectionAddress });
		const { data: currencies, isLoading: currenciesLoading } = useCurrencies({
			chainId,
			currencyOptions,
		});

		if (collectionLoading || currenciesLoading) {
			return (
				<LoadingModal
					isOpen={sellModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={sellModal$.close}
					title="You have an offer"
				/>
			);
		}

		if (collectionError || order === undefined) {
			return (
				<ErrorModal
					isOpen={sellModal$.isOpen.get()}
					chainId={Number(chainId)}
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
				isOpen={sellModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
				ctas={[
					{
						label: 'Accept',
						onClick: () =>
							sell({
								orderId: order?.orderId,
								marketplace: order?.marketplace,
								quantity: order?.quantityRemaining
									? parseUnits(
											order.quantityRemaining,
											collectible?.decimals || 0,
										).toString()
									: '1',
							}),
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
	},
);
