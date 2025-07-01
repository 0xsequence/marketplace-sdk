import { configKeys, getBuilderClient } from "./api-BwkAXGhb.js";
import { queryOptions } from "@tanstack/react-query";

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
			marketplaceType: "market"
		};
	});
	const shopCollections = (builderMarketplaceConfig.shopCollections ?? []).map((collection) => {
		return {
			...collection,
			marketplaceType: "shop"
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
		})
	});
};

//#endregion
export { fetchMarketplaceConfig, marketplaceConfigOptions };
//# sourceMappingURL=marketplaceConfig-D0832T_-.js.map