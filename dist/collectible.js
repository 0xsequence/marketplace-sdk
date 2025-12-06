import { l as compareAddress } from "./utils.js";
import { i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient } from "./api.js";
import { v as buildInfiniteQueryOptions, y as buildQueryOptions } from "./_internal.js";
import { i as createCollectibleQueryKey } from "./token-balances.js";
import { t as fetchMarketplaceConfig } from "./config.js";
import { infiniteQueryOptions } from "@tanstack/react-query";

//#region src/react/queries/collectible/balance.ts
/**
* Fetches the balance of a specific collectible for a user
*
* @param params - Parameters for the API call
* @returns The balance data
*/
async function fetchBalanceOfCollectible(params) {
	const { chainId, userAddress, collectionAddress, tokenId, includeMetadata, config } = params;
	return getIndexerClient(chainId, config).getTokenBalances({
		accountAddress: userAddress,
		contractAddress: collectionAddress,
		tokenId,
		includeMetadata: includeMetadata ?? false,
		metadataOptions: { verifiedOnly: true }
	}).then((res) => res.balances[0] || null);
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
*/
function getBalanceOfCollectibleQueryKey(params) {
	return createCollectibleQueryKey("balance", {
		chainId: params.chainId,
		accountAddress: params.userAddress,
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.userAddress ? { verifiedOnly: true } : void 0
	});
}
/**
* Creates a tanstack query options object for the balance query
*
* @param params - The query parameters
* @returns Query options configuration
*/
function balanceOfCollectibleOptions(params) {
	return buildQueryOptions({
		getQueryKey: getBalanceOfCollectibleQueryKey,
		requiredParams: [
			"userAddress",
			"collectionAddress",
			"tokenId",
			"chainId",
			"config"
		],
		fetcher: fetchBalanceOfCollectible
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-activities.ts
/**
* Fetches collectible activities from the Marketplace API
*/
async function fetchListCollectibleActivities(params) {
	const { chainId, config, page, pageSize, sort, ...additionalApiParams } = params;
	return await getMarketplaceClient(config).listCollectibleActivities({
		chainId,
		page: page || pageSize || sort ? {
			page: page ?? 1,
			pageSize: pageSize ?? 10,
			sort
		} : void 0,
		...additionalApiParams
	});
}
function getListCollectibleActivitiesQueryKey(params) {
	return [
		"collectible",
		"market-activities",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}
	];
}
function listCollectibleActivitiesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListCollectibleActivitiesQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchListCollectibleActivities
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-count.ts
/**
* Fetches count of collectibles from the marketplace API
*/
async function fetchCountOfCollectables(params) {
	const { collectionAddress, chainId, config, filter, side } = params;
	const client = getMarketplaceClient(config);
	if (filter && side) {
		const apiArgs$1 = {
			collectionAddress,
			chainId,
			filter,
			side
		};
		return (await client.getCountOfFilteredCollectibles(apiArgs$1)).count;
	}
	const apiArgs = {
		collectionAddress,
		chainId
	};
	return (await client.getCountOfAllCollectibles(apiArgs)).count;
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'market-count', { chainId, contractAddress, filter?, side? }]
*/
function getCountOfCollectablesQueryKey(params) {
	return [
		"collectible",
		"market-count",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			filter: params.filter,
			side: params.side
		}
	];
}
function countOfCollectablesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCountOfCollectablesQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchCountOfCollectables
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-highest-offer.ts
/**
* Fetches the highest offer for a collectible from the marketplace API
*/
async function fetchHighestOffer(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getHighestPriceOfferForCollectible(apiParams)).order;
}
function getHighestOfferQueryKey(params) {
	return [
		"collectible",
		"market-highest-offer",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			filter: params.filter
		}
	];
}
function highestOfferQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getHighestOfferQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchHighestOffer
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-list.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectibles(params, page) {
	const { chainId, collectionAddress, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const isMarketCollection = (await fetchMarketplaceConfig({ config }))?.market.collections.some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	if (params.enabled === false || !isMarketCollection) return {
		collectibles: [],
		page: {
			page: 1,
			pageSize: 30,
			more: false
		}
	};
	return await marketplaceClient.listCollectibles({
		chainId,
		collectionAddress,
		page,
		...additionalApiParams
	});
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
*/
function getListCollectiblesQueryKey(params) {
	return [
		"collectible",
		"market-list",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			side: params.side,
			filter: params.filter
		}
	];
}
function listCollectiblesQueryOptions(params) {
	return buildInfiniteQueryOptions({
		getQueryKey: getListCollectiblesQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"side",
			"config"
		],
		fetcher: fetchListCollectibles,
		getPageInfo: (response) => response.page
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-list-paginated.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectiblesPaginated(params) {
	const { collectionAddress, chainId, config, page = 1, pageSize = 30, ...additionalApiParams } = params;
	return await getMarketplaceClient(config).listCollectibles({
		collectionAddress,
		chainId,
		page: {
			page,
			pageSize
		},
		...additionalApiParams
	});
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'market-list-paginated', { chainId, contractAddress, side, filter, page }]
*/
function getListCollectiblesPaginatedQueryKey(params) {
	return [
		"collectible",
		"market-list-paginated",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			side: params.side,
			filter: params.filter,
			page: params.page,
			pageSize: params.pageSize
		}
	];
}
function listCollectiblesPaginatedQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListCollectiblesPaginatedQueryKey,
		requiredParams: [
			"collectionAddress",
			"chainId",
			"side",
			"config"
		],
		fetcher: fetchListCollectiblesPaginated
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-listings.ts
/**
* Fetches listings for a specific collectible from the Marketplace API
*/
async function fetchListListingsForCollectible(params) {
	const { config, ...apiParams } = params;
	return await getMarketplaceClient(config).listListingsForCollectible(apiParams);
}
function getListListingsForCollectibleQueryKey(params) {
	return [
		"collectible",
		"market-listings",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
			page: params.page
		}
	];
}
function listListingsForCollectibleQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListListingsForCollectibleQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchListListingsForCollectible
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-listings-count.ts
/**
* Fetches count of listings for a collectible from the marketplace API
*/
async function fetchCountListingsForCollectible(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getCountOfListingsForCollectible(apiParams)).count;
}
function getCountListingsForCollectibleQueryKey(params) {
	return [
		"collectible",
		"market-listings-count",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			filter: params.filter
		}
	];
}
function countListingsForCollectibleQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCountListingsForCollectibleQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchCountListingsForCollectible
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-lowest-listing.ts
async function fetchLowestListing(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getLowestPriceListingForCollectible(apiParams)).order;
}
function getLowestListingQueryKey(params) {
	return [
		"collectible",
		"market-lowest-listing",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			filter: params.filter
		}
	];
}
function lowestListingQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getLowestListingQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchLowestListing
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-offers.ts
/**
* Fetches offers for a specific collectible from the Marketplace API
*/
async function fetchListOffersForCollectible(params) {
	const { config, sort, page, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const effectiveSort = sort || (page && "sort" in page ? page.sort : void 0);
	return await marketplaceClient.listOffersForCollectible({
		...additionalApiParams,
		page: page || effectiveSort ? {
			page: page?.page ?? 1,
			pageSize: page?.pageSize ?? 20,
			...page?.more && { more: page.more },
			...effectiveSort && { sort: effectiveSort }
		} : void 0
	});
}
function getListOffersForCollectibleQueryKey(params) {
	return [
		"collectible",
		"market-offers",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
			page: params.page
		}
	];
}
function listOffersForCollectibleQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListOffersForCollectibleQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchListOffersForCollectible
	}, params);
}

