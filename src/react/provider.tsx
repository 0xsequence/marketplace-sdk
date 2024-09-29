'use client';

import { ThemeProvider } from '@0xsequence/design-system';
import { createContext, useState } from 'react';
import '@0xsequence/design-system/styles.css';
import { type KitConfig, KitProvider } from '@0xsequence/kit';
import { getQueryClient } from '@api/get-query-client';
import { marketplaceConfigOptions } from '@react-hooks/useMarketplaceConfig';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { type State, WagmiProvider } from 'wagmi';

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

	const [wagmiConfig] = useState(createWagmiConfig(marketplaceConfig, config));

	return (
		<ThemeProvider>
			<WagmiProvider config={wagmiConfig} initialState={initialState?.wagmi}>
				<QueryClientProvider client={queryClient}>
					<KitProvider config={kitConfig}>
						<QueryClientProvider client={queryClient}>
							<MarketplaceSdkContext.Provider value={config}>
								<div id={PROVIDER_ID}>{children}</div>
							</MarketplaceSdkContext.Provider>
						</QueryClientProvider>
					</KitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
};
