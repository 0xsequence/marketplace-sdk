'use server';

import type { Env, SdkConfig } from '@0xsequence/marketplace-sdk';
import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { QueryClient } from '@tanstack/react-query';
import { cookies, headers } from 'next/headers';
import {
	DEFAULT_PROJECT_ACCESS_KEY,
	DEFAULT_PROJECT_ID,
} from 'shared-components';
import { OverwriteCookie } from './overwriteCookie';

const SDK_CONFIG = {
	projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
	projectId: DEFAULT_PROJECT_ID,
} as const;

const getEnvironmentFromCookie = (
	cookieJar: ReturnType<typeof cookies>,
	cookieName: string,
	defaultEnv: Env = 'production',
): Env => {
	return (cookieJar.get(cookieName)?.value || defaultEnv) as Env;
};

// Main SSR client function
export const ssrClient = async () => {
	const cookieJar = cookies();
	const headersList = headers();

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

	if (!SDK_CONFIG.projectId) {
		throw new Error('NEXT_PUBLIC_SEQUENCE_PROJECT_ID is required');
	}

	return createSSRClient({
		cookie: headersList.get('cookie') || '',
		config: {
			projectAccessKey: SDK_CONFIG.projectAccessKey,
			projectId: SDK_CONFIG.projectId,
			_internal: {
				builderEnv,
				marketplaceEnv,
				metadataEnv,
				indexerEnv,
			},
		},
		queryClient: new QueryClient(),
	});
};
