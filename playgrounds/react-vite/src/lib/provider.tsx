'use client';

import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
	type ConnectConfig,
	DEBUG,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
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
import { SEQUENCE_HOOKS_CONFIG, useMarketplace } from 'shared-components';
import { type State, WagmiProvider } from 'wagmi';
import { SequenceHooksProvider } from '@0xsequence/react-hooks';

interface ProvidersProps {
	children: React.ReactNode;
	initialState?: {
		wagmi?: State;
	};
}

export default function Providers({ children }: ProvidersProps) {
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

	if (!sdkConfig.projectAccessKey || sdkConfig.projectAccessKey === '') {
		return <div>Please set a valid project access key</div>;
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
	const connectConfig: ConnectConfig = {
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
					<SequenceHooksProvider value={SEQUENCE_HOOKS_CONFIG}>
						<SequenceConnectProvider config={connectConfig}>
							<SequenceCheckoutProvider>
								<ToastProvider>
									<MarketplaceProvider config={config}>
										{children}
										<ReactQueryDevtools initialIsOpen={false} />
										<ModalProvider />
									</MarketplaceProvider>
								</ToastProvider>
							</SequenceCheckoutProvider>
						</SequenceConnectProvider>
					</SequenceHooksProvider>
				</MarketplaceQueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
};
