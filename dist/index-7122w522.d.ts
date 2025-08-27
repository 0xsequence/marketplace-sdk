import { CollectibleOrder, ListCollectibleListingsReturn, ListCollectibleOffersReturn, Optional, Order, OrderFilter, Page, SdkConfig } from "./create-config-Cg2OSDO8.js";
import { CountListingsForCollectibleQueryOptions, CountOffersForCollectibleQueryOptions, FloorOrderQueryOptions, HighestOfferQueryOptions, ListListingsForCollectibleQueryOptions, LowestListingQueryOptions, fetchListListingsForCollectible } from "./lowestListing-BjoG8JTn.js";
import * as _tanstack_react_query153 from "@tanstack/react-query";

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
declare function useCountListingsForCollectible(params: UseCountListingsForCollectibleParams): _tanstack_react_query153.UseQueryResult<number, Error>;
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
declare function useCountOffersForCollectible(params: UseCountOffersForCollectibleParams): _tanstack_react_query153.UseQueryResult<number, Error>;
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
declare function useFloorOrder(params: UseFloorOrderParams): _tanstack_react_query153.UseQueryResult<CollectibleOrder, Error>;
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
declare function useHighestOffer(params: UseHighestOfferParams): _tanstack_react_query153.UseQueryResult<Order | null, Error>;
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
declare function useListListingsForCollectible(params: UseListListingsForCollectibleParams): _tanstack_react_query153.UseQueryResult<ListCollectibleListingsReturn, Error>;
type UseListListingsForCollectibleArgs = UseListListingsForCollectibleParams;
type UseListListingsForCollectibleReturn = Awaited<ReturnType<typeof fetchListListingsForCollectible>>;
//#endregion
//#region src/react/hooks/data/orders/useListOffersForCollectible.d.ts
interface UseListOffersForCollectibleArgs {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  filter?: OrderFilter;
  page?: Page;
}
type UseListOffersForCollectibleReturn = Awaited<ReturnType<typeof fetchListOffersForCollectible>>;
declare const fetchListOffersForCollectible: (config: SdkConfig, args: UseListOffersForCollectibleArgs) => Promise<ListCollectibleOffersReturn>;
declare const listOffersForCollectibleOptions: (args: UseListOffersForCollectibleArgs, config: SdkConfig) => _tanstack_react_query153.OmitKeyof<_tanstack_react_query153.UseQueryOptions<ListCollectibleOffersReturn, Error, ListCollectibleOffersReturn, (SdkConfig | "collectable" | UseListOffersForCollectibleArgs | "offers")[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query153.QueryFunction<ListCollectibleOffersReturn, (SdkConfig | "collectable" | UseListOffersForCollectibleArgs | "offers")[], never> | undefined;
} & {
  queryKey: (SdkConfig | "collectable" | UseListOffersForCollectibleArgs | "offers")[] & {
    [dataTagSymbol]: ListCollectibleOffersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
declare const useListOffersForCollectible: (args: UseListOffersForCollectibleArgs) => _tanstack_react_query153.UseQueryResult<ListCollectibleOffersReturn, Error>;
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
declare function useLowestListing(params: UseLowestListingParams): _tanstack_react_query153.UseQueryResult<Order | null | undefined, Error>;
//#endregion
export { UseCountListingsForCollectibleParams, UseCountOffersForCollectibleParams, UseFloorOrderParams, UseHighestOfferParams, UseListListingsForCollectibleArgs, UseListListingsForCollectibleParams, UseListListingsForCollectibleReturn, UseListOffersForCollectibleReturn, UseLowestListingParams, listOffersForCollectibleOptions, useCountListingsForCollectible, useCountOffersForCollectible, useFloorOrder, useHighestOffer, useListListingsForCollectible, useListOffersForCollectible, useLowestListing };
//# sourceMappingURL=index-7122w522.d.ts.map