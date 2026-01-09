import { h as serializeBigInts, n as getIndexerClient } from "./api.js";
import { r as buildQueryOptions } from "./_internal.js";
import { ContractVerificationStatus } from "@0xsequence/indexer";
import { isAddress } from "viem";

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
	return getIndexerClient(chainId, config).getTokenBalancesByContract({
		filter: {
			accountAddresses: [userAddress],
			contractAddresses: [collectionAddress],
			contractStatus: ContractVerificationStatus.VERIFIED
		},
		omitMetadata: !includeMetadata
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
		fetcher: fetchTokenBalances,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress) && !!p.userAddress && isAddress(p.userAddress)
	}, params);
}

//#endregion
export { createCollectibleQueryKey as i, getTokenBalancesQueryKey as n, tokenBalancesOptions as r, fetchTokenBalances as t };
//# sourceMappingURL=token-balances.js.map