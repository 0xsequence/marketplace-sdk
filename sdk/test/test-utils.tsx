import {
	SequenceConnectProvider,
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
import { handlers as marketplaceConfigHandlers } from '../src/react/_internal/api/__mocks__/builder.msw';
import { handlers as indexerHandlers } from '../src/react/_internal/api/__mocks__/indexer.msw';
import { handlers as marketplaceHandlers } from '../src/react/_internal/api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../src/react/_internal/api/__mocks__/metadata.msw';
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

function mockWaas() {
	return new Proxy(mockConnector, {
		apply(target, thisArg, args) {
			const connector = Reflect.apply(target, thisArg, args);
			connector.id = 'waas';
			return connector;
		},
	});
}

function mockSequenceConnector() {
	return new Proxy(mockConnector, {
		apply(target, thisArg, args) {
			const connector = Reflect.apply(target, thisArg, args);
			connector.id = 'sequence';
		},
	});
}

const wagmiConfigEmbedded = createConfig({
	...wagmiConfigObj,
	connectors: [mockWaas()],
});

const wagmiConfigSequence = createConfig({
	...wagmiConfigObj,
	connectors: [mockSequenceConnector()],
});

type Options = Omit<RenderOptions, 'wrapper'> & {
	wagmiConfig?: Config;
	useEmbeddedWallet?: boolean;
	useSequenceConnector?: boolean;
};

function renderWithClient(ui: ReactElement, options?: Options) {
	const testQueryClient = createTestQueryClient();
	let config = options?.wagmiConfig;
	if (!config) {
		// if testing waas, use the embedded wallet config
		config = options?.useEmbeddedWallet
			? wagmiConfigEmbedded
			: // if testing sequence universal connector, use the sequence connector config
				options?.useSequenceConnector
				? wagmiConfigSequence
				: // if testing non-sequence connector, use the default config
					wagmiConfig;
	}

	// TODO: move make this more configurable, maybe use our own hook to create the config
	const sequenceConnectConfig = createSequenceConnectConfig('universal', {
		projectAccessKey: 'test',
		chainIds: [1, 137],
		defaultChainId: 1,
		appName: 'Demo Dapp',
	});

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<WagmiProvider config={config}>
			<QueryClientProvider client={testQueryClient}>
				<SequenceConnectProvider config={sequenceConnectConfig.connectConfig}>
					<ThemeProvider>{children}</ThemeProvider>
				</SequenceConnectProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);

	const { rerender, ...result } = rtlRender(ui, {
		wrapper: Wrapper,
		...options,
	});

	return {
		...result,
		rerender: (rerenderUi: ReactElement) =>
			rerender(<Wrapper>{rerenderUi}</Wrapper>),
	};
}

function renderHookWithClient<P, R>(
	callback: (props: P) => R,
	options?: Omit<RenderOptions, 'queries'> & {
		wagmiConfig?: Config;
		useEmbeddedWallet?: boolean;
	},
) {
	const testQueryClient = createTestQueryClient();

	let config = options?.wagmiConfig;
	if (!config) {
		config = options?.useEmbeddedWallet ? wagmiConfigEmbedded : wagmiConfig;
	}

	return renderHook(callback, {
		wrapper: ({ children }) => {
			return (
				<WagmiProvider config={config}>
					<QueryClientProvider client={testQueryClient}>
						<ThemeProvider>{children}</ThemeProvider>
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
