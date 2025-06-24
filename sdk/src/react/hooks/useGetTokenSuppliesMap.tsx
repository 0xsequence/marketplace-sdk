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
 * Hook to fetch token supplies mapping from the indexer
 *
 * Retrieves supply information for multiple tokens within a collection using the indexer API.
 * This is useful for getting supply data for batches of tokens efficiently.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenIds - Array of token IDs to fetch supplies for
 * @param params.config - Optional SDK configuration (defaults from context)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies mapping
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: suppliesMap, isLoading } = useGetTokenSuppliesMap({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With query options:
 * ```typescript
 * const { data: suppliesMap } = useGetTokenSuppliesMap({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0,
 *     staleTime: 30 * 1000 // 30 seconds
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
