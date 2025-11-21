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

/**
 * Normalizes WaaS fee option token address to viem Address type
 * - null represents native token (converted to zeroAddress)
 * - string addresses from WaaS are validated and guaranteed to be hex addresses
 */
function normalizeWaasFeeTokenAddress(contractAddress: string | null): Address {
	if (contractAddress === null) {
		return zeroAddress;
	}
	// WaaS returns validated hex addresses, but TypeScript doesn't know they're `0x${string}`
	if (!contractAddress.startsWith('0x')) {
		throw new Error(`Invalid address from WaaS: ${contractAddress}`);
	}
	return contractAddress as Address;
}

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
			currencyAddress: selectedFeeOption
				? normalizeWaasFeeTokenAddress(selectedFeeOption.token.contractAddress)
				: zeroAddress,
			userAddress: userAddress ?? zeroAddress,
			query: {
				enabled: !!userAddress && !!selectedFeeOption,
			},
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
