'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type FetchGetTokenSuppliesMapParams,
	type GetTokenSuppliesMapQueryOptions,
	getTokenSuppliesMapQueryOptions,
} from '../queries/getTokenSuppliesMap';
import { useConfig } from './useConfig';

export type UseGetTokenSuppliesMapParams = Optional<
	GetTokenSuppliesMapQueryOptions,
	'config'
>;

/**
 * Hook to fetch token supplies map from the indexer API
 *
 * Retrieves supply information for multiple tokens from a specific collection.
 * Returns a mapping of token IDs to their supply data.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenIds - Array of token IDs to fetch supplies for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies mapping
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useGetTokenSuppliesMap({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useGetTokenSuppliesMap({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0
 *   }
 * })
 * ```
 */
export function useGetTokenSuppliesMap(params: UseGetTokenSuppliesMapParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = getTokenSuppliesMapQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { getTokenSuppliesMapQueryOptions };

export type { FetchGetTokenSuppliesMapParams, GetTokenSuppliesMapQueryOptions };
