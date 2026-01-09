import { Qt as Page, ft as Filter, ht as TokenMetadata$2, mt as SearchTokenMetadataReturn, ot as index_d_exports$1, vt as GetTokenBalancesResponse } from "./index2.js";
import { G as Optional, J as SdkInfiniteQueryParams, Y as SdkQueryParams, ct as WithOptionalInfiniteParams, lt as WithOptionalParams, tt as WithRequired } from "./create-config.js";
import { Address, Hex } from "viem";
import * as _tanstack_react_query58 from "@tanstack/react-query";

//#region src/react/queries/token/balances.d.ts
interface FetchBalancesParams {
  chainId: number;
  accountAddress: Address;
  contractAddress?: Address;
  tokenId?: bigint;
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  };
  includeCollectionTokens?: boolean;
  page?: {
    page?: number;
    pageSize?: number;
    more?: boolean;
  };
}
type ListBalancesQueryOptions = SdkQueryParams<FetchBalancesParams>;
/**
 * Balances query params with accountAddress as required, contractAddress is optional
 */
type UseListBalancesParams = Optional<ListBalancesQueryOptions, 'config' | 'contractAddress'> & Required<Pick<ListBalancesQueryOptions, 'accountAddress'>>;
declare function fetchBalances(params: WithRequired<ListBalancesQueryOptions, 'chainId' | 'accountAddress' | 'config'>, page: {
  page: number;
  pageSize: number;
  more?: boolean;
}): Promise<GetTokenBalancesResponse>;
declare function getListBalancesQueryKey(params: ListBalancesQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenId: bigint | undefined;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  } | undefined;
  includeCollectionTokens: boolean | undefined;
}];
/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param params - The query parameters including config
 * @returns Query options configuration
 */
declare function listBalancesOptions(params: WithOptionalInfiniteParams<WithRequired<ListBalancesQueryOptions, 'chainId' | 'accountAddress' | 'config'>>): _tanstack_react_query58.OmitKeyof<_tanstack_react_query58.UseInfiniteQueryOptions<GetTokenBalancesResponse, Error, _tanstack_react_query58.InfiniteData<GetTokenBalancesResponse, unknown>, readonly unknown[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query58.QueryFunction<GetTokenBalancesResponse, readonly unknown[], Page> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query58.InfiniteData<GetTokenBalancesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: Address;
  tokenIds: bigint[];
}
type ListTokenMetadataQueryOptions = SdkQueryParams<FetchListTokenMetadataParams>;
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>): Promise<TokenMetadata$2[]>;
declare function getListTokenMetadataQueryKey(params: ListTokenMetadataQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenIds: bigint[] | undefined;
}];
declare function listTokenMetadataQueryOptions(params: WithOptionalParams<WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>>): _tanstack_react_query58.OmitKeyof<_tanstack_react_query58.UseQueryOptions<TokenMetadata$2[], Error, TokenMetadata$2[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query58.QueryFunction<TokenMetadata$2[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TokenMetadata$2[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata-search.d.ts
interface FetchSearchTokenMetadataParams {
  chainId: number;
  collectionAddress: Address;
  filter?: Filter;
  page?: Page;
}
type SearchTokenMetadataQueryOptions = SdkInfiniteQueryParams<FetchSearchTokenMetadataParams>;
/**
 * Fetches token metadata from the metadata API using search filters
 */
declare function fetchSearchTokenMetadata(params: WithRequired<SearchTokenMetadataQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<SearchTokenMetadataReturn>;
declare function getSearchTokenMetadataQueryKey(params: SearchTokenMetadataQueryOptions): readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  filter: Filter | undefined;
}];
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query58.OmitKeyof<_tanstack_react_query58.UseInfiniteQueryOptions<SearchTokenMetadataReturn, Error, _tanstack_react_query58.InfiniteData<SearchTokenMetadataReturn, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  filter: Filter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query58.QueryFunction<SearchTokenMetadataReturn, readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    filter: Filter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["token", string, {
    chainId: number;
    collectionAddress: string;
    filter: Filter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query58.InfiniteData<SearchTokenMetadataReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/ranges.d.ts
interface FetchGetTokenRangesParams {
  chainId: number;
  collectionAddress: Address;
}
type GetTokenRangesQueryOptions = SdkQueryParams<FetchGetTokenRangesParams>;
/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
declare function fetchGetTokenRanges(params: WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<index_d_exports$1.GetTokenIDRangesResponse>;
declare function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
}];
declare function getTokenRangesQueryOptions(params: WithOptionalParams<WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query58.OmitKeyof<_tanstack_react_query58.UseQueryOptions<index_d_exports$1.GetTokenIDRangesResponse, Error, index_d_exports$1.GetTokenIDRangesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query58.QueryFunction<index_d_exports$1.GetTokenIDRangesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: index_d_exports$1.GetTokenIDRangesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListBalancesQueryOptions as _, getTokenRangesQueryOptions as a, getListBalancesQueryKey as b, fetchSearchTokenMetadata as c, FetchListTokenMetadataParams as d, ListTokenMetadataQueryOptions as f, FetchBalancesParams as g, listTokenMetadataQueryOptions as h, getTokenRangesQueryKey as i, getSearchTokenMetadataQueryKey as l, getListTokenMetadataQueryKey as m, GetTokenRangesQueryOptions as n, FetchSearchTokenMetadataParams as o, fetchListTokenMetadata as p, fetchGetTokenRanges as r, SearchTokenMetadataQueryOptions as s, FetchGetTokenRangesParams as t, searchTokenMetadataQueryOptions as u, UseListBalancesParams as v, listBalancesOptions as x, fetchBalances as y };
//# sourceMappingURL=ranges.d.ts.map