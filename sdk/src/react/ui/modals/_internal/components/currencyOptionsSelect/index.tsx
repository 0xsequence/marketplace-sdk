'use client';

import { Skeleton } from '@0xsequence/design-system';
import type { Currency } from '../../../../../_internal';
import {
	CustomSelect,
	type SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';

type CurrencyOptionsSelectProps = {
	currencies: Currency[]; // NEW: Passed from parent instead of fetching
	selectedCurrency?: Currency | null;
	onCurrencyChange: (currency: Currency) => void;
};

// SIMPLIFIED: No hooks, no business logic, purely presentational
function CurrencyOptionsSelect({
	currencies,
	selectedCurrency,
	onCurrencyChange,
}: CurrencyOptionsSelectProps) {
	if (!currencies || !selectedCurrency?.symbol) {
		return <Skeleton className="mr-3 h-7 w-20 rounded-2xl" />;
	}

	// Simple mapping - no business logic
	const options = currencies.map(
		(currency) =>
			({
				label: currency.symbol,
				value: currency.contractAddress,
				content: currency.symbol,
			}) as SelectItem,
	);

	const onChange = (value: string) => {
		const selected = currencies.find((c) => c.contractAddress === value);
		if (selected) {
			onCurrencyChange(selected);
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
