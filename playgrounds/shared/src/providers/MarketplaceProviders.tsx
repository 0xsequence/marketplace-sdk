'use client';
import {
	type ConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ToastProvider } from '@0xsequence/design-system';
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
import { DEFAULT_ENV } from '../consts';

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
	const processedConfig = {
		...config,
		_internal: {
			overrides: {
				...config._internal?.overrides,
				api: {
					...config._internal?.overrides?.api,
					builder: config._internal?.overrides?.api?.builder || {
						env: DEFAULT_ENV,
					},
					marketplace: config._internal?.overrides?.api?.marketplace,
					metadata: config._internal?.overrides?.api?.metadata || {
						env: DEFAULT_ENV,
					},
					indexer: config._internal?.overrides?.api?.indexer || {
						env: DEFAULT_ENV,
					},
					sequenceApi: config._internal?.overrides?.api?.sequenceApi || {
						env: DEFAULT_ENV,
					},
					sequenceWallet: config._internal?.overrides?.api?.sequenceWallet || {
						env: DEFAULT_ENV,
					},
					nodeGateway: config._internal?.overrides?.api?.nodeGateway || {
						env: DEFAULT_ENV,
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
		env: {
			metadataUrl:
				config._internal?.overrides?.api?.metadata?.url ||
				DEFAULT_ENV === 'development'
					? 'https://dev-metadata.sequence.app'
					: 'https://metadata.sequence.app',
			indexerGatewayUrl:
				config._internal?.overrides?.api?.indexer?.url ||
				DEFAULT_ENV === 'development'
					? 'https://dev-indexer.sequence.app'
					: 'https://indexer.sequence.app',
			apiUrl:
				config._internal?.overrides?.api?.sequenceApi?.url ||
				DEFAULT_ENV === 'development'
					? 'https://dev-api.sequence.app'
					: 'https://api.sequence.app',
			builderUrl:
				config._internal?.overrides?.api?.builder?.url ||
				DEFAULT_ENV === 'development'
					? 'https://dev-api.sequence.build'
					: 'https://api.sequence.build',
			indexerUrl:
				config._internal?.overrides?.api?.indexer?.url ||
				DEFAULT_ENV === 'development'
					? 'https://dev-indexer.sequence.app'
					: 'https://indexer.sequence.app',
		},
	};

	const [wagmiConfig] = useState(
		createWagmiConfig(marketplaceConfig, processedConfig, !!initialState),
	);

	return (
		<LinkProvider LinkComponent={LinkComponent}>
			<NuqsAdapter>
				<WagmiProvider config={wagmiConfig} initialState={initialState?.wagmi}>
					<MarketplaceQueryClientProvider>
						<SequenceHooksProvider config={connectConfig}>
							<SequenceConnectProvider config={connectConfig}>
								<ToastProvider>
									<MarketplaceProvider config={processedConfig}>
										{children}
										<ReactQueryDevtools initialIsOpen={false} />
										<ModalProvider />
									</MarketplaceProvider>
								</ToastProvider>
							</SequenceConnectProvider>
						</SequenceHooksProvider>
					</MarketplaceQueryClientProvider>
				</WagmiProvider>
			</NuqsAdapter>
		</LinkProvider>
	);
}
