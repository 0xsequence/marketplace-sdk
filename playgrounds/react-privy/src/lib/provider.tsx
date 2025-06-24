'use client';

import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from '@privy-io/wagmi';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	MarketplaceProvider,
	ModalProvider,
	getQueryClient,
	getWagmiChainsAndTransports,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { getOverrides, useMarketplace, LinkProvider } from 'shared-components';
import { ReactRouterLinkAdapter } from '../components/routing/ReactRouterAdapters';
import { createConfig } from '@privy-io/wagmi';
import { useState } from 'react';

interface ProvidersProps {
	children: React.ReactNode;
}

function createPrivyWagmiConfig(marketplaceConfig: MarketplaceConfig, sdkConfig: SdkConfig) {
	const { chains, transports } = getWagmiChainsAndTransports({
		marketplaceConfig,
		sdkConfig,
	});

	return createConfig({
		chains,
		transports,
	});
}

export default function Providers({ children }: ProvidersProps) {
	const { sdkConfig } = useMarketplace();
	const queryClient = getQueryClient();
	
	const { data: marketplaceConfig, isLoading } = useQuery(
		marketplaceConfigOptions(sdkConfig),
	);

	const [wagmiConfig] = useState(() => {
		if (!marketplaceConfig) return null;
		return createPrivyWagmiConfig(marketplaceConfig, sdkConfig);
	});

	if (isLoading) {
		return <div>Loading configuration...</div>;
	}

	if (!marketplaceConfig) {
		return <div>Failed to load marketplace configuration</div>;
	}

	if (!sdkConfig.projectAccessKey || sdkConfig.projectAccessKey === '') {
		return <div>Please set a valid project access key</div>;
	}

	if (!wagmiConfig) {
		return <div>Failed to create wagmi configuration</div>;
	}

	return (
		<PrivyProvider
			appId="cmc07riml000dju0nlcxdpd70"
			config={{
				loginMethods: ['email', 'wallet', 'google', 'twitter'],
				appearance: {
					theme: 'dark',
				},
				embeddedWallets: {
					createOnLogin: 'users-without-wallets',
				},
				supportedChains: wagmiConfig.chains,
			}}
		>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={wagmiConfig}>
					<PrivyMarketplaceProviders
						config={{
							...sdkConfig,
							_internal: {
								overrides: getOverrides(sdkConfig),
							},
						}}
						marketplaceConfig={marketplaceConfig}
					>
						{children}
					</PrivyMarketplaceProviders>
				</WagmiProvider>
			</QueryClientProvider>
		</PrivyProvider>
	);
}

function PrivyMarketplaceProviders({
	config,
	children,
}: {
	config: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider>
			<ToastProvider>
				<MarketplaceProvider config={config}>
					<LinkProvider LinkComponent={ReactRouterLinkAdapter}>
						<NuqsAdapter>
							{children}
							<ReactQueryDevtools initialIsOpen={false} />
							<ModalProvider />
						</NuqsAdapter>
					</LinkProvider>
				</MarketplaceProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}