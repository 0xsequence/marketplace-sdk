import { useInfiniteQuery } from '@tanstack/react-query';
import { listPrimarySaleItemsOptions } from '../queries/listPrimarySaleItems';
import type { UseListPrimarySaleItemsArgs } from '../queries/listPrimarySaleItems';
import { useConfig } from './useConfig';

/**
 * Hook to fetch a list of primary sale items with pagination support
 *
 * @param args - The arguments for fetching the primary sale items
 * @returns Infinite query result containing the primary sale items data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListPrimarySaleItems({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x123...',
 *   filter: {
 *     includeEmpty: false,
 *   },
 *   query: {
 *     enabled: true,
 *   }
 * });
 * ```
 */
export function useListPrimarySaleItems(args: UseListPrimarySaleItemsArgs) {
	const config = useConfig();
	return useInfiniteQuery(listPrimarySaleItemsOptions({ ...args }, config));
}
