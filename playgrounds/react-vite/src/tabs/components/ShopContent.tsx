import {
	useCollection,
	useList721ShopCardData,
	useList1155ShopCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { ContractType } from '../../../../../sdk/src';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import type { ShopContentProps } from '../types';
import { CollectibleCardRenderer } from './CollectibleCardRenderer';
import { InfiniteScrollView } from './InfiniteScrollView';
import { PaginatedView } from './PaginatedView';

export function ShopContent({
	saleContractAddress,
	saleItemIds,
	collectionAddress,
	chainId,
	orderbookKind,
	paginationMode,
}: ShopContentProps) {
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const is1155 = collection?.type === ContractType.ERC1155;
	const hookResult = is1155
		? useList1155ShopCardData({
				contractAddress: collectionAddress,
				chainId,
				tokenIds: saleItemIds,
				salesContractAddress: saleContractAddress,
			})
		: useList721ShopCardData({
				contractAddress: collectionAddress,
				chainId,
				tokenIds: saleItemIds,
				salesContractAddress: saleContractAddress,
			});

	const { collectibleCards } = hookResult;

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => (
		<CollectibleCardRenderer
			index={index}
			collectibleCard={collectibleCard}
			isLoading={collectionLoading}
		/>
	);

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	return paginationMode === 'paginated' ? (
		<PaginatedView
			collectionAddress={collectionAddress}
			chainId={chainId}
			orderbookKind={orderbookKind}
			collection={collection as ContractInfo}
			collectionLoading={collectionLoading}
			onCollectibleClick={() => {}}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
		/>
	);
}
