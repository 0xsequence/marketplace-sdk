'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type ListPrimarySaleItemsQueryOptions,
	listPrimarySaleItemsQueryOptions,
} from '../../../queries/primarySaleItems';
import { useConfig } from '../../config/useConfig';

export type UseListPrimarySaleItemsParams = Optional<
	ListPrimarySaleItemsQueryOptions,
	'config'
>;

/**
 * Hook to fetch primary sale items with pagination support
 *
 * Retrieves a paginated list of primary sale items for a specific contract address
 * from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.filter - Optional filter parameters for the query
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing the primary sale items data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 * })
 * ```
 *
 * @example
 * With filters and pagination:
 * ```typescript
 * const { data, isLoading } = useListPrimarySaleItems({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x...',
 *   filter: { status: 'active' },
 *   page: { page: 1, pageSize: 20 },
 *   query: {
 *     enabled: isReady
 *   }
 * })
 * ```
 */
export function useListPrimarySaleItems(params: UseListPrimarySaleItemsParams) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listPrimarySaleItemsQueryOptions({
		config,
		...rest,
	});

	return useInfiniteQuery(queryOptions);
}

export type { ListPrimarySaleItemsQueryOptions };
