'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type SearchTokenMetadataQueryOptions,
	searchTokenMetadataQueryOptions,
} from '../../../queries/searchTokenMetadata';
import { useConfig } from '../../config/useConfig';

export type UseSearchTokenMetadataParams = Optional<
	SearchTokenMetadataQueryOptions,
	'config'
>;

/**
 * Hook to search token metadata using filters
 *
 * Searches for tokens in a collection based on text and property filters.
 * Supports filtering by attributes, ranges, and text search.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Filter criteria for the search
 * @param params.filter.text - Optional text search query
 * @param params.filter.properties - Optional array of property filters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing matching token metadata
 *
 * @example
 * Basic text search:
 * ```typescript
 * const { data, isLoading } = useSearchTokenMetadata({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: {
 *     text: 'dragon'
 *   }
 * })
 * ```
 *
 * @example
 * Property filters:
 * ```typescript
 * const { data } = useSearchTokenMetadata({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     properties: [
 *       {
 *         name: 'Rarity',
 *         type: PropertyType.STRING,
 *         values: ['Legendary', 'Epic']
 *       },
 *       {
 *         name: 'Level',
 *         type: PropertyType.INT,
 *         min: 50,
 *         max: 100
 *       }
 *     ]
 *   }
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useSearchTokenMetadata({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: { text: 'rare' },
 *   page: {
 *     page: 2,
 *     pageSize: 20
 *   }
 * })
 * ```
 */
export function useSearchTokenMetadata(params: UseSearchTokenMetadataParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = searchTokenMetadataQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}
