import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { collectionQueryOptions } from "./listCollections-CeozHrO_.js";
import { useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/collections/useCollection.tsx
/**
* Hook to fetch collection information from the metadata API
*
* Retrieves basic contract information including name, symbol, type,
* and extension data for a given collection contract.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing contract information
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollection({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollection({
*   chainId: 1,
*   collectionAddress: '0x...',
*   query: {
*     refetchInterval: 30000,
*     enabled: userWantsToFetch
*   }
* })
* ```
*/
function useCollection(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectionQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { useCollection };
//# sourceMappingURL=useCollection-BOzP0IuM.js.map