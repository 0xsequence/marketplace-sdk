import { Dn as WithRequired, Fn as WithOptionalParams, X as Currency$1, xn as SdkQueryParams } from "./create-config.js";
import { Currency } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query120 from "@tanstack/react-query";

//#region src/react/queries/currency/compare-prices.d.ts
interface FetchComparePricesParams {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: Address$1;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address$1;
}
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
declare function comparePricesQueryOptions(params: WithOptionalParams<WithRequired<ComparePricesQueryOptions, 'chainId' | 'priceAmountRaw' | 'priceCurrencyAddress' | 'compareToPriceAmountRaw' | 'compareToPriceCurrencyAddress' | 'config'>>): _tanstack_react_query120.OmitKeyof<_tanstack_react_query120.UseQueryOptions<ComparePricesReturn, Error, ComparePricesReturn, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query120.QueryFunction<ComparePricesReturn, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ComparePricesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/convert-to-usd.d.ts
interface FetchConvertPriceToUSDParams {
  chainId: number;
  currencyAddress: Address$1;
  amountRaw: string;
}
interface ConvertPriceToUSDReturn {
  usdAmount: number;
  usdAmountFormatted: string;
}
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
declare function convertPriceToUSDQueryOptions(params: WithOptionalParams<WithRequired<ConvertPriceToUSDQueryOptions, 'chainId' | 'currencyAddress' | 'amountRaw' | 'config'>>): _tanstack_react_query120.OmitKeyof<_tanstack_react_query120.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query120.QueryFunction<ConvertPriceToUSDReturn, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ConvertPriceToUSDReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/currency.d.ts
interface FetchCurrencyParams {
  chainId: number;
  currencyAddress: Address$1;
}
/**
 * Fetches currency details from the marketplace API
 */
declare function fetchCurrency(params: WithRequired<CurrencyQueryOptions, 'chainId' | 'currencyAddress' | 'config'>): Promise<Currency$1 | undefined>;
type CurrencyQueryOptions = SdkQueryParams<FetchCurrencyParams>;
declare function getCurrencyQueryKey(params: CurrencyQueryOptions): readonly ["currency", "currency", {
  chainId: string;
  currencyAddress: string;
}];
declare function currencyQueryOptions(params: CurrencyQueryOptions): _tanstack_react_query120.UseQueryOptions<Currency$1 | undefined, Error, Currency$1 | undefined, readonly ["currency", "currency", {
  chainId: string;
  currencyAddress: string;
}]> & {
  initialData?: Currency$1 | _tanstack_react_query120.InitialDataFunction<Currency$1> | undefined;
} & {
  queryKey: readonly ["currency", "currency", {
    chainId: string;
    currencyAddress: string;
  }] & {
    [dataTagSymbol]: Currency$1 | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/list.d.ts
interface FetchMarketCurrenciesParams {
  chainId: number;
  includeNativeCurrency?: boolean;
  collectionAddress?: Address$1;
}
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
declare function marketCurrenciesQueryOptions(params: WithOptionalParams<WithRequired<MarketCurrenciesQueryOptions, 'chainId' | 'config'>>): _tanstack_react_query120.OmitKeyof<_tanstack_react_query120.UseQueryOptions<Currency[], Error, Currency[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query120.QueryFunction<Currency[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Currency[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getComparePricesQueryKey as S, ComparePricesQueryOptions as _, marketCurrenciesQueryOptions as a, comparePricesQueryOptions as b, currencyQueryOptions as c, ConvertPriceToUSDQueryOptions as d, ConvertPriceToUSDReturn as f, getConvertPriceToUSDQueryKey as g, fetchConvertPriceToUSD as h, getMarketCurrenciesQueryKey as i, fetchCurrency as l, convertPriceToUSDQueryOptions as m, MarketCurrenciesQueryOptions as n, CurrencyQueryOptions as o, FetchConvertPriceToUSDParams as p, fetchMarketCurrencies as r, FetchCurrencyParams as s, FetchMarketCurrenciesParams as t, getCurrencyQueryKey as u, ComparePricesReturn as v, fetchComparePrices as x, FetchComparePricesParams as y };
//# sourceMappingURL=index25.d.ts.map