'use client';

import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type { MarketplaceKind, Optional } from '../../_internal';
import {
	type CheckoutOptionsQueryOptions,
	checkoutOptionsQueryOptions,
	type FetchCheckoutOptionsParams,
} from '../../queries/market/checkoutOptions';
import { useConfig } from '../config/useConfig';

export type UseCheckoutOptionsParams = Optional<
	CheckoutOptionsQueryOptions,
	'config' | 'walletAddress'
>;

/**
 * Hook to fetch checkout options for marketplace orders
 *
 * Retrieves checkout options including available payment methods, fees, and transaction details
 * for a set of marketplace orders. Requires a connected wallet to calculate wallet-specific options.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.orders - Array of orders to checkout containing collection address, order ID, and marketplace
 * @param params.additionalFee - Additional fee to include in checkout (defaults to 0)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing checkout options with payment methods and fees
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: checkoutOptions, isLoading } = useCheckoutOptions({
 *   chainId: 137,
 *   orders: [{
 *     collectionAddress: '0x1234...',
 *     orderId: '123',
 *     marketplace: MarketplaceKind.sequence_marketplace_v2
 *   }],
 *   additionalFee: 0
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data: checkoutOptions } = useCheckoutOptions({
 *   chainId: 1,
 *   orders: orders,
 *   query: {
 *     enabled: orders.length > 0,
 *     staleTime: 30000
 *   }
 * })
 * ```
 */
export function useCheckoutOptions(params: UseCheckoutOptionsParams) {
	const { address } = useAccount();
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = checkoutOptionsQueryOptions({
		config,
		walletAddress: address as Address,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { checkoutOptionsQueryOptions };

export type { FetchCheckoutOptionsParams, CheckoutOptionsQueryOptions };

// Legacy export for backward compatibility
export type UseCheckoutOptionsArgs = {
	chainId: number;
	orders: Array<{
		collectionAddress: string;
		orderId: string;
		marketplace: MarketplaceKind;
	}>;
	query?: {
		enabled?: boolean;
	};
};

export type UseCheckoutOptionsReturn = Awaited<
	ReturnType<
		typeof import('../../queries/market/checkoutOptions').fetchCheckoutOptions
	>
>;
