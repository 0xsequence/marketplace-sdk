import { getDefaultChains } from '@0xsequence/connect';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import type { Env, SdkConfig } from '../../../types';
import type { MarketplaceConfig } from '../../../types/new-marketplace-types';
import { DEFAULT_NETWORK } from '../consts';
import { getConnectors } from './get-connectors';

export const createWagmiConfig = (
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
	ssr?: boolean,
) => {
	const chains = getChainConfigs(marketplaceConfig);
	const nodeGatewayEnv =
		sdkConfig._internal?.overrides?.api.nodeGateway?.env ?? 'production';
	const projectAccessKey =
		sdkConfig._internal?.overrides?.api.nodeGateway?.accessKey ??
		sdkConfig.projectAccessKey;

	const transports = getTransportConfigs(
		chains,
		projectAccessKey,
		nodeGatewayEnv,
	);

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
	nodeGatewayEnv: Env,
): Record<number, Transport> {
	return chains.reduce(
		(acc, chain) => {
			const network = findNetworkConfig(allNetworks, chain.id);
			if (network) {
				let rpcUrl = network.rpcUrl;
				if (nodeGatewayEnv === 'development') {
					rpcUrl = rpcUrl.replace('nodes.', 'dev-nodes.');
				}
				if (!network.rpcUrl.endsWith(projectAccessKey))
					rpcUrl = `${rpcUrl}/${projectAccessKey}`;
				acc[chain.id] = http(rpcUrl);
			}
			return acc;
		},
		{} as Record<number, Transport>,
	);
}
