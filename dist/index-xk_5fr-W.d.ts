import { G as SdkConfig, j as ValuesOptional } from "./create-config-BO68TZC5.js";
import { t as StandardInfiniteQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query175 from "@tanstack/react-query";
import * as _0xsequence_indexer2 from "@0xsequence/indexer";
import { GetTokenSuppliesArgs, Page } from "@0xsequence/indexer";

//#region src/react/queries/token/supplies.d.ts
interface FetchTokenSuppliesParams extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  page?: Page;
}
/**
 * Fetches token supplies with support for indexer API
 */
declare function fetchTokenSupplies(params: FetchTokenSuppliesParams): Promise<_0xsequence_indexer2.GetTokenSuppliesReturn>;
type TokenSuppliesQueryOptions = ValuesOptional<FetchTokenSuppliesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions): readonly ["token", "supplies", {
  chainId: number;
  contractAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: _0xsequence_indexer2.MetadataOptions | undefined;
}];
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query175.OmitKeyof<_tanstack_react_query175.UseInfiniteQueryOptions<_0xsequence_indexer2.GetTokenSuppliesReturn, Error, _tanstack_react_query175.InfiniteData<_0xsequence_indexer2.GetTokenSuppliesReturn, unknown>, readonly ["token", "supplies", {
  chainId: number;
  contractAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: _0xsequence_indexer2.MetadataOptions | undefined;
}], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query175.QueryFunction<_0xsequence_indexer2.GetTokenSuppliesReturn, readonly ["token", "supplies", {
    chainId: number;
    contractAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: _0xsequence_indexer2.MetadataOptions | undefined;
  }], Page> | undefined;
} & {
  queryKey: readonly ["token", "supplies", {
    chainId: number;
    contractAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: _0xsequence_indexer2.MetadataOptions | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query175.InfiniteData<_0xsequence_indexer2.GetTokenSuppliesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { tokenSuppliesQueryOptions as a, getTokenSuppliesQueryKey as i, TokenSuppliesQueryOptions as n, fetchTokenSupplies as r, FetchTokenSuppliesParams as t };
//# sourceMappingURL=index-xk_5fr-W.d.ts.map