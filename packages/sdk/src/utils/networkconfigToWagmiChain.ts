import type { NetworkConfig } from '@0xsequence/network';

export const networkToWagmiChain = (network: NetworkConfig) => ({
	...network,
	id: Number(network.chainId),
	name: network.name,
	nativeCurrency: { ...network.nativeToken },
	rpcUrls: {
		default: {
			http: [network.rpcUrl],
		},
		public: {
			http: [network.rpcUrl],
		},
	},
});
