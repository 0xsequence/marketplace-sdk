'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchListCollectiblesParams,
	type ListCollectiblesQueryOptions,
	listCollectiblesQueryOptions,
} from '../../../queries/collectibles/listCollectibles';
import { useConfig } from '../../config/useConfig';

export type UseListCollectiblesParams = Optional<
	ListCollectiblesQueryOptions,
	'config'
>;

/**
 * Hook to fetch a list of collectibles with infinite pagination support
 *
 * Fetches collectibles from the marketplace with support for filtering, pagination,
 * and special handling for shop marketplace types.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters
 * @param params.marketplaceType - Type of marketplace (shop, etc.)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing collectibles data with pagination
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useListCollectibles({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useListCollectibles({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   filter: {
 *     searchText: 'dragon',
 *     includeEmpty: false,
 *     marketplaces: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
export function useListCollectibles(params: UseListCollectiblesParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listCollectiblesQueryOptions({
		config,
		...rest,
	});

	return useInfiniteQuery({
		...queryOptions,
	});
}

export { listCollectiblesQueryOptions };

export type { FetchListCollectiblesParams, ListCollectiblesQueryOptions };

// Legacy export for backward compatibility during migration
export type UseListCollectiblesArgs = UseListCollectiblesParams;
