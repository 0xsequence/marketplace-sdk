import { SdkConfig, ValuesOptional } from "./create-config-BJwAgEA2.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query65 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/utils/comparePrices.d.ts
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
declare function getComparePricesQueryKey(params: ComparePricesQueryOptions): readonly ["currencies", "conversion", "compare", {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: `0x${string}`;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: `0x${string}`;
}];
declare function comparePricesQueryOptions(params: ComparePricesQueryOptions): _tanstack_react_query65.OmitKeyof<_tanstack_react_query65.UseQueryOptions<ComparePricesReturn, Error, ComparePricesReturn, readonly ["currencies", "conversion", "compare", {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: `0x${string}`;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: `0x${string}`;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query65.QueryFunction<ComparePricesReturn, readonly ["currencies", "conversion", "compare", {
    chainId: number;
    priceAmountRaw: string;
    priceCurrencyAddress: `0x${string}`;
    compareToPriceAmountRaw: string;
    compareToPriceCurrencyAddress: `0x${string}`;
  }], never> | undefined;
} & {
  queryKey: readonly ["currencies", "conversion", "compare", {
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
//#region src/react/queries/utils/convertPriceToUSD.d.ts
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
declare function getConvertPriceToUSDQueryKey(params: ConvertPriceToUSDQueryOptions): readonly ["currencies", "conversion", "usd", {
  chainId: number;
  currencyAddress: `0x${string}`;
  amountRaw: string;
}];
declare function convertPriceToUSDQueryOptions(params: ConvertPriceToUSDQueryOptions): _tanstack_react_query65.OmitKeyof<_tanstack_react_query65.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, readonly ["currencies", "conversion", "usd", {
  chainId: number;
  currencyAddress: `0x${string}`;
  amountRaw: string;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query65.QueryFunction<ConvertPriceToUSDReturn, readonly ["currencies", "conversion", "usd", {
    chainId: number;
    currencyAddress: `0x${string}`;
    amountRaw: string;
  }], never> | undefined;
} & {
  queryKey: readonly ["currencies", "conversion", "usd", {
    chainId: number;
    currencyAddress: `0x${string}`;
    amountRaw: string;
  }] & {
    [dataTagSymbol]: ConvertPriceToUSDReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ComparePricesQueryOptions, ComparePricesReturn, ConvertPriceToUSDQueryOptions, ConvertPriceToUSDReturn, FetchComparePricesParams, FetchConvertPriceToUSDParams, comparePricesQueryOptions, convertPriceToUSDQueryOptions, fetchComparePrices, fetchConvertPriceToUSD, getComparePricesQueryKey, getConvertPriceToUSDQueryKey };
//# sourceMappingURL=index-C-iWLKd5.d.ts.map