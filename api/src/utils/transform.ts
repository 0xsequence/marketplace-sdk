/**
 * Generic transformation utilities for API type normalization
 *
 * This module provides composable, type-safe helpers for transforming
 * API responses and requests between raw and normalized formats.
 *
 * Key features:
 * - Generic field transformation with type inference
 * - Safe optional field handling
 * - Deep object and array transformation
 * - Reusable across all adapters
 */

/**
 * Transform a single field in an object using a transformer function
 *
 * @example
 * const result = transformField(
 *   { chainId: "1", name: "Ethereum" },
 *   "chainId",
 *   normalizeChainId
 * );
 * // result: { chainId: 1, name: "Ethereum" }
 */
export function transformField<
	TObj extends Record<string, unknown>,
	TKey extends keyof TObj,
	TResult,
>(
	obj: TObj,
	key: TKey,
	transformer: (value: TObj[TKey]) => TResult,
): Omit<TObj, TKey> & Record<TKey, TResult> {
	return {
		...obj,
		[key]: transformer(obj[key]),
	} as Omit<TObj, TKey> & Record<TKey, TResult>;
}

/**
 * Transform multiple fields in an object
 *
 * @example
 * const result = transformFields(
 *   { chainId: "1", tokenId: "123" },
 *   {
 *     chainId: normalizeChainId,
 *     tokenId: normalizeTokenId
 *   }
 * );
 */
export function transformFields<
	TObj extends Record<string, unknown>,
	TTransforms extends {
		[K in keyof TObj]?: (value: TObj[K]) => unknown;
	},
>(
	obj: TObj,
	transforms: TTransforms,
): {
	[K in keyof TObj]: K extends keyof TTransforms
		? TTransforms[K] extends (value: TObj[K]) => infer R
			? R
			: TObj[K]
		: TObj[K];
} {
	const result = { ...obj };

	for (const key in transforms) {
		if (key in obj && transforms[key]) {
			// biome-ignore lint/suspicious/noExplicitAny: Generic transformer requires flexible typing
			(result as any)[key] = transforms[key]!(obj[key]);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: Return type is correctly inferred through generics
	return result as any;
}

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
 * Deep transform an object by applying transformers to nested fields
 *
 * @example
 * const result = deepTransform(
 *   { user: { chainId: "1" }, tokens: [{ id: "123" }] },
 *   {
 *     'user.chainId': normalizeChainId,
 *     'tokens[].id': normalizeTokenId
 *   }
 * );
 */
export function deepTransform<T extends Record<string, unknown>>(
	obj: T,
	pathTransformers: Record<string, (value: unknown) => unknown>,
): T {
	const result = { ...obj };

	for (const path in pathTransformers) {
		const transformer = pathTransformers[path];
		if (!transformer) continue;

		// Simple dot-notation path support (e.g., "user.chainId")
		const parts = path.split('.');
		let current = result;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (!part) continue;
			if (!(part in current)) break;
			// biome-ignore lint/suspicious/noExplicitAny: Deep path traversal requires flexible typing
			current = (current as any)[part];
		}

		const lastPart = parts[parts.length - 1];
		if (lastPart && lastPart in current) {
			// biome-ignore lint/suspicious/noExplicitAny: Deep transformation requires flexible typing
			(current as any)[lastPart] = transformer((current as any)[lastPart]);
		}
	}

	return result;
}

/**
 * Create a composite transformer that applies multiple transformations in sequence
 *
 * @example
 * const normalizeToken = compose(
 *   (t) => transformField(t, 'chainId', normalizeChainId),
 *   (t) => transformField(t, 'tokenId', normalizeTokenId)
 * );
 */
export function compose<T>(
	...transformers: Array<(value: T) => T>
): (value: T) => T {
	return (value: T) => transformers.reduce((acc, fn) => fn(acc), value);
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
