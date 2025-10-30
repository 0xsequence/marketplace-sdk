import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';
import { useTokenCurrencyBalance } from '../../../../../hooks';

interface UseWaasFeeBalanceParams {
	chainId: number;
	selectedFeeOption?: FeeOption;
	pendingFeeOptionConfirmation?: WaasFeeOptionConfirmation;
}

const useWaasFeeBalance = ({
	chainId,
	selectedFeeOption,
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
	};
};

export default useWaasFeeBalance;
