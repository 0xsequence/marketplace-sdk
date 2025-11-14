import { w as Optional } from "./create-config-BO68TZC5.js";
import { f as ListTokenMetadataQueryOptions, g as UseListBalancesArgs, n as GetTokenRangesQueryOptions, r as fetchGetTokenRanges, s as SearchTokenMetadataQueryOptions } from "./ranges-DAOkJLGK.js";
import * as _tanstack_react_query0 from "@tanstack/react-query";
import * as _0xsequence_indexer0 from "@0xsequence/indexer";
import * as _0xsequence_metadata0 from "@0xsequence/metadata";
import { Address } from "viem";

//#region src/react/hooks/token/balances.d.ts

/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useTokenBalances({
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
declare function useTokenBalances(args: UseListBalancesArgs): _tanstack_react_query0.UseInfiniteQueryResult<_tanstack_react_query0.InfiniteData<_0xsequence_indexer0.GetTokenBalancesReturn, unknown>, Error>;
//#endregion
//#region src/react/hooks/token/currency-balance.d.ts
type UseCurrencyBalanceArgs = {
  currencyAddress: Address | undefined;
  chainId: number | undefined;
  userAddress: Address | undefined;
  query?: {
    enabled?: boolean;
  };
};
type UseTokenCurrencyBalanceResult = {
  data: {
    value: bigint;
    formatted: string;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  [key: string]: any;
};
/**
 * Hook to fetch cryptocurrency balance for a user
 *
 * Retrieves the balance of a specific currency (native token or ERC-20)
 * for a given user address using wagmi. Handles both native tokens (ETH, MATIC, etc.)
 * and ERC-20 tokens with automatic decimal formatting through direct blockchain calls.
 *
 * @param args - Configuration parameters
 * @param args.currencyAddress - The currency contract address (use zero address for native tokens)
 * @param args.chainId - The chain ID to query on
 * @param args.userAddress - The user address to check balance for
 * @param args.query - Optional wagmi query configuration
 *
 * @returns Wagmi query result containing raw and formatted balance values
 *
 * @example
 * Native token balance (ETH):
 * ```typescript
 * const { data: ethBalance, isLoading } = useTokenCurrencyBalance({
 *   currencyAddress: '0x0000000000000000000000000000000000000000', // Zero address for ETH
 *   chainId: 1,
 *   userAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`ETH Balance: ${data.formatted} ETH`); // e.g., "1.5 ETH"
 *   console.log(`Raw balance: ${data.value.toString()}`); // e.g., "1500000000000000000"
 * }
 * ```
 *
 * @example
 * ERC-20 token balance (USDC):
 * ```typescript
 * const { data: usdcBalance } = useTokenCurrencyBalance({
 *   currencyAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
 *   chainId: 1,
 *   userAddress: userAddress,
 *   query: {
 *     enabled: Boolean(userAddress), // Only fetch when user is connected
 *     refetchInterval: 30000 // Update every 30 seconds
 *   }
 * })
 *
 * if (data) {
 *   console.log(`USDC Balance: $${data.formatted}`); // e.g., "$1000.50"
 * }
 * ```
 */
declare function useTokenCurrencyBalance(args: UseCurrencyBalanceArgs): UseTokenCurrencyBalanceResult;
//#endregion
//#region src/react/hooks/token/metadata.d.ts
type UseTokenMetadataParams = Optional<ListTokenMetadataQueryOptions, 'config'>;
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
 * const { data: metadata, isLoading } = useTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With query options:
 * ```typescript
 * const { data: metadata } = useTokenMetadata({
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
declare function useTokenMetadata(params: UseTokenMetadataParams): _tanstack_react_query0.UseQueryResult<_0xsequence_metadata0.TokenMetadata[], Error>;
//#endregion
//#region src/react/hooks/token/metadata-search.d.ts
type UseTokenMetadataSearchParams = Optional<SearchTokenMetadataQueryOptions, 'config'> & {
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
 * const { data, isLoading, fetchNextPage, hasNextPage } = useTokenMetadataSearch({
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
 * const { data, fetchNextPage } = useTokenMetadataSearch({
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
 * const { data, fetchNextPage } = useTokenMetadataSearch({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   onlyMinted: true,
 *   filter: {
 *     text: 'dragon'
 *   }
 * })
 * ```
 */
declare function useTokenMetadataSearch(params: UseTokenMetadataSearchParams): {
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page;
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
  fetchNextPage: (options?: _tanstack_react_query0.FetchNextPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page | undefined;
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
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page | undefined;
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
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page | undefined;
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
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page | undefined;
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
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
} | {
  hasNextPage: boolean;
  data: {
    tokenMetadata: _0xsequence_metadata0.TokenMetadata[];
    page: _0xsequence_metadata0.Page | undefined;
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
  fetchPreviousPage: (options?: _tanstack_react_query0.FetchPreviousPageOptions) => Promise<_tanstack_react_query0.InfiniteQueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
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
  refetch: (options?: _tanstack_react_query0.RefetchOptions) => Promise<_tanstack_react_query0.QueryObserverResult<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>, Error>>;
  fetchStatus: _tanstack_react_query0.FetchStatus;
  promise: Promise<_tanstack_react_query0.InfiniteData<_0xsequence_metadata0.SearchTokenMetadataReturn, unknown>>;
};
//#endregion
//#region src/react/hooks/token/ranges.d.ts
type UseTokenRangesParams = Optional<GetTokenRangesQueryOptions, 'config'>;
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
 * const { data: tokenRanges, isLoading } = useTokenRanges({
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
 * const { data: tokenRanges } = useTokenRanges({
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
declare function useTokenRanges(params: UseTokenRangesParams): _tanstack_react_query0.UseQueryResult<_0xsequence_indexer0.GetTokenIDRangesReturn, Error>;
type UseGetTokenRangesProps = {
  chainId: number;
  collectionAddress: Address;
  query?: {
    enabled?: boolean;
  };
};
type UseGetTokenRangesReturn = Awaited<ReturnType<typeof fetchGetTokenRanges>>;
//#endregion
export { UseTokenMetadataSearchParams as a, useTokenMetadata as c, useTokenCurrencyBalance as d, useTokenBalances as f, useTokenRanges as i, UseCurrencyBalanceArgs as l, UseGetTokenRangesReturn as n, useTokenMetadataSearch as o, UseTokenRangesParams as r, UseTokenMetadataParams as s, UseGetTokenRangesProps as t, UseTokenCurrencyBalanceResult as u };
//# sourceMappingURL=index-DmAp_e5U.d.ts.map