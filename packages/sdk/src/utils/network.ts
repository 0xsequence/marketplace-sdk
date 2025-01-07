import { networks, type ChainId as sequenceChainId } from '@0xsequence/network';
import type { ChainId } from '../react/_internal';

export const getPresentableChainName = (chainId: ChainId) => {
	const id = Number(chainId) as sequenceChainId;
	return networks[id]?.name;
};
