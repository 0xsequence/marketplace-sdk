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
 * const rawResult: BuilderGen.LookupMarketplaceReturn = await builder.lookupMarketplace(...);
 * const result: Builder.LookupMarketplaceReturn = Builder.toLookupMarketplaceReturn(rawResult);
 *
 * const request = Builder.fromLookupMarketplaceArgs({
 *   projectId: 123n,
 *   domain: 'example.com',
 * });
 * ```
 *
 * @packageDocumentation
 */

export * as BuilderAPI from './builder.gen';

export {
	FilterCondition,
	MarketplaceWalletType,
} from './builder.gen';

export * from './transforms';

export * from './types';
