'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchListOffersForCollectibleParams,
	type ListOffersForCollectibleQueryOptions,
	listOffersForCollectibleQueryOptions,
} from '../../../queries/listOffersForCollectible';
import { useConfig } from '../../config/useConfig';

export type UseListOffersForCollectibleParams = Optional<
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
 * @param params.collectibleId - The specific collectible ID to fetch offers for
 * @param params.filter - Optional filtering parameters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing offers data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '1'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useListOffersForCollectible({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '1',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
export function useListOffersForCollectible(
	params: UseListOffersForCollectibleParams,
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

export type {
	FetchListOffersForCollectibleParams,
	ListOffersForCollectibleQueryOptions,
};

// Legacy export for backward compatibility during migration
export type UseListOffersForCollectibleArgs = UseListOffersForCollectibleParams;
