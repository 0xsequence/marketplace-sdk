import { queryOptions } from '@tanstack/react-query';
import type { Env, SdkConfig, ShopConfig } from '../../types';
import {
	type MarketCollection,
	type MarketPage,
	type Marketplace,
	type NewMarketplaceSettings,
	NewMarketplaceType,
	type ShopCollection,
	type ShopPage,
} from '../../types/new-marketplace-types';
import { builderMarketplaceApi, builderRpcApi, configKeys } from '../_internal';
import { BuilderAPI } from '../_internal/api/builder-api';
import type { MarketplaceSettings } from '../_internal/api/builder.gen';

export type MarketplaceConfig = Marketplace & {
	cssString: string;
	manifestUrl: string;
};

const fetchBuilderConfig = async ({
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
	prefetchedMarketplaceSettings?: MarketplaceSettings;
}): Promise<Marketplace> => {
	let oldMarketplaceConfig = prefetchedMarketplaceSettings;
	if (!oldMarketplaceConfig) {
		const baseUrl = builderRpcApi(env);
		const builderApi = new BuilderAPI(baseUrl, projectAccessKey);
		const response = await builderApi.lookupMarketplaceConfig({
			projectId: Number(projectId),
		});

		oldMarketplaceConfig = response.settings;
	}
	const settings = {
		publisherId: oldMarketplaceConfig.publisherId,
		title: oldMarketplaceConfig.title,
		socials: oldMarketplaceConfig.socials,
		faviconUrl: oldMarketplaceConfig.faviconUrl,
		walletOptions: oldMarketplaceConfig.walletOptions,
		logoUrl: oldMarketplaceConfig.logoUrl,
		fontUrl: oldMarketplaceConfig.fontUrl,
		accessKey: oldMarketplaceConfig.accessKey,
	} satisfies NewMarketplaceSettings;

	const marketCollections = oldMarketplaceConfig.collections.map(
		(collection) => {
			return {
				chainId: collection.chainId,
				bannerUrl: collection.bannerUrl,
				marketplaceType: NewMarketplaceType.MARKET,
				isLAOSERC721: collection.isLAOSERC721,
				itemsAddress: collection.address,
				feePercentage: collection.feePercentage,
				currencyOptions: collection.currencyOptions,
				filterSettings: collection.filterSettings,
				destinationMarketplace: collection.destinationMarketplace,
			} satisfies MarketCollection;
		},
	);

	const shopCollections = tmpShopConfig?.collections.map((collection) => {
		return {
			chainId: collection.chainId,
			bannerUrl: collection.bannerUrl,
			marketplaceType: NewMarketplaceType.SHOP,
			isLAOSERC721: false,
			itemsAddress: collection.address,
			filterSettings: undefined,
			saleAddress: collection.primarySalesContractAddress,
		} satisfies ShopCollection;
	});

	const market = {
		enabled: true,
		title: oldMarketplaceConfig.title,
		bannerUrl: oldMarketplaceConfig.bannerUrl,
		ogImage: oldMarketplaceConfig.ogImage,
		collections: marketCollections,
	} satisfies MarketPage;

	const shop = {
		enabled: tmpShopConfig !== undefined,
		title: tmpShopConfig?.title ?? '',
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

const fetchStyles = async (projectId: string, env: Env) => {
	const response = await fetch(
		`${builderMarketplaceApi(projectId, env)}/styles.css`,
	);
	const styles = await response.text();
	// React sanitizes this string, so we need to remove all quotes, they are not needed anyway
	return styles.replaceAll(/['"]/g, '');
};

const fetchMarketplaceConfig = async ({
	env,
	projectId,
	projectAccessKey,
	prefetchedMarketplaceSettings,
}: {
	env: Env;
	projectId: string;
	projectAccessKey: string;
	tmpShopConfig?: ShopConfig;
	prefetchedMarketplaceSettings?: MarketplaceSettings;
}) => {
	const [marketplaceConfig, cssString] = await Promise.all([
		fetchBuilderConfig({
			projectId,
			projectAccessKey,
			env,
			prefetchedMarketplaceSettings,
		}),
		fetchStyles(projectId, env),
	]);

	return {
		...marketplaceConfig,
		cssString,
		manifestUrl: `${builderMarketplaceApi(projectId, env)}/manifest.json`,
	} as const;
};

export const marketplaceConfigOptions = (
	config: Pick<SdkConfig, 'projectId' | 'projectAccessKey'> | SdkConfig,
) => {
	let env: Env = 'production';
	if ('_internal' in config && config._internal !== undefined) {
		env = config._internal.builderEnv ?? env;
	}

	let prefetchedMarketplaceSettings: MarketplaceSettings | undefined;
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
			}),
	});
};
