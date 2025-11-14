import { i as getMetadataClient, n as getIndexerClient } from "./api-D2fhCs18.js";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

//#region src/react/queries/token/balances.ts
async function fetchBalances(args, config, page) {
	return getIndexerClient(args.chainId, config).getTokenBalances({
		...args,
		tokenID: args.tokenId,
		page
	});
}
function getListBalancesQueryKey(args) {
	return [
		"token",
		"balances",
		{
			chainId: args.chainId,
			accountAddress: args.accountAddress,
			contractAddress: args.contractAddress,
			tokenID: args.tokenId,
			includeMetadata: args.includeMetadata,
			metadataOptions: args.metadataOptions,
			includeCollectionTokens: args.includeCollectionTokens
		}
	];
}
/**
* Creates a tanstack infinite query options object for the balances query
*
* @param args - The query arguments
* @param config - SDK configuration
* @returns Query options configuration
*/
function listBalancesOptions(args, config) {
	return infiniteQueryOptions({
		...args.query,
		queryKey: getListBalancesQueryKey(args),
		queryFn: ({ pageParam }) => fetchBalances(args, config, pageParam),
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page.after
	});
}

//#endregion
//#region src/react/queries/token/metadata.ts
/**
* Fetches token metadata from the metadata API
*/
async function fetchListTokenMetadata(params) {
	const { chainId, contractAddress, tokenIds, config } = params;
	return (await getMetadataClient(config).getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress,
		tokenIDs: tokenIds
	})).tokenMetadata;
}
function getListTokenMetadataQueryKey(params) {
	return [
		"token",
		"metadata",
		{
			chainID: String(params.chainId),
			contractAddress: params.contractAddress,
			tokenIDs: params.tokenIds
		}
	];
}
function listTokenMetadataQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.contractAddress && params.tokenIds?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getListTokenMetadataQueryKey(params),
		queryFn: () => fetchListTokenMetadata({
			chainId: params.chainId,
			contractAddress: params.contractAddress,
			tokenIds: params.tokenIds,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/token/metadata-search.ts
/**
* Fetches token metadata from the metadata API using search filters
*/
async function fetchSearchTokenMetadata(params) {
	const { chainId, collectionAddress, filter, page, config } = params;
	const response = await getMetadataClient(config).searchTokenMetadata({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		filter: filter ?? {},
		page
	});
	return {
		tokenMetadata: response.tokenMetadata,
		page: response.page
	};
}
function getSearchTokenMetadataQueryKey(params) {
	return [
		"token",
		"metadata",
		"search",
		{
			chainID: String(params.chainId),
			contractAddress: params.collectionAddress,
			filter: params.filter
		}
	];
}
function searchTokenMetadataQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	const initialPageParam = {
		page: 1,
		pageSize: 30
	};
	return infiniteQueryOptions({
		queryKey: getSearchTokenMetadataQueryKey(params),
		queryFn: ({ pageParam = initialPageParam }) => fetchSearchTokenMetadata({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			filter: params.filter,
			config: params.config,
			page: pageParam
		}),
		initialPageParam,
		getNextPageParam: (lastPage) => {
			if (!lastPage.page?.more) return void 0;
			return {
				page: (lastPage.page.page || 1) + 1,
				pageSize: lastPage.page.pageSize || 20
			};
		},
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/token/supplies.ts
/**
* Fetches token supplies with support for indexer API
*/
async function fetchTokenSupplies(params) {
	const { chainId, collectionAddress, config,...rest } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const apiArgs = {
		contractAddress: collectionAddress,
		...rest
	};
	return await indexerClient.getTokenSupplies(apiArgs);
}
function getTokenSuppliesQueryKey(params) {
	return [
		"token",
		"supplies",
		{
			chainId: params.chainId,
			contractAddress: params.collectionAddress,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions
		}
	];
}
function tokenSuppliesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	const initialPageParam = {
		page: 1,
		pageSize: 30
	};
	const queryFn = async ({ pageParam = initialPageParam }) => fetchTokenSupplies({
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		config: params.config,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions,
		page: pageParam
	});
	return infiniteQueryOptions({
		queryKey: getTokenSuppliesQueryKey(params),
		queryFn,
		initialPageParam,
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/token/ranges.ts
/**
* Fetches token ID ranges for a collection from the Indexer API
*/
async function fetchGetTokenRanges(params) {
	const { chainId, collectionAddress, config } = params;
	const response = await getIndexerClient(chainId, config).getTokenIDRanges({ contractAddress: collectionAddress });
	if (!response) throw new Error("Failed to fetch token ranges");
	return response;
}
function getTokenRangesQueryKey(params) {
	return [
		"token",
		"ranges",
		{
			chainId: params.chainId,
			contractAddress: params.collectionAddress
		}
	];
}
function getTokenRangesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getTokenRangesQueryKey(params),
		queryFn: () => fetchGetTokenRanges({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { getTokenSuppliesQueryKey as a, getSearchTokenMetadataQueryKey as c, getListTokenMetadataQueryKey as d, listTokenMetadataQueryOptions as f, listBalancesOptions as h, fetchTokenSupplies as i, searchTokenMetadataQueryOptions as l, getListBalancesQueryKey as m, getTokenRangesQueryKey as n, tokenSuppliesQueryOptions as o, fetchBalances as p, getTokenRangesQueryOptions as r, fetchSearchTokenMetadata as s, fetchGetTokenRanges as t, fetchListTokenMetadata as u };
//# sourceMappingURL=token-Ce_HUTYn.js.map