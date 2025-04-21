import { Checkbox } from '@0xsequence/design-system';
import { useFilterContext } from './FilterContext';
import type { Filter } from './FilterItem';

interface FilterStringValuesProps {
	filter: Filter;
}

export function FilterStringValues({ filter }: FilterStringValuesProps) {
	const { stringFilters, updateStringFilter } = useFilterContext();

	const handleCheckboxChange = (value: string, checked: boolean) => {
		updateStringFilter(filter.name, value, checked);
	};

	return (
		<>
			{filter.values?.map((value) => (
				<div
					key={value}
					className="flex items-center gap-2 rounded-md border border-border-base bg-background-secondary p-2"
				>
					<Checkbox
						checked={stringFilters[filter.name]?.[value] || false}
						onCheckedChange={(checked) => {
							if (typeof checked === 'boolean') {
								handleCheckboxChange(value, checked);
							}
						}}
						aria-label={`Filter by ${value}`}
					/>
					<p className="block font-bold text-sm text-text-100">{value}</p>
				</div>
			))}
		</>
	);
}
