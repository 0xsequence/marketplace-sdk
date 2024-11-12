'use client';

import { ThemeProvider } from '@0xsequence/design-system';
import '@0xsequence/design-system/styles.css';
import { type KitConfig, KitProvider } from '@0xsequence/kit';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	MarketplaceProvider,
	ModalProvider,
	createWagmiConfig,
	getQueryClient,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type State, WagmiProvider } from 'wagmi';

const queryClient = getQueryClient();

export default function Providers({
	sdkInitialState,
	sdkConfig,
	children,
}: {
	sdkInitialState?: { wagmi?: State };
	sdkConfig: SdkConfig;
	children: React.ReactNode;
}) {
	enableReactComponents();

	const { data: marketplaceConfig } = useQuery(
		marketplaceConfigOptions(sdkConfig),
		queryClient,
	);

	return marketplaceConfig ? (
		<Providers2
			config={sdkConfig}
			marketplaceConfig={marketplaceConfig}
			initialState={sdkInitialState}
		>
			{children}
		</Providers2>
	) : (
		<></>
	);
}

const Providers2 = ({
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
						<MarketplaceProvider config={config}>
							{children}
							<ReactQueryDevtools initialIsOpen={false} />
							<ModalProvider />
						</MarketplaceProvider>
					</KitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
};
