import { At as MetadataOptions$1, Dt as GetTokenSuppliesRequest, Ft as Address$1, Ot as GetTokenSuppliesResponse, jt as Page$1 } from "./index2.js";
import { U as SdkInfiniteQueryParams, X as WithRequired } from "./create-config.js";
import * as _0xsequence_indexer0 from "@0xsequence/indexer";
import * as _tanstack_react_query116 from "@tanstack/react-query";

//#region src/react/queries/token/supplies.d.ts
type FetchTokenSuppliesParams = Omit<GetTokenSuppliesRequest, 'contractAddress' | 'collectionAddress'> & {
  chainId: number;
  collectionAddress: Address$1;
  page?: Page$1;
};
type TokenSuppliesQueryOptions = SdkInfiniteQueryParams<FetchTokenSuppliesParams>;
/**
 * Fetches token supplies with support for indexer API
 */
declare function fetchTokenSupplies(params: WithRequired<TokenSuppliesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<GetTokenSuppliesResponse>;
declare function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions): readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: MetadataOptions$1 | undefined;
}];
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query116.OmitKeyof<_tanstack_react_query116.UseInfiniteQueryOptions<GetTokenSuppliesResponse, Error, _tanstack_react_query116.InfiniteData<GetTokenSuppliesResponse, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: MetadataOptions$1 | undefined;
}], _0xsequence_indexer0.Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query116.QueryFunction<GetTokenSuppliesResponse, readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: MetadataOptions$1 | undefined;
  }], _0xsequence_indexer0.Page> | undefined;
} & {
  queryKey: readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: MetadataOptions$1 | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query116.InfiniteData<GetTokenSuppliesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { tokenSuppliesQueryOptions as a, getTokenSuppliesQueryKey as i, TokenSuppliesQueryOptions as n, fetchTokenSupplies as r, FetchTokenSuppliesParams as t };
//# sourceMappingURL=index31.d.ts.map