import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../../../types/waas-types';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import { useSelectWaasFeeOptionsStore, selectWaasFeeOptions$ } from './store';

const useWaasFeeOptionManager = (chainId: number) => {
	const { address: userAddress } = useAccount();
	const { 
		selectedFeeOption, 
		setSelectedFeeOption,
		pendingFeeOptionConfirmation: storedPendingFeeOptionConfirmation,
		setPendingFeeOptionConfirmation 
	} = useSelectWaasFeeOptionsStore();
	
	const [pendingFeeOptionConfirmationFromHook, confirmPendingFeeOption] =
		useWaasFeeOptions();
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);

	// Update store when hook value changes
	useEffect(() => {
		setPendingFeeOptionConfirmation(pendingFeeOptionConfirmationFromHook as any);
	}, [pendingFeeOptionConfirmationFromHook, setPendingFeeOptionConfirmation]);

	const { data: currencyBalance, isLoading: currencyBalanceLoading } =
		useCurrencyBalance({
			chainId,
			currencyAddress: (selectedFeeOption?.token.contractAddress ||
				zeroAddress) as Address,
			userAddress: userAddress as Address,
		});

	useEffect(() => {
		if (!selectedFeeOption && storedPendingFeeOptionConfirmation) {
			if (storedPendingFeeOptionConfirmation.options.length > 0) {
				setSelectedFeeOption(
					storedPendingFeeOptionConfirmation.options[0] as FeeOption,
				);
			}
		}
	}, [storedPendingFeeOptionConfirmation, selectedFeeOption, setSelectedFeeOption]);

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
		if (!selectedFeeOption?.token || !storedPendingFeeOptionConfirmation?.id) return;

		confirmPendingFeeOption(
			storedPendingFeeOptionConfirmation?.id,
			selectedFeeOption.token.contractAddress || zeroAddress,
		);

		setFeeOptionsConfirmed(true);
	};

	return {
		selectedFeeOption$: selectWaasFeeOptions$.selectedFeeOption, // For backward compatibility with WaasFeeOptionsSelect
		selectedFeeOption,
		pendingFeeOptionConfirmation: storedPendingFeeOptionConfirmation,
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		feeOptionsConfirmed,
		handleConfirmFeeOption,
	};
};

export default useWaasFeeOptionManager;
