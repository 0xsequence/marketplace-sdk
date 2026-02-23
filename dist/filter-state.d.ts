import { _n as PropertyType, gn as PropertyFilter } from "./index2.js";
import { TransitionStartFunction } from "react";

//#region ../node_modules/.pnpm/nuqs@2.8.6_next@16.1.1_@babel+core@7.28.5_babel-plugin-macros@3.1.0_react-dom@19.2.3_re_a1d3c3437a1ba041cab2f7bda7f7ecb4/node_modules/nuqs/dist/defs-BFMOAnmN.d.ts
type HistoryOptions = "replace" | "push";
type LimitUrlUpdates = {
  method: "debounce";
  timeMs: number;
} | {
  method: "throttle";
  timeMs: number;
};
type Options = {
  /**
  * How the query update affects page history
  *
  * `push` will create a new history entry, allowing to use the back/forward
  * buttons to navigate state updates.
  * `replace` (default) will keep the current history point and only replace
  * the query string.
  */
  history?: HistoryOptions;
  /**
  * Scroll to top after a query state update
  *
  * Defaults to `false`, unlike the Next.js router page navigation methods.
  */
  scroll?: boolean;
  /**
  * Shallow mode (true by default) keeps query states update client-side only,
  * meaning there won't be calls to the server.
  *
  * Setting it to `false` will trigger a network request to the server with
  * the updated querystring.
  */
  shallow?: boolean;
  /**
  * Maximum amount of time (ms) to wait between updates of the URL query string.
  *
  * This is to alleviate rate-limiting of the Web History API in browsers,
  * and defaults to 50ms. Safari requires a higher value of around 120ms.
  *
  * Note: the value will be limited to a minimum of 50ms, anything lower
  * will not have any effect.
  *
  * @deprecated use `limitUrlUpdates: { 'method': 'throttle', timeMs: number }`
  * or use the shorthand:
  * ```ts
  * import { throttle } from 'nuqs'
  *
  * limitUrlUpdates: throttle(100) // time in ms
  * ```
  */
  throttleMs?: number;
  /**
  * Limit the rate of URL updates to prevent spamming the browser history,
  * and the server if `shallow: false`.
  *
  * This is to alleviate rate-limiting of the Web History API in browsers,
  * and defaults to 50ms. Safari requires a higher value of around 120ms.
  *
  * Note: the value will be limited to a minimum of 50ms, anything lower
  * will not have any effect.
  *
  * If both `throttleMs` and `limitUrlUpdates` are set, `limitUrlUpdates` will
  * take precedence.
  */
  limitUrlUpdates?: LimitUrlUpdates;
  /**
  * In RSC frameworks, opt-in to observing Server Component loading states when
  * doing non-shallow updates by passing a `startTransition` from the
  * `React.useTransition()` hook.
  *
  * In other frameworks, navigation events triggered by a query update can also
  * be wrapped in a transition this way (e.g. `React.startTransition`).
  */
  startTransition?: TransitionStartFunction;
  /**
  * Clear the key-value pair from the URL query string when setting the state
  * to the default value.
  *
  * Defaults to `true` to keep URLs clean.
  *
  * Set it to `false` to keep backwards-compatiblity when the default value
  * changes (prefer explicit URLs whose meaning don't change).
  */
  clearOnDefault?: boolean;
};
//#endregion
//#region src/react/hooks/ui/url-state/filter-state.d.ts
/**
 * URL-safe price filter type that uses strings instead of BigInt
 * to avoid JSON serialization issues with URL state management
 */
interface UrlPriceFilter {
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
declare function useFilterState(): {
  serialize: {
    (values: Partial<{
      filters: PropertyFilter[] | null;
      search: string | null;
      listedOnly: boolean | null;
      priceFilter: boolean | null;
      priceFilters: UrlPriceFilter[] | null;
    }>): string;
    (base: string | URLSearchParams | URL, values: Partial<{
      filters: PropertyFilter[] | null;
      search: string | null;
      listedOnly: boolean | null;
      priceFilter: boolean | null;
      priceFilters: UrlPriceFilter[] | null;
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
  getPriceFilter: (contractAddress: string) => UrlPriceFilter | undefined;
  clearPriceFilters: () => void;
  clearAllFilters: () => void;
  filterOptions: PropertyFilter[];
  searchText: string;
  showListedOnly: boolean;
  showPriceFilter: boolean;
  priceFilters: UrlPriceFilter[];
  setFilterOptions: (value: PropertyFilter[] | ((old: PropertyFilter[]) => PropertyFilter[] | null) | null, options?: Options) => Promise<URLSearchParams>;
  setSearchText: (value: string | ((old: string) => string | null) | null, options?: Options) => Promise<URLSearchParams>;
  setShowListedOnly: (value: boolean | ((old: boolean) => boolean | null) | null, options?: Options) => Promise<URLSearchParams>;
  setShowPriceFilter: (value: boolean | ((old: boolean) => boolean | null) | null, options?: Options) => Promise<URLSearchParams>;
  setPriceFilters: (value: UrlPriceFilter[] | ((old: UrlPriceFilter[]) => UrlPriceFilter[] | null) | null, options?: Options) => Promise<URLSearchParams>;
};
//#endregion
export { useFilterState as n, UrlPriceFilter as t };
//# sourceMappingURL=filter-state.d.ts.map