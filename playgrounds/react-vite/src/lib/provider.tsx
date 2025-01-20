'use client';

import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import '@0xsequence/design-system/styles.css';
import { type KitConfig, KitProvider } from '@0xsequence/kit';
import { KitCheckoutProvider } from '@0xsequence/kit-checkout';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
	createWagmiConfig,
	getQueryClient,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type State, WagmiProvider } from 'wagmi';
import {
	MarketplaceProvider as PlaygroundProvider,
	useMarketplace,
} from './MarketplaceContext';

interface ProvidersProps {
	children: React.ReactNode;
	initialState?: {
		wagmi?: State;
	};
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<PlaygroundProvider>
			<ConfigurationProvider>{children}</ConfigurationProvider>
		</PlaygroundProvider>
	);
}

function ConfigurationProvider({ children }: ProvidersProps) {
	const { sdkConfig } = useMarketplace();
	const queryClient = getQueryClient();
	const { data: marketplaceConfig, isLoading } = useQuery(
		marketplaceConfigOptions(sdkConfig),
		queryClient,
	);

	if (isLoading) {
		return <div>Loading configuration...</div>;
	}

	if (!marketplaceConfig) {
		return <div>Failed to load marketplace configuration</div>;
	}

	return (
		<ApplicationProviders
			config={sdkConfig}
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
	initialState,
}: ProvidersProps & {
	config: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
}) => {
	const kitConfig: KitConfig = {
		projectAccessKey: config.projectAccessKey,
		signIn: {
			projectName: marketplaceConfig.title,
		},
	};

	const wagmiConfig = createWagmiConfig(
		marketplaceConfig,
		config,
		!!initialState,
	);

	return (
		<ThemeProvider>
			<WagmiProvider config={wagmiConfig} initialState={initialState?.wagmi}>
				<MarketplaceQueryClientProvider>
					<KitProvider config={kitConfig}>
						<KitCheckoutProvider>
							<ToastProvider>
								<MarketplaceProvider config={config}>
									{children}
									<ReactQueryDevtools initialIsOpen={false} />
									<ModalProvider />
								</MarketplaceProvider>
							</ToastProvider>
						</KitCheckoutProvider>
					</KitProvider>
				</MarketplaceQueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
};
