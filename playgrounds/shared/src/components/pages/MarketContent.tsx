'use client';

import {
	type ContractType,
	cn,
	type OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	type CollectibleCardProps,
	useCollection,
	useFilterState,
	useListMarketCardData,
	useMarketCardDataPaged,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import type { Address } from 'viem';
import { useMarketplace } from '../../store';
import { InfiniteScrollView } from '../collectibles/InfiniteScrollView';
import { PaginatedView } from '../collectibles/PaginatedView';

export interface MarketContentProps {
	collectionAddress: Address;
	chainId: number;
	onCollectibleClick: (tokenId: string) => void;
}

export function MarketContent({
	collectionAddress,
	chainId,
	onCollectibleClick,
}: MarketContentProps) {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const orderbookKind = collectionConfig?.destinationMarketplace;
	const { orderbookKind: orderbookKindInternal, paginationMode } =
		useMarketplace();
	const { filterOptions, searchText, showListedOnly, priceFilters } =
		useFilterState();

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
		query: {
			enabled: !!collectionAddress && !!chainId,
		},
	});

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(30);

	const infiniteQueryResult = useListMarketCardData({
		orderbookKind: orderbookKindInternal || (orderbookKind as OrderbookKind),
		collectionType: collection?.type as ContractType,
		filterOptions,
		searchText,
		showListedOnly,
		priceFilters,
		collectionAddress,
		chainId,
		enabled: paginationMode === 'infinite',
	});

	const pagedQueryResult = useMarketCardDataPaged({
		orderbookKind: orderbookKindInternal || (orderbookKind as OrderbookKind),
		collectionType: collection?.type as ContractType,
		filterOptions,
		searchText,
		showListedOnly,
		priceFilters,
		collectionAddress,
		chainId,
		page,
		pageSize,
		enabled: paginationMode === 'paged',
	});

	function handleCollectibleClick(tokenId: string) {
		onCollectibleClick(tokenId);
	}

	const renderItemContent = (
		index: number,
		overrideCard?: CollectibleCardProps,
	) => {
		const card = overrideCard;
		if (!card) return null;

		return (
			<button
				key={index}
				onClick={() => handleCollectibleClick(card.tokenId.toString())}
				className={cn('w-full cursor-pointer')}
				type="button"
			>
				<CollectibleCard {...card} />
			</button>
		);
	};

	return paginationMode === 'paged' ? (
		<PaginatedView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={pagedQueryResult.collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={pagedQueryResult.isLoading}
			page={page}
			pageSize={pageSize}
			onPageChange={setPage}
			onPageSizeChange={setPageSize}
			hasMore={pagedQueryResult.hasMore}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={infiniteQueryResult.collectibleCards}
			isLoading={infiniteQueryResult.isLoading}
			renderItemContent={renderItemContent}
			hasNextPage={infiniteQueryResult.hasNextPage}
			isFetchingNextPage={infiniteQueryResult.isFetchingNextPage}
			fetchNextPage={infiniteQueryResult.fetchNextPage}
		/>
	);
}
