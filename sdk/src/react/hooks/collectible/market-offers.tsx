'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type ListOffersForCollectibleQueryOptions,
	listOffersForCollectibleQueryOptions,
} from '../../queries/collectible/market-offers';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMarketOffersParams = Optional<
	ListOffersForCollectibleQueryOptions,
	'config'
>;

/**
 * Hook to fetch offers for a specific collectible
 *
 * Fetches offers for a specific collectible from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific token ID to fetch offers for
 * @param params.filter - Optional filtering parameters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing offers data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketOffers({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: 1n
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useCollectibleMarketOffers({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: 1n,
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
export function useCollectibleMarketOffers(
	params: UseCollectibleMarketOffersParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listOffersForCollectibleQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listOffersForCollectibleQueryOptions };

export type { ListOffersForCollectibleQueryOptions };

// Legacy export for backward compatibility during migration
export type UseListOffersForCollectibleRequest =
	UseListOffersForCollectibleParams;
export type UseListOffersForCollectibleParams =
	UseCollectibleMarketOffersParams;
