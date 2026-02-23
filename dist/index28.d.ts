import { Ft as Address$1, It as ChainId, N as ListCurrenciesRequest, l as Currency } from "./index2.js";
import { W as SdkQueryParams, X as WithRequired, it as WithOptionalParams } from "./create-config.js";
import * as _tanstack_react_query64 from "@tanstack/react-query";

//#region src/react/queries/currency/compare-prices.d.ts
type FetchComparePricesParams = {
  chainId?: ChainId;
  priceAmountRaw?: string;
  priceCurrencyAddress?: Address$1;
  compareToPriceAmountRaw?: string;
  compareToPriceCurrencyAddress?: Address$1;
};
type ComparePricesReturn = {
  percentageDifference: number;
  percentageDifferenceFormatted: string;
  status: 'above' | 'same' | 'below';
};
type ComparePricesQueryOptions = SdkQueryParams<FetchComparePricesParams>;
/**
 * Compares prices between different currencies by converting both to USD
 */
declare function fetchComparePrices(params: WithRequired<ComparePricesQueryOptions, 'chainId' | 'priceAmountRaw' | 'priceCurrencyAddress' | 'compareToPriceAmountRaw' | 'compareToPriceCurrencyAddress' | 'config'>): Promise<ComparePricesReturn>;
declare function getComparePricesQueryKey(params: ComparePricesQueryOptions): readonly ["currency", "compare-prices", {
  chainId: number | undefined;
  priceAmountRaw: string | undefined;
  priceCurrencyAddress: `0x${string}` | undefined;
  compareToPriceAmountRaw: string | undefined;
  compareToPriceCurrencyAddress: `0x${string}` | undefined;
}];
declare function comparePricesQueryOptions(params: WithOptionalParams<WithRequired<ComparePricesQueryOptions, 'chainId' | 'priceAmountRaw' | 'priceCurrencyAddress' | 'compareToPriceAmountRaw' | 'compareToPriceCurrencyAddress' | 'config'>>): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseQueryOptions<ComparePricesReturn, Error, ComparePricesReturn, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<ComparePricesReturn, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ComparePricesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/convert-to-usd.d.ts
type FetchConvertPriceToUSDParams = {
  chainId: ChainId;
  currencyAddress: Address$1;
  amountRaw: string;
};
type ConvertPriceToUSDReturn = {
  usdAmount: number;
  usdAmountFormatted: string;
};
type ConvertPriceToUSDQueryOptions = SdkQueryParams<FetchConvertPriceToUSDParams>;
/**
 * Converts a price amount from a specific currency to USD using exchange rates
 */
declare function fetchConvertPriceToUSD(params: WithRequired<ConvertPriceToUSDQueryOptions, 'chainId' | 'currencyAddress' | 'amountRaw' | 'config'>): Promise<ConvertPriceToUSDReturn>;
declare function getConvertPriceToUSDQueryKey(params: ConvertPriceToUSDQueryOptions): readonly ["currency", "convert-to-usd", {
  chainId: number | undefined;
  currencyAddress: `0x${string}` | undefined;
  amountRaw: string | undefined;
}];
declare function convertPriceToUSDQueryOptions(params: WithOptionalParams<WithRequired<ConvertPriceToUSDQueryOptions, 'chainId' | 'currencyAddress' | 'amountRaw' | 'config'>>): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<ConvertPriceToUSDReturn, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ConvertPriceToUSDReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/currency.d.ts
type FetchCurrencyParams = ListCurrenciesRequest & {
  currencyAddress: Address$1;
};
/**
 * Fetches currency details from the marketplace API
 */
declare function fetchCurrency(params: WithRequired<CurrencyQueryOptions, 'chainId' | 'currencyAddress' | 'config'>): Promise<Currency | undefined>;
type CurrencyQueryOptions = SdkQueryParams<FetchCurrencyParams>;
declare function getCurrencyQueryKey(params: CurrencyQueryOptions): readonly ["currency", "currency", {
  chainId: string;
  currencyAddress: string;
}];
declare function currencyQueryOptions(params: WithOptionalParams<WithRequired<CurrencyQueryOptions, 'chainId' | 'currencyAddress' | 'config'>>): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseQueryOptions<Currency | undefined, Error, Currency | undefined, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<Currency | undefined, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Currency | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/list.d.ts
type FetchMarketCurrenciesParams = ListCurrenciesRequest & {
  includeNativeCurrency?: boolean;
  collectionAddress?: Address$1;
};
type MarketCurrenciesQueryOptions = SdkQueryParams<FetchMarketCurrenciesParams>;
/**
 * Fetches supported currencies for a marketplace
 */
declare function fetchMarketCurrencies(params: WithRequired<MarketCurrenciesQueryOptions, 'chainId' | 'config'>): Promise<Currency[]>;
declare function getMarketCurrenciesQueryKey(params: MarketCurrenciesQueryOptions): readonly ["currency", "list", {
  readonly chainId: number | undefined;
  readonly includeNativeCurrency: boolean | undefined;
  readonly collectionAddress: `0x${string}` | undefined;
}];
declare function marketCurrenciesQueryOptions(params: WithOptionalParams<WithRequired<MarketCurrenciesQueryOptions, 'chainId' | 'config'>>): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseQueryOptions<Currency[], Error, Currency[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<Currency[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Currency[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getComparePricesQueryKey as S, ComparePricesQueryOptions as _, marketCurrenciesQueryOptions as a, comparePricesQueryOptions as b, currencyQueryOptions as c, ConvertPriceToUSDQueryOptions as d, ConvertPriceToUSDReturn as f, getConvertPriceToUSDQueryKey as g, fetchConvertPriceToUSD as h, getMarketCurrenciesQueryKey as i, fetchCurrency as l, convertPriceToUSDQueryOptions as m, MarketCurrenciesQueryOptions as n, CurrencyQueryOptions as o, FetchConvertPriceToUSDParams as p, fetchMarketCurrencies as r, FetchCurrencyParams as s, FetchMarketCurrenciesParams as t, getCurrencyQueryKey as u, ComparePricesReturn as v, fetchComparePrices as x, FetchComparePricesParams as y };
//# sourceMappingURL=index28.d.ts.map