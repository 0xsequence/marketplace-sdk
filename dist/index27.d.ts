import { h as GetCollectionDetailRequest, qt as Collection } from "./index2.js";
import { W as SdkQueryParams, X as WithRequired, it as WithOptionalParams } from "./create-config.js";
import * as _tanstack_react_query94 from "@tanstack/react-query";

//#region src/react/queries/collection/market-detail.d.ts
type MarketCollectionDetailQueryOptions = SdkQueryParams<GetCollectionDetailRequest>;
/**
 * Fetches collection details from the marketplace API
 */
declare function fetchMarketCollectionDetail(params: WithRequired<MarketCollectionDetailQueryOptions, 'collectionAddress' | 'chainId' | 'config'>): Promise<Collection>;
declare function getCollectionMarketDetailQueryKey(params: MarketCollectionDetailQueryOptions): readonly ["collection", "market-detail", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
}];
declare function collectionMarketDetailQueryOptions(params: WithOptionalParams<WithRequired<MarketCollectionDetailQueryOptions, 'collectionAddress' | 'chainId' | 'config'>>): _tanstack_react_query94.OmitKeyof<_tanstack_react_query94.UseQueryOptions<Collection, Error, Collection, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query94.QueryFunction<Collection, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getCollectionMarketDetailQueryKey as i, collectionMarketDetailQueryOptions as n, fetchMarketCollectionDetail as r, MarketCollectionDetailQueryOptions as t };
//# sourceMappingURL=index27.d.ts.map