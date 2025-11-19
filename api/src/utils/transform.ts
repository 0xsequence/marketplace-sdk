/**
 * Generic transformation utilities for API type normalization
 *
 * This module provides composable, type-safe helpers for transforming
 * API responses and requests between raw and normalized formats.
 *
 * Key features:
 * - Safe optional field handling
 * - Array and record transformation
 * - Partial object spreading with type safety
 * - Reusable across all adapters
 */

export function transformOptional<T, R>(
	value: T | undefined,
	transformer: (value: T) => R,
): R | undefined {
	return value !== undefined ? transformer(value) : undefined;
}

export function transformArray<T, R>(
	items: T[],
	transformer: (item: T) => R,
): R[] {
	return items.map(transformer);
}

export function transformOptionalArray<T, R>(
	items: T[] | undefined,
	transformer: (item: T) => R,
): R[] | undefined {
	return items !== undefined ? items.map(transformer) : undefined;
}

export function transformRecord<K extends string, V, R>(
	record: Record<K, V>,
	transformer: (value: V, key: K) => R,
): Record<K, R> {
	return Object.fromEntries(
		Object.entries(record).map(([key, value]) => [
			key,
			transformer(value as V, key as K),
		]),
	) as Record<K, R>;
}

/**
 * Transform an optional field only if it exists (doesn't add undefined)
 *
 * This helper conditionally includes a field in an object spread only when the source
 * value is defined. Unlike `transformOptional`, this returns an empty object when
 * the value is undefined, preventing `undefined` from appearing in the result.
 *
 * @param key - The field name to include in the result
 * @param value - The optional value to transform
 * @param transformer - Function to transform the value if it exists
 * @returns An object with the field if value exists, or empty object if undefined
 *
 * @example
 * // Without transformOptionalField (BAD - adds undefined to result)
 * return {
 *   ...obj,
 *   bridgeInfo: raw.bridgeInfo ? transform(raw.bridgeInfo) : undefined
 * };
 *
 * @example
 * // With transformOptionalField (GOOD - only adds field if it exists)
 * return {
 *   ...obj,
 *   ...transformOptionalField('bridgeInfo', raw.bridgeInfo, transform)
 * };
 */
export function transformOptionalField<K extends string, T, R>(
	key: K,
	value: T | undefined,
	transformer: (value: T) => R,
): Record<K, R> | Record<string, never> {
	return value !== undefined
		? ({ [key]: transformer(value) } as Record<K, R>)
		: {};
}

export function spreadWith<TObj, TOverrides>(
	obj: TObj,
	overrides: TOverrides,
): Omit<TObj, keyof TOverrides> & TOverrides {
	return {
		...obj,
		...overrides,
	} as Omit<TObj, keyof TOverrides> & TOverrides;
}

export interface Page {
	page: number;
	pageSize: number;
	more?: boolean;
	sort?: Array<SortBy>;
}

export interface SortBy {
	column: string;
	order: 'ASC' | 'DESC';
}

export interface BuildPageParams {
	page?: number;
	pageSize?: number;
	more?: boolean;
	sort?: Array<SortBy>;
}

/**
 * Build a Page object for API requests with pagination.
 * Provides a consistent way to construct pagination parameters across the SDK.
 *
 * @param params - Page construction parameters
 * @returns Page object for API requests, or undefined if no pagination params provided
 *
 * @example
 * // Simple pagination
 * const page = buildPage({ page: 1, pageSize: 30 });
 * // result: { page: 1, pageSize: 30 }
 *
 * @example
 * // With sorting
 * const page = buildPage({
 *   page: 2,
 *   pageSize: 50,
 *   sort: [{ column: 'price', order: 'ASC' }]
 * });
 *
 * @example
 * // Returns undefined when no params
 * const page = buildPage({});
 * // result: undefined
 */
export function buildPage(params: BuildPageParams): Page | undefined {
	// If no pagination params are provided, return undefined
	if (
		params.page === undefined &&
		params.pageSize === undefined &&
		!params.sort?.length
	) {
		return undefined;
	}

	const page: Page = {
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 30,
	};

	if (params.more !== undefined) {
		page.more = params.more;
	}

	if (params.sort?.length) {
		page.sort = params.sort;
	}

	return page;
}
