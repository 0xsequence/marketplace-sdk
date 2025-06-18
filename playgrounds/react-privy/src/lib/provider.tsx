'use client';

import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from '@privy-io/wagmi';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	MarketplaceProvider,
	ModalProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { DEFAULT_DEV_MARKETPLACE_URL, useMarketplace } from 'shared-components';
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { sepolia, mainnet, polygon, polygonAmoy } from 'wagmi/chains';

interface ProvidersProps {
	children: React.ReactNode;
}

// Create a query client for React Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60, // 1 minute
			refetchOnWindowFocus: false,
		},
	},
});

// Create wagmi config with Privy integration
const wagmiConfig = createConfig({
	chains: [mainnet, polygon, sepolia, polygonAmoy],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
		[sepolia.id]: http(),
		[polygonAmoy.id]: http(),
	},
});

export default function Providers({ children }: ProvidersProps) {
	return (
		<PrivyProvider
			appId="cmc07riml000dju0nlcxdpd70"
			config={{
				loginMethods: ['email', 'wallet', 'google', 'twitter'],
				appearance: {
					theme: 'light',
					accentColor: '#676FFF',
				},
				embeddedWallets: {
					createOnLogin: 'users-without-wallets',
				},
				supportedChains: [mainnet, polygon, sepolia, polygonAmoy],
			}}
		>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={wagmiConfig}>
					<InnerProviders>{children}</InnerProviders>
				</WagmiProvider>
			</QueryClientProvider>
		</PrivyProvider>
	);
}

function InnerProviders({ children }: { children: React.ReactNode }) {
	const { sdkConfig } = useMarketplace();
	const { data: marketplaceConfig, isLoading } = useQuery(
		marketplaceConfigOptions(sdkConfig),
	);

	if (isLoading) {
		return <div>Loading configuration...</div>;
	}

	if (!marketplaceConfig) {
		return <div>Failed to load marketplace configuration</div>;
	}

	if (!sdkConfig.projectAccessKey || sdkConfig.projectAccessKey === '') {
		return <div>Please set a valid project access key</div>;
	}

	return (
		<ApplicationProviders
			config={{
				...sdkConfig,
				_internal: {
					overrides: {
						...sdkConfig._internal?.overrides,
						api: {
							...sdkConfig._internal?.overrides?.api,
							builder: sdkConfig._internal?.overrides?.api?.builder || {
								env: 'production',
							},
							marketplace: {
								...sdkConfig._internal?.overrides?.api?.marketplace,
								url: DEFAULT_DEV_MARKETPLACE_URL,
							},
							metadata: sdkConfig._internal?.overrides?.api?.metadata || {
								env: 'production',
							},
							indexer: sdkConfig._internal?.overrides?.api?.indexer || {
								env: 'production',
							},
							sequenceApi: sdkConfig._internal?.overrides?.api?.sequenceApi || {
								env: 'production',
							},
							sequenceWallet: sdkConfig._internal?.overrides?.api
								?.sequenceWallet || {
								env: 'production',
							},
							nodeGateway: sdkConfig._internal?.overrides?.api?.nodeGateway || {
								env: 'production',
							},
						},
					},
				},
			}}
			marketplaceConfig={marketplaceConfig}
		>
			{children}
		</ApplicationProviders>
	);
}

const ApplicationProviders = ({
	config,
	marketplaceConfig,
	children,
}: ProvidersProps & {
	config: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
}) => {
	return (
		<ThemeProvider>
			<ToastProvider>
				<MarketplaceProvider config={config}>
					<NuqsAdapter>
						{children}
						<ReactQueryDevtools initialIsOpen={false} />
						<ModalProvider />
					</NuqsAdapter>
				</MarketplaceProvider>
			</ToastProvider>
		</ThemeProvider>
	);
};
