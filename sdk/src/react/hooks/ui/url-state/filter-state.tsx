import {
	createSerializer,
	parseAsBoolean,
	parseAsJson,
	parseAsString,
	useQueryState,
} from 'nuqs';
import { useMemo } from 'react';
import { type PropertyFilter, PropertyType } from '../../../_internal';

/**
 * URL-safe price filter type that uses strings instead of BigInt
 * to avoid JSON serialization issues with URL state management
 */
export interface UrlPriceFilter {
	contractAddress: string;
	min?: string;
	max?: string;
}

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

const isPropertyFilter = (f: unknown): f is PropertyFilter => {
	if (typeof f !== 'object' || f === null) return false;
	const obj = f as Record<string, unknown>;
	return (
		typeof obj.name === 'string' &&
		Object.values(PropertyType).includes(obj.type as PropertyType)
	);
};

const validateFilters = (value: unknown): PropertyFilter[] => {
	if (!Array.isArray(value)) return [];
	return value.filter(isPropertyFilter);
};

const isUrlPriceFilter = (f: unknown): f is UrlPriceFilter => {
	if (typeof f !== 'object' || f === null) return false;
	const obj = f as Record<string, unknown>;
	return (
		typeof obj.contractAddress === 'string' &&
		(obj.min === undefined || typeof obj.min === 'string') &&
		(obj.max === undefined || typeof obj.max === 'string')
	);
};

const validatePriceFilters = (value: unknown): UrlPriceFilter[] => {
	if (!Array.isArray(value)) return [];
	return value.filter(isUrlPriceFilter);
};

const filtersParser = parseAsJson(validateFilters).withDefault([]);
const searchParser = parseAsString.withDefault('');
const listedOnlyParser = parseAsBoolean.withDefault(false);
const priceFilterParser = parseAsBoolean.withDefault(false);
const priceFiltersParser = parseAsJson(validatePriceFilters).withDefault([]);

const serialize = createSerializer(
	{
		filters: filtersParser,
		search: searchParser,
		listedOnly: listedOnlyParser,
		priceFilter: priceFilterParser,
		priceFilters: priceFiltersParser,
	},
	{
		urlKeys: {
			filters: 'f',
			search: 'q',
			listedOnly: 'l',
			priceFilter: 'p',
			priceFilters: 'pf',
		},
	},
);

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
	const [showPriceFilter, setShowPriceFilter] = useQueryState(
		'priceFilter',
		priceFilterParser,
	);
	const [priceFilters, setPriceFilters] = useQueryState(
		'priceFilters',
		priceFiltersParser,
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

			setPriceFilter: (contractAddress: string, min?: string, max?: string) => {
				const otherPriceFilters =
					priceFilters?.filter((f) => f.contractAddress !== contractAddress) ??
					[];

				if (!min && !max) {
					setPriceFilters(otherPriceFilters);
					return;
				}

				const newPriceFilter: UrlPriceFilter = {
					contractAddress,
					...(min && { min }),
					...(max && { max }),
				};

				setPriceFilters([...otherPriceFilters, newPriceFilter]);
			},

			getPriceFilter: (contractAddress: string): UrlPriceFilter | undefined => {
				return priceFilters?.find((f) => f.contractAddress === contractAddress);
			},

			clearPriceFilters: () => {
				setPriceFilters([]);
			},

			clearAllFilters: () => {
				void setShowListedOnly(false);
				void setShowPriceFilter(false);
				void setFilterOptions([]);
				void setSearchText('');
				void setPriceFilters([]);
			},
		}),
		[
			filterOptions,
			setFilterOptions,
			setShowListedOnly,
			setSearchText,
			setShowPriceFilter,
			priceFilters,
			setPriceFilters,
		],
	);

	return {
		filterOptions,
		searchText,
		showListedOnly,
		showPriceFilter,
		priceFilters,
		setFilterOptions,
		setSearchText,
		setShowListedOnly,
		setShowPriceFilter,
		setPriceFilters,
		...helpers,
		serialize,
	};
}
