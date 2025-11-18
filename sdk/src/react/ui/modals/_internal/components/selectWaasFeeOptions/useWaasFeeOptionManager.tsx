import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';
import { useTokenCurrencyBalance } from '../../../../../hooks';
import { useSelectWaasFeeOptionsStore } from './store';

const useWaasFeeOptionManager = (chainId: number) => {
	const { address: userAddress } = useAccount();
	const {
		selectedFeeOption,
		setSelectedFeeOption,
		pendingFeeOptionConfirmation: storedPendingFeeOptionConfirmation,
		setPendingFeeOptionConfirmation,
	} = useSelectWaasFeeOptionsStore();

	const [pendingFeeOptionConfirmationFromHook, confirmPendingFeeOption] =
		useWaasFeeOptions();
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);

	// Update store when hook value changes
	// The @0xsequence/connect hook returns a type structurally compatible with
	// WaasFeeOptionConfirmation, but with slightly different optional field types
	// (e.g., string | undefined vs string | null). We cast here at the package boundary.
	useEffect(() => {
		setPendingFeeOptionConfirmation(
			pendingFeeOptionConfirmationFromHook as
				| WaasFeeOptionConfirmation
				| undefined,
		);
	}, [pendingFeeOptionConfirmationFromHook, setPendingFeeOptionConfirmation]);

	const { data: currencyBalance, isLoading: currencyBalanceLoading } =
		useTokenCurrencyBalance({
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
	}, [
		storedPendingFeeOptionConfirmation,
		selectedFeeOption,
		setSelectedFeeOption,
	]);

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
		if (!selectedFeeOption?.token || !storedPendingFeeOptionConfirmation?.id)
			return;

		confirmPendingFeeOption(
			storedPendingFeeOptionConfirmation?.id,
			selectedFeeOption.token.contractAddress || zeroAddress,
		);

		setFeeOptionsConfirmed(true);
	};

	return {
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
