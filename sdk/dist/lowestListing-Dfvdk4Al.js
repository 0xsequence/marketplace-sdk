import { collectableKeys, getMarketplaceClient } from "./api-BiMGqWdz.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/countListingsForCollectible.ts
/**
* Fetches count of listings for a collectible from the marketplace API
*/
async function fetchCountListingsForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter
	};
	const result = await client.getCountOfListingsForCollectible(apiArgs);
	return result.count;
}
function countListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.listingsCount, params],
		queryFn: () => fetchCountListingsForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/countOffersForCollectible.ts
/**
* Fetches count of offers for a collectible from the marketplace API
*/
async function fetchCountOffersForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter
	};
	const result = await client.getCountOfOffersForCollectible(apiArgs);
	return result.count;
}
function countOffersForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.offersCount, params],
		queryFn: () => fetchCountOffersForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/floorOrder.ts
/**
* Fetches the floor order for a collection from the marketplace API
*/
async function fetchFloorOrder(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getFloorOrder(apiArgs);
	return result.collectible;
}
function floorOrderQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.floorOrders, params],
		queryFn: () => fetchFloorOrder({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			...params.filter && { filter: params.filter } || {}
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/highestOffer.ts
/**
* Fetches the highest offer for a collectible from the marketplace API
*/
async function fetchHighestOffer(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getCollectibleHighestOffer(apiArgs);
	return result.order ?? null;
}
function highestOfferQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.highestOffers, params],
		queryFn: () => fetchHighestOffer({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			tokenId: params.tokenId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/listListingsForCollectible.ts
/**
* Fetches listings for a specific collectible from the Marketplace API
*/
async function fetchListListingsForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleListings(apiArgs);
}
function listListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.listings, params],
		queryFn: () => fetchListListingsForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter,
			page: params.page
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/lowestListing.ts
/**
* Fetches the lowest listing for a collectible from the marketplace API
*/
async function fetchLowestListing(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getCollectibleLowestListing(apiArgs);
	return result.order || null;
}
function lowestListingQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.lowestListings, params],
		queryFn: () => fetchLowestListing({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			tokenId: params.tokenId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { countListingsForCollectibleQueryOptions, countOffersForCollectibleQueryOptions, fetchCountListingsForCollectible, fetchCountOffersForCollectible, fetchFloorOrder, fetchHighestOffer, fetchListListingsForCollectible, fetchLowestListing, floorOrderQueryOptions, highestOfferQueryOptions, listListingsForCollectibleQueryOptions, lowestListingQueryOptions };
//# sourceMappingURL=lowestListing-Dfvdk4Al.js.map