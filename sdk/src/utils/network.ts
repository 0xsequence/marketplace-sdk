import { networks } from '@0xsequence/network';
import { MissingConfigError } from './_internal/error/transaction';

type ChainNameOrId = string | number;

export const getNetwork = (nameOrId: ChainNameOrId) => {
	for (const network of Object.values(networks)) {
		if (
			network.name === String(nameOrId).toLowerCase() ||
			network.chainId === Number(nameOrId)
		) {
			return network;
		}
	}
	throw new MissingConfigError(`Network configuration for chain ${nameOrId}`);
};

export const getPresentableChainName = (chainId: number) => {
	return networks[chainId as keyof typeof networks]?.title ?? 'Unknown Network';
};
