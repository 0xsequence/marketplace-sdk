import { _n as Optional } from "./create-config.js";
import { A as ListOffersForCollectibleQueryOptions, J as ListCollectiblesPaginatedQueryOptions, P as LowestListingQueryOptions, Q as ListCollectiblesQueryOptions, R as CountListingsForCollectibleQueryOptions, T as CountOffersForCollectibleQueryOptions, U as ListListingsForCollectibleQueryOptions, W as fetchListListingsForCollectible, Y as fetchListCollectiblesPaginated, b as CollectibleQueryOptions, dt as ListCollectibleActivitiesQueryOptions, ft as fetchListCollectibleActivities, g as PrimarySaleItemQueryOptions, ht as BalanceOfCollectibleQueryOptions, n as TokenBalancesQueryOptions, nt as HighestOfferQueryOptions, ot as CountOfCollectablesQueryOptions, s as ListPrimarySaleItemsQueryOptions } from "./token-balances.js";
import * as _0xsequence_api_client308 from "@0xsequence/api-client";
import { Order } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query396 from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";

//#region src/react/hooks/collectible/balance.d.ts

/**
 * Hook to fetch the balance of a specific collectible for a user
 *
 * @param args - The arguments for fetching the balance
 * @returns Query result containing the balance data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCollectibleBalance({
 *   collectionAddress: '0x123...',
 *   tokenId: 1n,
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useCollectibleBalance(args: Omit<BalanceOfCollectibleQueryOptions, 'config'>): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.IndexerTokenBalance, Error>;
//#endregion
//#region src/react/hooks/collectible/erc721-sale-details.d.ts
interface UseErc721CollectionDataProps {
  chainId: number;
  salesContractAddress: Address$1;
  itemsContractAddress: Address$1;
  enabled?: boolean;
}
declare function useErc721SaleDetails({
  chainId,
  salesContractAddress,
  itemsContractAddress,
  enabled
}: UseErc721CollectionDataProps): {
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | {
    remainingSupply: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
  quantityMinted: bigint | undefined;
  quantityTotal: bigint | undefined;
  quantityRemaining: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
};
//#endregion
//#region src/react/hooks/collectible/market-activities.d.ts
type UseCollectibleMarketActivitiesParams = Optional<ListCollectibleActivitiesQueryOptions, 'config'>;
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
 * const { data, isLoading } = useCollectibleMarketActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useCollectibleMarketActivities({
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
 * const { data } = useCollectibleMarketActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '789',
 *   sort: 'timestamp_desc',
 *   pageSize: 50
 * })
 * ```
 */
