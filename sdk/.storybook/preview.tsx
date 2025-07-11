import { SequenceConnectProvider } from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
import type { Preview } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { mainnet as wagmiMainnet, polygon as wagmiPolygon } from 'viem/chains';
import { createConfig, http, mock, WagmiProvider } from 'wagmi';
import { MarketplaceProvider } from '../src/react/provider';
import { ModalProvider } from '../src/react/ui/modals/modal-provider';
import '../src/index.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { TEST_ACCOUNTS } from '../test/const';
import {
	createTestQueryClient,
	sequenceConnectConfig,
} from '../test/test-utils';
import { ConnectionStatus } from './ConnectionStatus';

const testQueryClient = createTestQueryClient();

const mainnet = {
	...wagmiMainnet,
	rpcUrls: { default: { http: ['http://127.0.0.1:8545'] } },
};

const polygon = {
	...wagmiPolygon,
	rpcUrls: { default: { http: ['http://127.0.0.1:8545'] } },
};

const mockConnector = mock({
	accounts: [TEST_ACCOUNTS[0]],
	features: {
		defaultConnected: true,
		reconnect: true,
	},
});

const wagmiConfigObj = {
	chains: [mainnet, polygon],
	connectors: [mockConnector],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
	},
	multiInjectedProviderDiscovery: false,
} as const;

export const wagmiConfig = createConfig(wagmiConfigObj);

// Initialize MSW
initialize({
	onUnhandledRequest: ({ url, method }) => {
		// Only warn about unhandled requests to our specific API paths
		const pathname = new URL(url).pathname;
		if (pathname.startsWith('/rpc/')) {
			console.warn(`Unhandled ${method} request to ${url}.`);
		}
		// Bypass all other requests (fonts, static assets, etc.)
	},
});

// Mock marketplace SDK config for Storybook
const mockSdkConfig = {
	projectAccessKey: 'storybook-test-key',
	projectId: '1',
};

const preview: Preview = {
	parameters: {
		backgrounds: {
			options: {
				dark: { name: 'Dark', value: '#333' },
				light: { name: 'Light', value: '#F7F9F2' },
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	initialGlobals: {
		backgrounds: { value: 'dark' },
	},
	loaders: [mswLoader],
	decorators: [
		(Story) => {
			return (
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={testQueryClient}>
						<SequenceConnectProvider
							config={sequenceConnectConfig.connectConfig}
						>
							<ThemeProvider>
								<MarketplaceProvider config={mockSdkConfig}>
									<ConnectionStatus />
									<div style={{ padding: '1rem', minHeight: '100vh' }}>
										<Story />
									</div>
									<ModalProvider />
								</MarketplaceProvider>
							</ThemeProvider>
						</SequenceConnectProvider>
					</QueryClientProvider>
				</WagmiProvider>
			);
		},
	],
};

export default preview;
