'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { usePublicClient } from 'wagmi';
import {
	type CurrencyBalanceQueryOptions,
	type CurrencyBalanceReturn,
	type FetchCurrencyBalanceParams,
	currencyBalanceQueryOptions,
} from '../queries/currencyBalance';

export type UseCurrencyBalanceParams = {
	currencyAddress: Address | undefined;
	chainId: number | undefined;
	userAddress: Address | undefined;
	query?: {
		enabled?: boolean;
	};
};

/**
 * Hook to fetch cryptocurrency balance for a user
 *
 * Retrieves the balance of a specific currency (native token or ERC-20)
 * for a given user address. Handles both native tokens (ETH, MATIC, etc.)
 * and ERC-20 tokens with automatic decimal formatting.
 *
 * @param params - Configuration parameters
 * @param params.currencyAddress - The currency contract address (use zero address for native tokens)
 * @param params.chainId - The chain ID to query on
 * @param params.userAddress - The user address to check balance for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing raw and formatted balance values
 *
 * @example
 * Native token balance (ETH):
 * ```typescript
 * const { data: ethBalance, isLoading } = useCurrencyBalance({
 *   currencyAddress: '0x0000000000000000000000000000000000000000', // Zero address for ETH
 *   chainId: 1,
 *   userAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`ETH Balance: ${data.formatted} ETH`); // e.g., "1.5 ETH"
 *   console.log(`Raw balance: ${data.value.toString()}`); // e.g., "1500000000000000000"
 * }
 * ```
 *
 * @example
 * ERC-20 token balance (USDC):
 * ```typescript
 * const { data: usdcBalance } = useCurrencyBalance({
 *   currencyAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
 *   chainId: 1,
 *   userAddress: userAddress,
 *   query: {
 *     enabled: Boolean(userAddress), // Only fetch when user is connected
 *     refetchInterval: 30000 // Update every 30 seconds
 *   }
 * })
 *
 * if (data) {
 *   console.log(`USDC Balance: $${data.formatted}`); // e.g., "$1000.50"
 * }
 * ```
 *
 * @example
 * Conditional usage with wallet connection:
 * ```typescript
 * const { address: userAddress } = useAccount();
 *
 * const { data: balance, isLoading, error } = useCurrencyBalance({
 *   currencyAddress: selectedToken?.address,
 *   chainId: selectedChain?.id,
 *   userAddress: userAddress,
 *   query: {
 *     enabled: Boolean(userAddress && selectedToken && selectedChain)
 *   }
 * })
 *
 * if (isLoading) return <div>Loading balance...</div>;
 * if (error) return <div>Error loading balance</div>;
 * if (!data) return <div>No balance data</div>;
 *
 * return <div>Balance: {data.formatted}</div>;
 * ```
 */
export function useCurrencyBalance(params: UseCurrencyBalanceParams) {
	const { currencyAddress, chainId, userAddress, query } = params;
	const publicClient = usePublicClient({ chainId });

	const queryOptions = currencyBalanceQueryOptions(
		currencyAddress && chainId && userAddress && publicClient
			? {
					currencyAddress,
					chainId,
					userAddress,
					publicClient,
					query,
				}
			: skipToken,
	);

	return useQuery({
		...queryOptions,
	});
}

export { currencyBalanceQueryOptions };

export type {
	FetchCurrencyBalanceParams,
	CurrencyBalanceQueryOptions,
	CurrencyBalanceReturn,
};

// Legacy exports for backward compatibility
export type UseCurrencyBalanceArgs = {
	currencyAddress: Address | undefined;
	chainId: number | undefined;
	userAddress: Address | undefined;
};

export type UseCurrencyBalanceReturn = CurrencyBalanceReturn;
