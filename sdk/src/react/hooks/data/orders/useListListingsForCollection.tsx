'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchListListingsForCollectionParams,
	type fetchListListingsForCollection,
	type ListListingsForCollectionQueryOptions,
	listListingsForCollectionQueryOptions,
} from '../../../queries/listListingsForCollection';
import { useConfig } from '../../config/useConfig';

export type UseListListingsForCollectionParams = Optional<
	ListListingsForCollectionQueryOptions,
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
 * const { data, isLoading, fetchNextPage, hasNextPage } = useListListingsForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useListListingsForCollection({
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
 * const { data } = useListListingsForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * const allListings = data?.pages.flatMap(page => page.listings) ?? []
 * ```
 */
export function useListListingsForCollection(
	params: UseListListingsForCollectionParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listListingsForCollectionQueryOptions({
		config,
		...rest,
	});

	return useInfiniteQuery({
		...queryOptions,
	});
}

export { listListingsForCollectionQueryOptions };

export type {
	FetchListListingsForCollectionParams,
	ListListingsForCollectionQueryOptions,
};

export type UseListListingsForCollectionArgs =
	UseListListingsForCollectionParams;
export type UseListListingsForCollectionReturn = Awaited<
	ReturnType<typeof fetchListListingsForCollection>
>;
