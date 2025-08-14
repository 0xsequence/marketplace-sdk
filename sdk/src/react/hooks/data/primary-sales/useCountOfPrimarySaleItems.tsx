import { useQuery } from '@tanstack/react-query';
import {
	countOfPrimarySaleItemsOptions,
	type UseCountOfPrimarySaleItemsArgs,
} from '../../../queries';
import { useConfig } from '../../config/useConfig';

/**
 * @deprecated Use `useGetCountOfPrimarySaleItems` instead
 *
 * Gets the total count of items available in a primary sale contract
 *
 * This hook fetches the number of items (tokens) available for primary sale
 * from a sales contract. It can be filtered to count only specific items
 * based on various criteria.
 *
 * @param args - Configuration for counting primary sale items
 * @param args.chainId - The blockchain network ID
 * @param args.primarySaleContractAddress - The primary sale contract address
 * @param args.filter - Optional filter to count specific items
 * @param args.query - Optional query configuration
 * @param args.query.enabled - Whether to enable the query (default: true)
 *
 * @returns Query result containing the item count
 * @returns returns.data - The total count of items matching the filter
 * @returns returns.isLoading - True while fetching the count
 * @returns returns.error - Error object if fetching fails
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: itemCount } = useCountOfPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...'
 * });
 *
 * console.log(`Total items available: ${itemCount}`);
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data: availableCount, isLoading } = useCountOfPrimarySaleItems({
 *   chainId: 1,
 *   primarySaleContractAddress: salesContract,
 *   filter: {
 *     onlyAvailable: true,
 *     minPrice: '1000000000000000000' // 1 ETH
 *   }
 * });
 *
 * if (!isLoading) {
 *   console.log(`${availableCount} items available above 1 ETH`);
 * }
 * ```
 *
 * @remarks
 * - This hook is deprecated in favor of `useGetCountOfPrimarySaleItems`
 * - Useful for displaying total available items before loading full data
 * - The count reflects current availability considering sold items
 * - Filter options include price range, availability, and custom attributes
 *
 * @see {@link useGetCountOfPrimarySaleItems} - The replacement hook
 * @see {@link useListPrimarySaleItems} - For fetching the actual items
 * @see {@link PrimarySaleItemsFilter} - Available filter options
 */
export function useCountOfPrimarySaleItems(
	args: UseCountOfPrimarySaleItemsArgs,
) {
	const config = useConfig();
	return useQuery(countOfPrimarySaleItemsOptions(args, config));
}
