import { $t as GetCollectionActiveOffersCurrenciesRequest, Ft as Address$1, It as ChainId, Kt as Collection, Qt as GetCollectionActiveListingsCurrenciesRequest, R as ListOrdersWithCollectiblesRequest, Rt as ProjectId, St as GetTokenBalancesDetailsResponse, dt as ContractInfoExtensions$1$1, i as CollectibleOrder, l as Currency, o as CollectionFilterSettings, un as OrderbookKind, ut as ContractInfo$1$1, z as ListOrdersWithCollectiblesResponse, zt as TokenId } from "./index2.js";
import { B as Optional, W as SdkQueryParams, X as WithRequired, c as SdkConfig, it as WithOptionalParams, lt as StandardQueryOptions } from "./create-config.js";
import { A as ListCollectionsQueryOptions, F as CollectionBalanceDetailsQueryOptions, I as CollectionBalanceFilter, T as GetCountOfFilteredOrdersQueryOptions, _ as fetchListItemsOrdersForCollection, b as FloorOrderQueryOptions, c as fetchListItemsOrdersForCollectionPaginated, d as CountItemsOrdersForCollectionQueryOptions, g as ListItemsOrdersForCollectionQueryOptions, s as ListItemsOrdersForCollectionPaginatedQueryOptions, t as CollectionQueryOptions, z as fetchCollectionBalanceDetails } from "./metadata.js";
import * as _0xsequence_indexer11 from "@0xsequence/indexer";
import * as _0xsequence_metadata33 from "@0xsequence/metadata";
import * as _tanstack_react_query415 from "@tanstack/react-query";

//#region src/react/hooks/collection/balance-details.d.ts
type UseCollectionBalanceDetailsParams = Optional<CollectionBalanceDetailsQueryOptions, 'config'>;
/**
 * Hook to fetch detailed balance information for multiple accounts
 *
 * Retrieves token balances and native balances for multiple account addresses,
 * with support for contract whitelisting and optional native balance exclusion.
 * Aggregates results from multiple account addresses into a single response.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.filter - Filter configuration for balance queries
 * @param params.filter.accountAddresses - Array of account addresses to query balances for
 * @param params.filter.contractWhitelist - Optional array of contract addresses to filter by
 * @param params.filter.omitNativeBalances - Whether to exclude native token balances
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing aggregated balance details for all accounts
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: balanceDetails, isLoading } = useCollectionBalanceDetails({
 *   chainId: 137,
 *   filter: {
 *     accountAddresses: ['0x1234...', '0x5678...'],
 *     omitNativeBalances: false
 *   }
 * })
 *
 * if (data) {
 *   console.log(`Found ${data.balances.length} token balances`);
 *   console.log(`Found ${data.nativeBalances.length} native balances`);
 * }
 * ```
 *
 * @example
 * With contract whitelist:
 * ```typescript
 * const { data: balanceDetails } = useCollectionBalanceDetails({
 *   chainId: 1,
 *   filter: {
 *     accountAddresses: [userAddress],
 *     contractWhitelist: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC only
 *     omitNativeBalances: true
 *   },
 *   query: {
 *     enabled: Boolean(userAddress),
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
declare function useCollectionBalanceDetails(params: UseCollectionBalanceDetailsParams): _tanstack_react_query415.UseQueryResult<GetTokenBalancesDetailsResponse, Error>;
type UseCollectionBalanceDetailsArgs = {
  chainId: number;
  filter: CollectionBalanceFilter;
  query?: {
    enabled?: boolean;
  };
};
type UseCollectionBalanceDetailsReturn = Awaited<ReturnType<typeof fetchCollectionBalanceDetails>>;
//#endregion
//#region src/react/hooks/collection/list.d.ts
type UseCollectionListParams = Optional<ListCollectionsQueryOptions, 'config' | 'marketplaceConfig'>;
/**
 * Hook to fetch collections from marketplace configuration
 *
 * Retrieves all collections configured in the marketplace, with optional filtering
 * by marketplace type. Combines metadata from the metadata API with marketplace
 * configuration to provide complete collection information.
 *
 * @param params - Configuration parameters
 * @param params.marketplaceType - Optional filter by marketplace type
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing array of collections with metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collections, isLoading } = useListCollections();
 *
 * if (isLoading) return <div>Loading collections...</div>;
 *
 * return (
 *   <div>
 *     {collections?.map(collection => (
 *       <div key={collection.itemsAddress}>
 *         {collection.name}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * Filtering by marketplace type:
 * ```typescript
 * const { data: marketCollections } = useCollectionList({
 *   marketplaceType: 'market'
 * });
 * ```
 */
