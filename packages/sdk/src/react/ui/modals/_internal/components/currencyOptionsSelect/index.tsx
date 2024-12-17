import { Skeleton } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import type { Hex } from 'viem';
import type { ChainId, Currency } from '../../../../../_internal';
import { useCurrencies } from '../../../../../hooks';
import { CustomSelect } from '../../../../components/_internals/custom-select/CustomSelect';
import useCurrencyOptions from '../../../../../hooks/useCurrencyOptions';

// TODO: this should be exported from design system
type SelectOption = {
	label: string;
	value: string;
};

type CurrencyOptionsSelectProps = {
	collectionAddress: Hex;
	chainId: ChainId;
	selectedCurrency$: Observable<Currency | null | undefined>;
};

const CurrencyOptionsSelect = observer(function CurrencyOptionsSelect({
	chainId,
	collectionAddress,
	selectedCurrency$,
}: CurrencyOptionsSelectProps) {
	const currency = selectedCurrency$.get() as Currency;
	const currencyOptions = useCurrencyOptions({ collectionAddress });
	const { data: currencies, isLoading: currenciesLoading } = useCurrencies({
		chainId,
		currencyOptions,
	});

	// set default currency
	useEffect(() => {
		if (
			currencies &&
			currencies.length > 0 &&
			!selectedCurrency$.get()?.contractAddress
		) {
			console.debug('Setting default currency', currencies[0]);
			selectedCurrency$.set(currencies[0]);
		}
	}, [currencies]);

	console.debug('CurrencyOptionsSelect', {
		currencies,
		currenciesLoading,
		currency,
	});
	if (!currencies || currenciesLoading || !currency.symbol) {
		return <Skeleton borderRadius="lg" width="20" height="7" marginRight="3" />;
	}

	const options = currencies.map(
		(currency) =>
			({
				label: currency.symbol,
				value: currency.contractAddress,
			}) satisfies SelectOption,
	);

	const onChange = (value: string) => {
		const selectedCurrency = currencies.find(
			(currency) => currency.contractAddress === value,
		);
		selectedCurrency$.set(selectedCurrency);
	};

	return (
		<CustomSelect
			items={options}
			value={currency.symbol}
			onValueChange={onChange}
			defaultValue={currency.contractAddress}
		/>
	);
});

export default CurrencyOptionsSelect;
