import { useQuery } from '@tanstack/react-query';
import {
	type UseBalanceOfCollectibleArgs,
	balanceOfCollectibleOptions,
} from '../queries/balanceOfCollectible';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

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
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const isLaos721 = marketplaceConfig?.collections.find(
		(collection) => collection.address === args.collectionAddress,
	)?.isLAOSERC721;

	if (isLaos721) {
		args.isLaos721 = true;
	}

	return useQuery(balanceOfCollectibleOptions(args, config));
}
