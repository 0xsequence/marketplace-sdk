/**
 * Indexer Adapter
 *
 * This adapter provides transformation functions between @0xsequence/indexer types
 * and our normalized internal types.
 *
 * ## Key Normalizations
 *
 * - `chainId: number` (API) → `ChainId: bigint` (normalized)
 * - `tokenID: string` (API, uppercase!) → `TokenId: bigint` (normalized)
 * - `balance: string` (API) → `Amount: bigint` (normalized)
 * - Various numeric strings → bigint
 *
 * ## Usage
 *
 * ```typescript
 * import { Indexer } from '@0xsequence/marketplace-api';
 * import type * as IndexerGen from '@0xsequence/indexer';
 *
 * // Transform API response
 * const rawBalance: IndexerGen.TokenBalance = await indexer.getTokenBalance(...);
 * const balance: Indexer.TokenBalance = Indexer.toTokenBalance(rawBalance);
 * // balance.chainId is now bigint (was number)
 * // balance.tokenId is now bigint (was tokenID string)
 *
 * // Transform request
 * const request = Indexer.toGetTokenBalancesRequest({
 *   accountAddress: '0x...',
 *   contractAddress: '0x...',
 * });
 * ```
 *
 * @packageDocumentation
 */

// Re-export raw API types under 'IndexerAPI' namespace (for convenience)
export * as IndexerAPI from '@0xsequence/indexer';
// Re-export enums from @0xsequence/indexer for SDK usage (enums are safe to re-export)
export {
	ContractType,
	ResourceStatus,
	TransactionStatus,
	TransactionType,
} from '@0xsequence/indexer';

// Export wrapped client that returns normalized types
export { IndexerClient } from './client';
// Export transformation functions
export * from './transforms';
// Export normalized types - these are the ONLY types consumers should use
export * from './types';
