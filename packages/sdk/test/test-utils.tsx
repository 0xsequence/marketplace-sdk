import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { http, type Config, WagmiProvider, createConfig } from 'wagmi';

import { mock } from 'wagmi/connectors';

import { HttpResponse, http as mswHttp } from 'msw';
import { setupServer } from 'msw/node';
import {
	type Client,
	createTestClient,
	publicActions,
	walletActions,
} from 'viem';
import { mainnet } from 'viem/chains';
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

// TODO: remove this
const bal = mswHttp.post('http://127.0.0.1:8545', async (req) => {
	console.log('req:', await req.request.json());
	return HttpResponse.json({
		jsonrpc: '2.0',
		id: 1,
		result: '0x1000000000000000001',
	});
});

export const server = setupServer(
	...marketplaceHandlers,
	...metadataHandlers,
	...indexerHandlers,
	...marketplaceConfigHandlers,
	tickHandler,
	bal,
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

// const config = createConfig({
// 	chains: [TEST_CHAIN],
// 	connectors: [
// 		mock({
// 			accounts: [TEST_ACCOUNTS[0]],
// 		}),
// 	],
// 	transports: {
// 		[TEST_CHAIN.id]: http(),
// 	},
// 	client: () => testClient,
// 	multiInjectedProviderDiscovery: false,
// });

const chain = {
	...mainnet,
	rpcUrls: { default: { http: ['http://127.0.0.1:8545'] } },
};

const config = createConfig({
	chains: [chain],
	connectors: [
		mock({
			accounts: [TEST_ACCOUNTS[0]],
		}),
	],
	transports: {
		[chain.id]: http('http://127.0.0.1:8545'),
	},
	multiInjectedProviderDiscovery: false,
});

export function renderWithClient(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) {
	const testQueryClient = createTestQueryClient();

	const { rerender, ...result } = rtlRender(ui, {
		wrapper: ({ children }) => (
			<WagmiProvider config={config}>
				<QueryClientProvider client={testQueryClient}>
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		),
		...options,
	});

	return {
		...result,
		rerender: (rerenderUi: ReactElement) =>
			rerender(
				<WagmiProvider config={config}>
					<QueryClientProvider client={testQueryClient}>
						{rerenderUi}
					</QueryClientProvider>
				</WagmiProvider>,
			),
	};
}

export function renderHookWithClient<P, R>(
	callback: (props: P) => R,
	options?: Omit<RenderOptions, 'queries'>,
	wagmiConfig?: Config,
) {
	const testQueryClient = createTestQueryClient();

	return renderHook(callback, {
		wrapper: ({ children }) => {
			return (
				<WagmiProvider config={wagmiConfig ?? config}>
					<QueryClientProvider client={testQueryClient}>
						{children}
					</QueryClientProvider>
				</WagmiProvider>
			);
		},
		...options,
	});
}

export * from '@testing-library/react';

export { renderWithClient as render };
export { renderHookWithClient as renderHook };
