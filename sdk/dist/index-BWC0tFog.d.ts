import { Optional } from "./create-config-jSzj4ypy.js";
import { GetTokenRangesQueryOptions, ListTokenMetadataQueryOptions, TokenSuppliesQueryOptions, UseListBalancesArgs, fetchGetTokenRanges } from "./tokenSupplies-C2eDLRfZ.js";
import * as _tanstack_react_query162 from "@tanstack/react-query";
import * as _0xsequence_indexer161 from "@0xsequence/indexer";
import * as _0xsequence_metadata167 from "@0xsequence/metadata";
import { Address } from "viem";

//#region src/react/hooks/data/tokens/useGetTokenRanges.d.ts
type UseGetTokenRangesParams = Optional<GetTokenRangesQueryOptions, 'config'>;
/**
 * Hook to fetch token ID ranges for a collection
 *
 * Retrieves the available token ID ranges for a specific collection,
 * which is useful for understanding the token distribution and
 * available tokens within a collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address to fetch ranges for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token ID ranges for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: tokenRanges, isLoading } = useGetTokenRanges({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`Token ranges: ${JSON.stringify(data.tokenIDRanges)}`);
 *   data.tokenIDRanges?.forEach(range => {
 *     console.log(`Range: ${range.start} - ${range.end}`);
 *   });
 * }
 * ```
 *
 * @example
 * With conditional enabling:
 * ```typescript
 * const { data: tokenRanges } = useGetTokenRanges({
 *   chainId: 1,
 *   collectionAddress: selectedCollection?.address,
 *   query: {
 *     enabled: Boolean(selectedCollection?.address),
 *     staleTime: 300000, // Cache for 5 minutes
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
declare function useGetTokenRanges(params: UseGetTokenRangesParams): _tanstack_react_query162.UseQueryResult<_0xsequence_indexer161.GetTokenIDRangesReturn, Error>;
type UseGetTokenRangesProps = {
  chainId: number;
  collectionAddress: Address;
  query?: {
    enabled?: boolean;
  };
};
type UseGetTokenRangesReturn = Awaited<ReturnType<typeof fetchGetTokenRanges>>;
//#endregion
//#region src/react/hooks/data/tokens/useListBalances.d.ts
/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListBalances({
 *   chainId: 1,
 *   accountAddress: '0x123...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useListBalances(args: UseListBalancesArgs): _tanstack_react_query162.UseInfiniteQueryResult<_tanstack_react_query162.InfiniteData<_0xsequence_indexer161.GetTokenBalancesReturn, unknown>, Error>;
//#endregion
//#region src/react/hooks/data/tokens/useListTokenMetadata.d.ts
type UseListTokenMetadataParams = Optional<ListTokenMetadataQueryOptions, 'config'>;
/**
 * Hook to fetch metadata for multiple tokens
 *
 * Retrieves metadata for a batch of tokens from a specific contract using the metadata API.
 * This hook is optimized for fetching multiple token metadata in a single request.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The contract address containing the tokens
 * @param params.tokenIds - Array of token IDs to fetch metadata for
 * @param params.config - Optional SDK configuration (defaults from context)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing an array of token metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: metadata, isLoading } = useListTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With query options:
 * ```typescript
 * const { data: metadata } = useListTokenMetadata({
 *   chainId: 1,
 *   contractAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0,
 *     staleTime: 10 * 60 * 1000 // 10 minutes
 *   }
 * })
 * ```
 */
declare function useListTokenMetadata(params: UseListTokenMetadataParams): _tanstack_react_query162.UseQueryResult<_0xsequence_metadata167.TokenMetadata[], Error>;
//#endregion
//#region src/react/hooks/data/tokens/useTokenSupplies.d.ts
type UseTokenSuppliesParams = Optional<TokenSuppliesQueryOptions, 'config'>;
/**
 * Hook to fetch token supplies from the indexer or LAOS API
 *
 * Retrieves supply information for tokens from a specific collection.
 * Automatically chooses between indexer and LAOS APIs based on the isLaos721 flag.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.isLaos721 - Whether to use LAOS API instead of indexer
 * @param params.includeMetadata - Whether to include token metadata
 * @param params.page - Pagination options
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With LAOS API:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   isLaos721: true
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 1,
 *   collectionAddress: selectedCollection,
 *   query: {
 *     enabled: !!selectedCollection
 *   }
 * })
 * ```
 */
declare function useTokenSupplies(params: UseTokenSuppliesParams): _tanstack_react_query162.UseQueryResult<_0xsequence_indexer161.GetTokenSuppliesReturn, Error>;
//#endregion
export { UseGetTokenRangesParams, UseGetTokenRangesProps, UseGetTokenRangesReturn, UseListTokenMetadataParams, UseTokenSuppliesParams, useGetTokenRanges, useListBalances, useListTokenMetadata, useTokenSupplies };
//# sourceMappingURL=index-BWC0tFog.d.ts.map