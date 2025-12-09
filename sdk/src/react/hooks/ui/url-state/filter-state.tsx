import {
	createSerializer,
	parseAsBoolean,
	parseAsJson,
	parseAsString,
	useQueryState,
} from 'nuqs';
import { useMemo } from 'react';
import {
	type PriceFilter,
	type PropertyFilter,
	PropertyType,
} from '../../../_internal';

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

const validatePriceFilters = (value: unknown): PriceFilter[] => {
	if (!Array.isArray(value)) return [];
	return value.filter(
		(f): f is PriceFilter =>
			typeof f === 'object' &&
			typeof f.contractAddress === 'string' &&
			(f.min === undefined || typeof f.min === 'string') &&
			(f.max === undefined || typeof f.max === 'string'),
	);
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

				const newPriceFilter: PriceFilter = {
					contractAddress,
					...(min && { min: BigInt(min) }),
					...(max && { max: BigInt(max) }),
				};

				setPriceFilters([...otherPriceFilters, newPriceFilter]);
			},

			getPriceFilter: (contractAddress: string): PriceFilter | undefined => {
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
