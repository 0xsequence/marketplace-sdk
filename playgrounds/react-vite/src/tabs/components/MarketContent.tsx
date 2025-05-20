import {
	useCollection,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import { useMarketplace } from 'shared-components';
import type { ContractType, OrderbookKind } from '../../../../../sdk/src';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import { ROUTES } from '../../lib/routes';
import { CollectibleCardRenderer } from './CollectibleCardRenderer';
import { InfiniteScrollView } from './InfiniteScrollView';
import { PaginatedView } from './PaginatedView';

export function MarketContent() {
	const navigate = useNavigate();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();

	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const {
		collectibleCards,
		isLoading: collectiblesLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind: orderbookKind as OrderbookKind,
		collectionType: collection?.type as ContractType,
		onCollectibleClick: handleCollectibleClick,
	});

	function handleCollectibleClick(tokenId: string) {
		setCollectibleId(tokenId);
		navigate(`/${ROUTES.COLLECTIBLE.path}`);
	}

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

	return paginationMode === 'paginated' ? (
		<PaginatedView
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={collectiblesLoading}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			collectiblesLoading={collectiblesLoading}
			hasNextPage={hasNextPage}
			isFetchingNextPage={isFetchingNextPage}
			fetchNextPage={fetchNextPage}
			renderItemContent={renderItemContent}
			allCollectibles={allCollectibles}
		/>
	);
}
