import { Bt as Currency, G as SdkConfig, Vt as CurrencyStatus, j as ValuesOptional } from "./create-config-BO68TZC5.js";
import { n as StandardQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query364 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/currency/compare-prices.d.ts
interface FetchComparePricesParams {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: Address;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address;
  config: SdkConfig;
}
type ComparePricesReturn = {
  percentageDifference: number;
  percentageDifferenceFormatted: string;
  status: 'above' | 'same' | 'below';
};
/**
 * Compares prices between different currencies by converting both to USD
 */
declare function fetchComparePrices(params: FetchComparePricesParams): Promise<ComparePricesReturn>;
type ComparePricesQueryOptions = ValuesOptional<FetchComparePricesParams> & {
  query?: StandardQueryOptions;
};
declare function getComparePricesQueryKey(params: ComparePricesQueryOptions): readonly ["currency", "compare-prices", {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: `0x${string}`;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: `0x${string}`;
}];
declare function comparePricesQueryOptions(params: ComparePricesQueryOptions): _tanstack_react_query364.OmitKeyof<_tanstack_react_query364.UseQueryOptions<ComparePricesReturn, Error, ComparePricesReturn, readonly ["currency", "compare-prices", {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: `0x${string}`;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: `0x${string}`;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query364.QueryFunction<ComparePricesReturn, readonly ["currency", "compare-prices", {
    chainId: number;
    priceAmountRaw: string;
    priceCurrencyAddress: `0x${string}`;
    compareToPriceAmountRaw: string;
    compareToPriceCurrencyAddress: `0x${string}`;
  }], never> | undefined;
} & {
  queryKey: readonly ["currency", "compare-prices", {
    chainId: number;
    priceAmountRaw: string;
    priceCurrencyAddress: `0x${string}`;
    compareToPriceAmountRaw: string;
    compareToPriceCurrencyAddress: `0x${string}`;
  }] & {
    [dataTagSymbol]: ComparePricesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/convert-to-usd.d.ts
interface FetchConvertPriceToUSDParams {
  chainId: number;
  currencyAddress: Address;
  amountRaw: string;
  config: SdkConfig;
}
interface ConvertPriceToUSDReturn {
  usdAmount: number;
  usdAmountFormatted: string;
}
/**
 * Converts a price amount from a specific currency to USD using exchange rates
 */
declare function fetchConvertPriceToUSD(params: FetchConvertPriceToUSDParams): Promise<ConvertPriceToUSDReturn>;
type ConvertPriceToUSDQueryOptions = ValuesOptional<FetchConvertPriceToUSDParams> & {
  query?: StandardQueryOptions;
};
declare function getConvertPriceToUSDQueryKey(params: ConvertPriceToUSDQueryOptions): readonly ["currency", "convert-to-usd", {
  chainId: number;
  currencyAddress: `0x${string}`;
  amountRaw: string;
}];
declare function convertPriceToUSDQueryOptions(params: ConvertPriceToUSDQueryOptions): _tanstack_react_query364.OmitKeyof<_tanstack_react_query364.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, readonly ["currency", "convert-to-usd", {
  chainId: number;
  currencyAddress: `0x${string}`;
  amountRaw: string;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query364.QueryFunction<ConvertPriceToUSDReturn, readonly ["currency", "convert-to-usd", {
    chainId: number;
    currencyAddress: `0x${string}`;
    amountRaw: string;
  }], never> | undefined;
} & {
  queryKey: readonly ["currency", "convert-to-usd", {
    chainId: number;
    currencyAddress: `0x${string}`;
    amountRaw: string;
  }] & {
    [dataTagSymbol]: ConvertPriceToUSDReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/currency.d.ts
interface FetchCurrencyParams {
  chainId: number;
  currencyAddress: Address;
  config: SdkConfig;
}
/**
 * Fetches currency details from the marketplace API
 */
declare function fetchCurrency(params: FetchCurrencyParams): Promise<Currency | undefined>;
type CurrencyQueryOptions = ValuesOptional<FetchCurrencyParams> & {
  query?: StandardQueryOptions;
};
declare function getCurrencyQueryKey(params: CurrencyQueryOptions): readonly ["currency", "currency", {
  chainId: string;
  currencyAddress: `0x${string}`;
}];
declare function currencyQueryOptions(params: CurrencyQueryOptions): _tanstack_react_query364.UseQueryOptions<Currency | undefined, Error, Currency | undefined, readonly ["currency", "currency", {
  chainId: string;
  currencyAddress: `0x${string}`;
}]> & {
  initialData?: Currency | _tanstack_react_query364.InitialDataFunction<Currency> | undefined;
} & {
  queryKey: readonly ["currency", "currency", {
    chainId: string;
    currencyAddress: `0x${string}`;
  }] & {
    [dataTagSymbol]: Currency | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency/list.d.ts
interface FetchMarketCurrenciesParams {
  chainId: number;
  includeNativeCurrency?: boolean;
  collectionAddress?: Address;
  config: SdkConfig;
}
/**
 * Fetches supported currencies for a marketplace
 */
declare function fetchMarketCurrencies(params: FetchMarketCurrenciesParams): Promise<{
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
}[]>;
type MarketCurrenciesQueryOptions = ValuesOptional<FetchMarketCurrenciesParams> & {
  query?: StandardQueryOptions;
};
declare function getMarketCurrenciesQueryKey(params: MarketCurrenciesQueryOptions): readonly ["currency", "list", {
  chainId: string;
}, {
  readonly includeNativeCurrency: boolean | undefined;
  readonly collectionAddress: `0x${string}` | undefined;
}];
declare function marketCurrenciesQueryOptions(params: MarketCurrenciesQueryOptions): _tanstack_react_query364.OmitKeyof<_tanstack_react_query364.UseQueryOptions<{
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
}[], Error, {
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
}[], readonly ["currency", "list", {
  chainId: string;
}, {
  readonly includeNativeCurrency: boolean | undefined;
  readonly collectionAddress: `0x${string}` | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query364.QueryFunction<{
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
  }[], readonly ["currency", "list", {
    chainId: string;
  }, {
    readonly includeNativeCurrency: boolean | undefined;
    readonly collectionAddress: `0x${string}` | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["currency", "list", {
    chainId: string;
  }, {
    readonly includeNativeCurrency: boolean | undefined;
    readonly collectionAddress: `0x${string}` | undefined;
  }] & {
    [dataTagSymbol]: {
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
    }[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getComparePricesQueryKey as S, ComparePricesQueryOptions as _, marketCurrenciesQueryOptions as a, comparePricesQueryOptions as b, currencyQueryOptions as c, ConvertPriceToUSDQueryOptions as d, ConvertPriceToUSDReturn as f, getConvertPriceToUSDQueryKey as g, fetchConvertPriceToUSD as h, getMarketCurrenciesQueryKey as i, fetchCurrency as l, convertPriceToUSDQueryOptions as m, MarketCurrenciesQueryOptions as n, CurrencyQueryOptions as o, FetchConvertPriceToUSDParams as p, fetchMarketCurrencies as r, FetchCurrencyParams as s, FetchMarketCurrenciesParams as t, getCurrencyQueryKey as u, ComparePricesReturn as v, fetchComparePrices as x, FetchComparePricesParams as y };
//# sourceMappingURL=index-DtA3KvPu.d.ts.map