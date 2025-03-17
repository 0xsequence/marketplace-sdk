import { useQuery } from '@tanstack/react-query';
import type { z } from 'zod';
import {
	type UseCollectionSchema,
	collectionOptions,
	type fetchCollection,
} from './options/collectionOptions';
import { useConfig } from './useConfig';

export type UseCollectionArgs = z.input<typeof UseCollectionSchema>;

export type UseCollectionReturn = Awaited<ReturnType<typeof fetchCollection>>;

export const useCollection = (args: UseCollectionArgs): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(collectionOptions(args, config));
};
