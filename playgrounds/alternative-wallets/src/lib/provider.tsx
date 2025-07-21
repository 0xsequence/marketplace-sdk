import { SequenceConnectProvider } from '@0xsequence/connect';
import { ToastProvider } from '@0xsequence/design-system';
import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	getQueryClient,
	getWagmiChainsAndTransports,
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import {
	DynamicContextProvider,
	useDynamicContext,
} from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { useQuery } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { type ReactNode, useState } from 'react';
import { useMarketplace } from 'shared-components';
import { createConfig, WagmiProvider } from 'wagmi';

interface ProvidersProps {
	children: ReactNode;
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

	return (
		<InnerProviders marketplaceConfig={marketplaceConfig} sdkConfig={sdkConfig}>
			{children}
		</InnerProviders>
	);
}

function InnerProviders({
	children,
	marketplaceConfig,
	sdkConfig,
}: {
	children: ReactNode;
	marketplaceConfig: MarketplaceConfig;
	sdkConfig: SdkConfig;
}) {
	const [wagmiConfig] = useState(() => {
		return createConfig({
			...getWagmiChainsAndTransports({ marketplaceConfig, sdkConfig }),
			multiInjectedProviderDiscovery: false,
		});
	});

	return (
		<NuqsAdapter>
			<MarketplaceQueryClientProvider>
				<DynamicContextProvider
					settings={{
						environmentId: '188fb018-f282-4adf-bf24-fce8c0f1f2c7',
						walletConnectors: [EthereumWalletConnectors],
					}}
				>
					<WagmiProvider config={wagmiConfig}>
						<DynamicWagmiConnector>
							<SequenceProviders sdkConfig={sdkConfig}>
								{children}
							</SequenceProviders>
						</DynamicWagmiConnector>
					</WagmiProvider>
				</DynamicContextProvider>
			</MarketplaceQueryClientProvider>
		</NuqsAdapter>
	);
}

interface SequenceProvidersProps {
	sdkConfig: SdkConfig;
	children: ReactNode;
}

function SequenceProviders({ sdkConfig, children }: SequenceProvidersProps) {
	const { setShowAuthFlow } = useDynamicContext();
	const openWallet = () => setShowAuthFlow(true);

	return (
		<SequenceConnectProvider
			config={{
				projectAccessKey: sdkConfig.projectAccessKey,
			}}
		>
			<ToastProvider>
				<MarketplaceProvider config={sdkConfig} openConnectModal={openWallet}>
					{children}
					<ModalProvider />
				</MarketplaceProvider>
			</ToastProvider>
		</SequenceConnectProvider>
	);
}
