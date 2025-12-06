'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CountOffersForCollectibleQueryOptions,
	countOffersForCollectibleQueryOptions,
	type FetchCountOffersForCollectibleParams,
} from '../../queries/collectible/market-offers-count';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMarketOffersCountParams = Optional<
	CountOffersForCollectibleQueryOptions,
	'config'
>;

/**
 * Hook to get the count of offers for a specific collectible
 *
 * Counts the number of active offers for a given collectible in the marketplace.
 * Useful for displaying offer counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for offers
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of offers
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: offerCount, isLoading } = useCollectibleMarketOffersCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketOffersCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
export function useCollectibleMarketOffersCount(
	params: UseCollectibleMarketOffersCountParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = countOffersForCollectibleQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { countOffersForCollectibleQueryOptions };

export type {
	FetchCountOffersForCollectibleParams,
	CountOffersForCollectibleQueryOptions,
};
