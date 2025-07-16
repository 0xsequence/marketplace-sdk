import { LaosAPI, balanceQueries, getIndexerClient } from "./api-BiMGqWdz.js";
import { infiniteQueryOptions } from "@tanstack/react-query";

//#region src/react/queries/listBalances.ts
async function fetchBalances(args, config, page) {
	if (args.isLaos721 && args.accountAddress) {
		const laosClient = new LaosAPI();
		return laosClient.getTokenBalances({
			chainId: args.chainId.toString(),
			accountAddress: args.accountAddress,
			contractAddress: args.contractAddress,
			includeMetadata: args.includeMetadata,
			page: { sort: [{
				column: "CREATED_AT",
				order: "DESC"
			}] }
		});
	}
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		...args,
		tokenID: args.tokenId,
		page
	});
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
		queryKey: [
			...balanceQueries.lists,
			args,
			config
		],
		queryFn: ({ pageParam }) => fetchBalances(args, config, pageParam),
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page.after
	});
}

//#endregion
export { fetchBalances, listBalancesOptions };
//# sourceMappingURL=listBalances-DuufjTG6.js.map