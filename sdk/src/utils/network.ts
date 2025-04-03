import { networks } from '@0xsequence/network';

export const getPresentableChainName = (chainId: number) => {
	return networks[chainId as keyof typeof networks]?.title ?? 'Unknown Network';
};
