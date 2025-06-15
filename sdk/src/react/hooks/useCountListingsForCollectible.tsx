'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type CountListingsForCollectibleQueryOptions,
	type FetchCountListingsForCollectibleParams,
	countListingsForCollectibleQueryOptions,
} from '../queries/countListingsForCollectible';
import { useConfig } from './useConfig';

export type UseCountListingsForCollectibleParams = Optional<
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
 * @param params.collectibleId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for listings
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: listingCount, isLoading } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
export function useCountListingsForCollectible(
	params: UseCountListingsForCollectibleParams,
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
