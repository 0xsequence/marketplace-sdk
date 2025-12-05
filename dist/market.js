import { t as FilterCondition } from "./builder.gen.js";
import { _ as getQueryClient, i as getMetadataClient, l as checkoutKeys, p as currencyKeys, r as getMarketplaceClient } from "./api.js";
import { l as compareAddress } from "./utils.js";
import { n as marketplaceConfigOptions } from "./marketplaceConfig.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/market/currency.ts
/**
* Fetches currency details from the marketplace API
*/
async function fetchCurrency(params) {
	const { chainId, currencyAddress, config } = params;
	let currencies = getQueryClient().getQueryData([...currencyKeys.lists, chainId]);
	if (!currencies) currencies = await getMarketplaceClient(config).listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies);
	if (!currencies?.length) throw new Error("No currencies returned");
	const currency = currencies.find((currency$1) => currency$1.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currency) throw new Error("Currency not found");
	return currency;
}
function getCurrencyQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		currencyAddress: params.currencyAddress
	};
	return [...currencyKeys.details, apiArgs];
}
function currencyQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCurrencyQueryKey(params),
		queryFn: params.chainId && params.currencyAddress ? () => fetchCurrency({
			chainId: params.chainId,
			currencyAddress: params.currencyAddress,
			config: params.config
		}) : skipToken,
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/market/checkoutOptions.ts
/**
* Fetches checkout options from the Marketplace API
*/
async function fetchCheckoutOptions(params) {
	const { chainId, walletAddress, orders, config, additionalFee } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		orders: orders.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace
		})),
		additionalFee: additionalFee ?? 0
	};
	return await client.checkoutOptionsMarketplace(apiArgs);
}
function getCheckoutOptionsQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		wallet: params.walletAddress,
		orders: params.orders?.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace
		})),
		additionalFee: params.additionalFee
	};
	return [...checkoutKeys.options, apiArgs];
}
function checkoutOptionsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.orders?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCheckoutOptionsQueryKey(params),
		queryFn: () => fetchCheckoutOptions({
			chainId: params.chainId,
			walletAddress: params.walletAddress,
			orders: params.orders,
			config: params.config,
			additionalFee: params.additionalFee ?? 0
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/market/checkoutOptionsSalesContract.ts
/**
* Fetches checkout options for sales contract from the Marketplace API
*/
async function fetchCheckoutOptionsSalesContract(params) {
	const { chainId, walletAddress, contractAddress, collectionAddress, items, config } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		contractAddress,
		collectionAddress,
		items
	};
	return await client.checkoutOptionsSalesContract(apiArgs);
}
function getCheckoutOptionsSalesContractQueryKey(params) {
	const apiArgs = {
		chainId: String(params.chainId),
		wallet: params.walletAddress,
		contractAddress: params.contractAddress,
		collectionAddress: params.collectionAddress,
		items: params.items
	};
	return [
		...checkoutKeys.options,
		"salesContract",
		apiArgs
	];
}
function checkoutOptionsSalesContractQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.contractAddress && params.collectionAddress && params.items?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getCheckoutOptionsSalesContractQueryKey(params),
		queryFn: () => fetchCheckoutOptionsSalesContract({
			chainId: params.chainId,
			walletAddress: params.walletAddress,
			contractAddress: params.contractAddress,
			collectionAddress: params.collectionAddress,
			items: params.items,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/market/filters.ts
/**
* Fetches collection filters from the Metadata API with optional marketplace filtering
*/
async function fetchFilters(params) {
	const { chainId, collectionAddress, showAllFilters, excludePropertyValues, config } = params;
	const filters = await getMetadataClient(config).getTokenMetadataPropertyFilters({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		excludeProperties: [],
		excludePropertyValues
	}).then((resp) => resp.filters);
	if (showAllFilters) return filters;
	const collectionFilters = (await getQueryClient().fetchQuery(marketplaceConfigOptions(config))).market.collections.find((c) => compareAddress(c.itemsAddress, collectionAddress))?.filterSettings;
	const filterOrder = collectionFilters?.filterOrder;
	const exclusions = collectionFilters?.exclusions;
	let sortedFilters = filters;
	if (filterOrder) sortedFilters = filters.toSorted((a, b) => {
		return (filterOrder.indexOf(a.name) > -1 ? filterOrder.indexOf(a.name) : filterOrder.length) - (filterOrder.indexOf(b.name) > -1 ? filterOrder.indexOf(b.name) : filterOrder.length);
	});
	if (exclusions) sortedFilters = sortedFilters.reduce((acc, filter) => {
		const exclusionRule = exclusions.find((rule) => rule.key === filter.name);
		if (!exclusionRule) {
			acc.push(filter);
			return acc;
		}
		if (exclusionRule.condition === FilterCondition.ENTIRE_KEY) return acc;
		if (exclusionRule.condition === FilterCondition.SPECIFIC_VALUE && exclusionRule.value) {
			const filteredValues = filter.values?.filter((value) => value !== exclusionRule.value) || [];
			if (filteredValues.length > 0) acc.push({
				...filter,
				values: filteredValues
			});
		}
		return acc;
	}, []);
	return sortedFilters;
}
function getFiltersQueryKey(params) {
	return [
		"filters",
		{
			chainID: String(params.chainId),
			contractAddress: params.collectionAddress,
			excludeProperties: void 0,
			excludePropertyValues: params.excludePropertyValues
		},
		{ showAllFilters: params.showAllFilters }
	];
}
function filtersQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getFiltersQueryKey(params),
		queryFn: () => fetchFilters({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			showAllFilters: params.showAllFilters,
			excludePropertyValues: params.excludePropertyValues,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { fetchCheckoutOptionsSalesContract as a, fetchCheckoutOptions as c, fetchCurrency as d, getCurrencyQueryKey as f, checkoutOptionsSalesContractQueryOptions as i, getCheckoutOptionsQueryKey as l, filtersQueryOptions as n, getCheckoutOptionsSalesContractQueryKey as o, getFiltersQueryKey as r, checkoutOptionsQueryOptions as s, fetchFilters as t, currencyQueryOptions as u };
//# sourceMappingURL=market.js.map