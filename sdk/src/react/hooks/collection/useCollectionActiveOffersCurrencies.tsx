'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CollectionActiveOffersCurrenciesQueryOptions,
	collectionActiveOffersCurrenciesQueryOptions,
	type FetchCollectionActiveOffersCurrenciesParams,
} from '../../queries/collection/activeOffersCurrencies';
import { useConfig } from '../config/useConfig';

export type UseCollectionActiveOffersCurrenciesParams = Optional<
	CollectionActiveOffersCurrenciesQueryOptions,
	'config'
>;

/**
 * Hook to fetch the active offers currencies for a collection
 *
 * Retrieves all currencies that are currently being used in active offers
 * for a specific collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the array of currencies used in active offers
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveOffersCurrencies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveOffersCurrencies({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: hasCollectionAddress
 *   }
 * })
 * ```
 */
export function useCollectionActiveOffersCurrencies(
	params: UseCollectionActiveOffersCurrenciesParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = collectionActiveOffersCurrenciesQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { collectionActiveOffersCurrenciesQueryOptions };

export type {
	FetchCollectionActiveOffersCurrenciesParams,
	CollectionActiveOffersCurrenciesQueryOptions,
};
