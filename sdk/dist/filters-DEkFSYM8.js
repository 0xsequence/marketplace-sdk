import { FilterCondition } from "./builder.gen-B9wR2nvF.js";
import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { getMetadataClient } from "./api-BiMGqWdz.js";
import { compareAddress } from "./utils-D4D4JVMo.js";
import { marketplaceConfigOptions } from "./marketplaceConfig-GQTTmihy.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/filters.ts
/**
* Fetches collection filters from the Metadata API with optional marketplace filtering
*/
async function fetchFilters(params) {
	const { chainId, collectionAddress, showAllFilters, excludePropertyValues, config } = params;
	const metadataClient = getMetadataClient(config);
	const filters = await metadataClient.getTokenMetadataPropertyFilters({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		excludeProperties: [],
		excludePropertyValues
	}).then((resp) => resp.filters);
	if (showAllFilters) return filters;
	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(marketplaceConfigOptions(config));
	const collectionFilters = marketplaceConfig.market.collections.find((c) => compareAddress(c.itemsAddress, collectionAddress))?.filterSettings;
	if (!collectionFilters?.exclusions || collectionFilters.exclusions.length === 0 || !collectionFilters.filterOrder || collectionFilters.filterOrder.length === 0) return filters;
	const { filterOrder, exclusions } = collectionFilters;
	const sortedFilters = filters.toSorted((a, b) => {
		const aIndex = filterOrder.indexOf(a.name) > -1 ? filterOrder.indexOf(a.name) : filterOrder.length;
		const bIndex = filterOrder.indexOf(b.name) > -1 ? filterOrder.indexOf(b.name) : filterOrder.length;
		return aIndex - bIndex;
	});
	const filteredResults = sortedFilters.reduce((acc, filter) => {
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
	return filteredResults;
}
function filtersQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["filters", params],
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
export { fetchFilters, filtersQueryOptions };
//# sourceMappingURL=filters-DEkFSYM8.js.map