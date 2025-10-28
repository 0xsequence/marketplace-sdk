import { $ as SdkConfig, $r as ListPrimarySaleItemsReturn, Si as PrimarySaleItemsFilter, ir as GetCountOfPrimarySaleItemsReturn, mi as Page, rr as GetCountOfPrimarySaleItemsArgs, z as ValuesOptional } from "./create-config-DL-Ld095.js";
import { n as StandardQueryOptions } from "./query-D8sokOq-.js";
import * as _tanstack_react_query292 from "@tanstack/react-query";
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
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query292.OmitKeyof<_tanstack_react_query292.UseQueryOptions<number, Error, number, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}`;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query292.QueryFunction<number, readonly ["primarySaleItemsCount", {
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
declare const listPrimarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query292.OmitKeyof<_tanstack_react_query292.UseInfiniteQueryOptions<ListPrimarySaleItemsReturn, Error, _tanstack_react_query292.InfiniteData<ListPrimarySaleItemsReturn, unknown>, readonly ["listPrimarySaleItems", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query292.QueryFunction<ListPrimarySaleItemsReturn, readonly ["listPrimarySaleItems", {
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
    [dataTagSymbol]: _tanstack_react_query292.InfiniteData<ListPrimarySaleItemsReturn, unknown>;
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
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query292.OmitKeyof<_tanstack_react_query292.UseQueryOptions<GetCountOfPrimarySaleItemsReturn, Error, GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query292.QueryFunction<GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
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
export { primarySaleItemsCountQueryOptions as a, fetchPrimarySaleItems as c, UseCountOfPrimarySaleItemsArgs as d, countOfPrimarySaleItemsOptions as f, getPrimarySaleItemsCountQueryKey as i, getListPrimarySaleItemsQueryKey as l, getCountOfPrimarySaleItemsQueryKey as m, PrimarySaleItemsCountQueryOptions as n, FetchPrimarySaleItemsParams as o, fetchCountOfPrimarySaleItems as p, fetchPrimarySaleItemsCount as r, ListPrimarySaleItemsQueryOptions as s, FetchPrimarySaleItemsCountParams as t, listPrimarySaleItemsQueryOptions as u };
//# sourceMappingURL=index-BSEk4iEB.d.ts.map