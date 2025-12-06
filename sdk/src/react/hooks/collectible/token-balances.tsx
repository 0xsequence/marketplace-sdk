import { useQuery } from '@tanstack/react-query';
import {
	type TokenBalancesQueryOptions,
	tokenBalancesOptions,
} from '../../queries/collectible/token-balances';
import { useConfig } from '../config/useConfig';

/**
 * Hook to fetch all token balances for a user in a collection
 *
 * @param args - The arguments for fetching the balances
 * @returns Query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCollectibleTokenBalances({
 *   collectionAddress: '0x123...',
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useCollectibleTokenBalances(
	args: Omit<TokenBalancesQueryOptions, 'config'>,
) {
	const config = useConfig();

	return useQuery(
		tokenBalancesOptions({
			...args,
			config,
		}),
	);
}
