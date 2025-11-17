import { Dr as ListCollectibleListingsReturn, Ft as CollectibleOrder, Zr as ListOrdersWithCollectiblesReturn, j as Optional, kr as ListCollectibleOffersReturn, si as Order } from "./create-config-CrbgqkBr.js";
import { B as CountOffersForCollectibleQueryOptions, E as HighestOfferQueryOptions, G as CountListingsForCollectibleQueryOptions, I as FloorOrderQueryOptions, S as fetchListItemsOrdersForCollection, X as CountItemsOrdersForCollectionQueryOptions, _ as ListItemsOrdersForCollectionPaginatedQueryOptions, f as ListListingsForCollectibleQueryOptions, j as GetCountOfFilteredOrdersQueryOptions, n as LowestListingQueryOptions, p as fetchListListingsForCollectible, s as ListOffersForCollectibleQueryOptions, v as fetchListItemsOrdersForCollectionPaginated, x as ListItemsOrdersForCollectionQueryOptions } from "./lowestListing-DjbXa9p_.js";
import * as _tanstack_react_query376 from "@tanstack/react-query";

//#region src/react/hooks/data/orders/useCountItemsOrdersForCollection.d.ts
type UseCountItemsOrdersForCollectionParams = Optional<CountItemsOrdersForCollectionQueryOptions, 'config'>;
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
 * const { data: orderCount, isLoading } = useCountItemsOrdersForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCountItemsOrdersForCollection({
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
 * const { data: totalCount } = useCountItemsOrdersForCollection({
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
declare function useCountItemsOrdersForCollection(params: UseCountItemsOrdersForCollectionParams): _tanstack_react_query376.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/data/orders/useCountListingsForCollectible.d.ts
type UseCountListingsForCollectibleParams = Optional<CountListingsForCollectibleQueryOptions, 'config'>;
/**
 * Hook to get the count of listings for a specific collectible
 *
 * Counts the number of active listings for a given collectible in the marketplace.
 * Useful for displaying listing counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for listings
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: listingCount, isLoading } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCountListingsForCollectible(params: UseCountListingsForCollectibleParams): _tanstack_react_query376.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/data/orders/useCountOffersForCollectible.d.ts
type UseCountOffersForCollectibleParams = Optional<CountOffersForCollectibleQueryOptions, 'config'>;
/**
 * Hook to get the count of offers for a specific collectible
 *
 * Counts the number of active offers for a given collectible in the marketplace.
 * Useful for displaying offer counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for offers
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of offers
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: offerCount, isLoading } = useCountOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCountOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCountOffersForCollectible(params: UseCountOffersForCollectibleParams): _tanstack_react_query376.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/data/orders/useFloorOrder.d.ts
type UseFloorOrderParams = Optional<FloorOrderQueryOptions, 'config'>;
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
 * const { data, isLoading } = useFloorOrder({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filters and custom query options:
 * ```typescript
 * const { data, isLoading } = useFloorOrder({
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
declare function useFloorOrder(params: UseFloorOrderParams): _tanstack_react_query376.UseQueryResult<CollectibleOrder, Error>;
//#endregion
//#region src/react/hooks/data/orders/useGetCountOfFilteredOrders.d.ts
type UseGetCountOfFilteredOrdersParams = Optional<GetCountOfFilteredOrdersQueryOptions, 'config'>;
declare function useGetCountOfFilteredOrders(params: UseGetCountOfFilteredOrdersParams): _tanstack_react_query376.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/data/orders/useHighestOffer.d.ts
type UseHighestOfferParams = Optional<HighestOfferQueryOptions, 'config'>;
/**
 * Hook to fetch the highest offer for a collectible
 *
 * Retrieves the highest offer currently available for a specific token
 * in a collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The token ID within the collection
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the highest offer data or null if no offers exist
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useHighestOffer({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useHighestOffer({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     refetchInterval: 15000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
declare function useHighestOffer(params: UseHighestOfferParams): _tanstack_react_query376.UseQueryResult<Order | null, Error>;
//#endregion
//#region src/react/hooks/data/orders/useListItemsOrdersForCollection.d.ts
type UseListItemsOrdersForCollectionParams = Optional<ListItemsOrdersForCollectionQueryOptions, 'config'>;
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
 * const { data, isLoading, fetchNextPage, hasNextPage } = useListItemsOrdersForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useListItemsOrdersForCollection({
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
 * const { data } = useListItemsOrdersForCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 *
 * const allListings = data?.pages.flatMap(page => page.listings) ?? []
 * ```
 */
declare function useListItemsOrdersForCollection(params: UseListItemsOrdersForCollectionParams): _tanstack_react_query376.UseInfiniteQueryResult<_tanstack_react_query376.InfiniteData<ListOrdersWithCollectiblesReturn, unknown>, Error>;
type UseListItemsOrdersForCollectionArgs = UseListItemsOrdersForCollectionParams;
type UseListItemsOrdersForCollectionReturn = Awaited<ReturnType<typeof fetchListItemsOrdersForCollection>>;
//#endregion
//#region src/react/hooks/data/orders/useListItemsOrdersForCollectionPaginated.d.ts
type UseListItemsOrdersForCollectionPaginatedParams = Optional<ListItemsOrdersForCollectionPaginatedQueryOptions, 'config'>;
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
 * const { data, isLoading } = useListItemsOrdersForCollectionPaginated({
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
 * const { data } = useListItemsOrdersForCollectionPaginated({
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
 * const { data, isLoading } = useListItemsOrdersForCollectionPaginated({
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
declare function useListItemsOrdersForCollectionPaginated(params: UseListItemsOrdersForCollectionPaginatedParams): _tanstack_react_query376.UseQueryResult<ListOrdersWithCollectiblesReturn, Error>;
type UseListItemsOrdersForCollectionPaginatedArgs = UseListItemsOrdersForCollectionPaginatedParams;
type UseListItemsOrdersForCollectionPaginatedReturn = Awaited<ReturnType<typeof fetchListItemsOrdersForCollectionPaginated>>;
//#endregion
//#region src/react/hooks/data/orders/useListListingsForCollectible.d.ts
type UseListListingsForCollectibleParams = Optional<ListListingsForCollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch listings for a specific collectible
 *
 * Fetches active listings (sales) for a specific token from the marketplace
 * with support for filtering and pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific token ID to fetch listings for
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the collectible
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListListingsForCollectible({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '456',
 *   page: {
 *     page: 2,
 *     pageSize: 20
 *   }
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '789',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Specific currency addresses
 *   }
 * })
 * ```
 */
declare function useListListingsForCollectible(params: UseListListingsForCollectibleParams): _tanstack_react_query376.UseQueryResult<ListCollectibleListingsReturn, Error>;
type UseListListingsForCollectibleArgs = UseListListingsForCollectibleParams;
type UseListListingsForCollectibleReturn = Awaited<ReturnType<typeof fetchListListingsForCollectible>>;
//#endregion
//#region src/react/hooks/data/orders/useListOffersForCollectible.d.ts
type UseListOffersForCollectibleParams = Optional<ListOffersForCollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch offers for a specific collectible
 *
 * Fetches offers for a specific collectible from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific collectible ID to fetch offers for
 * @param params.filter - Optional filtering parameters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing offers data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '1'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useListOffersForCollectible({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '1',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
declare function useListOffersForCollectible(params: UseListOffersForCollectibleParams): _tanstack_react_query376.UseQueryResult<ListCollectibleOffersReturn, Error>;
type UseListOffersForCollectibleArgs = UseListOffersForCollectibleParams;
//#endregion
//#region src/react/hooks/data/orders/useLowestListing.d.ts
type UseLowestListingParams = Optional<LowestListingQueryOptions, 'config'>;
/**
 * Hook to fetch the lowest listing for a collectible
 *
 * Retrieves the lowest priced listing currently available for a specific token
 * in a collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The token ID within the collection
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the lowest listing data or null if no listings exist
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useLowestListing({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useLowestListing({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     refetchInterval: 15000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
declare function useLowestListing(params: UseLowestListingParams): _tanstack_react_query376.UseQueryResult<Order | null | undefined, Error>;
//#endregion
export { useFloorOrder as C, useCountListingsForCollectible as D, UseCountListingsForCollectibleParams as E, UseCountItemsOrdersForCollectionParams as O, UseFloorOrderParams as S, useCountOffersForCollectible as T, useListItemsOrdersForCollection as _, useListOffersForCollectible as a, UseGetCountOfFilteredOrdersParams as b, UseListListingsForCollectibleReturn as c, UseListItemsOrdersForCollectionPaginatedParams as d, UseListItemsOrdersForCollectionPaginatedReturn as f, UseListItemsOrdersForCollectionReturn as g, UseListItemsOrdersForCollectionParams as h, UseListOffersForCollectibleParams as i, useCountItemsOrdersForCollection as k, useListListingsForCollectible as l, UseListItemsOrdersForCollectionArgs as m, useLowestListing as n, UseListListingsForCollectibleArgs as o, useListItemsOrdersForCollectionPaginated as p, UseListOffersForCollectibleArgs as r, UseListListingsForCollectibleParams as s, UseLowestListingParams as t, UseListItemsOrdersForCollectionPaginatedArgs as u, UseHighestOfferParams as v, UseCountOffersForCollectibleParams as w, useGetCountOfFilteredOrders as x, useHighestOffer as y };
//# sourceMappingURL=index-DkNcfZFc.d.ts.map