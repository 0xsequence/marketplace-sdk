import { Dn as WithRequired, xn as SdkQueryParams } from "./create-config.js";
import * as _0xsequence_api_client212 from "@0xsequence/api-client";
import { GetCollectionDetailRequest } from "@0xsequence/api-client";
import * as _tanstack_react_query153 from "@tanstack/react-query";

//#region src/react/queries/collection/market-detail.d.ts
type MarketCollectionDetailQueryOptions = SdkQueryParams<GetCollectionDetailRequest>;
/**
 * Fetches collection details from the marketplace API
 */
declare function fetchMarketCollectionDetail(params: WithRequired<MarketCollectionDetailQueryOptions, 'collectionAddress' | 'chainId' | 'config'>): Promise<_0xsequence_api_client212.Collection>;
declare function getCollectionMarketDetailQueryKey(params: MarketCollectionDetailQueryOptions): readonly ["collection", "market-detail", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
}];
declare function collectionMarketDetailQueryOptions(params: MarketCollectionDetailQueryOptions): _tanstack_react_query153.OmitKeyof<_tanstack_react_query153.UseQueryOptions<_0xsequence_api_client212.Collection, Error, _0xsequence_api_client212.Collection, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query153.QueryFunction<_0xsequence_api_client212.Collection, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _0xsequence_api_client212.Collection;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getCollectionMarketDetailQueryKey as i, collectionMarketDetailQueryOptions as n, fetchMarketCollectionDetail as r, MarketCollectionDetailQueryOptions as t };
//# sourceMappingURL=index24.d.ts.map