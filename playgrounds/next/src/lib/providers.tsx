'use client';

import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
	type ConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	createWagmiConfig,
	getQueryClient,
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
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
	) : null;
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
	const connectConfig: ConnectConfig = {
		projectAccessKey: config.projectAccessKey,
		signIn: {
			projectName: marketplaceConfig.settings.title,
			descriptiveSocials: true,
		},
	};

	const [wagmiConfig] = useState(
		createWagmiConfig(marketplaceConfig, config, !!initialState),
	);

	return (
		<ThemeProvider>
			<WagmiProvider config={wagmiConfig} initialState={initialState?.wagmi}>
				<MarketplaceQueryClientProvider>
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
				</MarketplaceQueryClientProvider>
			</WagmiProvider>
		</ThemeProvider>
	);
};
