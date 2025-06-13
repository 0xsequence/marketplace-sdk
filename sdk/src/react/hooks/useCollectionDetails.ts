'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type CollectionDetailsQueryOptions,
	type FetchCollectionDetailsParams,
	collectionDetailsQueryOptions,
} from '../queries/collectionDetails';
import { useConfig } from './useConfig';

export type UseCollectionDetailsParams = Optional<
	CollectionDetailsQueryOptions,
	'config'
>;

export function useCollectionDetails(params: UseCollectionDetailsParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = collectionDetailsQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { collectionDetailsQueryOptions };

export type { FetchCollectionDetailsParams, CollectionDetailsQueryOptions };
