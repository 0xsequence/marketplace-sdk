/**
 * Type-level normalization utilities
 *
 * This module provides TypeScript utility types for automatic type normalization
 * across API adapters. These types help reduce boilerplate by automatically
 * inferring normalized types from raw API types.
 *
 * Key features:
 * - Automatic chainId normalization (string → number)
 * - Automatic tokenId normalization (string → bigint)
 * - Recursive type normalization for nested objects
 * - Preserves all other fields unchanged
 */

import type { ChainId, TokenId } from '../types/primitives';

/**
 * Normalize chainId field from string to number
 *
 * @example
 * type Raw = { chainId: string; name: string };
 * type Normalized = NormalizeChainId<Raw>;
 * // Result: { chainId: number; name: string }
 */
export type NormalizeChainId<T> = T extends { chainId: string | number }
	? Omit<T, 'chainId'> & { chainId: ChainId }
	: T extends { chainID: string | number }
		? Omit<T, 'chainID'> & { chainId: ChainId }
		: T;

/**
 * Normalize tokenId field from string to bigint
 *
 * @example
 * type Raw = { tokenId: string; name: string };
 * type Normalized = NormalizeTokenId<Raw>;
 * // Result: { tokenId: bigint; name: string }
 */
export type NormalizeTokenId<T> = T extends { tokenId: string }
	? Omit<T, 'tokenId'> & { tokenId: TokenId }
	: T extends { tokenID: string }
		? Omit<T, 'tokenID'> & { tokenId: TokenId }
		: T;

/**
 * Normalize tokenIds array field from string[] to bigint[]
 */
export type NormalizeTokenIds<T> = T extends { tokenIds: string[] }
	? Omit<T, 'tokenIds'> & { tokenIds: TokenId[] }
	: T extends { tokenIDs: string[] }
		? Omit<T, 'tokenIDs'> & { tokenIds: TokenId[] }
		: T;

/**
 * Apply all field normalizations (chainId + tokenId + tokenIds)
 *
 * @example
 * type Raw = {
 *   chainId: string;
 *   tokenId: string;
 *   tokenIds: string[];
 *   name: string;
 * };
 * type Normalized = NormalizeFields<Raw>;
 * // Result: {
 * //   chainId: number;
 * //   tokenId: bigint;
 * //   tokenIds: bigint[];
 * //   name: string;
 * // }
 */
export type NormalizeFields<T> = NormalizeChainId<
	NormalizeTokenId<NormalizeTokenIds<T>>
>;

/**
 * Deep normalize an object type (applies to nested objects)
 *
 * Note: This is a shallow implementation. For deeply nested objects,
 * transformers should be applied manually or use deepTransform() utility.
 */
export type DeepNormalize<T> = {
	[K in keyof T]: T[K] extends Record<string, unknown>
		? NormalizeFields<T[K]>
		: T[K] extends Array<infer U>
			? U extends Record<string, unknown>
				? Array<NormalizeFields<U>>
				: T[K]
			: T[K];
};

/**
 * Normalize request parameters (converts chainId number → string for API)
 *
 * This is the inverse operation for outbound requests
 */
export type DenormalizeChainId<T> = T extends { chainId: number }
	? Omit<T, 'chainId'> & { chainID: string }
	: T;

/**
 * Normalize request tokenIds (converts bigint[] → string[] for API)
 */
export type DenormalizeTokenIds<T> = T extends { tokenIds: readonly bigint[] }
	? Omit<T, 'tokenIds'> & { tokenIDs: string[] }
	: T extends { tokenIds: bigint[] }
		? Omit<T, 'tokenIds'> & { tokenIDs: string[] }
		: T;

/**
 * Denormalize request tokenId (converts bigint → string for API)
 */
export type DenormalizeTokenId<T> = T extends { tokenId: bigint }
	? Omit<T, 'tokenId'> & { tokenID: string }
	: T;

/**
 * Apply all denormalizations for request parameters
 */
export type DenormalizeRequest<T> = DenormalizeChainId<
	DenormalizeTokenId<DenormalizeTokenIds<T>>
>;

/**
 * Helper to infer normalized return type from a raw API type
 *
 * @example
 * type RawReturn = { tokenMetadata: Array<{ tokenId: string }> };
 * type NormalizedReturn = InferNormalized<RawReturn>;
 * // Result: { tokenMetadata: Array<{ tokenId: bigint }> }
 */
export type InferNormalized<T> = DeepNormalize<T>;

/**
 * Helper to create normalized type from raw API method signature
 *
 * @example
 * type RawMethod = (args: { chainId: string }) => Promise<{ tokenId: string }>;
 * type NormalizedMethod = NormalizeMethod<RawMethod>;
 * // Result: (args: { chainId: number }) => Promise<{ tokenId: bigint }>
 */
export type NormalizeMethod<TMethod> = TMethod extends (
	args: infer TArgs,
) => Promise<infer TReturn>
	? (args: NormalizeFields<TArgs>) => Promise<InferNormalized<TReturn>>
	: TMethod;

/**
 * Extract the argument type from a method and normalize it
 */
export type NormalizedArgs<TMethod> = TMethod extends (
	args: infer TArgs,
) => unknown
	? NormalizeFields<TArgs>
	: never;

/**
 * Extract the return type from a method and normalize it
 */
export type NormalizedReturn<TMethod> = TMethod extends (
	...args: unknown[]
) => Promise<infer TReturn>
	? InferNormalized<TReturn>
	: never;
