import { l as compareAddress } from "./utils.js";
import { i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient } from "./api.js";
import { i as serializeBigInts } from "./utils2.js";
import { v as buildInfiniteQueryOptions, y as buildQueryOptions } from "./_internal.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collection/queryKeys.ts
/**
* Creates a type-safe query key for collection domain with automatic bigint serialization
*
* @param operation - The specific operation (e.g., 'balance-details', 'metadata')
* @param params - The query parameters (will be automatically serialized)
* @returns A serialized query key safe for React Query
*/
function createCollectionQueryKey(operation, params) {
	return [
		"collection",
		operation,
		serializeBigInts(params)
	];
}

//#endregion
//#region src/react/queries/collection/balance-details.ts
/**
* Fetches detailed balance information for multiple accounts from the Indexer API
*/
async function fetchCollectionBalanceDetails(params) {
	const { chainId, filter, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const promises = filter.accountAddresses.map((accountAddress) => indexerClient.getTokenBalancesDetails({ filter: {
		accountAddresses: [accountAddress],
		contractWhitelist: filter.contractWhitelist,
		omitNativeBalances: filter.omitNativeBalances
	} }));
	const mergedResponse = (await Promise.all(promises)).reduce((acc, curr) => {
		if (!curr) return acc;
		return {
			page: curr.page,
			nativeBalances: [...acc.nativeBalances || [], ...curr.nativeBalances || []],
			balances: [...acc.balances || [], ...curr.balances || []]
		};
	}, {
		page: {
			page: 0,
			pageSize: 0,
			more: false
		},
		nativeBalances: [],
		balances: []
	});
	if (!mergedResponse) throw new Error("Failed to fetch collection balance details");
	return mergedResponse;
}
function getCollectionBalanceDetailsQueryKey(params) {
	const { chainId, filter } = params;
	return createCollectionQueryKey("balance-details", {
		chainId,
		filter
	});
}
function collectionBalanceDetailsQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCollectionBalanceDetailsQueryKey,
		requiredParams: [
			"chainId",
			"filter",
			"config"
		],
		fetcher: fetchCollectionBalanceDetails,
		customValidation: (p) => !!p.filter?.accountAddresses && p.filter.accountAddresses.length > 0
	}, params);
}

//#endregion
//#region src/react/queries/collection/list.ts
function getAllCollections(marketplaceConfig) {
	return [...marketplaceConfig.market.collections, ...marketplaceConfig.shop.collections];
}
function filterCollectionsByType(collections, collectionType) {
	if (!collectionType) return collections;
	return collections.filter((c) => c.marketplaceCollectionType === collectionType);
}
function groupCollectionsByChain(collections) {
	return collections.reduce((acc, curr) => {
		const { chainId, itemsAddress } = curr;
		if (!acc[chainId]) acc[chainId] = [];
		acc[chainId].push(itemsAddress);
		return acc;
	}, {});
}
/**
* Fetches collections from the metadata API with marketplace config filtering
*/
async function fetchListCollections(params) {
	const { collectionType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);
	let collections = getAllCollections(marketplaceConfig);
	if (!collections?.length) return [];
	collections = filterCollectionsByType(collections, collectionType);
	const collectionsByChain = groupCollectionsByChain(collections);
	const promises = Object.entries(collectionsByChain).map(([chainId, addresses]) => metadataClient.getContractInfoBatch({
		chainId: Number(chainId),
		contractAddresses: addresses
	}).then((resp) => Object.values(resp.contractInfoMap)));
	const settled = await Promise.allSettled(promises);
	if (settled.every((result) => result.status === "rejected")) throw settled[0].reason;
	const results = settled.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
	return collections.map((collection) => {
		return {
			collection,
			metadata: results.find((result) => compareAddress(result.address, collection.itemsAddress))
		};
	}).filter((item) => item.metadata !== void 0).map(({ collection, metadata }) => ({
		...collection,
		...metadata
	}));
}
function getListCollectionsQueryKey(params) {
	return createCollectionQueryKey("list", {
		collectionType: params.collectionType,
		marketplaceConfig: params.marketplaceConfig
	});
}
function listCollectionsQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListCollectionsQueryKey,
		requiredParams: ["marketplaceConfig", "config"],
		fetcher: fetchListCollections
	}, params);
}
const listCollectionsOptions = ({ collectionType, marketplaceConfig, config, query }) => {
	return queryOptions({
		queryKey: [
			"collection",
			"list",
			{
				collectionType,
				marketplaceConfig,
				config
			}
		],
		queryFn: marketplaceConfig && config ? () => fetchListCollections({
			marketplaceConfig,
			config,
			collectionType
		}) : skipToken,
		...query
	});
};

//#endregion
//#region src/react/queries/collection/market-activities.ts
/**
* Fetches collection activities from the Marketplace API
*/
async function fetchListCollectionActivities(params) {
	const { chainId, config, page, pageSize, sort, ...additionalApiParams } = params;
	return await getMarketplaceClient(config).listCollectionActivities({
		chainId,
		page: page || pageSize || sort ? {
			page: page ?? 1,
			pageSize: pageSize ?? 10,
			sort
		} : void 0,
		...additionalApiParams
	});
}
function getListCollectionActivitiesQueryKey(params) {
	return [
		"collection",
		"market-activities",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}
	];
}
function listCollectionActivitiesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListCollectionActivitiesQueryKey,
		requiredParams: [
			"collectionAddress",
			"chainId",
			"config"
		],
		fetcher: fetchListCollectionActivities
	}, params);
}

