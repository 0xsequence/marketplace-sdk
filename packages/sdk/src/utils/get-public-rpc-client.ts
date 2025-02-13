import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import { http, type PublicClient, createPublicClient } from 'viem';
import type { ChainId } from '../react/_internal';
import { MissingConfigError } from './_internal/error/transaction';

export const getPublicRpcClient = (chainId: ChainId): PublicClient => {
	if (chainId === undefined) {
		throw new MissingConfigError(
			`Network configuration for chainId: ${chainId}`,
		);
	}

	const network = findNetworkConfig(allNetworks, chainId);

	if (!network) {
		throw new MissingConfigError(
			`Network configuration for chainId: ${chainId}`,
		);
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
