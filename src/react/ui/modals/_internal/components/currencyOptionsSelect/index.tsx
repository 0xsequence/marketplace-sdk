import { Box, Select } from '@0xsequence/design-system';
import type { ChainId } from '@internal';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useCurrencies } from '@react-hooks/useCurrencies';
import type { Currency } from '@types';
import { useState } from 'react';
import { currencySelect } from './styles.css';

// TODO: this should be exported from design system
type SelectOption = {
	label: string;
	value: string;
};

type CurrencyOptionsSelectProps = {
	collectionAddress: string;
	chainId: ChainId;
	$selectedCurrency: Observable<Currency | null | undefined>;
};

const CurrencyOptionsSelect = observer(function CurrencyOptionsSelect({
	chainId,
	collectionAddress,
	$selectedCurrency,
}: CurrencyOptionsSelectProps) {
	// TODO: Manage loading state
	const { data: currencies, isLoading } = useCurrencies({
		collectionAddress,
		chainId,
	});

	const [value, setValue] = useState<string | null>(null);

	if (isLoading || !currencies) {
		return null;
	}

	const options = currencies.map(
		(currency) =>
			({
				label: currency.name,
				value: currency.contractAddress,
			}) satisfies SelectOption,
	);

	const onChange = (value: string) => {
		// biome-ignore lint/style/noNonNullAssertion: This can not be undefined
		const c = currencies.find(
			(currency) => currency.contractAddress === value,
		)!;
		setValue(value);
		$selectedCurrency.set(c);
	};

	return (
		<Box className={currencySelect}>
			<Select
				name="currencies"
				value={value || options?.[0]?.value}
				onValueChange={(value) => onChange(value)}
				options={options}
			/>
		</Box>
	);
});

export default CurrencyOptionsSelect;
