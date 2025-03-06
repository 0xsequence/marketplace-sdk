import { Show, observer } from '@legendapp/state/react';
import { parseUnits } from 'viem';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';
import { useCollection, useCurrency } from '../../../hooks';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
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

	if (collectionLoading || currencyLoading) {
		return (
			<LoadingModal
				isOpen={sellModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
			/>
		);
	}

	if (collectionError || order === undefined || currencyError) {
		return (
			<ErrorModal
				isOpen={sellModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
			/>
		);
	}

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
			label: 'Accept',
			onClick: () => sell(),
			pending: steps$.transaction.isExecuting.get(),
			disabled:
				isLoading ||
				steps$.approval.isExecuting.get() ||
				steps$.approval.exist.get() ||
				order?.quantityRemaining === '0',
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
				includeMarketplaceFee={true}
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
