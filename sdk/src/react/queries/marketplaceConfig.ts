import { queryOptions } from '@tanstack/react-query';
import type { Env, SdkConfig } from '../../types';
import { builderMarketplaceApi, configKeys } from '../_internal';
import { BuilderAPI } from '../_internal/api/builder-api';
import type { MarketplaceSettings } from '../_internal/api/builder.gen';

export type MarketplaceConfig = MarketplaceSettings & {
	cssString: string;
	manifestUrl: string;
};

const fetchBuilderConfig = async (projectId: string, env: Env) => {
	const baseUrl = builderMarketplaceApi(projectId, env);
	const builderApi = new BuilderAPI(baseUrl, projectId);

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

const fetchMarketplaceConfig = async (
	env: Env,
	projectId: string,
): Promise<MarketplaceConfig> => {
	const [marketplaceConfig, cssString] = await Promise.all([
		fetchBuilderConfig(projectId, env),
		fetchStyles(projectId, env),
	]);

	return {
		...marketplaceConfig,
		cssString,
		manifestUrl: `${builderMarketplaceApi(projectId, env)}/manifest.json`,
	};
};

export const marketplaceConfigOptions = (
	config: Pick<SdkConfig, 'projectId'> | SdkConfig,
) => {
	let env: Env = 'production';
	if ('_internal' in config && config._internal !== undefined) {
		env = config._internal.builderEnv ?? env;
	}

	const projectId = config.projectId;
	return queryOptions({
		queryKey: [...configKeys.marketplace, env, projectId],
		queryFn: () => fetchMarketplaceConfig(env, projectId),
	});
};
