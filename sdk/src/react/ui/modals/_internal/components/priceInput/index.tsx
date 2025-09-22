'use client';

import { NumericInput, Text } from '@0xsequence/design-system';
import { useEffect, useRef, useState } from 'react';
import { type Address, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import {
	type Currency,
	OrderbookKind,
	type Price,
} from '../../../../../../types';
import { cn } from '../../../../../../utils';
import { useConvertPriceToUSD } from '../../../../../hooks';
import { useCurrencyBalance } from '../../../../../hooks/data/tokens/useCurrencyBalance';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';

type PriceInputProps = {
	collectionAddress: Address;
	chainId: number;
	secondCurrencyAsDefault?: boolean;
	price: Price | undefined;
	includeNativeCurrency?: boolean;
	onPriceChange?: (price: Price) => void;
	onCurrencyChange?: (currency: Currency) => void;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
	disabled?: boolean;
	orderbookKind?: OrderbookKind;
	setOpenseaLowestPriceCriteriaMet?: (state: boolean) => void;
};

export default function PriceInput({
	chainId,
	collectionAddress,
	price,
	onPriceChange,
	onCurrencyChange,
	checkBalance,
	secondCurrencyAsDefault,
	includeNativeCurrency,
	disabled,
	orderbookKind,
	setOpenseaLowestPriceCriteriaMet,
}: PriceInputProps) {
	const { address: accountAddress } = useAccount();
	const inputRef = useRef<HTMLInputElement>(null);
	const currency = price?.currency;
	const currencyDecimals = price?.currency?.decimals;
	const currencyAddress = price?.currency?.contractAddress;
	const priceAmountRaw = price?.amountRaw;

	const handleCurrencyChange = (newCurrency: Currency) => {
		if (price && onCurrencyChange) {
			onCurrencyChange(newCurrency);
		}
	};

	const { data: conversion, isLoading: isConversionLoading } =
		useConvertPriceToUSD({
			chainId,
			currencyAddress: currencyAddress as Address,
			amountRaw: priceAmountRaw,
			query: {
				enabled:
					orderbookKind === OrderbookKind.opensea &&
					!!currencyAddress &&
					!!priceAmountRaw &&
					!!setOpenseaLowestPriceCriteriaMet,
			},
		});

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress: currencyAddress as undefined | Address,
		chainId,
		userAddress: accountAddress,
	});

	const balanceError =
		!!checkBalance?.enabled &&
		!!isBalanceSuccess &&
		!!priceAmountRaw &&
		!!currencyDecimals &&
		BigInt(priceAmountRaw) > BigInt(balance?.value || 0n);

	const openseaLowestPriceCriteriaMet =
		orderbookKind === OrderbookKind.opensea &&
		!!conversion?.usdAmount &&
		conversion.usdAmount >= 0.01;

	if (checkBalance?.enabled) {
		checkBalance.callback(balanceError);
	}

	if (setOpenseaLowestPriceCriteriaMet) {
		setOpenseaLowestPriceCriteriaMet(openseaLowestPriceCriteriaMet);
	}

	const [value, setValue] = useState('0');
	const prevCurrencyDecimals = useRef(currencyDecimals);

	// Handle currency changes and adjust the raw amount accordingly
	useEffect(() => {
		if (
			prevCurrencyDecimals.current !== currencyDecimals &&
			value !== '0' &&
			price &&
			onPriceChange
		) {
			try {
				// If the user has entered a value and the currency decimals have changed,
				// we need to adjust the raw amount to maintain the same displayed value
				const parsedAmount = parseUnits(value, Number(currencyDecimals));
				const updatedPrice = { ...price, amountRaw: parsedAmount.toString() };

				onPriceChange(updatedPrice);
			} catch {
				const updatedPrice = { ...price, amountRaw: '0' };
				onPriceChange(updatedPrice);
			}
		}

		prevCurrencyDecimals.current = currencyDecimals;
	}, [currencyDecimals, price, value, onPriceChange]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setValue(newValue);

		if (!price || !onPriceChange) return;

		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			const updatedPrice = { ...price, amountRaw: parsedAmount.toString() };

			onPriceChange(updatedPrice);
		} catch {
			const updatedPrice = { ...price, amountRaw: '0' };
			onPriceChange(updatedPrice);
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
				<CurrencyImage price={price} />
			</div>

			<div className="[&>label]:gap-1">
				<NumericInput
					ref={inputRef}
					className="h-9 w-full rounded-sm px-2 [&>input]:pl-5 [&>input]:text-xs"
					name="price-input"
					decimals={currencyDecimals}
					label="Enter price"
					labelLocation="top"
					controls={
						<CurrencyOptionsSelect
							selectedCurrency={currency}
							onCurrencyChange={handleCurrencyChange}
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

			{!balanceError &&
				priceAmountRaw !== '0' &&
				!openseaLowestPriceCriteriaMet &&
				orderbookKind === OrderbookKind.opensea &&
				!isConversionLoading && (
					<Text
						className="-bottom-5 absolute font-body font-medium text-xs"
						color="negative"
					>
						Lowest price must be at least $0.01
					</Text>
				)}
		</div>
	);
}
