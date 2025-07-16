import { collectionKeys, getMarketplaceClient, getMetadataClient } from "./api-BiMGqWdz.js";
import { compareAddress } from "./utils-D4D4JVMo.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collection.ts
/**
* Fetches collection information from the metadata API
*/
async function fetchCollection(params) {
	const { collectionAddress, chainId, config } = params;
	const metadataClient = getMetadataClient(config);
	const result = await metadataClient.getContractInfo({
		chainID: chainId.toString(),
		contractAddress: collectionAddress
	});
	return result.contractInfo;
}
function collectionQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
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
//#region src/react/queries/collectionDetails.ts
/**
* Fetches collection details from the marketplace API
*/
async function fetchCollectionDetails(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getCollectionDetail(apiArgs);
	return result.collection;
}
function collectionDetailsQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
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
//#region src/react/queries/listCollectionActivities.ts
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
function listCollectionActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.collectionActivities, params],
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
//#region src/react/queries/listCollections.ts
const allCollections = (marketplaceConfig) => {
	return [...marketplaceConfig.market.collections, ...marketplaceConfig.shop.collections];
};
/**
* Fetches collections from the metadata API with marketplace config filtering
*/
async function fetchListCollections(params) {
	const { marketplaceType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);
	let collections = allCollections(marketplaceConfig);
	if (!collections?.length) return [];
	if (marketplaceType) collections = collections.filter((collection) => collection.marketplaceType === marketplaceType);
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
	if (settled.every((result) => result.status === "rejected")) {
		const firstError = settled[0];
		throw firstError.reason;
	}
	const results = settled.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
	const collectionsWithMetadata = collections.map((collection) => {
		const metadata = results.find((result) => compareAddress(result.address, collection.itemsAddress));
		return {
			collection,
			metadata
		};
	}).filter((item) => item.metadata !== void 0).map(({ collection, metadata }) => ({
		...collection,
		...metadata
	}));
	return collectionsWithMetadata;
}
function listCollectionsQueryOptions(params) {
	const enabled = Boolean(params.marketplaceConfig && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.list, params],
		queryFn: enabled ? () => fetchListCollections({
			marketplaceConfig: params.marketplaceConfig,
			config: params.config,
			marketplaceType: params.marketplaceType
		}) : skipToken,
		...params.query,
		enabled
	});
}
const listCollectionsOptions = ({ marketplaceType, marketplaceConfig, config }) => {
	return queryOptions({
		queryKey: [...collectionKeys.list, {
			marketplaceType,
			marketplaceConfig,
			config
		}],
		queryFn: marketplaceConfig ? () => fetchListCollections({
			marketplaceConfig,
			config,
			marketplaceType
		}) : skipToken,
		enabled: Boolean(marketplaceConfig)
	});
};

//#endregion
export { collectionDetailsQueryOptions, collectionQueryOptions, fetchCollection, fetchCollectionDetails, fetchListCollectionActivities, fetchListCollections, listCollectionActivitiesQueryOptions, listCollectionsOptions, listCollectionsQueryOptions };
//# sourceMappingURL=listCollections-CeozHrO_.js.map