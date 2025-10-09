'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Optional } from '../_internal';
import {
	type InventoryQueryOptions,
	indexerQueryOptions,
	inventoryQueryOptions,
} from '../queries/inventory';
import { useConfig } from './useConfig';

export type UseInventoryParams = Optional<InventoryQueryOptions, 'config'>;

export interface UseInventoryArgs {
	accountAddress: Address;
	collectionAddress: Address;
	chainId: number;
	query?: {
		enabled?: boolean;
	};
}

/**
 * Hook to fetch user's inventory with infinite pagination
 *
 * Fetches all tokens owned by a user from the indexer and enriches
 * with marketplace data (listings/offers) when available.
 *
 * The hook uses a two-phase approach:
 * 1. Fetches items with marketplace listings first (prioritized)
 * 2. Fetches remaining owned items from indexer
 *
 * @param params - Inventory query parameters
 * @param params.accountAddress - User's wallet address
 * @param params.collectionAddress - NFT collection contract address
 * @param params.chainId - Blockchain network ID (e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result with inventory data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, fetchNextPage, hasNextPage } = useInventory({
 *   accountAddress: '0x...',
 *   collectionAddress: '0x...',
 *   chainId: 137
 * })
 * ```
 *
 * @example
 * Manual invalidation using React Query:
 * ```typescript
 * import { useQueryClient } from '@tanstack/react-query'
 * import { inventoryKeys } from '@0xsequence/marketplace-sdk/react'
 *
 * function InventoryPage() {
 *   const queryClient = useQueryClient()
 *   const inventory = useInventory({ ... })
 *
 *   const handleRefresh = () => {
 *     // Invalidate specific user's inventory
 *     queryClient.invalidateQueries({
 *       queryKey: inventoryKeys.user(collectionAddress, chainId, accountAddress)
 *     })
 *
 *     // Or invalidate all inventory for a collection
 *     queryClient.invalidateQueries({
 *       queryKey: inventoryKeys.collection(collectionAddress, chainId)
 *     })
 *   }
 *
 *   return <button onClick={handleRefresh}>Refresh</button>
 * }
 * ```
 *
 * @remarks
 * - Data is cached for 10 seconds (configurable via query.staleTime)
 * - Indexer data is fetched once and cached for 30 seconds
 * - Background refetch occurs on window focus
 * - Use React Query's invalidateQueries with inventoryKeys for manual refresh
 */
export function useInventory(params: UseInventoryParams) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;

	const { data: indexerMap, isLoading: indexerLoading } = useQuery(
		indexerQueryOptions({ config, ...rest }),
	);

	const inventoryQuery = useInfiniteQuery(
		inventoryQueryOptions({ config, ...rest }, indexerMap),
	);

	return {
		...inventoryQuery,
		isLoading: indexerLoading || inventoryQuery.isLoading,
	};
}

export { inventoryKeys } from '../_internal/api/query-keys';
export type { CollectibleWithBalance } from '../queries/inventory';
// Re-export query options and keys for direct use
export {
	indexerQueryOptions,
	inventoryQueryOptions,
} from '../queries/inventory';
