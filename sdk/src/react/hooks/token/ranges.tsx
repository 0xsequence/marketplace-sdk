'use client';

import { useQuery } from '@tanstack/react-query';
import type { Address } from '@0xsequence/api-client';
import type { Optional } from '../../_internal';
import {
	type FetchGetTokenRangesParams,
	type fetchGetTokenRanges,
	type GetTokenRangesQueryOptions,
	getTokenRangesQueryOptions,
} from '../../queries/token/ranges';
import { useConfig } from '../config/useConfig';

export type UseTokenRangesParams = Optional<
	GetTokenRangesQueryOptions,
	'config'
>;

/**
 * Hook to fetch token ID ranges for a collection
 *
 * Retrieves the available token ID ranges for a specific collection,
 * which is useful for understanding the token distribution and
 * available tokens within a collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address to fetch ranges for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token ID ranges for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: tokenRanges, isLoading } = useTokenRanges({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`Token ranges: ${JSON.stringify(data.ranges)}`);
 *   data.ranges?.forEach(range => {
 *     console.log(`Range: ${range.start} - ${range.end}`);
 *   });
 * }
 * ```
 *
 * @example
 * With conditional enabling:
 * ```typescript
 * const { data: tokenRanges } = useTokenRanges({
 *   chainId: 1,
 *   collectionAddress: selectedCollection?.address,
 *   query: {
 *     enabled: Boolean(selectedCollection?.address),
 *     staleTime: 300000, // Cache for 5 minutes
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
export function useTokenRanges(params: UseTokenRangesParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = getTokenRangesQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { getTokenRangesQueryOptions };

export type { FetchGetTokenRangesParams, GetTokenRangesQueryOptions };

// Legacy exports for backward compatibility
export type UseGetTokenRangesProps = {
	chainId: number;
	collectionAddress: Address;
	query?: {
		enabled?: boolean;
	};
};

export type UseGetTokenRangesReturn = Awaited<
	ReturnType<typeof fetchGetTokenRanges>
>;
