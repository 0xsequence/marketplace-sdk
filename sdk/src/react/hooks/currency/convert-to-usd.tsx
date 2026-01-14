'use client';

import type { Address } from '@0xsequence/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type ConvertPriceToUSDQueryOptions,
	type ConvertPriceToUSDReturn,
	convertPriceToUSDQueryOptions,
	type FetchConvertPriceToUSDParams,
} from '../../queries/currency/convert-to-usd';
import { useConfig } from '../config/useConfig';

export type UseCurrencyConvertToUSDParams = Optional<
	ConvertPriceToUSDQueryOptions,
	'config'
>;

/**
 * Hook to convert a price amount from a specific currency to USD
 *
 * Converts cryptocurrency amounts to their USD equivalent using current exchange rates.
 * Fetches currency data and calculates the USD value based on the provided amount
 * and currency address.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.currencyAddress - The currency contract address to convert from
 * @param params.amountRaw - The raw amount in smallest units (e.g., wei for ETH)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing USD amount and formatted USD amount
 *
 * @example
 * Basic ETH to USD conversion:
 * ```typescript
 * const { data: conversion, isLoading } = useCurrencyConvertToUSD({
 *   chainId: 1,
 *   currencyAddress: '0x0000000000000000000000000000000000000000', // ETH
 *   amountRaw: '1000000000000000000' // 1 ETH in wei
 * })
 *
 * if (data) {
 *   console.log(`$${data.usdAmountFormatted}`); // e.g., "$2000.00"
 *   console.log(data.usdAmount); // e.g., 2000
 * }
 * ```
 *
 * @example
 * ERC-20 token conversion with conditional enabling:
 * ```typescript
 * const { data: conversion } = useCurrencyConvertToUSD({
 *   chainId: 137,
 *   currencyAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Polygon
 *   amountRaw: '1000000', // 1 USDC (6 decimals)
 *   query: {
 *     enabled: Boolean(userHasTokens),
 *     refetchInterval: 30000 // Update price every 30 seconds
 *   }
 * })
 * ```
 */
export function useCurrencyConvertToUSD(params: UseCurrencyConvertToUSDParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = convertPriceToUSDQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { convertPriceToUSDQueryOptions };

export type {
	FetchConvertPriceToUSDParams,
	ConvertPriceToUSDQueryOptions,
	ConvertPriceToUSDReturn,
};

// Legacy exports for backward compatibility
export type UseConvertPriceToUSDArgs = {
	chainId: number;
	currencyAddress: Address;
	amountRaw: string;
	query?: {
		enabled?: boolean;
	};
};

export type UseConvertPriceToUSDReturn = ConvertPriceToUSDReturn;
