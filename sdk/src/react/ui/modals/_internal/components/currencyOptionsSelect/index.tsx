'use client';

import { Skeleton } from '@0xsequence/design-system';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { type Currency, OrderbookKind } from '../../../../../_internal';
import { useMarketCurrencies } from '../../../../../hooks/data/market/useMarketCurrencies';
import {
	CustomSelect,
	type SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';

type CurrencyOptionsSelectProps = {
	collectionAddress: Address;
	chainId: number;
	selectedCurrency?: Currency | null;
	onCurrencyChange: (currency: Currency) => void;
	secondCurrencyAsDefault?: boolean;
	includeNativeCurrency?: boolean;
	orderbookKind?: OrderbookKind;
	modalType?: 'listing' | 'offer';
};

function CurrencyOptionsSelect({
	chainId,
	collectionAddress,
	secondCurrencyAsDefault,
	selectedCurrency,
	onCurrencyChange,
	includeNativeCurrency,
	orderbookKind,
	modalType,
}: CurrencyOptionsSelectProps) {
	const { data: currencies, isLoading: currenciesLoading } =
		useMarketCurrencies({
			chainId,
			collectionAddress,
			includeNativeCurrency,
		});

	// Filter currencies for OpenSea
	let filteredCurrencies = currencies;

	if (currencies && orderbookKind === OrderbookKind.opensea && modalType) {
		// Filter currencies based on OpenSea support flags from API
		filteredCurrencies = currencies.filter((currency) => {
			if (modalType === 'listing') {
				return currency.openseaListing;
			}
			if (modalType === 'offer') {
				return currency.openseaOffer;
			}
			return false;
		});
	}

	// set default currency
	useEffect(() => {
		if (
			filteredCurrencies &&
			filteredCurrencies.length > 0 &&
			!selectedCurrency?.contractAddress
		) {
			// We dont support native currency listings for any marketplace other than Sequence Marketplace v2
			// So we need to set the set another currency as the default
			if (secondCurrencyAsDefault && filteredCurrencies.length > 1) {
				onCurrencyChange(filteredCurrencies[1]);
			} else {
				onCurrencyChange(filteredCurrencies[0]);
			}
		}
	}, [
		filteredCurrencies,
		selectedCurrency?.contractAddress,
		secondCurrencyAsDefault,
		onCurrencyChange,
	]);

	if (!filteredCurrencies || currenciesLoading || !selectedCurrency?.symbol) {
		return <Skeleton className="mr-3 h-7 w-20 rounded-2xl" />;
	}

	const options = filteredCurrencies.map(
		(currency) =>
			({
				label: currency.symbol,
				value: currency.contractAddress,
				content: currency.symbol,
			}) as SelectItem,
	);

	const onChange = (value: string) => {
		const selectedCurrency = filteredCurrencies.find(
			(currency) => currency.contractAddress === value,
		);
		if (selectedCurrency) {
			onCurrencyChange(selectedCurrency);
		}
	};

	// Disable dropdown for OpenSea since there's typically only one currency
	const isDropdownDisabled = orderbookKind === OrderbookKind.opensea;

	return (
		<CustomSelect
			items={options}
			onValueChange={onChange}
			defaultValue={{
				value: selectedCurrency.contractAddress,
				content: selectedCurrency.symbol,
			}}
			disabled={isDropdownDisabled}
			testId="currency-select"
		/>
	);
}

export default CurrencyOptionsSelect;
