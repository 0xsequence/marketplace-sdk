'use client';

import { NumericInput, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import { useEffect, useRef, useState } from 'react';
import { type Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import { cn } from '../../../../../../utils';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';

type PriceInputProps = {
	collectionAddress: Hex;
	chainId: number;
	secondCurrencyAsDefault?: boolean;
	$price: Observable<Price | undefined>;
	includeNativeCurrency?: boolean;
	onPriceChange?: () => void;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
	disabled?: boolean;
};

export default function PriceInput({
	chainId,
	collectionAddress,
	$price,
	onPriceChange,
	checkBalance,
	secondCurrencyAsDefault,
	includeNativeCurrency,
	disabled,
}: PriceInputProps) {
	const { address: accountAddress } = useAccount();
	const inputRef = useRef<HTMLInputElement>(null);
	const currencyDecimals = use$($price.currency.decimals);
	const currencyAddress = use$($price.currency.contractAddress);
	const priceAmountRaw = use$($price.amountRaw);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress: currencyAddress as undefined | Hex,
		chainId: Number(chainId),
		userAddress: accountAddress,
	});

	const balanceError =
		!!checkBalance?.enabled &&
		!!isBalanceSuccess &&
		!!priceAmountRaw &&
		!!currencyDecimals &&
		BigInt(priceAmountRaw) > BigInt(balance?.value || 0n);

	if (checkBalance?.enabled) {
		checkBalance.callback(balanceError);
	}

	const [value, setValue] = useState('0');
	const prevCurrencyDecimals = useRef(currencyDecimals);

	// Handle currency changes and adjust the raw amount accordingly
	useEffect(() => {
		if (prevCurrencyDecimals.current !== currencyDecimals && value !== '0') {
			try {
				// If the user has entered a value and the currency decimals have changed,
				// we need to adjust the raw amount to maintain the same displayed value
				const parsedAmount = parseUnits(value, Number(currencyDecimals));
				$price.amountRaw.set(parsedAmount.toString());

				if (onPriceChange && parsedAmount !== 0n) {
					onPriceChange();
				}
			} catch {
				$price.amountRaw.set('0');
			}
		}

		prevCurrencyDecimals.current = currencyDecimals;
	}, [currencyDecimals, $price.amountRaw, value, onPriceChange]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setValue(newValue);
		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			$price.amountRaw.set(parsedAmount.toString());
			if (onPriceChange && parsedAmount !== 0n) {
				onPriceChange();
			}
		} catch {
			$price.amountRaw.set('0');
		}
	};

	return (
		<div
			className={cn(
				'relative flex w-full flex-col',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<div className="absolute top-8 left-2 flex items-center">
				<CurrencyImage price$={$price} />
			</div>

			<div className="[&>label>div>.rounded-xl]:h-9 [&>label>div>.rounded-xl]:rounded-sm [&>label>div>.rounded-xl]:px-2 [&>label]:gap-1">
				<NumericInput
					ref={inputRef}
					className="ml-5 w-full text-xs"
					name="price-input"
					decimals={currencyDecimals}
					label="Enter price"
					labelLocation="top"
					controls={
						<CurrencyOptionsSelect
							selectedCurrency$={$price.currency}
							collectionAddress={collectionAddress}
							chainId={chainId}
							secondCurrencyAsDefault={secondCurrencyAsDefault}
							includeNativeCurrency={includeNativeCurrency}
						/>
					}
					value={value}
					onChange={handleChange}
				/>
			</div>

			{balanceError && (
				<Text
					className="-bottom-5 absolute font-body font-medium text-xs"
					color="negative"
				>
					Insufficient balance
				</Text>
			)}
		</div>
	);
}
