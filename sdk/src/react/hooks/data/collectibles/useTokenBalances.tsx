import { useQuery } from '@tanstack/react-query';
import { ContractType } from '../../../_internal';
import {
	tokenBalancesOptions,
	type UseTokenBalancesArgs,
} from '../../../queries/tokenBalances';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

/**
 * Hook to fetch all token balances for a user in a collection
 *
 * @param args - The arguments for fetching the balances
 * @returns Query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useTokenBalances({
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
export function useTokenBalances(args: UseTokenBalancesArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const collection = marketplaceConfig?.market.collections.find(
		(collection) => collection.itemsAddress === args.collectionAddress,
	);
	const isLaos721 = collection?.contractType === ContractType.ERC721;

	return useQuery(
		tokenBalancesOptions(
			{
				...args,
				isLaos721,
			},
			config,
		),
	);
}
