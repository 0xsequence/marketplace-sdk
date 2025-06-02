'use client';

import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
	type ConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import {
	Button,
	ThemeProvider,
	ToastProvider,
} from '@0xsequence/design-system';
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
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { useMarketplace } from 'shared-components';
import { type State, WagmiProvider } from 'wagmi';

interface ProvidersProps {
	children: React.ReactNode;
	initialState?: {
		wagmi?: State;
	};
}

export default function Providers({ children }: ProvidersProps) {
	const { sdkConfig, resetSettings } = useMarketplace();
	const queryClient = getQueryClient();
	const { data: marketplaceConfig, isLoading } = useQuery(
		marketplaceConfigOptions(sdkConfig),
		queryClient,
	);

	if (isLoading) {
		return <div>Loading configuration...</div>;
	}

	if (!marketplaceConfig) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
				<div className="text-center">
					<h2 className="mb-2 font-semibold text-lg text-negative">
						Failed to load marketplace configuration
					</h2>
					<p className="mb-4 text-text-50">
						This might be caused by invalid configuration overrides.
					</p>
					<Button
						label="Clear Overrides & Retry"
						variant="primary"
						onClick={() => {
							resetSettings();
							window.location.reload();
						}}
					/>
				</div>
			</div>
		);
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
			projectName: marketplaceConfig.settings.title,
			descriptiveSocials: true,
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
					<SequenceHooksProvider config={connectConfig}>
						<SequenceConnectProvider config={connectConfig}>
							<SequenceCheckoutProvider>
								<ToastProvider>
									<MarketplaceProvider config={config}>
										<NuqsAdapter>
											{children}
											<ReactQueryDevtools initialIsOpen={false} />
											<ModalProvider />
										</NuqsAdapter>
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
