import {
	useCollection,
	usePrimarySaleShopCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import type { ShopContentProps } from '../types';
import { CollectibleCardRenderer } from './CollectibleCardRenderer';
import { InfiniteScrollView } from './InfiniteScrollView';
import { PaginatedView } from './PaginatedView';

export function ShopContent({
	saleContractAddress,
	collectionAddress,
	chainId,
	paginationMode,
}: ShopContentProps) {
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	// Use the new unified primary sale hook that gets tokenIds from API
	const {
		collectibleCards,
		isLoading: primarySaleLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = usePrimarySaleShopCardData({
		chainId,
		primarySaleContractAddress: saleContractAddress,
		collectionAddress,
		enabled: true,
	});

	const isLoading = collectionLoading || primarySaleLoading;

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

	if (!saleContractAddress) {
		return <div>No sale contract address found</div>;
	}

	return paginationMode === 'paginated' ? (
		<PaginatedView
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={isLoading}
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
