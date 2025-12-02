import { SdkConfig, ValuesOptional } from "./create-config-CsagtMvq.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query60 from "@tanstack/react-query";
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
declare function filtersQueryOptions(params: FiltersQueryOptions): _tanstack_react_query60.OmitKeyof<_tanstack_react_query60.UseQueryOptions<PropertyFilter[], Error, PropertyFilter[], readonly ["filters", {
  chainID: string;
  contractAddress: string | undefined;
  excludeProperties: undefined;
  excludePropertyValues: boolean | undefined;
}, {
  readonly showAllFilters: boolean | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query60.QueryFunction<PropertyFilter[], readonly ["filters", {
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
export { FetchFiltersParams, FiltersQueryOptions, fetchFilters as fetchFilters$1, filtersQueryOptions as filtersQueryOptions$1, getFiltersQueryKey as getFiltersQueryKey$1 };
//# sourceMappingURL=filters-C4MMcUOP.d.ts.map