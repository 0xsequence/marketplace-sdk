import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../../../types/waas-types';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import { selectWaasFeeOptions$ } from './store';

const useWaasFeeOptionManager = (chainId: number) => {
	const { address: userAddress } = useAccount();
	const selectedFeeOption$ = selectWaasFeeOptions$.selectedFeeOption;
	const [pendingFeeOptionConfirmation, confirmPendingFeeOption] =
		useWaasFeeOptions();
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);
	const selectedFeeOption = selectedFeeOption$.get();

	const { data: currencyBalance, isLoading: currencyBalanceLoading } =
		useCurrencyBalance({
			chainId,
			currencyAddress: (selectedFeeOption?.token.contractAddress ||
				zeroAddress) as Address,
			userAddress: userAddress as Address,
		});

	useEffect(() => {
		if (!selectedFeeOption && pendingFeeOptionConfirmation) {
			if (pendingFeeOptionConfirmation.options.length > 0) {
				selectedFeeOption$.set(
					pendingFeeOptionConfirmation.options[0] as FeeOption,
				);
			}
		}
	}, [pendingFeeOptionConfirmation]);

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

	const handleConfirmFeeOption = () => {
		if (!selectedFeeOption?.token || !pendingFeeOptionConfirmation?.id) return;

		confirmPendingFeeOption(
			pendingFeeOptionConfirmation?.id,
			selectedFeeOption.token.contractAddress || zeroAddress,
		);

		setFeeOptionsConfirmed(true);
	};

	return {
		selectedFeeOption$,
		selectedFeeOption,
		pendingFeeOptionConfirmation,
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		feeOptionsConfirmed,
		handleConfirmFeeOption,
	};
};

export default useWaasFeeOptionManager;
