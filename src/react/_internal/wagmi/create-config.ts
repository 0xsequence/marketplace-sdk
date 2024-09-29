import { getDefaultChains } from '@0xsequence/kit';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import type { MarketplaceConfig, SdkConfig } from '@types';
import type { Chain, Transport } from 'viem';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { getWaasConnectors } from './embedded';
import { getUniversalConnectors } from './universal';

export const createWagmiConfig = (
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
	ssr?: boolean,
) => {
	const chains = getChainConfigs(marketplaceConfig);
	const transports = getTransportConfigs(chains);

	// TODO: implement the newWallet object from builder
	// TODO: Implement support for waas after builder endpoints are ready (this is different than the newWallet object above)
	const walletType = 'universal';

	const connectors =
		walletType === 'universal'
			? getUniversalConnectors(marketplaceConfig, sdkConfig)
			: getWaasConnectors(marketplaceConfig, sdkConfig);

	return createConfig({
		connectors,
		chains,
		ssr,
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
	return getDefaultChains([...supportedChainIds]);
}

function getTransportConfigs(
	chains: [Chain, ...Chain[]],
): Record<number, Transport> {
	return chains.reduce(
		(acc, chain) => {
			const network = findNetworkConfig(allNetworks, chain.id);
			if (network) acc[chain.id] = http(network.rpcUrl);
			return acc;
		},
		{} as Record<number, Transport>,
	);
}
