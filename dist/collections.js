import { c as balanceQueries, d as collectionKeys, i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient } from "./api.js";
import { l as compareAddress } from "./utils.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collections/collection.ts
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
	const apiArgs = {
		chainID: String(params.chainId),
		contractAddress: params.collectionAddress
	};
	return [...collectionKeys.detail, apiArgs];
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
//#region src/react/queries/collections/activeListingsCurrencies.ts
/**
* Fetches the active listings currencies for a collection from the marketplace API
*/
async function fetchCollectionActiveListingsCurrencies(params) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	return (await marketplaceClient.getCollectionActiveListingsCurrencies(apiArgs)).currencies;
}
function getCollectionActiveListingsCurrenciesQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress
	};
	return [...collectionKeys.activeListingsCurrencies, apiArgs];
}
function collectionActiveListingsCurrenciesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectionActiveListingsCurrenciesQueryKey(params),
		queryFn: () => fetchCollectionActiveListingsCurrencies({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collections/activeOffersCurrencies.ts
/**
* Fetches the active offers currencies for a collection from the marketplace API
*/
async function fetchCollectionActiveOffersCurrencies(params) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	return (await marketplaceClient.getCollectionActiveOffersCurrencies(apiArgs)).currencies;
}
function getCollectionActiveOffersCurrenciesQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress
	};
	return [...collectionKeys.activeOffersCurrencies, apiArgs];
}
function collectionActiveOffersCurrenciesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectionActiveOffersCurrenciesQueryKey(params),
		queryFn: () => fetchCollectionActiveOffersCurrencies({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collections/collectionBalanceDetails.ts
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
	const apiArgs = {
		chainId: params.chainId,
		filter: params.filter
	};
	return [...balanceQueries.collectionBalanceDetails, apiArgs];
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
//#region src/react/queries/collections/collectionDetails.ts
/**
* Fetches collection details from the marketplace API
*/
async function fetchCollectionDetails(params) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	return (await marketplaceClient.getCollectionDetail(apiArgs)).collection;
}
function getCollectionDetailsQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress
	};
	return [...collectionKeys.detail, apiArgs];
}
function collectionDetailsQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCollectionDetailsQueryKey(params),
		queryFn: () => fetchCollectionDetails({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collections/listCollectionActivities.ts
/**
* Fetches collection activities from the Marketplace API
*/
async function fetchListCollectionActivities(params) {
	const { collectionAddress, chainId, config, page, pageSize, sort, ...additionalApiParams } = params;
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
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		page
	};
	return [...collectionKeys.collectionActivities, apiArgs];
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
//#region src/react/queries/collections/listCollections.ts
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
	const queryKeyParams = {
		cardType: params.cardType,
		marketplaceConfig: params.marketplaceConfig
	};
	return [...collectionKeys.list, queryKeyParams];
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
		queryKey: [...collectionKeys.list, {
			cardType,
			marketplaceConfig,
			config
		}],
		queryFn: marketplaceConfig ? () => fetchListCollections({
			marketplaceConfig,
			config,
			cardType
		}) : skipToken,
		enabled: Boolean(marketplaceConfig)
	});
};

//#endregion
export { getCollectionQueryKey as S, collectionActiveListingsCurrenciesQueryOptions as _, fetchListCollectionActivities as a, collectionQueryOptions as b, collectionDetailsQueryOptions as c, collectionBalanceDetailsQueryOptions as d, fetchCollectionBalanceDetails as f, getCollectionActiveOffersCurrenciesQueryKey as g, fetchCollectionActiveOffersCurrencies as h, listCollectionsQueryOptions as i, fetchCollectionDetails as l, collectionActiveOffersCurrenciesQueryOptions as m, getListCollectionsQueryKey as n, getListCollectionActivitiesQueryKey as o, getCollectionBalanceDetailsQueryKey as p, listCollectionsOptions as r, listCollectionActivitiesQueryOptions as s, fetchListCollections as t, getCollectionDetailsQueryKey as u, fetchCollectionActiveListingsCurrencies as v, fetchCollection as x, getCollectionActiveListingsCurrenciesQueryKey as y };
//# sourceMappingURL=collections.js.map