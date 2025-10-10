import { LaosAPI, collectableKeys, getIndexerClient } from "./api-BoO0V5aJ.js";
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
	if (args.isLaos721) return (await new LaosAPI().getTokenBalances({
		chainId: args.chainId.toString(),
		contractAddress: args.collectionAddress,
		accountAddress: args.userAddress,
		includeMetadata: true
	})).balances || [];
	return getIndexerClient(args.chainId, config).getTokenBalances({
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
		} : void 0,
		isLaos721: args.isLaos721
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
export { fetchTokenBalances, getTokenBalancesQueryKey, tokenBalancesOptions };
//# sourceMappingURL=tokenBalances-ibDerNmM.js.map