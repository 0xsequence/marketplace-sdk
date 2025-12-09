import type { Builder } from '@0xsequence/api-client';
import { queryOptions } from '@tanstack/react-query';
import type { MarketplaceConfig, SdkConfig } from '../../../types';
import { getBuilderClient } from '../../_internal';
import { persistentQueryMeta } from '../../_internal/query-meta';
import { createMarketplaceQueryKey } from './queryKeys';

export const fetchMarketplaceConfig = async ({
	config,
	prefetchedMarketplaceSettings,
}: {
	config: SdkConfig;
	prefetchedMarketplaceSettings?: Builder.LookupMarketplaceReturn;
}): Promise<MarketplaceConfig> => {
	let builderMarketplaceConfig = prefetchedMarketplaceSettings;

	if (!builderMarketplaceConfig) {
		const builderApi = getBuilderClient(config);
		const response = await builderApi.lookupMarketplace({
			projectId: Number(config.projectId),
		});

		builderMarketplaceConfig = response;
	}

	if (!builderMarketplaceConfig) {
		throw new Error('Failed to fetch marketplace config');
	}

	// The API wrapper's toLookupMarketplaceReturn transform already:
	// 1. Nests collections within market.collections and shop.collections
	// 2. Adds marketplaceCollectionType discriminator to each collection
	// 3. Returns correctly typed MarketPage and ShopPage interfaces
	// No transformation or type casting needed here!
	const { market, shop, settings } = builderMarketplaceConfig.marketplace;

	let marketplaceConfig: MarketplaceConfig = {
		projectId: Number(config.projectId),
		settings,
		market,
		shop,
	};

	if (config._internal?.overrides?.marketplaceConfig) {
		const overrides = config._internal.overrides.marketplaceConfig;
		marketplaceConfig = {
			...marketplaceConfig,
			...overrides,
			market: {
				...marketplaceConfig.market,
				...overrides.market,
				collections:
					overrides.market?.collections ?? marketplaceConfig.market.collections,
			},
			shop: {
				...marketplaceConfig.shop,
				...overrides.shop,
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
		queryKey: createMarketplaceQueryKey('config', {}),
		queryFn: () =>
			fetchMarketplaceConfig({
				config,
				prefetchedMarketplaceSettings,
			}),
		gcTime: Number.POSITIVE_INFINITY,
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		meta: persistentQueryMeta,
	});
};
