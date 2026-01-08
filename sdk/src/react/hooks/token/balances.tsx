'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { UseListBalancesParams } from '../../queries/token/balances';
import { listBalancesOptions } from '../../queries/token/balances';
import { useConfig } from '../config/useConfig';

/**
 * Hook to fetch a list of token balances with pagination support
 *
 * Fetches token balances for a specific account with support for filtering by
 * contract and token ID, metadata inclusion, and infinite pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.accountAddress - The account address to fetch balances for (required)
 * @param params.contractAddress - The contract address to filter balances (optional)
 * @param params.tokenId - Optional token ID to filter balances
 * @param params.includeMetadata - Whether to include token metadata
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing the balances data
 *
 * @example
 * Basic usage without contract filter:
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useTokenBalances({
 *   chainId: 1,
 *   accountAddress: '0x123...'
 * });
 * ```
 *
 * @example
 * With contract filter and metadata:
 * ```tsx
 * const { data, isLoading, fetchNextPage } = useTokenBalances({
 *   chainId: 137,
 *   accountAddress: '0x123...',
 *   contractAddress: '0x456...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useTokenBalances(params: UseListBalancesParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listBalancesOptions({
		config,
		...rest,
	});

	return useInfiniteQuery(queryOptions);
}
