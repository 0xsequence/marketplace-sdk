import { Tr as ListCollectibleActivitiesReturn, j as Optional, jr as ListCollectiblesReturn } from "./create-config-nZqvb8A7.js";
import { E as UseBalanceOfCollectibleArgs, f as ListCollectibleActivitiesQueryOptions, g as CountOfCollectablesQueryOptions, n as ListCollectiblesPaginatedQueryOptions, p as fetchListCollectibleActivities, r as fetchListCollectiblesPaginated, s as ListCollectiblesQueryOptions, x as CollectibleQueryOptions } from "./listCollectiblesPaginated-DNV3zRQn.js";
import * as _tanstack_react_query58 from "@tanstack/react-query";
import * as _0xsequence_metadata9 from "@0xsequence/metadata";
import * as xtrails0 from "xtrails";

//#region src/react/hooks/data/collectibles/useBalanceOfCollectible.d.ts

/**
 * Hook to fetch the balance of a specific collectible for a user
 *
 * @param args - The arguments for fetching the balance
 * @returns Query result containing the balance data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBalanceOfCollectible({
 *   collectionAddress: '0x123...',
 *   collectableId: '1',
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useBalanceOfCollectible(args: UseBalanceOfCollectibleArgs): _tanstack_react_query58.UseQueryResult<xtrails0.TokenBalance, Error>;
//#endregion
//#region src/react/hooks/data/collectibles/useCollectible.d.ts
type UseCollectibleParams = Optional<CollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch metadata for a specific collectible
 *
 * This hook retrieves metadata for an individual NFT from a collection,
 * including properties like name, description, image, attributes, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The token ID of the collectible
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collectible metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collectible, isLoading } = useCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   collectibleId: '12345'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   collectibleId: '12345',
 *   query: {
 *     enabled: Boolean(collectionAddress && tokenId),
 *     staleTime: 30_000
 *   }
 * })
 * ```
 */
declare function useCollectible(params: UseCollectibleParams): _tanstack_react_query58.UseQueryResult<_0xsequence_metadata9.TokenMetadata, Error>;
//#endregion
//#region src/react/hooks/data/collectibles/useCountOfCollectables.d.ts
type UseCountOfCollectablesParams = Optional<CountOfCollectablesQueryOptions, 'config'>;
/**
 * Hook to get the count of collectibles in a market collection
 *
 * Counts either all collectibles or filtered collectibles based on provided parameters.
 * When filter and side parameters are provided, returns count of filtered collectibles.
 * Otherwise returns count of all collectibles in the collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filter criteria for collectibles
 * @param params.side - Optional order side (BUY/SELL) when using filters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of collectibles
 *
 * @example
 * Basic usage (count all collectibles):
 * ```typescript
 * const { data: totalCount, isLoading } = useCountOfCollectables({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filters (count filtered collectibles):
 * ```typescript
 * const { data: filteredCount } = useCountOfCollectables({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: { priceRange: { min: '1000000000000000000' } },
 *   side: OrderSide.SELL
 * })
 * ```
 */
declare function useCountOfCollectables(params: UseCountOfCollectablesParams): _tanstack_react_query58.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/data/collectibles/useListCollectibleActivities.d.ts
type UseListCollectibleActivitiesParams = Optional<ListCollectibleActivitiesQueryOptions, 'config'>;
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
declare function useListCollectibleActivities(params: UseListCollectibleActivitiesParams): _tanstack_react_query58.UseQueryResult<ListCollectibleActivitiesReturn, Error>;
type UseListCollectibleActivitiesArgs = UseListCollectibleActivitiesParams;
type UseListCollectibleActivitiesReturn = Awaited<ReturnType<typeof fetchListCollectibleActivities>>;
//#endregion
//#region src/react/hooks/data/collectibles/useListCollectibles.d.ts
type UseListCollectiblesParams = Optional<ListCollectiblesQueryOptions, 'config'>;
/**
 * Hook to fetch a list of collectibles with infinite pagination support
 *
 * Fetches collectibles from the marketplace with support for filtering, pagination,
 * and special handling for shop marketplace types.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters
 * @param params.marketplaceType - Type of marketplace (shop, etc.)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing collectibles data with pagination
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useListCollectibles({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useListCollectibles({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   filter: {
 *     searchText: 'dragon',
 *     includeEmpty: false,
 *     marketplaces: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
declare function useListCollectibles(params: UseListCollectiblesParams): _tanstack_react_query58.UseInfiniteQueryResult<_tanstack_react_query58.InfiniteData<ListCollectiblesReturn, unknown>, Error>;
type UseListCollectiblesArgs = UseListCollectiblesParams;
//#endregion
//#region src/react/hooks/data/collectibles/useListCollectiblesPaginated.d.ts
type UseListCollectiblesPaginatedParams = Optional<ListCollectiblesPaginatedQueryOptions, 'config'>;
/**
 * Hook to fetch a list of collectibles with pagination support
 *
 * Fetches collectibles from the marketplace with support for filtering and pagination.
 * Unlike the infinite query version, this hook fetches a specific page of results.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of items per page (default: 30)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing collectibles data for the specific page
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListCollectiblesPaginated({
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
 * const { data } = useListCollectiblesPaginated({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 2,
 *   pageSize: 50,
 *   filter: {
 *     searchText: 'rare',
 *     includeEmpty: false
 *   }
 * })
 * ```
 *
 * @example
 * Controlled pagination:
 * ```typescript
 * const [currentPage, setCurrentPage] = useState(1);
 * const { data, isLoading } = useListCollectiblesPaginated({
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
declare function useListCollectiblesPaginated(params: UseListCollectiblesPaginatedParams): _tanstack_react_query58.UseQueryResult<ListCollectiblesReturn, Error>;
type UseListCollectiblesPaginatedArgs = UseListCollectiblesPaginatedParams;
type UseListCollectiblesPaginatedReturn = Awaited<ReturnType<typeof fetchListCollectiblesPaginated>>;
//#endregion
export { UseListCollectiblesArgs as a, UseListCollectibleActivitiesArgs as c, useListCollectibleActivities as d, UseCountOfCollectablesParams as f, useBalanceOfCollectible as g, useCollectible as h, useListCollectiblesPaginated as i, UseListCollectibleActivitiesParams as l, UseCollectibleParams as m, UseListCollectiblesPaginatedParams as n, UseListCollectiblesParams as o, useCountOfCollectables as p, UseListCollectiblesPaginatedReturn as r, useListCollectibles as s, UseListCollectiblesPaginatedArgs as t, UseListCollectibleActivitiesReturn as u };
//# sourceMappingURL=index-3NTiQTCQ.d.ts.map