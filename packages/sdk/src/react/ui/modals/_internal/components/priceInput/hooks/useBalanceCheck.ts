import { type Observable } from '@legendapp/state';
import { useState, useEffect } from 'react';
import type { Hex } from 'viem';
import type { Price } from '../../../../../../../types';
import { useCurrencyBalance } from '../../../../../../hooks/useCurrencyBalance';

type UseBalanceCheckProps = {
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
	price$: Observable<Price | undefined>;
	currencyAddress: Hex;
	chainId: number;
	userAddress: Hex;
	currencyDecimals: number;
};

export const useBalanceCheck = ({
	checkBalance,
	price$,
	currencyAddress,
	chainId,
	userAddress,
	currencyDecimals,
}: UseBalanceCheckProps) => {
	const [balanceError, setBalanceError] = useState('');

	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress,
		chainId,
		userAddress,
	});

	useEffect(() => {
		if (!checkBalance?.enabled) {
			setBalanceError('');
			return;
		}

		const priceAmountRaw = price$.amountRaw.get() || '0';
		const hasInsufficientBalance =
			isBalanceSuccess &&
			priceAmountRaw &&
			currencyDecimals &&
			BigInt(priceAmountRaw) > (balance?.value || 0n);

		if (hasInsufficientBalance) {
			setBalanceError('Insufficient balance');
			checkBalance.callback(true);
		} else {
			setBalanceError('');
			checkBalance.callback(false);
		}
	}, [
		price$.amountRaw.get(),
		currencyAddress,
		balance?.value,
		isBalanceSuccess,
		checkBalance,
		currencyDecimals,
	]);

	return {
		balanceError,
	};
};
