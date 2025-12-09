import { Dn as WithRequired, bn as SdkInfiniteQueryParams } from "./create-config.js";
import { Indexer } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query59 from "@tanstack/react-query";

//#region src/react/queries/token/supplies.d.ts
interface FetchTokenSuppliesParams extends Omit<Indexer.GetTokenSuppliesRequest, 'contractAddress' | 'collectionAddress'> {
  chainId: number;
  collectionAddress: Address$1;
  page?: Indexer.Page;
}
type TokenSuppliesQueryOptions = SdkInfiniteQueryParams<FetchTokenSuppliesParams>;
/**
 * Fetches token supplies with support for indexer API
 */
declare function fetchTokenSupplies(params: WithRequired<TokenSuppliesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<Indexer.GetTokenSuppliesResponse>;
declare function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions): readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly?: boolean;
  } | undefined;
}];
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query59.OmitKeyof<_tanstack_react_query59.UseInfiniteQueryOptions<Indexer.GetTokenSuppliesResponse, Error, _tanstack_react_query59.InfiniteData<Indexer.GetTokenSuppliesResponse, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly?: boolean;
  } | undefined;
}], Indexer.Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query59.QueryFunction<Indexer.GetTokenSuppliesResponse, readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly?: boolean;
    } | undefined;
  }], Indexer.Page> | undefined;
} & {
  queryKey: readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly?: boolean;
    } | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query59.InfiniteData<Indexer.GetTokenSuppliesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { tokenSuppliesQueryOptions as a, getTokenSuppliesQueryKey as i, TokenSuppliesQueryOptions as n, fetchTokenSupplies as r, FetchTokenSuppliesParams as t };
//# sourceMappingURL=index28.d.ts.map