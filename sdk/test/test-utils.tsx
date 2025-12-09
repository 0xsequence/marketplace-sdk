'use client';

import {
	createConfig as createSequenceConnectConfig,
	SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { renderHook, render as rtlRender } from '@testing-library/react';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import {
	type Client,
	createTestClient,
	publicActions,
	walletActions,
} from 'viem';
import { mainnet as wagmiMainnet, polygon as wagmiPolygon } from 'viem/chains';
import {
	type Config,
	createConfig,
	http,
	useAccount,
	useConnect,
	WagmiProvider,
} from 'wagmi';
import { mock } from 'wagmi/connectors';
import { MarketplaceProvider } from '../src/react/providers';
import type { SdkConfig } from '../src/types/sdk-config';
import { TEST_ACCOUNTS, TEST_CHAIN, TEST_PRIVATE_KEYS } from './const';

export const createTestQueryClient = () =>
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
	...wagmiMainnet,
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
		switchChainError: new Error('Failed to switch chain'),
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

export const sequenceConnectConfig = createSequenceConnectConfig('universal', {
	projectAccessKey: 'test',
	chainIds: [1, 137],
	defaultChainId: 1,
	appName: 'Demo Dapp',
});

export const testMarketplaceSdkConfig: SdkConfig = {
	projectAccessKey: 'test-project-access-key',
	projectId: '12345',
};

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
			connector.name = 'Sequence Universal';
			return connector;
		},
	});
}

export const wagmiConfigEmbedded = createConfig({
	...wagmiConfigObj,
	connectors: [mockWaas()],
});

export const wagmiConfigSequence = createConfig({
	...wagmiConfigObj,
	connectors: [mockSequenceConnector()],
});

function TestConnectorSetup({ autoConnect = true }: { autoConnect?: boolean }) {
	const { connect, connectors } = useConnect();
	const { isConnected } = useAccount();

	useEffect(() => {
		if (autoConnect && !isConnected && connectors.length > 0) {
			connect({ connector: connectors[0] });
		}
	}, [connect, connectors, isConnected, autoConnect]);

	return null;
}

type Options = Omit<RenderOptions, 'wrapper'> & {
	wagmiConfig?: Config;
	useEmbeddedWallet?: boolean;
	useSequenceConnector?: boolean;
	autoConnect?: boolean;
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

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<WagmiProvider config={config}>
			<QueryClientProvider client={testQueryClient}>
				<SequenceConnectProvider config={sequenceConnectConfig.connectConfig}>
					<MarketplaceProvider
						config={testMarketplaceSdkConfig}
						openConnectModal={() => {}}
					>
						<ThemeProvider>
							<TestConnectorSetup autoConnect={options?.autoConnect} />
							{children}
						</ThemeProvider>
					</MarketplaceProvider>
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
		autoConnect?: boolean;
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
						<MarketplaceProvider
							config={testMarketplaceSdkConfig}
							openConnectModal={() => {}}
						>
							<TestConnectorSetup autoConnect={options?.autoConnect} />
							{children}
						</MarketplaceProvider>
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
