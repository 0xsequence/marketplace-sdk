'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
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
 * Hook to search token metadata using filters with infinite pagination support
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
 * @returns Infinite query result containing matching token metadata with pagination support
 *
 * @example
 * Basic text search with pagination:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useSearchTokenMetadata({
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
 * const { data, fetchNextPage } = useSearchTokenMetadata({
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
 */
export function useSearchTokenMetadata(params: UseSearchTokenMetadataParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = searchTokenMetadataQueryOptions({
		config,
		...rest,
	});

	const result = useInfiniteQuery({
		...queryOptions,
	});

	return {
		...result,
		data: result.data
			? {
					tokenMetadata: result.data.pages.flatMap(
						(page) => page.tokenMetadata,
					),
					page: result.data.pages[result.data.pages.length - 1]?.page,
				}
			: undefined,
	};
}
