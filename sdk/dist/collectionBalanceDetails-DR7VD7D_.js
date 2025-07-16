import { getIndexerClient } from "./api-BiMGqWdz.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/collectionBalanceDetails.ts
/**
* Fetches detailed balance information for multiple accounts from the Indexer API
*/
async function fetchCollectionBalanceDetails(params) {
	const { chainId, filter, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const promises = filter.accountAddresses.map((accountAddress) => indexerClient.getTokenBalancesDetails({ filter: {
		accountAddresses: [accountAddress],
		contractWhitelist: filter.contractWhitelist,
		omitNativeBalances: filter.omitNativeBalances
	} }));
	const responses = await Promise.all(promises);
	const mergedResponse = responses.reduce((acc, curr) => {
		if (!curr) return acc;
		return {
			page: curr.page,
			nativeBalances: [...acc.nativeBalances || [], ...curr.nativeBalances || []],
			balances: [...acc.balances || [], ...curr.balances || []]
		};
	}, {
		page: {},
		nativeBalances: [],
		balances: []
	});
	if (!mergedResponse) throw new Error("Failed to fetch collection balance details");
	return mergedResponse;
}
function collectionBalanceDetailsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.filter?.accountAddresses?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"balances",
			"collectionBalanceDetails",
			params
		],
		queryFn: () => fetchCollectionBalanceDetails({
			chainId: params.chainId,
			filter: params.filter,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { collectionBalanceDetailsQueryOptions, fetchCollectionBalanceDetails };
//# sourceMappingURL=collectionBalanceDetails-DR7VD7D_.js.map