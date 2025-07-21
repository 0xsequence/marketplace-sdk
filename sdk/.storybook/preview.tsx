import { createConfig, SequenceConnectProvider } from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
import type { Preview } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { MarketplaceProvider } from '../src/react/provider';
import { ModalProvider } from '../src/react/ui/modals/modal-provider';
import '../src/index.css';
import { SequenceHooksProvider } from '@0xsequence/hooks';
import { initialize, mswLoader } from 'msw-storybook-addon';
import {
	createTestQueryClient,
	wagmiConfig,
	wagmiConfigEmbedded,
	wagmiConfigSequence,
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

// Get wagmi config based on localStorage
const getWagmiConfig = () => {
	if (typeof window === 'undefined') {
		return wagmiConfig; // Default for SSR
	}

	const storedConnector = localStorage.getItem('storybook-connector');
	const connectorType = storedConnector || 'auto';

	switch (connectorType) {
		case 'waas':
			console.log('Using WaaS connector configuration');
			return wagmiConfigEmbedded;
		case 'sequence':
			console.log('Using Sequence connector configuration');
			return wagmiConfigSequence;
		default:
			console.log('Using standard mock connector configuration');
			return wagmiConfig;
	}
};

const getSequenceConnectConfig = () => {
	const universalConfig = createConfig('universal', {
		projectAccessKey: 'AQAAAAAAAJ8-dPLJeoLPM1shcONlQ24wjjY',
		defaultChainId: 1,
		appName: 'Demo Dapp',
	});
	const waasConfig = createConfig('waas', {
		waasConfigKey:
			'eyJwcm9qZWN0SWQiOjQxMDk0LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
		projectAccessKey: 'AQAAAAAAAJ8-dPLJeoLPM1shcONlQ24wjjY',
		defaultChainId: 1,
		appName: 'Demo Dapp',
	});

	if (typeof window === 'undefined') {
		return universalConfig;
	}

	const storedConnector = localStorage.getItem('storybook-connector');
	const connectorType = storedConnector || 'auto';

	switch (connectorType) {
		case 'waas':
			return waasConfig;
		case 'sequence':
			return universalConfig;
		default:
			return universalConfig;
	}
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
			const currentWagmiConfig = getWagmiConfig();
			const sequenceConnectConfig = getSequenceConnectConfig();

			return (
				<WagmiProvider config={currentWagmiConfig}>
					<QueryClientProvider client={testQueryClient}>
						<SequenceHooksProvider config={sequenceConnectConfig.connectConfig}>
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
						</SequenceHooksProvider>
					</QueryClientProvider>
				</WagmiProvider>
			);
		},
	],
};

export default preview;
