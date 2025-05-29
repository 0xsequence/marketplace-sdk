'use client';

import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { Show, observer } from '@legendapp/state/react';
import { parseUnits } from 'viem';
import type { Price } from '../../../../types';
import type { FeeOption } from '../../../../types/waas-types';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';
import { useWallet } from '../../../_internal/wallet/useWallet';
import { useCollection, useCurrency } from '../../../hooks';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptions$ } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useSell } from './hooks/useSell';
import { sellModal$ } from './store';

export const SellModal = () => {
	return <Show if={sellModal$.isOpen}>{() => <Modal />}</Show>;
};

const Modal = observer(() => {
	const { tokenId, collectionAddress, chainId, order, callbacks } =
		sellModal$.get();
	const steps$ = sellModal$.steps;
	const { data: collectible } = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress ?? '',
	});
	const { wallet } = useWallet();
	const feeOptionsVisible = selectWaasFeeOptions$.isVisible.get();
	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = sellModal$.sellIsBeingProcessed.get();
	const isWaaS = wallet?.isWaaS;
	const { shouldHideActionButton: shouldHideSellButton } =
		useSelectWaasFeeOptions({
			isProcessing,
			feeOptionsVisible: selectWaasFeeOptions$.isVisible.get(),
			selectedFeeOption:
				selectWaasFeeOptions$.selectedFeeOption.get() as FeeOption,
		});

	const { isLoading, executeApproval, sell } = useSell({
		collectionAddress,
		chainId,
		collectibleId: tokenId,
		marketplace: order?.marketplace as MarketplaceKind,
		ordersData: [
			{
				orderId: order?.orderId ?? '',
				quantity: order?.quantityRemaining
					? parseUnits(
							order.quantityRemaining,
							collectible?.decimals || 0,
						).toString()
					: '1',
				pricePerToken: order?.priceAmount ?? '',
				currencyAddress: order?.priceCurrencyAddress ?? '',
			},
		],
		callbacks,
		closeMainModal: () => sellModal$.close(),
		steps$: steps$,
	});
	const modalLoading = collectionLoading || currencyLoading;

	if (
		(collectionError || order === undefined || currencyError) &&
		!modalLoading
	) {
		return (
			<ErrorModal
				isOpen={sellModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
			/>
		);
	}

	const handleSell = async () => {
		sellModal$.sellIsBeingProcessed.set(true);

		try {
			if (wallet?.isWaaS) {
				selectWaasFeeOptions$.isVisible.set(true);
			}

			await sell({
				isTransactionExecuting: wallet?.isWaaS ? !isTestnet : false,
			});
		} catch (error) {
			console.error('Sell failed:', error);
		} finally {
			sellModal$.sellIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	// if it's testnet, we don't need to show the fee options
	const sellCtaLabel = isProcessing
		? isWaaS && !isTestnet
			? 'Loading fee options'
			: 'Accept'
		: 'Accept';

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps$.approval.exist.get(),
			pending: steps$.approval.isExecuting.get(),
			variant: 'glass' as const,
			disabled: isLoading || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: () => handleSell(),
			pending:
				steps$?.transaction.isExecuting.get() ||
				sellModal$.sellIsBeingProcessed.get(),
			disabled:
				isLoading ||
				steps$.approval.isExecuting.get() ||
				steps$.approval.exist.get() ||
				order?.quantityRemaining === '0',
		},
	] satisfies ActionModalProps['ctas'];

	const showWaasFeeOptions =
		wallet?.isWaaS &&
		sellModal$.sellIsBeingProcessed.get() &&
		feeOptionsVisible;

	return (
		<ActionModal
			isOpen={sellModal$.isOpen.get()}
			chainId={Number(chainId)}
			onClose={() => {
				sellModal$.close();
				selectWaasFeeOptions$.hide();
				steps$.transaction.isExecuting.set(false);
			}}
			title="You have an offer"
			ctas={ctas}
			modalLoading={modalLoading}
			spinnerContainerClassname="h-[104px]"
			hideCtas={shouldHideSellButton}
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
				includeMarketplaceFee={true}
				price={
					currency
						? ({
								amountRaw: order?.priceAmount,
								currency,
							} as Price)
						: undefined
				}
				currencyImageUrl={currency?.imageUrl}
			/>

			{showWaasFeeOptions && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						sellModal$.sellIsBeingProcessed.set(false);
						steps$.transaction.isExecuting.set(false);
					}}
					titleOnConfirm="Accepting offer..."
				/>
			)}
		</ActionModal>
	);
});
