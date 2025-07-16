import { PropertyType } from "./marketplace.gen-HpnpL5xU.js";
import { useMemo } from "react";
import { createSerializer, parseAsBoolean, parseAsJson, parseAsString, useQueryState } from "nuqs";

//#region src/react/hooks/ui/useFilterState.tsx
const validateFilters = (value) => {
	if (!Array.isArray(value)) return [];
	return value.filter((f) => typeof f === "object" && typeof f.name === "string" && Object.values(PropertyType).includes(f.type));
};
const filtersParser = parseAsJson(validateFilters).withDefault([]);
const searchParser = parseAsString.withDefault("");
const listedOnlyParser = parseAsBoolean.withDefault(false);
const serialize = createSerializer({
	filters: filtersParser,
	search: searchParser,
	listedOnly: listedOnlyParser
}, { urlKeys: {
	filters: "f",
	search: "q",
	listedOnly: "l"
} });
function useFilterState() {
	const [filterOptions, setFilterOptions] = useQueryState("filters", filtersParser);
	const [searchText, setSearchText] = useQueryState("search", searchParser);
	const [showListedOnly, setShowListedOnly] = useQueryState("listedOnly", listedOnlyParser);
	const helpers = useMemo(() => ({
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
			const otherFilters = filterOptions?.filter((f) => !(f.name === name)) ?? [];
			setFilterOptions(otherFilters);
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
				const otherFilters$1 = filterOptions?.filter((f) => !(f.name === name)) ?? [];
				setFilterOptions(otherFilters$1);
				return;
			}
			const otherFilters = filterOptions?.filter((f) => !(f.name === name)) ?? [];
			setFilterOptions([...otherFilters, {
				name,
				type: PropertyType.INT,
				min,
				max
			}]);
		},
		clearAllFilters: () => {
			setShowListedOnly(false);
			setFilterOptions([]);
			setSearchText("");
		}
	}), [
		filterOptions,
		setFilterOptions,
		setShowListedOnly,
		setSearchText
	]);
	return {
		filterOptions,
		searchText,
		showListedOnly,
		setFilterOptions,
		setSearchText,
		setShowListedOnly,
		...helpers,
		serialize
	};
}

//#endregion
export { useFilterState };
//# sourceMappingURL=useFilterState-DeJNZfWb.js.map