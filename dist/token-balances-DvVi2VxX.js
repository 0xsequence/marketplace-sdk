import { n as getIndexerClient } from "./api-D2fhCs18.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/collectible/token-balances.ts
/**
* Fetches the token balances for a user
*
* @param args - Arguments for the API call
* @param config - SDK configuration
* @returns The balance data
*/
async function fetchTokenBalances(args, config) {
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
	return [
		"collectible",
		"token-balances",
		{
			chainId: args.chainId,
			accountAddress: args.userAddress,
			contractAddress: args.collectionAddress,
			includeMetadata: args.includeMetadata,
			metadataOptions: args.userAddress ? {
				verifiedOnly: true,
				includeContracts: [args.collectionAddress]
			} : void 0
		}
	];
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
export { getTokenBalancesQueryKey as n, tokenBalancesOptions as r, fetchTokenBalances as t };
//# sourceMappingURL=token-balances-DvVi2VxX.js.map