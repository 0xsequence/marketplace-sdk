import { u as compareAddress } from "./utils.js";
import { h as serializeBigInts, i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient } from "./api.js";
import { n as buildInfiniteQueryOptions, r as buildQueryOptions } from "./_internal.js";
import { isAddress } from "viem";
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
const MAX_ADDRESSES_PER_BATCH = 15;
function chunkArray(array, size) {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
	return chunks;
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
	const promises = [];
	for (const [chainId, addresses] of Object.entries(collectionsByChain)) {
		const addressChunks = chunkArray(addresses, MAX_ADDRESSES_PER_BATCH);
		for (const chunk of addressChunks) promises.push(metadataClient.getContractInfoBatch({
			chainId: Number(chainId),
			contractAddresses: chunk
		}).then((resp) => Object.values(resp.contractInfoMap)));
	}
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
		fetcher: fetchMarketCollectionDetail,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
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
		fetcher: fetchGetCountOfFilteredOrders,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
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
		fetcher: fetchFloorOrder,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
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
		getPageInfo: (response) => response.page,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
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
		fetcher: fetchCountItemsOrdersForCollection,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
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
		fetcher: fetchListItemsOrdersForCollectionPaginated,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
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
		fetcher: fetchCollection,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
	}, params);
}

//#endregion
export { getListCollectionsQueryKey as C, fetchCollectionBalanceDetails as D, collectionBalanceDetailsQueryOptions as E, getCollectionBalanceDetailsQueryKey as O, fetchListCollections as S, listCollectionsQueryOptions as T, getCountOfFilteredOrdersQueryKey as _, getListItemsOrdersForCollectionPaginatedQueryKey as a, fetchMarketCollectionDetail as b, fetchCountItemsOrdersForCollection as c, getListItemsOrdersForCollectionQueryKey as d, listItemsOrdersForCollectionQueryOptions as f, fetchGetCountOfFilteredOrders as g, getFloorOrderQueryKey as h, fetchListItemsOrdersForCollectionPaginated as i, createCollectionQueryKey as k, getCountItemsOrdersForCollectionQueryKey as l, floorOrderQueryOptions as m, fetchCollection as n, listItemsOrdersForCollectionPaginatedQueryOptions as o, fetchFloorOrder as p, getCollectionQueryKey as r, countItemsOrdersForCollectionQueryOptions as s, collectionQueryOptions as t, fetchListItemsOrdersForCollection as u, getCountOfFilteredOrdersQueryOptions as v, listCollectionsOptions as w, getCollectionMarketDetailQueryKey as x, collectionMarketDetailQueryOptions as y };
//# sourceMappingURL=collection.js.map