import { ContractType } from "./marketplace.gen-HpnpL5xU.js";
import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { useMarketplaceConfig } from "./useMarketplaceConfig-C4vhw0Da.js";
import { listBalancesOptions } from "./listBalances-DuufjTG6.js";
import { getTokenRangesQueryOptions, listTokenMetadataQueryOptions } from "./tokenSupplies-DTWhbfIg.js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/tokens/useGetTokenRanges.tsx
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
function useGetTokenRanges(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = getTokenRangesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/tokens/useListBalances.tsx
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
function useListBalances(args) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const isLaos721 = marketplaceConfig?.market?.collections?.find((c) => c.itemsAddress === args.contractAddress && c.chainId === args.chainId)?.contractType === ContractType.LAOS_ERC_721;
	return useInfiniteQuery(listBalancesOptions({
		...args,
		isLaos721
	}, config));
}

//#endregion
//#region src/react/hooks/data/tokens/useListTokenMetadata.tsx
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
function useListTokenMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listTokenMetadataQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { useGetTokenRanges, useListBalances, useListTokenMetadata };
//# sourceMappingURL=tokens-SIRpA1IC.js.map