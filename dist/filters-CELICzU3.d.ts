import { I as ValuesOptional, Y as SdkConfig } from "./create-config-Dz-QylqB.js";
import { n as StandardQueryOptions } from "./query-beMKmcH2.js";
import * as _tanstack_react_query318 from "@tanstack/react-query";
import { PropertyFilter } from "@0xsequence/metadata";

//#region src/react/queries/filters.d.ts
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
declare function filtersQueryOptions(params: FiltersQueryOptions): _tanstack_react_query318.OmitKeyof<_tanstack_react_query318.UseQueryOptions<PropertyFilter[], Error, PropertyFilter[], (string | FiltersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query318.QueryFunction<PropertyFilter[], (string | FiltersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | FiltersQueryOptions)[] & {
    [dataTagSymbol]: PropertyFilter[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { filtersQueryOptions as i, FiltersQueryOptions as n, fetchFilters as r, FetchFiltersParams as t };
//# sourceMappingURL=filters-CELICzU3.d.ts.map