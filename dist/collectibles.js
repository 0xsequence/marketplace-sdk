import { i as getMetadataClient, n as getIndexerClient, r as getMarketplaceClient, u as collectableKeys } from "./api.js";
import { l as compareAddress } from "./utils.js";
import { t as fetchMarketplaceConfig } from "./marketplaceConfig.js";
import { infiniteQueryOptions, queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collectibles/balanceOfCollectible.ts
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
function getBalanceOfCollectibleQueryKey(args) {
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		tokenID: args.collectableId,
		includeMetadata: args.includeMetadata,
		metadataOptions: args.userAddress ? {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		} : void 0
	};
	return [...collectableKeys.userBalances, apiArgs];
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
//#region src/react/queries/collectibles/collectible.ts
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
function getCollectibleQueryKey(params) {
	const apiArgs = {
		chainID: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenIDs: [params.collectibleId]
	};
	return [...collectableKeys.details, apiArgs];
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
//#region src/react/queries/collectibles/countOfCollectables.ts
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
function getCountOfCollectablesQueryKey(params) {
	if (params.filter && params.side) {
		const apiArgs$1 = {
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			filter: params.filter,
			side: params.side
		};
		return [...collectableKeys.counts, apiArgs$1];
	}
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress
	};
	return [...collectableKeys.counts, apiArgs];
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
//#region src/react/queries/collectibles/listCollectibleActivities.ts
/**
* Fetches collectible activities from the Marketplace API
*/
async function fetchListCollectibleActivities(params) {
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
	return await marketplaceClient.listCollectibleActivities(apiArgs);
}
function getListCollectibleActivitiesQueryKey(params) {
	const page = params.page || params.pageSize || params.sort ? {
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 10,
		sort: params.sort
	} : void 0;
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		page
	};
	return [...collectableKeys.collectibleActivities, apiArgs];
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
//#region src/react/queries/collectibles/listCollectibles.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectibles(params, page) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
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
function getListCollectiblesQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter
	};
	return [...collectableKeys.lists, apiArgs];
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
//#region src/react/queries/collectibles/listCollectiblesPaginated.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectiblesPaginated(params) {
	const { collectionAddress, chainId, config, page = 1, pageSize = 30, ...additionalApiParams } = params;
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
function getListCollectiblesPaginatedQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter,
		page: params.page ? {
			page: params.page,
			pageSize: params.pageSize ?? 30
		} : void 0
	};
	return [
		...collectableKeys.lists,
		"paginated",
		apiArgs
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
export { fetchBalanceOfCollectible as _, getListCollectiblesQueryKey as a, getListCollectibleActivitiesQueryKey as c, fetchCountOfCollectables as d, getCountOfCollectablesQueryKey as f, balanceOfCollectibleOptions as g, getCollectibleQueryKey as h, fetchListCollectibles as i, listCollectibleActivitiesQueryOptions as l, fetchCollectible as m, getListCollectiblesPaginatedQueryKey as n, listCollectiblesQueryOptions as o, collectibleQueryOptions as p, listCollectiblesPaginatedQueryOptions as r, fetchListCollectibleActivities as s, fetchListCollectiblesPaginated as t, countOfCollectablesQueryOptions as u, getBalanceOfCollectibleQueryKey as v };
//# sourceMappingURL=collectibles.js.map