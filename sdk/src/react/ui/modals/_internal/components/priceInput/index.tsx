'use client';

import { OrderbookKind } from '@0xsequence/api-client';
import {
	Field,
	FieldLabel,
	InfoIcon,
	NumericInput,
	Text,
	Tooltip,
} from '@0xsequence/design-system';
import { useEffect, useRef, useState } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Currency, Price } from '../../../../../../types';
import { calculateTotalOfferCost, cn } from '../../../../../../utils';
import { validateOpenseaOfferDecimals } from '../../../../../../utils/price';
import {
	useConvertPriceToUSD,
	useTokenCurrencyBalance,
} from '../../../../../hooks';
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
	modalType?: 'listing' | 'offer';
	// Fee data for enhanced balance checking in offers
	feeData?: {
		royaltyPercentage?: number;
	};
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
	modalType,
	feeData,
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
			currencyAddress:
				currencyAddress ??
				('0x0000000000000000000000000000000000000000' as Address),
			amountRaw: priceAmountRaw?.toString(),
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

	const { data: balance, isSuccess: isBalanceSuccess } =
		useTokenCurrencyBalance({
			currencyAddress,
			chainId,
			userAddress: accountAddress,
		});
	const getTotalRequiredBalance = () => {
		if (!priceAmountRaw || !currencyDecimals) return BigInt(0);

		const offerAmountRaw = BigInt(priceAmountRaw);

		// For offers, include fees in balance calculation
		if (modalType === 'offer' && feeData) {
			return calculateTotalOfferCost(
				offerAmountRaw,
				currencyDecimals,
				feeData.royaltyPercentage || 0,
			);
		}

		return offerAmountRaw;
	};

	const balanceError =
		!!checkBalance?.enabled &&
		!!isBalanceSuccess &&
		!!priceAmountRaw &&
		!!currencyDecimals &&
		getTotalRequiredBalance() > (balance?.value || 0n);

	const hasEnoughForBaseOffer =
		!!isBalanceSuccess &&
		!!priceAmountRaw &&
		BigInt(priceAmountRaw) <= (balance?.value || 0n);

	const getRoyaltyFeeAmount = () => {
		if (!priceAmountRaw || !currencyDecimals || !feeData?.royaltyPercentage) {
			return null;
		}

		const offerAmount = BigInt(priceAmountRaw);
		const royaltyFeeAmount =
			(offerAmount * BigInt(Math.round(feeData.royaltyPercentage * 100))) /
			BigInt(10000);

		return formatUnits(royaltyFeeAmount, currencyDecimals);
	};

	const royaltyFeeFormatted = getRoyaltyFeeAmount();

	const RoyaltyFeeTooltip = ({ children }: { children: React.ReactNode }) => (
		<Tooltip
			message={
				<div className="flex flex-col gap-1">
					<Text className="font-body font-medium text-xs">
						A royalty fee is a percentage of each resale
					</Text>
					<Text className="font-body font-medium text-xs">
						price that automatically compensates the original
					</Text>
					<Text className="font-body font-medium text-xs">
						creator every time their collectible changes hands.
					</Text>
				</div>
			}
		>
			{children}
		</Tooltip>
	);

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
	const [openseaDecimalError, setOpenseaDecimalError] = useState<string | null>(
		null,
	);

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
				const updatedPrice = { ...price, amountRaw: parsedAmount };

				onPriceChange(updatedPrice);
			} catch {
				const updatedPrice = { ...price, amountRaw: 0n };
				onPriceChange(updatedPrice);
			}
		}

		prevCurrencyDecimals.current = currencyDecimals;
	}, [currencyDecimals, price, value, onPriceChange]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setValue(newValue);

		if (!price || !onPriceChange) return;

		// Validate OpenSea decimal constraints for offers
		if (orderbookKind === OrderbookKind.opensea && modalType === 'offer') {
			const validation = validateOpenseaOfferDecimals(newValue);
			if (!validation.isValid) {
				setOpenseaDecimalError(validation.errorMessage || null);
				try {
					const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
					const updatedPrice = { ...price, amountRaw: parsedAmount };
					onPriceChange(updatedPrice);
				} catch {
					const updatedPrice = { ...price, amountRaw: 0n };
					onPriceChange(updatedPrice);
				}
				return;
			}
			setOpenseaDecimalError(null);
		}

		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			const updatedPrice = { ...price, amountRaw: parsedAmount };

			onPriceChange(updatedPrice);
		} catch {
			const updatedPrice = { ...price, amountRaw: 0n };
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
			<Field className="[&>div>div]:pr-0">
				<FieldLabel htmlFor="price-input" className="text-xs">
					Enter price
				</FieldLabel>
				<NumericInput
					aria-label="Enter price"
					ref={inputRef}
					className="h-9 w-full rounded-sm px-2 pl-3 [&>input]:text-xs"
					name="price-input"
					decimals={currencyDecimals}
					controls={
						<CurrencyOptionsSelect
							selectedCurrency={currency}
							onCurrencyChange={handleCurrencyChange}
							collectionAddress={collectionAddress}
							chainId={chainId}
							secondCurrencyAsDefault={secondCurrencyAsDefault}
							includeNativeCurrency={includeNativeCurrency}
							orderbookKind={orderbookKind}
							modalType={modalType}
						/>
					}
					value={value}
					onChange={handleChange}
				/>
			</Field>

			<div className="absolute top-8 left-2 flex items-center">
				<CurrencyImage price={price} />
			</div>

			{balanceError && (
				<Text className="mt-1.5 font-body font-medium text-amber-500 text-xs">
					{modalType === 'offer' &&
					hasEnoughForBaseOffer &&
					royaltyFeeFormatted &&
					Number(royaltyFeeFormatted) > 0 ? (
						<div className="flex items-center gap-1">
							<RoyaltyFeeTooltip>
								<InfoIcon className="h-4 w-4 text-negative" />
							</RoyaltyFeeTooltip>

							<Text className="font-body font-medium text-xs" color="negative">
								You need {royaltyFeeFormatted} {currency?.symbol} for royalty
								fees
							</Text>
						</div>
					) : (
						'Insufficient balance'
					)}
				</Text>
			)}

			{!balanceError &&
				modalType === 'offer' &&
				royaltyFeeFormatted &&
				Number(royaltyFeeFormatted) > 0 && (
					<div className="mt-2">
						<div className="flex items-center gap-1">
							<RoyaltyFeeTooltip>
								<InfoIcon className="h-4 w-4 text-text-50" />
							</RoyaltyFeeTooltip>

							<Text className="font-body font-medium text-xs" color="text50">
								Total:{' '}
								{(Number(value) + Number(royaltyFeeFormatted))
									.toFixed(6)
									.replace(/\.?0+$/, '')}{' '}
								{currency?.symbol} (includes {royaltyFeeFormatted}{' '}
								{currency?.symbol} royalty fee)
							</Text>
						</div>
					</div>
				)}

			{!balanceError &&
				priceAmountRaw !== 0n &&
				!openseaLowestPriceCriteriaMet &&
				orderbookKind === OrderbookKind.opensea &&
				!isConversionLoading &&
				modalType === 'offer' &&
				!openseaDecimalError && (
					<Text
						className="-bottom-5 absolute font-body font-medium text-xs"
						color="negative"
					>
						Lowest price must be at least $0.01
					</Text>
				)}

			{!balanceError &&
				openseaDecimalError &&
				orderbookKind === OrderbookKind.opensea &&
				modalType === 'offer' && (
					<Text className="font-body font-medium text-xs" color="negative">
						{openseaDecimalError}
					</Text>
				)}
		</div>
	);
}
