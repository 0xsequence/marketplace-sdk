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

/**
 * Transform an optional field (undefined-safe)
 *
 * @example
 * const result = transformOptional(maybeString, normalizeChainId);
 * // If maybeString is undefined, returns undefined
 * // Otherwise, returns normalized value
 */
export function transformOptional<T, R>(
	value: T | undefined,
	transformer: (value: T) => R,
): R | undefined {
	return value !== undefined ? transformer(value) : undefined;
}

/**
 * Transform an array of items
 *
 * @example
 * const result = transformArray(
 *   ["1", "2", "3"],
 *   normalizeTokenId
 * );
 * // result: [1n, 2n, 3n]
 */
export function transformArray<T, R>(
	items: T[],
	transformer: (item: T) => R,
): R[] {
	return items.map(transformer);
}

/**
 * Transform an optional array (undefined-safe)
 *
 * @example
 * const result = transformOptionalArray(
 *   maybeArray,
 *   normalizeTokenId
 * );
 */
export function transformOptionalArray<T, R>(
	items: T[] | undefined,
	transformer: (item: T) => R,
): R[] | undefined {
	return items !== undefined ? items.map(transformer) : undefined;
}

/**
 * Transform a record/map object by transforming its values
 *
 * @example
 * const result = transformRecord(
 *   { "0x123": ["1", "2"], "0x456": ["3"] },
 *   (tokenIds) => tokenIds.map(normalizeTokenId)
 * );
 */
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
 * Spread operator with transformation - useful for object spreading with field transforms
 *
 * @example
 * return spreadWith(raw, {
 *   chainId: normalizeChainId(raw.chainId),
 *   tokenIds: raw.tokenIds.map(normalizeTokenId)
 * });
 */
export function spreadWith<TObj, TOverrides>(
	obj: TObj,
	overrides: TOverrides,
): Omit<TObj, keyof TOverrides> & TOverrides {
	return {
		...obj,
		...overrides,
	} as Omit<TObj, keyof TOverrides> & TOverrides;
}
