import { collectableKeys, getMarketplaceClient } from "./api-BiMGqWdz.js";
import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { countListingsForCollectibleQueryOptions, countOffersForCollectibleQueryOptions, floorOrderQueryOptions, highestOfferQueryOptions, listListingsForCollectibleQueryOptions, lowestListingQueryOptions } from "./lowestListing-Dfvdk4Al.js";
import { queryOptions, useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/orders/useCountListingsForCollectible.tsx
/**
* Hook to get the count of listings for a specific collectible
*
* Counts the number of active listings for a given collectible in the marketplace.
* Useful for displaying listing counts in UI components.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific collectible/token ID
* @param params.filter - Optional filter criteria for listings
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of listings
*
* @example
* Basic usage:
* ```typescript
* const { data: listingCount, isLoading } = useCountListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCountListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCountListingsForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = countListingsForCollectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/orders/useCountOffersForCollectible.tsx
/**
* Hook to get the count of offers for a specific collectible
*
* Counts the number of active offers for a given collectible in the marketplace.
* Useful for displaying offer counts in UI components.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific collectible/token ID
* @param params.filter - Optional filter criteria for offers
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of offers
*
* @example
* Basic usage:
* ```typescript
* const { data: offerCount, isLoading } = useCountOffersForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCountOffersForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCountOffersForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = countOffersForCollectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/orders/useFloorOrder.tsx
/**
* Hook to fetch the floor order for a collection
*
* Retrieves the lowest priced order (listing) currently available for any token
* in the specified collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Optional filter criteria for collectibles
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the floor order data for the collection
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useFloorOrder({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filters and custom query options:
* ```typescript
* const { data, isLoading } = useFloorOrder({
*   chainId: 1,
*   collectionAddress: '0x...',
*   filter: {
*     minPrice: '1000000000000000000' // 1 ETH in wei
*   },
*   query: {
*     refetchInterval: 30000,
*     enabled: hasCollectionAddress
*   }
* })
* ```
*/
function useFloorOrder(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = floorOrderQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/orders/useHighestOffer.tsx
/**
* Hook to fetch the highest offer for a collectible
*
* Retrieves the highest offer currently available for a specific token
* in a collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.tokenId - The token ID within the collection
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the highest offer data or null if no offers exist
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useHighestOffer({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '1'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useHighestOffer({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: '42',
*   query: {
*     refetchInterval: 15000,
*     enabled: hasTokenId
*   }
* })
* ```
*/
function useHighestOffer(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = highestOfferQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/orders/useListListingsForCollectible.tsx
/**
* Hook to fetch listings for a specific collectible
*
* Fetches active listings (sales) for a specific token from the marketplace
* with support for filtering and pagination.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific token ID to fetch listings for
* @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
* @param params.page - Optional pagination parameters
* @param params.query - Optional React Query configuration
*
* @returns Query result containing listings data for the collectible
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useListListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useListListingsForCollectible({
*   chainId: 1,
*   collectionAddress: '0x...',
*   collectibleId: '456',
*   page: {
*     page: 2,
*     pageSize: 20
*   }
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useListListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '789',
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2],
*     currencies: ['0x...'] // Specific currency addresses
*   }
* })
* ```
*/
function useListListingsForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listListingsForCollectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/data/orders/useListOffersForCollectible.tsx
const fetchListOffersForCollectible = async (config, args) => {
	const arg = {
		chainId: String(args.chainId),
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page
	};
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listCollectibleOffers(arg);
};
const listOffersForCollectibleOptions = (args, config) => {
	return queryOptions({
		queryKey: [
			...collectableKeys.offers,
			args,
			config
		],
		queryFn: () => fetchListOffersForCollectible(config, args)
	});
};
const useListOffersForCollectible = (args) => {
	const config = useConfig();
	return useQuery(listOffersForCollectibleOptions(args, config));
};

//#endregion
//#region src/react/hooks/data/orders/useLowestListing.tsx
/**
* Hook to fetch the lowest listing for a collectible
*
* Retrieves the lowest priced listing currently available for a specific token
* in a collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.tokenId - The token ID within the collection
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the lowest listing data or null if no listings exist
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useLowestListing({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '1'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useLowestListing({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: '42',
*   query: {
*     refetchInterval: 15000,
*     enabled: hasTokenId
*   }
* })
* ```
*/
function useLowestListing(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = lowestListingQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { listOffersForCollectibleOptions, useCountListingsForCollectible, useCountOffersForCollectible, useFloorOrder, useHighestOffer, useListListingsForCollectible, useListOffersForCollectible, useLowestListing };
//# sourceMappingURL=orders-Dczf8-Ml.js.map