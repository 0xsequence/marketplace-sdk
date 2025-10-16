import { CheckoutOptionsItem, CheckoutOptionsMarketplaceArgs, CheckoutOptionsMarketplaceReturn, CheckoutOptionsSalesContractArgs, CheckoutOptionsSalesContractReturn, ContractType, GetCountOfPrimarySaleItemsArgs, GetCountOfPrimarySaleItemsReturn, ListPrimarySaleItemsReturn, MarketplaceKind, MetadataStatus, Page, PrimarySaleItemsFilter, SdkConfig, ValuesOptional } from "./create-config-BpPJGqAC.js";
import { StandardQueryOptions } from "./query-BG-MA1MB.js";
import * as _tanstack_react_query270 from "@tanstack/react-query";
import * as _tanstack_react_query273 from "@tanstack/react-query";
import * as _tanstack_react_query288 from "@tanstack/react-query";
import * as _tanstack_react_query291 from "@tanstack/react-query";
import * as _tanstack_react_query303 from "@tanstack/react-query";
import * as _tanstack_react_query320 from "@tanstack/react-query";
import * as _tanstack_react_query361 from "@tanstack/react-query";
import * as _tanstack_react_query366 from "@tanstack/react-query";
import { ContractInfo } from "@0xsequence/indexer";
import { Address } from "viem";

//#region src/react/queries/checkoutOptions.d.ts
interface FetchCheckoutOptionsParams extends Omit<CheckoutOptionsMarketplaceArgs, 'chainId' | 'wallet' | 'orders'> {
  chainId: number;
  walletAddress: Address;
  orders: Array<{
    collectionAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }>;
  config: SdkConfig;
}
/**
 * Fetches checkout options from the Marketplace API
 */
