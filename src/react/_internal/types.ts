import type { ChainId as NetworkChainId } from '@0xsequence/network';
import type { ContractType } from '@types';

export type QueryArg = {
	query?: {
		enabled?: boolean;
		//TODO: Add more fields
	};
};

export type ChainId = string | number | NetworkChainId;

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;
