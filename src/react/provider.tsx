'use client';

import { ThemeProvider } from '@0xsequence/design-system';
import { createContext } from 'react';
import '@0xsequence/design-system/styles.css';
import { type KitConfig, KitProvider } from '@0xsequence/kit';
import { getQueryClient } from '@internal';
import { marketplaceConfigOptions } from '@react-hooks/useMarketplaceConfig';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import type { MarketplaceConfig, SdkConfig } from '@types';
import { type State, WagmiProvider } from 'wagmi';
import { PROVIDER_ID } from './_internal/get-provider';
import { createWagmiConfig } from './_internal/wagmi/create-config';

export const MarketplaceSdkContext = createContext({} as SdkConfig);

export type MarketplaceSdkProviderProps = {
	config: SdkConfig;
	children: React.ReactNode;
	initialState?: { wagmi?: State };
};

const queryClient = getQueryClient();

export function MarketplaceSdkProvider({
	config,
	children,
	initialState,
}: MarketplaceSdkProviderProps) {
	const { data: marketplaceConfig } = useQuery(
		marketplaceConfigOptions(config),
		queryClient,
	);

	return marketplaceConfig ? (
		<Providers
			config={config}
			marketplaceConfig={marketplaceConfig}
			initialState={initialState}
		>
			{children}
		</Providers>
	) : (
		<></>
	);
}

const Providers = ({
	config,
	marketplaceConfig,
	children,
	initialState,
}: {
	config: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	children: React.ReactNode;
	initialState?: { wagmi?: State };
}) => {
	const kitConfig = {
		projectAccessKey: config.projectAccessKey,
		signIn: {
			projectName: marketplaceConfig.title,
		},
	} satisfies KitConfig;

	const wagmiConfig = createWagmiConfig(
		marketplaceConfig,
		config,
		!!initialState,
	);

	return (
		<ThemeProvider>
			<WagmiProvider config={wagmiConfig} initialState={initialState?.wagmi}>
				<QueryClientProvider client={queryClient}>
					<KitProvider config={kitConfig}>
						<MarketplaceSdkContext.Provider value={config}>
							<div id={PROVIDER_ID}>{children}</div>
						</MarketplaceSdkContext.Provider>
					</KitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
};
