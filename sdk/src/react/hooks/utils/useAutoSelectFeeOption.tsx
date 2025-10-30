'use client';

import { useChain } from '@0xsequence/connect';
import { useCallback, useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../types/waas-types';
import { useCollectionBalanceDetails } from '../collection/balance-details';

export enum AutoSelectFeeOptionError {
	UserNotConnected = 'User not connected',
	NoOptionsProvided = 'No options provided',
	FailedToCheckBalances = 'Failed to check balances',
	InsufficientBalanceForAnyFeeOption = 'Insufficient balance for any fee option',
}

type UseAutoSelectFeeOptionArgs = {
	pendingFeeOptionConfirmation: {
		id: string;
		options: FeeOption[] | undefined;
		chainId: number;
	};
	enabled?: boolean;
};

/**
 * A React hook that automatically selects the first fee option for which the user has sufficient balance.
 *
 * @param {Object} params.pendingFeeOptionConfirmation - Configuration for fee option selection
 *
 * @returns {Promise<{
 *   selectedOption: FeeOption | null,
 *   error: null,
 *   isLoading?: boolean
 * }>} A promise that resolves to an object containing the selected fee option when successful,
 * or rejects with an error when selection fails.
 *   - selectedOption: The first fee option with sufficient balance
 *   - error: Always null on success
 *   - isLoading: True while checking balances (only returned during loading state)
 *
 * @throws {Error} Possible errors:
 *   - "User not connected": When no wallet is connected
 *   - "No options provided": When fee options array is undefined
 *   - "Failed to check balances": When balance checking fails
 *   - "Insufficient balance for any fee option": When user has insufficient balance for all options
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
 *
 *   const autoSelectOptionPromise = useAutoSelectFeeOption({
 *     pendingFeeOptionConfirmation: pendingFeeOptionConfirmation
 *       ? {
 *           id: pendingFeeOptionConfirmation.id,
 *           options: pendingFeeOptionConfirmation.options,
 *           chainId: 1
 *         }
 *       : {
 *           id: '',
 *           options: undefined,
 *           chainId: 1
 *         }
 *   });
 *
 *   useEffect(() => {
 *     autoSelectOptionPromise
 *       .then((result) => {
 *         if (result.isLoading) {
 *           console.log('Checking balances...');
 *           return;
 *         }
 *
 *         if (pendingFeeOptionConfirmation?.id && result.selectedOption) {
 *           confirmPendingFeeOption(
 *             pendingFeeOptionConfirmation.id,
 *             result.selectedOption.token.contractAddress
 *           );
 *         }
 *       })
 *       .catch((error) => {
 *         console.error('Failed to select fee option:', error.message);
 *       });
 *   }, [autoSelectOptionPromise, confirmPendingFeeOption, pendingFeeOptionConfirmation]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAutoSelectFeeOption({
	pendingFeeOptionConfirmation,
	enabled,
}: UseAutoSelectFeeOptionArgs) {
	const { address: userAddress } = useAccount();

	// one token that has null contract address is native token, so we need to replace it with zero address
	const contractWhitelist = pendingFeeOptionConfirmation.options?.map(
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
		chainId: pendingFeeOptionConfirmation.chainId,
		filter: {
			accountAddresses: userAddress ? [userAddress] : [],
			contractWhitelist,
			omitNativeBalances: false,
		},
		query: {
			enabled:
				!!pendingFeeOptionConfirmation.options && !!userAddress && enabled,
		},
	});
	const chain = useChain(pendingFeeOptionConfirmation.chainId);

	// combine native balance and erc20 balances
	const combinedBalances = balanceDetails && [
		...balanceDetails.nativeBalances.map((b) => ({
			chainId: pendingFeeOptionConfirmation.chainId,
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
		if (!userAddress) {
			throw new Error(AutoSelectFeeOptionError.UserNotConnected);
		}

		if (
			!pendingFeeOptionConfirmation.options ||
			pendingFeeOptionConfirmation.options.length === 0
		) {
			throw new Error(AutoSelectFeeOptionError.NoOptionsProvided);
		}

		if (!pendingFeeOptionConfirmation.id) {
			throw new Error(AutoSelectFeeOptionError.NoOptionsProvided);
		}

		if (isBalanceDetailsLoading) {
			return { selectedOption: null, error: null, isLoading: true };
		}

		if (isBalanceDetailsError || !combinedBalances) {
			throw new Error(AutoSelectFeeOptionError.FailedToCheckBalances);
		}

		const selectedOption = pendingFeeOptionConfirmation.options.find(
			(option) => {
				const tokenBalance = combinedBalances.find(
					(balance) =>
						balance.contractAddress.toLowerCase() ===
						(option.token.contractAddress === null
							? zeroAddress
							: option.token.contractAddress
						).toLowerCase(),
				);

				if (!tokenBalance) return false;

				return BigInt(tokenBalance.balance) >= BigInt(option.value);
			},
		);

		if (!selectedOption) {
			throw new Error(
				AutoSelectFeeOptionError.InsufficientBalanceForAnyFeeOption,
			);
		}

		return { selectedOption, error: null };
	}, [
		userAddress,
		pendingFeeOptionConfirmation.options,
		isBalanceDetailsLoading,
		isBalanceDetailsError,
		combinedBalances,
	]);

	return autoSelectedOption;
}
