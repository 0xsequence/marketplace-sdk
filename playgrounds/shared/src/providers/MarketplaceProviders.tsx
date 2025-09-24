'use client';
import {
	type ConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { SequenceHooksProvider } from '@0xsequence/hooks';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	createWagmiConfig,
	MarketplaceProvider,
	ModalProvider,
} from '@0xsequence/marketplace-sdk/react';
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { type State, WagmiProvider } from 'wagmi';
import { hashFn } from 'wagmi/query';
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
	};

	const [wagmiConfig] = useState(
		createWagmiConfig(marketplaceConfig, processedConfig, !!initialState),
	);

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						queryKeyHashFn: hashFn,
					},
				},
				queryCache: new QueryCache({
					onError: (error) => {
						const message =
							error instanceof Error ? error.message : 'An error occurred';
						toast.error(message);
						console.error('Query error:', error);
					},
				}),
				mutationCache: new MutationCache({
					onError: (error) => {
						const message =
							error instanceof Error ? error.message : 'An error occurred';
						toast.error(message);
						console.error('Mutation error:', error);
					},
				}),
			}),
	);

	return (
		<LinkProvider LinkComponent={LinkComponent}>
			<NuqsAdapter>
				<WagmiProvider config={wagmiConfig} initialState={initialState?.wagmi}>
					<QueryClientProvider client={queryClient}>
						<SequenceHooksProvider config={connectConfig}>
							<SequenceConnectProvider config={connectConfig}>
								<MarketplaceProvider config={processedConfig}>
									<Toaster
										position="bottom-left"
										theme="dark"
										closeButton
										expand={false}
									/>
									{children}
									<ReactQueryDevtools initialIsOpen={false} />
									<ModalProvider />
								</MarketplaceProvider>
							</SequenceConnectProvider>
						</SequenceHooksProvider>
					</QueryClientProvider>
				</WagmiProvider>
			</NuqsAdapter>
		</LinkProvider>
	);
}