declare function useCollectionList(params?: UseCollectionListParams): _tanstack_react_query415.UseQueryResult<({
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata33.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "market";
  projectId: ProjectId;
  itemsAddress: Address$1;
  contractType: _0xsequence_indexer11.ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
} | {
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata33.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "shop";
  projectId: ProjectId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
})[], Error>;
//#endregion
//#region src/react/hooks/collection/market-detail-polling.d.ts
type UseCollectionMarketDetailPollingParams = {
  collectionAddress: Address$1;
  chainId: number;
  query?: {
    enabled?: boolean;
  };
};
declare const collectionMarketDetailPollingOptions: (args: UseCollectionMarketDetailPollingParams, config: SdkConfig) => _tanstack_react_query415.OmitKeyof<_tanstack_react_query415.UseQueryOptions<Collection, Error, Collection, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query415.QueryFunction<Collection, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
declare const useCollectionMarketDetailPolling: (args: UseCollectionMarketDetailPollingParams) => _tanstack_react_query415.UseQueryResult<Collection, Error>;
//#endregion
//#region src/react/hooks/collection/market-filtered-count.d.ts
type UseCollectionMarketFilteredCountParams = Optional<GetCountOfFilteredOrdersQueryOptions, 'config'>;
declare function useCollectionMarketFilteredCount(params: UseCollectionMarketFilteredCountParams): _tanstack_react_query415.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/collection/market-floor.d.ts
type UseCollectionMarketFloorParams = Optional<WithRequired<FloorOrderQueryOptions, 'chainId' | 'collectionAddress'>, 'config'>;
/**
 * Hook to fetch the floor order for a collection
 *
 * Retrieves the lowest priced order (listing) currently available for any token
 * in the specified collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filter criteria for collectibles
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the floor order data for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionMarketFloor({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filters and custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectionMarketFloor({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     minPrice: '1000000000000000000' // 1 ETH in wei
 *   },
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: hasCollectionAddress
 *   }
 * })
 * ```
 */
declare function useCollectionMarketFloor(params: UseCollectionMarketFloorParams): _tanstack_react_query415.UseQueryResult<CollectibleOrder, Error>;
//#endregion
//#region src/react/hooks/collection/market-items.d.ts
type FetchListItemsOrdersForCollectionParams = ListOrdersWithCollectiblesRequest;
type UseCollectionMarketItemsParams = Optional<ListItemsOrdersForCollectionQueryOptions, 'config'>;
/**
 * Hook to fetch all listings for a collection with infinite pagination support
 *
 * Fetches active listings (sales) for all tokens in a collection from the marketplace
 * with support for filtering and infinite scroll pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing listings data with pagination
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useCollectionMarketItems({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useCollectionMarketItems({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...']
 *   }
 * })
 * ```
 *
 * @example
 * Accessing paginated data:
 * ```typescript
 * const { data } = useCollectionMarketItems({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * const allListings = data?.pages.flatMap(page => page.listings) ?? []
 * ```
 */
