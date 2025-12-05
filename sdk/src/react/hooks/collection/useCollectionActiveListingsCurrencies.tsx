'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CollectionActiveListingsCurrenciesQueryOptions,
	collectionActiveListingsCurrenciesQueryOptions,
	type FetchCollectionActiveListingsCurrenciesParams,
} from '../../queries/collection/activeListingsCurrencies';
import { useConfig } from '../config/useConfig';

export type UseCollectionActiveListingsCurrenciesParams = Optional<
	CollectionActiveListingsCurrenciesQueryOptions,
	'config'
>;

/**
 * Hook to fetch the active listings currencies for a collection
 *
 * Retrieves all currencies that are currently being used in active listings
 * for a specific collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the array of currencies used in active listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveListingsCurrencies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveListingsCurrencies({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: hasCollectionAddress
 *   }
 * })
 * ```
 */
export function useCollectionActiveListingsCurrencies(
	params: UseCollectionActiveListingsCurrenciesParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = collectionActiveListingsCurrenciesQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { collectionActiveListingsCurrenciesQueryOptions };

export type {
	FetchCollectionActiveListingsCurrenciesParams,
	CollectionActiveListingsCurrenciesQueryOptions,
};
