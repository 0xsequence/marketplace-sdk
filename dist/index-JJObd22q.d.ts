import { A as Optional, Qt as CurrencyStatus, Vt as ContractType, Z as CollectibleCardAction, Zr as OrderbookKind, Zt as Currency, fi as PropertyFilter, jt as CollectibleOrder, ti as PriceFilter, vr as ListCollectiblesReturn } from "./create-config-BNLuQTqP.js";
import { a as CurrencyQueryOptions, n as MarketCurrenciesQueryOptions } from "./marketCurrencies-pnufpOCw.js";
import { r as MarketCollectibleCardProps } from "./types-Chq5tJIn.js";
import * as _tanstack_react_query382 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/hooks/data/market/useCurrency.d.ts
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
declare function useCurrency(params: UseCurrencyParams): _tanstack_react_query382.UseQueryResult<Currency | undefined, Error>;
//#endregion
//#region src/react/hooks/data/market/useListMarketCardData.d.ts
interface UseListMarketCardDataProps {
  collectionAddress: Address;
  chainId: number;
  orderbookKind?: OrderbookKind;
  collectionType: ContractType;
  filterOptions?: PropertyFilter[];
  searchText?: string;
  showListedOnly?: boolean;
  priceFilters?: PriceFilter[];
  onCollectibleClick?: (tokenId: string) => void;
  onCannotPerformAction?: (action: CollectibleCardAction) => void;
  prioritizeOwnerActions?: boolean;
  assetSrcPrefixUrl?: string;
}
declare function useListMarketCardData({
  collectionAddress,
  chainId,
  orderbookKind,
  collectionType,
  filterOptions,
  searchText,
  showListedOnly,
  priceFilters,
  onCollectibleClick,
  onCannotPerformAction,
  prioritizeOwnerActions,
  assetSrcPrefixUrl
}: UseListMarketCardDataProps): {
  collectibleCards: MarketCollectibleCardProps[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: _tanstack_react_query382.FetchNextPageOptions) => Promise<_tanstack_react_query382.InfiniteQueryObserverResult<_tanstack_react_query382.InfiniteData<ListCollectiblesReturn, unknown>, Error>>;
  allCollectibles: CollectibleOrder[];
};
//#endregion
//#region src/react/hooks/data/market/useMarketCurrencies.d.ts
type UseMarketCurrenciesParams = Optional<MarketCurrenciesQueryOptions, 'config'>;
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
 * const { data, isLoading } = useMarketCurrencies({
 *   chainId: 137
 * })
 * ```
 *
 * @example
 * Exclude native currency:
 * ```typescript
 * const { data, isLoading } = useMarketCurrencies({
 *   chainId: 1,
 *   includeNativeCurrency: false
 * })
 * ```
 */
declare function useMarketCurrencies(params: UseMarketCurrenciesParams): _tanstack_react_query382.UseQueryResult<{
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
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[], Error>;
//#endregion
export { useCurrency as a, UseCurrencyParams as i, useMarketCurrencies as n, useListMarketCardData as r, UseMarketCurrenciesParams as t };
//# sourceMappingURL=index-JJObd22q.d.ts.map