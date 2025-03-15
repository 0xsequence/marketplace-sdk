import { networks } from '@0xsequence/network';
import type { ChainId } from '../react/_internal';

export const getPresentableChainName = (chainId: ChainId) => {
	const id = Number(chainId);
	return networks[id as keyof typeof networks]?.title ?? 'Unknown Network';
};
