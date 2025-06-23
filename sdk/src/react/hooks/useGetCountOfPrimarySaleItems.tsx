'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type GetCountQueryOptions,
	getCountQueryOptions,
} from '../queries/primarySaleItems';
import { useConfig } from './useConfig';

export type UseGetCountParams = Optional<GetCountQueryOptions, 'config'>;

/**
 * Hook to get the total count of primary sale items
 *
 * Retrieves the total count of primary sale items for a specific contract address
 * from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.filter - Optional filter parameters for the query
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of primary sale items
 *
 * @example
 * ```typescript
 * const { data: count, isLoading } = useGetCountOfPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 * })
 * ```
 */
export function useGetCountOfPrimarySaleItems(params: UseGetCountParams) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;

	const queryOptions = getCountQueryOptions({
		config,
		...rest,
	});

	return useQuery(queryOptions);
}

export type { GetCountQueryOptions };
