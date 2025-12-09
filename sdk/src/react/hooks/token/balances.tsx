import { useInfiniteQuery } from '@tanstack/react-query';
import type { UseListBalancesArgs } from '../../queries/token/balances';
import { listBalancesOptions } from '../../queries/token/balances';
import { useConfig } from '../config/useConfig';

/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useTokenBalances({
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
export function useTokenBalances(args: UseListBalancesArgs) {
	const config = useConfig();

	return useInfiniteQuery(listBalancesOptions({ ...args, config }));
}
