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
 *   selectedOption: FeeOption | null,
 *   error: null
 * }>} A function that returns a promise. The promise resolves to an object containing the selected fee option when successful,
 * or rejects with an error when selection fails.
 *   - selectedOption: The first fee option with sufficient balance
 *   - error: Always null on success
 *
 * @throws {Error} Possible errors:
 *   - "User not connected": When no wallet is connected
 *   - "No options provided": When fee options array is undefined
 *   - "Balances are still loading": When balance data is still being fetched
 *   - "Failed to check balances": When balance checking fails
 *   - "Insufficient balance for any fee option": When user has insufficient balance for all options
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
 *         }
 *       })
 *       .catch((error) => {
 *         if (error.message === 'Balances are still loading') {
 *           console.log('Balances still loading, will retry...');
 *           return;
 *         }
 *         console.error('Failed to select fee option:', error.message);
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
		if (combinedBalances) {
			console.debug('currency balances', combinedBalances);
		}
	}, [combinedBalances]);

	const autoSelectedOption = useCallback(async () => {
		if (
			!userAddress ||
			isBalanceDetailsLoading ||
			isBalanceDetailsError ||
			!pendingFeeOptionConfirmation?.options
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
			error.message = 'Add more funds to your wallet to cover the fee';
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
	]);

	return autoSelectedOption;
}
