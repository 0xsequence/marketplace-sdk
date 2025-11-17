/**
 * Builder Adapter
 *
 * Provides normalized types and transformation functions for the Builder API.
 * Used for lookupMarketplace and related marketplace configuration endpoints.
 *
 * ## Key Normalizations
 *
 * - `projectId: number` (API) → `ProjectId: number` (passthrough)
 * - `chainId: number` (API) → `ChainId: bigint` (normalized)
 * - `tokenIds: string[]` (API) → `TokenId[]: bigint[]` (normalized)
 * - `customTokenIds: string[]` (API) → `TokenId[]: bigint[]` (normalized)
 *
 * ## Usage
 *
 * ```typescript
 * import { Builder } from '@0xsequence/marketplace-api';
 * import type * as BuilderGen from '@0xsequence/builder';
 *
 * // Transform API response
 * const rawResult: BuilderGen.LookupMarketplaceReturn = await builder.lookupMarketplace(...);
 * const result: Builder.LookupMarketplaceReturn = Builder.toLookupMarketplaceReturn(rawResult);
 * // result.marketplace.projectId is now bigint (was number)
 * // result.shopCollections[0].tokenIds is now bigint[] (was string[])
 *
 * // Transform request
 * const request = Builder.fromLookupMarketplaceArgs({
 *   projectId: 123n,
 *   domain: 'example.com',
 * });
 * ```
 *
 * @packageDocumentation
 */

// Re-export raw API types under 'BuilderAPI' namespace (for convenience)
export * as BuilderAPI from './builder.gen';
// Export enums (safe to re-export from gen)
export {
	FilterCondition,
	MarketplaceWalletType,
} from './builder.gen';
// Export transformation functions
export * from './transforms';
// Export normalized types - these are the ONLY types consumers should use
// LookupMarketplaceReturn, MarketplaceSettings, MarketplaceWallet, OpenIdProvider are all normalized
export * from './types';
