'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type fetchListListingsForCollectible,
	type ListListingsForCollectibleQueryOptions,
	listListingsForCollectibleQueryOptions,
} from '../../queries/collectible/market-listings';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMarketListingsParams = Optional<
	ListListingsForCollectibleQueryOptions,
	'config'
>;

/**
 * Hook to fetch listings for a specific collectible
 *
 * Fetches active listings (sales) for a specific token from the marketplace
 * with support for filtering and pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific token ID to fetch listings for
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the collectible
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketListings({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: 123n
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useCollectibleMarketListings({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: 456n,
 *   page: {
 *     page: 2,
 *     pageSize: 20
 *   }
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useCollectibleMarketListings({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: 789n,
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Specific currency addresses
 *   }
 * })
 * ```
 */
export function useCollectibleMarketListings(
	params: UseCollectibleMarketListingsParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listListingsForCollectibleQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listListingsForCollectibleQueryOptions };

export type { ListListingsForCollectibleQueryOptions };

// Legacy exports for backward compatibility during migration
export type UseListListingsForCollectibleArgs =
	UseListListingsForCollectibleParams;
export type UseListListingsForCollectibleResponse = Awaited<
	ReturnType<typeof fetchListListingsForCollectible>
>;
export type UseListListingsForCollectibleParams =
	UseCollectibleMarketListingsParams;
