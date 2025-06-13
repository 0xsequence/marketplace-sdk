/**
 * Standard query options that can be used across all marketplace SDK hooks
 *
 * Based on TanStack Query v5 UseQueryOptions, but simplified, the type from TanStack is hard to modify
 */
export interface StandardQueryOptions<TError = Error> {
	/** Whether the query should be enabled/disabled */
	enabled?: boolean;
	/** Time in milliseconds that  data is considered fresh */
	staleTime?: number;
	gcTime?: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	refetchInterval?: number | false | ((query: any) => number | false);
	refetchOnWindowFocus?: boolean;
	refetchOnMount?: boolean;
	refetchOnReconnect?: boolean;
	retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
	retryDelay?: number | ((retryAttempt: number, error: TError) => number);
	// select is not supported for now
	// select?: <TSelected = TData>(data: TData) => TSelected;
	suspense?: boolean;
	/** Placeholder data is not supported for now */
	// placeholderData?: TData | (() => TData);
}
