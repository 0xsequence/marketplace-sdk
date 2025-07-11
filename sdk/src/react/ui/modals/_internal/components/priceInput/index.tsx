'use client';

import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useCallback, useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type { Currency, Price } from '../../../../../../types';
import { cn } from '../../../../../../utils';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import BalanceError from './components/BalanceError';
import { DnumPriceInputField } from './components/PriceInputField';
import { useDnumBalanceValidator } from './hooks/useBalanceValidator';

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
};

type DnumPriceInputProps = {
	collectionAddress: Address;
	chainId: number;
	secondCurrencyAsDefault?: boolean;
	dnPrice: Dnum;
	currency: Currency;
	includeNativeCurrency?: boolean;
	onDnumPriceChange?: (dnPrice: Dnum) => void;
	onCurrencyChange?: (currency: Currency) => void;
	checkBalance?: boolean;
	onBalanceError?: (hasError: boolean) => void;
	disabled?: boolean;
};

// New DNUM-based PriceInput component
function DnumPriceInput({
	chainId,
	collectionAddress,
	dnPrice,
	currency,
	onDnumPriceChange,
	onCurrencyChange,
	checkBalance = false,
	onBalanceError,
	secondCurrencyAsDefault,
	includeNativeCurrency,
	disabled,
}: DnumPriceInputProps) {
	const { address: accountAddress } = useAccount();

	// Get balance for validation
	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress: currency.contractAddress as undefined | Address,
		chainId,
		userAddress: accountAddress,
	});

	// DNUM-based balance validation
	const hasBalanceError = useDnumBalanceValidator(
		balance?.value,
		dnPrice,
		checkBalance && isBalanceSuccess,
	);

	// Notify parent of balance error changes
	useMemo(() => {
		onBalanceError?.(hasBalanceError);
	}, [hasBalanceError, onBalanceError]);

	// Handle price changes
	const handlePriceChange = useCallback(
		(newDnPrice: Dnum) => {
			onDnumPriceChange?.(newDnPrice);
		},
		[onDnumPriceChange],
	);

	// Handle currency changes
	const handleCurrencyChange = useCallback(
		(newCurrency: Currency) => {
			onCurrencyChange?.(newCurrency);
		},
		[onCurrencyChange],
	);

	return (
		<div
			className={cn(
				'price-input relative flex w-full flex-col',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<div className="absolute top-8 left-2 flex items-center">
				<CurrencyImage price={{ amountRaw: dn.toString(dnPrice), currency }} />
			</div>

			<div className="[&>label>div>div>.rounded-xl]:h-9 [&>label>div>div>.rounded-xl]:rounded-sm [&>label>div>div>.rounded-xl]:px-2 [&>label]:gap-1">
				<DnumPriceInputField
					dnValue={dnPrice}
					onChange={handlePriceChange}
					disabled={disabled}
					autoFocus={true}
				/>
				<div className="absolute top-8 right-2">
					<CurrencyOptionsSelect
						selectedCurrency={currency}
						onCurrencyChange={handleCurrencyChange}
						collectionAddress={collectionAddress}
						chainId={chainId}
						secondCurrencyAsDefault={secondCurrencyAsDefault}
						includeNativeCurrency={includeNativeCurrency}
					/>
				</div>
			</div>

			<BalanceError show={hasBalanceError} />
		</div>
	);
}

// Legacy PriceInput component for backward compatibility
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
}: PriceInputProps) {
	// Convert Price to DNUM for internal use
	const dnPrice = useMemo(() => {
		if (!price) return dn.from('0', 18); // Default to 18 decimals
		return dn.from(price.amountRaw, price.currency.decimals);
	}, [price]);

	const currency = price?.currency;

	// Convert DNUM back to Price format
	const handleDnumPriceChange = useCallback(
		(newDnPrice: Dnum) => {
			if (!price || !onPriceChange) return;

			const updatedPrice = {
				...price,
				amountRaw: dn.toString(newDnPrice),
			};
			onPriceChange(updatedPrice);
		},
		[price, onPriceChange],
	);
	const handleBalanceError = useCallback(
		(hasError: boolean) => {
			checkBalance?.callback(hasError);
		},
		[checkBalance],
	);

	if (!currency) return null;

	return (
		<DnumPriceInput
			chainId={chainId}
			collectionAddress={collectionAddress}
			dnPrice={dnPrice}
			currency={currency}
			onDnumPriceChange={handleDnumPriceChange}
			onCurrencyChange={onCurrencyChange}
			checkBalance={checkBalance?.enabled}
			onBalanceError={handleBalanceError}
			secondCurrencyAsDefault={secondCurrencyAsDefault}
			includeNativeCurrency={includeNativeCurrency}
			disabled={disabled}
		/>
	);
}
