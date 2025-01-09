import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import {
	balanceQueries,
	collectableKeys,
} from '../../../_internal';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import { useCollection, useCurrencies } from '../../../hooks';
import { useCurrencyOptions } from '../../../hooks/useCurrencyOptions';
import { useSell } from '../../../hooks/useSell';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { sellModal$ } from './store';

type TransactionStatusModalReturn = ReturnType<
	typeof useTransactionStatusModal
>;

export const SellModal = () => {
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={sellModal$.isOpen}>
			{() => <Modal showTransactionStatusModal={showTransactionStatusModal} />}
		</Show>
	);
};

const Modal = observer(
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
		const [approvalExecutedSuccess, setApprovalExecutedSuccess] =
			useState(false);
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
		const { getSellSteps, isLoading: machineLoading } = useSell({
			collectionAddress,
			chainId,
			enabled: sellModal$.isOpen.get(),
			onApprovalSuccess: () => setApprovalExecutedSuccess(true),
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

		const { isLoading, steps, refreshSteps } = getSellSteps({
			orderId: order?.orderId ?? '',
			marketplace: order?.marketplace as MarketplaceKind,
			quantity: order?.quantityRemaining
				? parseUnits(
						order.quantityRemaining,
						collectible?.decimals || 0,
					).toString()
				: '1',
		});

		useEffect(() => {
			refreshSteps();
		}, [order, machineLoading]);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleStepExecution = async (execute?: any) => {
			if (!execute) return;
			try {
				await refreshSteps();
				await execute();
			} catch (error) {
				if (callbacks?.onError) {
					callbacks.onError(error as Error);
				} else {
					console.debug('onError callback not provided:', error);
				}
			}
		};

		if (collectionLoading || currenciesLoading || machineLoading) {
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

		const approvalNeeded = steps?.approval.isPending;

		const currency = currencies?.find(
			(c) => c.contractAddress === order?.priceCurrencyAddress,
		);

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => handleStepExecution(() => steps?.approval.execute()),
				hidden: !approvalNeeded || approvalExecutedSuccess,
				pending: steps?.approval.isExecuting || isLoading,
				variant: 'glass' as const,
				disabled: isLoading || steps?.transaction.isExecuting,
			},
			{
				label: 'Accept',
				onClick: () => handleStepExecution(() => steps?.transaction.execute()),
				pending: steps?.transaction.isExecuting || isLoading,
				disabled: (!approvalExecutedSuccess && approvalNeeded) || isLoading,
			},
		] satisfies ActionModalProps['ctas'];

		return (
			<ActionModal
				isOpen={sellModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
				ctas={ctas}
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
