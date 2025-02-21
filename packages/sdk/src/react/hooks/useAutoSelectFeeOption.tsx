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
			enabled: !!pendingFeeOptionConfirmation.options && !!userAddress,
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

		console.debug('auto selected option', selectedOption);

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
