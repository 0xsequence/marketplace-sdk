'use client';

import type { Address } from '@0xsequence/api-client';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useBalance, useReadContracts } from 'wagmi';

export type UseCurrencyBalanceArgs = {
	currencyAddress: Address | undefined;
	chainId: number | undefined;
	userAddress: Address | undefined;
	query?: {
		enabled?: boolean;
	};
};

type CurrencyBalanceData = { value: bigint; formatted: string };

type NativeBalanceResult = ReturnType<typeof useBalance>;

type Erc20BalanceResult = ReturnType<typeof useReadContracts>;

type CurrencyBalanceResult<T> = Omit<T, 'data'> & {
	data: CurrencyBalanceData | undefined;
};

export type UseTokenCurrencyBalanceResult =
	| CurrencyBalanceResult<NativeBalanceResult>
	| CurrencyBalanceResult<Erc20BalanceResult>;

/**
 * Hook to fetch cryptocurrency balance for a user
 *
 * Retrieves the balance of a specific currency (native token or ERC-20)
 * for a given user address using wagmi. Handles both native tokens (ETH, MATIC, etc.)
 * and ERC-20 tokens with automatic decimal formatting through direct blockchain calls.
 *
 * @param args - Configuration parameters
 * @param args.currencyAddress - The currency contract address (use zero address for native tokens)
 * @param args.chainId - The chain ID to query on
 * @param args.userAddress - The user address to check balance for
 * @param args.query - Optional wagmi query configuration
 *
 * @returns Wagmi query result containing raw and formatted balance values
 *
 * @example
 * Native token balance (ETH):
 * ```typescript
 * const { data: ethBalance, isLoading } = useTokenCurrencyBalance({
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
 * const { data: usdcBalance } = useTokenCurrencyBalance({
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
 */
export function useTokenCurrencyBalance(
	args: UseCurrencyBalanceArgs,
): UseTokenCurrencyBalanceResult {
	const { currencyAddress, chainId, userAddress, query } = args;

	// Check if all required parameters are present
	const hasAllParams = Boolean(currencyAddress && chainId && userAddress);
	const isNativeToken = currencyAddress === zeroAddress;

	// For native token (zero address), use useBalance
	const nativeBalance = useBalance({
		address: userAddress,
		chainId,
		query: {
			...query,
			enabled: hasAllParams && isNativeToken && (query?.enabled ?? true),
		},
	});

	// For ERC-20 tokens, use useReadContracts to get both balance and decimals
	const erc20Balance = useReadContracts({
		contracts:
			hasAllParams && !isNativeToken && currencyAddress && userAddress
				? [
						{
							address: currencyAddress,
							abi: erc20Abi,
							functionName: 'balanceOf',
							args: [userAddress],
							chainId,
						},
						{
							address: currencyAddress,
							abi: erc20Abi,
							functionName: 'decimals',
							chainId,
						},
					]
				: [],
		query: {
			...query,
			enabled: hasAllParams && !isNativeToken && (query?.enabled ?? true),
		},
	});

	if (isNativeToken) {
		return {
			...nativeBalance,
			data: nativeBalance.data
				? {
						value: nativeBalance.data.value,
						formatted: nativeBalance.data.formatted,
					}
				: undefined,
		};
	}

	const [balanceResult, decimalsResult] = erc20Balance.data || [];
	const balance = balanceResult?.result;
	const decimals = decimalsResult?.result;

	const formattedData =
		balance !== undefined && decimals !== undefined
			? {
					value: balance,
					formatted: formatUnits(balance, decimals),
				}
			: undefined;

	return {
		...erc20Balance,
		data: formattedData,
	};
}