declare function useCollectibleMarketActivities(params: UseCollectibleMarketActivitiesParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.ListCollectibleActivitiesResponse, Error>;
type UseListCollectibleActivitiesRequest = UseCollectibleMarketActivitiesParams;
type UseListCollectibleActivitiesParams = UseCollectibleMarketActivitiesParams;
type UseListCollectibleActivitiesResponse = Awaited<ReturnType<typeof fetchListCollectibleActivities>>;
//#endregion
//#region src/react/hooks/collectible/market-count.d.ts
type UseCollectibleMarketCountParams = Optional<CountOfCollectablesQueryOptions, 'config'>;
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
 * const { data: totalCount, isLoading } = useCollectibleMarketCount({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filters (count filtered collectibles):
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: { priceRange: { min: '1000000000000000000' } },
 *   side: OrderSide.SELL
 * })
 * ```
 */
declare function useCollectibleMarketCount(params: UseCollectibleMarketCountParams): _tanstack_react_query396.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/collectible/market-highest-offer.d.ts
type UseCollectibleMarketHighestOfferParams = Optional<HighestOfferQueryOptions, 'config'>;
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
 * const { data, isLoading } = useCollectibleMarketHighestOffer({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketHighestOffer({
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
declare function useCollectibleMarketHighestOffer(params: UseCollectibleMarketHighestOfferParams): UseQueryResult<Order | undefined, Error>;
//#endregion
//#region src/react/hooks/collectible/market-list.d.ts
type UseCollectibleMarketListParams = Optional<ListCollectiblesQueryOptions, 'config'>;
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
 * const { data, isLoading, fetchNextPage, hasNextPage } = useCollectibleMarketList {
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useCollectibleMarketList {
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
declare function useCollectibleMarketList(params: UseCollectibleMarketListParams): _tanstack_react_query396.UseInfiniteQueryResult<_tanstack_react_query396.InfiniteData<_0xsequence_api_client308.ListCollectiblesResponse, unknown>, Error>;
type UseListCollectiblesParams = UseCollectibleMarketListParams;
//#endregion
//#region src/react/hooks/collectible/market-list-paginated.d.ts
type UseCollectibleMarketListPaginatedParams = Optional<ListCollectiblesPaginatedQueryOptions, 'config'>;
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
 * const { data, isLoading } = useCollectibleMarketListPaginated({
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
 * const { data } = useCollectibleMarketListPaginated({
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
 * const { data, isLoading } = useCollectibleMarketListPaginated({
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
declare function useCollectibleMarketListPaginated(params: UseCollectibleMarketListPaginatedParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.ListCollectiblesResponse, Error>;
type UseListCollectiblesPaginatedArgs = UseCollectibleMarketListPaginatedParams;
type UseListCollectiblesPaginatedParams = UseCollectibleMarketListPaginatedParams;
type UseListCollectiblesPaginatedReturn = Awaited<ReturnType<typeof fetchListCollectiblesPaginated>>;
//#endregion
//#region src/react/hooks/collectible/market-listings.d.ts
type UseCollectibleMarketListingsParams = Optional<ListListingsForCollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch listings for a specific collectible
 *
 * Fetches active listings (sales) for a specific token from the marketplace
 * with support for filtering and pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific token ID to fetch listings for
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the collectible
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketListings({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: 123n
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useCollectibleMarketListings({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: 456n,
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
 * const { data } = useCollectibleMarketListings({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: 789n,
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Specific currency addresses
 *   }
 * })
 * ```
 */
declare function useCollectibleMarketListings(params: UseCollectibleMarketListingsParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.ListCollectibleListingsResponse, Error>;
type UseListListingsForCollectibleArgs = UseListListingsForCollectibleParams;
type UseListListingsForCollectibleResponse = Awaited<ReturnType<typeof fetchListListingsForCollectible>>;
type UseListListingsForCollectibleParams = UseCollectibleMarketListingsParams;
//#endregion
//#region src/react/hooks/collectible/market-listings-count.d.ts
type UseCollectibleMarketListingsCountParams = Optional<CountListingsForCollectibleQueryOptions, 'config'>;
/**
 * Hook to get the count of listings for a specific collectible
 *
 * Counts the number of active listings for a given collectible in the marketplace.
 * Useful for displaying listing counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for listings
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: listingCount, isLoading } = useCollectibleMarketListingsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketListingsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCollectibleMarketListingsCount(params: UseCollectibleMarketListingsCountParams): _tanstack_react_query396.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/collectible/market-lowest-listing.d.ts
type UseCollectibleMarketLowestListingParams = Optional<LowestListingQueryOptions, 'config'>;
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
 * const { data, isLoading } = useCollectibleMarketLowestListing({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketLowestListing({
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
declare function useCollectibleMarketLowestListing(params: UseCollectibleMarketLowestListingParams): UseQueryResult<Order | undefined, Error>;
//#endregion
//#region src/react/hooks/collectible/market-offers.d.ts
type UseCollectibleMarketOffersParams = Optional<ListOffersForCollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch offers for a specific collectible
 *
 * Fetches offers for a specific collectible from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific token ID to fetch offers for
 * @param params.filter - Optional filtering parameters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing offers data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketOffers({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: 1n
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useCollectibleMarketOffers({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: 1n,
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
declare function useCollectibleMarketOffers(params: UseCollectibleMarketOffersParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.ListCollectibleOffersResponse, Error>;
type UseListOffersForCollectibleRequest = UseListOffersForCollectibleParams;
type UseListOffersForCollectibleParams = UseCollectibleMarketOffersParams;
//#endregion
//#region src/react/hooks/collectible/market-offers-count.d.ts
type UseCollectibleMarketOffersCountParams = Optional<CountOffersForCollectibleQueryOptions, 'config'>;
/**
 * Hook to get the count of offers for a specific collectible
 *
 * Counts the number of active offers for a given collectible in the marketplace.
 * Useful for displaying offer counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for offers
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of offers
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: offerCount, isLoading } = useCollectibleMarketOffersCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketOffersCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCollectibleMarketOffersCount(params: UseCollectibleMarketOffersCountParams): _tanstack_react_query396.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/collectible/metadata.d.ts
type UseCollectibleMetadataParams = Optional<CollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch metadata for a specific collectible
 *
 * This hook retrieves metadata for an individual NFT from a collection,
 * including properties like name, description, image, attributes, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The collection contract address
 * @param params.tokenId - The token ID of the collectible
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collectible metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collectible, isLoading } = useCollectibleMetadata({
 *   chainId: 137,
 *   contractAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   tokenId: '12345'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectibleMetadata({
 *   chainId: 137,
 *   contractAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   tokenId: '12345',
 *   query: {
 *     enabled: Boolean(contractAddress && tokenId),
 *     staleTime: 30_000
 *   }
 * })
 * ```
 */
declare function useCollectibleMetadata(params: UseCollectibleMetadataParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.TokenMetadata, Error>;
//#endregion
//#region src/react/hooks/collectible/primary-sale-item.d.ts
type UsePrimarySaleItemParams = Optional<PrimarySaleItemQueryOptions, 'config'>;
/**
 * Hook to fetch a single primary sale item
 *
 * Retrieves details for a specific primary sale item from a primary sale contract.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (number)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.tokenId - The token ID of the primary sale item (string or bigint)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the primary sale item data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: item, isLoading } = usePrimarySaleItem({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 *   tokenId: '1',
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = usePrimarySaleItem({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     staleTime: 30_000
 *   }
 * })
 * ```
 */
declare function usePrimarySaleItem(params: UsePrimarySaleItemParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.GetPrimarySaleItemResponse, Error>;
//#endregion
//#region src/react/hooks/collectible/primary-sale-items.d.ts
type UsePrimarySaleItemsParams = Optional<ListPrimarySaleItemsQueryOptions, 'config'>;
/**
 * Hook to fetch primary sale items with pagination support
 *
 * Retrieves a paginated list of primary sale items for a specific contract address
 * from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.filter - Optional filter parameters for the query
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing the primary sale items data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = usePrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 * })
 * ```
 *
 * @example
 * With filters and pagination:
 * ```typescript
 * const { data, isLoading } = usePrimarySaleItems({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x...',
 *   filter: { status: 'active' },
 *   page: { page: 1, pageSize: 20 },
 *   query: {
 *     enabled: isReady
 *   }
 * })
 * ```
 */
declare function usePrimarySaleItems(params: UsePrimarySaleItemsParams): _tanstack_react_query396.UseInfiniteQueryResult<_tanstack_react_query396.InfiniteData<_0xsequence_api_client308.ListPrimarySaleItemsResponse, unknown>, Error>;
//#endregion
//#region src/react/hooks/collectible/primary-sale-items-count.d.ts
type UsePrimarySaleItemsCountParams = Optional<ListPrimarySaleItemsQueryOptions, 'config'>;
declare function usePrimarySaleItemsCount(args: UsePrimarySaleItemsCountParams): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.GetCountOfPrimarySaleItemsResponse, Error>;
//#endregion
//#region src/react/hooks/collectible/token-balances.d.ts
/**
 * Hook to fetch all token balances for a user in a collection
 *
 * @param args - The arguments for fetching the balances
 * @returns Query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCollectibleTokenBalances({
 *   collectionAddress: '0x123...',
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useCollectibleTokenBalances(args: Omit<TokenBalancesQueryOptions, 'config'>): _tanstack_react_query396.UseQueryResult<_0xsequence_api_client308.IndexerTokenBalance[], Error>;
//#endregion
export { UseCollectibleMarketListParams as A, UseListCollectibleActivitiesResponse as B, UseListListingsForCollectibleResponse as C, UseListCollectiblesPaginatedParams as D, UseListCollectiblesPaginatedArgs as E, UseCollectibleMarketCountParams as F, useErc721SaleDetails as H, useCollectibleMarketCount as I, UseCollectibleMarketActivitiesParams as L, useCollectibleMarketList as M, UseCollectibleMarketHighestOfferParams as N, UseListCollectiblesPaginatedReturn as O, useCollectibleMarketHighestOffer as P, UseListCollectibleActivitiesParams as R, UseListListingsForCollectibleParams as S, UseCollectibleMarketListPaginatedParams as T, useCollectibleBalance as U, useCollectibleMarketActivities as V, useCollectibleMarketLowestListing as _, usePrimarySaleItems as a, UseCollectibleMarketListingsParams as b, UseCollectibleMetadataParams as c, useCollectibleMarketOffersCount as d, UseCollectibleMarketOffersParams as f, UseCollectibleMarketLowestListingParams as g, useCollectibleMarketOffers as h, UsePrimarySaleItemsParams as i, UseListCollectiblesParams as j, useCollectibleMarketListPaginated as k, useCollectibleMetadata as l, UseListOffersForCollectibleRequest as m, UsePrimarySaleItemsCountParams as n, UsePrimarySaleItemParams as o, UseListOffersForCollectibleParams as p, usePrimarySaleItemsCount as r, usePrimarySaleItem as s, useCollectibleTokenBalances as t, UseCollectibleMarketOffersCountParams as u, UseCollectibleMarketListingsCountParams as v, useCollectibleMarketListings as w, UseListListingsForCollectibleArgs as x, useCollectibleMarketListingsCount as y, UseListCollectibleActivitiesRequest as z };
//# sourceMappingURL=index9.d.ts.map