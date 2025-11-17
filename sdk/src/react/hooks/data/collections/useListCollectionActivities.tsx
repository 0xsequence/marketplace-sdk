'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchListCollectionActivitiesParams,
	type fetchListCollectionActivities,
	type ListCollectionActivitiesQueryOptions,
	listCollectionActivitiesQueryOptions,
} from '../../../queries/collections/listCollectionActivities';
import { useConfig } from '../../config/useConfig';

export type UseListCollectionActivitiesParams = Optional<
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
 * const { data, isLoading } = useListCollectionActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListCollectionActivities({
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
 * const { data } = useListCollectionActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   sort: [{ column: 'createdAt', order: SortOrder.DESC }],
 *   pageSize: 50
 * })
 * ```
 */
export function useListCollectionActivities(
	params: UseListCollectionActivitiesParams,
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

export type {
	FetchListCollectionActivitiesParams,
	ListCollectionActivitiesQueryOptions,
};

// Legacy exports for backward compatibility during migration
export type UseListCollectionActivitiesArgs = UseListCollectionActivitiesParams;
export type UseListCollectionActivitiesReturn = Awaited<
	ReturnType<typeof fetchListCollectionActivities>
>;
