'use client';

import { useChain, useWaasFeeOptions } from '@0xsequence/connect';
import { useCallback, useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOptionExtended } from '../../../types/waas-types';
import { useCollectionBalanceDetails } from '../collection/balance-details';

export enum AutoSelectFeeOptionError {
	InsufficientBalanceForAnyFeeOption = 'Insufficient balance for any fee option',
}

type UseAutoSelectFeeOptionArgs = {
	enabled?: boolean;
};

/**
 * A React hook that automatically selects the first fee option for which the user has sufficient balance.
 * Uses useWaasFeeOptions internally to get pending fee option confirmations.
 *
 * @param {Object} params - Hook configuration
 * @param {boolean} [params.enabled] - Whether the hook should be enabled
 *
 * @returns {() => Promise<{
 *   selectedOption: FeeOptionExtended | null,
 *   error: null
 * }>} A function that returns a promise resolving to an object with:
 *   - selectedOption: The first fee option with sufficient balance, or null if none found or conditions not met
 *   - error: Always null (maintained for API consistency)
 *
 * The function returns `{ selectedOption: null, error: null }` in the following cases:
 *   - User wallet is not connected
 *   - Hook is disabled (enabled = false)
 *   - No fee options are available
 *   - Balance data is still loading
 *   - Balance data failed to load
 *
 * @throws {Error} Only throws when user has insufficient balance for all available fee options:
 *   - "Insufficient balance for any fee option": When user has insufficient balance for all options
 *     - error.cause will contain: "Add more funds to your wallet to cover the fee"
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
 *   const autoSelectFeeOption = useAutoSelectFeeOption({ enabled: true });
 *
 *   useEffect(() => {
 *     autoSelectFeeOption()
 *       .then((result) => {
 *         if (pendingFeeOptionConfirmation?.id && result.selectedOption) {
 *           confirmPendingFeeOption(
 *             pendingFeeOptionConfirmation.id,
 *             result.selectedOption.token.contractAddress
 *           );
 *         } else if (!result.selectedOption) {
 *           console.log('No fee option selected - wallet may not be connected or balances loading');
 *         }
 *       })
 *       .catch((error) => {
 *         console.error('Insufficient balance for fee options:', error.message);
 *         console.log('Suggestion:', error.cause);
 *       });
 *   }, [autoSelectFeeOption, confirmPendingFeeOption, pendingFeeOptionConfirmation]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAutoSelectFeeOption({
	enabled,
}: UseAutoSelectFeeOptionArgs) {
	const { address: userAddress } = useAccount();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();

	// one token that has null contract address is native token, so we need to replace it with zero address
	const contractWhitelist = pendingFeeOptionConfirmation?.options?.map(
		(option) =>
			option.token.contractAddress === null
				? zeroAddress
				: (option.token.contractAddress as Address),
	);

	const {
		data: balanceDetails,
		isLoading: isBalanceDetailsLoading,
		isError: isBalanceDetailsError,
	} = useCollectionBalanceDetails({
		chainId: pendingFeeOptionConfirmation?.chainId || 0,
		filter: {
			accountAddresses: userAddress ? [userAddress] : [],
			contractWhitelist,
			omitNativeBalances: false,
		},
		query: {
			enabled:
				!!pendingFeeOptionConfirmation?.options && !!userAddress && enabled,
		},
	});
	const chain = useChain(pendingFeeOptionConfirmation?.chainId || 0);

	// combine native balance and erc20 balances
	const combinedBalances = balanceDetails && [
		...balanceDetails.nativeBalances.map((b) => ({
			chainId: pendingFeeOptionConfirmation?.chainId || 0,
			balance: b.balance,
			symbol: chain?.nativeCurrency.symbol,
			contractAddress: zeroAddress,
		})),
		...balanceDetails.balances.map((b) => ({
			chainId: b.chainId,
			balance: b.balance,
			symbol: b.contractInfo?.symbol,
			contractAddress: b.contractAddress,
		})),
	];

	useEffect(() => {
		if (combinedBalances && enabled) {
			console.debug('currency balances', combinedBalances);
		}
	}, [combinedBalances, enabled]);

	const autoSelectedOption = useCallback(async () => {
		if (
			!userAddress ||
			isBalanceDetailsLoading ||
			isBalanceDetailsError ||
			!pendingFeeOptionConfirmation?.options ||
			!enabled
		) {
			return { selectedOption: null, error: null };
		}

		const selectedOption = pendingFeeOptionConfirmation?.options?.find(
			(option) => {
				const tokenBalance = combinedBalances?.find(
					(balance) =>
						balance.contractAddress.toLowerCase() ===
						(option.token.contractAddress === null
							? zeroAddress
							: (option.token.contractAddress as string)
						).toLowerCase(),
				);

				if (!tokenBalance) return false;

				return BigInt(tokenBalance.balance) >= BigInt(option.value);
			},
		) as FeeOptionExtended | undefined;

		if (!selectedOption) {
			const error = new Error(
				AutoSelectFeeOptionError.InsufficientBalanceForAnyFeeOption,
			);
			error.message = 'Insufficient balance for any fee option';
			error.cause = 'Add more funds to your wallet to cover the fee';
			throw error;
		}

		return { selectedOption, error: null };
	}, [
		userAddress,
		pendingFeeOptionConfirmation?.options,
		pendingFeeOptionConfirmation?.id,
		isBalanceDetailsLoading,
		isBalanceDetailsError,
		combinedBalances,
		enabled,
	]);

	return autoSelectedOption;
}
