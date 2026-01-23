import { gn as PropertyFilter, mt as GetFiltersArgs } from "./index2.js";
import { W as SdkQueryParams, X as WithRequired, it as WithOptionalParams } from "./create-config.js";
import * as _tanstack_react_query429 from "@tanstack/react-query";

//#region src/react/queries/marketplace/filters.d.ts
type FetchFiltersParams = GetFiltersArgs;
/**
 * Fetches collection filters from the Metadata API with optional marketplace filtering
 */
declare function fetchFilters(params: WithRequired<FiltersQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<PropertyFilter[]>;
type FiltersQueryOptions = SdkQueryParams<FetchFiltersParams>;
declare function getFiltersQueryKey(params: FiltersQueryOptions): readonly ["marketplace", string, {
  showAllFilters: boolean | undefined;
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
  excludeProperties: undefined;
  excludePropertyValues: boolean | undefined;
}];
declare function filtersQueryOptions(params: WithOptionalParams<WithRequired<FiltersQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query429.OmitKeyof<_tanstack_react_query429.UseQueryOptions<PropertyFilter[], Error, PropertyFilter[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query429.QueryFunction<PropertyFilter[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: PropertyFilter[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getFiltersQueryKey as a, filtersQueryOptions as i, FiltersQueryOptions as n, fetchFilters as r, FetchFiltersParams as t };
//# sourceMappingURL=filters.d.ts.map