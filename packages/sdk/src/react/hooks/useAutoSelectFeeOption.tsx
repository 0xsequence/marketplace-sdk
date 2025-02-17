import { zeroAddress, type Address } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../ui/modals/_internal/components/waasFeeOptionsSelect/WaasFeeOptionsSelect';
import { useCallback } from 'react';
import { useChain } from '@0xsequence/kit';
import { useCollectionBalanceDetails } from './useCollectionBalanceDetails';

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
};

/**
 * Automatically selects the first fee option that user has enough balance for
 * @param pendingFeeOptionConfirmation
 * @returns selectedOption: FeeOption | null, error: Error | null
 * @example
 * const { selectedOption, error } = useAutoSelectFeeOption({
 *  pendingFeeOptionConfirmation
 * });
 *
 * if (error) {
 * console.error(error);
 * }
 *
 * if (selectedOption) {
 * console.log(selectedOption);
 * }
 */
export function useAutoSelectFeeOption({
	pendingFeeOptionConfirmation,
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
			enabled: !!pendingFeeOptionConfirmation.options,
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

	console.debug('currency balances', combinedBalances);

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
	]);

	return autoSelectedOption();
}
