import type { NetworkConfig } from '@0xsequence/network';
import type { Address, Chain } from 'viem';

export const networkToWagmiChain = (network: NetworkConfig): Chain => ({
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
	contracts: network.ensAddress
		? {
				ensRegistry: {
					address: network.ensAddress as Address,
				},
			}
		: undefined,
});
