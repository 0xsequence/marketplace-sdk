import { useInfiniteQuery } from '@tanstack/react-query';
import { listBalancesOptions } from '../queries/listBalances';
import type { UseListBalancesArgs } from '../queries/listBalances';
import { useConfig } from './useConfig';

/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListBalances({
 *   chainId: 1,
 *   accountAddress: '0x123...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useListBalances(args: UseListBalancesArgs) {
	const config = useConfig();
	return useInfiniteQuery(listBalancesOptions(args, config));
}
