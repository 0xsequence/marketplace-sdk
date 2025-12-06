'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type fetchListCollectionActivities,
	type ListCollectionActivitiesQueryOptions,
	listCollectionActivitiesQueryOptions,
} from '../../queries/collection/market-activities';
import { useConfig } from '../config/useConfig';

export type UseCollectionMarketActivitiesParams = Optional<
	ListCollectionActivitiesQueryOptions,
	'config'
>;

/**
 * Hook to fetch a list of activities for an entire collection
 *
 * Fetches activities (transfers, sales, offers, etc.) for all tokens
 * in a collection from the marketplace with support for pagination and sorting.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of activities per page (default: 10)
 * @param params.sort - Sort order for activities
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing activities data for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionMarketActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useCollectionMarketActivities({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   page: 2,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With sorting:
 * ```typescript
 * const { data } = useCollectionMarketActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   sort: [{ column: 'createdAt', order: SortOrder.DESC }],
 *   pageSize: 50
 * })
 * ```
 */
export function useCollectionMarketActivities(
	params: UseCollectionMarketActivitiesParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listCollectionActivitiesQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listCollectionActivitiesQueryOptions };

export type { ListCollectionActivitiesQueryOptions };

// Legacy exports for backward compatibility during migration
export type UseListCollectionActivitiesRequest =
	UseListCollectionActivitiesParams;
export type UseListCollectionActivitiesResponse = Awaited<
	ReturnType<typeof fetchListCollectionActivities>
>;
export type UseListCollectionActivitiesParams =
	UseCollectionMarketActivitiesParams;
