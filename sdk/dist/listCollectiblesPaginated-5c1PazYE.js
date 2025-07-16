import { LaosAPI, collectableKeys, getIndexerClient, getMarketplaceClient, getMetadataClient } from "./api-BiMGqWdz.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/balanceOfCollectible.ts
/**
* Fetches the balance of a specific collectible for a user
*
* @param args - Arguments for the API call
* @param config - SDK configuration
* @returns The balance data
*/
async function fetchBalanceOfCollectible(args, config) {
	if (args.isLaos721) {
		const laosApi = new LaosAPI();
		const response = await laosApi.getTokenBalances({
			chainId: args.chainId.toString(),
			contractAddress: args.collectionAddress,
			accountAddress: args.userAddress,
			includeMetadata: true
		});
		return response.balances[0] || null;
	}
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		tokenID: args.collectableId,
		includeMetadata: false,
		metadataOptions: {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		}
	}).then((res) => res.balances[0] || null);
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
		queryKey: [...collectableKeys.userBalances, args],
		queryFn: enabled ? () => fetchBalanceOfCollectible({
			...args,
			userAddress: args.userAddress
		}, config) : skipToken
	});
}

//#endregion
//#region src/react/queries/collectible.ts
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
	const result = await metadataClient.getTokenMetadata(apiArgs);
	return result.tokenMetadata[0];
}
function collectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.collectibleId && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.details, params],
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
//#region src/react/queries/countOfCollectables.ts
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
		const result$1 = await client.getCountOfFilteredCollectibles(apiArgs$1);
		return result$1.count;
	}
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId)
	};
	const result = await client.getCountOfAllCollectibles(apiArgs);
	return result.count;
}
function countOfCollectablesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.counts, params],
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
//#region src/react/queries/listCollectibleActivities.ts
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
function listCollectibleActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.collectibleActivities, params],
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
//#region src/react/queries/listCollectiblesPaginated.ts
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
function listCollectiblesPaginatedQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.side && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			...collectableKeys.lists,
			"paginated",
			params
		],
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
export { balanceOfCollectibleOptions, collectibleQueryOptions, countOfCollectablesQueryOptions, fetchBalanceOfCollectible, fetchCollectible, fetchCountOfCollectables, fetchListCollectibleActivities, fetchListCollectiblesPaginated, listCollectibleActivitiesQueryOptions, listCollectiblesPaginatedQueryOptions };
//# sourceMappingURL=listCollectiblesPaginated-5c1PazYE.js.map