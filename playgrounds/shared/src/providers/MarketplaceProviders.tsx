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
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
} from '@0xsequence/marketplace-sdk/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import type { AppLinkProps } from '../components/ui/AppLink';
import { LinkProvider } from '../components/ui/LinkProvider';

export interface MarketplaceProvidersProps {
	config: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	children: ReactNode;
	initialState?: { wagmi?: State };
	// Framework-specific components
	LinkComponent: ComponentType<AppLinkProps>;
	NuqsAdapter: ComponentType<{ children: ReactNode }>;
}

export function MarketplaceProviders({
	config,
	marketplaceConfig,
	children,
	initialState,
	LinkComponent,
	NuqsAdapter,
}: MarketplaceProvidersProps) {
	// Apply complex API overrides (React Vite pattern, now unified)
	const processedConfig = {
		...config,
		_internal: {
			overrides: {
				...config._internal?.overrides,
				api: {
					...config._internal?.overrides?.api,
					builder: config._internal?.overrides?.api?.builder || {
						env: 'production',
					},
					marketplace: config._internal?.overrides?.api?.marketplace,
					metadata: config._internal?.overrides?.api?.metadata || {
						env: 'production',
					},
					indexer: config._internal?.overrides?.api?.indexer || {
						env: 'production',
					},
					sequenceApi: config._internal?.overrides?.api?.sequenceApi || {
						env: 'production',
					},
					sequenceWallet: config._internal?.overrides?.api?.sequenceWallet || {
						env: 'production',
					},
					nodeGateway: config._internal?.overrides?.api?.nodeGateway || {
						env: 'production',
					},
				},
			},
		},
	};

	const connectConfig: ConnectConfig = {
		projectAccessKey: processedConfig.projectAccessKey,
		signIn: {
			projectName: marketplaceConfig.settings.title,
			descriptiveSocials: true,
		},
	};

	const [wagmiConfig] = useState(
		createWagmiConfig(marketplaceConfig, processedConfig, !!initialState),
	);

	return (
		<LinkProvider LinkComponent={LinkComponent}>
			<NuqsAdapter>
				<ThemeProvider>
					<WagmiProvider
						config={wagmiConfig}
						initialState={initialState?.wagmi}
					>
						<MarketplaceQueryClientProvider>
							<SequenceHooksProvider config={connectConfig}>
								<SequenceConnectProvider config={connectConfig}>
									<SequenceCheckoutProvider>
										<ToastProvider>
											<MarketplaceProvider config={processedConfig}>
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
			</NuqsAdapter>
		</LinkProvider>
	);
}
