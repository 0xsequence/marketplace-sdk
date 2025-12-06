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
 * import { Indexer } from '@0xsequence/api-client';
 * import type * as IndexerGen from '@0xsequence/indexer';
 *
 * const rawBalance: IndexerGen.TokenBalance = await indexer.getTokenBalance(...);
 * const balance: Indexer.TokenBalance = Indexer.toTokenBalance(rawBalance);
 *
 * const request = Indexer.toGetTokenBalancesRequest({
 *   accountAddress: '0x...',
 *   contractAddress: '0x...',
 * });
 * ```
 *
 * @packageDocumentation
 */

export * as IndexerAPI from '@0xsequence/indexer';

export {
	ContractType,
	ResourceStatus,
	TransactionStatus,
	TransactionType,
} from '@0xsequence/indexer';

export { IndexerClient } from './client';

export * from './transforms';

export * from './types';
