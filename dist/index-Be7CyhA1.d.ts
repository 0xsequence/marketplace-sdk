import { j as Optional } from "./create-config-CrbgqkBr.js";
import { S as fetchGetTokenRanges, f as ListTokenMetadataQueryOptions, g as UseListBalancesArgs, n as TokenSuppliesQueryOptions, s as SearchTokenMetadataQueryOptions, x as GetTokenRangesQueryOptions } from "./tokenSupplies-D_n1F7iE.js";
import * as _tanstack_react_query369 from "@tanstack/react-query";
import * as _0xsequence_indexer3 from "@0xsequence/indexer";
import * as _0xsequence_metadata59 from "@0xsequence/metadata";
import { Address } from "viem";

//#region src/react/hooks/data/tokens/useGetTokenRanges.d.ts
type UseGetTokenRangesParams = Optional<GetTokenRangesQueryOptions, 'config'>;
/**
 * Hook to fetch token ID ranges for a collection
 *
 * Retrieves the available token ID ranges for a specific collection,
 * which is useful for understanding the token distribution and
 * available tokens within a collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address to fetch ranges for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token ID ranges for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: tokenRanges, isLoading } = useGetTokenRanges({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`Token ranges: ${JSON.stringify(data.tokenIDRanges)}`);
 *   data.tokenIDRanges?.forEach(range => {
 *     console.log(`Range: ${range.start} - ${range.end}`);
 *   });
 * }
 * ```
 *
 * @example
 * With conditional enabling:
 * ```typescript
 * const { data: tokenRanges } = useGetTokenRanges({
 *   chainId: 1,
 *   collectionAddress: selectedCollection?.address,
 *   query: {
 *     enabled: Boolean(selectedCollection?.address),
 *     staleTime: 300000, // Cache for 5 minutes
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
declare function useGetTokenRanges(params: UseGetTokenRangesParams): _tanstack_react_query369.UseQueryResult<_0xsequence_indexer3.GetTokenIDRangesReturn, Error>;
type UseGetTokenRangesProps = {
  chainId: number;
  collectionAddress: Address;
  query?: {
    enabled?: boolean;
  };
};
type UseGetTokenRangesReturn = Awaited<ReturnType<typeof fetchGetTokenRanges>>;
//#endregion
//#region src/react/hooks/data/tokens/useListBalances.d.ts
/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListBalances({
 *   chainId: 1,
 *   accountAddress: '0x123...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useListBalances(args: UseListBalancesArgs): _tanstack_react_query369.UseInfiniteQueryResult<_tanstack_react_query369.InfiniteData<_0xsequence_indexer3.GetTokenBalancesReturn, unknown>, Error>;
//#endregion
//#region src/react/hooks/data/tokens/useListTokenMetadata.d.ts
type UseListTokenMetadataParams = Optional<ListTokenMetadataQueryOptions, 'config'>;
/**
 * Hook to fetch metadata for multiple tokens
 *
 * Retrieves metadata for a batch of tokens from a specific contract using the metadata API.
 * This hook is optimized for fetching multiple token metadata in a single request.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The contract address containing the tokens
 * @param params.tokenIds - Array of token IDs to fetch metadata for
 * @param params.config - Optional SDK configuration (defaults from context)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing an array of token metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: metadata, isLoading } = useListTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With query options:
 * ```typescript
 * const { data: metadata } = useListTokenMetadata({
 *   chainId: 1,
 *   contractAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0,
 *     staleTime: 10 * 60 * 1000 // 10 minutes
 *   }
 * })
 * ```
 */
