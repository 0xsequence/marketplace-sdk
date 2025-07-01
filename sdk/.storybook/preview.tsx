import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
	createConfig as createSequenceConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { mainnet, polygon } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { MarketplaceProvider } from '../src/react/provider';

import '../src/index.css';

initialize();

import { handlers as marketplaceConfigHandlers } from '../src/react/_internal/api/__mocks__/builder.msw';
import { handlers as indexerHandlers } from '../src/react/_internal/api/__mocks__/indexer.msw';
import { laosHandlers } from '../src/react/_internal/api/__mocks__/laos.msw';

import { handlers as marketplaceHandlers } from '../src/react/_internal/api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../src/react/_internal/api/__mocks__/metadata.msw';

// Create a test QueryClient for Storybook
const createStorybookQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 1000 * 60 * 5, // 5 minutes for Storybook
			},
		},
	});

// Test account for mock connector
const TEST_ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const;

// Create wagmi config for Storybook
const mockConnector = mock({
	accounts: [TEST_ACCOUNT],
	features: {
		reconnect: true,
	},
});

const wagmiConfig = createConfig({
	chains: [mainnet, polygon],
	connectors: [mockConnector],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
	},
	multiInjectedProviderDiscovery: false,
	ssr: false,
});

// Create Sequence Connect config for Storybook
const sequenceConnectConfig = createSequenceConnectConfig('universal', {
	projectAccessKey: 'test-storybook-key',
	chainIds: [1, 137],
	defaultChainId: 1,
	appName: 'Storybook Demo',
});

// Marketplace SDK config for Storybook
const marketplaceConfig = {
	projectAccessKey: 'test-storybook-key',
	projectId: 'test-storybook-project',
};

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		msw: {
			handlers: [
				...marketplaceHandlers,
				...metadataHandlers,
				...indexerHandlers,
				...marketplaceConfigHandlers,
				...laosHandlers,
			],
		},
	},
	decorators: [
		(Story) => {
			const queryClient = createStorybookQueryClient();

			// Auto-connect wallet in Storybook
			React.useEffect(() => {
				const connectWallet = async () => {
					const { getConnectors, connect } = await import('wagmi/actions');
					const connectorList = getConnectors(wagmiConfig);
					const connector = connectorList[0];
					if (connector) {
						await connect(wagmiConfig, { connector });
					}
				};
				connectWallet();
			}, []);

			return (
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={queryClient}>
						<SequenceConnectProvider
							config={sequenceConnectConfig.connectConfig}
						>
							<ThemeProvider>
								<SequenceCheckoutProvider>
									<MarketplaceProvider config={marketplaceConfig}>
										<div style={{ padding: '1rem', minHeight: '100vh' }}>
											<Story />
										</div>
									</MarketplaceProvider>
								</SequenceCheckoutProvider>
							</ThemeProvider>
						</SequenceConnectProvider>
					</QueryClientProvider>
				</WagmiProvider>
			);
		},
	],
	loaders: [mswLoader],
};

export default preview;
