'use client';

import type { Address, Indexer } from '@0xsequence/api-client';
import { useChain } from '@0xsequence/connect';
import { useCallback, useEffect } from 'react';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../types/waas-types';
import { useCollectionBalanceDetails } from '../collection/balance-details';

enum AutoSelectFeeOptionError {
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
 *   error: AutoSelectFeeOptionError | null,
 *   isLoading?: boolean
 * }>} A promise that resolves to an object containing:
 *   - selectedOption: The first fee option with sufficient balance, or null if none found
 *   - error: Error message if selection fails, null otherwise
 *   - isLoading: True while checking balances
 *
 * @throws {AutoSelectFeeOptionError} Possible errors:
 *   - UserNotConnected: When no wallet is connected
 *   - NoOptionsProvided: When fee options array is undefined
 *   - FailedToCheckBalances: When balance checking fails
 *   - InsufficientBalanceForAnyFeeOption: When user has insufficient balance for all options
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
 *     autoSelectOptionPromise.then((result) => {
 *       if (result.isLoading) {
 *         console.log('Checking balances...');
 *         return;
 *       }
 *
 *       if (result.error) {
 *         console.error('Failed to select fee option:', result.error);
 *         return;
 *       }
 *
 *       if (pendingFeeOptionConfirmation?.id && result.selectedOption) {
 *         confirmPendingFeeOption(
 *           pendingFeeOptionConfirmation.id,
 *           result.selectedOption.token.contractAddress
 *         );
 *       }
 *     });
 *   }, [autoSelectOptionPromise, confirmPendingFeeOption, pendingFeeOptionConfirmation]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
/**
 * Normalizes WaaS fee option token address to viem Address type
 * - null represents native token (converted to zeroAddress)
 * - string addresses from WaaS are validated and guaranteed to be hex addresses
 */
function normalizeWaasFeeTokenAddress(contractAddress: string | null): Address {
	if (contractAddress === null) {
		return zeroAddress;
	}
	// WaaS returns validated hex addresses, but TypeScript doesn't know they're `0x${string}`
	// We validate to be safe and satisfy the type system
	if (!contractAddress.startsWith('0x')) {
		throw new Error(`Invalid address from WaaS: ${contractAddress}`);
	}
	return contractAddress as Address;
}

export function useAutoSelectFeeOption({
	pendingFeeOptionConfirmation,
	enabled,
}: UseAutoSelectFeeOptionArgs) {
	const { address: userAddress } = useAccount();

	const isEnabled = enabled ?? true;

	const contractWhitelist = pendingFeeOptionConfirmation.options?.map(
		(option) => normalizeWaasFeeTokenAddress(option.token.contractAddress),
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
				!!pendingFeeOptionConfirmation.options && !!userAddress && isEnabled,
		},
	});
	const chain = useChain(pendingFeeOptionConfirmation.chainId);

	// combine native balance and erc20 balances
	const combinedBalances = balanceDetails && [
		...balanceDetails.nativeBalances.map((b: Indexer.NativeTokenBalance) => ({
			chainId: pendingFeeOptionConfirmation.chainId,
			balance: b.balance,
			symbol: chain?.nativeCurrency.symbol,
			contractAddress: zeroAddress,
		})),
		...balanceDetails.balances.map((b: Indexer.TokenBalance) => ({
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

	// eslint-disable-next-line @typescript-eslint/require-await -- Async for interface consistency
	const autoSelectedOption = useCallback(async () => {
		if (!userAddress) {
			return {
				selectedOption: null,
				error: AutoSelectFeeOptionError.UserNotConnected,
			};
		}

		if (!pendingFeeOptionConfirmation.options) {
			return {
				selectedOption: null,
				error: AutoSelectFeeOptionError.NoOptionsProvided,
			};
		}

		if (isBalanceDetailsLoading) {
			return { selectedOption: null, error: null, isLoading: true };
		}

		if (isBalanceDetailsError || !combinedBalances) {
			return {
				selectedOption: null,
				error: AutoSelectFeeOptionError.FailedToCheckBalances,
			};
		}

		const selectedOption = pendingFeeOptionConfirmation.options.find(
			(option) => {
				const normalizedAddress = normalizeWaasFeeTokenAddress(
					option.token.contractAddress,
				);
				const tokenBalance = combinedBalances.find(
					(balance: { contractAddress: Address }) =>
						balance.contractAddress.toLowerCase() ===
						normalizedAddress.toLowerCase(),
				);

				if (!tokenBalance) return false;

				return BigInt(tokenBalance.balance) >= BigInt(option.value);
			},
		);

		if (!selectedOption) {
			return {
				selectedOption: null,
				error: AutoSelectFeeOptionError.InsufficientBalanceForAnyFeeOption,
			};
		}

		return { selectedOption, error: null };
	}, [
		userAddress,
		pendingFeeOptionConfirmation.options,
		isBalanceDetailsLoading,
		isBalanceDetailsError,
		combinedBalances,
		isEnabled,
	]);

	return autoSelectedOption();
}
