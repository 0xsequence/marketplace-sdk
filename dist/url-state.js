import { d as PropertyType } from "./_internal.js";
import { useMemo } from "react";
import { createSerializer, parseAsBoolean, parseAsJson, parseAsString, useQueryState } from "nuqs";

//#region src/react/hooks/ui/url-state/filter-state.tsx
const validateFilters = (value) => {
	if (!Array.isArray(value)) return [];
	return value.filter((f) => typeof f === "object" && typeof f.name === "string" && Object.values(PropertyType).includes(f.type));
};
const validatePriceFilters = (value) => {
	if (!Array.isArray(value)) return [];
	return value.filter((f) => typeof f === "object" && typeof f.contractAddress === "string" && (f.min === void 0 || typeof f.min === "string") && (f.max === void 0 || typeof f.max === "string"));
};
const filtersParser = parseAsJson(validateFilters).withDefault([]);
const searchParser = parseAsString.withDefault("");
const listedOnlyParser = parseAsBoolean.withDefault(false);
const priceFilterParser = parseAsBoolean.withDefault(false);
const priceFiltersParser = parseAsJson(validatePriceFilters).withDefault([]);
const serialize = createSerializer({
	filters: filtersParser,
	search: searchParser,
	listedOnly: listedOnlyParser,
	priceFilter: priceFilterParser,
	priceFilters: priceFiltersParser
}, { urlKeys: {
	filters: "f",
	search: "q",
	listedOnly: "l",
	priceFilter: "p",
	priceFilters: "pf"
} });
function useFilterState() {
	const [filterOptions, setFilterOptions] = useQueryState("filters", filtersParser);
	const [searchText, setSearchText] = useQueryState("search", searchParser);
	const [showListedOnly, setShowListedOnly] = useQueryState("listedOnly", listedOnlyParser);
	const [showPriceFilter, setShowPriceFilter] = useQueryState("priceFilter", priceFilterParser);
	const [priceFilters, setPriceFilters] = useQueryState("priceFilters", priceFiltersParser);
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
		...useMemo(() => ({
			getFilter: (name) => {
				return filterOptions?.find((f) => f.name === name);
			},
			getFilterValues: (name) => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter) return void 0;
				if (filter.type === PropertyType.INT) return {
					type: PropertyType.INT,
					min: filter.min ?? 0,
					max: filter.max ?? 0
				};
				return {
					type: PropertyType.STRING,
					values: filter.values ?? []
				};
			},
			isFilterActive: (name) => {
				return !!filterOptions?.find((f) => f.name === name);
			},
			isStringValueSelected: (name, value) => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter || filter.type !== PropertyType.STRING) return false;
				return filter.values?.includes(value) ?? false;
			},
			isIntFilterActive: (name) => {
				const filter = filterOptions?.find((f) => f.name === name);
				return !!filter && filter.type === PropertyType.INT;
			},
			getIntFilterRange: (name) => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter || filter.type !== PropertyType.INT) return void 0;
				return [filter.min ?? 0, filter.max ?? 0];
			},
			deleteFilter: (name) => {
				setFilterOptions(filterOptions?.filter((f) => !(f.name === name)) ?? []);
			},
			toggleStringFilterValue: (name, value) => {
				const otherFilters = filterOptions?.filter((f) => !(f.name === name)) ?? [];
				const filter = filterOptions?.find((f) => f.name === name);
				const existingValues = filter?.type === PropertyType.STRING ? filter.values ?? [] : [];
				if (existingValues.includes(value)) {
					const newValues = existingValues.filter((v) => v !== value);
					if (newValues.length === 0) {
						setFilterOptions(otherFilters);
						return;
					}
					setFilterOptions([...otherFilters, {
						name,
						type: PropertyType.STRING,
						values: newValues
					}]);
				} else setFilterOptions([...otherFilters, {
					name,
					type: PropertyType.STRING,
					values: [...existingValues, value]
				}]);
			},
			setIntFilterValue: (name, min, max) => {
				if (min === max && min === 0) {
					setFilterOptions(filterOptions?.filter((f) => !(f.name === name)) ?? []);
					return;
				}
				setFilterOptions([...filterOptions?.filter((f) => !(f.name === name)) ?? [], {
					name,
					type: PropertyType.INT,
					min,
					max
				}]);
			},
			setPriceFilter: (contractAddress, min, max) => {
				const otherPriceFilters = priceFilters?.filter((f) => f.contractAddress !== contractAddress) ?? [];
				if (!min && !max) {
					setPriceFilters(otherPriceFilters);
					return;
				}
				const newPriceFilter = {
					contractAddress,
					...min && { min: BigInt(min) },
					...max && { max: BigInt(max) }
				};
				setPriceFilters([...otherPriceFilters, newPriceFilter]);
			},
			getPriceFilter: (contractAddress) => {
				return priceFilters?.find((f) => f.contractAddress === contractAddress);
			},
			clearPriceFilters: () => {
				setPriceFilters([]);
			},
			clearAllFilters: () => {
				setShowListedOnly(false);
				setShowPriceFilter(false);
				setFilterOptions([]);
				setSearchText("");
				setPriceFilters([]);
			}
		}), [
			filterOptions,
			setFilterOptions,
			setShowListedOnly,
			setSearchText,
			setShowPriceFilter,
			priceFilters,
			setPriceFilters
		]),
		serialize
	};
}

//#endregion
export { useFilterState as t };
//# sourceMappingURL=url-state.js.map