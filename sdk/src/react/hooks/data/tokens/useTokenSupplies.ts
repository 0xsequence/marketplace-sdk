'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchTokenSuppliesParams,
	type TokenSuppliesQueryOptions,
	tokenSuppliesQueryOptions,
} from '../../../queries/tokens/tokenSupplies';
import { useConfig } from '../../config/useConfig';

export type UseTokenSuppliesParams = Optional<
	TokenSuppliesQueryOptions,
	'config'
>;

/**
 * Hook to fetch token supplies from the indexer
 *
 * Retrieves supply information for tokens from a specific collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.includeMetadata - Whether to include token metadata
 * @param params.page - Pagination options
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 1,
 *   collectionAddress: selectedCollection,
 *   query: {
 *     enabled: !!selectedCollection
 *   }
 * })
 * ```
 */
export function useTokenSupplies(params: UseTokenSuppliesParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = tokenSuppliesQueryOptions({
		config,
		...rest,
	});

	return useInfiniteQuery({
		...queryOptions,
	});
}

export { tokenSuppliesQueryOptions };

export type { FetchTokenSuppliesParams, TokenSuppliesQueryOptions };
