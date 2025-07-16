import { LaosAPI, getIndexerClient, getMetadataClient, tokenKeys } from "./api-BiMGqWdz.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/getTokenRanges.ts
/**
* Fetches token ID ranges for a collection from the Indexer API
*/
async function fetchGetTokenRanges(params) {
	const { chainId, collectionAddress, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const response = await indexerClient.getTokenIDRanges({ contractAddress: collectionAddress });
	if (!response) throw new Error("Failed to fetch token ranges");
	return response;
}
function getTokenRangesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"indexer",
			"tokenRanges",
			params
		],
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
//#region src/react/queries/listTokenMetadata.ts
/**
* Fetches token metadata from the metadata API
*/
async function fetchListTokenMetadata(params) {
	const { chainId, contractAddress, tokenIds, config } = params;
	const metadataClient = getMetadataClient(config);
	const response = await metadataClient.getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress,
		tokenIDs: tokenIds
	});
	return response.tokenMetadata;
}
function listTokenMetadataQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.contractAddress && params.tokenIds?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...tokenKeys.metadata, params],
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
//#region src/react/queries/tokenSupplies.ts
/**
* Fetches token supplies with support for both indexer and LAOS APIs
* Uses the more efficient single-contract APIs from both services
*/
async function fetchTokenSupplies(params) {
	const { chainId, collectionAddress, config, isLaos721,...rest } = params;
	if (isLaos721) {
		const laosApi = new LaosAPI();
		const laosPage = rest.page ? { sort: rest.page.sort?.map((sortBy) => ({
			column: sortBy.column,
			order: sortBy.order
		})) || [] } : void 0;
		const result$1 = await laosApi.getTokenSupplies({
			chainId: chainId.toString(),
			contractAddress: collectionAddress,
			includeMetadata: rest.includeMetadata,
			page: laosPage
		});
		return result$1;
	}
	const indexerClient = getIndexerClient(chainId, config);
	const apiArgs = {
		contractAddress: collectionAddress,
		...rest
	};
	const result = await indexerClient.getTokenSupplies(apiArgs);
	return result;
}
function tokenSuppliesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...tokenKeys.supplies, params],
		queryFn: () => fetchTokenSupplies({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			isLaos721: params.isLaos721,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: params.page
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { fetchGetTokenRanges, fetchListTokenMetadata, fetchTokenSupplies, getTokenRangesQueryOptions, listTokenMetadataQueryOptions, tokenSuppliesQueryOptions };
//# sourceMappingURL=tokenSupplies-DTWhbfIg.js.map