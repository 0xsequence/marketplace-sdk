import { $ as SdkConfig, z as ValuesOptional } from "./create-config-BA_ne-vj.js";
import { n as StandardQueryOptions } from "./query-C2OTGyRy.js";
import * as _tanstack_react_query112 from "@tanstack/react-query";
import { PropertyFilter } from "@0xsequence/metadata";

//#region src/react/queries/market/filters.d.ts
interface FetchFiltersParams {
  chainId: number;
  collectionAddress: string;
  showAllFilters?: boolean;
  excludePropertyValues?: boolean;
  config: SdkConfig;
}
/**
 * Fetches collection filters from the Metadata API with optional marketplace filtering
 */
declare function fetchFilters(params: FetchFiltersParams): Promise<PropertyFilter[]>;
type FiltersQueryOptions = ValuesOptional<FetchFiltersParams> & {
  query?: StandardQueryOptions;
};
declare function getFiltersQueryKey(params: FiltersQueryOptions): readonly ["filters", {
  chainID: string;
  contractAddress: string | undefined;
  excludeProperties: undefined;
  excludePropertyValues: boolean | undefined;
}, {
  readonly showAllFilters: boolean | undefined;
}];
declare function filtersQueryOptions(params: FiltersQueryOptions): _tanstack_react_query112.OmitKeyof<_tanstack_react_query112.UseQueryOptions<PropertyFilter[], Error, PropertyFilter[], readonly ["filters", {
  chainID: string;
  contractAddress: string | undefined;
  excludeProperties: undefined;
  excludePropertyValues: boolean | undefined;
}, {
  readonly showAllFilters: boolean | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query112.QueryFunction<PropertyFilter[], readonly ["filters", {
    chainID: string;
    contractAddress: string | undefined;
    excludeProperties: undefined;
    excludePropertyValues: boolean | undefined;
  }, {
    readonly showAllFilters: boolean | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["filters", {
    chainID: string;
    contractAddress: string | undefined;
    excludeProperties: undefined;
    excludePropertyValues: boolean | undefined;
  }, {
    readonly showAllFilters: boolean | undefined;
  }] & {
    [dataTagSymbol]: PropertyFilter[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getFiltersQueryKey as a, filtersQueryOptions as i, FiltersQueryOptions as n, fetchFilters as r, FetchFiltersParams as t };
//# sourceMappingURL=filters-CTdOlrPO.d.ts.map