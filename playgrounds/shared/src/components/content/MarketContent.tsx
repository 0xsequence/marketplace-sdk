'use client';

import {
	useCollection,
	useFilterState,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractType, OrderbookKind } from '../../../../../sdk/src';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import { useMarketplace } from '../../store';
import {
	CollectibleCardRenderer,
	InfiniteScrollView,
	PaginatedView,
} from '../collectibles';

export interface MarketContentProps {
	onCollectibleClick: (tokenId: string) => void;
}

export function MarketContent({ onCollectibleClick }: MarketContentProps) {
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

	const { collectibleCards, isLoading: collectiblesLoading } =
		useListMarketCardData({
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
		onCollectibleClick(tokenId);
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
