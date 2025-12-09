import { Dn as WithRequired, Fn as WithOptionalParams, xn as SdkQueryParams } from "./create-config.js";
import { GetCountOfPrimarySaleItemsRequest, GetCountOfPrimarySaleItemsResponse, PrimarySaleItemsFilter } from "@0xsequence/api-client";
import * as _tanstack_react_query174 from "@tanstack/react-query";

//#region src/react/queries/collectible/primary-sale-items-count.d.ts
interface FetchPrimarySaleItemsCountParams extends GetCountOfPrimarySaleItemsRequest {
  filter?: PrimarySaleItemsFilter;
}
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
declare const primarySaleItemsCountQueryOptions: (params: WithOptionalParams<WithRequired<PrimarySaleItemsCountQueryOptions, "primarySaleContractAddress" | "chainId" | "config">>) => _tanstack_react_query174.OmitKeyof<_tanstack_react_query174.UseQueryOptions<GetCountOfPrimarySaleItemsResponse, Error, GetCountOfPrimarySaleItemsResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query174.QueryFunction<GetCountOfPrimarySaleItemsResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: GetCountOfPrimarySaleItemsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { primarySaleItemsCountQueryOptions as a, getPrimarySaleItemsCountQueryKey as i, PrimarySaleItemsCountQueryOptions as n, fetchPrimarySaleItemsCount as r, FetchPrimarySaleItemsCountParams as t };
//# sourceMappingURL=index23.d.ts.map