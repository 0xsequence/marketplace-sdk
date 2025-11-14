import { Br as ListPrimarySaleItemsResponse, Bt as Currency, G as SdkConfig, Un as GetCountOfPrimarySaleItemsResponse, Vt as CurrencyStatus, W as MarketplaceSdkContext, Yr as Order, fr as ListCollectibleActivitiesResponse, gr as ListCollectibleOffersResponse, mr as ListCollectibleListingsResponse, vr as ListCollectiblesResponse, w as Optional } from "./create-config-BO68TZC5.js";
import { E as ListOffersForCollectibleQueryOptions, F as CountListingsForCollectibleQueryOptions, H as fetchListListingsForCollectible, K as ListCollectiblesPaginatedQueryOptions, V as ListListingsForCollectibleQueryOptions, Z as ListCollectiblesQueryOptions, b as CountOffersForCollectibleQueryOptions, d as ListPrimarySaleItemsQueryOptions, ft as ListCollectibleActivitiesQueryOptions, gt as UseBalanceOfCollectibleArgs, h as CollectibleQueryOptions, j as LowestListingQueryOptions, nt as HighestOfferQueryOptions, ot as CountOfCollectablesQueryOptions, pt as fetchListCollectibleActivities, q as fetchListCollectiblesPaginated, t as UseTokenBalancesArgs } from "./index-D-t5hcfw.js";
import { _ as ComparePricesQueryOptions, d as ConvertPriceToUSDQueryOptions, f as ConvertPriceToUSDReturn, n as MarketCurrenciesQueryOptions, o as CurrencyQueryOptions, v as ComparePricesReturn } from "./index-DtA3KvPu.js";
import { n as UseInventoryArgs, t as CollectiblesResponse } from "./index-kq_zM6tc.js";
import * as react13 from "react";
import * as _tanstack_react_query344 from "@tanstack/react-query";
import * as _0xsequence_indexer24 from "@0xsequence/indexer";
import * as _0xsequence_metadata140 from "@0xsequence/metadata";
import * as react_jsx_runtime0 from "react/jsx-runtime";
import { Address } from "viem";

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
declare function useCollectibleBalance(args: UseBalanceOfCollectibleArgs): _tanstack_react_query344.UseQueryResult<_0xsequence_indexer24.TokenBalance, Error>;
//#endregion
//#region src/react/hooks/collectible/erc721-sale-details.d.ts
interface UseErc721CollectionDataProps {
  chainId: number;
  salesContractAddress: Address;
  itemsContractAddress: Address;
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
declare function useCollectibleMarketActivities(params: UseCollectibleMarketActivitiesParams): _tanstack_react_query344.UseQueryResult<ListCollectibleActivitiesResponse, Error>;
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
declare function useCollectibleMarketCount(params: UseCollectibleMarketCountParams): _tanstack_react_query344.UseQueryResult<number, Error>;
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
declare function useCollectibleMarketHighestOffer(params: UseCollectibleMarketHighestOfferParams): _tanstack_react_query344.UseQueryResult<Order, Error>;
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
declare function useCollectibleMarketList(params: UseCollectibleMarketListParams): _tanstack_react_query344.UseInfiniteQueryResult<_tanstack_react_query344.InfiniteData<ListCollectiblesResponse, unknown>, Error>;
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
declare function useCollectibleMarketListPaginated(params: UseCollectibleMarketListPaginatedParams): _tanstack_react_query344.UseQueryResult<ListCollectiblesResponse, Error>;
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
 * const { data, isLoading } = useCollectibleMarketListings({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useCollectibleMarketListings({
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
 * const { data } = useCollectibleMarketListings({
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
declare function useCollectibleMarketListings(params: UseCollectibleMarketListingsParams): _tanstack_react_query344.UseQueryResult<ListCollectibleListingsResponse, Error>;
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
 * @param params.collectibleId - The specific collectible/token ID
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
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketListingsCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCollectibleMarketListingsCount(params: UseCollectibleMarketListingsCountParams): _tanstack_react_query344.UseQueryResult<number, Error>;
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
declare function useCollectibleMarketLowestListing(params: UseCollectibleMarketLowestListingParams): _tanstack_react_query344.UseQueryResult<Order | null | undefined, Error>;
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
 * const { data, isLoading } = useCollectibleMarketOffers({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '1'
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useCollectibleMarketOffers({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '1',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 */
declare function useCollectibleMarketOffers(params: UseCollectibleMarketOffersParams): _tanstack_react_query344.UseQueryResult<ListCollectibleOffersResponse, Error>;
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
 * @param params.collectibleId - The specific collectible/token ID
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
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCollectibleMarketOffersCount({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCollectibleMarketOffersCount(params: UseCollectibleMarketOffersCountParams): _tanstack_react_query344.UseQueryResult<number, Error>;
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
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The token ID of the collectible
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collectible metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collectible, isLoading } = useCollectibleMetadata({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   collectibleId: '12345'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectibleMetadata({
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
declare function useCollectibleMetadata(params: UseCollectibleMetadataParams): _tanstack_react_query344.UseQueryResult<_0xsequence_metadata140.TokenMetadata, Error>;
//#endregion
//#region src/react/hooks/currency/compare-prices.d.ts
type UseCurrencyComparePricesParams = Optional<ComparePricesQueryOptions, 'config'>;
/**
 * Hook to compare prices between different currencies by converting both to USD
 *
 * Compares two prices by converting both to USD using real-time exchange rates
 * and returns the percentage difference with comparison status.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.priceAmountRaw - The raw amount of the first price (wei format)
 * @param params.priceCurrencyAddress - The currency address of the first price
 * @param params.compareToPriceAmountRaw - The raw amount of the second price to compare against (wei format)
 * @param params.compareToPriceCurrencyAddress - The currency address of the second price
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing percentage difference and comparison status
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: comparison, isLoading } = useCurrencyComparePrices({
 *   chainId: 1,
 *   priceAmountRaw: '1000000000000000000', // 1 ETH in wei
 *   priceCurrencyAddress: '0x0000000000000000000000000000000000000000', // ETH
 *   compareToPriceAmountRaw: '2000000000', // 2000 USDC in wei (6 decimals)
 *   compareToPriceCurrencyAddress: '0xA0b86a33E6B8DbF5E71Eaa9bfD3F6fD8e8Be3F69' // USDC
 * })
 *
 * if (data) {
 *   console.log(`${data.percentageDifferenceFormatted}% ${data.status}`);
 *   // e.g., "25.50% above" or "10.25% below"
 * }
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data: comparison } = useCurrencyComparePrices({
 *   chainId: 137,
 *   priceAmountRaw: price1,
 *   priceCurrencyAddress: currency1Address,
 *   compareToPriceAmountRaw: price2,
 *   compareToPriceCurrencyAddress: currency2Address,
 *   query: {
 *     enabled: Boolean(price1 && price2),
 *     refetchInterval: 30000 // Refresh every 30 seconds
 *   }
 * })
 * ```
 */
declare function useCurrencyComparePrices(params: UseCurrencyComparePricesParams): _tanstack_react_query344.UseQueryResult<ComparePricesReturn, Error>;
type UseComparePricesArgs = {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: Address;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address;
  query?: {
    enabled?: boolean;
  };
};
type UseComparePricesReturn = {
  percentageDifference: number;
  percentageDifferenceFormatted: string;
  status: 'above' | 'same' | 'below';
};
//#endregion
//#region src/react/hooks/currency/convert-to-usd.d.ts
type UseCurrencyConvertToUSDParams = Optional<ConvertPriceToUSDQueryOptions, 'config'>;
/**
 * Hook to convert a price amount from a specific currency to USD
 *
 * Converts cryptocurrency amounts to their USD equivalent using current exchange rates.
 * Fetches currency data and calculates the USD value based on the provided amount
 * and currency address.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.currencyAddress - The currency contract address to convert from
 * @param params.amountRaw - The raw amount in smallest units (e.g., wei for ETH)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing USD amount and formatted USD amount
 *
 * @example
 * Basic ETH to USD conversion:
 * ```typescript
 * const { data: conversion, isLoading } = useCurrencyConvertToUSD({
 *   chainId: 1,
 *   currencyAddress: '0x0000000000000000000000000000000000000000', // ETH
 *   amountRaw: '1000000000000000000' // 1 ETH in wei
 * })
 *
 * if (data) {
 *   console.log(`$${data.usdAmountFormatted}`); // e.g., "$2000.00"
 *   console.log(data.usdAmount); // e.g., 2000
 * }
 * ```
 *
 * @example
 * ERC-20 token conversion with conditional enabling:
 * ```typescript
 * const { data: conversion } = useCurrencyConvertToUSD({
 *   chainId: 137,
 *   currencyAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Polygon
 *   amountRaw: '1000000', // 1 USDC (6 decimals)
 *   query: {
 *     enabled: Boolean(userHasTokens),
 *     refetchInterval: 30000 // Update price every 30 seconds
 *   }
 * })
 * ```
 */
declare function useCurrencyConvertToUSD(params: UseCurrencyConvertToUSDParams): _tanstack_react_query344.UseQueryResult<ConvertPriceToUSDReturn, Error>;
type UseConvertPriceToUSDArgs = {
  chainId: number;
  currencyAddress: Address;
  amountRaw: string;
  query?: {
    enabled?: boolean;
  };
};
type UseConvertPriceToUSDReturn = ConvertPriceToUSDReturn;
//#endregion
//#region src/react/hooks/currency/currency.d.ts
type UseCurrencyParams = Optional<CurrencyQueryOptions, 'config'>;
/**
 * Hook to fetch currency details from the marketplace
 *
 * Retrieves detailed information about a specific currency by its contract address.
 * The currency data is cached from previous currency list calls when possible.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.currencyAddress - The currency contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing currency details
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCurrency({
 *   chainId: 137,
 *   currencyAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCurrency({
 *   chainId: 1,
 *   currencyAddress: '0x...',
 *   query: {
 *     enabled: Boolean(selectedCurrency)
 *   }
 * })
 * ```
 */
declare function useCurrency(params: UseCurrencyParams): _tanstack_react_query344.UseQueryResult<Currency | undefined, Error>;
//#endregion
//#region src/react/hooks/currency/list.d.ts
type UseCurrencyListParams = Optional<MarketCurrenciesQueryOptions, 'config'>;
/**
 * Hook to fetch supported currencies for a marketplace
 *
 * Retrieves the list of currencies supported by the marketplace for a specific chain.
 * Can optionally filter to exclude native currency or filter by collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.includeNativeCurrency - Whether to include native currency (default: true)
 * @param params.collectionAddress - Optional collection address to filter currencies
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing supported currencies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCurrencyList({
 *   chainId: 137
 * })
 * ```
 *
 * @example
 * Exclude native currency:
 * ```typescript
 * const { data, isLoading } = useCurrencyList({
 *   chainId: 1,
 *   includeNativeCurrency: false
 * })
 * ```
 */
declare function useCurrencyList(params: UseCurrencyListParams): _tanstack_react_query344.UseQueryResult<{
  contractAddress: string;
  chainId: number;
  status: CurrencyStatus;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
  exchangeRate: number;
  defaultChainCurrency: boolean;
  nativeCurrency: boolean;
  openseaListing: boolean;
  openseaOffer: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[], Error>;
//#endregion
//#region src/react/hooks/inventory/inventory.d.ts
declare function useInventory(args: UseInventoryArgs): _tanstack_react_query344.UseQueryResult<CollectiblesResponse, Error>;
//#endregion
//#region src/react/providers/index.d.ts
declare const MarketplaceSdkContext$1: react13.Context<MarketplaceSdkContext>;
type MarketplaceSdkProviderProps = {
  config: SdkConfig;
  children: React.ReactNode;
  openConnectModal?: () => void;
};
declare function MarketplaceProvider({
  config,
  children,
  openConnectModal
}: MarketplaceSdkProviderProps): react_jsx_runtime0.JSX.Element;
declare function MarketplaceQueryClientProvider({
  children
}: {
  children: React.ReactNode;
}): react_jsx_runtime0.JSX.Element;
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
declare function usePrimarySaleItems(params: UsePrimarySaleItemsParams): _tanstack_react_query344.UseInfiniteQueryResult<_tanstack_react_query344.InfiniteData<ListPrimarySaleItemsResponse, unknown>, Error>;
//#endregion
//#region src/react/hooks/collectible/primary-sale-items-count.d.ts
type UsePrimarySaleItemsCountParams = Optional<ListPrimarySaleItemsQueryOptions, 'config'>;
declare function usePrimarySaleItemsCount(args: UsePrimarySaleItemsCountParams): _tanstack_react_query344.UseQueryResult<GetCountOfPrimarySaleItemsResponse, Error>;
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
declare function useCollectibleTokenBalances(args: UseTokenBalancesArgs): _tanstack_react_query344.UseQueryResult<_0xsequence_indexer24.TokenBalance[], Error>;
//#endregion
export { UseListCollectibleActivitiesParams as $, useCollectibleMarketOffers as A, UseCollectibleMarketListPaginatedParams as B, UseCollectibleMetadataParams as C, UseCollectibleMarketOffersParams as D, useCollectibleMarketOffersCount as E, UseCollectibleMarketListingsParams as F, UseCollectibleMarketListParams as G, UseListCollectiblesPaginatedParams as H, UseListListingsForCollectibleArgs as I, UseCollectibleMarketHighestOfferParams as J, UseListCollectiblesParams as K, UseListListingsForCollectibleParams as L, useCollectibleMarketLowestListing as M, UseCollectibleMarketListingsCountParams as N, UseListOffersForCollectibleParams as O, useCollectibleMarketListingsCount as P, UseCollectibleMarketActivitiesParams as Q, UseListListingsForCollectibleResponse as R, useCurrencyComparePrices as S, UseCollectibleMarketOffersCountParams as T, UseListCollectiblesPaginatedReturn as U, UseListCollectiblesPaginatedArgs as V, useCollectibleMarketListPaginated as W, UseCollectibleMarketCountParams as X, useCollectibleMarketHighestOffer as Y, useCollectibleMarketCount as Z, UseCurrencyConvertToUSDParams as _, usePrimarySaleItems as a, UseComparePricesReturn as b, MarketplaceSdkContext$1 as c, UseCurrencyListParams as d, UseListCollectibleActivitiesRequest as et, useCurrencyList as f, UseConvertPriceToUSDReturn as g, UseConvertPriceToUSDArgs as h, UsePrimarySaleItemsParams as i, useCollectibleBalance as it, UseCollectibleMarketLowestListingParams as j, UseListOffersForCollectibleRequest as k, MarketplaceSdkProviderProps as l, useCurrency as m, UsePrimarySaleItemsCountParams as n, useCollectibleMarketActivities as nt, MarketplaceProvider as o, UseCurrencyParams as p, useCollectibleMarketList as q, usePrimarySaleItemsCount as r, useErc721SaleDetails as rt, MarketplaceQueryClientProvider as s, useCollectibleTokenBalances as t, UseListCollectibleActivitiesResponse as tt, useInventory as u, useCurrencyConvertToUSD as v, useCollectibleMetadata as w, UseCurrencyComparePricesParams as x, UseComparePricesArgs as y, useCollectibleMarketListings as z };
//# sourceMappingURL=index-CykeQqQg.d.ts.map