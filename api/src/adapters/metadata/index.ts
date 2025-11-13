/**
 * Metadata Adapter
 *
 * This adapter provides transformation functions between @0xsequence/metadata types
 * and our normalized internal types.
 *
 * ## Key Normalizations
 *
 * - `chainID: string` (API request params, e.g., "137") → `ChainId: bigint` (normalized)
 * - `chainId: number` (API response data) → `ChainId: bigint` (normalized)
 * - `tokenId: string` (API) → `TokenId: bigint` (normalized)
 * - `tokenIDs: string[]` (API request params) → `TokenId[]` (normalized)
 *
 * ## Usage
 *
 * ```typescript
 * import { Metadata } from '@0xsequence/marketplace-api';
 * import type * as MetadataGen from '@0xsequence/metadata';
 *
 * // Transform API response
 * const rawInfo: MetadataGen.ContractInfo = await metadata.getContractInfo(...);
 * const info: Metadata.ContractInfo = Metadata.toContractInfo(rawInfo);
 * // info.chainId is now bigint (was number)
 *
 * // Transform request args
 * const request = Metadata.toGetContractInfoArgs({
 *   chainId: 137n,
 *   contractAddress: '0x...',
 * });
 * // request.chainID is now "137" (string, as API expects)
 * ```
 *
 * @packageDocumentation
 */

// Re-export raw API types under 'MetadataAPI' namespace (for convenience)
export * as MetadataAPI from '@0xsequence/metadata';

// Export wrapped client
export { MetadataClient } from './client';

// Export transformation functions
export * from './transforms';
// Export normalized types - these are the ONLY types consumers should use
export * from './types';

// Re-export enums from @0xsequence/metadata for SDK usage
// Note: ContractType and ResourceStatus are already exported from indexer at the top level
// PropertyType is exported from marketplace at the top level
