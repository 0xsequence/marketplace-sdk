import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { balanceOfCollectibleOptions } from '../queries/balanceOfCollectible';
import { useConfig } from './useConfig';

/**
 * Type for the balance of collectible hook parameters
 * @property {Hex} collectionAddress - The contract address of the collection
 * @property {string} collectableId - The ID of the specific collectible
 * @property {Hex} userAddress - The address of the user to check balance for
 * @property {number} chainId - The chain ID where the collection exists
 * @property {object} [query] - Optional query configuration parameters
 */
export type UseBalanceOfCollectibleArgs = {
	collectionAddress: Hex;
	collectableId: string;
	userAddress: Hex | undefined;
	chainId: number;
	query?: {
		enabled?: boolean;
		staleTime?: number;
		gcTime?: number;
		refetchInterval?: number;
	};
};

/**
 * Hook to fetch the balance of a specific collectible for a user
 *
 * @param args - The arguments for fetching the balance
 * @returns Query result containing the balance data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBalanceOfCollectible({
 *   collectionAddress: '0x123...',
 *   collectableId: '1',
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useBalanceOfCollectible(args: UseBalanceOfCollectibleArgs) {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions(args, config));
}
