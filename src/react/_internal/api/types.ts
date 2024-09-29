import type { QueryOptions } from '@tanstack/react-query';

export type QueryArg = {
	query?: Omit<
		QueryOptions,
		'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn'
	>;
};
