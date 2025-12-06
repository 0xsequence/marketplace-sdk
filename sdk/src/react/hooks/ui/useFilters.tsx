'use client';

import type { PropertyFilter } from '@0xsequence/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchFiltersParams,
	type FiltersQueryOptions,
	filtersQueryOptions,
} from '../../queries/marketplace/filters';
import { useConfig } from '../config/useConfig';

export type UseFiltersParams = Optional<FiltersQueryOptions, 'config'>;

/**
 * Hook to fetch metadata filters for a collection
 *
 * Retrieves property filters for a collection from the metadata service,
 * with support for marketplace-specific filter configuration including
 * exclusion rules and custom ordering.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address to fetch filters for
 * @param params.showAllFilters - Whether to show all filters or apply marketplace filtering
 * @param params.excludePropertyValues - Whether to exclude property values from the response
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing property filters for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: filters, isLoading } = useFilters({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`Found ${data.length} filters`);
 *   data.forEach(filter => {
 *     console.log(`${filter.name}: ${filter.values?.join(', ')}`);
 *   });
 * }
 * ```
 *
 * @example
 * With marketplace filtering disabled:
 * ```typescript
 * const { data: allFilters } = useFilters({
 *   chainId: 1,
 *   collectionAddress: '0x5678...',
 *   showAllFilters: true, // Bypass marketplace filter rules
 *   query: {
 *     enabled: Boolean(selectedCollection),
 *     staleTime: 300000 // Cache for 5 minutes
 *   }
 * })
 * ```
 *
 * @example
 * Exclude property values for faster loading:
 * ```typescript
 * const { data: filterNames } = useFilters({
 *   chainId: 137,
 *   collectionAddress: collectionAddress,
 *   excludePropertyValues: true, // Only get filter names, not values
 *   query: {
 *     enabled: Boolean(collectionAddress)
 *   }
 * })
 * ```
 */
export function useFilters(params: UseFiltersParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = filtersQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

/**
 * Hook to progressively load collection filters
 *
 * First loads filter names only for fast initial display, then loads full filter
 * data with values. Uses placeholder data to provide immediate feedback while
 * full data loads in the background.
 *
 * @param params - Configuration parameters (same as useFilters)
 *
 * @returns Query result with additional loading states
 * @returns result.isLoadingNames - Whether filter names are still loading
 * @returns result.isFetchingValues - Whether filter values are being fetched
 *
 * @example
 * Progressive filter loading:
 * ```typescript
 * const {
 *   data: filters,
 *   isLoadingNames,
 *   isFetchingValues,
 *   isLoading
 * } = useFiltersProgressive({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (isLoadingNames) {
 *   return <div>Loading filters...</div>;
 * }
 *
 * return (
 *   <div>
 *     {filters?.map(filter => (
 *       <FilterComponent
 *         key={filter.name}
 *         filter={filter}
 *         isLoadingValues={isFetchingValues}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useFiltersProgressive(params: UseFiltersParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const namesQuery = useQuery(
		filtersQueryOptions({
			config,
			...rest,
			excludePropertyValues: true,
		}),
	);

	const fullQuery = useQuery({
		...filtersQueryOptions({
			config,
			...rest,
		}),
		placeholderData: namesQuery.data,
	});

	const isLoadingNames = namesQuery.isLoading;
	const isFetchingValues = fullQuery.isPlaceholderData && fullQuery.isFetching;

	return {
		...fullQuery,
		isFetchingValues,
		isLoadingNames,
	};
}

export { filtersQueryOptions };

export type { FetchFiltersParams, FiltersQueryOptions };

// Legacy exports for backward compatibility
export type UseFiltersArgs = {
	chainId: number;
	collectionAddress: string;
	showAllFilters?: boolean;
	excludePropertyValues?: boolean;
	query?: {
		enabled?: boolean;
	};
};

export type UseFilterReturn = PropertyFilter[];
