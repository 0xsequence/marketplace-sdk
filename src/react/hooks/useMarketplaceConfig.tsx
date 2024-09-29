import { builderMarketplaceApi } from '@api/services';
import { useConfig } from './useConfig';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Env, MarketplaceConfig, SdkConfig } from '@types';

const fetchBuilderConfig = async (projectId: string, env: Env) => {
	const url = `${builderMarketplaceApi(projectId, env)}`;
	const response = await fetch(`${url}/config.json`);

	const json = await response.json();
	if (!response.ok) {
		console.error('Failed to fetch marketplace config:', response.status, json);
		//@ts-ignore
		switch (json.code) {
			case 3000: // Throws 3000 if the project is not found
				throw new Error(`Project id: ${projectId} not found, ${url}`);
			default:
				//@ts-ignore
				throw new Error(`Failed to fetch marketplace config: ${json.msg}`);
		}
	}
	return json as MarketplaceConfig;
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
		queryKey: ['marketplaceConfig', env, projectId],
		queryFn: () => fetchMarketplaceConfig(env, projectId),
	});
};

export const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};
