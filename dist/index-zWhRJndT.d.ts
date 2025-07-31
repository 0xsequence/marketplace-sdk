import { CheckoutOptionsItem, CheckoutOptionsMarketplaceArgs, CheckoutOptionsMarketplaceReturn, CheckoutOptionsSalesContractArgs, CheckoutOptionsSalesContractReturn, CollectibleOrder, ContractType, GetCountOfPrimarySaleItemsArgs, GetCountOfPrimarySaleItemsReturn, ListPrimarySaleItemsReturn, MarketplaceKind, Page, PrimarySaleItemsFilter, SdkConfig, ValuesOptional } from "./create-config-CpiC1m8h.js";
import { StandardQueryOptions } from "./query-BTe7Wkrs.js";
import * as _tanstack_react_query84 from "@tanstack/react-query";
import * as _0xsequence_indexer0 from "@0xsequence/indexer";
import { ContractInfo, GetTokenBalancesReturn, GetTokenIDRangesReturn, GetTokenSuppliesArgs, Page as Page$1 } from "@0xsequence/indexer";
import * as _0xsequence_metadata43 from "@0xsequence/metadata";
import { Filter, Page as Page$2 } from "@0xsequence/metadata";
import { Address, Hex } from "viem";

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
declare function checkoutOptionsQueryOptions(params: CheckoutOptionsQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<CheckoutOptionsMarketplaceReturn, Error, CheckoutOptionsMarketplaceReturn, (string | CheckoutOptionsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<CheckoutOptionsMarketplaceReturn, (string | CheckoutOptionsQueryOptions)[], never> | undefined;
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
declare function checkoutOptionsSalesContractQueryOptions(params: CheckoutOptionsSalesContractQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<CheckoutOptionsSalesContractReturn, Error, CheckoutOptionsSalesContractReturn, (string | CheckoutOptionsSalesContractQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<CheckoutOptionsSalesContractReturn, (string | CheckoutOptionsSalesContractQueryOptions)[], never> | undefined;
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
declare function comparePricesQueryOptions(params: ComparePricesQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<ComparePricesReturn, Error, ComparePricesReturn, (string | ComparePricesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<ComparePricesReturn, (string | ComparePricesQueryOptions)[], never> | undefined;
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
declare function convertPriceToUSDQueryOptions(params: ConvertPriceToUSDQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, (string | ConvertPriceToUSDQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<ConvertPriceToUSDReturn, (string | ConvertPriceToUSDQueryOptions)[], never> | undefined;
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
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<number, Error, number, (string | UseCountOfPrimarySaleItemsArgs)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<number, (string | UseCountOfPrimarySaleItemsArgs)[], never> | undefined;
} & {
  queryKey: (string | UseCountOfPrimarySaleItemsArgs)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/getTokenRanges.d.ts
interface FetchGetTokenRangesParams {
  chainId: number;
  collectionAddress: Address;
  config: SdkConfig;
}
/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
declare function fetchGetTokenRanges(params: FetchGetTokenRangesParams): Promise<GetTokenIDRangesReturn>;
type GetTokenRangesQueryOptions = ValuesOptional<FetchGetTokenRangesParams> & {
  query?: StandardQueryOptions;
};
declare function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<GetTokenIDRangesReturn, Error, GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | GetTokenRangesQueryOptions)[] & {
    [dataTagSymbol]: GetTokenIDRangesReturn;
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
  query?: {
    enabled?: boolean;
  };
}
declare const clearInventoryState: () => void;
interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
  isLaos721: boolean;
}
interface CollectibleWithBalance extends CollectibleOrder {
  balance: string;
  contractInfo?: ContractInfo;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
}
interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: Page;
}
declare function fetchInventory(args: GetInventoryArgs, config: SdkConfig, page: Page): Promise<CollectiblesResponse>;
declare function inventoryOptions(args: UseInventoryArgs, config: SdkConfig): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseInfiniteQueryOptions<CollectiblesResponse, Error, _tanstack_react_query84.InfiniteData<CollectiblesResponse, unknown>, (string | number)[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<CollectiblesResponse, (string | number)[], Page> | undefined;
} & {
  queryKey: (string | number)[] & {
    [dataTagSymbol]: _tanstack_react_query84.InfiniteData<CollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listBalances.d.ts
type UseListBalancesArgs = {
  chainId: number;
  accountAddress?: Address;
  contractAddress?: Address;
  tokenId?: string;
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  };
  includeCollectionTokens?: boolean;
  page?: Page$1;
  isLaos721?: boolean;
  query?: {
    enabled?: boolean;
  };
};
declare function fetchBalances(args: UseListBalancesArgs, config: SdkConfig, page: Page$1): Promise<GetTokenBalancesReturn>;
/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function listBalancesOptions(args: UseListBalancesArgs, config: SdkConfig): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseInfiniteQueryOptions<GetTokenBalancesReturn, Error, _tanstack_react_query84.InfiniteData<GetTokenBalancesReturn, unknown>, (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[], any>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<GetTokenBalancesReturn, (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[], any> | undefined;
} & {
  queryKey: (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[] & {
    [dataTagSymbol]: _tanstack_react_query84.InfiniteData<GetTokenBalancesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listTokenMetadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: string;
  tokenIds: string[];
  config: SdkConfig;
}
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: FetchListTokenMetadataParams): Promise<_0xsequence_metadata43.TokenMetadata[]>;
type ListTokenMetadataQueryOptions = ValuesOptional<FetchListTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function listTokenMetadataQueryOptions(params: ListTokenMetadataQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<_0xsequence_metadata43.TokenMetadata[], Error, _0xsequence_metadata43.TokenMetadata[], ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<_0xsequence_metadata43.TokenMetadata[], ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[], never> | undefined;
} & {
  queryKey: ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata43.TokenMetadata[];
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
declare const listPrimarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseInfiniteQueryOptions<ListPrimarySaleItemsReturn, Error, _tanstack_react_query84.InfiniteData<ListPrimarySaleItemsReturn, unknown>, (string | ListPrimarySaleItemsQueryOptions)[], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<ListPrimarySaleItemsReturn, (string | ListPrimarySaleItemsQueryOptions)[], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: (string | ListPrimarySaleItemsQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query84.InfiniteData<ListPrimarySaleItemsReturn, unknown>;
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
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<GetCountOfPrimarySaleItemsReturn, Error, GetCountOfPrimarySaleItemsReturn, (string | PrimarySaleItemsCountQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<GetCountOfPrimarySaleItemsReturn, (string | PrimarySaleItemsCountQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | PrimarySaleItemsCountQueryOptions)[] & {
    [dataTagSymbol]: GetCountOfPrimarySaleItemsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/searchTokenMetadata.d.ts
interface FetchSearchTokenMetadataParams {
  chainId: number;
  collectionAddress: string;
  filter?: Filter;
  page?: Page$2;
  config: SdkConfig;
}
interface SearchTokenMetadataResponse {
  tokenMetadata: any[];
  page: Page$2;
}
/**
 * Fetches token metadata from the metadata API using search filters
 */
declare function fetchSearchTokenMetadata(params: FetchSearchTokenMetadataParams): Promise<SearchTokenMetadataResponse>;
type SearchTokenMetadataQueryOptions = ValuesOptional<FetchSearchTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseInfiniteQueryOptions<SearchTokenMetadataResponse, Error, _tanstack_react_query84.InfiniteData<SearchTokenMetadataResponse, unknown>, (string | SearchTokenMetadataQueryOptions)[], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<SearchTokenMetadataResponse, (string | SearchTokenMetadataQueryOptions)[], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: (string | SearchTokenMetadataQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query84.InfiniteData<SearchTokenMetadataResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokenSupplies.d.ts
interface FetchTokenSuppliesParams extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  isLaos721?: boolean;
}
/**
 * Fetches token supplies with support for both indexer and LAOS APIs
 * Uses the more efficient single-contract APIs from both services
 */
declare function fetchTokenSupplies(params: FetchTokenSuppliesParams): Promise<_0xsequence_indexer0.GetTokenSuppliesReturn>;
type TokenSuppliesQueryOptions = ValuesOptional<FetchTokenSuppliesParams> & {
  query?: StandardQueryOptions;
};
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query84.OmitKeyof<_tanstack_react_query84.UseQueryOptions<_0xsequence_indexer0.GetTokenSuppliesReturn, Error, _0xsequence_indexer0.GetTokenSuppliesReturn, ("tokens" | "supplies" | TokenSuppliesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query84.QueryFunction<_0xsequence_indexer0.GetTokenSuppliesReturn, ("tokens" | "supplies" | TokenSuppliesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("tokens" | "supplies" | TokenSuppliesQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_indexer0.GetTokenSuppliesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CheckoutOptionsQueryOptions, CheckoutOptionsSalesContractQueryOptions, CollectiblesResponse, ComparePricesQueryOptions, ComparePricesReturn, ConvertPriceToUSDQueryOptions, ConvertPriceToUSDReturn, FetchCheckoutOptionsParams, FetchCheckoutOptionsSalesContractParams, FetchComparePricesParams, FetchConvertPriceToUSDParams, FetchGetTokenRangesParams, FetchListTokenMetadataParams, FetchPrimarySaleItemsCountParams, FetchPrimarySaleItemsParams, FetchSearchTokenMetadataParams, FetchTokenSuppliesParams, GetTokenRangesQueryOptions, ListPrimarySaleItemsQueryOptions, ListTokenMetadataQueryOptions, PrimarySaleItemsCountQueryOptions, SearchTokenMetadataQueryOptions, SearchTokenMetadataResponse, TokenSuppliesQueryOptions, UseCountOfPrimarySaleItemsArgs, UseInventoryArgs, UseListBalancesArgs, checkoutOptionsQueryOptions, checkoutOptionsSalesContractQueryOptions, clearInventoryState, comparePricesQueryOptions, convertPriceToUSDQueryOptions, countOfPrimarySaleItemsOptions, fetchBalances, fetchCheckoutOptions, fetchCheckoutOptionsSalesContract, fetchComparePrices, fetchConvertPriceToUSD, fetchCountOfPrimarySaleItems, fetchGetTokenRanges, fetchInventory, fetchListTokenMetadata, fetchPrimarySaleItems, fetchPrimarySaleItemsCount, fetchSearchTokenMetadata, fetchTokenSupplies, getTokenRangesQueryOptions, inventoryOptions, listBalancesOptions, listPrimarySaleItemsQueryOptions, listTokenMetadataQueryOptions, primarySaleItemsCountQueryOptions, searchTokenMetadataQueryOptions, tokenSuppliesQueryOptions };
//# sourceMappingURL=index-zWhRJndT.d.ts.map