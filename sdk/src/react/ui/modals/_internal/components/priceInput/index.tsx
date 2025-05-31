'use client';

import { NumericInput, Text } from '@0xsequence/design-system';
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
	price: Price;
	onPriceChange?: (price: Price) => void;
	includeNativeCurrency?: boolean;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
	disabled?: boolean;
};

export default function PriceInput({
	chainId,
	collectionAddress,
	price,
	onPriceChange,
	checkBalance,
	secondCurrencyAsDefault,
	includeNativeCurrency,
	disabled,
}: PriceInputProps) {
	const { address: accountAddress } = useAccount();
	const inputRef = useRef<HTMLInputElement>(null);
	const currencyDecimals = price.currency.decimals;
	const currencyAddress = price.currency.contractAddress;
	const priceAmountRaw = price.amountRaw;

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress: currencyAddress as undefined | Hex,
		chainId,
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
				const newPrice = {
					...price,
					amountRaw: parsedAmount.toString(),
				};

				if (onPriceChange) {
					onPriceChange(newPrice);
				}
			} catch {
				const newPrice = {
					...price,
					amountRaw: '0',
				};
				if (onPriceChange) {
					onPriceChange(newPrice);
				}
			}
		}

		prevCurrencyDecimals.current = currencyDecimals;
	}, [currencyDecimals, value, onPriceChange, price]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setValue(newValue);
		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			const newPrice = {
				...price,
				amountRaw: parsedAmount.toString(),
			};
			if (onPriceChange) {
				onPriceChange(newPrice);
			}
		} catch {
			const newPrice = {
				...price,
				amountRaw: '0',
			};
			if (onPriceChange) {
				onPriceChange(newPrice);
			}
		}
	};

	return (
		<div
			className={cn(
				'price-input relative flex w-full flex-col',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<div className="absolute top-8 left-2 flex items-center">
				<CurrencyImage currency={price.currency} />
			</div>

			<div className="[&>label>div>div>.rounded-xl]:h-9 [&>label>div>div>.rounded-xl]:rounded-sm [&>label>div>div>.rounded-xl]:px-2 [&>label]:gap-1">
				<NumericInput
					ref={inputRef}
					className="ml-5 w-full text-xs"
					name="price-input"
					decimals={currencyDecimals}
					label="Enter price"
					labelLocation="top"
					controls={
						<CurrencyOptionsSelect
							selectedCurrency={price.currency}
							onCurrencyChange={(currency) => {
								if (onPriceChange) {
									onPriceChange({
										...price,
										currency,
									});
								}
							}}
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
