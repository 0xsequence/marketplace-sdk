import { C as FilterCondition } from "./dist.js";
import { c as findMarketCollection } from "./utils.js";
import { g as getQueryClient, i as getMetadataClient } from "./api.js";
import { r as buildQueryOptions } from "./_internal.js";
import { n as marketplaceConfigOptions, r as createMarketplaceQueryKey } from "./config.js";
import { isAddress } from "viem";

//#region src/react/queries/marketplace/filters.ts
/**
* Fetches collection filters from the Metadata API with optional marketplace filtering
*/
async function fetchFilters(params) {
	const { chainId, collectionAddress, showAllFilters, excludePropertyValues, config } = params;
	const filters = (await getMetadataClient(config).getTokenMetadataPropertyFilters({
		chainId,
		collectionAddress,
		excludeProperties: [],
		excludePropertyValues
	})).filters;
	if (showAllFilters) return filters;
	const collectionFilters = findMarketCollection((await getQueryClient().fetchQuery(marketplaceConfigOptions(config))).market.collections, collectionAddress, chainId)?.filterSettings;
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
	return createMarketplaceQueryKey("filters", {
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		excludeProperties: void 0,
		excludePropertyValues: params.excludePropertyValues,
		showAllFilters: params.showAllFilters
	});
}
function filtersQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getFiltersQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchFilters,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
	}, params);
}

//#endregion
export { filtersQueryOptions as n, getFiltersQueryKey as r, fetchFilters as t };
//# sourceMappingURL=marketplace2.js.map