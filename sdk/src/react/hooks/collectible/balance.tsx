import { useQuery } from '@tanstack/react-query';
import {
	balanceOfCollectibleOptions,
	type UseBalanceOfCollectibleArgs,
} from '../../queries/collectible/balance';
import { useConfig } from '../config/useConfig';

/**
 * Hook to fetch the balance of a specific collectible for a user
 *
 * @param args - The arguments for fetching the balance
 * @returns Query result containing the balance data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCollectibleBalance({
 *   collectionAddress: '0x123...',
 *   collectibleId: '1',
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useCollectibleBalance(args: UseBalanceOfCollectibleArgs) {
	const config = useConfig();

	return useQuery(
		balanceOfCollectibleOptions(
			{
				...args,
			},
			config,
		),
	);
}
