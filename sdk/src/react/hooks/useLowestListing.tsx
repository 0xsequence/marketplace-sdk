import { useQuery } from '@tanstack/react-query';
import type { UseQueryParameters } from 'wagmi/query';
import { lowestListingOptions } from '../queries/lowestListing';
import { useConfig } from './useConfig';

/**
 * Type for the lowest listing hook parameters
 * @property {string} collectionAddress - The contract address of the collection
 * @property {string} tokenId - The ID of the specific token
 * @property {number} chainId - The chain ID where the collection exists
 * @property {object} [query] - Optional query configuration parameters
 */
export type UseLowestListingArgs = {
	collectionAddress: string;
	tokenId: string;
	chainId: number;
	query?: UseQueryParameters;
};

/**
 * Hook to fetch the lowest listing for a specific collectible
 *
 * @param args - The arguments for fetching the lowest listing
 * @returns Query result containing the lowest listing data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLowestListing({
 *   collectionAddress: '0x123...',
 *   tokenId: '1',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useLowestListing(args: UseLowestListingArgs) {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
}
