'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { CheckoutOptionsItem } from '../../_internal';
import {
	type FetchPrimarySaleCheckoutOptionsParams,
	type fetchPrimarySaleCheckoutOptions,
	type PrimarySaleCheckoutOptionsQueryOptions,
	primarySaleCheckoutOptionsQueryOptions,
} from '../../queries/checkout/primary-sale-checkout-options';
import { useConfig } from '../config/useConfig';

export type UsePrimarySaleCheckoutOptionsParams = Omit<
	FetchPrimarySaleCheckoutOptionsParams,
	'walletAddress'
> &
	Partial<Pick<PrimarySaleCheckoutOptionsQueryOptions, 'query' | 'config'>>;

/**
 * Hook to fetch checkout options for primary sale contract items
 *
 * Retrieves checkout options including available payment methods, fees, and transaction details
 * for items from a primary sales contract. Requires a connected wallet to calculate wallet-specific options.
 *
 * @param params - Configuration parameters or skipToken to skip the query
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The primary sales contract address
 * @param params.collectionAddress - The collection contract address
 * @param params.items - Array of items to purchase with tokenId and quantity
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing checkout options with payment methods and fees
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: checkoutOptions, isLoading } = usePrimarySaleCheckoutOptions({
 *   chainId: 137,
 *   contractAddress: '0x1234...',
 *   collectionAddress: '0x5678...',
 *   items: [{
 *     tokenId: '1',
 *     quantity: '1'
 *   }]
 * })
 * ```
 *
 * @example
 * With skipToken to conditionally skip:
 * ```typescript
 * const { data: checkoutOptions } = usePrimarySaleCheckoutOptions(
 *   items.length > 0 ? {
 *     chainId: 1,
 *     contractAddress: contractAddress,
 *     collectionAddress: collectionAddress,
 *     items: items
 *   } : skipToken
 * )
 * ```
 */
export function usePrimarySaleCheckoutOptions(
	params: UsePrimarySaleCheckoutOptionsParams | typeof skipToken,
) {
	const { address } = useAccount();
	const defaultConfig = useConfig();

	const queryOptions = primarySaleCheckoutOptionsQueryOptions(
		params === skipToken || !address
			? {
					config: defaultConfig,
					walletAddress:
						address ?? '0x0000000000000000000000000000000000000000',
					chainId: 0,
					contractAddress:
						'0x0000000000000000000000000000000000000000' as `0x${string}`,
					collectionAddress:
						'0x0000000000000000000000000000000000000000' as `0x${string}`,
					items: [],
					query: { enabled: false },
				}
			: {
					...params,
					config: params.config ?? defaultConfig,
					walletAddress: address,
				},
	);

	return useQuery({
		...queryOptions,
	});
}

export { primarySaleCheckoutOptionsQueryOptions };

export type { FetchPrimarySaleCheckoutOptionsParams };

// Legacy exports for backward compatibility
export type UsePrimarySaleCheckoutOptionsArgs = {
	chainId: number;
	contractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
};

export type UsePrimarySaleCheckoutOptionsReturn = Awaited<
	ReturnType<typeof fetchPrimarySaleCheckoutOptions>
>;
