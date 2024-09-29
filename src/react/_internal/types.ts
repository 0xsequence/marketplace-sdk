import type { ChainId as NetworkChainId } from '@0xsequence/network';
import type { QueryOptions } from '@tanstack/react-query';

export type QueryArg = {
	query?: Omit<
		QueryOptions,
		'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn'
	>;
};

export type ChainId = string | number | NetworkChainId;
