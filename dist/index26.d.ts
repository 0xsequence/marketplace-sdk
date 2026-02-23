import { hn as PrimarySaleItemsFilter, nn as GetCountOfPrimarySaleItemsResponse, x as GetCountOfPrimarySaleItemsRequest } from "./index2.js";
import { W as SdkQueryParams, X as WithRequired, it as WithOptionalParams } from "./create-config.js";
import * as _tanstack_react_query107 from "@tanstack/react-query";

//#region src/react/queries/collectible/primary-sale-items-count.d.ts
type FetchPrimarySaleItemsCountParams = GetCountOfPrimarySaleItemsRequest;
type PrimarySaleItemsCountQueryOptions = SdkQueryParams<FetchPrimarySaleItemsCountParams>;
/**
 * Fetches the count of primary sale items from the marketplace API
 */
declare function fetchPrimarySaleItemsCount(params: WithRequired<PrimarySaleItemsCountQueryOptions, 'chainId' | 'primarySaleContractAddress' | 'config'>): Promise<GetCountOfPrimarySaleItemsResponse>;
declare function getPrimarySaleItemsCountQueryKey(params: PrimarySaleItemsCountQueryOptions): readonly ["collectible", "primary-sale-items-count", {
  readonly chainId: number;
  readonly primarySaleContractAddress: string;
  readonly filter: PrimarySaleItemsFilter | undefined;
}];
declare const primarySaleItemsCountQueryOptions: (params: WithOptionalParams<WithRequired<PrimarySaleItemsCountQueryOptions, "primarySaleContractAddress" | "chainId" | "config">>) => _tanstack_react_query107.OmitKeyof<_tanstack_react_query107.UseQueryOptions<GetCountOfPrimarySaleItemsResponse, Error, GetCountOfPrimarySaleItemsResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query107.QueryFunction<GetCountOfPrimarySaleItemsResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: GetCountOfPrimarySaleItemsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { primarySaleItemsCountQueryOptions as a, getPrimarySaleItemsCountQueryKey as i, PrimarySaleItemsCountQueryOptions as n, fetchPrimarySaleItemsCount as r, FetchPrimarySaleItemsCountParams as t };
//# sourceMappingURL=index26.d.ts.map