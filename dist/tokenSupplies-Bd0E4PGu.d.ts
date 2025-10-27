import { $ as SdkConfig, z as ValuesOptional } from "./create-config-DMM2szLh.js";
import { n as StandardQueryOptions, t as StandardInfiniteQueryOptions } from "./query-D8sokOq-.js";
import * as _tanstack_react_query225 from "@tanstack/react-query";
import * as _0xsequence_indexer4 from "@0xsequence/indexer";
import { GetTokenBalancesReturn, GetTokenIDRangesReturn, GetTokenSuppliesArgs, Page } from "@0xsequence/indexer";
import * as _0xsequence_metadata81 from "@0xsequence/metadata";
import { Filter, Page as Page$1, SearchTokenMetadataReturn } from "@0xsequence/metadata";
import { Address, Hex } from "viem";

//#region src/react/queries/tokens/getTokenRanges.d.ts
interface FetchGetTokenRangesParams {
  chainId: number;
  collectionAddress: Address;
  config: SdkConfig;
}
/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
declare function fetchGetTokenRanges(params: FetchGetTokenRangesParams): Promise<GetTokenIDRangesReturn>;
type GetTokenRangesQueryOptions = ValuesOptional<FetchGetTokenRangesParams> & {
  query?: StandardQueryOptions;
};
declare function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions): readonly ["tokens", "ranges", {
  chainId: number;
  contractAddress: `0x${string}`;
}];
declare function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions): _tanstack_react_query225.OmitKeyof<_tanstack_react_query225.UseQueryOptions<GetTokenIDRangesReturn, Error, GetTokenIDRangesReturn, readonly ["tokens", "ranges", {
  chainId: number;
  contractAddress: `0x${string}`;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query225.QueryFunction<GetTokenIDRangesReturn, readonly ["tokens", "ranges", {
    chainId: number;
    contractAddress: `0x${string}`;
  }], never> | undefined;
} & {
  queryKey: readonly ["tokens", "ranges", {
    chainId: number;
    contractAddress: `0x${string}`;
  }] & {
    [dataTagSymbol]: GetTokenIDRangesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokens/listBalances.d.ts
type UseListBalancesArgs = {
  chainId: number;
  accountAddress?: Address;
  contractAddress?: Address;
  tokenId?: string;
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  };
  includeCollectionTokens?: boolean;
  page?: Page;
  query?: {
    enabled?: boolean;
  };
};
declare function fetchBalances(args: UseListBalancesArgs, config: SdkConfig, page: Page): Promise<GetTokenBalancesReturn>;
declare function getListBalancesQueryKey(args: UseListBalancesArgs): readonly ["balances", "tokenBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenID: string | undefined;
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
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function listBalancesOptions(args: UseListBalancesArgs, config: SdkConfig): _tanstack_react_query225.OmitKeyof<_tanstack_react_query225.UseInfiniteQueryOptions<GetTokenBalancesReturn, Error, _tanstack_react_query225.InfiniteData<GetTokenBalancesReturn, unknown>, readonly ["balances", "tokenBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenID: string | undefined;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  } | undefined;
  includeCollectionTokens: boolean | undefined;
}], any>, "queryFn"> & {
  queryFn?: _tanstack_react_query225.QueryFunction<GetTokenBalancesReturn, readonly ["balances", "tokenBalances", {
    chainId: number;
    accountAddress: `0x${string}` | undefined;
    contractAddress: `0x${string}` | undefined;
    tokenID: string | undefined;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly?: boolean;
      unverifiedOnly?: boolean;
      includeContracts?: Hex[];
    } | undefined;
    includeCollectionTokens: boolean | undefined;
  }], any> | undefined;
} & {
  queryKey: readonly ["balances", "tokenBalances", {
    chainId: number;
    accountAddress: `0x${string}` | undefined;
    contractAddress: `0x${string}` | undefined;
    tokenID: string | undefined;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly?: boolean;
      unverifiedOnly?: boolean;
      includeContracts?: Hex[];
    } | undefined;
    includeCollectionTokens: boolean | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query225.InfiniteData<GetTokenBalancesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokens/listTokenMetadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: string;
  tokenIds: string[];
  config: SdkConfig;
}
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: FetchListTokenMetadataParams): Promise<_0xsequence_metadata81.TokenMetadata[]>;
type ListTokenMetadataQueryOptions = ValuesOptional<FetchListTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function getListTokenMetadataQueryKey(params: ListTokenMetadataQueryOptions): readonly ["tokens", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[] | undefined;
}];
declare function listTokenMetadataQueryOptions(params: ListTokenMetadataQueryOptions): _tanstack_react_query225.OmitKeyof<_tanstack_react_query225.UseQueryOptions<_0xsequence_metadata81.TokenMetadata[], Error, _0xsequence_metadata81.TokenMetadata[], readonly ["tokens", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[] | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query225.QueryFunction<_0xsequence_metadata81.TokenMetadata[], readonly ["tokens", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[] | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["tokens", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[] | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_metadata81.TokenMetadata[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokens/searchTokenMetadata.d.ts
interface FetchSearchTokenMetadataParams {
  chainId: number;
  collectionAddress: string;
  filter?: Filter;
  page?: Page$1;
  config: SdkConfig;
}
/**
 * Fetches token metadata from the metadata API using search filters
 */
declare function fetchSearchTokenMetadata(params: FetchSearchTokenMetadataParams): Promise<SearchTokenMetadataReturn>;
type SearchTokenMetadataQueryOptions = ValuesOptional<FetchSearchTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function getSearchTokenMetadataQueryKey(params: SearchTokenMetadataQueryOptions): readonly ["tokens", "metadata", "search", {
  chainID: string;
  contractAddress: string;
  filter: Filter | undefined;
}];
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query225.OmitKeyof<_tanstack_react_query225.UseInfiniteQueryOptions<SearchTokenMetadataReturn, Error, _tanstack_react_query225.InfiniteData<SearchTokenMetadataReturn, unknown>, readonly ["tokens", "metadata", "search", {
  chainID: string;
  contractAddress: string;
  filter: Filter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query225.QueryFunction<SearchTokenMetadataReturn, readonly ["tokens", "metadata", "search", {
    chainID: string;
    contractAddress: string;
    filter: Filter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["tokens", "metadata", "search", {
    chainID: string;
    contractAddress: string;
    filter: Filter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query225.InfiniteData<SearchTokenMetadataReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokens/tokenSupplies.d.ts
interface FetchTokenSuppliesParams extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  page?: Page;
}
/**
 * Fetches token supplies with support for indexer API
 */
declare function fetchTokenSupplies(params: FetchTokenSuppliesParams): Promise<_0xsequence_indexer4.GetTokenSuppliesReturn>;
type TokenSuppliesQueryOptions = ValuesOptional<FetchTokenSuppliesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions): readonly ["tokens", "supplies", {
  chainId: number;
  contractAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: _0xsequence_indexer4.MetadataOptions | undefined;
}];
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query225.OmitKeyof<_tanstack_react_query225.UseInfiniteQueryOptions<_0xsequence_indexer4.GetTokenSuppliesReturn, Error, _tanstack_react_query225.InfiniteData<_0xsequence_indexer4.GetTokenSuppliesReturn, unknown>, readonly ["tokens", "supplies", {
  chainId: number;
  contractAddress: string;
  includeMetadata: boolean | undefined;
  metadataOptions: _0xsequence_indexer4.MetadataOptions | undefined;
}], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query225.QueryFunction<_0xsequence_indexer4.GetTokenSuppliesReturn, readonly ["tokens", "supplies", {
    chainId: number;
    contractAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: _0xsequence_indexer4.MetadataOptions | undefined;
  }], Page> | undefined;
} & {
  queryKey: readonly ["tokens", "supplies", {
    chainId: number;
    contractAddress: string;
    includeMetadata: boolean | undefined;
    metadataOptions: _0xsequence_indexer4.MetadataOptions | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query225.InfiniteData<_0xsequence_indexer4.GetTokenSuppliesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getTokenRangesQueryKey as C, fetchGetTokenRanges as S, fetchBalances as _, tokenSuppliesQueryOptions as a, FetchGetTokenRangesParams as b, fetchSearchTokenMetadata as c, FetchListTokenMetadataParams as d, ListTokenMetadataQueryOptions as f, UseListBalancesArgs as g, listTokenMetadataQueryOptions as h, getTokenSuppliesQueryKey as i, getSearchTokenMetadataQueryKey as l, getListTokenMetadataQueryKey as m, TokenSuppliesQueryOptions as n, FetchSearchTokenMetadataParams as o, fetchListTokenMetadata as p, fetchTokenSupplies as r, SearchTokenMetadataQueryOptions as s, FetchTokenSuppliesParams as t, searchTokenMetadataQueryOptions as u, getListBalancesQueryKey as v, getTokenRangesQueryOptions as w, GetTokenRangesQueryOptions as x, listBalancesOptions as y };
//# sourceMappingURL=tokenSupplies-Bd0E4PGu.d.ts.map