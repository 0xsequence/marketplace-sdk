'use client';

import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	getQueryClient,
	getWagmiChainsAndTransports,
	MarketplaceProvider,
	ModalProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { createConfig, WagmiProvider } from '@privy-io/wagmi';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { useMemo } from 'react';
import { getOverrides, LinkProvider, useMarketplace } from 'shared-components';
import { ReactRouterLinkAdapter } from '../components/routing/ReactRouterAdapters';
import { PrivyWalletConnectionProvider } from '../components/PrivyWalletConnectionProvider';

interface ProvidersProps {
	children: React.ReactNode;
}

function createPrivyWagmiConfig(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
) {
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
		queryClient,
	);

	const wagmiConfig = useMemo(() => {
		if (!marketplaceConfig) return null;
		return createPrivyWagmiConfig(marketplaceConfig, sdkConfig);
	}, [marketplaceConfig, sdkConfig]);

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
				<PrivyWalletConnectionProvider>
					<MarketplaceProvider config={config}>
						<LinkProvider LinkComponent={ReactRouterLinkAdapter}>
							<NuqsAdapter>
								{children}
								<ReactQueryDevtools initialIsOpen={false} />
								<ModalProvider />
							</NuqsAdapter>
						</LinkProvider>
					</MarketplaceProvider>
				</PrivyWalletConnectionProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}
