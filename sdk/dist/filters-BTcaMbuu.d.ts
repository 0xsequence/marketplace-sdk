import { SdkConfig, ValuesOptional } from "./create-config-tyvmEx4z.js";
import { StandardQueryOptions } from "./query-4c83jPSr.js";
import * as _tanstack_react_query267 from "@tanstack/react-query";
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
declare function filtersQueryOptions(params: FiltersQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<PropertyFilter[], Error, PropertyFilter[], (string | FiltersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<PropertyFilter[], (string | FiltersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | FiltersQueryOptions)[] & {
    [dataTagSymbol]: PropertyFilter[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { FetchFiltersParams, FiltersQueryOptions, fetchFilters, filtersQueryOptions };
//# sourceMappingURL=filters-BTcaMbuu.d.ts.map