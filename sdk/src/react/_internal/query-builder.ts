import {
	infiniteQueryOptions,
	type QueryKey,
	queryOptions,
} from '@tanstack/react-query';
import type { Page, SdkConfig } from '../../types';
import type {
	StandardInfiniteQueryOptions,
	StandardQueryOptions,
} from '../types/query';

/**
 * Generic params structure for query builders
 * Extends API request params with SDK-specific requirements
 */
export interface BaseQueryParams {
	config: SdkConfig;
	query?: StandardQueryOptions;
}

export interface BaseInfiniteQueryParams {
	config: SdkConfig;
	query?: StandardInfiniteQueryOptions;
}

/**
 * Extract required keys from a type (excludes optional properties)
 * A property is required if removing it makes the type incompatible
 */
export type RequiredKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Validates that a readonly tuple contains ALL required keys from a type
 * This ensures developers don't forget to list any required parameters
 *
 * How it works:
 * - Checks if every RequiredKey<TParams> exists in the provided tuple
 * - Returns the tuple type if valid, or 'never' if keys are missing
 * - Must be used with 'as const' for proper type inference
 *
 * Example:
 * type Keys = RequiredKeys<{a: string, b: number, c?: boolean}>; // 'a' | 'b'
 * type Valid = EnsureAllRequiredKeys<Params, ['a', 'b']>; // ✅ OK - returns ['a', 'b']
 * type Invalid = EnsureAllRequiredKeys<Params, ['a']>; // ❌ Error - returns 'never'
 */
export type EnsureAllRequiredKeys<
	TParams,
	TKeys extends ReadonlyArray<RequiredKeys<TParams>>,
> = RequiredKeys<TParams> extends TKeys[number] ? TKeys : never;

/**
 * Configuration for building standard query options
 */
export interface QueryBuilderConfig<TParams extends BaseQueryParams, TData> {
	/** Existing query key function to reuse */
	getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
	/**
	 * List of required parameter keys for enabled check
	 * Type-safe: Must include ALL required keys from TParams
	 * TypeScript will show an error if any required keys are missing
	 * Example: ['chainId', 'collectionAddress', 'tokenId', 'config']
	 */
	requiredParams: EnsureAllRequiredKeys<
		TParams,
		ReadonlyArray<RequiredKeys<TParams>>
	>;
	/** Fetch function to call when query executes */
	fetcher: (params: TParams) => Promise<TData>;
	/**
	 * Optional custom validation beyond truthiness checks
	 * Useful for array length checks or complex validation logic
	 * Example: (params) => (params.orders?.length ?? 0) > 0
	 */
	customValidation?: (params: WithOptionalParams<TParams>) => boolean;
}

/**
 * Configuration for building infinite query options
 */
export interface InfiniteQueryBuilderConfig<
	TParams extends BaseInfiniteQueryParams,
	TResponse,
> {
	/** Existing query key function to reuse */
	getQueryKey: (params: WithOptionalInfiniteParams<TParams>) => QueryKey;
	/**
	 * List of required parameter keys for enabled check
	 * Type-safe: Must include ALL required keys from TParams
	 * TypeScript will show an error if any required keys are missing
	 * Example: ['chainId', 'collectionAddress', 'side', 'config']
	 */
	requiredParams: EnsureAllRequiredKeys<
		TParams,
		ReadonlyArray<RequiredKeys<TParams>>
	>;
	/** Fetch function to call when query executes */
	fetcher: (params: TParams, page: Page) => Promise<TResponse>;
	/** Extract page info from response */
	getPageInfo: (response: TResponse) => Page | undefined;
	/**
	 * Optional custom validation beyond truthiness checks
	 * Useful for array length checks or complex validation logic
	 * Example: (params) => (params.orders?.length ?? 0) > 0
	 */
	customValidation?: (params: WithOptionalInfiniteParams<TParams>) => boolean;
}

/**
 * Helper type to mark params as optional except config
 */
