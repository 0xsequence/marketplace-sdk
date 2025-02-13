import type { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import type { FeeOption } from '../ui/modals/_internal/components/waasFeeOptionsSelect/WaasFeeOptionsSelect';
import { getBalance } from 'wagmi/actions';
import { useCallback } from 'react';

type Error =
	| 'User not connected'
	| 'No options provided'
	| 'Insufficient balance for any fee option'
	| 'Failed to check balances';

type UseAutoSelectFeeOptionArgs = {
	pendingFeeOptionConfirmation: {
		id: string;
		options: FeeOption[] | undefined;
		chainId: number;
	};
};

type AutoSelectFeeOptionResult = Promise<{
	selectedOption: FeeOption | null;
	error: Error | null;
	isLoading: boolean;
}>;

/**
 * Automatically selects the first fee option that user has enough balance for
 * @param pendingFeeOptionConfirmation
 * @returns The selected fee option, an error message if any, and a loading flag
 */
export function useAutoSelectFeeOption({
	pendingFeeOptionConfirmation,
}: UseAutoSelectFeeOptionArgs): AutoSelectFeeOptionResult {
	const { address: userAddress } = useAccount();
	const config = useConfig();

	const findAffordableOption = useCallback(async () => {
		if (!userAddress) {
			return {
				selectedOption: null,
				error: 'User not connected' as Error,
				isLoading: false,
			};
		}

		if (!pendingFeeOptionConfirmation.options) {
			return {
				selectedOption: null,
				error: 'No options provided' as Error,
				isLoading: false,
			};
		}

		try {
			// Try each option until we find an affordable one
			for (const option of pendingFeeOptionConfirmation.options) {
				if (!option.token.contractAddress) continue;

				try {
					const balance = await getBalance(config, {
						address: userAddress as Address,
						token: option.token.contractAddress as Address,
						chainId: pendingFeeOptionConfirmation.chainId,
					});

					const optionValue = BigInt(option.value);
					if (balance.value >= optionValue) {
						return {
							selectedOption: option,
							error: null,
							isLoading: false,
						};
					}
				} catch (error) {
					console.error(
						'Error fetching balance for currency:',
						option.token.contractAddress,
						error,
					);
				}
			}

			return {
				selectedOption: null,
				error: 'Insufficient balance for any fee option' as Error,
				isLoading: false,
			};
		} catch (error) {
			return {
				selectedOption: null,
				error: 'Failed to check balances' as Error,
				isLoading: false,
			};
		}
	}, [
		pendingFeeOptionConfirmation.options,
		pendingFeeOptionConfirmation.chainId,
		userAddress,
		config,
	]);

	return findAffordableOption();
}
