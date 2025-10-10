import { LaosAPI, balanceQueries, getIndexerClient } from "./api-BoO0V5aJ.js";
import { infiniteQueryOptions } from "@tanstack/react-query";

//#region src/react/queries/tokens/listBalances.ts
async function fetchBalances(args, config, page) {
	if (args.isLaos721 && args.accountAddress) return new LaosAPI().getTokenBalances({
		chainId: args.chainId.toString(),
		accountAddress: args.accountAddress,
		contractAddress: args.contractAddress,
		includeMetadata: args.includeMetadata,
		page: { sort: [{
			column: "CREATED_AT",
			order: "DESC"
		}] }
	});
	return getIndexerClient(args.chainId, config).getTokenBalances({
		...args,
		tokenID: args.tokenId,
		page
	});
}
function getListBalancesQueryKey(args) {
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.accountAddress,
		contractAddress: args.contractAddress,
		tokenID: args.tokenId,
		includeMetadata: args.includeMetadata,
		metadataOptions: args.metadataOptions,
		includeCollectionTokens: args.includeCollectionTokens,
		isLaos721: args.isLaos721
	};
	return [...balanceQueries.lists, apiArgs];
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
export { fetchBalances, getListBalancesQueryKey, listBalancesOptions };
//# sourceMappingURL=listBalances-BxpxBCvn.js.map