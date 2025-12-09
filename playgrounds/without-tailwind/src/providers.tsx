'use client';

import {
	type ConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import {
	createWagmiConfig,
	getQueryClient,
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { sdkConfig } from './sdkConfig';

export function Providers({ children }: { children: React.ReactNode }) {
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
		<InnerProviders marketplaceConfig={marketplaceConfig}>
			{children}
		</InnerProviders>
	);
}

const InnerProviders = ({
	children,
	marketplaceConfig,
}: {
	children: React.ReactNode;
	marketplaceConfig: MarketplaceConfig;
}) => {
	const connectConfig: ConnectConfig = {
		projectAccessKey: sdkConfig.projectAccessKey,
		signIn: {
			projectName: marketplaceConfig.settings.title,
		},
	};

	const [wagmiConfig] = useState(
		createWagmiConfig(marketplaceConfig, sdkConfig),
	);

	return (
		<ChakraProvider value={defaultSystem}>
			<WagmiProvider config={wagmiConfig}>
				<MarketplaceQueryClientProvider>
					<SequenceConnectProvider config={connectConfig}>
						<MarketplaceProvider config={sdkConfig}>
							{children}
							<ModalProvider />
						</MarketplaceProvider>
					</SequenceConnectProvider>
				</MarketplaceQueryClientProvider>
			</WagmiProvider>
		</ChakraProvider>
	);
};
