import { createConfig as createSequenceConnectConfig } from '@0xsequence/connect';
import { QueryClient } from '@tanstack/react-query';
import {
	type Client,
	createTestClient,
	publicActions,
	walletActions,
} from 'viem';
import { mainnet as wagmiMainet, polygon as wagmiPolygon } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { mock } from 'wagmi/connectors';
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

export const wagmiConfig = createConfig({
	chains: [mainnet, polygon],
	connectors: [mockConnector],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
	},
	multiInjectedProviderDiscovery: false,
});

export const sequenceConnectConfig = createSequenceConnectConfig('universal', {
	projectAccessKey: 'test',
	chainIds: [1, 137],
	defaultChainId: 1,
	appName: 'Demo Dapp',
});
