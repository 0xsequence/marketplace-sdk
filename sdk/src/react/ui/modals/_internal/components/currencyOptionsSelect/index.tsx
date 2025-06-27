'use client';

import { Skeleton } from '@0xsequence/design-system';
import { useEffect } from 'react';
import type { Hex } from 'viem';
import type { Currency } from '../../../../../_internal';
import { useMarketCurrencies } from '../../../../../hooks';
import {
	CustomSelect,
	type SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';

type CurrencyOptionsSelectProps = {
	collectionAddress: Hex;
	chainId: number;
	selectedCurrency?: Currency | null;
	onCurrencyChange: (currency: Currency) => void;
	secondCurrencyAsDefault?: boolean;
	includeNativeCurrency?: boolean;
};

function CurrencyOptionsSelect({
	chainId,
	collectionAddress,
	secondCurrencyAsDefault,
	selectedCurrency,
	onCurrencyChange,
	includeNativeCurrency,
}: CurrencyOptionsSelectProps) {
	const { data: currencies, isLoading: currenciesLoading } =
		useMarketCurrencies({
			chainId,
			collectionAddress,
			includeNativeCurrency,
		});

	// set default currency
	useEffect(() => {
		if (
			currencies &&
			currencies.length > 0 &&
			!selectedCurrency?.contractAddress
		) {
			// We dont support native currency listings for any marketplace other than Sequence Marketplace v2
			// So we need to set the set another currency as the default
			if (secondCurrencyAsDefault) {
				onCurrencyChange(currencies[1]);
			} else {
				onCurrencyChange(currencies[0]);
			}
		}
	}, [
		currencies,
		selectedCurrency?.contractAddress,
		secondCurrencyAsDefault,
		onCurrencyChange,
	]);

	if (!currencies || currenciesLoading || !selectedCurrency?.symbol) {
		return <Skeleton className="mr-3 h-7 w-20 rounded-2xl" />;
	}

	const options = currencies.map(
		(currency) =>
			({
				label: currency.symbol,
				value: currency.contractAddress,
				content: currency.symbol,
			}) as SelectItem,
	);

	const onChange = (value: string) => {
		const selectedCurrency = currencies.find(
			(currency) => currency.contractAddress === value,
		);
		if (selectedCurrency) {
			onCurrencyChange(selectedCurrency);
		}
	};

	return (
		<CustomSelect
			items={options}
			onValueChange={onChange}
			defaultValue={{
				value: selectedCurrency.contractAddress,
				content: selectedCurrency.symbol,
			}}
			testId="currency-select"
		/>
	);
}

export default CurrencyOptionsSelect;
