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
import { normalizeChainId } from '../../utils/chain';
import { normalizeTokenId } from '../../utils/token';
import type * as Normalized from './types';

/**
 * Transform raw API ContractInfo to normalized ContractInfo
 */
export function toContractInfo(
	raw: IndexerGen.ContractInfo,
): Normalized.ContractInfo {
	return {
		chainId: normalizeChainId(raw.chainId),
		address: raw.address as Address,
		name: raw.name,
		type: raw.type,
		symbol: raw.symbol,
		decimals: raw.decimals,
		logoURI: raw.logoURI,
		deployed: raw.deployed,
		bytecodeHash: raw.bytecodeHash,
		extensions: raw.extensions
			? {
					link: raw.extensions.link,
					description: raw.extensions.description,
					ogImage: raw.extensions.ogImage,
					ogName: raw.extensions.ogName,
					originChainId:
						raw.extensions.originChainId !== undefined
							? normalizeChainId(raw.extensions.originChainId)
							: undefined,
					originAddress: raw.extensions.originAddress as Address | undefined,
					blacklist: raw.extensions.blacklist,
					verified: raw.extensions.verified,
					verifiedBy: raw.extensions.verifiedBy,
					featured: raw.extensions.featured,
					featureIndex: raw.extensions.featureIndex,
					categories: raw.extensions.categories,
				}
			: undefined,
		updatedAt: raw.updatedAt,
	};
}

/**
 * Transform raw API TokenMetadata to normalized TokenMetadata
 */
export function toTokenMetadata(
	raw: IndexerGen.TokenMetadata,
): Normalized.TokenMetadata {
	return {
		tokenId: normalizeTokenId(raw.tokenId),
		name: raw.name,
		description: raw.description,
		image: raw.image,
		decimals: raw.decimals,
		properties: raw.properties,
		attributes: raw.attributes as any, // Raw API attributes are more flexible
		video: raw.video,
		audio: raw.audio,
		image_data: raw.image_data,
		external_url: raw.external_url,
		background_color: raw.background_color,
		animation_url: raw.animation_url,
	};
}

/**
 * Transform raw API TokenBalance to normalized TokenBalance
 */
export function toTokenBalance(
	raw: IndexerGen.TokenBalance,
): Normalized.TokenBalance {
	return {
		contractType: raw.contractType,
		contractAddress: raw.contractAddress as Address,
		accountAddress: raw.accountAddress as Address,
		tokenId: raw.tokenID ? normalizeTokenId(raw.tokenID) : 0n, // Note: uppercase "ID" in API
		balance: BigInt(raw.balance),
		blockHash: raw.blockHash,
		blockNumber: raw.blockNumber,
		chainId: normalizeChainId(raw.chainId),
		contractInfo: raw.contractInfo
			? toContractInfo(raw.contractInfo)
			: undefined,
		tokenMetadata: raw.tokenMetadata
			? toTokenMetadata(raw.tokenMetadata)
			: undefined,
		uniqueCollectibles: raw.uniqueCollectibles
			? BigInt(raw.uniqueCollectibles)
			: undefined,
		isSummary: raw.isSummary,
	};
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
		contractAddress: contractAddress,
		contractInfo: raw.contractInfo
			? toContractInfo(raw.contractInfo)
			: undefined,
		tokenMetadata: raw.tokenMetadata
			? toTokenMetadata(raw.tokenMetadata)
			: undefined,
	};
}

/**
 * Transform raw API TransactionReceipt to normalized TransactionReceipt
 * Note: Raw API doesn't have chainId field
 */
export function toTransactionReceipt(
	raw: IndexerGen.TransactionReceipt,
): Normalized.TransactionReceipt {
	return {
		txnHash: raw.txnHash,
		blockHash: raw.blockHash,
		blockNumber: raw.blockNumber,
		chainId: undefined, // Not in raw API
		txnIndex: raw.txnIndex,
		from: raw.from as Address | undefined,
		to: raw.to as Address | undefined,
		gasUsed: raw.gasUsed,
		effectiveGasPrice: raw.effectiveGasPrice
			? BigInt(raw.effectiveGasPrice)
			: undefined,
		logs: raw.logs?.map((log) => ({
			address: log.contractAddress as Address, // Raw API uses 'contractAddress' not 'address'
			topics: log.topics,
			data: log.data,
			logIndex: log.index, // Raw API uses 'index' not 'logIndex'
		})),
	};
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
		balances: raw.balances.map(toTokenBalance),
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
		contractAddress: contractAddress,
		supplies:
			raw.tokenIDs?.map((tokenSupply) =>
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
		contractAddress: contractAddress,
		ranges: raw.tokenIDRanges?.map(toTokenIDRange) || [],
	};
}

// ============================================================================
// REQUEST TRANSFORMATIONS (Normalized → API)
// ============================================================================

/**
 * Transform normalized GetTokenBalancesRequest to API request
 */
export function toGetTokenBalancesArgs(
	req: Normalized.GetTokenBalancesRequest,
): IndexerGen.GetTokenBalancesArgs {
	return {
		accountAddress: req.accountAddress,
		contractAddress: req.contractAddress,
		includeMetadata: req.includeMetadata,
		metadataOptions: req.metadataOptions,
		page: req.page,
	};
}

/**
 * Transform normalized GetTokenSuppliesRequest to API request
 */
export function toGetTokenSuppliesArgs(
	req: Normalized.GetTokenSuppliesRequest,
): IndexerGen.GetTokenSuppliesArgs {
	return {
		contractAddress: req.contractAddress,
		includeMetadata: req.includeMetadata,
		metadataOptions: req.metadataOptions,
		page: req.page,
	};
}

/**
 * Transform normalized GetTokenIDRangesRequest to API request
 */
export function toGetTokenIDRangesArgs(
	req: Normalized.GetTokenIDRangesRequest,
): IndexerGen.GetTokenIDRangesArgs {
	return {
		contractAddress: req.contractAddress,
	};
}

// ============================================================================
// CONVENIENCE TRANSFORMERS
// ============================================================================

/**
 * Transform array of raw TokenBalances to normalized TokenBalances
 */
export function toTokenBalances(
	raw: IndexerGen.TokenBalance[],
): Normalized.TokenBalance[] {
	return raw.map(toTokenBalance);
}

/**
 * Transform array of raw TokenSupplies to normalized TokenSupplies
 */
export function toTokenSupplies(
	raw: IndexerGen.TokenSupply[],
	contractAddress?: Address,
): Normalized.TokenSupply[] {
	return raw.map((supply) => toTokenSupply(supply, contractAddress));
}

/**
 * Transform array of raw TokenIDRanges to normalized TokenIDRanges
 */
export function toTokenIDRanges(
	raw: IndexerGen.TokenIDRange[],
): Normalized.TokenIDRange[] {
	return raw.map(toTokenIDRange);
}
