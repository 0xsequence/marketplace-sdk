import { Currency, CurrencyStatus, SdkConfig, ValuesOptional } from "./create-config-BQet0plq.js";
import { StandardQueryOptions } from "./query-BG-MA1MB.js";
import * as _tanstack_react_query47 from "@tanstack/react-query";
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
declare function currencyQueryOptions(params: CurrencyQueryOptions): _tanstack_react_query47.UseQueryOptions<Currency | undefined, Error, Currency | undefined, ("details" | "currencies" | CurrencyQueryOptions)[]> & {
  initialData?: Currency | _tanstack_react_query47.InitialDataFunction<Currency> | undefined;
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
declare function marketCurrenciesQueryOptions(params: MarketCurrenciesQueryOptions): _tanstack_react_query47.OmitKeyof<_tanstack_react_query47.UseQueryOptions<{
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
  queryFn?: _tanstack_react_query47.QueryFunction<{
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
export { CurrencyQueryOptions, FetchCurrencyParams, FetchMarketCurrenciesParams, MarketCurrenciesQueryOptions, currencyQueryOptions, fetchCurrency, fetchMarketCurrencies, marketCurrenciesQueryOptions };
//# sourceMappingURL=marketCurrencies-BST9ouuY.d.ts.map