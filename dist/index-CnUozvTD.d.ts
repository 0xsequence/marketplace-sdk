import { $ as SdkConfig, $r as ListPrimarySaleItemsReturn, It as CollectiblePrimarySaleItem, Si as PrimarySaleItemsFilter, ir as GetCountOfPrimarySaleItemsReturn, mi as Page, rr as GetCountOfPrimarySaleItemsArgs, vr as GetPrimarySaleItemArgs, z as ValuesOptional } from "./create-config-Cws5O44a.js";
import { n as StandardQueryOptions } from "./query-C2OTGyRy.js";
import * as _tanstack_react_query391 from "@tanstack/react-query";
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
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query391.OmitKeyof<_tanstack_react_query391.UseQueryOptions<number, Error, number, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}`;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query391.QueryFunction<number, readonly ["primarySaleItemsCount", {
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
declare function primarySaleItemQueryOptions(params: PrimarySaleItemQueryOptions): _tanstack_react_query391.OmitKeyof<_tanstack_react_query391.UseQueryOptions<CollectiblePrimarySaleItem, Error, CollectiblePrimarySaleItem, readonly ["primarySaleItem", {
  chainId: string;
  primarySaleContractAddress: string | undefined;
  tokenId: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query391.QueryFunction<CollectiblePrimarySaleItem, readonly ["primarySaleItem", {
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
declare const listPrimarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query391.OmitKeyof<_tanstack_react_query391.UseInfiniteQueryOptions<ListPrimarySaleItemsReturn, Error, _tanstack_react_query391.InfiniteData<ListPrimarySaleItemsReturn, unknown>, readonly ["listPrimarySaleItems", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query391.QueryFunction<ListPrimarySaleItemsReturn, readonly ["listPrimarySaleItems", {
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
    [dataTagSymbol]: _tanstack_react_query391.InfiniteData<ListPrimarySaleItemsReturn, unknown>;
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
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query391.OmitKeyof<_tanstack_react_query391.UseQueryOptions<GetCountOfPrimarySaleItemsReturn, Error, GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query391.QueryFunction<GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
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
export { countOfPrimarySaleItemsOptions as _, primarySaleItemsCountQueryOptions as a, fetchPrimarySaleItems as c, FetchPrimarySaleItemParams as d, PrimarySaleItemQueryOptions as f, UseCountOfPrimarySaleItemsArgs as g, primarySaleItemQueryOptions as h, getPrimarySaleItemsCountQueryKey as i, getListPrimarySaleItemsQueryKey as l, getPrimarySaleItemQueryKey as m, PrimarySaleItemsCountQueryOptions as n, FetchPrimarySaleItemsParams as o, fetchPrimarySaleItem as p, fetchPrimarySaleItemsCount as r, ListPrimarySaleItemsQueryOptions as s, FetchPrimarySaleItemsCountParams as t, listPrimarySaleItemsQueryOptions as u, fetchCountOfPrimarySaleItems as v, getCountOfPrimarySaleItemsQueryKey as y };
//# sourceMappingURL=index-CnUozvTD.d.ts.map