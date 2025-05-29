import {
	useCollection,
	useList721ShopCardData,
	useList1155ShopCardData,
} from '@0xsequence/marketplace-sdk/react';
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
	paginationMode,
}: ShopContentProps) {
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const is1155 = collection?.type === ContractType.ERC1155;
	const is721 = collection?.type === ContractType.ERC721;

	const hook1155Result = useList1155ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: saleItemIds,
		salesContractAddress: saleContractAddress,
		enabled: is1155,
	});

	const hook721Result = useList721ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: saleItemIds,
		salesContractAddress: saleContractAddress,
		enabled: is721,
	});

	const { collectibleCards } = is1155 ? hook1155Result : hook721Result;

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
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={collectionLoading}
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
