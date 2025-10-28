import { d as collectionKeys, r as getMarketplaceClient, u as collectableKeys } from "./api-CMGOh-La.js";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

//#region src/react/queries/orders/countItemsOrdersForCollection.ts
/**
* Fetches count of orders for a collection from the marketplace API
*/
async function fetchCountItemsOrdersForCollection(params) {
	const { collectionAddress, chainId, config, side } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		side
	};
	return (await client.getCountOfAllOrders(apiArgs)).count;
}
function getCountItemsOrdersForCollectionQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side
	};
	return [...collectionKeys.collectionItemsOrdersCount, apiArgs];
}
function countItemsOrdersForCollectionQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && params.side && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCountItemsOrdersForCollectionQueryKey(params),
		queryFn: () => fetchCountItemsOrdersForCollection({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			side: params.side
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/orders/countListingsForCollectible.ts
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
	return (await client.getCountOfListingsForCollectible(apiArgs)).count;
}
function getCountListingsForCollectibleQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter
	};
	return [...collectableKeys.listingsCount, apiArgs];
}
function countListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCountListingsForCollectibleQueryKey(params),
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
//#region src/react/queries/orders/countOffersForCollectible.ts
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
	return (await client.getCountOfOffersForCollectible(apiArgs)).count;
}
function getCountOffersForCollectibleQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter
	};
	return [...collectableKeys.offersCount, apiArgs];
}
function countOffersForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCountOffersForCollectibleQueryKey(params),
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
//#region src/react/queries/orders/floorOrder.ts
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
	return (await marketplaceClient.getFloorOrder(apiArgs)).collectible;
}
function getFloorOrderQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		filter: params.filter
	};
	return [...collectableKeys.floorOrders, apiArgs];
}
function floorOrderQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getFloorOrderQueryKey(params),
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
//#region src/react/queries/orders/getCountOfFilteredOrders.ts
async function fetchGetCountOfFilteredOrders(params) {
	const { collectionAddress, chainId, config, side, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		side,
		filter
	};
	return (await client.getCountOfFilteredOrders(apiArgs)).count;
}
function getCountOfFilteredOrdersQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter
	};
	return [...collectionKeys.getCountOfFilteredOrders, apiArgs];
}
function getCountOfFilteredOrdersQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && params.side && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCountOfFilteredOrdersQueryKey(params),
		queryFn: () => fetchGetCountOfFilteredOrders({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			side: params.side,
			filter: params.filter
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/orders/highestOffer.ts
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
	return (await marketplaceClient.getCollectibleHighestOffer(apiArgs)).order ?? null;
}
function getHighestOfferQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		filter: params.filter
	};
	return [...collectableKeys.highestOffers, apiArgs];
}
function highestOfferQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getHighestOfferQueryKey(params),
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
//#region src/react/queries/orders/listItemsOrdersForCollection.ts
async function fetchListItemsOrdersForCollection(params, page) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page,
		...additionalApiParams
	};
	return await marketplaceClient.listOrdersWithCollectibles(apiArgs);
}
function getListItemsOrdersForCollectionQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter
	};
	return [...collectionKeys.collectionItemsOrders, apiArgs];
}
function listItemsOrdersForCollectionQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && params.side && (params.query?.enabled ?? true));
	return infiniteQueryOptions({
		queryKey: getListItemsOrdersForCollectionQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return fetchListItemsOrdersForCollection({
				chainId: params.chainId,
				collectionAddress: params.collectionAddress,
				config: params.config,
				side: params.side,
				filter: params.filter
			}, pageParam);
		},
		initialPageParam: params.page || {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/orders/listItemsOrdersForCollectionPaginated.ts
/**
* Fetches a list of items orders for a collection with pagination support from the Marketplace API
*/
async function fetchListItemsOrdersForCollectionPaginated(params) {
	const { collectionAddress, chainId, config, page = 1, pageSize = 30,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = {
		page,
		pageSize
	};
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listOrdersWithCollectibles(apiArgs);
}
function listItemsOrdersForCollectionPaginatedQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && params.side && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			...collectionKeys.collectionItemsOrders,
			"paginated",
			params
		],
		queryFn: () => fetchListItemsOrdersForCollectionPaginated({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			side: params.side,
			filter: params.filter,
			page: params.page,
			pageSize: params.pageSize
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/orders/listListingsForCollectible.ts
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
function getListListingsForCollectibleQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter,
		page: params.page
	};
	return [...collectableKeys.listings, apiArgs];
}
function listListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListListingsForCollectibleQueryKey(params),
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
//#region src/react/queries/orders/listOffersForCollectible.ts
/**
* Fetches offers for a specific collectible from the Marketplace API
*/
async function fetchListOffersForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, sort, page,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const finalSort = sort || (page && "sort" in page ? page.sort : void 0);
	let finalPage;
	if (page || finalSort) finalPage = {
		page: page?.page ?? 1,
		pageSize: page?.pageSize ?? 20,
		...page?.more && { more: page.more },
		...finalSort && { sort: finalSort }
	};
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		page: finalPage,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleOffers(apiArgs);
}
function getListOffersForCollectibleQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter,
		page: params.page
	};
	return [...collectableKeys.offers, apiArgs];
}
function listOffersForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListOffersForCollectibleQueryKey(params),
		queryFn: () => fetchListOffersForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter,
			page: params.page,
			sort: params.sort
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/orders/lowestListing.ts
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
	return (await marketplaceClient.getCollectibleLowestListing(apiArgs)).order || null;
}
function getLowestListingQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		filter: params.filter
	};
	return [...collectableKeys.lowestListings, apiArgs];
}
function lowestListingQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getLowestListingQueryKey(params),
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
export { countItemsOrdersForCollectionQueryOptions as A, getFloorOrderQueryKey as C, countListingsForCollectibleQueryOptions as D, getCountOffersForCollectibleQueryKey as E, getCountItemsOrdersForCollectionQueryKey as M, fetchCountListingsForCollectible as O, floorOrderQueryOptions as S, fetchCountOffersForCollectible as T, highestOfferQueryOptions as _, getListOffersForCollectibleQueryKey as a, getCountOfFilteredOrdersQueryOptions as b, getListListingsForCollectibleQueryKey as c, listItemsOrdersForCollectionPaginatedQueryOptions as d, fetchListItemsOrdersForCollection as f, getHighestOfferQueryKey as g, fetchHighestOffer as h, fetchListOffersForCollectible as i, fetchCountItemsOrdersForCollection as j, getCountListingsForCollectibleQueryKey as k, listListingsForCollectibleQueryOptions as l, listItemsOrdersForCollectionQueryOptions as m, getLowestListingQueryKey as n, listOffersForCollectibleQueryOptions as o, getListItemsOrdersForCollectionQueryKey as p, lowestListingQueryOptions as r, fetchListListingsForCollectible as s, fetchLowestListing as t, fetchListItemsOrdersForCollectionPaginated as u, fetchGetCountOfFilteredOrders as v, countOffersForCollectibleQueryOptions as w, fetchFloorOrder as x, getCountOfFilteredOrdersQueryKey as y };
//# sourceMappingURL=lowestListing-Dc3tvO3o.js.map