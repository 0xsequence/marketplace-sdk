/**
 * Indexer API Transformations
 *
 * Converts between raw @0xsequence/indexer types and normalized types.
 * Handles tokenID (string → bigint), and ensures type safety.
 *
 * IMPORTANT: Indexer uses UPPERCASE "ID" in field names (tokenID, not tokenId)
 */

import type * as IndexerGen from '@0xsequence/indexer';
import type { Address } from '../../types/primitives';
import { normalizeAddress } from '../../utils/address';
import { normalizeChainId } from '../../utils/chain';
import { normalizeTokenId } from '../../utils/token';
import {
	spreadWith,
	transformArray,
	transformOptional,
	transformOptionalArray,
} from '../../utils/transform';
import type * as Normalized from './types';

/**
 * Transform raw API ContractInfo to normalized ContractInfo
 */
export function toContractInfo(
	raw: IndexerGen.ContractInfo,
): Normalized.ContractInfo {
	return spreadWith(raw, {
		chainId: normalizeChainId(raw.chainId),
		address: normalizeAddress(raw.address),
		extensions: transformOptional(raw.extensions, (ext) => ({
			...ext,
			originChainId: transformOptional(ext.originChainId, normalizeChainId),
			originAddress: ext.originAddress
				? normalizeAddress(ext.originAddress)
				: undefined,
		})),
	});
}

/**
 * Transform raw API TokenMetadata to normalized TokenMetadata
 */
export function toTokenMetadata(
	raw: IndexerGen.TokenMetadata,
): Normalized.TokenMetadata {
	return spreadWith(raw, {
		tokenId: normalizeTokenId(raw.tokenId),
		// biome-ignore lint/suspicious/noExplicitAny: Raw API attributes are more flexible than normalized type
		attributes: raw.attributes as any,
	});
}

/**
 * Transform raw API NativeTokenBalance to normalized NativeTokenBalance
 */
export function toNativeTokenBalance(
	raw: IndexerGen.NativeTokenBalance,
): Normalized.NativeTokenBalance {
	return {
		accountAddress: normalizeAddress(raw.accountAddress),
		chainId: normalizeChainId(raw.chainId),
		balance: BigInt(raw.balance),
		errorReason: raw.errorReason,
	};
}

/**
 * Transform raw API TokenBalance to normalized TokenBalance
 */
export function toTokenBalance(
	raw: IndexerGen.TokenBalance,
): Normalized.TokenBalance {
	// biome-ignore lint/correctness/noUnusedVariables: Destructuring to exclude raw tokenID field
	const { tokenID, ...rest } = raw;
	return spreadWith(rest, {
		contractAddress: normalizeAddress(raw.contractAddress),
		accountAddress: normalizeAddress(raw.accountAddress),
		tokenId: raw.tokenID ? normalizeTokenId(raw.tokenID) : 0n, // Note: uppercase "ID" in API
		balance: BigInt(raw.balance),
		chainId: normalizeChainId(raw.chainId),
		contractInfo: transformOptional(raw.contractInfo, toContractInfo),
		tokenMetadata: transformOptional(raw.tokenMetadata, toTokenMetadata),
		uniqueCollectibles: transformOptional(raw.uniqueCollectibles, BigInt),
	});
}

/**
 * Transform raw API TokenSupply to normalized TokenSupply
 * @param contractAddress - The contract address to include in normalized type (not in raw API)
 */
export function toTokenSupply(
	raw: IndexerGen.TokenSupply,
	contractAddress?: Address,
): Normalized.TokenSupply {
	return {
		tokenId: normalizeTokenId(raw.tokenID), // Note: uppercase "ID" in API
		supply: BigInt(raw.supply),
		chainId: normalizeChainId(raw.chainId),
		contractAddress,
		contractInfo: transformOptional(raw.contractInfo, toContractInfo),
		tokenMetadata: transformOptional(raw.tokenMetadata, toTokenMetadata),
	};
}

/**
 * Transform raw API TransactionReceipt to normalized TransactionReceipt
 * Note: Raw API doesn't have chainId field
 */
