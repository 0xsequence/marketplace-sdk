import { h as serializeBigInts, i as getMetadataClient, n as getIndexerClient } from "./api.js";
import { n as buildInfiniteQueryOptions, r as buildQueryOptions } from "./_internal.js";
import { isAddress } from "viem";
import { infiniteQueryOptions } from "@tanstack/react-query";

//#region src/react/queries/token/queryKeys.ts
/**
* Creates a type-safe query key for token domain with automatic bigint serialization
*
* @param operation - The specific operation (e.g., 'balances', 'metadata', 'ranges')
* @param params - The query parameters (will be automatically serialized)
* @returns A serialized query key safe for React Query
*/
function createTokenQueryKey(operation, params) {
	return [
		"token",
		operation,
		serializeBigInts(params)
	];
}

//#endregion
//#region src/react/queries/token/balances.ts
async function fetchBalances(params, page) {
	const { chainId, accountAddress, contractAddress, tokenId, includeMetadata, metadataOptions, config } = params;
	return getIndexerClient(chainId, config).getTokenBalances({
		accountAddress,
		contractAddress,
		tokenId,
		includeMetadata,
		metadataOptions,
		page: {
			page: page.page,
			pageSize: page.pageSize,
			more: page.more ?? false
		}
	});
}
function getListBalancesQueryKey(params) {
	return createTokenQueryKey("balances", {
		chainId: params.chainId,
		accountAddress: params.accountAddress,
		contractAddress: params.contractAddress,
		tokenId: params.tokenId,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions,
		includeCollectionTokens: params.includeCollectionTokens
	});
}
/**
* Creates a tanstack infinite query options object for the balances query
*
* @param params - The query parameters including config
* @returns Query options configuration
*/
function listBalancesOptions(params) {
	return buildInfiniteQueryOptions({
		getQueryKey: getListBalancesQueryKey,
		requiredParams: [
			"chainId",
			"accountAddress",
			"config"
		],
		fetcher: fetchBalances,
		getPageInfo: (response) => {
			if (!response.page) return void 0;
			return {
				page: response.page.page ?? 1,
				pageSize: response.page.pageSize ?? 30,
				more: response.page.more ?? false
			};
		},
		customValidation: (p) => !!p.chainId && p.chainId > 0 && !!p.accountAddress
	}, params);
}

//#endregion
//#region src/react/queries/token/metadata.ts
/**
* Fetches token metadata from the metadata API
*/
async function fetchListTokenMetadata(params) {
	const { config, contractAddress, chainId, tokenIds } = params;
	const metadataClient = getMetadataClient(config);
	const apiArgs = {
		chainId,
		tokenIds,
		contractAddress
	};
	return (await metadataClient.getTokenMetadata(apiArgs)).tokenMetadata;
}
function getListTokenMetadataQueryKey(params) {
	return createTokenQueryKey("metadata", {
		chainId: params.chainId,
		contractAddress: params.contractAddress,
		tokenIds: params.tokenIds
	});
}
function listTokenMetadataQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getListTokenMetadataQueryKey,
		requiredParams: [
			"chainId",
			"contractAddress",
			"tokenIds",
			"config"
		],
		fetcher: fetchListTokenMetadata,
		customValidation: (p) => !!p.chainId && p.chainId > 0 && !!p.tokenIds && p.tokenIds.length > 0 && !!p.contractAddress
	}, params);
}

//#endregion
//#region src/react/queries/token/metadata-search.ts
/**
* Fetches token metadata from the metadata API using search filters
*/
async function fetchSearchTokenMetadata(params) {
	const { chainId, collectionAddress, filter, page, config } = params;
	const response = await getMetadataClient(config).searchTokenMetadata({
		chainId,
		collectionAddress,
		filter: filter ?? {},
		page
	});
	return {
		tokenMetadata: response.tokenMetadata,
		page: response.page
	};
}
function getSearchTokenMetadataQueryKey(params) {
	return createTokenQueryKey("metadata-search", {
		chainId: params.chainId ?? 0,
		collectionAddress: params.collectionAddress ?? "",
		filter: params.filter
	});
}
function searchTokenMetadataQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	const initialPageParam = {
		page: 1,
		pageSize: 30
	};
	const queryFn = ({ pageParam = initialPageParam }) => {
		const requiredParams = params;
		return fetchSearchTokenMetadata({
			chainId: requiredParams.chainId,
			collectionAddress: requiredParams.collectionAddress,
			filter: params.filter,
			config: requiredParams.config,
			page: pageParam
		});
	};
	return infiniteQueryOptions({
		queryKey: getSearchTokenMetadataQueryKey(params),
		queryFn,
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
	const { chainId, config, ...apiParams } = params;
	return await getIndexerClient(chainId, config).getTokenSupplies(apiParams);
}
function getTokenSuppliesQueryKey(params) {
	return createTokenQueryKey("supplies", {
		chainId: params.chainId ?? 0,
		collectionAddress: params.collectionAddress ?? "",
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions
	});
}
function tokenSuppliesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	const initialPageParam = {
		page: 1,
		pageSize: 30,
		more: false
	};
	const queryFn = async ({ pageParam = initialPageParam }) => {
		const requiredParams = params;
		return fetchTokenSupplies({
			chainId: requiredParams.chainId,
			collectionAddress: requiredParams.collectionAddress,
			config: requiredParams.config,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: pageParam
		});
	};
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
	const response = await getIndexerClient(chainId, config).getTokenIDRanges({ collectionAddress });
	if (!response) throw new Error("Failed to fetch token ranges");
	return response;
}
function getTokenRangesQueryKey(params) {
	return createTokenQueryKey("ranges", {
		chainId: params.chainId,
		collectionAddress: params.collectionAddress
	});
}
function getTokenRangesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getTokenRangesQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchGetTokenRanges,
		customValidation: (p) => !!p.chainId && p.chainId > 0 && !!p.collectionAddress && isAddress(p.collectionAddress)
	}, params);
}

//#endregion
export { getTokenSuppliesQueryKey as a, getSearchTokenMetadataQueryKey as c, getListTokenMetadataQueryKey as d, listTokenMetadataQueryOptions as f, listBalancesOptions as h, fetchTokenSupplies as i, searchTokenMetadataQueryOptions as l, getListBalancesQueryKey as m, getTokenRangesQueryKey as n, tokenSuppliesQueryOptions as o, fetchBalances as p, getTokenRangesQueryOptions as r, fetchSearchTokenMetadata as s, fetchGetTokenRanges as t, fetchListTokenMetadata as u };
//# sourceMappingURL=token2.js.map