'use server';

import { env } from './env';
import { OverwriteCookie } from './overwriteCookie';

import type { Env, SdkConfig } from '@0xsequence/marketplace-sdk';
import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { QueryClient } from '@tanstack/react-query';
import { cookies, headers } from 'next/headers';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const ssrClient = async () => {
	const cookieJar = cookies();

	const headersList = headers();

	const hostname = (
		cookieJar.get(OverwriteCookie.MARKETPLACE_PROJECT)?.value ||
		headersList.get('x-forwarded-marketplace') ||
		headersList.get('host') ||
		''
	).replace(/\.localhost[^/]*/, '.dev-sequence.market'); //for localhost dev

	const builderEnv = (cookieJar.get(OverwriteCookie.BUILDER_ENV)?.value ||
		'development') as Env;

	const extendedMarketplaceConfig = await fetchExtendedMarketplaceConfig(
		hostname,
		builderEnv,
	);

	const marketplaceEnv = (cookieJar.get(OverwriteCookie.MARKETPLACE_ENV)
		?.value || 'development') as Env;

	const metadataEnv = (cookieJar.get(OverwriteCookie.METADATA_ENV)?.value ||
		'development') as Env;

	const indexerEnv = (cookieJar.get(OverwriteCookie.INDEXER_ENV)?.value ||
		'development') as Env;

	const embedded = extendedMarketplaceConfig?.waasTenantKey
		? ({
				waasConfigKey: extendedMarketplaceConfig.waasTenantKey,
				googleClientId: extendedMarketplaceConfig.googleClientId,
				appleClientId: extendedMarketplaceConfig.appleClientId,
				appleRedirectURI: hostname,
			} satisfies NonNullable<SdkConfig['wallet']>['embedded'])
		: undefined;

	return createSSRClient({
		cookie: headersList.get('cookie') || '',
		config: {
			projectAccessKey: 'SECRET_KEY', //env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
			wallet: {
				walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_ID,
				embedded,
			},
			projectId: 'PROJECT_ID',
			_internal: {
				devAccessKey: 'SECRET_KEY',
				nextAccessKey: 'SECRET_KEY',
				builderEnv,
				marketplaceEnv,
				metadataEnv,
				indexerEnv,
			},
		},
		queryClient: new QueryClient(),
	});
};

type ExtendedMarketplaceConfig = {
	accessKey: string;
	projectId?: string; //TODO: make this requierd when builder goes to prod
	waasEmailEnabled: boolean;
	waasTenantKey?: string;
	googleClientId?: string;
	appleClientId?: string;
};

async function fetchExtendedMarketplaceConfig(hostname: string, env: Env) {
	const devURL =
		'https://dev-api.sequence.build/rpc/Builder/GetExtendedMarketplaceConfig';
	const prodURL =
		'https://api.sequence.build/rpc/Builder/GetExtendedMarketplaceConfig';

	const isDev = env === 'development';
	const BUILDER_API_KEY_DEV = 'SECRET_KEY';

	const BUILDER_API_KEY_PROD = 'SECRET_KEY';

	const url = isDev ? devURL : prodURL;
	const accessKey = isDev ? BUILDER_API_KEY_DEV : BUILDER_API_KEY_PROD;
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessKey}`,
		},
		body: JSON.stringify({
			hostname,
		}),
	};

	const req = await fetch(url, requestOptions);

	const json = await req.json();

	if (req.status !== 200) {
		console.error('Error fetching extended marketplace config:', json);
		return undefined;
	}

	// This is only avalabe on DEV builder for now, unsure if the ternary is nessesary here...
	const projectId = json.config.projectId
		? json.config.projectId
		: json.projectId;

	// Support for old config structure
	const config = json.config.config ? json.config.config : json.config;

	return {
		projectId,
		accessKey: config.accessKey,
		waasEmailEnabled: config.waasEmailEnabled,
		googleClientId: config.oidcIssuers?.google,
		appleClientId: config.oidcIssuers?.apple,
		waasTenantKey: config.waasTenantKey,
	} as ExtendedMarketplaceConfig;
}
