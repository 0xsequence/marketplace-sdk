import { getDefaultChains } from '@0xsequence/connect';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import type { Env, SdkConfig } from '../../../types/index';
import type { MarketplaceConfig } from '../../../types/new-marketplace-types';
import { DEFAULT_NETWORK } from '../consts';
import { getConnectors } from './get-connectors';

export const createWagmiConfig = (
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
	ssr?: boolean,
) => {
	const { chains, transports } = getWagmiChainsAndTransports({
		marketplaceConfig,
		sdkConfig,
	});

	const walletType = marketplaceConfig.settings.walletOptions.walletType;

	const connectors = getConnectors({
		marketplaceConfig,
		sdkConfig,
		walletType,
	});

	const multiInjectedProviderDiscovery =
		marketplaceConfig.settings.walletOptions.includeEIP6963Wallets;

	return createConfig({
		connectors,
		chains,
		ssr,
		multiInjectedProviderDiscovery,
		storage: ssr
			? createStorage({
					storage: cookieStorage,
				})
			: undefined,
		transports,
	});
};

export function getWagmiChainsAndTransports({
	marketplaceConfig,
	sdkConfig,
}: {
	marketplaceConfig: MarketplaceConfig;
	sdkConfig: SdkConfig;
}) {
	const chains = getChainConfigs(marketplaceConfig);
	const nodeGatewayOverrides = sdkConfig._internal?.overrides?.api?.nodeGateway;
	const nodeGatewayEnv = nodeGatewayOverrides?.env ?? 'production';
	const nodeGatewayUrl = nodeGatewayOverrides?.url;
	const projectAccessKey =
		nodeGatewayOverrides?.accessKey ?? sdkConfig.projectAccessKey;

	const transports = getTransportConfigs(
		chains,
		projectAccessKey,
		nodeGatewayEnv,
		nodeGatewayUrl,
	);

	return { chains, transports };
}

function getAllCollections(marketConfig: MarketplaceConfig) {
	return [...marketConfig.market.collections, ...marketConfig.shop.collections];
}

function getChainConfigs(marketConfig: MarketplaceConfig): [Chain, ...Chain[]] {
	const supportedChainIds = new Set(
		getAllCollections(marketConfig).map((c) => c.chainId),
	);

	if (supportedChainIds.size === 0) {
		supportedChainIds.add(DEFAULT_NETWORK);
	}

	const chains = getDefaultChains([...supportedChainIds]);

	return chains;
}

function getTransportConfigs(
	chains: [Chain, ...Chain[]],
	projectAccessKey: string,
	nodeGatewayEnv: Env | undefined,
	nodeGatewayUrl?: string,
): Record<number, Transport> {
	return chains.reduce(
		(acc, chain) => {
			const network = findNetworkConfig(allNetworks, chain.id);
			if (network) {
				let rpcUrl: string;
				if (nodeGatewayUrl) {
					// Use manual URL if provided
					rpcUrl = nodeGatewayUrl;
				} else {
					// Use default URL with environment prefix
					rpcUrl = network.rpcUrl;
					if (nodeGatewayEnv === 'development') {
						rpcUrl = rpcUrl.replace('nodes.', 'dev-nodes.');
					}
					if (!network.rpcUrl.endsWith(projectAccessKey))
						rpcUrl = `${rpcUrl}/${projectAccessKey}`;
				}
				acc[chain.id] = http(rpcUrl);
			}
			return acc;
		},
		{} as Record<number, Transport>,
	);
}
