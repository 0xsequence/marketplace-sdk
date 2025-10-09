import { useQuery } from '@tanstack/react-query';
import { ContractType } from '../../../_internal';
import {
	balanceOfCollectibleOptions,
	type UseBalanceOfCollectibleArgs,
} from '../../../queries/collectibles/balanceOfCollectible';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

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

	const collection = marketplaceConfig?.market.collections.find(
		(collection) => collection.itemsAddress === args.collectionAddress,
	);
	const isLaos721 = collection?.contractType === ContractType.LAOS_ERC_721;

	return useQuery(
		balanceOfCollectibleOptions(
			{
				...args,
				isLaos721,
			},
			config,
		),
	);
}
