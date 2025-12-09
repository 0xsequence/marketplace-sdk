import { Bt as PriceFilter, Ut as PropertyFilter, Wt as PropertyType } from "./create-config.js";
import * as nuqs0 from "nuqs";

//#region src/react/hooks/ui/url-state/filter-state.d.ts
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
declare function useFilterState(): {
  serialize: {
    (values: Partial<{
      filters: PropertyFilter[] | null;
      search: string | null;
      listedOnly: boolean | null;
      priceFilter: boolean | null;
      priceFilters: PriceFilter[] | null;
    }>): string;
    (base: string | URLSearchParams | URL, values: Partial<{
      filters: PropertyFilter[] | null;
      search: string | null;
      listedOnly: boolean | null;
      priceFilter: boolean | null;
      priceFilters: PriceFilter[] | null;
    }> | null): string;
  };
  getFilter: (name: string) => PropertyFilter | undefined;
  getFilterValues: (name: string) => FilterValues | undefined;
  isFilterActive: (name: string) => boolean;
  isStringValueSelected: (name: string, value: string) => boolean;
  isIntFilterActive: (name: string) => boolean;
  getIntFilterRange: (name: string) => [number, number] | undefined;
  deleteFilter: (name: string) => void;
  toggleStringFilterValue: (name: string, value: string) => void;
  setIntFilterValue: (name: string, min: number, max: number) => void;
  setPriceFilter: (contractAddress: string, min?: string, max?: string) => void;
  getPriceFilter: (contractAddress: string) => PriceFilter | undefined;
  clearPriceFilters: () => void;
  clearAllFilters: () => void;
  filterOptions: PropertyFilter[];
  searchText: string;
  showListedOnly: boolean;
  showPriceFilter: boolean;
  priceFilters: PriceFilter[];
  setFilterOptions: (value: PropertyFilter[] | ((old: PropertyFilter[]) => PropertyFilter[] | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setSearchText: (value: string | ((old: string) => string | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setShowListedOnly: (value: boolean | ((old: boolean) => boolean | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setShowPriceFilter: (value: boolean | ((old: boolean) => boolean | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
  setPriceFilters: (value: PriceFilter[] | ((old: PriceFilter[]) => PriceFilter[] | null) | null, options?: nuqs0.Options) => Promise<URLSearchParams>;
};
//#endregion
export { useFilterState as t };
//# sourceMappingURL=index17.d.ts.map