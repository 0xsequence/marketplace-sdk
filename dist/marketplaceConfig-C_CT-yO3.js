import { configKeys, getBuilderClient } from "./api-DBiZzw5L.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/_internal/query-meta.ts
const persistentQueryMeta = { persistent: true };

//#endregion
//#region src/react/queries/marketplaceConfig.ts
const fetchMarketplaceConfig = async ({ config, prefetchedMarketplaceSettings }) => {
	let builderMarketplaceConfig = prefetchedMarketplaceSettings;
	if (!builderMarketplaceConfig) {
		const builderApi = getBuilderClient(config);
		const response = await builderApi.lookupMarketplace({ projectId: Number(config.projectId) });
		builderMarketplaceConfig = response;
	}
	const marketCollections = (builderMarketplaceConfig.marketCollections ?? []).map((collection) => {
		return {
			...collection,
			contractType: collection.contractType,
			destinationMarketplace: collection.destinationMarketplace,
			itemsAddress: collection.itemsAddress,
			cardType: "market"
		};
	});
	const shopCollections = (builderMarketplaceConfig.shopCollections ?? []).map((collection) => {
		return {
			...collection,
			itemsAddress: collection.itemsAddress,
			saleAddress: collection.saleAddress,
			cardType: "shop"
		};
	});
	const market = {
		...builderMarketplaceConfig.marketplace.market,
		collections: marketCollections
	};
	const shop = {
		...builderMarketplaceConfig.marketplace.shop,
		collections: shopCollections ?? []
	};
	let marketplaceConfig = {
		projectId: Number(config.projectId),
		settings: builderMarketplaceConfig.marketplace.settings,
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
		queryKey: [...configKeys.marketplace],
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
export { fetchMarketplaceConfig as fetchMarketplaceConfig$1, marketplaceConfigOptions as marketplaceConfigOptions$1 };
//# sourceMappingURL=marketplaceConfig-C_CT-yO3.js.map