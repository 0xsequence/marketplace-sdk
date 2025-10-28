import { Oi as PropertyFilter$1, _i as PriceFilter, j as Optional, ki as PropertyType } from "./create-config-nZqvb8A7.js";
import { n as FiltersQueryOptions } from "./filters-eI-ha2NY.js";
import * as _tanstack_react_query277 from "@tanstack/react-query";
import { PropertyFilter } from "@0xsequence/metadata";
import * as nuqs0 from "nuqs";

//#region src/react/hooks/ui/useFilterState.d.ts
interface StringFilterValues {
  type: PropertyType.STRING;
  values: string[];
}
interface IntFilterValues {
  type: PropertyType.INT;
  min: number;
  max: number;
}
type FilterValues = StringFilterValues | IntFilterValues;
declare function useFilterState(): {
  serialize: {
    (values: Partial<{
      filters: PropertyFilter$1[] | null;
      search: string | null;
      listedOnly: boolean | null;
      priceFilter: boolean | null;
      priceFilters: PriceFilter[] | null;
    }>): string;
    (base: string | URLSearchParams | URL, values: Partial<{
      filters: PropertyFilter$1[] | null;
      search: string | null;
      listedOnly: boolean | null;
      priceFilter: boolean | null;
      priceFilters: PriceFilter[] | null;
    }> | null): string;
  };
  getFilter: (name: string) => PropertyFilter$1 | undefined;
  getFilterValues: (name: string) => FilterValues | undefined;
  isFilterActive: (name: string) => boolean;
  isStringValueSelected: (name: string, value: string) => boolean;
  isIntFilterActive: (name: string) => boolean;
  getIntFilterRange: (name: string) => [number, number] | undefined;
  deleteFilter: (name: string) => void;
  toggleStringFilterValue: (name: string, value: string) => void;
  setIntFilterValue: (name: string, min: number, max: number) => void;
  setPriceFilter: (contractAddress: string, min?: string, max?: string) => void;
  getPriceFilter: (contractAddress: string) => PriceFilter | undefined;
  clearPriceFilters: () => void;
  clearAllFilters: () => void;
  filterOptions: PropertyFilter$1[];
  searchText: string;
  showListedOnly: boolean;
  showPriceFilter: boolean;
  priceFilters: PriceFilter[];
  setFilterOptions: (value: PropertyFilter$1[] | ((old: PropertyFilter$1[]) => PropertyFilter$1[] | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setSearchText: (value: string | ((old: string) => string | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setShowListedOnly: (value: boolean | ((old: boolean) => boolean | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setShowPriceFilter: (value: boolean | ((old: boolean) => boolean | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setPriceFilters: (value: PriceFilter[] | ((old: PriceFilter[]) => PriceFilter[] | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
};
//#endregion
//#region src/react/hooks/ui/useFilters.d.ts
type UseFiltersParams = Optional<FiltersQueryOptions, 'config'>;
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
declare function useFilters(params: UseFiltersParams): _tanstack_react_query277.UseQueryResult<PropertyFilter[], Error>;
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
declare function useFiltersProgressive(params: UseFiltersParams): {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: PropertyFilter[];
  error: Error;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query277.RefetchOptions) => Promise<_tanstack_react_query277.QueryObserverResult<PropertyFilter[], Error>>;
  fetchStatus: _tanstack_react_query277.FetchStatus;
  promise: Promise<PropertyFilter[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: PropertyFilter[];
  error: null;
  isError: false;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: "success";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query277.RefetchOptions) => Promise<_tanstack_react_query277.QueryObserverResult<PropertyFilter[], Error>>;
  fetchStatus: _tanstack_react_query277.FetchStatus;
  promise: Promise<PropertyFilter[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: undefined;
  error: Error;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: true;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query277.RefetchOptions) => Promise<_tanstack_react_query277.QueryObserverResult<PropertyFilter[], Error>>;
  fetchStatus: _tanstack_react_query277.FetchStatus;
  promise: Promise<PropertyFilter[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoading: true;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query277.RefetchOptions) => Promise<_tanstack_react_query277.QueryObserverResult<PropertyFilter[], Error>>;
  fetchStatus: _tanstack_react_query277.FetchStatus;
  promise: Promise<PropertyFilter[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query277.RefetchOptions) => Promise<_tanstack_react_query277.QueryObserverResult<PropertyFilter[], Error>>;
  fetchStatus: _tanstack_react_query277.FetchStatus;
  promise: Promise<PropertyFilter[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: PropertyFilter[];
  isError: false;
  error: null;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  status: "success";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query277.RefetchOptions) => Promise<_tanstack_react_query277.QueryObserverResult<PropertyFilter[], Error>>;
  fetchStatus: _tanstack_react_query277.FetchStatus;
  promise: Promise<PropertyFilter[]>;
};
type UseFiltersArgs = {
  chainId: number;
  collectionAddress: string;
  showAllFilters?: boolean;
  excludePropertyValues?: boolean;
  query?: {
    enabled?: boolean;
  };
};
type UseFilterReturn = PropertyFilter[];
//#endregion
//#region src/react/hooks/ui/useOpenConnectModal.d.ts
declare const useOpenConnectModal: () => {
  openConnectModal: () => void;
};
//#endregion
export { useFilters as a, UseFiltersParams as i, UseFilterReturn as n, useFiltersProgressive as o, UseFiltersArgs as r, useFilterState as s, useOpenConnectModal as t };
//# sourceMappingURL=index-DswDckgs.d.ts.map