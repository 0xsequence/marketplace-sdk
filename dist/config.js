import { h as serializeBigInts, t as getBuilderClient } from "./api.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/_internal/query-meta.ts
const persistentQueryMeta = { persistent: true };

//#endregion
//#region src/react/queries/marketplace/queryKeys.ts
/**
* Creates a type-safe query key for marketplace domain with automatic bigint serialization
*
* @param operation - The specific operation (e.g., 'config', 'filters')
* @param params - The query parameters (will be automatically serialized)
* @returns A serialized query key safe for React Query
*/
function createMarketplaceQueryKey(operation, params) {
	return [
		"marketplace",
		operation,
		serializeBigInts(params)
	];
}

//#endregion
//#region src/react/queries/marketplace/config.ts
const fetchMarketplaceConfig = async ({ config, prefetchedMarketplaceSettings }) => {
	let builderMarketplaceConfig = prefetchedMarketplaceSettings;
	if (!builderMarketplaceConfig) builderMarketplaceConfig = await getBuilderClient(config).lookupMarketplace({ projectId: Number(config.projectId) });
	if (!builderMarketplaceConfig) throw new Error("Failed to fetch marketplace config");
	const { market, shop, settings } = builderMarketplaceConfig.marketplace;
	let marketplaceConfig = {
		projectId: Number(config.projectId),
		settings,
		market,
		shop
	};
	if (config._internal?.overrides?.marketplaceConfig) {
		const overrides = config._internal.overrides.marketplaceConfig;
		marketplaceConfig = {
			...marketplaceConfig,
			...overrides,
			market: {
				...marketplaceConfig.market,
				...overrides.market,
				collections: overrides.market?.collections ?? marketplaceConfig.market.collections
			},
			shop: {
				...marketplaceConfig.shop,
				...overrides.shop,
				collections: overrides.shop?.collections ?? marketplaceConfig.shop.collections
			}
		};
	}
	return marketplaceConfig;
};
const marketplaceConfigOptions = (config) => {
	const prefetchedMarketplaceSettings = config._internal?.prefetchedMarketplaceSettings;
	return queryOptions({
		queryKey: createMarketplaceQueryKey("config", {}),
		queryFn: () => fetchMarketplaceConfig({
			config,
			prefetchedMarketplaceSettings
		}),
		gcTime: Number.POSITIVE_INFINITY,
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		meta: persistentQueryMeta
	});
};

//#endregion
export { marketplaceConfigOptions as n, createMarketplaceQueryKey as r, fetchMarketplaceConfig as t };
//# sourceMappingURL=config.js.map