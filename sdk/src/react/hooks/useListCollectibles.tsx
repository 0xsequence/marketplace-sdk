import { useInfiniteQuery } from '@tanstack/react-query';
import { listCollectiblesOptions } from '../queries/listCollectibles';
import type { UseListCollectiblesArgs } from '../queries/listCollectibles';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

/**
 * Hook to fetch a list of collectibles with pagination support
 *
 * @param args - The arguments for fetching the collectibles
 * @returns Infinite query result containing the collectibles data including orders
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListCollectibles({
 *   chainId: 1,
 *   collectionAddress: '0x123...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useListCollectibles(args: UseListCollectiblesArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const isLaos721 = marketplaceConfig?.collections.find(
		(collection) => collection.address === args.collectionAddress,
	)?.isLAOSERC721;

	if (isLaos721) {
		args.isLaos721 = true;
	}

	return useInfiniteQuery(listCollectiblesOptions(args, config));
}
