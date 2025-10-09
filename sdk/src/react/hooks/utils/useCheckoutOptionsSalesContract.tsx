'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type { CheckoutOptionsItem, Optional } from '../../_internal';
import {
	type CheckoutOptionsSalesContractQueryOptions,
	checkoutOptionsSalesContractQueryOptions,
	type FetchCheckoutOptionsSalesContractParams,
	type fetchCheckoutOptionsSalesContract,
} from '../../queries/market/checkoutOptionsSalesContract';
import { useConfig } from '../config/useConfig';

export type UseCheckoutOptionsSalesContractParams = Optional<
	CheckoutOptionsSalesContractQueryOptions,
	'config' | 'walletAddress'
>;

/**
 * Hook to fetch checkout options for sales contract items
 *
 * Retrieves checkout options including available payment methods, fees, and transaction details
 * for items from a sales contract. Requires a connected wallet to calculate wallet-specific options.
 *
 * @param params - Configuration parameters or skipToken to skip the query
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The sales contract address
 * @param params.collectionAddress - The collection contract address
 * @param params.items - Array of items to purchase with tokenId and quantity
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing checkout options with payment methods and fees
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: checkoutOptions, isLoading } = useCheckoutOptionsSalesContract({
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
 * const { data: checkoutOptions } = useCheckoutOptionsSalesContract(
 *   items.length > 0 ? {
 *     chainId: 1,
 *     contractAddress: contractAddress,
 *     collectionAddress: collectionAddress,
 *     items: items
 *   } : skipToken
 * )
 * ```
 */
export function useCheckoutOptionsSalesContract(
	params: UseCheckoutOptionsSalesContractParams | typeof skipToken,
) {
	const { address } = useAccount();
	const defaultConfig = useConfig();

	const queryOptions = checkoutOptionsSalesContractQueryOptions(
		params === skipToken
			? {
					config: defaultConfig,
					walletAddress: address as Address,
					chainId: 0,
					contractAddress: '',
					collectionAddress: '',
					items: [],
					query: { enabled: false },
				}
			: {
					config: defaultConfig,
					walletAddress: address as Address,
					...params,
				},
	);

	return useQuery({
		...queryOptions,
	});
}

export { checkoutOptionsSalesContractQueryOptions };

export type {
	FetchCheckoutOptionsSalesContractParams,
	CheckoutOptionsSalesContractQueryOptions,
};

// Legacy exports for backward compatibility
export type UseCheckoutOptionsSalesContractArgs = {
	chainId: number;
	contractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
};

export type UseCheckoutOptionsSalesContractReturn = Awaited<
	ReturnType<typeof fetchCheckoutOptionsSalesContract>
>;
