import { Currency, CurrencyStatus, SdkConfig, ValuesOptional } from "./create-config-CsagtMvq.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query58 from "@tanstack/react-query";
import * as _tanstack_react_query63 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/market/currency.d.ts
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
declare function getCurrencyQueryKey(params: CurrencyQueryOptions): readonly ["currencies", "details", {
  chainId: string;
  currencyAddress: `0x${string}`;
}];
declare function currencyQueryOptions(params: CurrencyQueryOptions): _tanstack_react_query58.UseQueryOptions<Currency | undefined, Error, Currency | undefined, readonly ["currencies", "details", {
  chainId: string;
  currencyAddress: `0x${string}`;
}]> & {
  initialData?: Currency | _tanstack_react_query58.InitialDataFunction<Currency> | undefined;
} & {
  queryKey: readonly ["currencies", "details", {
    chainId: string;
    currencyAddress: `0x${string}`;
  }] & {
    [dataTagSymbol]: Currency | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/market/marketCurrencies.d.ts
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
declare function getMarketCurrenciesQueryKey(params: MarketCurrenciesQueryOptions): readonly ["currencies", "list", {
  chainId: string;
}, {
  readonly includeNativeCurrency: boolean | undefined;
  readonly collectionAddress: `0x${string}` | undefined;
}];
declare function marketCurrenciesQueryOptions(params: MarketCurrenciesQueryOptions): _tanstack_react_query63.OmitKeyof<_tanstack_react_query63.UseQueryOptions<{
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
}[], readonly ["currencies", "list", {
  chainId: string;
}, {
  readonly includeNativeCurrency: boolean | undefined;
  readonly collectionAddress: `0x${string}` | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query63.QueryFunction<{
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
  }[], readonly ["currencies", "list", {
    chainId: string;
  }, {
    readonly includeNativeCurrency: boolean | undefined;
    readonly collectionAddress: `0x${string}` | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["currencies", "list", {
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
export { CurrencyQueryOptions, FetchCurrencyParams, FetchMarketCurrenciesParams, MarketCurrenciesQueryOptions, currencyQueryOptions as currencyQueryOptions$1, fetchCurrency as fetchCurrency$1, fetchMarketCurrencies as fetchMarketCurrencies$1, getCurrencyQueryKey as getCurrencyQueryKey$1, getMarketCurrenciesQueryKey as getMarketCurrenciesQueryKey$1, marketCurrenciesQueryOptions as marketCurrenciesQueryOptions$1 };
//# sourceMappingURL=marketCurrencies-BZGc5A4x.d.ts.map