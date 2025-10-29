import { I as ValuesOptional, Qt as CurrencyStatus, Y as SdkConfig, Zt as Currency } from "./create-config-BdFQXjVv.js";
import { n as StandardQueryOptions } from "./query-beMKmcH2.js";
import * as _tanstack_react_query321 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/currency.d.ts
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
declare function currencyQueryOptions(params: CurrencyQueryOptions): _tanstack_react_query321.UseQueryOptions<Currency | undefined, Error, Currency | undefined, ("details" | "currencies" | CurrencyQueryOptions)[]> & {
  initialData?: Currency | _tanstack_react_query321.InitialDataFunction<Currency> | undefined;
} & {
  queryKey: ("details" | "currencies" | CurrencyQueryOptions)[] & {
    [dataTagSymbol]: Currency | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/marketCurrencies.d.ts
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
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[]>;
type MarketCurrenciesQueryOptions = ValuesOptional<FetchMarketCurrenciesParams> & {
  query?: StandardQueryOptions;
};
declare function marketCurrenciesQueryOptions(params: MarketCurrenciesQueryOptions): _tanstack_react_query321.OmitKeyof<_tanstack_react_query321.UseQueryOptions<{
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
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[], ("currencies" | "list" | MarketCurrenciesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query321.QueryFunction<{
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
  }[], ("currencies" | "list" | MarketCurrenciesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("currencies" | "list" | MarketCurrenciesQueryOptions)[] & {
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
      createdAt: string;
      updatedAt: string;
      deletedAt?: string;
    }[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CurrencyQueryOptions as a, fetchCurrency as c, marketCurrenciesQueryOptions as i, MarketCurrenciesQueryOptions as n, FetchCurrencyParams as o, fetchMarketCurrencies as r, currencyQueryOptions as s, FetchMarketCurrenciesParams as t };
//# sourceMappingURL=marketCurrencies-BrsEHIMu.d.ts.map