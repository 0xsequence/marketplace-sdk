import { Box, Select, Skeleton } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
import type { Hex } from 'viem';
import type { ChainId, Currency } from '../../../../../_internal';
import { useCurrencies } from '../../../../../hooks';
import { currencySelect } from './styles.css';

// TODO: this should be exported from design system
type SelectOption = {
	label: string;
	value: string;
};

type CurrencyOptionsSelectProps = {
	collectionAddress: Hex;
	chainId: ChainId;
	$selectedCurrency: Observable<Currency | null | undefined>;
};

const CurrencyOptionsSelect = observer(function CurrencyOptionsSelect({
	chainId,
	collectionAddress,
	$selectedCurrency,
}: CurrencyOptionsSelectProps) {
	const [value, setValue] = useState<string | null>(null);
	const { data: currencies, isLoading: currenciesLoading } = useCurrencies({
		collectionAddress,
		chainId,
	});

	useEffect(() => {
		if (
			currencies &&
			currencies.length > 0 &&
			!$selectedCurrency.contractAddress.get()
		) {
			$selectedCurrency.set(currencies[0]);
		}
	}, [currencies]);

	if (!currencies || currenciesLoading) {
		return <Skeleton borderRadius="lg" width="20" height="7" marginRight="3" />;
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
