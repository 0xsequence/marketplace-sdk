import { J as SdkInfiniteQueryParams, Mn as index_d_exports$1, tt as WithRequired } from "./create-config.js";
import { Address } from "viem";
import * as _tanstack_react_query0 from "@tanstack/react-query";

//#region src/react/queries/token/supplies.d.ts
interface FetchTokenSuppliesParams extends Omit<index_d_exports$1.GetTokenSuppliesRequest, 'contractAddress' | 'collectionAddress'> {
  chainId: number;
  collectionAddress: Address;
  page?: index_d_exports$1.Page;
}
type TokenSuppliesQueryOptions = SdkInfiniteQueryParams<FetchTokenSuppliesParams>;
/**
 * Fetches token supplies with support for indexer API
 */
declare function fetchTokenSupplies(params: WithRequired<TokenSuppliesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<index_d_exports$1.GetTokenSuppliesResponse>;
declare function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions): readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly?: boolean;
  } | undefined;
}];
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query0.OmitKeyof<_tanstack_react_query0.UseInfiniteQueryOptions<index_d_exports$1.GetTokenSuppliesResponse, Error, _tanstack_react_query0.InfiniteData<index_d_exports$1.GetTokenSuppliesResponse, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly?: boolean;
  } | undefined;
}], index_d_exports$1.Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query0.QueryFunction<index_d_exports$1.GetTokenSuppliesResponse, readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly?: boolean;
    } | undefined;
  }], index_d_exports$1.Page> | undefined;
} & {
  queryKey: readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly?: boolean;
    } | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query0.InfiniteData<index_d_exports$1.GetTokenSuppliesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { tokenSuppliesQueryOptions as a, getTokenSuppliesQueryKey as i, TokenSuppliesQueryOptions as n, fetchTokenSupplies as r, FetchTokenSuppliesParams as t };
//# sourceMappingURL=index30.d.ts.map