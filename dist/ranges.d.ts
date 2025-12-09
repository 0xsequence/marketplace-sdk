import { Dn as WithRequired, Fn as WithOptionalParams, bn as SdkInfiniteQueryParams, xn as SdkQueryParams } from "./create-config.js";
import * as _0xsequence_api_client28 from "@0xsequence/api-client";
import { Filter, Indexer, Page, SearchTokenMetadataReturn } from "@0xsequence/api-client";
import { Address as Address$1, Hex } from "viem";
import * as _tanstack_react_query64 from "@tanstack/react-query";

//#region src/react/queries/token/balances.d.ts
interface FetchBalancesParams {
  chainId: number;
  accountAddress?: Address$1;
  contractAddress?: Address$1;
  tokenId?: bigint;
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  };
  includeCollectionTokens?: boolean;
  page?: Indexer.Page;
}
type ListBalancesQueryOptions = SdkQueryParams<FetchBalancesParams>;
/**
 * @deprecated Use ListBalancesQueryOptions instead
 */
type UseListBalancesArgs = Omit<ListBalancesQueryOptions, 'config'> & {
  config?: ListBalancesQueryOptions['config'];
};
declare function fetchBalances(params: WithRequired<ListBalancesQueryOptions, 'chainId' | 'accountAddress' | 'config'>, page: Indexer.Page): Promise<Indexer.GetTokenBalancesResponse>;
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
declare function listBalancesOptions(params: ListBalancesQueryOptions): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseInfiniteQueryOptions<Indexer.GetTokenBalancesResponse, Error, _tanstack_react_query64.InfiniteData<Indexer.GetTokenBalancesResponse, unknown>, readonly ["token", string, {
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
  queryFn?: _tanstack_react_query64.QueryFunction<Indexer.GetTokenBalancesResponse, readonly ["token", string, {
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
    [dataTagSymbol]: _tanstack_react_query64.InfiniteData<Indexer.GetTokenBalancesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: Address$1;
  tokenIds: bigint[];
}
type ListTokenMetadataQueryOptions = SdkQueryParams<FetchListTokenMetadataParams>;
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>): Promise<_0xsequence_api_client28.TokenMetadata[]>;
declare function getListTokenMetadataQueryKey(params: ListTokenMetadataQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenIds: bigint[] | undefined;
}];
declare function listTokenMetadataQueryOptions(params: WithOptionalParams<WithRequired<ListTokenMetadataQueryOptions, 'chainId' | 'contractAddress' | 'tokenIds' | 'config'>>): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseQueryOptions<_0xsequence_api_client28.TokenMetadata[], Error, _0xsequence_api_client28.TokenMetadata[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<_0xsequence_api_client28.TokenMetadata[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _0xsequence_api_client28.TokenMetadata[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata-search.d.ts
interface FetchSearchTokenMetadataParams {
  chainId: number;
  collectionAddress: Address$1;
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
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseInfiniteQueryOptions<SearchTokenMetadataReturn, Error, _tanstack_react_query64.InfiniteData<SearchTokenMetadataReturn, unknown>, readonly ["token", string, {
  chainId: number;
  collectionAddress: string;
  filter: Filter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<SearchTokenMetadataReturn, readonly ["token", string, {
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
    [dataTagSymbol]: _tanstack_react_query64.InfiniteData<SearchTokenMetadataReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/ranges.d.ts
interface FetchGetTokenRangesParams {
  chainId: number;
  collectionAddress: Address$1;
}
type GetTokenRangesQueryOptions = SdkQueryParams<FetchGetTokenRangesParams>;
/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
declare function fetchGetTokenRanges(params: WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<Indexer.GetTokenIDRangesResponse>;
declare function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions): readonly ["token", string, {
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
}];
declare function getTokenRangesQueryOptions(params: WithOptionalParams<WithRequired<GetTokenRangesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query64.OmitKeyof<_tanstack_react_query64.UseQueryOptions<Indexer.GetTokenIDRangesResponse, Error, Indexer.GetTokenIDRangesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query64.QueryFunction<Indexer.GetTokenIDRangesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Indexer.GetTokenIDRangesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListBalancesQueryOptions as _, getTokenRangesQueryOptions as a, getListBalancesQueryKey as b, fetchSearchTokenMetadata as c, FetchListTokenMetadataParams as d, ListTokenMetadataQueryOptions as f, FetchBalancesParams as g, listTokenMetadataQueryOptions as h, getTokenRangesQueryKey as i, getSearchTokenMetadataQueryKey as l, getListTokenMetadataQueryKey as m, GetTokenRangesQueryOptions as n, FetchSearchTokenMetadataParams as o, fetchListTokenMetadata as p, fetchGetTokenRanges as r, SearchTokenMetadataQueryOptions as s, FetchGetTokenRangesParams as t, searchTokenMetadataQueryOptions as u, UseListBalancesArgs as v, listBalancesOptions as x, fetchBalances as y };
//# sourceMappingURL=ranges.d.ts.map