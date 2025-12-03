'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchListCollectibleActivitiesParams,
	type fetchListCollectibleActivities,
	type ListCollectibleActivitiesQueryOptions,
	listCollectibleActivitiesQueryOptions,
} from '../../../queries/collectibles/listCollectibleActivities';
import { useConfig } from '../../config/useConfig';

export type UseListCollectibleActivitiesParams = Optional<
	ListCollectibleActivitiesQueryOptions,
	'config'
>;

/**
 * Hook to fetch a list of activities for a specific collectible
 *
 * Fetches activities (transfers, sales, offers, etc.) for a specific token
 * from the marketplace with support for pagination and sorting.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific token ID to fetch activities for
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of activities per page (default: 10)
 * @param params.sort - Sort order for activities
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing activities data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListCollectibleActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListCollectibleActivities({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '456',
 *   page: 2,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With sorting:
 * ```typescript
 * const { data } = useListCollectibleActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '789',
 *   sort: 'timestamp_desc',
 *   pageSize: 50
 * })
 * ```
 */
export function useListCollectibleActivities(
	params: UseListCollectibleActivitiesParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listCollectibleActivitiesQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listCollectibleActivitiesQueryOptions };

export type {
	FetchListCollectibleActivitiesParams,
	ListCollectibleActivitiesQueryOptions,
};

// Legacy exports for backward compatibility during migration
export type UseListCollectibleActivitiesArgs =
	UseListCollectibleActivitiesParams;
export type UseListCollectibleActivitiesReturn = Awaited<
	ReturnType<typeof fetchListCollectibleActivities>
>;
