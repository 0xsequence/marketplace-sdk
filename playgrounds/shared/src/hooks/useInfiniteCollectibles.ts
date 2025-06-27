'use client';

import type { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import {
	useFilterState,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';

export interface UseInfiniteCollectiblesProps {
	collectionAddress: Address;
	chainId: number;
	orderbookKind: OrderbookKind;
	collectionType: ContractType;
	onCollectibleClick: (tokenId: string) => void;
	showFilters?: boolean;
}

export interface UseInfiniteCollectiblesReturn {
	collectibleCards: CollectibleCardProps[];
	isLoading: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage?: () => Promise<unknown>;
	allCollectibles: any[];
}

export function useInfiniteCollectibles({
	collectionAddress,
	chainId,
	orderbookKind,
	collectionType,
	onCollectibleClick,
	showFilters = false,
}: UseInfiniteCollectiblesProps): UseInfiniteCollectiblesReturn {
	const { filterOptions, searchText, showListedOnly } = useFilterState();

	const {
		collectibleCards,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind,
		collectionType,
		onCollectibleClick,
		filterOptions: showFilters ? filterOptions : undefined,
		searchText: showFilters ? searchText : undefined,
		showListedOnly: showFilters ? showListedOnly : undefined,
	});

	return {
		collectibleCards,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	};
}
