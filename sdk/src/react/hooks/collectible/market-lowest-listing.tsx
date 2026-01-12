'use client';

import type { Order } from '@0xsequence/api-client';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type LowestListingQueryOptions,
	lowestListingQueryOptions,
} from '../../queries/collectible/market-lowest-listing';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMarketLowestListingParams = Optional<
	LowestListingQueryOptions,
	'config'
>;

/**
 * Hook to fetch the lowest listing for a collectible
 *
 * Retrieves the lowest priced listing currently available for a specific token
 * in a collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The token ID within the collection
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the lowest listing data or null if no listings exist
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketLowestListing({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketLowestListing({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     refetchInterval: 15000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
export function useCollectibleMarketLowestListing(
	params: UseCollectibleMarketLowestListingParams,
): UseQueryResult<Order | null, Error> {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = lowestListingQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { lowestListingQueryOptions };

export type { LowestListingQueryOptions };
