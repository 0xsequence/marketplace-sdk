'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchPrimarySaleItemParams,
	type PrimarySaleItemQueryOptions,
	primarySaleItemQueryOptions,
} from '../../../queries/primary-sales/primarySaleItem';
import { useConfig } from '../../config/useConfig';

export type UsePrimarySaleItemParams = Optional<
	PrimarySaleItemQueryOptions,
	'config'
>;

/**
 * Hook to fetch a single primary sale item
 *
 * Retrieves details for a specific primary sale item from a primary sale contract.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.tokenId - The token ID of the primary sale item
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the primary sale item data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: item, isLoading } = usePrimarySaleItem({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 *   tokenId: '1',
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = usePrimarySaleItem({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     enabled: Boolean(primarySaleContractAddress && tokenId),
 *     staleTime: 30_000
 *   }
 * })
 * ```
 */
export function usePrimarySaleItem(params: UsePrimarySaleItemParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = primarySaleItemQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { primarySaleItemQueryOptions };

export type { FetchPrimarySaleItemParams, PrimarySaleItemQueryOptions };
