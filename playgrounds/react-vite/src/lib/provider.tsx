'use client';

import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
	type ConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import { SequenceHooksProvider } from '@0xsequence/hooks';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	createWagmiConfig,
	getQueryClient,
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { useMarketplace, LinkProvider } from 'shared-components';
import { AppLink } from '../components/ui/AppLink';
import { type State, WagmiProvider } from 'wagmi';

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
							marketplace: sdkConfig._internal?.overrides?.api?.marketplace,
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
		<LinkProvider LinkComponent={AppLink}>
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
		</LinkProvider>
	);
};
