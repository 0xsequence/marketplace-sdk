'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type CollectionQueryOptions,
	type FetchCollectionParams,
	collectionQueryOptions,
} from '../queries/collection';
import { useConfig } from './useConfig';

export type UseCollectionParams = Optional<CollectionQueryOptions, 'config'>;

/**
 * Hook to fetch collection information from the metadata API
 *
 * Retrieves basic contract information including name, symbol, type,
 * and extension data for a given collection contract.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing contract information
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollection({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: userWantsToFetch
 *   }
 * })
 * ```
 */
export function useCollection(params: UseCollectionParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = collectionQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { collectionQueryOptions };

export type { FetchCollectionParams, CollectionQueryOptions };
