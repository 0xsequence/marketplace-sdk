import { En as GetCollectionDetailRequest, G as SdkConfig, Tt as Collection, j as ValuesOptional } from "./create-config-BO68TZC5.js";
import { n as StandardQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query273 from "@tanstack/react-query";

//#region src/react/queries/collection/market-detail.d.ts
interface FetchMarketCollectionDetailParams extends Omit<GetCollectionDetailRequest, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
}
/**
 * Fetches collection details from the marketplace API
 */
declare function fetchMarketCollectionDetail(params: FetchMarketCollectionDetailParams): Promise<Collection>;
type MarketCollectionDetailQueryOptions = ValuesOptional<FetchMarketCollectionDetailParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionMarketDetailQueryKey(params: MarketCollectionDetailQueryOptions): readonly ["collection", "market-detail", {
  chainId: string;
  contractAddress: string | undefined;
}];
declare function collectionMarketDetailQueryOptions(params: MarketCollectionDetailQueryOptions): _tanstack_react_query273.OmitKeyof<_tanstack_react_query273.UseQueryOptions<Collection, Error, Collection, readonly ["collection", "market-detail", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query273.QueryFunction<Collection, readonly ["collection", "market-detail", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collection", "market-detail", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getCollectionMarketDetailQueryKey as a, fetchMarketCollectionDetail as i, MarketCollectionDetailQueryOptions as n, collectionMarketDetailQueryOptions as r, FetchMarketCollectionDetailParams as t };
//# sourceMappingURL=index-DCmSU1ru.d.ts.map