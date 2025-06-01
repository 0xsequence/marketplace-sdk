import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { PrimarySaleItemsFilter } from '../_internal';
import { getMarketplaceClient } from '../_internal';
import { useConfig } from './useConfig';

export interface UseCountOfPrimarySaleItemsArgs {
	chainId: number;
	primarySaleContractAddress: Hex;
	filter?: PrimarySaleItemsFilter;
	query?: {
		enabled?: boolean;
	};
}

/**
 * Hook to fetch the count of primary sale items
 *
 * @param args - The arguments for fetching the count
 * @returns Query result containing the count of primary sale items
 *
 * @example
 * ```tsx
 * const { data: count, isLoading } = useCountOfPrimarySaleItems({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x123...',
 *   filter: {
 *     includeEmpty: false,
 *   },
 * });
 * ```
 */
export function useCountOfPrimarySaleItems(
	args: UseCountOfPrimarySaleItemsArgs,
) {
	const config = useConfig();
	const marketplaceClient = getMarketplaceClient(config);

	return useQuery({
		queryKey: ['primarySaleItems', 'count', args, config],
		queryFn: async () => {
			const result = await marketplaceClient.getCountOfPrimarySaleItems({
				chainId: String(args.chainId),
				primarySaleContractAddress: args.primarySaleContractAddress,
				filter: args.filter,
			});
			return result.count;
		},
		...args.query,
	});
}
