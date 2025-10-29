import { I as ValuesOptional, Y as SdkConfig } from "./create-config-BNLuQTqP.js";
import { n as StandardQueryOptions, t as StandardInfiniteQueryOptions } from "./query-beMKmcH2.js";
import * as _tanstack_react_query282 from "@tanstack/react-query";
import * as _0xsequence_indexer10 from "@0xsequence/indexer";
import { GetTokenBalancesReturn, GetTokenIDRangesReturn, GetTokenSuppliesArgs, Page } from "@0xsequence/indexer";
import * as _0xsequence_metadata134 from "@0xsequence/metadata";
import { Filter, Page as Page$1, SearchTokenMetadataReturn } from "@0xsequence/metadata";
import { Address, Hex } from "viem";

//#region src/react/queries/getTokenRanges.d.ts
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
declare function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions): _tanstack_react_query282.OmitKeyof<_tanstack_react_query282.UseQueryOptions<GetTokenIDRangesReturn, Error, GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query282.QueryFunction<GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | GetTokenRangesQueryOptions)[] & {
    [dataTagSymbol]: GetTokenIDRangesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listBalances.d.ts
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
  isLaos721?: boolean;
  query?: {
    enabled?: boolean;
  };
};
declare function fetchBalances(args: UseListBalancesArgs, config: SdkConfig, page: Page): Promise<GetTokenBalancesReturn>;
/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function listBalancesOptions(args: UseListBalancesArgs, config: SdkConfig): _tanstack_react_query282.OmitKeyof<_tanstack_react_query282.UseInfiniteQueryOptions<GetTokenBalancesReturn, Error, _tanstack_react_query282.InfiniteData<GetTokenBalancesReturn, unknown>, (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[], any>, "queryFn"> & {
  queryFn?: _tanstack_react_query282.QueryFunction<GetTokenBalancesReturn, (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[], any> | undefined;
} & {
  queryKey: (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[] & {
    [dataTagSymbol]: _tanstack_react_query282.InfiniteData<GetTokenBalancesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listTokenMetadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: string;
  tokenIds: string[];
  config: SdkConfig;
}
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: FetchListTokenMetadataParams): Promise<_0xsequence_metadata134.TokenMetadata[]>;
type ListTokenMetadataQueryOptions = ValuesOptional<FetchListTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function listTokenMetadataQueryOptions(params: ListTokenMetadataQueryOptions): _tanstack_react_query282.OmitKeyof<_tanstack_react_query282.UseQueryOptions<_0xsequence_metadata134.TokenMetadata[], Error, _0xsequence_metadata134.TokenMetadata[], ("tokens" | "metadata" | ListTokenMetadataQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query282.QueryFunction<_0xsequence_metadata134.TokenMetadata[], ("tokens" | "metadata" | ListTokenMetadataQueryOptions)[], never> | undefined;
} & {
  queryKey: ("tokens" | "metadata" | ListTokenMetadataQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata134.TokenMetadata[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/searchTokenMetadata.d.ts
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
declare function searchTokenMetadataQueryOptions(params: SearchTokenMetadataQueryOptions): _tanstack_react_query282.OmitKeyof<_tanstack_react_query282.UseInfiniteQueryOptions<SearchTokenMetadataReturn, Error, _tanstack_react_query282.InfiniteData<SearchTokenMetadataReturn, unknown>, (string | SearchTokenMetadataQueryOptions)[], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query282.QueryFunction<SearchTokenMetadataReturn, (string | SearchTokenMetadataQueryOptions)[], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: (string | SearchTokenMetadataQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query282.InfiniteData<SearchTokenMetadataReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokenSupplies.d.ts
interface FetchTokenSuppliesParams extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  isLaos721?: boolean;
  page?: Page;
}
/**
 * Fetches token supplies with support for both indexer and LAOS APIs
 * Uses the more efficient single-contract APIs from both services
 */
declare function fetchTokenSupplies(params: FetchTokenSuppliesParams): Promise<_0xsequence_indexer10.GetTokenSuppliesReturn>;
type TokenSuppliesQueryOptions = ValuesOptional<FetchTokenSuppliesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query282.OmitKeyof<_tanstack_react_query282.UseInfiniteQueryOptions<_0xsequence_indexer10.GetTokenSuppliesReturn, Error, _tanstack_react_query282.InfiniteData<_0xsequence_indexer10.GetTokenSuppliesReturn, unknown>, (TokenSuppliesQueryOptions | "tokens" | "supplies")[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query282.QueryFunction<_0xsequence_indexer10.GetTokenSuppliesReturn, (TokenSuppliesQueryOptions | "tokens" | "supplies")[], Page> | undefined;
} & {
  queryKey: (TokenSuppliesQueryOptions | "tokens" | "supplies")[] & {
    [dataTagSymbol]: _tanstack_react_query282.InfiniteData<_0xsequence_indexer10.GetTokenSuppliesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { GetTokenRangesQueryOptions as _, FetchSearchTokenMetadataParams as a, searchTokenMetadataQueryOptions as c, fetchListTokenMetadata as d, listTokenMetadataQueryOptions as f, FetchGetTokenRangesParams as g, listBalancesOptions as h, tokenSuppliesQueryOptions as i, FetchListTokenMetadataParams as l, fetchBalances as m, TokenSuppliesQueryOptions as n, SearchTokenMetadataQueryOptions as o, UseListBalancesArgs as p, fetchTokenSupplies as r, fetchSearchTokenMetadata as s, FetchTokenSuppliesParams as t, ListTokenMetadataQueryOptions as u, fetchGetTokenRanges as v, getTokenRangesQueryOptions as y };
//# sourceMappingURL=tokenSupplies-CU2fiyy7.d.ts.map