declare function fetchCheckoutOptions(params: FetchCheckoutOptionsParams): Promise<CheckoutOptionsMarketplaceReturn>;
type CheckoutOptionsQueryOptions = ValuesOptional<FetchCheckoutOptionsParams> & {
  query?: StandardQueryOptions;
};
declare function checkoutOptionsQueryOptions(params: CheckoutOptionsQueryOptions): _tanstack_react_query270.OmitKeyof<_tanstack_react_query270.UseQueryOptions<CheckoutOptionsMarketplaceReturn, Error, CheckoutOptionsMarketplaceReturn, (string | CheckoutOptionsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query270.QueryFunction<CheckoutOptionsMarketplaceReturn, (string | CheckoutOptionsQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | CheckoutOptionsQueryOptions)[] & {
    [dataTagSymbol]: CheckoutOptionsMarketplaceReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/checkoutOptionsSalesContract.d.ts
interface FetchCheckoutOptionsSalesContractParams extends Omit<CheckoutOptionsSalesContractArgs, 'chainId' | 'wallet'> {
  chainId: number;
  walletAddress: Address;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
  config: SdkConfig;
}
/**
 * Fetches checkout options for sales contract from the Marketplace API
 */
declare function fetchCheckoutOptionsSalesContract(params: FetchCheckoutOptionsSalesContractParams): Promise<CheckoutOptionsSalesContractReturn>;
type CheckoutOptionsSalesContractQueryOptions = ValuesOptional<FetchCheckoutOptionsSalesContractParams> & {
  query?: StandardQueryOptions;
};
declare function checkoutOptionsSalesContractQueryOptions(params: CheckoutOptionsSalesContractQueryOptions): _tanstack_react_query273.OmitKeyof<_tanstack_react_query273.UseQueryOptions<CheckoutOptionsSalesContractReturn, Error, CheckoutOptionsSalesContractReturn, (string | CheckoutOptionsSalesContractQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query273.QueryFunction<CheckoutOptionsSalesContractReturn, (string | CheckoutOptionsSalesContractQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | CheckoutOptionsSalesContractQueryOptions)[] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/comparePrices.d.ts
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
declare function comparePricesQueryOptions(params: ComparePricesQueryOptions): _tanstack_react_query288.OmitKeyof<_tanstack_react_query288.UseQueryOptions<ComparePricesReturn, Error, ComparePricesReturn, (string | ComparePricesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query288.QueryFunction<ComparePricesReturn, (string | ComparePricesQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ComparePricesQueryOptions)[] & {
    [dataTagSymbol]: ComparePricesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/convertPriceToUSD.d.ts
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
declare function convertPriceToUSDQueryOptions(params: ConvertPriceToUSDQueryOptions): _tanstack_react_query291.OmitKeyof<_tanstack_react_query291.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, (string | ConvertPriceToUSDQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query291.QueryFunction<ConvertPriceToUSDReturn, (string | ConvertPriceToUSDQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ConvertPriceToUSDQueryOptions)[] & {
    [dataTagSymbol]: ConvertPriceToUSDReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/countOfPrimarySaleItems.d.ts
interface UseCountOfPrimarySaleItemsArgs extends Omit<GetCountOfPrimarySaleItemsArgs, 'chainId' | 'primarySaleContractAddress'> {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  query?: {
    enabled?: boolean;
  };
}
declare function fetchCountOfPrimarySaleItems(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): Promise<number>;
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query303.OmitKeyof<_tanstack_react_query303.UseQueryOptions<number, Error, number, (string | UseCountOfPrimarySaleItemsArgs)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query303.QueryFunction<number, (string | UseCountOfPrimarySaleItemsArgs)[], never> | undefined;
} & {
  queryKey: (string | UseCountOfPrimarySaleItemsArgs)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/inventory.d.ts
interface UseInventoryArgs {
  accountAddress: Address;
  collectionAddress: Address;
  chainId: number;
  isLaos721?: boolean;
  includeNonTradable?: boolean;
  query?: {
    enabled?: boolean;
    page?: number;
    pageSize?: number;
  };
}
interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
  isLaos721: boolean;
}
interface CollectibleWithBalance {
  metadata: {
    tokenId: string;
    attributes: Array<any>;
    image?: string;
    name: string;
    description?: string;
    video?: string;
    audio?: string;
    status: MetadataStatus;
  };
  balance: string;
  contractInfo?: ContractInfo;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
}
interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: Page;
  isTradable: boolean;
}
declare function fetchInventory(args: GetInventoryArgs, config: SdkConfig, page: Page): Promise<CollectiblesResponse>;
declare function inventoryOptions(args: UseInventoryArgs, config: SdkConfig): _tanstack_react_query320.OmitKeyof<_tanstack_react_query320.UseQueryOptions<CollectiblesResponse, Error, CollectiblesResponse, (string | number)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query320.QueryFunction<CollectiblesResponse, (string | number)[], never> | undefined;
} & {
  queryKey: (string | number)[] & {
    [dataTagSymbol]: CollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/primarySaleItems.d.ts
interface FetchPrimarySaleItemsParams {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  page?: Page;
  config: SdkConfig;
}
/**
 * Fetches primary sale items from the marketplace API
 */
declare function fetchPrimarySaleItems(params: FetchPrimarySaleItemsParams): Promise<ListPrimarySaleItemsReturn>;
type ListPrimarySaleItemsQueryOptions = ValuesOptional<FetchPrimarySaleItemsParams> & {
  query?: StandardQueryOptions;
};
declare const listPrimarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query361.OmitKeyof<_tanstack_react_query361.UseInfiniteQueryOptions<ListPrimarySaleItemsReturn, Error, _tanstack_react_query361.InfiniteData<ListPrimarySaleItemsReturn, unknown>, (string | ListPrimarySaleItemsQueryOptions)[], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query361.QueryFunction<ListPrimarySaleItemsReturn, (string | ListPrimarySaleItemsQueryOptions)[], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: (string | ListPrimarySaleItemsQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query361.InfiniteData<ListPrimarySaleItemsReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/primarySaleItemsCount.d.ts
interface FetchPrimarySaleItemsCountParams {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  config: SdkConfig;
}
/**
 * Fetches the count of primary sale items from the marketplace API
 */
declare function fetchPrimarySaleItemsCount(params: FetchPrimarySaleItemsCountParams): Promise<GetCountOfPrimarySaleItemsReturn>;
type PrimarySaleItemsCountQueryOptions = Partial<FetchPrimarySaleItemsCountParams> & {
  query?: StandardQueryOptions;
};
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query366.OmitKeyof<_tanstack_react_query366.UseQueryOptions<GetCountOfPrimarySaleItemsReturn, Error, GetCountOfPrimarySaleItemsReturn, (string | PrimarySaleItemsCountQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query366.QueryFunction<GetCountOfPrimarySaleItemsReturn, (string | PrimarySaleItemsCountQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | PrimarySaleItemsCountQueryOptions)[] & {
    [dataTagSymbol]: GetCountOfPrimarySaleItemsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CheckoutOptionsQueryOptions, CheckoutOptionsSalesContractQueryOptions, CollectiblesResponse, ComparePricesQueryOptions, ComparePricesReturn, ConvertPriceToUSDQueryOptions, ConvertPriceToUSDReturn, FetchCheckoutOptionsParams, FetchCheckoutOptionsSalesContractParams, FetchComparePricesParams, FetchConvertPriceToUSDParams, FetchPrimarySaleItemsCountParams, FetchPrimarySaleItemsParams, ListPrimarySaleItemsQueryOptions, PrimarySaleItemsCountQueryOptions, UseCountOfPrimarySaleItemsArgs, UseInventoryArgs, checkoutOptionsQueryOptions as checkoutOptionsQueryOptions$1, checkoutOptionsSalesContractQueryOptions as checkoutOptionsSalesContractQueryOptions$1, comparePricesQueryOptions as comparePricesQueryOptions$1, convertPriceToUSDQueryOptions as convertPriceToUSDQueryOptions$1, countOfPrimarySaleItemsOptions as countOfPrimarySaleItemsOptions$1, fetchCheckoutOptions as fetchCheckoutOptions$1, fetchCheckoutOptionsSalesContract as fetchCheckoutOptionsSalesContract$1, fetchComparePrices as fetchComparePrices$1, fetchConvertPriceToUSD as fetchConvertPriceToUSD$1, fetchCountOfPrimarySaleItems as fetchCountOfPrimarySaleItems$1, fetchInventory as fetchInventory$1, fetchPrimarySaleItems as fetchPrimarySaleItems$1, fetchPrimarySaleItemsCount as fetchPrimarySaleItemsCount$1, inventoryOptions as inventoryOptions$1, listPrimarySaleItemsQueryOptions as listPrimarySaleItemsQueryOptions$1, primarySaleItemsCountQueryOptions as primarySaleItemsCountQueryOptions$1 };
//# sourceMappingURL=index-DZmZlG0I.d.ts.map