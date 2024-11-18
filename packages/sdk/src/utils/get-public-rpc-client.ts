import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import { http, type PublicClient, createPublicClient } from 'viem';
import type { ChainId } from '../react/_internal';

export const getPublicRpcClient = (chainId: ChainId): PublicClient => {
	const network = findNetworkConfig(allNetworks, chainId);

	if (!network) {
		throw new Error(`Unsupported chainId: ${chainId}`);
	}

	return createPublicClient({
		chain: {
			...network,
			id: Number(chainId),
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
		},
		batch: {
			multicall: true,
		},
		transport: http(),
	});
};
