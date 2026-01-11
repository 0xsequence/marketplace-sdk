import type { Address } from '@0xsequence/api-client';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../../../types/waas-types';
import { useConfig } from '../../../../../hooks';
import { useCurrencyBalance } from '../../../../../hooks/data/tokens/useCurrencyBalance';
import { useWaasFeeOptions } from '../../../../../hooks/utils/useWaasFeeOptions';
import { useSelectWaasFeeOptionsStore } from './store';

const useWaasFeeOptionManager = (chainId: number) => {
	const config = useConfig();
	const { address: userAddress } = useAccount();
	const { selectedFeeOption, setSelectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	const {
		pendingFeeOptionConfirmation,
		confirmPendingFeeOption,
		rejectPendingFeeOption,
	} = useWaasFeeOptions(chainId, config);
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);

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
				setSelectedFeeOption(
					pendingFeeOptionConfirmation.options[0] as FeeOption,
				);
			}
		}
	}, [pendingFeeOptionConfirmation, selectedFeeOption, setSelectedFeeOption]);

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

		rejectPendingFeeOption(pendingFeeOptionConfirmation?.id);
		setFeeOptionsConfirmed(true);
	};

	const handleRejectFeeOption = (id: string) => {
		rejectPendingFeeOption(id);
		// Also clear the store when rejecting
		setSelectedFeeOption(undefined);
	};

	return {
		selectedFeeOption,
		pendingFeeOptionConfirmation,
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		feeOptionsConfirmed,
		handleConfirmFeeOption,
		rejectPendingFeeOption: handleRejectFeeOption,
	};
};

export default useWaasFeeOptionManager;
