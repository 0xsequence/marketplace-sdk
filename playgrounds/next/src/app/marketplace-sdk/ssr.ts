'use server';

import type { Env, SdkConfig } from '@0xsequence/marketplace-sdk';
import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { QueryClient } from '@tanstack/react-query';
import { cookies, headers } from 'next/headers';
import { env } from './env';
import { OverwriteCookie } from './overwriteCookie';

// Constants
const BUILDER_API_CONFIG = {
	development: {
		url: 'https://dev-api.sequence.build/rpc/Builder/GetExtendedMarketplaceConfig',
		key: env.BUILDER_API_KEY_DEV,
	},
	production: {
		url: 'https://api.sequence.build/rpc/Builder/GetExtendedMarketplaceConfig',
		key: env.BUILDER_API_KEY_PROD,
	},
} as const;

const SDK_CONFIG = {
	projectAccessKey: env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
	projectId: env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID,
	devAccessKey: env.NEXT_PUBLIC_SEQUENCE_DEV_ACCESS_KEY,
} as const;

// Types
interface ExtendedMarketplaceConfig {
	accessKey: string;
	projectId?: string; // TODO: make this required when builder goes to prod
	waasEmailEnabled: boolean;
	waasTenantKey?: string;
	googleClientId?: string;
	appleClientId?: string;
}

interface MarketplaceConfigData {
	accessKey: string;
	waasEmailEnabled: boolean;
	oidcIssuers?: {
		google?: string;
		apple?: string;
	};
	waasTenantKey?: string;
}

interface MarketplaceApiResponse {
	config: {
		projectId?: string;
		config?: MarketplaceConfigData;
	} & MarketplaceConfigData;
	projectId?: string;
}

// Utility functions
const getHostname = (
	cookieJar: ReturnType<typeof cookies>,
	headersList: ReturnType<typeof headers>,
): string => {
	const hostname =
		cookieJar.get(OverwriteCookie.MARKETPLACE_PROJECT)?.value ||
		headersList.get('x-forwarded-marketplace') ||
		headersList.get('host') ||
		'';
	return hostname.replace(/\.localhost[^/]*/, '.dev-sequence.market');
};

const getEnvironmentFromCookie = (
	cookieJar: ReturnType<typeof cookies>,
	cookieName: string,
	defaultEnv: Env = 'development',
): Env => {
	return (cookieJar.get(cookieName)?.value || defaultEnv) as Env;
};

const createEmbeddedConfig = (
	config: ExtendedMarketplaceConfig,
	hostname: string,
): NonNullable<SdkConfig['wallet']>['embedded'] | undefined => {
	if (!config.waasTenantKey) return undefined;

	return {
		waasConfigKey: config.waasTenantKey,
		googleClientId: config.googleClientId,
		appleClientId: config.appleClientId,
		appleRedirectURI: hostname,
	};
};

// API function
async function fetchExtendedMarketplaceConfig(
	hostname: string,
	env: Env,
): Promise<ExtendedMarketplaceConfig | undefined> {
	const { url, key } =
		BUILDER_API_CONFIG[env === 'development' ? 'development' : 'production'];

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${key}`,
			},
			body: JSON.stringify({ hostname }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error fetching extended marketplace config:', errorData);
			return undefined;
		}

		const json = (await response.json()) as MarketplaceApiResponse;
		const configData = json.config.config ?? json.config;
		const projectId = json.config.projectId ?? json.projectId;

		return {
			projectId,
			accessKey: configData.accessKey,
			waasEmailEnabled: configData.waasEmailEnabled,
			googleClientId: configData.oidcIssuers?.google,
			appleClientId: configData.oidcIssuers?.apple,
			waasTenantKey: configData.waasTenantKey,
		};
	} catch (error) {
		console.error('Failed to fetch marketplace config:', error);
		return undefined;
	}
}

// Main SSR client function
export const ssrClient = async () => {
	const cookieJar = cookies();
	const headersList = headers();
	const hostname = getHostname(cookieJar, headersList);

	const builderEnv = getEnvironmentFromCookie(
		cookieJar,
		OverwriteCookie.BUILDER_ENV,
	);
	const marketplaceEnv = getEnvironmentFromCookie(
		cookieJar,
		OverwriteCookie.MARKETPLACE_ENV,
	);
	const metadataEnv = getEnvironmentFromCookie(
		cookieJar,
		OverwriteCookie.METADATA_ENV,
	);
	const indexerEnv = getEnvironmentFromCookie(
		cookieJar,
		OverwriteCookie.INDEXER_ENV,
	);

	const extendedMarketplaceConfig = await fetchExtendedMarketplaceConfig(
		hostname,
		builderEnv,
	);
	const embedded =
		extendedMarketplaceConfig &&
		createEmbeddedConfig(extendedMarketplaceConfig, hostname);

	if (!SDK_CONFIG.projectId) {
		throw new Error('NEXT_PUBLIC_SEQUENCE_PROJECT_ID is required');
	}

	return createSSRClient({
		cookie: headersList.get('cookie') || '',
		config: {
			projectAccessKey: SDK_CONFIG.projectAccessKey,
			wallet: {
				walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_ID,
				embedded,
			},
			projectId: SDK_CONFIG.projectId,
			_internal: {
				devAccessKey: SDK_CONFIG.devAccessKey,
				builderEnv,
				marketplaceEnv,
				metadataEnv,
				indexerEnv,
			},
		},
		queryClient: new QueryClient(),
	});
};
