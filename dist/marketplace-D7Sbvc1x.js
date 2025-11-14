import { t as FilterCondition } from "./builder.gen-D7rQ1F-y.js";
import { i as getMetadataClient, l as getQueryClient } from "./api-D2fhCs18.js";
import { w as compareAddress } from "./utils-Dr-4WqI6.js";
import { n as marketplaceConfigOptions } from "./config-Bcwj-muV.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/marketplace/filters.ts
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
export { filtersQueryOptions as n, getFiltersQueryKey as r, fetchFilters as t };
//# sourceMappingURL=marketplace-D7Sbvc1x.js.map