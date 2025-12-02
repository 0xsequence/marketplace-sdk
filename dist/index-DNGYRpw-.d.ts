import { CollectiblePrimarySaleItem, GetCountOfPrimarySaleItemsArgs, GetCountOfPrimarySaleItemsReturn, GetPrimarySaleItemArgs, ListPrimarySaleItemsReturn, Page, PrimarySaleItemsFilter, SdkConfig, ValuesOptional } from "./create-config-CsagtMvq.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query6 from "@tanstack/react-query";
import * as _tanstack_react_query9 from "@tanstack/react-query";
import * as _tanstack_react_query12 from "@tanstack/react-query";
import * as _tanstack_react_query0 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/primary-sales/countOfPrimarySaleItems.d.ts
interface UseCountOfPrimarySaleItemsArgs extends Omit<GetCountOfPrimarySaleItemsArgs, 'chainId' | 'primarySaleContractAddress'> {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  query?: {
    enabled?: boolean;
  };
}
declare function fetchCountOfPrimarySaleItems(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): Promise<number>;
declare function getCountOfPrimarySaleItemsQueryKey(args: UseCountOfPrimarySaleItemsArgs): readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}`;
  filter: PrimarySaleItemsFilter | undefined;
}];
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query6.OmitKeyof<_tanstack_react_query6.UseQueryOptions<number, Error, number, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}`;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query6.QueryFunction<number, readonly ["primarySaleItemsCount", {
    chainId: string;
    primarySaleContractAddress: `0x${string}`;
    filter: PrimarySaleItemsFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["primarySaleItemsCount", {
    chainId: string;
    primarySaleContractAddress: `0x${string}`;
    filter: PrimarySaleItemsFilter | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/primary-sales/primarySaleItem.d.ts
interface FetchPrimarySaleItemParams extends Omit<GetPrimarySaleItemArgs, 'chainId'> {
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches a single primary sale item from the marketplace API
 */
declare function fetchPrimarySaleItem(params: FetchPrimarySaleItemParams): Promise<CollectiblePrimarySaleItem>;
type PrimarySaleItemQueryOptions = ValuesOptional<FetchPrimarySaleItemParams> & {
  query?: StandardQueryOptions;
};
declare function getPrimarySaleItemQueryKey(params: PrimarySaleItemQueryOptions): readonly ["primarySaleItem", {
  chainId: string;
  primarySaleContractAddress: string | undefined;
  tokenId: string | undefined;
}];
declare function primarySaleItemQueryOptions(params: PrimarySaleItemQueryOptions): _tanstack_react_query9.OmitKeyof<_tanstack_react_query9.UseQueryOptions<CollectiblePrimarySaleItem, Error, CollectiblePrimarySaleItem, readonly ["primarySaleItem", {
  chainId: string;
  primarySaleContractAddress: string | undefined;
  tokenId: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query9.QueryFunction<CollectiblePrimarySaleItem, readonly ["primarySaleItem", {
    chainId: string;
    primarySaleContractAddress: string | undefined;
    tokenId: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["primarySaleItem", {
    chainId: string;
    primarySaleContractAddress: string | undefined;
    tokenId: string | undefined;
  }] & {
    [dataTagSymbol]: CollectiblePrimarySaleItem;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/primary-sales/primarySaleItems.d.ts
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
declare function getListPrimarySaleItemsQueryKey(params: ListPrimarySaleItemsQueryOptions): readonly ["listPrimarySaleItems", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}];
declare const listPrimarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query12.OmitKeyof<_tanstack_react_query12.UseInfiniteQueryOptions<ListPrimarySaleItemsReturn, Error, _tanstack_react_query12.InfiniteData<ListPrimarySaleItemsReturn, unknown>, readonly ["listPrimarySaleItems", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query12.QueryFunction<ListPrimarySaleItemsReturn, readonly ["listPrimarySaleItems", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["listPrimarySaleItems", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query12.InfiniteData<ListPrimarySaleItemsReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/primary-sales/primarySaleItemsCount.d.ts
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
declare function getPrimarySaleItemsCountQueryKey(args: PrimarySaleItemsCountQueryOptions): readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}];
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query0.OmitKeyof<_tanstack_react_query0.UseQueryOptions<GetCountOfPrimarySaleItemsReturn, Error, GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query0.QueryFunction<GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["primarySaleItemsCount", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }] & {
    [dataTagSymbol]: GetCountOfPrimarySaleItemsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { FetchPrimarySaleItemParams, FetchPrimarySaleItemsCountParams, FetchPrimarySaleItemsParams, ListPrimarySaleItemsQueryOptions, PrimarySaleItemQueryOptions, PrimarySaleItemsCountQueryOptions, UseCountOfPrimarySaleItemsArgs, countOfPrimarySaleItemsOptions as countOfPrimarySaleItemsOptions$1, fetchCountOfPrimarySaleItems as fetchCountOfPrimarySaleItems$1, fetchPrimarySaleItem as fetchPrimarySaleItem$1, fetchPrimarySaleItems as fetchPrimarySaleItems$1, fetchPrimarySaleItemsCount as fetchPrimarySaleItemsCount$1, getCountOfPrimarySaleItemsQueryKey as getCountOfPrimarySaleItemsQueryKey$1, getListPrimarySaleItemsQueryKey as getListPrimarySaleItemsQueryKey$1, getPrimarySaleItemQueryKey as getPrimarySaleItemQueryKey$1, getPrimarySaleItemsCountQueryKey as getPrimarySaleItemsCountQueryKey$1, listPrimarySaleItemsQueryOptions as listPrimarySaleItemsQueryOptions$1, primarySaleItemQueryOptions as primarySaleItemQueryOptions$1, primarySaleItemsCountQueryOptions as primarySaleItemsCountQueryOptions$1 };
//# sourceMappingURL=index-DNGYRpw-.d.ts.map