import { collectableKeys, getIndexerClient } from "./api-GwTR0dBA.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collectibles/tokenBalances.ts
/**
* Fetches the token balances for a user
*
* @param args - Arguments for the API call
* @param config - SDK configuration
* @returns The balance data
*/
async function fetchTokenBalances(args, config) {
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		includeMetadata: args.includeMetadata ?? false,
		metadataOptions: {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		}
	}).then((res) => res.balances || []);
}
function getTokenBalancesQueryKey(args) {
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		includeMetadata: args.includeMetadata,
		metadataOptions: args.userAddress ? {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		} : void 0
	};
	return [...collectableKeys.userBalances, apiArgs];
}
/**
* Creates a tanstack query options object for the token balances query
*
* @param args - The query arguments
* @param config - SDK configuration
* @returns Query options configuration
*/
function tokenBalancesOptions(args, config) {
	const enabled = !!args.userAddress && !!args.collectionAddress && (args.query?.enabled ?? true);
	return queryOptions({
		queryKey: getTokenBalancesQueryKey(args),
		queryFn: enabled ? () => fetchTokenBalances({
			...args,
			userAddress: args.userAddress
		}, config) : skipToken
	});
}

//#endregion
export { fetchTokenBalances as fetchTokenBalances$1, getTokenBalancesQueryKey as getTokenBalancesQueryKey$1, tokenBalancesOptions as tokenBalancesOptions$1 };
//# sourceMappingURL=tokenBalances-CouzNX4j.js.map