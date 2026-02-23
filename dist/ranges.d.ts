import { At as MetadataOptions$1, Ct as GetTokenBalancesResponse, Et as GetTokenIDRangesResponse, Ft as Address$1, Tt as GetTokenIDRangesRequest, _t as SearchTokenMetadataReturn$1, fn as Page$2, gt as GetTokenMetadataSdkArgs, jt as Page$1, vt as SearchTokenMetadataSdkArgs, wt as GetTokenBalancesSdkRequest, yt as TokenMetadata$1 } from "./index2.js";
import { B as Optional, U as SdkInfiniteQueryParams, W as SdkQueryParams, X as WithRequired, it as WithOptionalParams, rt as WithOptionalInfiniteParams } from "./create-config.js";
import * as _0xsequence_metadata0 from "@0xsequence/metadata";
import * as _tanstack_react_query121 from "@tanstack/react-query";

//#region src/react/queries/token/balances.d.ts
type FetchBalancesParams = GetTokenBalancesSdkRequest & {
  includeCollectionTokens?: boolean;
};
type ListBalancesQueryOptions = SdkQueryParams<FetchBalancesParams>;
/**
 * Balances query params with accountAddress as required, contractAddress is optional
 */
type UseListBalancesParams = Optional<ListBalancesQueryOptions, 'config' | 'contractAddress'> & Required<Pick<ListBalancesQueryOptions, 'accountAddress'>>;
declare function fetchBalances(params: WithRequired<ListBalancesQueryOptions, 'chainId' | 'accountAddress' | 'config'>, page: Page$1): Promise<GetTokenBalancesResponse>;
declare function getListBalancesQueryKey(params: ListBalancesQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenId: bigint | undefined;
  includeMetadata: boolean | undefined;
  metadataOptions: MetadataOptions$1 | undefined;
  includeCollectionTokens: boolean | undefined;
}];
/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param params - The query parameters including config
 * @returns Query options configuration
 */
declare function listBalancesOptions(params: WithOptionalInfiniteParams<WithRequired<ListBalancesQueryOptions, 'chainId' | 'accountAddress' | 'config'>>): _tanstack_react_query121.OmitKeyof<_tanstack_react_query121.UseInfiniteQueryOptions<GetTokenBalancesResponse, Error, _tanstack_react_query121.InfiniteData<GetTokenBalancesResponse, unknown>, readonly unknown[], Page$2>, "queryFn"> & {
  queryFn?: _tanstack_react_query121.QueryFunction<GetTokenBalancesResponse, readonly unknown[], Page$2> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query121.InfiniteData<GetTokenBalancesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata.d.ts
type FetchListTokenMetadataParams = GetTokenMetadataSdkArgs;
type ListTokenMetadataQueryOptions = SdkQueryParams<FetchListTokenMetadataParams>;
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>): Promise<TokenMetadata$1[]>;
declare function getListTokenMetadataQueryKey(params: ListTokenMetadataQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenIds: bigint[] | undefined;
}];
declare function listTokenMetadataQueryOptions(params: WithOptionalParams<WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>>): _tanstack_react_query121.OmitKeyof<_tanstack_react_query121.UseQueryOptions<TokenMetadata$1[], Error, TokenMetadata$1[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query121.QueryFunction<TokenMetadata$1[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TokenMetadata$1[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata-search.d.ts
type FetchSearchTokenMetadataParams = SearchTokenMetadataSdkArgs;
type SearchTokenMetadataQueryOptions = SdkInfiniteQueryParams<FetchSearchTokenMetadataParams>;
/**
 * Fetches token metadata from the metadata API using search filters
 */
declare function fetchSearchTokenMetadata(params: WithRequired<SearchTokenMetadataQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<SearchTokenMetadataReturn$1>;
declare function getSearchTokenMetadataQueryKey(params: SearchTokenMetadataQueryOptions): readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  filter: _0xsequence_metadata0.Filter | undefined;
}];
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query121.OmitKeyof<_tanstack_react_query121.UseInfiniteQueryOptions<SearchTokenMetadataReturn$1, Error, _tanstack_react_query121.InfiniteData<SearchTokenMetadataReturn$1, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  filter: _0xsequence_metadata0.Filter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query121.QueryFunction<SearchTokenMetadataReturn$1, readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    filter: _0xsequence_metadata0.Filter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    filter: _0xsequence_metadata0.Filter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query121.InfiniteData<SearchTokenMetadataReturn$1, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/ranges.d.ts
type FetchGetTokenRangesParams = Extract<GetTokenIDRangesRequest, {
  collectionAddress: Address$1;
}> & {
  chainId: number;
};
type GetTokenRangesQueryOptions = SdkQueryParams<FetchGetTokenRangesParams>;
/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
declare function fetchGetTokenRanges(params: WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<GetTokenIDRangesResponse>;
declare function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
}];
declare function getTokenRangesQueryOptions(params: WithOptionalParams<WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query121.OmitKeyof<_tanstack_react_query121.UseQueryOptions<GetTokenIDRangesResponse, Error, GetTokenIDRangesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query121.QueryFunction<GetTokenIDRangesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: GetTokenIDRangesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListBalancesQueryOptions as _, getTokenRangesQueryOptions as a, getListBalancesQueryKey as b, fetchSearchTokenMetadata as c, FetchListTokenMetadataParams as d, ListTokenMetadataQueryOptions as f, FetchBalancesParams as g, listTokenMetadataQueryOptions as h, getTokenRangesQueryKey as i, getSearchTokenMetadataQueryKey as l, getListTokenMetadataQueryKey as m, GetTokenRangesQueryOptions as n, FetchSearchTokenMetadataParams as o, fetchListTokenMetadata as p, fetchGetTokenRanges as r, SearchTokenMetadataQueryOptions as s, FetchGetTokenRangesParams as t, searchTokenMetadataQueryOptions as u, UseListBalancesParams as v, listBalancesOptions as x, fetchBalances as y };
//# sourceMappingURL=ranges.d.ts.map