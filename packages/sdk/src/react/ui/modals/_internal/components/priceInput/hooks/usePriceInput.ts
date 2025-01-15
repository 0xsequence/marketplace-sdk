import { type Observable } from '@legendapp/state';
import { useState, useEffect } from 'react';
import { parseUnits } from 'viem';
import type { Price } from '../../../../../../../types';

type UsePriceInputProps = {
	price$: Observable<Price | undefined>;
	currencyDecimals: number;
	onPriceChange?: () => void;
};

export const usePriceInput = ({
	price$,
	currencyDecimals,
	onPriceChange,
}: UsePriceInputProps) => {
	const [value, setValue] = useState('');

	// Update price amount when currency changes to trigger balance check
	useEffect(() => {
		const currentAmount = value.replace(/,/g, '');
		if (currentAmount) {
			try {
				const parsedAmount = parseUnits(currentAmount, Number(currencyDecimals));
				price$.amountRaw.set(parsedAmount.toString());
			} catch {
				price$.amountRaw.set('0');
			}
		}
	}, [currencyDecimals, value, price$]);

	const handlePriceChange = (newValue: string) => {
		setValue(newValue);
		const trimmedValue = newValue.replace(/,/g, '');

		try {
			const parsedAmount = parseUnits(trimmedValue, Number(currencyDecimals));
			price$.amountRaw.set(parsedAmount.toString());

			if (onPriceChange && parsedAmount !== 0n) {
				onPriceChange();
			}
		} catch {
			price$.amountRaw.set('0');
		}
	};

	return {
		value,
		handlePriceChange,
	};
}; 