import { CollectibleOrder, ListCollectibleListingsReturn, ListCollectibleOffersReturn, ListOrdersWithCollectiblesReturn, Optional, Order } from "./create-config-CsagtMvq.js";
import { CountItemsOrdersForCollectionQueryOptions, CountListingsForCollectibleQueryOptions, CountOffersForCollectibleQueryOptions, FloorOrderQueryOptions, GetCountOfFilteredOrdersQueryOptions, HighestOfferQueryOptions, ListItemsOrdersForCollectionPaginatedQueryOptions, ListItemsOrdersForCollectionQueryOptions, ListListingsForCollectibleQueryOptions, ListOffersForCollectibleQueryOptions, LowestListingQueryOptions, fetchListItemsOrdersForCollection$1 as fetchListItemsOrdersForCollection, fetchListItemsOrdersForCollectionPaginated$1 as fetchListItemsOrdersForCollectionPaginated, fetchListListingsForCollectible$1 as fetchListListingsForCollectible } from "./lowestListing-Do-4GZ10.js";
import * as _tanstack_react_query411 from "@tanstack/react-query";
import * as _tanstack_react_query412 from "@tanstack/react-query";
import * as _tanstack_react_query413 from "@tanstack/react-query";
import * as _tanstack_react_query414 from "@tanstack/react-query";
import * as _tanstack_react_query415 from "@tanstack/react-query";
import * as _tanstack_react_query416 from "@tanstack/react-query";
import * as _tanstack_react_query417 from "@tanstack/react-query";
import * as _tanstack_react_query419 from "@tanstack/react-query";
import * as _tanstack_react_query420 from "@tanstack/react-query";
import * as _tanstack_react_query421 from "@tanstack/react-query";
import * as _tanstack_react_query410 from "@tanstack/react-query";

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
declare function useCountItemsOrdersForCollection(params: UseCountItemsOrdersForCollectionParams): _tanstack_react_query411.UseQueryResult<number, Error>;
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
declare function useCountListingsForCollectible(params: UseCountListingsForCollectibleParams): _tanstack_react_query412.UseQueryResult<number, Error>;
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
declare function useCountOffersForCollectible(params: UseCountOffersForCollectibleParams): _tanstack_react_query413.UseQueryResult<number, Error>;
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
declare function useFloorOrder(params: UseFloorOrderParams): _tanstack_react_query414.UseQueryResult<CollectibleOrder, Error>;
//#endregion
//#region src/react/hooks/data/orders/useGetCountOfFilteredOrders.d.ts
type UseGetCountOfFilteredOrdersParams = Optional<GetCountOfFilteredOrdersQueryOptions, 'config'>;
declare function useGetCountOfFilteredOrders(params: UseGetCountOfFilteredOrdersParams): _tanstack_react_query415.UseQueryResult<number, Error>;
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
declare function useHighestOffer(params: UseHighestOfferParams): _tanstack_react_query416.UseQueryResult<Order | null, Error>;
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
declare function useListItemsOrdersForCollection(params: UseListItemsOrdersForCollectionParams): _tanstack_react_query417.UseInfiniteQueryResult<_tanstack_react_query417.InfiniteData<ListOrdersWithCollectiblesReturn, unknown>, Error>;
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
declare function useListItemsOrdersForCollectionPaginated(params: UseListItemsOrdersForCollectionPaginatedParams): _tanstack_react_query419.UseQueryResult<ListOrdersWithCollectiblesReturn, Error>;
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
declare function useListListingsForCollectible(params: UseListListingsForCollectibleParams): _tanstack_react_query420.UseQueryResult<ListCollectibleListingsReturn, Error>;
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
declare function useListOffersForCollectible(params: UseListOffersForCollectibleParams): _tanstack_react_query421.UseQueryResult<ListCollectibleOffersReturn, Error>;
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
declare function useLowestListing(params: UseLowestListingParams): _tanstack_react_query410.UseQueryResult<Order | null | undefined, Error>;
//#endregion
export { UseCountItemsOrdersForCollectionParams, UseCountListingsForCollectibleParams, UseCountOffersForCollectibleParams, UseFloorOrderParams, UseGetCountOfFilteredOrdersParams, UseHighestOfferParams, UseListItemsOrdersForCollectionArgs, UseListItemsOrdersForCollectionPaginatedArgs, UseListItemsOrdersForCollectionPaginatedParams, UseListItemsOrdersForCollectionPaginatedReturn, UseListItemsOrdersForCollectionParams, UseListItemsOrdersForCollectionReturn, UseListListingsForCollectibleArgs, UseListListingsForCollectibleParams, UseListListingsForCollectibleReturn, UseListOffersForCollectibleArgs, UseListOffersForCollectibleParams, UseLowestListingParams, useCountItemsOrdersForCollection as useCountItemsOrdersForCollection$1, useCountListingsForCollectible as useCountListingsForCollectible$1, useCountOffersForCollectible as useCountOffersForCollectible$1, useFloorOrder as useFloorOrder$1, useGetCountOfFilteredOrders as useGetCountOfFilteredOrders$1, useHighestOffer as useHighestOffer$1, useListItemsOrdersForCollection as useListItemsOrdersForCollection$1, useListItemsOrdersForCollectionPaginated as useListItemsOrdersForCollectionPaginated$1, useListListingsForCollectible as useListListingsForCollectible$1, useListOffersForCollectible as useListOffersForCollectible$1, useLowestListing as useLowestListing$1 };
//# sourceMappingURL=index-i0-DmhfX.d.ts.map