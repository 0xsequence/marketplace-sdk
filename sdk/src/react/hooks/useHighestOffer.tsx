import { useQuery } from '@tanstack/react-query';
import { highestOfferOptions } from '../queries/highestOffer';
import { useConfig } from './useConfig';

/**
 * Type for the highest offer hook parameters
 * @property {string} collectionAddress - The contract address of the collection
 * @property {string} tokenId - The ID of the specific token
 * @property {string} chainId - The chain ID where the collection exists
 * @property {object} [query] - Optional query configuration parameters
 */
export type UseHighestOfferArgs = {
	collectionAddress: string;
	tokenId: string;
	chainId: number;
	query?: {
		enabled?: boolean;
		staleTime?: number;
		gcTime?: number;
		refetchInterval?: number;
	};
};

/**
 * Hook to fetch the highest offer for a specific collectible
 *
 * @param args - The arguments for fetching the highest offer
 * @returns Query result containing the highest offer data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useHighestOffer({
 *   collectionAddress: '0x123...',
 *   tokenId: '1',
 *   chainId: '1',
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useHighestOffer(args: UseHighestOfferArgs) {
	const config = useConfig();
	return useQuery(highestOfferOptions(args, config));
}
