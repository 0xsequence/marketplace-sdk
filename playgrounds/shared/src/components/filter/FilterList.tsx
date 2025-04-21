import { Collapsible, Spinner, Text } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { useFilterContext } from './FilterContext';
import { FilterItem } from './FilterItem';

export function FilterList() {
	const { filters, setExcludePropertyValues, isLoading } = useFilterContext();

	const filterNamesLoaded =
		filters &&
		filters.length > 0 &&
		filters.every((filter) => filter.values?.length === 0);
	const filterValuesLoaded =
		filters &&
		filters.length > 0 &&
		!filters?.every((filter) => filter.values?.length === 0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (filterNamesLoaded) {
			setExcludePropertyValues(false);
		}
	}, [filterNamesLoaded]);

	return (
		<Collapsible
			label={
				isLoading ? (
					<div className="flex items-center gap-2">
						<Spinner size="sm" />

						<Text>Filters</Text>
					</div>
				) : (
					<Text>Filters</Text>
				)
			}
			disabled={isLoading}
			defaultOpen={false}
			className="[&>div]:flex [&>div]:flex-col [&>div]:gap-2"
		>
			{filters?.map((filter) => (
				<Collapsible key={filter.name} label={filter.name} className="mb-2">
					<FilterItem
						filter={filter}
						filterValuesLoaded={filterValuesLoaded ?? false}
					/>
				</Collapsible>
			))}
		</Collapsible>
	);
}