export function toTransactionReceipt(
	raw: IndexerGen.TransactionReceipt,
): Normalized.TransactionReceipt {
	return spreadWith(raw, {
		chainId: undefined, // Not in raw API
		from: raw.from ? normalizeAddress(raw.from) : undefined,
		to: raw.to ? normalizeAddress(raw.to) : undefined,
		effectiveGasPrice: transformOptional(raw.effectiveGasPrice, BigInt),
		logs: transformOptionalArray(raw.logs, (log) => ({
			address: normalizeAddress(log.contractAddress), // Raw API uses 'contractAddress' not 'address'
			topics: log.topics,
			data: log.data,
			logIndex: log.index, // Raw API uses 'index' not 'logIndex'
		})),
	});
}

/**
 * Transform raw API TokenIDRange to normalized TokenIDRange
 */
export function toTokenIDRange(
	raw: IndexerGen.TokenIDRange,
): Normalized.TokenIDRange {
	return {
		startTokenId: normalizeTokenId(raw.start), // Raw API uses "start" not "startTokenID"
		endTokenId: normalizeTokenId(raw.end), // Raw API uses "end" not "endTokenID"
	};
}

/**
 * Transform raw API Page to normalized Page
 */
export function toPage(
	raw: IndexerGen.Page | undefined,
): Normalized.Page | undefined {
	if (!raw) return undefined;

	return {
		page: raw.page || 0,
		pageSize: raw.pageSize || 0,
		more: raw.more || false,
	};
}

/**
 * Transform raw API GetTokenBalancesReturn to normalized GetTokenBalancesResponse
 */
export function toGetTokenBalancesResponse(
	raw: IndexerGen.GetTokenBalancesReturn,
): Normalized.GetTokenBalancesResponse {
	return {
		balances: transformArray(raw.balances, toTokenBalance),
		page: toPage(raw.page),
	};
}

/**
 * Transform raw API GetTokenSuppliesReturn to normalized GetTokenSuppliesResponse
 * Note: Raw API has tokenIDs array containing TokenSupply objects, not separate arrays
 */
export function toGetTokenSuppliesResponse(
	raw: IndexerGen.GetTokenSuppliesReturn,
	contractAddress: Address,
): Normalized.GetTokenSuppliesResponse {
	return {
		contractType: raw.contractType,
		contractAddress,
		supplies:
			transformOptionalArray(raw.tokenIDs, (tokenSupply) =>
				toTokenSupply(tokenSupply, contractAddress),
			) || [],
		page: toPage(raw.page),
	};
}

/**
 * Transform raw API GetTokenIDRangesReturn to normalized GetTokenIDRangesResponse
 */
export function toGetTokenIDRangesResponse(
	raw: IndexerGen.GetTokenIDRangesReturn,
	contractAddress: Address,
): Normalized.GetTokenIDRangesResponse {
	return {
		contractAddress,
		ranges: transformOptionalArray(raw.tokenIDRanges, toTokenIDRange) || [],
	};
}

// ============================================================================
// REQUEST TRANSFORMATIONS (Normalized → API)
// Note: These are pass-through transformations - types are identical
// ============================================================================

/**
 * Transform normalized GetTokenBalancesRequest to API request
 * Converts tokenId (bigint) → tokenID (string)
 */
export function toGetTokenBalancesArgs(
	req: Normalized.GetTokenBalancesRequest,
): IndexerGen.GetTokenBalancesArgs {
	const { tokenId, ...rest } = req;

	// Handle collectionAddress → contractAddress transformation
	const contractAddress =
		'collectionAddress' in req && req.collectionAddress
			? req.collectionAddress
			: 'contractAddress' in req && req.contractAddress
				? req.contractAddress
				: undefined;

	return {
		...rest,
		...(contractAddress && { contractAddress }),
		// Convert tokenId (bigint) → tokenID (string) for API
		...(tokenId !== undefined && { tokenID: tokenId.toString() }),
	};
}

/**
 * Transform normalized GetTokenSuppliesRequest to API request
 * Maps collectionAddress → contractAddress for API compatibility
 */
export function toGetTokenSuppliesArgs(
	req: Normalized.GetTokenSuppliesRequest,
): IndexerGen.GetTokenSuppliesArgs {
	const contractAddress = req.contractAddress || req.collectionAddress;
	return {
		...req,
		contractAddress,
	};
}

/**
 * Transform normalized GetTokenIDRangesRequest to API request
 * Maps collectionAddress → contractAddress for API compatibility
 */
export function toGetTokenIDRangesArgs(
	req: Normalized.GetTokenIDRangesRequest,
): IndexerGen.GetTokenIDRangesArgs {
	const contractAddress = req.contractAddress || req.collectionAddress;
	return {
		contractAddress,
	};
}
