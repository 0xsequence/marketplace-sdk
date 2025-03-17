'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { type Context, createContext } from 'react';
import type { JSX } from 'react/jsx-runtime';
import type { SdkConfig } from '../types';
import { InvalidProjectAccessKeyError } from '../utils/_internal/error/config';
import { getQueryClient } from './_internal/api/get-query-client';
import { PROVIDER_ID } from './_internal/get-provider';

export const MarketplaceSdkContext: Context<SdkConfig> = createContext(
	{} as SdkConfig,
);

export type MarketplaceSdkProviderProps = {
	config: SdkConfig;
	children: React.ReactNode;
};

export function MarketplaceQueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const queryClient = getQueryClient();
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export function MarketplaceProvider({
	config,
	children,
}: MarketplaceSdkProviderProps): JSX.Element {
	if (config.projectAccessKey === '' || !config.projectAccessKey) {
		throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	}

	return (
		<MarketplaceQueryClientProvider>
			<MarketplaceSdkContext.Provider value={config}>
				<div id={PROVIDER_ID}>{children}</div>
			</MarketplaceSdkContext.Provider>
		</MarketplaceQueryClientProvider>
	);
}
