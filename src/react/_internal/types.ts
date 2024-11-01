import type { ChainId as NetworkChainId } from '@0xsequence/network';

export type QueryArg = {
	query?: {
		enabled?: boolean;
		//TODO: Add more fields
	};
};

export type ChainId = string | number | NetworkChainId;