declare function useCollectionMarketItems(params: UseCollectionMarketItemsParams): _tanstack_react_query415.UseInfiniteQueryResult<_tanstack_react_query415.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>, Error>;
type UseListItemsOrdersForCollectionArgs = UseListItemsOrdersForCollectionParams;
type UseListItemsOrdersForCollectionReturn = Awaited<ReturnType<typeof fetchListItemsOrdersForCollection>>;
type UseListItemsOrdersForCollectionParams = UseCollectionMarketItemsParams;
//#endregion
//#region src/react/hooks/collection/market-items-count.d.ts
type UseCollectionMarketItemsCountParams = Optional<CountItemsOrdersForCollectionQueryOptions, 'config'>;
/**
 * Hook to get the count of orders for a collection
 *
 * Counts the total number of active orders (listings) for all tokens
 * in a collection. Useful for displaying order counts in collection UI.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filter criteria for orders
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of orders
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: orderCount, isLoading } = useCollectionMarketItemsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectionMarketItemsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 *
 * @example
 * Combined with list hook:
 * ```typescript
 * const { data: totalCount } = useCollectionMarketItemsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * const { data: orders } = useListItemsOrdersForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * return <div>Showing {orders?.pages[0]?.listings.length ?? 0} of {totalCount} orders</div>
 * ```
 */
declare function useCollectionMarketItemsCount(params: UseCollectionMarketItemsCountParams): _tanstack_react_query415.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/collection/market-items-paginated.d.ts
type UseCollectionMarketItemsPaginatedParams = Optional<ListItemsOrdersForCollectionPaginatedQueryOptions, 'config'>;
/**
 * Hook to fetch all listings for a collection with pagination support
 *
 * Fetches active listings (sales) for all tokens in a collection from the marketplace
 * with support for filtering and pagination. Unlike the infinite query version,
 * this hook fetches a specific page of results.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of items per page (default: 30)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the specific page
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionMarketItemsPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 1,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useCollectionMarketItemsPaginated({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 2,
 *   pageSize: 50,
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...']
 *   }
 * })
 * ```
 *
 * @example
 * Controlled pagination:
 * ```typescript
 * const [currentPage, setCurrentPage] = useState(1);
 * const { data, isLoading } = useCollectionMarketItemsPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: currentPage,
 *   pageSize: 25
 * });
 *
 * const hasMorePages = data?.page?.more;
 * ```
 */
declare function useCollectionMarketItemsPaginated(params: UseCollectionMarketItemsPaginatedParams): _tanstack_react_query415.UseQueryResult<ListOrdersWithCollectiblesResponse, Error>;
type UseListItemsOrdersForCollectionPaginatedArgs = UseListItemsOrdersForCollectionPaginatedParams;
type UseListItemsOrdersForCollectionPaginatedReturn = Awaited<ReturnType<typeof fetchListItemsOrdersForCollectionPaginated>>;
type UseListItemsOrdersForCollectionPaginatedParams = UseCollectionMarketItemsPaginatedParams;
//#endregion
//#region src/react/hooks/collection/metadata.d.ts
type UseCollectionMetadataParams = WithRequired<CollectionQueryOptions, 'chainId'> & {
  collectionAddress: CollectionQueryOptions['collectionAddress'];
  config?: SdkConfig;
  query?: StandardQueryOptions;
};
/**
 * Hook to fetch collection information from the metadata API
 *
 * Retrieves basic contract information including name, symbol, type,
 * and extension data for a given collection contract.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing contract information
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionMetadata({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectionMetadata({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: userWantsToFetch
 *   }
 * })
 * ```
 */
