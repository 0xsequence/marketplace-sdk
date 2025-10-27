import { r as getMarketplaceClient, u as collectableKeys } from "./api-CMGOh-La.js";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

//#region src/react/queries/primary-sales/countOfPrimarySaleItems.ts
async function fetchCountOfPrimarySaleItems(args, config) {
	const marketplaceClient = getMarketplaceClient(config);
	const { chainId, primarySaleContractAddress, filter } = args;
	return (await marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	})).count;
}
function getCountOfPrimarySaleItemsQueryKey(args) {
	const apiArgs = {
		chainId: String(args.chainId),
		primarySaleContractAddress: args.primarySaleContractAddress,
		filter: args.filter
	};
	return [...collectableKeys.primarySaleItemsCount, apiArgs];
}
function countOfPrimarySaleItemsOptions(args, config) {
	return queryOptions({
		enabled: args.query?.enabled ?? true,
		queryKey: getCountOfPrimarySaleItemsQueryKey(args),
		queryFn: () => fetchCountOfPrimarySaleItems(args, config)
	});
}

//#endregion
//#region src/react/queries/primary-sales/primarySaleItems.ts
/**
* Fetches primary sale items from the marketplace API
*/
async function fetchPrimarySaleItems(params) {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;
	return getMarketplaceClient(config).listPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
		page
	});
}
function getListPrimarySaleItemsQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		primarySaleContractAddress: params.primarySaleContractAddress,
		filter: params.filter
	};
	return [...collectableKeys.listPrimarySaleItems, apiArgs];
}
const listPrimarySaleItemsQueryOptions = (params) => {
	const enabled = Boolean(params.primarySaleContractAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	const initialPage = params.page || {
		page: 1,
		pageSize: 30
	};
	return infiniteQueryOptions({
		queryKey: getListPrimarySaleItemsQueryKey(params),
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
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
};

//#endregion
//#region src/react/queries/primary-sales/primarySaleItemsCount.ts
/**
* Fetches the count of primary sale items from the marketplace API
*/
async function fetchPrimarySaleItemsCount(params) {
	const { chainId, primarySaleContractAddress, filter, config } = params;
	return getMarketplaceClient(config).getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	});
}
function getPrimarySaleItemsCountQueryKey(args) {
	const apiArgs = {
		chainId: String(args.chainId),
		primarySaleContractAddress: args.primarySaleContractAddress,
		filter: args.filter
	};
	return [...collectableKeys.primarySaleItemsCount, apiArgs];
}
const primarySaleItemsCountQueryOptions = (args) => {
	const enabled = Boolean(args.primarySaleContractAddress && args.chainId && args.config && (args.query?.enabled ?? true));
	return queryOptions({
		queryKey: getPrimarySaleItemsCountQueryKey(args),
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
export { getListPrimarySaleItemsQueryKey as a, fetchCountOfPrimarySaleItems as c, fetchPrimarySaleItems as i, getCountOfPrimarySaleItemsQueryKey as l, getPrimarySaleItemsCountQueryKey as n, listPrimarySaleItemsQueryOptions as o, primarySaleItemsCountQueryOptions as r, countOfPrimarySaleItemsOptions as s, fetchPrimarySaleItemsCount as t };
//# sourceMappingURL=primary-sales-azWXce7L.js.map