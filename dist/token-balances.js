import { n as getIndexerClient } from "./api.js";
import { i as serializeBigInts } from "./utils2.js";
import { y as buildQueryOptions } from "./_internal.js";

//#region src/react/queries/collectible/queryKeys.ts
/**
* Creates a type-safe query key for collectible domain with automatic bigint serialization
*
* @param operation - The specific operation (e.g., 'balance', 'metadata')
* @param params - The query parameters (will be automatically serialized)
* @returns A serialized query key safe for React Query
*/
function createCollectibleQueryKey(operation, params) {
	return [
		"collectible",
		operation,
		serializeBigInts(params)
	];
}

//#endregion
//#region src/react/queries/collectible/token-balances.ts
/**
* Fetches the token balances for a user
*
* @param params - Parameters for the API call
* @returns The balance data
*/
async function fetchTokenBalances(params) {
	const { chainId, userAddress, collectionAddress, includeMetadata, config } = params;
	return getIndexerClient(chainId, config).getTokenBalances({
		accountAddress: userAddress,
		contractAddress: collectionAddress,
		includeMetadata: includeMetadata ?? false,
		metadataOptions: { verifiedOnly: true }
	}).then((res) => res.balances || []);
}
function getTokenBalancesQueryKey(params) {
	return createCollectibleQueryKey("token-balances", {
		chainId: params.chainId,
		accountAddress: params.userAddress,
		contractAddress: params.collectionAddress,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.userAddress ? { verifiedOnly: true } : void 0
	});
}
/**
* Creates a tanstack query options object for the token balances query
*
* @param params - The query parameters
* @returns Query options configuration
*/
function tokenBalancesOptions(params) {
	return buildQueryOptions({
		getQueryKey: getTokenBalancesQueryKey,
		requiredParams: [
			"userAddress",
			"collectionAddress",
			"chainId",
			"config"
		],
		fetcher: fetchTokenBalances
	}, params);
}

//#endregion
export { createCollectibleQueryKey as i, getTokenBalancesQueryKey as n, tokenBalancesOptions as r, fetchTokenBalances as t };
//# sourceMappingURL=token-balances.js.map