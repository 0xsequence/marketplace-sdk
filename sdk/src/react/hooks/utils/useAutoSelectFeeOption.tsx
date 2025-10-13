'use client';

import { useChain } from '@0xsequence/connect';
import { useCallback, useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount, useChainId } from 'wagmi';
import type { FeeOption } from '../../../types/waas-types';
import { useConfig } from '../config/useConfig';
import { useCollectionBalanceDetails } from '../data/collections/useCollectionBalanceDetails';
import {
	useWaasFeeOptions,
	type WaasFeeOptionsConfig,
} from './useWaasFeeOptions';

enum AutoSelectFeeOptionError {
	UserNotConnected = 'User not connected',
	NoOptionsProvided = 'No options provided',
	FailedToCheckBalances = 'Failed to check balances',
	InsufficientBalanceForAnyFeeOption = 'Insufficient balance for any fee option',
}

type UseAutoSelectFeeOptionArgsInternal = {
	enabled?: boolean;
	waasFeeOptionsConfig?: WaasFeeOptionsConfig;
};

type UseAutoSelectFeeOptionArgsExternal = {
	pendingFeeOptionConfirmation: {
		id: string;
		options: FeeOption[] | undefined;
		chainId: number;
	};
	enabled?: boolean;
};

type UseAutoSelectFeeOptionArgs =
	| UseAutoSelectFeeOptionArgsInternal
	| UseAutoSelectFeeOptionArgsExternal;

/**
 * A React hook that automatically selects the first fee option for which the user has sufficient balance.
 *
 * This hook can be used in two modes:
 * 1. Internal mode: Uses current wallet chain ID and fetches fee options internally
 * 2. External mode: Pass pendingFeeOptionConfirmation from useWaasFeeOptions (backwards compatible)
 *
 * @param {UseAutoSelectFeeOptionArgs} args - Configuration for fee option selection (optional)
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
 * // New internal mode (recommended)
 * function MyComponent() {
 *   const autoSelectOptionPromise = useAutoSelectFeeOption();
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
 *       console.log('Auto-selected option:', result.selectedOption);
 *     });
 *   }, [autoSelectOptionPromise]);
 *
 *   return <div>...</div>;
 * }
 *
 * // Backwards compatible external mode
 * function MyLegacyComponent() {
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
 *   // ... rest of the logic
 * }
 * ```
 */
export function useAutoSelectFeeOption(args: UseAutoSelectFeeOptionArgs = {}) {
	const { address: userAddress } = useAccount();
	const currentChainId = useChainId();
	const sdkConfig = useConfig();

	// Type guard to determine which mode we're in
	const isInternalMode = !('pendingFeeOptionConfirmation' in args);

	// Determine the chain ID to use
	const resolvedChainId = isInternalMode
		? currentChainId
		: (args as UseAutoSelectFeeOptionArgsExternal).pendingFeeOptionConfirmation
				.chainId;

	// Internal mode: use useWaasFeeOptions hook
	const { pendingFeeOptionConfirmation, confirmPendingFeeOption } =
		useWaasFeeOptions(
			isInternalMode ? resolvedChainId : 1, // fallback chainId for external mode
			sdkConfig,
			isInternalMode
				? (args as UseAutoSelectFeeOptionArgsInternal).waasFeeOptionsConfig
				: undefined,
		);

	// Determine the actual pending fee option confirmation to use
	const _pendingFeeOptionConfirmation = isInternalMode
		? pendingFeeOptionConfirmation
		: (args as UseAutoSelectFeeOptionArgsExternal).pendingFeeOptionConfirmation;

	const enabled = args.enabled ?? true;
	const chainId = resolvedChainId;

	// one token that has null contract address is native token, so we need to replace it with zero address
	const contractWhitelist = _pendingFeeOptionConfirmation?.options?.map(
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
		chainId: chainId || 1,
		filter: {
			accountAddresses: userAddress ? [userAddress] : [],
			contractWhitelist,
			omitNativeBalances: false,
		},
		query: {
			enabled:
				!!_pendingFeeOptionConfirmation?.options &&
				!!userAddress &&
				enabled &&
				!!chainId,
		},
	});
	const chain = useChain(chainId || 1);

	// combine native balance and erc20 balances
	const combinedBalances = balanceDetails && [
		...balanceDetails.nativeBalances.map((b) => ({
			chainId: chainId || 1,
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
			return {
				selectedOption: null,
				error: AutoSelectFeeOptionError.UserNotConnected,
			};
		}

		if (!_pendingFeeOptionConfirmation?.options) {
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

		const selectedOption = _pendingFeeOptionConfirmation.options?.find(
			(option) => {
				const tokenBalance = combinedBalances.find(
					(balance) =>
						balance.contractAddress.toLowerCase() ===
						(option.token.contractAddress === null
							? zeroAddress
							: option.token.contractAddress
						)?.toLowerCase(),
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

		if (
			isInternalMode &&
			_pendingFeeOptionConfirmation.id &&
			selectedOption.token.contractAddress
		) {
			confirmPendingFeeOption(
				_pendingFeeOptionConfirmation.id,
				selectedOption.token.contractAddress,
			);
		}

		return { selectedOption, error: null };
	}, [
		userAddress,
		_pendingFeeOptionConfirmation?.options,
		_pendingFeeOptionConfirmation?.id,
		isBalanceDetailsLoading,
		isBalanceDetailsError,
		combinedBalances,
		isInternalMode,
		confirmPendingFeeOption,
	]);

	return autoSelectedOption();
}
