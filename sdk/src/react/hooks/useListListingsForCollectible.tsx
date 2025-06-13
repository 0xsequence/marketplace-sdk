'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type FetchListListingsForCollectibleParams,
	type ListListingsForCollectibleQueryOptions,
	type fetchListListingsForCollectible,
	listListingsForCollectibleQueryOptions,
} from '../queries/listListingsForCollectible';
import { useConfig } from './useConfig';

export type UseListListingsForCollectibleParams = Optional<
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
 * @param params.collectibleId - The specific token ID to fetch listings for
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the collectible
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListListingsForCollectible({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '456',
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
 * const { data } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '789',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Specific currency addresses
 *   }
 * })
 * ```
 */
export function useListListingsForCollectible(
	params: UseListListingsForCollectibleParams,
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

export type {
	FetchListListingsForCollectibleParams,
	ListListingsForCollectibleQueryOptions,
};

// Legacy exports for backward compatibility during migration
export type UseListListingsForCollectibleArgs =
	UseListListingsForCollectibleParams;
export type UseListListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListListingsForCollectible>
>;
