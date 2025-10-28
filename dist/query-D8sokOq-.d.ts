//#region src/react/types/query.d.ts
/**
 * Standard query options that can be used across all marketplace SDK hooks
 *
 * Based on TanStack Query v5 UseQueryOptions, but simplified, the type from TanStack is hard to modify
 */
interface StandardQueryOptions<TError = Error> {
  /** Whether the query should be enabled/disabled */
  enabled?: boolean;
  /** Time in milliseconds that  data is considered fresh */
  staleTime?: number;
  gcTime?: number;
  refetchInterval?: number | false | ((query: any) => number | false);
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: TError) => number);
  suspense?: boolean;
}
/**
 * Standard infinite query options that can be used across all marketplace SDK hooks
 * that support infinite pagination
 */
interface StandardInfiniteQueryOptions<TError = Error> extends StandardQueryOptions<TError> {
  /** Maximum number of pages to fetch */
  maxPages?: number;
}
//#endregion
export { StandardQueryOptions as n, StandardInfiniteQueryOptions as t };
//# sourceMappingURL=query-D8sokOq-.d.ts.map