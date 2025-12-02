import { collectableKeys, getMarketplaceClient } from "./api-GwTR0dBA.js";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

//#region src/react/queries/primary-sales/countOfPrimarySaleItems.ts
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
//#region src/react/queries/primary-sales/primarySaleItem.ts
/**
* Fetches a single primary sale item from the marketplace API
*/
async function fetchPrimarySaleItem(params) {
	const { chainId, primarySaleContractAddress, tokenId, config } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		primarySaleContractAddress,
		tokenId
	};
	const result = await marketplaceClient.getPrimarySaleItem(apiArgs);
	return result.item;
}
function getPrimarySaleItemQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		primarySaleContractAddress: params.primarySaleContractAddress,
		tokenId: params.tokenId
	};
	return [...collectableKeys.primarySaleItem, apiArgs];
}
function primarySaleItemQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.primarySaleContractAddress && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getPrimarySaleItemQueryKey(params),
		queryFn: () => fetchPrimarySaleItem({
			chainId: params.chainId,
			primarySaleContractAddress: params.primarySaleContractAddress,
			tokenId: params.tokenId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/primary-sales/primarySaleItems.ts
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
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getCountOfPrimarySaleItems({
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
export { countOfPrimarySaleItemsOptions, fetchCountOfPrimarySaleItems, fetchPrimarySaleItem, fetchPrimarySaleItems, fetchPrimarySaleItemsCount, getCountOfPrimarySaleItemsQueryKey, getListPrimarySaleItemsQueryKey, getPrimarySaleItemQueryKey, getPrimarySaleItemsCountQueryKey, listPrimarySaleItemsQueryOptions, primarySaleItemQueryOptions, primarySaleItemsCountQueryOptions };
//# sourceMappingURL=primary-sales-CG4p0-QG.js.map