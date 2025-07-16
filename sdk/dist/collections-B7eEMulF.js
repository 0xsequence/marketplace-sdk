import { CollectionStatus } from "./marketplace.gen-HpnpL5xU.js";
import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { useMarketplaceConfig } from "./useMarketplaceConfig-B0HdHejG.js";
import { collectionDetailsQueryOptions, listCollectionActivitiesQueryOptions, listCollectionsQueryOptions } from "./listCollections-CeozHrO_.js";
import { queryOptions, useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/collections/useCollectionDetails.ts
/**
* Hook to fetch detailed information about a collection
*
* This hook retrieves comprehensive metadata and details for an NFT collection,
* including collection name, description, banner, avatar, social links, stats, etc.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the collection details
*
* @example
* Basic usage:
* ```typescript
* const { data: collection, isLoading } = useCollectionDetails({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = useCollectionDetails({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   query: {
*     enabled: Boolean(collectionAddress),
*     staleTime: 60_000
*   }
* })
* ```
*/
function useCollectionDetails(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectionDetailsQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/collections/useCollectionDetailsPolling.tsx
const INITIAL_POLLING_INTERVAL = 2e3;
const MAX_POLLING_INTERVAL = 3e4;
const MAX_ATTEMPTS = 30;
const isTerminalState = (status) => {
	return [
		CollectionStatus.active,
		CollectionStatus.failed,
		CollectionStatus.inactive,
		CollectionStatus.incompatible_type
	].includes(status);
};
const collectionDetailsPollingOptions = (args, config) => {
	return queryOptions({
		...collectionDetailsQueryOptions({
			...args,
			config
		}),
		refetchInterval: (query) => {
			const data = query.state.data;
			if (data && isTerminalState(data.status)) return false;
			const currentAttempt = (query.state.dataUpdateCount || 0) + 1;
			if (currentAttempt >= MAX_ATTEMPTS) return false;
			const interval = Math.min(INITIAL_POLLING_INTERVAL * 1.5 ** currentAttempt, MAX_POLLING_INTERVAL);
			return interval;
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled: args.query?.enabled ?? true
	});
};
const useCollectionDetailsPolling = (args) => {
	const config = useConfig();
	return useQuery(collectionDetailsPollingOptions(args, config));
};

//#endregion
//#region src/react/hooks/data/collections/useListCollectionActivities.tsx
/**
* Hook to fetch a list of activities for an entire collection
*
* Fetches activities (transfers, sales, offers, etc.) for all tokens
* in a collection from the marketplace with support for pagination and sorting.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of activities per page (default: 10)
* @param params.sort - Sort order for activities
* @param params.query - Optional React Query configuration
*
* @returns Query result containing activities data for the collection
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useListCollectionActivities({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useListCollectionActivities({
*   chainId: 1,
*   collectionAddress: '0x...',
*   page: 2,
*   pageSize: 20
* })
* ```
*
* @example
* With sorting:
* ```typescript
* const { data } = useListCollectionActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   sort: [{ column: 'createdAt', order: SortOrder.DESC }],
*   pageSize: 50
* })
* ```
*/
function useListCollectionActivities(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectionActivitiesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/collections/useListCollections.tsx
/**
* Hook to fetch collections from marketplace configuration
*
* Retrieves all collections configured in the marketplace, with optional filtering
* by marketplace type. Combines metadata from the metadata API with marketplace
* configuration to provide complete collection information.
*
* @param params - Configuration parameters
* @param params.marketplaceType - Optional filter by marketplace type
* @param params.query - Optional React Query configuration
*
* @returns Query result containing array of collections with metadata
*
* @example
* Basic usage:
* ```typescript
* const { data: collections, isLoading } = useListCollections();
*
* if (isLoading) return <div>Loading collections...</div>;
*
* return (
*   <div>
*     {collections?.map(collection => (
*       <div key={collection.itemsAddress}>
*         {collection.name}
*       </div>
*     ))}
*   </div>
* );
* ```
*
* @example
* Filtering by marketplace type:
* ```typescript
* const { data: marketCollections } = useListCollections({
*   marketplaceType: 'market'
* });
* ```
*/
function useListCollections(params = {}) {
	const defaultConfig = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { config = defaultConfig, marketplaceConfig: paramMarketplaceConfig,...rest } = params;
	const queryOptions$1 = listCollectionsQueryOptions({
		config,
		marketplaceConfig: paramMarketplaceConfig || marketplaceConfig,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { collectionDetailsPollingOptions, useCollectionDetails, useCollectionDetailsPolling, useListCollectionActivities, useListCollections };
//# sourceMappingURL=collections-B7eEMulF.js.map