import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { http, type Config, WagmiProvider, createConfig } from 'wagmi';
import { foundry } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

import { HttpResponse, http as mswHttp } from 'msw';
import { setupServer } from 'msw/node';
import {
	type Client,
	createTestClient,
	publicActions,
	walletActions,
} from 'viem';
import { handlers as indexerHandlers } from '../react/_internal/api/__mocks__/indexer.msw';
import { handlers as marketplaceHandlers } from '../react/_internal/api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../react/_internal/api/__mocks__/metadata.msw';
import { handlers as marketplaceConfigHandlers } from '../react/hooks/options/__mocks__/marketplaceConfig.msw';
import { TEST_ACCOUNTS, TEST_PRIVATE_KEYS } from './const';

const tickHandler = mswHttp.post(
	' https://nodes.sequence.app/rpc/Databeat/Tick',
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
	chain: foundry,
	mode: 'anvil',
	account: TEST_ACCOUNTS[0],
	key: TEST_PRIVATE_KEYS[0],
	pollingInterval: 100,
})
	.extend(publicActions)
	.extend(walletActions);

const config = createConfig({
	chains: [foundry],
	connectors: [
		mock({
			accounts: [TEST_ACCOUNTS[0]],
		}),
	],
	transports: {
		[foundry.id]: http(),
	},
	// @ts-ignore
	client: () => testClient as Client,
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
