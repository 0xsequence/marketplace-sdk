import { queryOptions } from '@tanstack/react-query';
import type { Env, SdkConfig } from '../../types';
import { builderMarketplaceApi, builderRpcApi, configKeys } from '../_internal';
import { BuilderAPI } from '../_internal/api/builder-api';
import type { MarketplaceSettings } from '../_internal/api/builder.gen';

export type MarketplaceConfig = MarketplaceSettings & {
	cssString: string;
	manifestUrl: string;
};

const fetchBuilderConfig = async ({
	projectId,
	projectAccessKey,
	env,
	prefetchedMarketplaceSettings,
}: {
	projectId: string;
	projectAccessKey: string;
	env: Env;
	prefetchedMarketplaceSettings?: MarketplaceSettings;
}) => {
	if (prefetchedMarketplaceSettings) {
		return prefetchedMarketplaceSettings;
	}
	const baseUrl = builderRpcApi(env);
	const builderApi = new BuilderAPI(baseUrl, projectAccessKey);
	const response = await builderApi.lookupMarketplaceConfig({
		projectId: Number(projectId),
	});
	return response.settings;
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
	prefetchedMarketplaceSettings?: MarketplaceSettings;
}): Promise<MarketplaceConfig> => {
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
	};
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