export type WithOptionalParams<T extends BaseQueryParams> = {
	[K in keyof T]?: T[K];
} & Pick<T, 'config'> &
	Partial<Pick<T, 'query'>>;

export type WithOptionalInfiniteParams<T extends BaseInfiniteQueryParams> = {
	[K in keyof T]?: T[K];
} & Pick<T, 'config'> &
	Partial<Pick<T, 'query'>>;

/**
 * Helper function to create type-safe requiredParams array
 * Validates at compile-time that all required parameters are included
 *
 * Usage:
 * requiredParams: requiredParamsFor<FetchHighestOfferParams>()(['chainId', 'collectionAddress', 'tokenId', 'config'])
 */
export function requiredParamsFor<TParams>() {
	return <const TKeys extends ReadonlyArray<RequiredKeys<TParams>>>(
		keys: TKeys & (RequiredKeys<TParams> extends TKeys[number] ? TKeys : never),
	): TKeys => keys;
}

/**
 * Builds standard query options with automatic enabled checking and type-safe requiredParams
 * Eliminates need for biome-ignore comments and manual null assertions
 *
 * Type Safety:
 * - requiredParams must include ALL required fields from TParams
 * - requiredParams cannot include optional fields
 * - TypeScript validates this at compile time
 */
export function buildQueryOptions<
	TParams extends BaseQueryParams,
	TData,
	const TKeys extends ReadonlyArray<RequiredKeys<TParams>>,
>(
	config: {
		getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
		requiredParams: TKeys &
			(RequiredKeys<TParams> extends TKeys[number] ? TKeys : never);
		fetcher: (params: TParams) => Promise<TData>;
		customValidation?: (params: WithOptionalParams<TParams>) => boolean;
	},
	params: WithOptionalParams<TParams>,
) {
	// Check if all required params are present
	const requiredParamsValid = config.requiredParams.every((key) => params[key]);

	// Run custom validation if provided
	const customValid = config.customValidation
		? config.customValidation(params)
		: true;

	const enabled = Boolean(
		requiredParamsValid &&
			customValid &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: config.getQueryKey(params),
		queryFn: () => {
			// TypeScript knows params are valid here because enabled=true only if all required params exist
			return config.fetcher(params as TParams);
		},
		...params.query,
		enabled,
	});
}

/**
 * Builds infinite query options with automatic enabled checking, pagination, and type-safe requiredParams
 * Eliminates need for biome-ignore comments and manual null assertions
 *
 * Type Safety:
 * - requiredParams must include ALL required fields from TParams
 * - requiredParams cannot include optional fields
 * - TypeScript validates this at compile time
 */
export function buildInfiniteQueryOptions<
	TParams extends BaseInfiniteQueryParams,
	TResponse,
	const TKeys extends ReadonlyArray<RequiredKeys<TParams>>,
>(
	config: {
		getQueryKey: (params: WithOptionalInfiniteParams<TParams>) => QueryKey;
		requiredParams: TKeys &
			(RequiredKeys<TParams> extends TKeys[number] ? TKeys : never);
		fetcher: (params: TParams, page: Page) => Promise<TResponse>;
		getPageInfo: (response: TResponse) => Page | undefined;
		customValidation?: (params: WithOptionalInfiniteParams<TParams>) => boolean;
	},
	params: WithOptionalInfiniteParams<TParams>,
) {
	// Check if all required params are present
	const requiredParamsValid = config.requiredParams.every((key) => params[key]);

	// Run custom validation if provided
	const customValid = config.customValidation
		? config.customValidation(params)
		: true;

	const enabled = Boolean(
		requiredParamsValid &&
			customValid &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return infiniteQueryOptions({
		queryKey: config.getQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return config.fetcher(params as TParams, pageParam);
		},
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) => {
			const pageInfo = config.getPageInfo(lastPage);
			return pageInfo?.more ? pageInfo : undefined;
		},
		...params.query,
		enabled,
	});
}
