import { i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient } from "./api-D2fhCs18.js";
import { w as compareAddress } from "./utils-Dr-4WqI6.js";
import { infiniteQueryOptions, queryOptions, skipToken } from "@tanstack/react-query";

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
		page: {},
		nativeBalances: [],
		balances: []
	});
	if (!mergedResponse) throw new Error("Failed to fetch collection balance details");
	return mergedResponse;
}
function getCollectionBalanceDetailsQueryKey(params) {
	return [
		"collection",
		"balance-details",
		{
			chainId: params.chainId,
			filter: params.filter
		}
	];
}
function collectionBalanceDetailsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.filter?.accountAddresses?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectionBalanceDetailsQueryKey(params),
		queryFn: () => fetchCollectionBalanceDetails({
			chainId: params.chainId,
			filter: params.filter,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collection/list.ts
const allCollections = (marketplaceConfig) => {
	return [...marketplaceConfig.market.collections, ...marketplaceConfig.shop.collections];
};
/**
* Fetches collections from the metadata API with marketplace config filtering
*/
async function fetchListCollections(params) {
	const { cardType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);
	let collections = allCollections(marketplaceConfig);
	if (!collections?.length) return [];
	if (cardType) collections = collections.filter((collection) => collection.cardType === cardType);
	const collectionsByChain = collections.reduce((acc, curr) => {
		const { chainId, itemsAddress } = curr;
		if (!acc[chainId]) acc[chainId] = [];
		acc[chainId].push(itemsAddress);
		return acc;
	}, {});
	const promises = Object.entries(collectionsByChain).map(([chainId, addresses]) => metadataClient.getContractInfoBatch({
		chainID: chainId,
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
	return [
		"collection",
		"list",
		{
			cardType: params.cardType,
			marketplaceConfig: params.marketplaceConfig
		}
	];
}
function listCollectionsQueryOptions(params) {
	const enabled = Boolean(params.marketplaceConfig && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListCollectionsQueryKey(params),
		queryFn: enabled ? () => fetchListCollections({
			marketplaceConfig: params.marketplaceConfig,
			config: params.config,
			cardType: params.cardType
		}) : skipToken,
		...params.query,
		enabled
	});
}
const listCollectionsOptions = ({ cardType, marketplaceConfig, config }) => {
	return queryOptions({
		queryKey: [
			"collection",
			"list",
			{
				cardType,
				marketplaceConfig,
				config
			}
		],
		queryFn: marketplaceConfig ? () => fetchListCollections({
			marketplaceConfig,
			config,
			cardType
		}) : skipToken,
		enabled: Boolean(marketplaceConfig)
	});
};

//#endregion
//#region src/react/queries/collection/market-activities.ts
/**
* Fetches collection activities from the Marketplace API
*/
async function fetchListCollectionActivities(params) {
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
	return await marketplaceClient.listCollectionActivities(apiArgs);
}
function getListCollectionActivitiesQueryKey(params) {
	const page = params.page || params.pageSize || params.sort ? {
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 10,
		sort: params.sort
	} : void 0;
	return [
		"collection",
		"market-activities",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			page
		}
	];
}
function listCollectionActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListCollectionActivitiesQueryKey(params),
		queryFn: () => fetchListCollectionActivities({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collection/market-detail.ts
/**
* Fetches collection details from the marketplace API
*/
async function fetchMarketCollectionDetail(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	return (await marketplaceClient.getCollectionDetail(apiArgs)).collection;
}
function getCollectionMarketDetailQueryKey(params) {
	return [
		"collection",
		"market-detail",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress
		}
	];
}
function collectionMarketDetailQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectionMarketDetailQueryKey(params),
		queryFn: () => fetchMarketCollectionDetail({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collection/market-filtered-count.ts
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
	return [
		"collection",
		"market-filtered-count",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			side: params.side,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collection/market-floor.ts
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
	return [
		"collection",
		"market-floor",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collection/market-items.ts
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
	return [
		"collection",
		"market-items",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			side: params.side,
			filter: params.filter
		}
	];
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
//#region src/react/queries/collection/market-items-count.ts
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
	return [
		"order",
		"collection-items-count",
		{
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			side: params.side
		}
	];
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
//#region src/react/queries/collection/market-items-paginated.ts
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
			"order",
			"collection-items-paginated",
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
//#region src/react/queries/collection/metadata.ts
/**
* Fetches collection information from the metadata API
*/
async function fetchCollection(params) {
	const { collectionAddress, chainId, config } = params;
	return (await getMetadataClient(config).getContractInfo({
		chainID: chainId.toString(),
		contractAddress: collectionAddress
	})).contractInfo;
}
function getCollectionQueryKey(params) {
	return [
		"collection",
		"metadata",
		{
			chainID: String(params.chainId),
			contractAddress: params.collectionAddress
		}
	];
}
function collectionQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectionQueryKey(params),
		queryFn: () => fetchCollection({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { getCollectionBalanceDetailsQueryKey as A, listCollectionActivitiesQueryOptions as C, listCollectionsQueryOptions as D, listCollectionsOptions as E, collectionBalanceDetailsQueryOptions as O, getListCollectionActivitiesQueryKey as S, getListCollectionsQueryKey as T, getCountOfFilteredOrdersQueryOptions as _, listItemsOrdersForCollectionPaginatedQueryOptions as a, getCollectionMarketDetailQueryKey as b, getCountItemsOrdersForCollectionQueryKey as c, listItemsOrdersForCollectionQueryOptions as d, fetchFloorOrder as f, getCountOfFilteredOrdersQueryKey as g, fetchGetCountOfFilteredOrders as h, fetchListItemsOrdersForCollectionPaginated as i, fetchCollectionBalanceDetails as k, fetchListItemsOrdersForCollection as l, getFloorOrderQueryKey as m, fetchCollection as n, countItemsOrdersForCollectionQueryOptions as o, floorOrderQueryOptions as p, getCollectionQueryKey as r, fetchCountItemsOrdersForCollection as s, collectionQueryOptions as t, getListItemsOrdersForCollectionQueryKey as u, collectionMarketDetailQueryOptions as v, fetchListCollections as w, fetchListCollectionActivities as x, fetchMarketCollectionDetail as y };
//# sourceMappingURL=collection-Bxcq3NMa.js.map