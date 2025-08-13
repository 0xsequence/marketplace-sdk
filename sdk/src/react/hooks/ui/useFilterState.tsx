import {
	createSerializer,
	parseAsBoolean,
	parseAsJson,
	parseAsString,
	useQueryState,
} from 'nuqs';
import { useMemo } from 'react';
import { type PropertyFilter, PropertyType } from '../../_internal';

interface StringFilterValues {
	type: PropertyType.STRING;
	values: string[];
}

interface IntFilterValues {
	type: PropertyType.INT;
	min: number;
	max: number;
}

type FilterValues = StringFilterValues | IntFilterValues;

const validateFilters = (value: unknown): PropertyFilter[] => {
	if (!Array.isArray(value)) return [];
	return value.filter(
		(f): f is PropertyFilter =>
			typeof f === 'object' &&
			typeof f.name === 'string' &&
			Object.values(PropertyType).includes(f.type),
	);
};

const filtersParser = parseAsJson(validateFilters).withDefault([]);
const searchParser = parseAsString.withDefault('');
const listedOnlyParser = parseAsBoolean.withDefault(false);

const serialize = createSerializer(
	{
		filters: filtersParser,
		search: searchParser,
		listedOnly: listedOnlyParser,
	},
	{
		urlKeys: {
			filters: 'f',
			search: 'q',
			listedOnly: 'l',
		},
	},
);

/**
 * Manages marketplace filter state with URL synchronization
 *
 * This hook provides a comprehensive filtering system for marketplace views,
 * including property filters, search text, and listed-only toggles. All state
 * is automatically synchronized with URL query parameters for shareable links.
 *
 * @returns Filter state and helper functions
 * @returns returns.filterOptions - Current property filters array
 * @returns returns.searchText - Current search query string
 * @returns returns.showListedOnly - Whether to show only listed items
 * @returns returns.setFilterOptions - Set property filters directly
 * @returns returns.setSearchText - Set search text
 * @returns returns.setShowListedOnly - Toggle listed-only filter
 * @returns returns.getFilter - Get a specific filter by name
 * @returns returns.getFilterValues - Get filter values with type info
 * @returns returns.isFilterActive - Check if a filter is active
 * @returns returns.isStringValueSelected - Check if string value is selected
 * @returns returns.isIntFilterActive - Check if int filter is active
 * @returns returns.getIntFilterRange - Get min/max for int filter
 * @returns returns.deleteFilter - Remove a filter by name
 * @returns returns.toggleStringFilterValue - Toggle a string filter value
 * @returns returns.setIntFilterValue - Set integer range filter
 * @returns returns.clearAllFilters - Clear all filters and search
 * @returns returns.serialize - Serialize current state to URL string
 *
 * @example
 * Basic filter management:
 * ```typescript
 * const {
 *   filterOptions,
 *   searchText,
 *   showListedOnly,
 *   toggleStringFilterValue,
 *   setSearchText
 * } = useFilterState();
 *
 * // Toggle a trait filter
 * const handleTraitClick = (trait: string, value: string) => {
 *   toggleStringFilterValue(trait, value);
 * };
 *
 * // Apply filters to query
 * const { data } = useListCollectibles({
 *   filter: {
 *     properties: filterOptions,
 *     searchText,
 *     includeEmpty: !showListedOnly
 *   }
 * });
 * ```
 *
 * @example
 * With filter UI components:
 * ```typescript
 * const {
 *   isStringValueSelected,
 *   setIntFilterValue,
 *   getIntFilterRange,
 *   clearAllFilters
 * } = useFilterState();
 *
 * // Trait checkbox
 * <Checkbox
 *   checked={isStringValueSelected('Rarity', 'Legendary')}
 *   onChange={() => toggleStringFilterValue('Rarity', 'Legendary')}
 * />
 *
 * // Price range slider
 * const [min, max] = getIntFilterRange('Price') ?? [0, 100];
 * <RangeSlider
 *   value={[min, max]}
 *   onChange={([newMin, newMax]) =>
 *     setIntFilterValue('Price', newMin, newMax)
 *   }
 * />
 *
 * // Clear all button
 * <Button onClick={clearAllFilters}>Clear Filters</Button>
 * ```
 *
 * @example
 * Sharing filter state via URL:
 * ```typescript
 * const { serialize, filterOptions } = useFilterState();
 *
 * // Get shareable URL
 * const shareUrl = `${window.location.origin}${window.location.pathname}?${serialize({
 *   filters: filterOptions,
 *   search: 'rare sword',
 *   listedOnly: true
 * })}`;
 *
 * // URL will be like: /marketplace?f=[...]&q=rare+sword&l=true
 * ```
 *
 * @remarks
 * - All state is stored in URL query parameters using nuqs
 * - URL keys are shortened: f=filters, q=search, l=listedOnly
 * - Supports both string (multi-select) and int (range) filter types
 * - Empty filters are automatically removed from state
 * - The serialize function creates shareable URLs
 * - Filter state persists across page refreshes
 *
 * @see {@link PropertyFilter} - The filter object structure
 * @see {@link PropertyType} - Enum for filter types (STRING, INT)
 * @see {@link useFilters} - Lower-level filter hook without URL sync
 */
