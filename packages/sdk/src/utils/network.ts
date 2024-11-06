import { type ChainId, networks } from '@0xsequence/network';

export const getPresentableChainName = (chainId: ChainId) => {
	return networks[chainId]?.name;
};
