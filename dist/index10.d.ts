import { Dn as WithRequired, Fn as WithOptionalParams, _ as SdkConfig, _n as Optional, xn as SdkQueryParams } from "./create-config.js";
import { A as ListCollectionActivitiesQueryOptions, B as CollectionBalanceDetailsQueryOptions, E as GetCountOfFilteredOrdersQueryOptions, F as ListCollectionsQueryOptions, V as CollectionBalanceFilter, W as fetchCollectionBalanceDetails, _ as ListItemsOrdersForCollectionQueryOptions, c as fetchListItemsOrdersForCollectionPaginated, d as CountItemsOrdersForCollectionQueryOptions, j as fetchListCollectionActivities, s as ListItemsOrdersForCollectionPaginatedQueryOptions, t as CollectionQueryOptions, v as fetchListItemsOrdersForCollection, x as FloorOrderQueryOptions } from "./metadata.js";
import * as _0xsequence_api_client319 from "@0xsequence/api-client";
import { Address, Currency } from "@0xsequence/api-client";
import * as _tanstack_react_query412 from "@tanstack/react-query";
import * as _0xsequence_indexer9 from "@0xsequence/indexer";

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
declare function useCollectionBalanceDetails(params: UseCollectionBalanceDetailsParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.GetTokenBalancesDetailsResponse, Error>;
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
declare function useCollectionList(params?: UseCollectionListParams): _tanstack_react_query412.UseQueryResult<({
  chainId: _0xsequence_api_client319.ChainId;
  address: _0xsequence_api_client319.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client319.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: _0xsequence_indexer9.ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: _0xsequence_api_client319.OrderbookKind;
  filterSettings?: _0xsequence_api_client319.CollectionFilterSettings;
  id: number;
  projectId: _0xsequence_api_client319.ProjectId;
  itemsAddress: _0xsequence_api_client319.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: _0xsequence_api_client319.ChainId;
  address: _0xsequence_api_client319.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client319.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: _0xsequence_api_client319.Address;
  tokenIds: _0xsequence_api_client319.TokenId[];
  customTokenIds: _0xsequence_api_client319.TokenId[];
  id: number;
  projectId: _0xsequence_api_client319.ProjectId;
  itemsAddress: _0xsequence_api_client319.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], Error>;
//#endregion
//#region src/react/hooks/collection/market-activities.d.ts
type UseCollectionMarketActivitiesParams = Optional<ListCollectionActivitiesQueryOptions, 'config'>;
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
declare function useCollectionMarketActivities(params: UseCollectionMarketActivitiesParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.ListCollectionActivitiesResponse, Error>;
type UseListCollectionActivitiesRequest = UseListCollectionActivitiesParams;
type UseListCollectionActivitiesResponse = Awaited<ReturnType<typeof fetchListCollectionActivities>>;
type UseListCollectionActivitiesParams = UseCollectionMarketActivitiesParams;
//#endregion
//#region src/react/hooks/collection/market-detail-polling.d.ts
type UseCollectionMarketDetailPollingParams = {
  collectionAddress: Address;
  chainId: number;
  query?: {
    enabled?: boolean;
  };
};
declare const collectionMarketDetailPollingOptions: (args: UseCollectionMarketDetailPollingParams, config: SdkConfig) => _tanstack_react_query412.OmitKeyof<_tanstack_react_query412.UseQueryOptions<_0xsequence_api_client319.Collection, Error, _0xsequence_api_client319.Collection, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query412.QueryFunction<_0xsequence_api_client319.Collection, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _0xsequence_api_client319.Collection;
    [dataTagErrorSymbol]: Error;
  };
};
declare const useCollectionMarketDetailPolling: (args: UseCollectionMarketDetailPollingParams) => _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.Collection, Error>;
//#endregion
//#region src/react/hooks/collection/market-filtered-count.d.ts
type UseCollectionMarketFilteredCountParams = Optional<GetCountOfFilteredOrdersQueryOptions, 'config'>;
declare function useCollectionMarketFilteredCount(params: UseCollectionMarketFilteredCountParams): _tanstack_react_query412.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/collection/market-floor.d.ts
type UseCollectionMarketFloorParams = Optional<FloorOrderQueryOptions, 'config'>;
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
declare function useCollectionMarketFloor(params: UseCollectionMarketFloorParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.CollectibleOrder, Error>;
//#endregion
//#region src/react/hooks/collection/market-items.d.ts
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
declare function useCollectionMarketItems(params: UseCollectionMarketItemsParams): _tanstack_react_query412.UseInfiniteQueryResult<_tanstack_react_query412.InfiniteData<_0xsequence_api_client319.ListOrdersWithCollectiblesResponse, unknown>, Error>;
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
declare function useCollectionMarketItemsCount(params: UseCollectionMarketItemsCountParams): _tanstack_react_query412.UseQueryResult<number, Error>;
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
declare function useCollectionMarketItemsPaginated(params: UseCollectionMarketItemsPaginatedParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.ListOrdersWithCollectiblesResponse, Error>;
type UseListItemsOrdersForCollectionPaginatedArgs = UseListItemsOrdersForCollectionPaginatedParams;
type UseListItemsOrdersForCollectionPaginatedReturn = Awaited<ReturnType<typeof fetchListItemsOrdersForCollectionPaginated>>;
type UseListItemsOrdersForCollectionPaginatedParams = UseCollectionMarketItemsPaginatedParams;
//#endregion
//#region src/react/hooks/collection/metadata.d.ts
type UseCollectionMetadataParams = Optional<CollectionQueryOptions, 'config'>;
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
declare function useCollectionMetadata(params: UseCollectionMetadataParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.ContractInfo, Error>;
//#endregion
//#region src/react/queries/collection/activeListingsCurrencies.d.ts
interface FetchCollectionActiveListingsCurrenciesParams {
  chainId: number;
  collectionAddress: string;
}
type CollectionActiveListingsCurrenciesQueryOptions = SdkQueryParams<FetchCollectionActiveListingsCurrenciesParams>;
declare function collectionActiveListingsCurrenciesQueryOptions(params: WithOptionalParams<WithRequired<CollectionActiveListingsCurrenciesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query412.OmitKeyof<_tanstack_react_query412.UseQueryOptions<Currency[], Error, Currency[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query412.QueryFunction<Currency[], readonly unknown[], never> | undefined;
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
declare function useCollectionActiveListingsCurrencies(params: UseCollectionActiveListingsCurrenciesParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.Currency[], Error>;
//#endregion
//#region src/react/queries/collection/activeOffersCurrencies.d.ts
interface FetchCollectionActiveOffersCurrenciesParams {
  chainId: number;
  collectionAddress: string;
}
type CollectionActiveOffersCurrenciesQueryOptions = SdkQueryParams<FetchCollectionActiveOffersCurrenciesParams>;
declare function collectionActiveOffersCurrenciesQueryOptions(params: WithOptionalParams<WithRequired<CollectionActiveOffersCurrenciesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query412.OmitKeyof<_tanstack_react_query412.UseQueryOptions<Currency[], Error, Currency[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query412.QueryFunction<Currency[], readonly unknown[], never> | undefined;
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
declare function useCollectionActiveOffersCurrencies(params: UseCollectionActiveOffersCurrenciesParams): _tanstack_react_query412.UseQueryResult<_0xsequence_api_client319.Currency[], Error>;
//#endregion
export { collectionMarketDetailPollingOptions as A, UseCollectionBalanceDetailsParams as B, UseListItemsOrdersForCollectionReturn as C, UseCollectionMarketFilteredCountParams as D, useCollectionMarketFloor as E, UseListCollectionActivitiesResponse as F, useCollectionBalanceDetails as H, useCollectionMarketActivities as I, UseCollectionListParams as L, UseCollectionMarketActivitiesParams as M, UseListCollectionActivitiesParams as N, useCollectionMarketFilteredCount as O, UseListCollectionActivitiesRequest as P, useCollectionList as R, UseListItemsOrdersForCollectionParams as S, UseCollectionMarketFloorParams as T, UseCollectionBalanceDetailsReturn as V, useCollectionMarketItemsPaginated as _, collectionActiveOffersCurrenciesQueryOptions as a, UseCollectionMarketItemsParams as b, CollectionActiveListingsCurrenciesQueryOptions as c, UseCollectionMetadataParams as d, useCollectionMetadata as f, UseListItemsOrdersForCollectionPaginatedReturn as g, UseListItemsOrdersForCollectionPaginatedParams as h, FetchCollectionActiveOffersCurrenciesParams as i, useCollectionMarketDetailPolling as j, UseCollectionMarketDetailPollingParams as k, FetchCollectionActiveListingsCurrenciesParams as l, UseListItemsOrdersForCollectionPaginatedArgs as m, useCollectionActiveOffersCurrencies as n, UseCollectionActiveListingsCurrenciesParams as o, UseCollectionMarketItemsPaginatedParams as p, CollectionActiveOffersCurrenciesQueryOptions as r, useCollectionActiveListingsCurrencies as s, UseCollectionActiveOffersCurrenciesParams as t, collectionActiveListingsCurrenciesQueryOptions as u, UseCollectionMarketItemsCountParams as v, useCollectionMarketItems as w, UseListItemsOrdersForCollectionArgs as x, useCollectionMarketItemsCount as y, UseCollectionBalanceDetailsArgs as z };
//# sourceMappingURL=index10.d.ts.map