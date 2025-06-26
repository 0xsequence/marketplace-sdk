'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createContext } from 'react';
import type { SdkConfig } from '../types';
import { InvalidProjectAccessKeyError } from '../utils/_internal/error/config';
import { SmartWalletConnectionProvider } from './_internal/wallet';
import { getQueryClient } from './_internal/api/get-query-client';
import { PROVIDER_ID } from './_internal/get-provider';

export const MarketplaceSdkContext = createContext({} as SdkConfig);

export type MarketplaceSdkProviderProps = {
	config: SdkConfig;
	children: React.ReactNode;
};

export function MarketplaceQueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export function MarketplaceProvider({
	config,
	children,
}: MarketplaceSdkProviderProps) {
	if (config.projectAccessKey === '' || !config.projectAccessKey) {
		throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	}

	return (
		<MarketplaceQueryClientProvider>
			<MarketplaceSdkContext.Provider value={config}>
				<SmartWalletConnectionProvider>
					<div id={PROVIDER_ID}>{children}</div>
				</SmartWalletConnectionProvider>
			</MarketplaceSdkContext.Provider>
		</MarketplaceQueryClientProvider>
	);
}
