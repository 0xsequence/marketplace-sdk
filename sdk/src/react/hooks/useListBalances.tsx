import { useInfiniteQuery } from '@tanstack/react-query';
import { listBalancesOptions } from '../queries/listBalances';
import type { UseListBalancesArgs } from '../queries/listBalances';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListBalances({
 *   chainId: 1,
 *   accountAddress: '0x123...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
export function useListBalances(args: UseListBalancesArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const isLaos721 = marketplaceConfig?.market.collections.find(
		(collection) => collection.itemsAddress === args.contractAddress,
	)?.isLAOSERC721;

	if (isLaos721) {
		args.isLaos721 = true;
	}

	return useInfiniteQuery(listBalancesOptions(args, config));
}
