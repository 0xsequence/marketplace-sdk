import { queryOptions } from '@tanstack/react-query';
import type { ContractType, Env, SdkConfig, ShopConfig } from '../../types';
import {
	type MarketCollection,
	type MarketPage,
	type Marketplace,
	MarketplaceType,
	type NewMarketplaceSettings,
	type ShopCollection,
	type ShopPage,
} from '../../types/new-marketplace-types';
import { builderRpcApi, configKeys } from '../_internal';
import { BuilderAPI } from '../_internal/api/builder-api';
import type { LookupMarketplaceReturn } from '../_internal/api/builder.gen';

export const fetchMarketplaceConfig = async ({
	projectId,
	projectAccessKey,
	env,
	prefetchedMarketplaceSettings,
	tmpShopConfig,
}: {
	projectId: string;
	projectAccessKey: string;
	env: Env;
	tmpShopConfig?: ShopConfig;
	prefetchedMarketplaceSettings?: LookupMarketplaceReturn; //TODO: Is this the right approach?
}): Promise<Marketplace> => {
	let builderMarketplaceConfig = prefetchedMarketplaceSettings;
	if (!builderMarketplaceConfig) {
		const baseUrl = builderRpcApi(env);
		const builderApi = new BuilderAPI(baseUrl, projectAccessKey);
		const response = await builderApi.lookupMarketplace({
			projectId: Number(projectId),
		});

		builderMarketplaceConfig = response;
	}
	const settings = {
		publisherId: builderMarketplaceConfig.marketplace.settings.publisherId,
		title: builderMarketplaceConfig.marketplace.settings.title,
		socials: builderMarketplaceConfig.marketplace.settings.socials,
		faviconUrl: builderMarketplaceConfig.marketplace.settings.faviconUrl,
		walletOptions: builderMarketplaceConfig.marketplace.settings.walletOptions,
		logoUrl: builderMarketplaceConfig.marketplace.settings.logoUrl,
		fontUrl: builderMarketplaceConfig.marketplace.settings.fontUrl,
		accessKey: builderMarketplaceConfig.marketplace.settings.accessKey,
	} satisfies NewMarketplaceSettings;

	const marketCollections = (
		builderMarketplaceConfig.marketCollections ?? []
	).map((collection) => {
		return {
			chainId: collection.chainId,
			bannerUrl: collection.bannerUrl,
			contractType: collection.contractType as ContractType,
			marketplaceType: MarketplaceType.MARKET,
			itemsAddress: collection.itemsAddress,
			feePercentage: collection.feePercentage,
			currencyOptions: collection.currencyOptions,
			filterSettings: collection.filterSettings,
			destinationMarketplace: collection.destinationMarketplace,
		} satisfies MarketCollection;
	});

	const shopCollections = tmpShopConfig?.collections.map((collection) => {
		return {
			chainId: collection.chainId,
			bannerUrl: collection.bannerUrl,
			contractType: collection.contractType,
			marketplaceType: MarketplaceType.SHOP,
			itemsAddress: collection.address,
			filterSettings: undefined,
			saleAddress: collection.primarySalesContractAddress,
		} satisfies ShopCollection;
	});

	const market = {
		enabled: true,
		bannerUrl: builderMarketplaceConfig.marketplace.market.bannerUrl,
		ogImage: builderMarketplaceConfig.marketplace.market.ogImage,
		collections: marketCollections,
	} satisfies MarketPage;

	const shop = {
		enabled: tmpShopConfig !== undefined,
		bannerUrl: tmpShopConfig?.bannerUrl ?? '',
		ogImage: tmpShopConfig?.ogImage,
		collections: shopCollections ?? [],
	} satisfies ShopPage;

	return {
		projectId: Number(projectId),
		settings,
		market,
		shop,
	} satisfies Marketplace;
};

export const marketplaceConfigOptions = (config: SdkConfig) => {
	let env: Env = 'production';
	if ('_internal' in config && config._internal !== undefined) {
		env = config._internal.builderEnv ?? env;
	}

	let prefetchedMarketplaceSettings: LookupMarketplaceReturn | undefined;
	if (
		'_internal' in config &&
		config._internal?.prefetchedMarketplaceSettings
	) {
		prefetchedMarketplaceSettings =
			config._internal.prefetchedMarketplaceSettings;
	}

	const projectId = config.projectId;
	const projectAccessKey = config.projectAccessKey;

	return queryOptions({
		queryKey: [...configKeys.marketplace, env, projectId],
		queryFn: () =>
			fetchMarketplaceConfig({
				env,
				projectId,
				projectAccessKey,
				prefetchedMarketplaceSettings,
				tmpShopConfig: config.tmpShopConfig,
			}),
	});
};
