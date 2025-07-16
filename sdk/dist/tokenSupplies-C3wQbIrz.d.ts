import { SdkConfig, ValuesOptional } from "./create-config-tyvmEx4z.js";
import { StandardQueryOptions } from "./query-4c83jPSr.js";
import * as _tanstack_react_query278 from "@tanstack/react-query";
import * as _0xsequence_indexer439 from "@0xsequence/indexer";
import { GetTokenBalancesReturn, GetTokenIDRangesReturn, GetTokenSuppliesArgs, Page } from "@0xsequence/indexer";
import * as _0xsequence_metadata408 from "@0xsequence/metadata";
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
declare function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions): _tanstack_react_query278.OmitKeyof<_tanstack_react_query278.UseQueryOptions<GetTokenIDRangesReturn, Error, GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query278.QueryFunction<GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[], never> | undefined;
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
declare function listBalancesOptions(args: UseListBalancesArgs, config: SdkConfig): _tanstack_react_query278.OmitKeyof<_tanstack_react_query278.UseInfiniteQueryOptions<GetTokenBalancesReturn, Error, _tanstack_react_query278.InfiniteData<GetTokenBalancesReturn, unknown>, (SdkConfig | "balances" | UseListBalancesArgs | "tokenBalances")[], any>, "queryFn"> & {
  queryFn?: _tanstack_react_query278.QueryFunction<GetTokenBalancesReturn, (SdkConfig | "balances" | UseListBalancesArgs | "tokenBalances")[], any> | undefined;
} & {
  queryKey: (SdkConfig | "balances" | UseListBalancesArgs | "tokenBalances")[] & {
    [dataTagSymbol]: _tanstack_react_query278.InfiniteData<GetTokenBalancesReturn, unknown>;
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
declare function fetchListTokenMetadata(params: FetchListTokenMetadataParams): Promise<_0xsequence_metadata408.TokenMetadata[]>;
type ListTokenMetadataQueryOptions = ValuesOptional<FetchListTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function listTokenMetadataQueryOptions(params: ListTokenMetadataQueryOptions): _tanstack_react_query278.OmitKeyof<_tanstack_react_query278.UseQueryOptions<_0xsequence_metadata408.TokenMetadata[], Error, _0xsequence_metadata408.TokenMetadata[], ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query278.QueryFunction<_0xsequence_metadata408.TokenMetadata[], ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[], never> | undefined;
} & {
  queryKey: ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata408.TokenMetadata[];
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
}
/**
 * Fetches token supplies with support for both indexer and LAOS APIs
 * Uses the more efficient single-contract APIs from both services
 */
declare function fetchTokenSupplies(params: FetchTokenSuppliesParams): Promise<_0xsequence_indexer439.GetTokenSuppliesReturn>;
type TokenSuppliesQueryOptions = ValuesOptional<FetchTokenSuppliesParams> & {
  query?: StandardQueryOptions;
};
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query278.OmitKeyof<_tanstack_react_query278.UseQueryOptions<_0xsequence_indexer439.GetTokenSuppliesReturn, Error, _0xsequence_indexer439.GetTokenSuppliesReturn, ("tokens" | "supplies" | TokenSuppliesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query278.QueryFunction<_0xsequence_indexer439.GetTokenSuppliesReturn, ("tokens" | "supplies" | TokenSuppliesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("tokens" | "supplies" | TokenSuppliesQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_indexer439.GetTokenSuppliesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { FetchGetTokenRangesParams, FetchListTokenMetadataParams, FetchTokenSuppliesParams, GetTokenRangesQueryOptions, ListTokenMetadataQueryOptions, TokenSuppliesQueryOptions, UseListBalancesArgs, fetchBalances, fetchGetTokenRanges, fetchListTokenMetadata, fetchTokenSupplies, getTokenRangesQueryOptions, listBalancesOptions, listTokenMetadataQueryOptions, tokenSuppliesQueryOptions };
//# sourceMappingURL=tokenSupplies-C3wQbIrz.d.ts.map