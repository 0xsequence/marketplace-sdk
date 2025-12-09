'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchListItemsOrdersForCollectionParams,
	type fetchListItemsOrdersForCollection,
	type ListItemsOrdersForCollectionQueryOptions,
	listItemsOrdersForCollectionQueryOptions,
} from '../../queries/collection/market-items';
import { useConfig } from '../config/useConfig';

export type UseCollectionMarketItemsParams = Optional<
	ListItemsOrdersForCollectionQueryOptions,
	'config'
>;

/**
 * Hook to fetch all listings for a collection with infinite pagination support
 *
 * Fetches active listings (sales) for all tokens in a collection from the marketplace
 * with support for filtering and infinite scroll pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing listings data with pagination
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useCollectionMarketItems({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useCollectionMarketItems({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...']
 *   }
 * })
 * ```
 *
 * @example
 * Accessing paginated data:
 * ```typescript
 * const { data } = useCollectionMarketItems({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * const allListings = data?.pages.flatMap(page => page.listings) ?? []
 * ```
 */
export function useCollectionMarketItems(
	params: UseCollectionMarketItemsParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listItemsOrdersForCollectionQueryOptions({
		config,
		...rest,
	});

	return useInfiniteQuery({
		...queryOptions,
	});
}

export { listItemsOrdersForCollectionQueryOptions };

export type {
	FetchListItemsOrdersForCollectionParams,
	ListItemsOrdersForCollectionQueryOptions,
};

export type UseListItemsOrdersForCollectionArgs =
	UseListItemsOrdersForCollectionParams;
export type UseListItemsOrdersForCollectionReturn = Awaited<
	ReturnType<typeof fetchListItemsOrdersForCollection>
>;
export type UseListItemsOrdersForCollectionParams =
	UseCollectionMarketItemsParams;
