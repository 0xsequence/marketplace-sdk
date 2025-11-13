import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import type { Env, MarketplaceConfig, SdkConfig } from '../../../types';
import { networkToWagmiChain } from '../../../utils/networkconfigToWagmiChain';
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

function getChainConfigs(
	_marketConfig: MarketplaceConfig,
): [Chain, ...Chain[]] {
	const chains = Object.values(allNetworks).map(networkToWagmiChain);

	return chains as [Chain, ...Chain[]];
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