declare function useListTokenMetadata(params: UseListTokenMetadataParams): _tanstack_react_query369.UseQueryResult<_0xsequence_metadata59.TokenMetadata[], Error>;
//#endregion
//#region src/react/hooks/data/tokens/useSearchTokenMetadata.d.ts
type UseSearchTokenMetadataParams = Optional<SearchTokenMetadataQueryOptions, 'config'> & {
  /**
   * If true, only return minted tokens (tokens with supply > 0)
   */
  onlyMinted?: boolean;
};
/**
 * Hook to search token metadata using filters with infinite pagination support
 *
 * Searches for tokens in a collection based on text and property filters.
 * Supports filtering by attributes, ranges, and text search.
 * Can optionally filter to only show minted tokens (tokens with supply > 0).
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Filter criteria for the search
 * @param params.filter.text - Optional text search query
 * @param params.filter.properties - Optional array of property filters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 * @param params.onlyMinted - If true, only return minted tokens (tokens with supply > 0)
 *
 * @returns Infinite query result containing matching token metadata with pagination support
 *
 * @example
 * Basic text search with pagination:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useSearchTokenMetadata({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: {
 *     text: 'dragon'
 *   }
 * })
 * ```
 *
 * @example
 * Property filters:
 * ```typescript
 * const { data, fetchNextPage } = useSearchTokenMetadata({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     properties: [
 *       {
 *         name: 'Rarity',
 *         type: PropertyType.STRING,
 *         values: ['Legendary', 'Epic']
 *       },
 *       {
 *         name: 'Level',
 *         type: PropertyType.INT,
 *         min: 50,
 *         max: 100
 *       }
 *     ]
 *   }
 * })
 * ```
 *
 * @example
 * Search only minted tokens:
 * ```typescript
 * const { data, fetchNextPage } = useSearchTokenMetadata({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   onlyMinted: true,
 *   filter: {
 *     text: 'dragon'
 *   }
 * })
 * ```
 */
declare function useSearchTokenMetadata(params: UseSearchTokenMetadataParams): {
  isError: boolean;
  error: Error;
  data: undefined;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  isFetchPreviousPageError: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  isError: boolean;
  error: Error;
  data: undefined;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: "success";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  isError: boolean;
  error: Error;
  data: undefined;
  isPending: false;
  isLoading: false;
  isLoadingError: true;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  isError: boolean;
  error: Error;
  data: undefined;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  isError: boolean;
  error: Error;
  data: undefined;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  status: "success";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page;
  } | undefined;
  error: Error;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  isFetchPreviousPageError: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page;
  } | undefined;
  error: null;
  isError: false;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: "success";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page;
  } | undefined;
  error: Error;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: true;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page;
  } | undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page;
  } | undefined;
  isError: false;
  error: null;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  status: "success";
  fetchNextPage: (options?: _tanstack_react_query369.FetchNextPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
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
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page | undefined;
  } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<void>;
  isError: true;
  isPending: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasPreviousPage: boolean;
  isFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  isFetchPreviousPageError: boolean;
  isFetchingPreviousPage: boolean;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page | undefined;
  } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<void>;
  isError: false;
  isPending: false;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: "success";
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page | undefined;
  } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<void>;
  isError: true;
  isPending: false;
  isLoadingError: true;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page | undefined;
  } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<void>;
  isError: false;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata59.TokenMetadata[];
    page: _0xsequence_metadata59.Page | undefined;
  } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<void>;
  isError: false;
  isPending: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  status: "success";
  fetchPreviousPage: (options?: _tanstack_react_query369.FetchPreviousPageOptions) => Promise<_tanstack_react_query369.InfiniteQueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query369.RefetchOptions) => Promise<_tanstack_react_query369.QueryObserverResult<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query369.FetchStatus;
  promise: Promise<_tanstack_react_query369.InfiniteData<_0xsequence_metadata59.SearchTokenMetadataReturn, unknown>>;
};
//#endregion
//#region src/react/hooks/data/tokens/useTokenSupplies.d.ts
type UseTokenSuppliesParams = Optional<TokenSuppliesQueryOptions, 'config'>;
/**
 * Hook to fetch token supplies from the indexer
 *
 * Retrieves supply information for tokens from a specific collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.includeMetadata - Whether to include token metadata
 * @param params.page - Pagination options
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 1,
 *   collectionAddress: selectedCollection,
 *   query: {
 *     enabled: !!selectedCollection
 *   }
 * })
 * ```
 */
declare function useTokenSupplies(params: UseTokenSuppliesParams): _tanstack_react_query369.UseInfiniteQueryResult<_tanstack_react_query369.InfiniteData<_0xsequence_indexer3.GetTokenSuppliesReturn, unknown>, Error>;
//#endregion
export { UseListTokenMetadataParams as a, UseGetTokenRangesParams as c, useGetTokenRanges as d, useSearchTokenMetadata as i, UseGetTokenRangesProps as l, useTokenSupplies as n, useListTokenMetadata as o, UseSearchTokenMetadataParams as r, useListBalances as s, UseTokenSuppliesParams as t, UseGetTokenRangesReturn as u };
//# sourceMappingURL=index-Be7CyhA1.d.ts.map