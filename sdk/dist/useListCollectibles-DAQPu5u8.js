import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { listCollectiblesQueryOptions } from "./listCollectibles-Dl3tB-_4.js";
import { useInfiniteQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/collectibles/useListCollectibles.tsx
/**
* Hook to fetch a list of collectibles with infinite pagination support
*
* Fetches collectibles from the marketplace with support for filtering, pagination,
* and special handling for shop marketplace types and LAOS721 contracts.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.side - Order side (listing or bid)
* @param params.filter - Optional filtering parameters
* @param params.isLaos721 - Whether the collection is a LAOS721 contract
* @param params.marketplaceType - Type of marketplace (shop, etc.)
* @param params.query - Optional React Query configuration
*
* @returns Infinite query result containing collectibles data with pagination
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading, fetchNextPage, hasNextPage } = useListCollectibles({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data, fetchNextPage } = useListCollectibles({
*   chainId: 1,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   filter: {
*     searchText: 'dragon',
*     includeEmpty: false,
*     marketplaces: [MarketplaceKind.sequence_marketplace_v2]
*   }
* })
* ```
*
* @example
* For LAOS721 collections:
* ```typescript
* const { data } = useListCollectibles({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   isLaos721: true,
*   filter: {
*     inAccounts: ['0x...']
*   }
* })
* ```
*/
function useListCollectibles(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectiblesQueryOptions({
		config,
		...rest
	});
	return useInfiniteQuery({ ...queryOptions$1 });
}

//#endregion
export { useListCollectibles };
//# sourceMappingURL=useListCollectibles-DAQPu5u8.js.map