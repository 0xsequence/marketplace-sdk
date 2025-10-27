import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { ContractType, OrderbookKind, SdkConfig } from '../../../types';
import type {
	MarketCollection,
	MarketPage,
	MarketplaceConfig,
	ShopCollection,
	ShopPage,
} from '../../../types/new-marketplace-types';
import { configKeys, getBuilderClient } from '../../_internal';
import type { LookupMarketplaceReturn } from '../../_internal/api/builder.gen';
import { persistentQueryMeta } from '../../_internal/query-meta';

export const fetchMarketplaceConfig = async ({
	config,
	prefetchedMarketplaceSettings,
}: {
	config: SdkConfig;
	prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
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
			destinationMarketplace:
				collection.destinationMarketplace as OrderbookKind,
			itemsAddress: collection.itemsAddress as Address,
			cardType: 'market',
		} satisfies MarketCollection;
	});

	const shopCollections = (builderMarketplaceConfig.shopCollections ?? []).map(
		(collection) => {
			return {
				...collection,
				itemsAddress: collection.itemsAddress as Address,
				saleAddress: collection.saleAddress as Address,
				cardType: 'shop',
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
				//@ts-expect-error - TODO: Fix this partial type. We need to align new-marketplace-types with builder.gen.ts
				collections:
					overrides.market?.collections ?? marketplaceConfig.market.collections,
			},
			shop: {
				...marketplaceConfig.shop,
				...overrides.shop,
				//@ts-expect-error - TODO: Fix this partial type. We need to align new-marketplace-types with builder.gen.ts
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
		gcTime: Number.POSITIVE_INFINITY,
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		meta: persistentQueryMeta,
	});
};
