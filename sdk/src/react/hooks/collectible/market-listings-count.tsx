'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CountListingsForCollectibleQueryOptions,
	countListingsForCollectibleQueryOptions,
	type FetchCountListingsForCollectibleParams,
} from '../../queries/collectible/market-listings-count';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMarketListingsCountParams = Optional<
	CountListingsForCollectibleQueryOptions,
	'config'
>;

/**
 * Hook to get the count of listings for a specific collectible
 *
 * Counts the number of active listings for a given collectible in the marketplace.
 * Useful for displaying listing counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for listings
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: listingCount, isLoading } = useCollectibleMarketListingsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketListingsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
export function useCollectibleMarketListingsCount(
	params: UseCollectibleMarketListingsCountParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = countListingsForCollectibleQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { countListingsForCollectibleQueryOptions };

export type {
	FetchCountListingsForCollectibleParams,
	CountListingsForCollectibleQueryOptions,
};
