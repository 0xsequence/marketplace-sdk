'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type CollectionDetailsQueryOptions,
	collectionDetailsQueryOptions,
	type FetchCollectionDetailsParams,
} from '../../../queries/collectionDetails';
import { useConfig } from '../../config/useConfig';

export type UseCollectionDetailsParams = Optional<
	CollectionDetailsQueryOptions,
	'config'
>;

/**
 * Hook to fetch detailed information about a collection
 *
 * This hook retrieves comprehensive metadata and details for an NFT collection,
 * including collection name, description, banner, avatar, social links, stats, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collection details
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collection, isLoading } = useCollectionDetails({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectionDetails({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   query: {
 *     enabled: Boolean(collectionAddress),
 *     staleTime: 60_000
 *   }
 * })
 * ```
 */
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
