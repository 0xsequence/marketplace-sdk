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
 * import { Metadata } from '@0xsequence/api-client';
 * import type * as MetadataGen from '@0xsequence/metadata';
 *
 * const rawInfo: MetadataGen.ContractInfo = await metadata.getContractInfo(...);
 * const info: Metadata.ContractInfo = Metadata.toContractInfo(rawInfo);
 *
 * const request = Metadata.toGetContractInfoArgs({
 *   chainId: 137n,
 *   contractAddress: '0x...',
 * });
 * ```
 *
 * @packageDocumentation
 */

export * as MetadataAPI from '@0xsequence/metadata';

export { MetadataClient } from './client';

export * from './transforms';

export * from './types';
