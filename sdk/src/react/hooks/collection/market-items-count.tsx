'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CountItemsOrdersForCollectionQueryOptions,
	countItemsOrdersForCollectionQueryOptions,
	type FetchCountItemsOrdersForCollectionParams,
} from '../../queries/collection/market-items-count';
import { useConfig } from '../config/useConfig';

export type UseCollectionMarketItemsCountParams = Optional<
	CountItemsOrdersForCollectionQueryOptions,
	'config'
>;

/**
 * Hook to get the count of orders for a collection
 *
 * Counts the total number of active orders (listings) for all tokens
 * in a collection. Useful for displaying order counts in collection UI.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filter criteria for orders
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of orders
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: orderCount, isLoading } = useCollectionMarketItemsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectionMarketItemsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 *
 * @example
 * Combined with list hook:
 * ```typescript
 * const { data: totalCount } = useCollectionMarketItemsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * const { data: orders } = useListItemsOrdersForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * return <div>Showing {orders?.pages[0]?.listings.length ?? 0} of {totalCount} orders</div>
 * ```
 */
export function useCollectionMarketItemsCount(
	params: UseCollectionMarketItemsCountParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = countItemsOrdersForCollectionQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { countItemsOrdersForCollectionQueryOptions };

export type {
	FetchCountItemsOrdersForCollectionParams,
	CountItemsOrdersForCollectionQueryOptions,
};
