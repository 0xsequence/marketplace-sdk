import { queryOptions } from '@tanstack/react-query';
import type { ContractType, SdkConfig } from '../../types';
import type {
	MarketCollection,
	MarketPage,
	MarketplaceConfig,
	ShopCollection,
	ShopPage,
} from '../../types/new-marketplace-types';
import { configKeys, getBuilderClient } from '../_internal';
import type { LookupMarketplaceReturn } from '../_internal/api/builder.gen';

export const fetchMarketplaceConfig = async ({
	config,
	prefetchedMarketplaceSettings,
}: {
	config: SdkConfig;
	prefetchedMarketplaceSettings?: LookupMarketplaceReturn; //TODO: Is this the right approach?
}): Promise<MarketplaceConfig> => {
	let builderMarketplaceConfig = prefetchedMarketplaceSettings;

	if (!builderMarketplaceConfig) {
		const builderApi = getBuilderClient(config);
		const response = await builderApi.lookupMarketplace({
			projectId: Number(config.projectId),
		});

		builderMarketplaceConfig = response;
	}

	const marketCollections = (
		builderMarketplaceConfig.marketCollections ?? []
	).map((collection) => {
		return {
			...collection,
			contractType: collection.contractType as ContractType,
			marketplaceType: 'market',
		} satisfies MarketCollection;
	});

	const shopCollections = builderMarketplaceConfig.shopCollections.map(
		(collection) => {
			return {
				...collection,
				marketplaceType: 'shop',
			} satisfies ShopCollection;
		},
	);

	const market = {
		...builderMarketplaceConfig.marketplace.market,
		collections: marketCollections,
	} satisfies MarketPage;

	const shop = {
		...builderMarketplaceConfig.marketplace.shop,
		collections: shopCollections ?? [],
	} satisfies ShopPage;

	let marketplaceConfig = {
		projectId: Number(config.projectId),
		settings: builderMarketplaceConfig.marketplace.settings,
		market,
		shop,
	} satisfies MarketplaceConfig;

	if (config._internal?.overrides?.marketplaceConfig) {
		const overrides = config._internal.overrides.marketplaceConfig;
		marketplaceConfig = {
			...marketplaceConfig,
			...overrides,
			market: {
				...marketplaceConfig.market,
				...overrides.market,
				//@ts-expect-error - TODO: Fix this partial type
				collections:
					overrides.market?.collections ?? marketplaceConfig.market.collections,
			},
			shop: {
				...marketplaceConfig.shop,
				...overrides.shop,
				//@ts-expect-error - TODO: Fix this partial type
				collections:
					overrides.shop?.collections ?? marketplaceConfig.shop.collections,
			},
		};
	}

	return marketplaceConfig;
};

export const marketplaceConfigOptions = (config: SdkConfig) => {
	const prefetchedMarketplaceSettings =
		config._internal?.prefetchedMarketplaceSettings;

	return queryOptions({
		queryKey: [...configKeys.marketplace],
		queryFn: () =>
			fetchMarketplaceConfig({
				config,
				prefetchedMarketplaceSettings,
			}),
	});
};
