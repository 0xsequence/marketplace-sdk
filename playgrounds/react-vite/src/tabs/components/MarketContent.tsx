import {
	useCollection,
	useFilterState,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import {
	CollectibleCardRenderer,
	InfiniteScrollView,
	PaginatedView,
	ROUTES,
	useMarketplace,
} from 'shared-components';
import type { ContractType, OrderbookKind } from '../../../../../sdk/src';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';

export function MarketContent() {
	const navigate = useNavigate();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();
	const { filterOptions, searchText, showListedOnly } = useFilterState();

	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const {
		collectibleCards,
		isLoading: collectiblesLoading,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind: orderbookKind as OrderbookKind,
		collectionType: collection?.type as ContractType,
		onCollectibleClick: handleCollectibleClick,
		filterOptions,
		searchText,
		showListedOnly,
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
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={collectiblesLoading}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			orderbookKind={orderbookKind as OrderbookKind}
			collectionType={collection?.type as ContractType}
			onCollectibleClick={handleCollectibleClick}
			renderItemContent={renderItemContent}
		/>
	);
}
