'use client';

import {
	type ContractType,
	cn,
	type OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollection,
	useFilterState,
	useListMarketCardData,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
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

	const {
		collectibleCards,
		isLoading: collectiblesLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useListMarketCardData({
		orderbookKind: orderbookKindInternal || (orderbookKind as OrderbookKind),
		collectionType: collection?.type as ContractType,
		filterOptions,
		searchText,
		showListedOnly,
		priceFilters,
		collectionAddress,
		chainId,
	});

	function handleCollectibleClick(tokenId: string) {
		onCollectibleClick(tokenId);
	}

	const renderItemContent = (index: number) => {
		const card = collectibleCards[index];
		if (!card) return null;

		return (
			<button
				onClick={() => handleCollectibleClick(card.tokenId)}
				className={cn('w-full cursor-pointer')}
				type="button"
			>
				<CollectibleCard {...card} />
			</button>
		);
	};

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
			collectibleCards={collectibleCards}
			isLoading={collectiblesLoading}
			renderItemContent={renderItemContent}
			hasNextPage={hasNextPage}
			isFetchingNextPage={isFetchingNextPage}
			fetchNextPage={fetchNextPage}
		/>
	);
}
