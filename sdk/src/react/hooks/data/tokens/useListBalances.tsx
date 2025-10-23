import { useInfiniteQuery } from '@tanstack/react-query';
import { ContractType } from '../../../_internal';
import type { UseListBalancesArgs } from '../../../queries/listBalances';
import { listBalancesOptions } from '../../../queries/listBalances';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

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

	const isLaos721 =
		marketplaceConfig?.market?.collections?.find(
			(c) =>
				c.itemsAddress === args.contractAddress && c.chainId === args.chainId,
		)?.contractType === ContractType.LAOS_ERC_721;

	return useInfiniteQuery(listBalancesOptions({ ...args, isLaos721 }, config));
}