declare function useCollectionMetadata(params: UseCollectionMetadataParams): _tanstack_react_query415.UseQueryResult<ContractInfo$1$1, Error>;
//#endregion
//#region src/react/queries/collection/activeListingsCurrencies.d.ts
type FetchCollectionActiveListingsCurrenciesParams = Omit<GetCollectionActiveListingsCurrenciesRequest, 'chainId' | 'contractAddress'> & {
  chainId: number;
  collectionAddress: Address$1;
};
type CollectionActiveListingsCurrenciesQueryOptions = SdkQueryParams<FetchCollectionActiveListingsCurrenciesParams>;
declare function collectionActiveListingsCurrenciesQueryOptions(params: WithOptionalParams<WithRequired<CollectionActiveListingsCurrenciesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query415.OmitKeyof<_tanstack_react_query415.UseQueryOptions<Currency[], Error, Currency[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query415.QueryFunction<Currency[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Currency[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/collection/useCollectionActiveListingsCurrencies.d.ts
type UseCollectionActiveListingsCurrenciesParams = Optional<CollectionActiveListingsCurrenciesQueryOptions, 'config'>;
/**
 * Hook to fetch the active listings currencies for a collection
 *
 * Retrieves all currencies that are currently being used in active listings
 * for a specific collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the array of currencies used in active listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveListingsCurrencies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveListingsCurrencies({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: hasCollectionAddress
 *   }
 * })
 * ```
 */
declare function useCollectionActiveListingsCurrencies(params: UseCollectionActiveListingsCurrenciesParams): _tanstack_react_query415.UseQueryResult<Currency[], Error>;
//#endregion
//#region src/react/queries/collection/activeOffersCurrencies.d.ts
type FetchCollectionActiveOffersCurrenciesParams = Omit<GetCollectionActiveOffersCurrenciesRequest, 'chainId' | 'contractAddress'> & {
  chainId: number;
  collectionAddress: Address$1;
};
type CollectionActiveOffersCurrenciesQueryOptions = SdkQueryParams<FetchCollectionActiveOffersCurrenciesParams>;
declare function collectionActiveOffersCurrenciesQueryOptions(params: WithOptionalParams<WithRequired<CollectionActiveOffersCurrenciesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query415.OmitKeyof<_tanstack_react_query415.UseQueryOptions<Currency[], Error, Currency[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query415.QueryFunction<Currency[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Currency[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/collection/useCollectionActiveOffersCurrencies.d.ts
type UseCollectionActiveOffersCurrenciesParams = Optional<CollectionActiveOffersCurrenciesQueryOptions, 'config'>;
/**
 * Hook to fetch the active offers currencies for a collection
 *
 * Retrieves all currencies that are currently being used in active offers
 * for a specific collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the array of currencies used in active offers
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveOffersCurrencies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectionActiveOffersCurrencies({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: hasCollectionAddress
 *   }
 * })
 * ```
 */
declare function useCollectionActiveOffersCurrencies(params: UseCollectionActiveOffersCurrenciesParams): _tanstack_react_query415.UseQueryResult<Currency[], Error>;
//#endregion
export { UseCollectionMarketDetailPollingParams as A, UseListItemsOrdersForCollectionParams as C, useCollectionMarketFloor as D, UseCollectionMarketFloorParams as E, UseCollectionBalanceDetailsArgs as F, UseCollectionBalanceDetailsParams as I, UseCollectionBalanceDetailsReturn as L, useCollectionMarketDetailPolling as M, UseCollectionListParams as N, UseCollectionMarketFilteredCountParams as O, useCollectionList as P, useCollectionBalanceDetails as R, UseListItemsOrdersForCollectionArgs as S, useCollectionMarketItems as T, useCollectionMarketItemsPaginated as _, collectionActiveOffersCurrenciesQueryOptions as a, FetchListItemsOrdersForCollectionParams as b, CollectionActiveListingsCurrenciesQueryOptions as c, UseCollectionMetadataParams as d, useCollectionMetadata as f, UseListItemsOrdersForCollectionPaginatedReturn as g, UseListItemsOrdersForCollectionPaginatedParams as h, FetchCollectionActiveOffersCurrenciesParams as i, collectionMarketDetailPollingOptions as j, useCollectionMarketFilteredCount as k, FetchCollectionActiveListingsCurrenciesParams as l, UseListItemsOrdersForCollectionPaginatedArgs as m, useCollectionActiveOffersCurrencies as n, UseCollectionActiveListingsCurrenciesParams as o, UseCollectionMarketItemsPaginatedParams as p, CollectionActiveOffersCurrenciesQueryOptions as r, useCollectionActiveListingsCurrencies as s, UseCollectionActiveOffersCurrenciesParams as t, collectionActiveListingsCurrenciesQueryOptions as u, UseCollectionMarketItemsCountParams as v, UseListItemsOrdersForCollectionReturn as w, UseCollectionMarketItemsParams as x, useCollectionMarketItemsCount as y };
//# sourceMappingURL=index12.d.ts.map