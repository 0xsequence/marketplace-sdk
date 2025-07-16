import { ContractType } from "./marketplace.gen-HpnpL5xU.js";
import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { useMarketplaceConfig } from "./useMarketplaceConfig-B0HdHejG.js";
import { balanceOfCollectibleOptions, collectibleQueryOptions, countOfCollectablesQueryOptions, listCollectibleActivitiesQueryOptions, listCollectiblesPaginatedQueryOptions } from "./listCollectiblesPaginated-5c1PazYE.js";
import { useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/collectibles/useBalanceOfCollectible.tsx
/**
* Hook to fetch the balance of a specific collectible for a user
*
* @param args - The arguments for fetching the balance
* @returns Query result containing the balance data
*
* @example
* ```tsx
* const { data, isLoading, error } = useBalanceOfCollectible({
*   collectionAddress: '0x123...',
*   collectableId: '1',
*   userAddress: '0x456...',
*   chainId: 1,
*   query: {
*     enabled: true,
*     refetchInterval: 10000,
*   }
* });
* ```
*/
function useBalanceOfCollectible(args) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collection = marketplaceConfig?.market.collections.find((collection$1) => collection$1.itemsAddress === args.collectionAddress);
	const isLaos721 = collection?.contractType === ContractType.LAOS_ERC_721;
	return useQuery(balanceOfCollectibleOptions({
		...args,
		isLaos721
	}, config));
}

//#endregion
//#region src/react/hooks/data/collectibles/useCollectible.tsx
/**
* Hook to fetch metadata for a specific collectible
*
* This hook retrieves metadata for an individual NFT from a collection,
* including properties like name, description, image, attributes, etc.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The token ID of the collectible
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the collectible metadata
*
* @example
* Basic usage:
* ```typescript
* const { data: collectible, isLoading } = useCollectible({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   collectibleId: '12345'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = useCollectible({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   collectibleId: '12345',
*   query: {
*     enabled: Boolean(collectionAddress && tokenId),
*     staleTime: 30_000
*   }
* })
* ```
*/
function useCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/collectibles/useCountOfCollectables.tsx
/**
* Hook to get the count of collectibles in a market collection
*
* Counts either all collectibles or filtered collectibles based on provided parameters.
* When filter and side parameters are provided, returns count of filtered collectibles.
* Otherwise returns count of all collectibles in the collection.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Optional filter criteria for collectibles
* @param params.side - Optional order side (BUY/SELL) when using filters
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of collectibles
*
* @example
* Basic usage (count all collectibles):
* ```typescript
* const { data: totalCount, isLoading } = useCountOfCollectables({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filters (count filtered collectibles):
* ```typescript
* const { data: filteredCount } = useCountOfCollectables({
*   chainId: 137,
*   collectionAddress: '0x...',
*   filter: { priceRange: { min: '1000000000000000000' } },
*   side: OrderSide.SELL
* })
* ```
*/
function useCountOfCollectables(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = countOfCollectablesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/collectibles/useListCollectibleActivities.tsx
/**
* Hook to fetch a list of activities for a specific collectible
*
* Fetches activities (transfers, sales, offers, etc.) for a specific token
* from the marketplace with support for pagination and sorting.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.tokenId - The specific token ID to fetch activities for
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of activities per page (default: 10)
* @param params.sort - Sort order for activities
* @param params.query - Optional React Query configuration
*
* @returns Query result containing activities data
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useListCollectibleActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '123'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useListCollectibleActivities({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: '456',
*   page: 2,
*   pageSize: 20
* })
* ```
*
* @example
* With sorting:
* ```typescript
* const { data } = useListCollectibleActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '789',
*   sort: 'timestamp_desc',
*   pageSize: 50
* })
* ```
*/
function useListCollectibleActivities(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectibleActivitiesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx
/**
* Hook to fetch a list of collectibles with pagination support
*
* Fetches collectibles from the marketplace with support for filtering and pagination.
* Unlike the infinite query version, this hook fetches a specific page of results.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.side - Order side (listing or bid)
* @param params.filter - Optional filtering parameters
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of items per page (default: 30)
* @param params.query - Optional React Query configuration
*
* @returns Query result containing collectibles data for the specific page
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useListCollectiblesPaginated({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: 1,
*   pageSize: 20
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useListCollectiblesPaginated({
*   chainId: 1,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: 2,
*   pageSize: 50,
*   filter: {
*     searchText: 'rare',
*     includeEmpty: false
*   }
* })
* ```
*
* @example
* Controlled pagination:
* ```typescript
* const [currentPage, setCurrentPage] = useState(1);
* const { data, isLoading } = useListCollectiblesPaginated({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: currentPage,
*   pageSize: 25
* });
*
* const hasMorePages = data?.page?.more;
* ```
*/
function useListCollectiblesPaginated(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectiblesPaginatedQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { useBalanceOfCollectible, useCollectible, useCountOfCollectables, useListCollectibleActivities, useListCollectiblesPaginated };
//# sourceMappingURL=collectibles-nQPThMWd.js.map