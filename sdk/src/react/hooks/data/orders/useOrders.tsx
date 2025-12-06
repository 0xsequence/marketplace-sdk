'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchOrdersParams,
	type OrdersQueryOptions,
	ordersQueryOptions,
} from '../../../queries/orders';
import { useConfig } from '../../config/useConfig';

export type UseOrdersParams = Optional<OrdersQueryOptions, 'config'>;

/**
 * Hook to fetch orders from the marketplace
 *
 * Retrieves orders based on the provided parameters from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - Optional chain ID to filter orders
 * @param params.contractAddress - Optional contract address to filter orders
 * @param params.tokenId - Optional token ID to filter orders
 * @param params.maker - Optional maker address to filter orders
 * @param params.taker - Optional taker address to filter orders
 * @param params.status - Optional status to filter orders
 * @param params.side - Optional side to filter orders
 * @param params.pagination - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the orders data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useOrders({
 *   chainId: '137',
 *   contractAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data, isLoading } = useOrders({
 *   chainId: '1',
 *   pagination: {
 *     limit: 20,
 *     offset: 0
 *   },
 *   query: {
 *     refetchInterval: 15000
 *   }
 * })
 * ```
 */
export function useOrders(params: UseOrdersParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = ordersQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { ordersQueryOptions };

export type { FetchOrdersParams, OrdersQueryOptions };
