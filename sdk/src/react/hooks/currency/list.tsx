'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchMarketCurrenciesParams,
	type MarketCurrenciesQueryOptions,
	marketCurrenciesQueryOptions,
} from '../../queries/currency/list';
import { useConfig } from '../config/useConfig';

export type UseCurrencyListParams = Optional<
	MarketCurrenciesQueryOptions,
	'config'
>;

/**
 * Hook to fetch supported currencies for a marketplace
 *
 * Retrieves the list of currencies supported by the marketplace for a specific chain.
 * Can optionally filter to exclude native currency or filter by collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.includeNativeCurrency - Whether to include native currency (default: true)
 * @param params.collectionAddress - Optional collection address to filter currencies
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing supported currencies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCurrencyList({
 *   chainId: 137
 * })
 * ```
 *
 * @example
 * Exclude native currency:
 * ```typescript
 * const { data, isLoading } = useCurrencyList({
 *   chainId: 1,
 *   includeNativeCurrency: false
 * })
 * ```
 */
export function useCurrencyList(params: UseCurrencyListParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = marketCurrenciesQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { marketCurrenciesQueryOptions };

export type { FetchMarketCurrenciesParams, MarketCurrenciesQueryOptions };
