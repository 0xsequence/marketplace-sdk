'use client';

import { useSelector } from '@xstate/store/react';
import type { Price } from '../../../../../types';
import TokenPreview from '../../_internal/components/tokenPreview';
import TransactionDetails from '../../_internal/components/transactionDetails';
import TransactionHeader from '../../_internal/components/transactionHeader';
import { useLoadData } from '../hooks/useLoadData';
import { sellModalStore } from '../store/sellModalStore';

export const SellModalContent = () => {
	const { order, tokenId, collectionAddress, chainId } = useSelector(
		sellModalStore,
		(state) => state.context,
	);

	const { collection, currency, isLoading } = useLoadData();

	if (isLoading || !order || !collectionAddress || !tokenId || !chainId) {
		return (
			<div className="flex h-[200px] items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<>
			<TransactionHeader
				title="Offer received"
				currencyImageUrl={currency?.imageUrl}
				date={new Date(order.createdAt)}
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
					currency && order
						? ({
							amountRaw: order.priceAmount,
							currency,
						} as Price)
						: undefined
				}
				currencyImageUrl={currency?.imageUrl}
			/>
		</>
	);
};
