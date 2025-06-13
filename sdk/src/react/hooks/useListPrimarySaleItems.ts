'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type FetchListPrimarySaleItemsParams,
	type ListPrimarySaleItemsQueryOptions,
	listPrimarySaleItemsQueryOptions,
} from '../queries/listPrimarySaleItems';
import { useConfig } from './useConfig';

export type UseListPrimarySaleItemsParams = Optional<
	ListPrimarySaleItemsQueryOptions,
	'config'
>;

/**
 * Hook to list primary sale items
 *
 * Fetches a list of primary sale items for a given primary sale contract.
 * Useful for displaying available items in primary sales.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.filter - Optional filter criteria for primary sale items
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the list of primary sale items
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: items, isLoading } = useListPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data: items } = useListPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 *   page: { page: 1, pageSize: 20 }
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

	return useQuery({
		...queryOptions,
	});
}

export { listPrimarySaleItemsQueryOptions };

export type {
	FetchListPrimarySaleItemsParams,
	ListPrimarySaleItemsQueryOptions,
};
