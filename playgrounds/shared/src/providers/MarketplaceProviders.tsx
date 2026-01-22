'use client';
import { SequenceConnectProvider } from '@0xsequence/connect';
import { SequenceHooksProvider } from '@0xsequence/hooks';
import type {
	CheckoutMode,
	MarketplaceConfig,
	SdkConfig,
} from '@0xsequence/marketplace-sdk';
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
import { useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { type State, WagmiProvider } from 'wagmi';
import { hashFn } from 'wagmi/query';
import type { AppLinkProps } from '../components/ui/AppLink';
import { LinkProvider } from '../components/ui/LinkProvider';
import { DEFAULT_ENV } from '../consts';
import type { CheckoutModeOverride } from '../store';
import {
	createConnectConfig,
	createProcessedSdkConfig,
} from '../utils/environmentOverrides';

function resolveCheckoutMode(
	override: CheckoutModeOverride,
	isTrailsEnabled: boolean,
): CheckoutMode {
	if (override !== undefined) {
		return override;
	}
	return isTrailsEnabled ? 'trails' : 'crypto';
}

export interface MarketplaceProvidersProps {
	config: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	checkoutModeOverride?: CheckoutModeOverride;
	children: ReactNode;
	initialState?: { wagmi?: State };
	LinkComponent: ComponentType<AppLinkProps>;
	NuqsAdapter: ComponentType<{ children: ReactNode }>;
}

export function MarketplaceProviders({
	config,
	marketplaceConfig,
	checkoutModeOverride,
	children,
	initialState,
	LinkComponent,
	NuqsAdapter,
}: MarketplaceProvidersProps) {
	const checkoutMode = useMemo(
		() =>
			resolveCheckoutMode(
				checkoutModeOverride,
				marketplaceConfig.settings.isTrailsEnabled,
			),
		[checkoutModeOverride, marketplaceConfig.settings.isTrailsEnabled],
	);

	const configWithCheckoutMode = useMemo(
		() => ({
			...config,
			checkoutMode,
		}),
		[config, checkoutMode],
	);

	const processedConfig = createProcessedSdkConfig(
		configWithCheckoutMode,
		DEFAULT_ENV,
	);
	const connectConfig = createConnectConfig(
		configWithCheckoutMode,
		marketplaceConfig.settings.title,
		DEFAULT_ENV,
	);

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
