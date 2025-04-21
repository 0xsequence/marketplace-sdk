import { Skeleton } from '@0xsequence/design-system';
import { PropertyType } from '@0xsequence/marketplace-sdk';
import { FilterNumericRange } from './FilterNumericRange';
import { FilterStringValues } from './FilterStringValues';

export interface FilterValue {
	value: string;
	checked: boolean;
}

export interface Filter {
	name: string;
	type: PropertyType;
	values?: string[];
	min?: number;
	max?: number;
	currentMin?: number;
	currentMax?: number;
}

interface FilterItemProps {
	filter: Filter;
	filterValuesLoaded: boolean;
}

export function FilterItem({ filter, filterValuesLoaded }: FilterItemProps) {
	return (
		<div
			key={filter.name}
			className="flex flex-col gap-2 rounded-md bg-background-raised p-2"
		>
			{filterValuesLoaded ? (
				filter.type === PropertyType.STRING ? (
					<FilterStringValues filter={filter} />
				) : (
					<FilterNumericRange filter={filter} />
				)
			) : (
				<Skeleton className="mt-2 h-10 w-full animate-shimmer" />
			)}
		</div>
	);
}
