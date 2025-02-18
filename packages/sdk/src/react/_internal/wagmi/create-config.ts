import { getDefaultChains } from '@0xsequence/kit';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
import { polygon } from 'viem/chains';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import type { MarketplaceConfig, SdkConfig } from '../../../types';
import { getWaasConnectors } from './embedded';
import { getUniversalConnectors } from './universal';

export const createWagmiConfig = (
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
	ssr?: boolean,
) => {
	const chains = getChainConfigs(marketplaceConfig);
	const transports = getTransportConfigs(chains, sdkConfig.projectAccessKey);

	const walletType = sdkConfig.wallet?.embedded?.waasConfigKey
		? 'waas'
		: 'universal';

	const connectors =
		walletType === 'universal'
			? getUniversalConnectors(marketplaceConfig, sdkConfig)
			: getWaasConnectors(marketplaceConfig, sdkConfig);

	const multiInjectedProviderDiscovery =
		marketplaceConfig.walletOptions.includeEIP6963Wallets;

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

function getChainConfigs(marketConfig: MarketplaceConfig): [Chain, ...Chain[]] {
	const supportedChainIds = new Set(
		marketConfig.collections.map((c) => c.chainId),
	);

	// Marketplace config does not specify any chains, use polygon as default
	if (supportedChainIds.size === 0) {
		supportedChainIds.add(polygon.id); // Mainnet chain ID
	}
	const chains = getDefaultChains([...supportedChainIds]);

	return chains;
}

function getTransportConfigs(
	chains: [Chain, ...Chain[]],
	projectAccessKey: string,
): Record<number, Transport> {
	return chains.reduce(
		(acc, chain) => {
			const network = findNetworkConfig(allNetworks, chain.id);
			if (network) {
				let rpcUrl = network.rpcUrl;
				if (!network.rpcUrl.endsWith(projectAccessKey))
					rpcUrl = `${rpcUrl}/${projectAccessKey}`;
				acc[chain.id] = http(rpcUrl);
			}
			return acc;
		},
		{} as Record<number, Transport>,
	);
}
