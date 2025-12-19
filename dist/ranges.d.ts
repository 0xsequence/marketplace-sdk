import { en as Page, ft as Filter, ht as TokenMetadata$1, mt as SearchTokenMetadataReturn, ot as index_d_exports$1 } from "./index2.js";
import { J as SdkInfiniteQueryParams, Y as SdkQueryParams, lt as WithOptionalParams, tt as WithRequired } from "./create-config.js";
import { Address, Hex } from "viem";
import * as _tanstack_react_query63 from "@tanstack/react-query";

//#region src/react/queries/token/balances.d.ts
interface FetchBalancesParams {
  chainId: number;
  accountAddress?: Address;
  contractAddress?: Address;
  tokenId?: bigint;
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  };
  includeCollectionTokens?: boolean;
  page?: index_d_exports$1.Page;
}
type ListBalancesQueryOptions = SdkQueryParams<FetchBalancesParams>;
/**
 * @deprecated Use ListBalancesQueryOptions instead
 */
type UseListBalancesArgs = Omit<ListBalancesQueryOptions, 'config'> & {
  config?: ListBalancesQueryOptions['config'];
};
declare function fetchBalances(params: WithRequired<ListBalancesQueryOptions, 'chainId' | 'accountAddress' | 'config'>, page: index_d_exports$1.Page): Promise<index_d_exports$1.GetTokenBalancesResponse>;
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
declare function listBalancesOptions(params: ListBalancesQueryOptions): _tanstack_react_query63.OmitKeyof<_tanstack_react_query63.UseInfiniteQueryOptions<index_d_exports$1.GetTokenBalancesResponse, Error, _tanstack_react_query63.InfiniteData<index_d_exports$1.GetTokenBalancesResponse, unknown>, readonly ["token", string, {
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
}], {
  page: number;
  pageSize: number;
  more: boolean;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query63.QueryFunction<index_d_exports$1.GetTokenBalancesResponse, readonly ["token", string, {
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
  }], {
    page: number;
    pageSize: number;
    more: boolean;
  }> | undefined;
} & {
  queryKey: readonly ["token", string, {
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
  }] & {
    [dataTagSymbol]: _tanstack_react_query63.InfiniteData<index_d_exports$1.GetTokenBalancesResponse, unknown>;
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
declare function fetchListTokenMetadata(params: WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>): Promise<TokenMetadata$1[]>;
declare function getListTokenMetadataQueryKey(params: ListTokenMetadataQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenIds: bigint[] | undefined;
}];
declare function listTokenMetadataQueryOptions(params: WithOptionalParams<WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>>): _tanstack_react_query63.OmitKeyof<_tanstack_react_query63.UseQueryOptions<TokenMetadata$1[], Error, TokenMetadata$1[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query63.QueryFunction<TokenMetadata$1[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TokenMetadata$1[];
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
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query63.OmitKeyof<_tanstack_react_query63.UseInfiniteQueryOptions<SearchTokenMetadataReturn, Error, _tanstack_react_query63.InfiniteData<SearchTokenMetadataReturn, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  filter: Filter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query63.QueryFunction<SearchTokenMetadataReturn, readonly ["token", string, {
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
    [dataTagSymbol]: _tanstack_react_query63.InfiniteData<SearchTokenMetadataReturn, unknown>;
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
declare function getTokenRangesQueryOptions(params: WithOptionalParams<WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query63.OmitKeyof<_tanstack_react_query63.UseQueryOptions<index_d_exports$1.GetTokenIDRangesResponse, Error, index_d_exports$1.GetTokenIDRangesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query63.QueryFunction<index_d_exports$1.GetTokenIDRangesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: index_d_exports$1.GetTokenIDRangesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListBalancesQueryOptions as _, getTokenRangesQueryOptions as a, getListBalancesQueryKey as b, fetchSearchTokenMetadata as c, FetchListTokenMetadataParams as d, ListTokenMetadataQueryOptions as f, FetchBalancesParams as g, listTokenMetadataQueryOptions as h, getTokenRangesQueryKey as i, getSearchTokenMetadataQueryKey as l, getListTokenMetadataQueryKey as m, GetTokenRangesQueryOptions as n, FetchSearchTokenMetadataParams as o, fetchListTokenMetadata as p, fetchGetTokenRanges as r, SearchTokenMetadataQueryOptions as s, FetchGetTokenRangesParams as t, searchTokenMetadataQueryOptions as u, UseListBalancesArgs as v, listBalancesOptions as x, fetchBalances as y };
//# sourceMappingURL=ranges.d.ts.map