//#endregion
//#region src/react/queries/collection/market-detail.ts
/**
* Fetches collection details from the marketplace API
*/
async function fetchMarketCollectionDetail(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getCollectionDetail(apiParams)).collection;
}
function getCollectionMarketDetailQueryKey(params) {
	return [
		"collection",
		"market-detail",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? ""
		}
	];
}
function collectionMarketDetailQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCollectionMarketDetailQueryKey,
		requiredParams: [
			"collectionAddress",
			"chainId",
			"config"
		],
		fetcher: fetchMarketCollectionDetail
	}, params);
}

//#endregion
//#region src/react/queries/collection/market-filtered-count.ts
async function fetchGetCountOfFilteredOrders(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getCountOfFilteredOrders(apiParams)).count;
}
function getCountOfFilteredOrdersQueryKey(params) {
	return [
		"collection",
		"market-filtered-count",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			side: params.side,
			filter: params.filter
		}
	];
}
function getCountOfFilteredOrdersQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCountOfFilteredOrdersQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config",
			"side"
		],
		fetcher: fetchGetCountOfFilteredOrders
	}, params);
}

//#endregion
//#region src/react/queries/collection/market-floor.ts
/**
* Fetches the floor order for a collection from the marketplace API
*/
async function fetchFloorOrder(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getFloorOrder(apiParams)).collectible;
}
function getFloorOrderQueryKey(params) {
	return [
		"collection",
		"market-floor",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			filter: params.filter
		}
	];
}
function floorOrderQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getFloorOrderQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchFloorOrder
	}, params);
}

//#endregion
//#region src/react/queries/collection/market-items.ts
async function fetchListItemsOrdersForCollection(params, page) {
	const { config, ...apiParams } = params;
	return await getMarketplaceClient(config).listOrdersWithCollectibles({
		...apiParams,
		page
	});
}
function getListItemsOrdersForCollectionQueryKey(params) {
	return createCollectionQueryKey("market-items", {
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter
	});
}
function listItemsOrdersForCollectionQueryOptions(params) {
	return buildInfiniteQueryOptions({
		getQueryKey: getListItemsOrdersForCollectionQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"side",
			"config"
		],
		fetcher: fetchListItemsOrdersForCollection,
		getPageInfo: (response) => response.page
	}, params);
}

//#endregion
//#region src/react/queries/collection/market-items-count.ts
/**
* Fetches count of orders for a collection from the marketplace API
*/
async function fetchCountItemsOrdersForCollection(params) {
	const { config, ...apiParams } = params;
	return (await getMarketplaceClient(config).getCountOfAllOrders(apiParams)).count;
}
function getCountItemsOrdersForCollectionQueryKey(params) {
	return [
		"collection",
		"market-items-count",
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? "",
			side: params.side
		}
	];
}
function countItemsOrdersForCollectionQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCountItemsOrdersForCollectionQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config",
			"side"
		],
		fetcher: fetchCountItemsOrdersForCollection
	}, params);
}

//#endregion
//#region src/react/queries/collection/market-items-paginated.ts
/**
* Fetches a list of items orders for a collection with pagination support from the Marketplace API
*/
async function fetchListItemsOrdersForCollectionPaginated(params) {
	const { collectionAddress, chainId, config, page = 1, pageSize = 30, ...additionalApiParams } = params;
	return await getMarketplaceClient(config).listOrdersWithCollectibles({
		collectionAddress,
		chainId,
		page: {
			page,
			pageSize
		},
		...additionalApiParams
	});
}
function getListItemsOrdersForCollectionPaginatedQueryKey(params) {
	return [
		"order",
		"collection-items-paginated",
		params
	];
}
function listItemsOrdersForCollectionPaginatedQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListItemsOrdersForCollectionPaginatedQueryKey,
		requiredParams: [
			"collectionAddress",
			"chainId",
			"config",
			"side"
		],
		fetcher: fetchListItemsOrdersForCollectionPaginated
	}, params);
}

//#endregion
//#region src/react/queries/collection/metadata.ts
/**
* Fetches collection information from the metadata API
*/
async function fetchCollection(params) {
	const { chainId, collectionAddress, config } = params;
	return (await getMetadataClient(config).getContractInfo({
		chainId,
		collectionAddress
	})).contractInfo;
}
function getCollectionQueryKey(params) {
	return createCollectionQueryKey("metadata", {
		chainId: params.chainId,
		contractAddress: params.collectionAddress
	});
}
function collectionQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCollectionQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchCollection
	}, params);
}

//#endregion
export { fetchCollectionBalanceDetails as A, getListCollectionActivitiesQueryKey as C, listCollectionsOptions as D, getListCollectionsQueryKey as E, createCollectionQueryKey as M, listCollectionsQueryOptions as O, fetchListCollectionActivities as S, fetchListCollections as T, getCountOfFilteredOrdersQueryKey as _, getListItemsOrdersForCollectionPaginatedQueryKey as a, fetchMarketCollectionDetail as b, fetchCountItemsOrdersForCollection as c, getListItemsOrdersForCollectionQueryKey as d, listItemsOrdersForCollectionQueryOptions as f, fetchGetCountOfFilteredOrders as g, getFloorOrderQueryKey as h, fetchListItemsOrdersForCollectionPaginated as i, getCollectionBalanceDetailsQueryKey as j, collectionBalanceDetailsQueryOptions as k, getCountItemsOrdersForCollectionQueryKey as l, floorOrderQueryOptions as m, fetchCollection as n, listItemsOrdersForCollectionPaginatedQueryOptions as o, fetchFloorOrder as p, getCollectionQueryKey as r, countItemsOrdersForCollectionQueryOptions as s, collectionQueryOptions as t, fetchListItemsOrdersForCollection as u, getCountOfFilteredOrdersQueryOptions as v, listCollectionActivitiesQueryOptions as w, getCollectionMarketDetailQueryKey as x, collectionMarketDetailQueryOptions as y };
//# sourceMappingURL=collection.js.map