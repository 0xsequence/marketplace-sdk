import { getMarketplaceClient } from "./api-BiMGqWdz.js";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

//#region src/react/queries/countOfPrimarySaleItems.ts
async function fetchCountOfPrimarySaleItems(args, config) {
	const marketplaceClient = getMarketplaceClient(config);
	const { chainId, primarySaleContractAddress, filter } = args;
	const data = await marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	});
	return data.count;
}
function countOfPrimarySaleItemsOptions(args, config) {
	return queryOptions({
		enabled: args.query?.enabled ?? true,
		queryKey: ["countOfPrimarySaleItems", args],
		queryFn: () => fetchCountOfPrimarySaleItems(args, config)
	});
}

//#endregion
//#region src/react/queries/primarySaleItems.ts
/**
* Fetches primary sale items from the marketplace API
*/
async function fetchPrimarySaleItems(params) {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
		page
	});
}
const listPrimarySaleItemsQueryOptions = (params) => {
	const enabled = Boolean(params.primarySaleContractAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	const initialPage = {
		page: 1,
		pageSize: 30
	};
	return infiniteQueryOptions({
		queryKey: ["listPrimarySaleItems", params],
		queryFn: async ({ pageParam }) => {
			return fetchPrimarySaleItems({
				chainId: params.chainId,
				primarySaleContractAddress: params.primarySaleContractAddress,
				filter: params.filter,
				page: pageParam,
				config: params.config
			});
		},
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) => lastPage.page?.more ? {
			page: (lastPage.page?.page || 1) + 1,
			pageSize: lastPage.page?.pageSize || 30
		} : void 0,
		...params.query,
		enabled
	});
};

//#endregion
//#region src/react/queries/primarySaleItemsCount.ts
/**
* Fetches the count of primary sale items from the marketplace API
*/
async function fetchPrimarySaleItemsCount(params) {
	const { chainId, primarySaleContractAddress, filter, config } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	});
}
const primarySaleItemsCountQueryOptions = (args) => {
	const enabled = Boolean(args.primarySaleContractAddress && args.chainId && args.config && (args.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["primarySaleItemsCount", args],
		queryFn: () => fetchPrimarySaleItemsCount({
			chainId: args.chainId,
			primarySaleContractAddress: args.primarySaleContractAddress,
			filter: args.filter,
			config: args.config
		}),
		...args.query,
		enabled
	});
};

//#endregion
export { countOfPrimarySaleItemsOptions, fetchCountOfPrimarySaleItems, fetchPrimarySaleItems, fetchPrimarySaleItemsCount, listPrimarySaleItemsQueryOptions, primarySaleItemsCountQueryOptions };
//# sourceMappingURL=queries-BJK6b9SM.js.map