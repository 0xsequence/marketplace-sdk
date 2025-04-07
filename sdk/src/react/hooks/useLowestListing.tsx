import { useQuery } from '@tanstack/react-query';
import {
	type UseLowestListingArgs,
	lowestListingOptions,
} from '../queries/lowestListing';
import { useConfig } from './useConfig';

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
 *   tokenId: 1n,
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
