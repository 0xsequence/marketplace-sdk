import { getDefaultChains } from '@0xsequence/kit';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
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

	// The old config did not support disabling EIP-6963 wallets
	const includeEIP6963Wallets =
		marketplaceConfig.walletOptionsNew?.includeEIP6963Wallets ?? true;

	return createConfig({
		connectors,
		chains,
		ssr,
		multiInjectedProviderDiscovery: includeEIP6963Wallets,
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
