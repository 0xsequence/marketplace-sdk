import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import { SequenceConnectProvider } from '@0xsequence/connect';
import { ThemeProvider, ToastProvider } from '@0xsequence/design-system';
import {
	MarketplaceProvider,
	MarketplaceQueryClientProvider,
	ModalProvider,
} from '@0xsequence/marketplace-sdk/react';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import {
	DynamicContextProvider,
	DynamicWidget,
	useDynamicContext,
} from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { useState } from 'react';
import { createConfig, WagmiProvider } from 'wagmi';
import {
	getWagmiChainsAndTransports,
	type MarketplaceConfig,
	type SdkConfig,
} from '../../../../sdk/src';

export const InnerProviders = ({
	sdkConfig,
	marketplaceConfig,
	children,
}: {
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	children: React.ReactNode;
}) => {
	return (
		<ThemeProvider>
			<DynamicContextProvider
				settings={{
					environmentId: '188fb018-f282-4adf-bf24-fce8c0f1f2c7',
					walletConnectors: [EthereumWalletConnectors], // TODO: What do they expect, here?
				}}
			>
				<InnerProviders2
					sdkConfig={sdkConfig}
					marketplaceConfig={marketplaceConfig}
				>
					{children}
				</InnerProviders2>
			</DynamicContextProvider>
		</ThemeProvider>
	);
};

export const InnerProviders2 = ({
	sdkConfig,
	marketplaceConfig,
	children,
}: {
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	children: React.ReactNode;
}) => {
	const [wagmiConfig] = useState(
		createConfig({
			...getWagmiChainsAndTransports({ marketplaceConfig, sdkConfig }),
			multiInjectedProviderDiscovery: false,
		}),
	);

	const { setShowAuthFlow } = useDynamicContext();

	const openWallet = () => {
		setShowAuthFlow(true);
	};

	return (
		<WagmiProvider config={wagmiConfig}>
			<MarketplaceQueryClientProvider>
				<DynamicWagmiConnector>
					<SequenceConnectProvider
						config={{
							projectAccessKey: sdkConfig.projectAccessKey,
						}}
					>
						<SequenceCheckoutProvider>
							<ToastProvider>
								<MarketplaceProvider
									config={sdkConfig}
									openConnectModal={openWallet}
								>
									{children}
									<ModalProvider />
									<DynamicWidget />
								</MarketplaceProvider>
							</ToastProvider>
						</SequenceCheckoutProvider>
					</SequenceConnectProvider>
				</DynamicWagmiConnector>
			</MarketplaceQueryClientProvider>
		</WagmiProvider>
	);
};
