import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { tokenSuppliesQueryOptions } from "./tokenSupplies-DTWhbfIg.js";
import { useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/tokens/useTokenSupplies.ts
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
function useTokenSupplies(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = tokenSuppliesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { useTokenSupplies };
//# sourceMappingURL=useTokenSupplies-Bdy2sCPJ.js.map