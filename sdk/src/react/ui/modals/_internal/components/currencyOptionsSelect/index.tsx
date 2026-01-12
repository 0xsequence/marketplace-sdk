'use client';

import type { Address } from '@0xsequence/api-client';
import { Skeleton } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { compareAddress } from '../../../../../../utils';
import { type Currency, OrderbookKind } from '../../../../../_internal';
import { useCurrencyList } from '../../../../../hooks';
import {
	CustomSelect,
	type SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';
import { getOpenseaCurrencyForChain } from '../../constants/opensea-currencies';

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
	const { data: currencies, isLoading: currenciesLoading } = useCurrencyList({
		chainId,
		collectionAddress,
		includeNativeCurrency,
	});

	// Filter currencies for OpenSea
	let filteredCurrencies = currencies;
	if (currencies && orderbookKind === OrderbookKind.opensea && modalType) {
		const openseaCurrency = getOpenseaCurrencyForChain(chainId, modalType);
		if (openseaCurrency) {
			// Filter to only show the OpenSea-supported currency
			filteredCurrencies = currencies.filter((currency) =>
				compareAddress(currency.contractAddress, openseaCurrency.address),
			);
		}
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
		return <Skeleton className="mr-0 h-6 w-20 rounded-2xl" />;
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
