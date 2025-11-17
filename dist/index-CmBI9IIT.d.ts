import { $ as SdkConfig, Bt as Collection, Gt as ContractType, Lr as ListCollectionActivitiesReturn, et as CardType, f as CollectionFilterSettings, fi as OrderbookKind, j as Optional, tn as Currency } from "./create-config-BA_ne-vj.js";
import { C as CollectionActiveOffersCurrenciesQueryOptions, N as CollectionQueryOptions, O as CollectionActiveListingsCurrenciesQueryOptions, _ as CollectionBalanceDetailsQueryOptions, c as ListCollectionActivitiesQueryOptions, f as CollectionDetailsQueryOptions, l as fetchListCollectionActivities, n as ListCollectionsQueryOptions, v as CollectionBalanceFilter, x as fetchCollectionBalanceDetails } from "./listCollections-DS-iByfM.js";
import * as _tanstack_react_query400 from "@tanstack/react-query";
import * as _0xsequence_indexer3 from "@0xsequence/indexer";
import * as _0xsequence_metadata134 from "@0xsequence/metadata";
import * as viem62 from "viem";

//#region src/react/hooks/data/collections/useCollection.d.ts
type UseCollectionParams = Optional<CollectionQueryOptions, 'config'>;
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
 * const { data, isLoading } = useCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollection({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: userWantsToFetch
 *   }
 * })
 * ```
 */
declare function useCollection(params: UseCollectionParams): _tanstack_react_query400.UseQueryResult<_0xsequence_metadata134.ContractInfo, Error>;
//#endregion
//#region src/react/hooks/data/collections/useCollectionActiveListingsCurrencies.d.ts
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
declare function useCollectionActiveListingsCurrencies(params: UseCollectionActiveListingsCurrenciesParams): _tanstack_react_query400.UseQueryResult<Currency[], Error>;
//#endregion
//#region src/react/hooks/data/collections/useCollectionActiveOffersCurrencies.d.ts
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
declare function useCollectionActiveOffersCurrencies(params: UseCollectionActiveOffersCurrenciesParams): _tanstack_react_query400.UseQueryResult<Currency[], Error>;
//#endregion
//#region src/react/hooks/data/collections/useCollectionBalanceDetails.d.ts
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
declare function useCollectionBalanceDetails(params: UseCollectionBalanceDetailsParams): _tanstack_react_query400.UseQueryResult<_0xsequence_indexer3.GetTokenBalancesDetailsReturn, Error>;
type UseCollectionBalanceDetailsArgs = {
  chainId: number;
  filter: CollectionBalanceFilter;
  query?: {
    enabled?: boolean;
  };
};
type UseCollectionBalanceDetailsReturn = Awaited<ReturnType<typeof fetchCollectionBalanceDetails>>;
//#endregion
//#region src/react/hooks/data/collections/useCollectionDetails.d.ts
type UseCollectionDetailsParams = Optional<CollectionDetailsQueryOptions, 'config'>;
/**
 * Hook to fetch detailed information about a collection
 *
 * This hook retrieves comprehensive metadata and details for an NFT collection,
 * including collection name, description, banner, avatar, social links, stats, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collection details
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collection, isLoading } = useCollectionDetails({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectionDetails({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   query: {
 *     enabled: Boolean(collectionAddress),
 *     staleTime: 60_000
 *   }
 * })
 * ```
 */
declare function useCollectionDetails(params: UseCollectionDetailsParams): _tanstack_react_query400.UseQueryResult<Collection, Error>;
//#endregion
//#region src/react/hooks/data/collections/useCollectionDetailsPolling.d.ts
type UseCollectionDetailsPolling = {
  collectionAddress: string;
  chainId: number;
  query?: {
    enabled?: boolean;
  };
};
declare const collectionDetailsPollingOptions: (args: UseCollectionDetailsPolling, config: SdkConfig) => _tanstack_react_query400.OmitKeyof<_tanstack_react_query400.UseQueryOptions<Collection, Error, Collection, readonly ["collections", "detail", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query400.QueryFunction<Collection, readonly ["collections", "detail", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "detail", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
declare const useCollectionDetailsPolling: (args: UseCollectionDetailsPolling) => _tanstack_react_query400.UseQueryResult<Collection, Error>;
//#endregion
//#region src/react/hooks/data/collections/useListCollectionActivities.d.ts
type UseListCollectionActivitiesParams = Optional<ListCollectionActivitiesQueryOptions, 'config'>;
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
declare function useListCollectionActivities(params: UseListCollectionActivitiesParams): _tanstack_react_query400.UseQueryResult<ListCollectionActivitiesReturn, Error>;
type UseListCollectionActivitiesArgs = UseListCollectionActivitiesParams;
type UseListCollectionActivitiesReturn = Awaited<ReturnType<typeof fetchListCollectionActivities>>;
//#endregion
//#region src/react/hooks/data/collections/useListCollections.d.ts
type UseListCollectionsParams = Optional<ListCollectionsQueryOptions, 'config' | 'marketplaceConfig'>;
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
 * const { data: marketCollections } = useListCollections({
 *   marketplaceType: 'market'
 * });
 * ```
 */
declare function useListCollections(params?: UseListCollectionsParams): _tanstack_react_query400.UseQueryResult<({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata134.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata134.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem62.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata134.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata134.ResourceStatus;
  cardType: CardType;
  saleAddress: viem62.Address;
  bannerUrl: string;
  itemsAddress: viem62.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], Error>;
//#endregion
export { UseCollectionActiveListingsCurrenciesParams as _, UseListCollectionActivitiesReturn as a, useCollection as b, useCollectionDetailsPolling as c, UseCollectionBalanceDetailsArgs as d, UseCollectionBalanceDetailsParams as f, useCollectionActiveOffersCurrencies as g, UseCollectionActiveOffersCurrenciesParams as h, UseListCollectionActivitiesParams as i, UseCollectionDetailsParams as l, useCollectionBalanceDetails as m, useListCollections as n, useListCollectionActivities as o, UseCollectionBalanceDetailsReturn as p, UseListCollectionActivitiesArgs as r, collectionDetailsPollingOptions as s, UseListCollectionsParams as t, useCollectionDetails as u, useCollectionActiveListingsCurrencies as v, UseCollectionParams as y };
//# sourceMappingURL=index-CmBI9IIT.d.ts.map