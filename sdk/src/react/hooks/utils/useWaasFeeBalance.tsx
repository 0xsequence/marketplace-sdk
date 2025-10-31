import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../types/waas-types';
import { useTokenCurrencyBalance } from '..';

interface UseWaasFeeBalanceParams {
	chainId: number;
	selectedFeeOption?: FeeOption;
	pendingFeeOptionConfirmation?: WaasFeeOptionConfirmation;
}

/**
 * A React hook that manages balance checking and validation for WaaS (Wallet-as-a-Service) fee payments.
 * 
 * This hook determines if a user has sufficient balance to pay for a selected fee option in WaaS transactions.
 * It fetches the user's token balance for the fee payment currency and compares it against the required fee amount.
 * The hook also detects sponsored transactions where no fee payment is required.
 * 
 * @param params - Configuration parameters for the hook
 * @param params.chainId - The blockchain network ID where the transaction will be executed
 * @param params.selectedFeeOption - The currently selected fee payment option containing token details and fee amount
 * @param params.pendingFeeOptionConfirmation - Pending fee confirmation data, used to detect sponsored transactions
 * 
 * @returns An object containing balance information and validation results:
 * - `currencyBalance`: The user's current balance for the fee token (raw bigint value and formatted string)
 * - `currencyBalanceLoading`: Boolean indicating if the balance query is still loading
 * - `insufficientBalance`: Boolean indicating if the user lacks sufficient balance to pay the fee
 * - `isSponsored`: Boolean indicating if the transaction is sponsored (no fee required)
 * 
 * @example
 * Basic usage in a fee selection component:
 * ```tsx
 * function FeeSelector({ chainId, selectedFeeOption, pendingConfirmation }) {
 *   const { 
 *     currencyBalance, 
 *     currencyBalanceLoading, 
 *     insufficientBalance, 
 *     isSponsored 
 *   } = useWaasFeeBalance({
 *     chainId,
 *     selectedFeeOption,
 *     pendingFeeOptionConfirmation: pendingConfirmation,
 *   });
 * 
 *   if (isSponsored) {
 *     return <div>Transaction is sponsored - no fee required</div>;
 *   }
 * 
 *   if (currencyBalanceLoading) {
 *     return <div>Checking balance...</div>;
 *   }
 * 
 *   if (insufficientBalance) {
 *     return <div>Insufficient balance to pay fee</div>;
 *   }
 * 
 *   return (
 *     <div>
 *       Balance: {currencyBalance?.formatted} {selectedFeeOption?.token.symbol}
 *       Fee: {selectedFeeOption?.value} {selectedFeeOption?.token.symbol}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link useTokenCurrencyBalance} - The underlying hook used for fetching token balances
 * @see {@link FeeOption} - Type definition for fee payment options
 * @see {@link WaasFeeOptionConfirmation} - Type definition for fee confirmation data
 */
export const useWaasFeeBalance = ({
	chainId,
	selectedFeeOption,
	pendingFeeOptionConfirmation,
}: UseWaasFeeBalanceParams) => {
	const { address: userAddress } = useAccount();

	const { data: currencyBalance, isLoading: currencyBalanceLoading } =
		useTokenCurrencyBalance({
			chainId,
			currencyAddress: (selectedFeeOption?.token.contractAddress ||
				zeroAddress) as Address,
			userAddress: userAddress as Address,
		});

	const insufficientBalance = (() => {
		if (!selectedFeeOption?.value || !selectedFeeOption.token.decimals) {
			return false;
		}

		if (!currencyBalance?.value && currencyBalance?.value !== 0n) {
			return true;
		}

		try {
			const feeValue = BigInt(selectedFeeOption.value);
			return currencyBalance.value === 0n || currencyBalance.value < feeValue;
		} catch {
			return true;
		}
	})();

	return {
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		isSponsored: pendingFeeOptionConfirmation?.options?.length === 0,
	};
};
