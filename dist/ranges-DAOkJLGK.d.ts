import { G as SdkConfig, j as ValuesOptional } from "./create-config-BO68TZC5.js";
import { n as StandardQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query180 from "@tanstack/react-query";
import { GetTokenBalancesReturn, GetTokenIDRangesReturn, Page } from "@0xsequence/indexer";
import * as _0xsequence_metadata80 from "@0xsequence/metadata";
import { Filter, Page as Page$1, SearchTokenMetadataReturn } from "@0xsequence/metadata";
import { Address, Hex } from "viem";

//#region src/react/queries/token/balances.d.ts
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
declare function getListBalancesQueryKey(args: UseListBalancesArgs): readonly ["token", "balances", {
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
declare function listBalancesOptions(args: UseListBalancesArgs, config: SdkConfig): _tanstack_react_query180.OmitKeyof<_tanstack_react_query180.UseInfiniteQueryOptions<GetTokenBalancesReturn, Error, _tanstack_react_query180.InfiniteData<GetTokenBalancesReturn, unknown>, readonly ["token", "balances", {
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
  queryFn?: _tanstack_react_query180.QueryFunction<GetTokenBalancesReturn, readonly ["token", "balances", {
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
  queryKey: readonly ["token", "balances", {
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
    [dataTagSymbol]: _tanstack_react_query180.InfiniteData<GetTokenBalancesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: string;
  tokenIds: string[];
  config: SdkConfig;
}
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: FetchListTokenMetadataParams): Promise<_0xsequence_metadata80.TokenMetadata[]>;
type ListTokenMetadataQueryOptions = ValuesOptional<FetchListTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function getListTokenMetadataQueryKey(params: ListTokenMetadataQueryOptions): readonly ["token", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[] | undefined;
}];
declare function listTokenMetadataQueryOptions(params: ListTokenMetadataQueryOptions): _tanstack_react_query180.OmitKeyof<_tanstack_react_query180.UseQueryOptions<_0xsequence_metadata80.TokenMetadata[], Error, _0xsequence_metadata80.TokenMetadata[], readonly ["token", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[] | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query180.QueryFunction<_0xsequence_metadata80.TokenMetadata[], readonly ["token", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[] | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["token", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[] | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_metadata80.TokenMetadata[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/metadata-search.d.ts
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
declare function getSearchTokenMetadataQueryKey(params: SearchTokenMetadataQueryOptions): readonly ["token", "metadata", "search", {
  chainID: string;
  contractAddress: string;
  filter: Filter | undefined;
}];
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query180.OmitKeyof<_tanstack_react_query180.UseInfiniteQueryOptions<SearchTokenMetadataReturn, Error, _tanstack_react_query180.InfiniteData<SearchTokenMetadataReturn, unknown>, readonly ["token", "metadata", "search", {
  chainID: string;
  contractAddress: string;
  filter: Filter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query180.QueryFunction<SearchTokenMetadataReturn, readonly ["token", "metadata", "search", {
    chainID: string;
    contractAddress: string;
    filter: Filter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["token", "metadata", "search", {
    chainID: string;
    contractAddress: string;
    filter: Filter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query180.InfiniteData<SearchTokenMetadataReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/token/ranges.d.ts
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
declare function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions): readonly ["token", "ranges", {
  chainId: number;
  contractAddress: `0x${string}`;
}];
declare function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions): _tanstack_react_query180.OmitKeyof<_tanstack_react_query180.UseQueryOptions<GetTokenIDRangesReturn, Error, GetTokenIDRangesReturn, readonly ["token", "ranges", {
  chainId: number;
  contractAddress: `0x${string}`;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query180.QueryFunction<GetTokenIDRangesReturn, readonly ["token", "ranges", {
    chainId: number;
    contractAddress: `0x${string}`;
  }], never> | undefined;
} & {
  queryKey: readonly ["token", "ranges", {
    chainId: number;
    contractAddress: `0x${string}`;
  }] & {
    [dataTagSymbol]: GetTokenIDRangesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { fetchBalances as _, getTokenRangesQueryOptions as a, fetchSearchTokenMetadata as c, FetchListTokenMetadataParams as d, ListTokenMetadataQueryOptions as f, UseListBalancesArgs as g, listTokenMetadataQueryOptions as h, getTokenRangesQueryKey as i, getSearchTokenMetadataQueryKey as l, getListTokenMetadataQueryKey as m, GetTokenRangesQueryOptions as n, FetchSearchTokenMetadataParams as o, fetchListTokenMetadata as p, fetchGetTokenRanges as r, SearchTokenMetadataQueryOptions as s, FetchGetTokenRangesParams as t, searchTokenMetadataQueryOptions as u, getListBalancesQueryKey as v, listBalancesOptions as y };
//# sourceMappingURL=ranges-DAOkJLGK.d.ts.map