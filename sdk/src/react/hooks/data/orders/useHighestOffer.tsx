'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchHighestOfferParams,
	type HighestOfferQueryOptions,
	highestOfferQueryOptions,
} from '../../../queries/orders/highestOffer';
import { useConfig } from '../../config/useConfig';

export type UseHighestOfferParams = Optional<
	HighestOfferQueryOptions,
	'config'
>;

/**
 * Hook to fetch the highest offer for a collectible
 *
 * Retrieves the highest offer currently available for a specific token
 * in a collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The token ID within the collection
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the highest offer data or null if no offers exist
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useHighestOffer({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useHighestOffer({
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
export function useHighestOffer(params: UseHighestOfferParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = highestOfferQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { highestOfferQueryOptions };

export type { FetchHighestOfferParams, HighestOfferQueryOptions };
