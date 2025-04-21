import { TextInput } from '@0xsequence/design-system';
import { useEffect, useState } from 'react';
import { useFilterContext } from './FilterContext';
import type { Filter } from './FilterItem';

interface FilterNumericRangeProps {
	filter: Filter;
}

export function FilterNumericRange({ filter }: FilterNumericRangeProps) {
	const { numericFilters, updateNumericFilter } = useFilterContext();
	const [min, setMin] = useState<number>(filter.min ?? 0);
	const [max, setMax] = useState<number>(filter.max ?? 0);

	// set the min and max values to the initial values
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (numericFilters[filter.name]) {
			setMin(numericFilters[filter.name].min);
			setMax(numericFilters[filter.name].max);
		}
	}, [filter.name]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		updateNumericFilter(filter.name, min, max);
	}, [min, max]);

	const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const numValue = Number.parseInt(value);

		if (numValue > numericFilters[filter.name].min) {
			setMin(numValue);
		}

		if (numValue > numericFilters[filter.name].max) {
			setMin(numericFilters[filter.name].max);
		}
	};

	const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const numValue = Number.parseInt(value);

		if (numValue < numericFilters[filter.name].max) {
			setMax(numValue);
		}

		if (numValue > numericFilters[filter.name].max) {
			setMax(numericFilters[filter.name].max);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<TextInput
					name={`${filter.name}-min`}
					value={min}
					onChange={handleMinChange}
					aria-label={`Minimum value for ${filter.name}`}
				/>

				<TextInput
					name={`${filter.name}-max`}
					value={max}
					onChange={handleMaxChange}
					aria-label={`Maximum value for ${filter.name}`}
				/>
			</div>
		</div>
	);
}
