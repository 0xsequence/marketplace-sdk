import {
	createConfig as createSequenceConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { http, WagmiProvider } from 'wagmi';
import { MarketplaceProvider } from '../src/react/provider';
import { ModalProvider } from '../src/react/ui/modals/modal-provider';
import '../src/index.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import {
	createTestQueryClient,
	sequenceConnectConfig,
	wagmiConfig,
} from '../test/test-utils';
import { ConnectionStatus } from './ConnectionStatus';

const testQueryClient = createTestQueryClient();

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