//#endregion
//#region src/react/queries/collectible/market-offers-count.ts
/**
* Fetches count of offers for a collectible from the marketplace API
*/
async function fetchCountOffersForCollectible(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getCountOfOffersForCollectible(apiParams)).count;
}
function getCountOffersForCollectibleQueryKey(params) {
	return [
		"collectible",
		"market-offers-count",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			tokenId: params.tokenId ?? 0n,
			filter: params.filter
		}
	];
}
function countOffersForCollectibleQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCountOffersForCollectibleQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchCountOffersForCollectible
	}, params);
}

//#endregion
//#region src/react/queries/collectible/metadata.ts
/**
* Fetches collectible metadata from the metadata API
*/
async function fetchCollectible(params) {
	const { tokenId, chainId, collectionAddress, config } = params;
	const metadataClient = getMetadataClient(config);
	const apiArgs = {
		chainId,
		contractAddress: collectionAddress,
		tokenIds: [tokenId]
	};
	return (await metadataClient.getTokenMetadata(apiArgs)).tokenMetadata[0];
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'metadata', { chainId, contractAddress, tokenIds }]
*/
function getCollectibleQueryKey(params) {
	return createCollectibleQueryKey("metadata", {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
		tokenIds: params.tokenId !== void 0 ? [params.tokenId] : []
	});
}
function collectibleQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCollectibleQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchCollectible,
		customValidation: (p) => !!p.chainId && p.chainId > 0
	}, params);
}

