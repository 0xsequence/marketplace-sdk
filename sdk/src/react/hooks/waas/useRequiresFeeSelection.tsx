'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption, FeeOptionExtended } from '../../../types/waas-types';
import { fetchCollectionBalanceDetails } from '../../queries/collectionBalanceDetails';
import { useConfig } from '../config/useConfig';

type UseRequiresFeeSelectionArgs = {
	/** Chain ID to check for fee requirements */
	chainId: number;
	/** Available fee options from the transaction */
	options?: FeeOption[];
	/** Whether the hook should fetch balance data */
	enabled?: boolean;
};

/**
 * Hook to determine if fee selection is required and provide fee options with balance information.
 *
 * Uses React Query for efficient balance fetching with automatic caching and refetching.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, isLoading } = useRequiresFeeSelection({
 *     chainId: 137,
 *     options: feeOptionsFromTransaction,
 *   });
 *
 *   if (!data?.isRequired) return null;
 *
 *   return (
 *     <div>
 *       <h3>Select Fee Token</h3>
 *       {isLoading ? (
 *         <Spinner />
 *       ) : (
 *         data.options.map(option => (
 *           <FeeOptionCard
 *             key={option.token.contractAddress}
 *             option={option}
 *             recommended={option === data.recommendedOption}
 *           />
 *         ))
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRequiresFeeSelection({
	chainId,
	options = [],
	enabled = true,
}: UseRequiresFeeSelectionArgs) {
	const { address: userAddress } = useAccount();
	const config = useConfig();

	// Convert null contract addresses to zero address for balance checking
	const contractWhitelist = useMemo(
		() =>
			options.map((option) =>
				option.token.contractAddress === null
					? zeroAddress
					: (option.token.contractAddress as Address),
			),
		[options],
	);

	// Fetch balances using React Query
	const balanceQuery = useQuery({
		queryKey: ['waas-fee-balances', chainId, userAddress, contractWhitelist],
		queryFn: () =>
			fetchCollectionBalanceDetails({
				chainId,
				filter: {
					accountAddresses: userAddress ? [userAddress] : [],
					contractWhitelist,
					omitNativeBalances: false,
				},
				config,
			}),
		enabled: enabled && options.length > 0 && !!userAddress,
		// Cache balance data for 30 seconds
		staleTime: 30_000,
		// Keep in cache for 5 minutes
		gcTime: 5 * 60_000,
	});

	// Transform query data into the expected format
	return useQuery({
		queryKey: [
			'waas-fee-selection',
			chainId,
			options,
			balanceQuery.data,
		] as const,
		queryFn: () => {
			const balanceDetails = balanceQuery.data;
			if (!balanceDetails) {
				throw new Error('Balance data not available');
			}

			// Create balance map
			const balanceMap = new Map<string, bigint>();

			// Add native token balance
			for (const nativeBalance of balanceDetails.nativeBalances) {
				balanceMap.set(
					zeroAddress.toLowerCase(),
					BigInt(nativeBalance.balance),
				);
			}

			// Add ERC20 balances
			for (const balance of balanceDetails.balances) {
				balanceMap.set(
					balance.contractAddress.toLowerCase(),
					BigInt(balance.balance),
				);
			}

			// Enhance fee options with balance information
			const enhancedOptions: FeeOptionExtended[] = options.map((option) => {
				const contractAddress = (
					option.token.contractAddress === null
						? zeroAddress
						: option.token.contractAddress
				).toLowerCase();

				const balance = balanceMap.get(contractAddress) || 0n;
				const feeValue = BigInt(option.value);
				const hasEnoughBalanceForFee = balance >= feeValue;

				// Format balance with proper decimals
				const balanceFormatted = (
					Number(balance) /
					10 ** option.token.decimals
				).toFixed(4);

				return {
					...option,
					balance: balance.toString(),
					balanceFormatted,
					hasEnoughBalanceForFee,
				};
			});

			// Find recommended option (first with sufficient balance, or first option)
			const recommendedOption =
				enhancedOptions.find((opt) => opt.hasEnoughBalanceForFee) ||
				enhancedOptions[0] ||
				null;

			return {
				isRequired: options.length > 1,
				options: enhancedOptions,
				recommendedOption,
			};
		},
		enabled: balanceQuery.isSuccess && options.length > 0,
		// This data is derived from balance data, so use the same staleness
		staleTime: 30_000,
		gcTime: 5 * 60_000,
	});
}