export function useFilterState() {
	const [filterOptions, setFilterOptions] = useQueryState(
		'filters',
		filtersParser,
	);
	const [searchText, setSearchText] = useQueryState('search', searchParser);
	const [showListedOnly, setShowListedOnly] = useQueryState(
		'listedOnly',
		listedOnlyParser,
	);

	const helpers = useMemo(
		() => ({
			getFilter: (name: string): PropertyFilter | undefined => {
				return filterOptions?.find((f) => f.name === name);
			},

			getFilterValues: (name: string): FilterValues | undefined => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter) return undefined;

				if (filter.type === PropertyType.INT) {
					return {
						type: PropertyType.INT,
						min: filter.min ?? 0,
						max: filter.max ?? 0,
					};
				}

				return {
					type: PropertyType.STRING,
					values: (filter.values as string[]) ?? [],
				};
			},

			isFilterActive: (name: string): boolean => {
				return !!filterOptions?.find((f) => f.name === name);
			},

			isStringValueSelected: (name: string, value: string): boolean => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter || filter.type !== PropertyType.STRING) return false;
				return (filter.values as string[])?.includes(value) ?? false;
			},

			isIntFilterActive: (name: string): boolean => {
				const filter = filterOptions?.find((f) => f.name === name);
				return !!filter && filter.type === PropertyType.INT;
			},

			getIntFilterRange: (name: string): [number, number] | undefined => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter || filter.type !== PropertyType.INT) return undefined;
				return [filter.min ?? 0, filter.max ?? 0];
			},

			deleteFilter: (name: string) => {
				const otherFilters =
					filterOptions?.filter((f) => !(f.name === name)) ?? [];
				setFilterOptions(otherFilters);
			},

			toggleStringFilterValue: (name: string, value: string) => {
				const otherFilters =
					filterOptions?.filter((f) => !(f.name === name)) ?? [];
				const filter = filterOptions?.find((f) => f.name === name);
				const existingValues =
					filter?.type === PropertyType.STRING
						? ((filter.values as string[]) ?? [])
						: [];

				if (existingValues.includes(value)) {
					const newValues = existingValues.filter((v) => v !== value);
					if (newValues.length === 0) {
						setFilterOptions(otherFilters);
						return;
					}
					setFilterOptions([
						...otherFilters,
						{ name, type: PropertyType.STRING, values: newValues },
					]);
				} else {
					setFilterOptions([
						...otherFilters,
						{
							name,
							type: PropertyType.STRING,
							values: [...existingValues, value],
						},
					]);
				}
			},

			setIntFilterValue: (name: string, min: number, max: number) => {
				if (min === max && min === 0) {
					const otherFilters =
						filterOptions?.filter((f) => !(f.name === name)) ?? [];
					setFilterOptions(otherFilters);
					return;
				}
				const otherFilters =
					filterOptions?.filter((f) => !(f.name === name)) ?? [];
				setFilterOptions([
					...otherFilters,
					{ name, type: PropertyType.INT, min, max },
				]);
			},

			clearAllFilters: () => {
				void setShowListedOnly(false);
				void setFilterOptions([]);
				void setSearchText('');
			},
		}),
		[filterOptions, setFilterOptions, setShowListedOnly, setSearchText],
	);

	return {
		filterOptions,
		searchText,
		showListedOnly,
		setFilterOptions,
		setSearchText,
		setShowListedOnly,
		...helpers,
		serialize,
	};
}
