import { Skeleton } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import type { Hex } from 'viem';
import type { ChainId, Currency } from '../../../../../_internal';
import { useCurrencies } from '../../../../../hooks';
import {
	CustomSelect,
	SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';
import { useCurrencyOptions } from '../../../../../hooks/useCurrencyOptions';

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
			selectedCurrency$.set(currencies[0]);
		}
	}, [currencies]);

	if (!currencies || currenciesLoading || !currency.symbol) {
		return <Skeleton borderRadius="lg" width="20" height="7" marginRight="3" />;
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
		selectedCurrency$.set(selectedCurrency);
	};

	return (
		<CustomSelect
			items={options}
			onValueChange={onChange}
			defaultValue={{
				value: currency.contractAddress,
				content: currency.symbol,
			}}
		/>
	);
});

export default CurrencyOptionsSelect;