//#endregion
//#region src/react/queries/collectible/primary-sale-item.ts
/**
* Fetches a single primary sale item from the marketplace API
*/
async function fetchPrimarySaleItem(params) {
	const { chainId, primarySaleContractAddress, tokenId, config } = params;
	return getMarketplaceClient(config).getPrimarySaleItem({
		chainId,
		primarySaleContractAddress,
		tokenId: BigInt(tokenId)
	});
}
function getPrimarySaleItemQueryKey(params) {
	return createCollectibleQueryKey("primary-sale-item", {
		chainId: params.chainId ?? 0,
		primarySaleContractAddress: params.primarySaleContractAddress ?? "",
		tokenId: params.tokenId?.toString() ?? ""
	});
}
function primarySaleItemQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getPrimarySaleItemQueryKey,
		requiredParams: [
			"chainId",
			"primarySaleContractAddress",
			"tokenId",
			"config"
		],
		fetcher: fetchPrimarySaleItem
	}, params);
}

//#endregion
//#region src/react/queries/collectible/primary-sale-items.ts
/**
* Fetches primary sale items from the marketplace API
*/
async function fetchPrimarySaleItems(params) {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;
	return getMarketplaceClient(config).listPrimarySaleItems({
		chainId,
		primarySaleContractAddress,
		filter,
		page
	});
}
function getPrimarySaleItemsQueryKey(params) {
	return [
		"collectible",
		"primary-sale-items",
		{
			chainId: params.chainId ?? 0,
			primarySaleContractAddress: params.primarySaleContractAddress ?? "",
			filter: params.filter
		}
	];
}
const primarySaleItemsQueryOptions = (params) => {
	const enabled = Boolean(params.primarySaleContractAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	const initialPage = params.page || {
		page: 1,
		pageSize: 30
	};
	const queryFn = async ({ pageParam }) => {
		const requiredParams = params;
		return fetchPrimarySaleItems({
			chainId: requiredParams.chainId,
			primarySaleContractAddress: requiredParams.primarySaleContractAddress,
			filter: params.filter,
			page: pageParam,
			config: requiredParams.config
		});
	};
	return infiniteQueryOptions({
		queryKey: getPrimarySaleItemsQueryKey(params),
		queryFn,
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
};

//#endregion
//#region src/react/queries/collectible/primary-sale-items-count.ts
/**
* Fetches the count of primary sale items from the marketplace API
*/
async function fetchPrimarySaleItemsCount(params) {
	const { config, ...apiParams } = params;
	return getMarketplaceClient(config).getCountOfPrimarySaleItems(apiParams);
}
function getPrimarySaleItemsCountQueryKey(params) {
	return [
		"collectible",
		"primary-sale-items-count",
		{
			chainId: params.chainId ?? 0,
			primarySaleContractAddress: params.primarySaleContractAddress ?? "",
			filter: params.filter
		}
	];
}
const primarySaleItemsCountQueryOptions = (params) => {
	return buildQueryOptions({
		getQueryKey: getPrimarySaleItemsCountQueryKey,
		requiredParams: [
			"primarySaleContractAddress",
			"chainId",
			"config"
		],
		fetcher: fetchPrimarySaleItemsCount
	}, params);
};

//#endregion
export { listCollectiblesPaginatedQueryOptions as A, fetchListCollectibleActivities as B, fetchCountListingsForCollectible as C, listListingsForCollectibleQueryOptions as D, getListListingsForCollectibleQueryKey as E, getHighestOfferQueryKey as F, getBalanceOfCollectibleQueryKey as G, listCollectibleActivitiesQueryOptions as H, highestOfferQueryOptions as I, countOfCollectablesQueryOptions as L, getListCollectiblesQueryKey as M, listCollectiblesQueryOptions as N, fetchListCollectiblesPaginated as O, fetchHighestOffer as P, fetchCountOfCollectables as R, countListingsForCollectibleQueryOptions as S, fetchListListingsForCollectible as T, balanceOfCollectibleOptions as U, getListCollectibleActivitiesQueryKey as V, fetchBalanceOfCollectible as W, getListOffersForCollectibleQueryKey as _, getPrimarySaleItemsQueryKey as a, getLowestListingQueryKey as b, getPrimarySaleItemQueryKey as c, fetchCollectible as d, getCollectibleQueryKey as f, fetchListOffersForCollectible as g, getCountOffersForCollectibleQueryKey as h, fetchPrimarySaleItems as i, fetchListCollectibles as j, getListCollectiblesPaginatedQueryKey as k, primarySaleItemQueryOptions as l, fetchCountOffersForCollectible as m, getPrimarySaleItemsCountQueryKey as n, primarySaleItemsQueryOptions as o, countOffersForCollectibleQueryOptions as p, primarySaleItemsCountQueryOptions as r, fetchPrimarySaleItem as s, fetchPrimarySaleItemsCount as t, collectibleQueryOptions as u, listOffersForCollectibleQueryOptions as v, getCountListingsForCollectibleQueryKey as w, lowestListingQueryOptions as x, fetchLowestListing as y, getCountOfCollectablesQueryKey as z };
//# sourceMappingURL=collectible.js.map