import { type ReactNode, createContext, useContext, useState } from 'react';
import type { Address } from 'viem';
import { type PropertyFilter, PropertyType } from '../../../../../sdk/src';
import { useFilters } from '../../../../../sdk/src/react';

export interface FilterValue {
	value: string;
	checked: boolean;
}

interface FilterContextType {
	filters: PropertyFilter[] | undefined;
	appliedFilters: PropertyFilter[];
	stringFilters: Record<string, Record<string, boolean>>;
	numericFilters: Record<string, { min: number; max: number }>;
	filtersModified: boolean;
	setExcludePropertyValues: (value: boolean) => void;
	updateStringFilter: (
		filterName: string,
		value: string,
		checked: boolean,
	) => void;
	updateNumericFilter: (filterName: string, min: number, max: number) => void;
	applyFilters: () => void;
	clearFilters: () => void;
	// if its a number filter, value is not needed
	removeFilter: (filterName: string, value?: string) => void;
	isLoading: boolean;
}

interface FilterProviderProps {
	children: ReactNode;
	chainId: number;
	collectionAddress: Address;
}

const FilterContext = createContext<FilterContextType>({
	filters: [],
	appliedFilters: [],
	stringFilters: {},
	numericFilters: {},
	filtersModified: false,
	setExcludePropertyValues: () => {},
	updateStringFilter: () => {},
	updateNumericFilter: () => {},
	applyFilters: () => {},
	clearFilters: () => {},
	removeFilter: () => {},
	isLoading: true,
});

export function FilterProvider({
	children,
	chainId,
	collectionAddress,
}: FilterProviderProps) {
	const [excludePropertyValues, setExcludePropertyValues] = useState(true);
	const [appliedFilters, setAppliedFilters] = useState<PropertyFilter[]>([]);
	const [stringFilters, setStringFilters] = useState<
		Record<string, Record<string, boolean>>
	>({});
	const [numericFilters, setNumericFilters] = useState<
		Record<string, { min: number; max: number }>
	>({});
	const [filtersModified, setFiltersModified] = useState(false);

	const { data: filters, isLoading } = useFilters({
		chainId,
		collectionAddress,
		excludePropertyValues,
		showAllFilters: true,
	});

	const updateStringFilter = (
		filterName: string,
		value: string,
		checked: boolean,
	) => {
		setStringFilters((prev) => ({
			...prev,
			[filterName]: {
				...prev[filterName],
				[value]: checked,
			},
		}));
		setFiltersModified(true);
	};

	const updateNumericFilter = (
		filterName: string,
		min: number,
		max: number,
	) => {
		setNumericFilters((prev) => ({
			...prev,
			[filterName]: { min, max },
		}));
		setFiltersModified(true);
	};

	const applyFilters = () => {
		const newAppliedFilters: PropertyFilter[] = [];

		for (const stringFilter of Object.keys(stringFilters)) {
			const values = stringFilters[stringFilter];
			const selectedValues = Object.entries(values)
				.filter(([_, checked]) => checked)
				.map(([value]) => value);

			if (selectedValues.length > 0) {
				newAppliedFilters.push({
					name: stringFilter,
					type: PropertyType.STRING,
					values: selectedValues,
				});
			}
		}

		for (const numericFilter of Object.keys(numericFilters)) {
			const { min, max } = numericFilters[numericFilter];
			if (min !== 0 || max !== 0) {
				newAppliedFilters.push({
					name: numericFilter,
					type: PropertyType.INT,
					min,
					max,
				});
			}
		}

		setAppliedFilters(newAppliedFilters);
	};

	const removeFilter = (filterName: string, value?: string) => {
		setAppliedFilters((prev) =>
			prev
				.map((filter) => {
					if (
						filter.type === PropertyType.STRING &&
						filter.name === filterName
					) {
						if (value && filter.values?.includes(value)) {
							const newValues = filter.values.filter((v) => v !== value);
							if (newValues.length === 0) {
								updateStringFilter(filterName, '', false);
								return undefined;
							}

							updateStringFilter(filterName, value, false);
							return { ...filter, values: newValues };
						}
					}

					if (filter.type === PropertyType.INT && filter.name === filterName) {
						updateNumericFilter(filterName, 0, 0);
						return undefined;
					}

					return filter;
				})
				.filter((filter): filter is PropertyFilter => filter !== undefined),
		);
	};

	const clearFilters = () => {
		if (!filters) return;

		const resetStringFilters = { ...stringFilters };
		for (const filterName of Object.keys(resetStringFilters)) {
			for (const value of Object.keys(resetStringFilters[filterName])) {
				resetStringFilters[filterName][value] = false;
			}
		}

		const resetNumericFilters = { ...numericFilters };
		for (const filterName of Object.keys(resetNumericFilters)) {
			const filter = filters.find((f) => f.name === filterName);
			if (filter) {
				resetNumericFilters[filterName] = {
					min: filter.min ?? 0,
					max: filter.max ?? 0,
				};
			}
		}

		setStringFilters(resetStringFilters);
		setNumericFilters(resetNumericFilters);
		setAppliedFilters([]);
		setFiltersModified(false);
	};

	const value = {
		filters,
		appliedFilters,
		stringFilters,
		numericFilters,
		filtersModified,
		setExcludePropertyValues,
		updateStringFilter,
		updateNumericFilter,
		applyFilters,
		clearFilters,
		removeFilter,
		isLoading,
	};

	return (
		<FilterContext.Provider value={value}>{children}</FilterContext.Provider>
	);
}

export const useFilterContext = () => useContext(FilterContext);
