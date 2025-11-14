import { i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient } from "./api-D2fhCs18.js";
import { w as compareAddress } from "./utils-Dr-4WqI6.js";
import { t as fetchMarketplaceConfig } from "./config-Bcwj-muV.js";
import { infiniteQueryOptions, queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collectible/balance.ts
/**
* Fetches the balance of a specific collectible for a user
*
* @param args - Arguments for the API call
* @param config - SDK configuration
* @returns The balance data
*/
async function fetchBalanceOfCollectible(args, config) {
	return getIndexerClient(args.chainId, config).getTokenBalances({
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		tokenID: args.collectableId,
		includeMetadata: args.includeMetadata ?? false,
		metadataOptions: {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		}
	}).then((res) => res.balances[0] || null);
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
*/
function getBalanceOfCollectibleQueryKey(args) {
	return [
		"collectible",
		"balance",
		{
			chainId: args.chainId,
			accountAddress: args.userAddress,
			contractAddress: args.collectionAddress,
			tokenID: args.collectableId,
			includeMetadata: args.includeMetadata,
			metadataOptions: args.userAddress ? {
				verifiedOnly: true,
				includeContracts: [args.collectionAddress]
			} : void 0
		}
	];
}
/**
* Creates a tanstack query options object for the balance query
*
* @param args - The query arguments
* @param config - SDK configuration
* @returns Query options configuration
*/
function balanceOfCollectibleOptions(args, config) {
	const enabled = !!args.userAddress && (args.query?.enabled ?? true);
	return queryOptions({
		queryKey: getBalanceOfCollectibleQueryKey(args),
		queryFn: enabled ? () => fetchBalanceOfCollectible({
			...args,
			userAddress: args.userAddress
		}, config) : skipToken
	});
}

//#endregion
//#region src/react/queries/collectible/market-activities.ts
/**
* Fetches collectible activities from the Marketplace API
*/
async function fetchListCollectibleActivities(params) {
	const { collectionAddress, chainId, config, page, pageSize, sort,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = page || pageSize || sort ? {
		page: page ?? 1,
		pageSize: pageSize ?? 10,
		sort
	} : void 0;
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleActivities(apiArgs);
}
function getListCollectibleActivitiesQueryKey(params) {
	const page = params.page || params.pageSize || params.sort ? {
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 10,
		sort: params.sort
	} : void 0;
	return [
		"collectible",
		"market-activities",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.tokenId,
			page
		}
	];
}
function listCollectibleActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListCollectibleActivitiesQueryKey(params),
		queryFn: () => fetchListCollectibleActivities({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			tokenId: params.tokenId,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}),
		...params.query,
		enabled
	});
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
			contractAddress: collectionAddress,
			chainId: String(chainId),
			filter,
			side
		};
		return (await client.getCountOfFilteredCollectibles(apiArgs$1)).count;
	}
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId)
	};
	return (await client.getCountOfAllCollectibles(apiArgs)).count;
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'market-count', { chainId, contractAddress, filter?, side? }]
*/
function getCountOfCollectablesQueryKey(params) {
	if (params.filter && params.side) return [
		"collectible",
		"market-count",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			filter: params.filter,
			side: params.side
		}
	];
	return [
		"collectible",
		"market-count",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress
		}
	];
}
function countOfCollectablesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCountOfCollectablesQueryKey(params),
		queryFn: () => fetchCountOfCollectables({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			filter: params.filter,
			side: params.side
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collectible/market-highest-offer.ts
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
	return (await marketplaceClient.getHighestPriceOfferForCollectible(apiArgs)).order ?? null;
}
function getHighestOfferQueryKey(params) {
	return [
		"collectible",
		"market-highest-offer",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.tokenId,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collectible/market-list.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectibles(params, page) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
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
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibles(apiArgs);
}
/**
* Query key structure: [resource, operation, params]
* - resource: folder name ('collectible')
* - operation: file name ('list')
* @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
*/
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
*/
function getListCollectiblesQueryKey(params) {
	return [
		"collectible",
		"market-list",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			side: params.side,
			filter: params.filter
		}
	];
}
function listCollectiblesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.side && params.config && (params.query?.enabled ?? true));
	return infiniteQueryOptions({
		queryKey: getListCollectiblesQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return fetchListCollectibles({
				chainId: params.chainId,
				collectionAddress: params.collectionAddress,
				config: params.config,
				side: params.side,
				filter: params.filter,
				cardType: params.cardType
			}, pageParam);
		},
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collectible/market-list-paginated.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectiblesPaginated(params) {
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
	return await marketplaceClient.listCollectibles(apiArgs);
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
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			side: params.side,
			filter: params.filter,
			page: params.page ? {
				page: params.page,
				pageSize: params.pageSize ?? 30
			} : void 0
		}
	];
}
function listCollectiblesPaginatedQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.side && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListCollectiblesPaginatedQueryKey(params),
		queryFn: () => fetchListCollectiblesPaginated({
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
//#region src/react/queries/collectible/market-listings.ts
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
	return await marketplaceClient.listListingsForCollectible(apiArgs);
}
function getListListingsForCollectibleQueryKey(params) {
	return [
		"collectible",
		"market-listings",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.collectibleId,
			filter: params.filter,
			page: params.page
		}
	];
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
//#region src/react/queries/collectible/market-listings-count.ts
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
	return [
		"order",
		"listings-count",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.collectibleId,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collectible/market-lowest-listing.ts
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
	return (await marketplaceClient.getLowestPriceListingForCollectible(apiArgs)).order || null;
}
function getLowestListingQueryKey(params) {
	return [
		"collectible",
		"market-lowest-listing",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.tokenId,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collectible/market-offers.ts
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
	return await marketplaceClient.listOffersForCollectible(apiArgs);
}
function getListOffersForCollectibleQueryKey(params) {
	return [
		"collectible",
		"market-offers",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.collectibleId,
			filter: params.filter,
			page: params.page
		}
	];
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
//#region src/react/queries/collectible/market-offers-count.ts
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
	return [
		"order",
		"offers-count",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenId: params.collectibleId,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collectible/metadata.ts
/**
* Fetches collectible metadata from the metadata API
*/
async function fetchCollectible(params) {
	const { collectionAddress, collectibleId, chainId, config } = params;
	const metadataClient = getMetadataClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainID: String(chainId),
		tokenIDs: [collectibleId]
	};
	return (await metadataClient.getTokenMetadata(apiArgs)).tokenMetadata[0];
}
/**
* Query key structure: [resource, operation, params]
* @example ['collectible', 'metadata', { chainID, contractAddress, tokenIDs }]
*/
function getCollectibleQueryKey(params) {
	return [
		"collectible",
		"metadata",
		{
			chainID: String(params.chainId),
			contractAddress: params.collectionAddress,
			tokenIDs: [params.collectibleId]
		}
	];
}
function collectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.collectibleId && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectibleQueryKey(params),
		queryFn: () => fetchCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collectible/primary-sale-items.ts
/**
* Fetches primary sale items from the marketplace API
*/
async function fetchPrimarySaleItems(params) {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;
	return getMarketplaceClient(config).listPrimarySaleItems({
		chainId: String(chainId),
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
			chainId: String(params.chainId),
			primarySaleContractAddress: params.primarySaleContractAddress,
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
	return infiniteQueryOptions({
		queryKey: getPrimarySaleItemsQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return fetchPrimarySaleItems({
				chainId: params.chainId,
				primarySaleContractAddress: params.primarySaleContractAddress,
				filter: params.filter,
				page: pageParam,
				config: params.config
			});
		},
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
	const { chainId, primarySaleContractAddress, filter, config } = params;
	return getMarketplaceClient(config).getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	});
}
function getPrimarySaleItemsCountQueryKey(args) {
	return [
		"collectible",
		"primary-sale-items-count",
		{
			chainId: String(args.chainId),
			primarySaleContractAddress: args.primarySaleContractAddress,
			filter: args.filter
		}
	];
}
const primarySaleItemsCountQueryOptions = (args) => {
	const enabled = Boolean(args.primarySaleContractAddress && args.chainId && args.config && (args.query?.enabled ?? true));
	return queryOptions({
		queryKey: getPrimarySaleItemsCountQueryKey(args),
		queryFn: () => fetchPrimarySaleItemsCount({
			chainId: args.chainId,
			primarySaleContractAddress: args.primarySaleContractAddress,
			filter: args.filter,
			config: args.config
		}),
		...args.query,
		enabled
	});
};

//#endregion
export { listCollectiblesQueryOptions as A, balanceOfCollectibleOptions as B, getListListingsForCollectibleQueryKey as C, listCollectiblesPaginatedQueryOptions as D, getListCollectiblesPaginatedQueryKey as E, fetchCountOfCollectables as F, getBalanceOfCollectibleQueryKey as H, getCountOfCollectablesQueryKey as I, fetchListCollectibleActivities as L, getHighestOfferQueryKey as M, highestOfferQueryOptions as N, fetchListCollectibles as O, countOfCollectablesQueryOptions as P, getListCollectibleActivitiesQueryKey as R, fetchListListingsForCollectible as S, fetchListCollectiblesPaginated as T, fetchBalanceOfCollectible as V, getLowestListingQueryKey as _, getPrimarySaleItemsQueryKey as a, fetchCountListingsForCollectible as b, fetchCollectible as c, fetchCountOffersForCollectible as d, getCountOffersForCollectibleQueryKey as f, fetchLowestListing as g, listOffersForCollectibleQueryOptions as h, fetchPrimarySaleItems as i, fetchHighestOffer as j, getListCollectiblesQueryKey as k, getCollectibleQueryKey as l, getListOffersForCollectibleQueryKey as m, getPrimarySaleItemsCountQueryKey as n, primarySaleItemsQueryOptions as o, fetchListOffersForCollectible as p, primarySaleItemsCountQueryOptions as r, collectibleQueryOptions as s, fetchPrimarySaleItemsCount as t, countOffersForCollectibleQueryOptions as u, lowestListingQueryOptions as v, listListingsForCollectibleQueryOptions as w, getCountListingsForCollectibleQueryKey as x, countListingsForCollectibleQueryOptions as y, listCollectibleActivitiesQueryOptions as z };
//# sourceMappingURL=collectible-B1NWzMbQ.js.map