import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
	SequenceConnect,
	createConfig as createSequenceConnectConfig,
} from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { setupServer } from 'msw/node';
import type { ReactElement } from 'react';
import {
	type Client,
	createTestClient,
	publicActions,
	walletActions,
} from 'viem';
import { mainnet as wagmiMainet, polygon as wagmiPolygon } from 'viem/chains';
import { http, type Config, WagmiProvider, createConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { handlers as indexerHandlers } from '../src/react/_internal/api/__mocks__/indexer.msw';
import { handlers as marketplaceHandlers } from '../src/react/_internal/api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../src/react/_internal/api/__mocks__/metadata.msw';
import { handlers as marketplaceConfigHandlers } from '../src/react/hooks/options/__mocks__/marketplaceConfig.msw';
import { TEST_ACCOUNTS, TEST_CHAIN, TEST_PRIVATE_KEYS } from './const';

const tickHandler = mswHttp.post(
	'https://nodes.sequence.app/rpc/Databeat/Tick',
	() => {
		return HttpResponse.json({});
	},
);

export const server = setupServer(
	...marketplaceHandlers,
	...metadataHandlers,
	...indexerHandlers,
	...marketplaceConfigHandlers,
	tickHandler,
);

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 0,
			},
		},
	});

export const testClient = createTestClient({
	transport: http(),
	chain: TEST_CHAIN,
	mode: 'anvil',
	account: TEST_ACCOUNTS[0],
	key: TEST_PRIVATE_KEYS[0],
	pollingInterval: 100,
})
	.extend(publicActions)
	.extend(walletActions) satisfies Client;

const mainnet = {
	...wagmiMainet,
	rpcUrls: { default: { http: ['http://127.0.0.1:8545/1'] } },
};

const polygon = {
	...wagmiPolygon,
	rpcUrls: { default: { http: ['http://127.0.0.1:8545/1'] } },
};

export const wagmiConfig = createConfig({
	chains: [mainnet, polygon],
	connectors: [
		mock({
			accounts: [TEST_ACCOUNTS[0]],
			features: {
				defaultConnected: true,
				reconnect: true,
			},
		}),
	],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
	},
	multiInjectedProviderDiscovery: false,
});

type Options = Omit<RenderOptions, 'wrapper'> & {
	wagmiConfig?: Config;
};

function renderWithClient(ui: ReactElement, options?: Options) {
	const testQueryClient = createTestQueryClient();

	const { rerender, ...result } = rtlRender(ui, {
		wrapper: ({ children }) => (
			<WagmiProvider config={options?.wagmiConfig ?? wagmiConfig}>
				<QueryClientProvider client={testQueryClient}>
					<ThemeProvider>{children}</ThemeProvider>
				</QueryClientProvider>
			</WagmiProvider>
		),
		...options,
	});

	return {
		...result,
		rerender: (rerenderUi: ReactElement) =>
			rerender(
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={testQueryClient}>
						<ThemeProvider>{rerenderUi}</ThemeProvider>
					</QueryClientProvider>
				</WagmiProvider>,
			),
	};
}

function renderHookWithClient<P, R>(
	callback: (props: P) => R,
	options?: Omit<RenderOptions, 'queries'>,
) {
	const testQueryClient = createTestQueryClient();

	return renderHook(callback, {
		wrapper: ({ children }) => {
			return (
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={testQueryClient}>
						<ThemeProvider>{children}</ThemeProvider>
					</QueryClientProvider>
				</WagmiProvider>
			);
		},
		...options,
	});
}

// TODO: move make this more configurable, maybe use our own hook to create the config
const sequenceConnectConfig = createSequenceConnectConfig('universal', {
	projectAccessKey: 'test',
	chainIds: [1, 137],
	defaultChainId: 1,
	appName: 'Demo Dapp',
});

// The web sdk breaks the reloding of vitest, so we only use it when needed
function WebSdkWrapper({ children }: { children: ReactElement }) {
	return (
		<SequenceConnect config={sequenceConnectConfig}>
			<SequenceCheckoutProvider>{children}</SequenceCheckoutProvider>
		</SequenceConnect>
	);
}

export { WebSdkWrapper };

export * from '@testing-library/react';

export { renderWithClient as render };
export { renderHookWithClient as renderHook };
