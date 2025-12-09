import { SequenceConnectProvider } from '@0xsequence/connect';
import type { Preview } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider } from 'wagmi';
import { MarketplaceProvider } from '../src/react/providers';
import { ModalProvider } from '../src/react/providers/modal-provider';
import '../src/styles/index.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import {
	createTestQueryClient,
	sequenceConnectConfig,
	wagmiConfig,
	wagmiConfigEmbedded,
	wagmiConfigSequence,
} from '../test/test-utils';
import { ConnectionStatus } from './ConnectionStatus';

const testQueryClient = createTestQueryClient();

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

const mockSdkConfig = {
	projectAccessKey: 'storybook-test-key',
	projectId: '1',
};

const getWagmiConfig = () => {
	if (typeof window === 'undefined') {
		return wagmiConfig;
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

			return (
				<WagmiProvider config={currentWagmiConfig}>
					<QueryClientProvider client={testQueryClient}>
						<SequenceConnectProvider
							config={sequenceConnectConfig.connectConfig}
						>
							<MarketplaceProvider config={mockSdkConfig}>
								<ConnectionStatus />
								<div style={{ padding: '1rem', minHeight: '100vh' }}>
									<Story />
								</div>
								<ModalProvider />
							</MarketplaceProvider>
						</SequenceConnectProvider>
					</QueryClientProvider>
				</WagmiProvider>
			);
		},
	],
};

export default preview;
