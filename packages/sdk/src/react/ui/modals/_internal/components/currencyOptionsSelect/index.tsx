import { Skeleton } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import type { Hex } from 'viem';
import type { ChainId, Currency } from '../../../../../_internal';
import { useCurrencies } from '../../../../../hooks';
import { CustomSelect } from '../../../../components/_internals/custom-select/CustomSelect';

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
				label: currency.symbol,
				value: currency.contractAddress,
			}) satisfies SelectOption,
	);

	const onChange = (value: string) => {
		// biome-ignore lint/style/noNonNullAssertion: This can not be undefined
		const c = currencies.find(
			(currency) => currency.contractAddress === value,
		)!;

		$selectedCurrency.set(c);
	};

	return (
		<CustomSelect
			items={options}
			onValueChange={onChange}
			placeholder=''
		/>
	);
});

export default CurrencyOptionsSelect;
