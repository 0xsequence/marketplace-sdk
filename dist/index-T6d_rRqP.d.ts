import { GetCountOfPrimarySaleItemsArgs, GetCountOfPrimarySaleItemsReturn, ListPrimarySaleItemsReturn, Page, PrimarySaleItemsFilter, SdkConfig, ValuesOptional } from "./create-config-BJwAgEA2.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query93 from "@tanstack/react-query";
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
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query93.OmitKeyof<_tanstack_react_query93.UseQueryOptions<number, Error, number, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}`;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query93.QueryFunction<number, readonly ["primarySaleItemsCount", {
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
declare const listPrimarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query93.OmitKeyof<_tanstack_react_query93.UseInfiniteQueryOptions<ListPrimarySaleItemsReturn, Error, _tanstack_react_query93.InfiniteData<ListPrimarySaleItemsReturn, unknown>, readonly ["listPrimarySaleItems", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query93.QueryFunction<ListPrimarySaleItemsReturn, readonly ["listPrimarySaleItems", {
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
    [dataTagSymbol]: _tanstack_react_query93.InfiniteData<ListPrimarySaleItemsReturn, unknown>;
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
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query93.OmitKeyof<_tanstack_react_query93.UseQueryOptions<GetCountOfPrimarySaleItemsReturn, Error, GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query93.QueryFunction<GetCountOfPrimarySaleItemsReturn, readonly ["primarySaleItemsCount", {
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
export { FetchPrimarySaleItemsCountParams, FetchPrimarySaleItemsParams, ListPrimarySaleItemsQueryOptions, PrimarySaleItemsCountQueryOptions, UseCountOfPrimarySaleItemsArgs, countOfPrimarySaleItemsOptions, fetchCountOfPrimarySaleItems, fetchPrimarySaleItems, fetchPrimarySaleItemsCount, getCountOfPrimarySaleItemsQueryKey, getListPrimarySaleItemsQueryKey, getPrimarySaleItemsCountQueryKey, listPrimarySaleItemsQueryOptions, primarySaleItemsCountQueryOptions };
//# sourceMappingURL=index-T6d_rRqP.d.ts.map