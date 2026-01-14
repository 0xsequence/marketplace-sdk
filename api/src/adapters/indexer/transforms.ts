// Indexer API Transformations
// Note: Indexer uses UPPERCASE "ID" in field names (tokenID, not tokenId)

import type * as IndexerGen from '@0xsequence/indexer';
import type { Address } from '../../types/primitives';
import {
	normalizeAddress,
	normalizeChainId,
	normalizeTokenId,
} from '../../utils/normalize';
import {
	spreadWith,
	transformArray,
	transformOptional,
	transformOptionalArray,
} from '../../utils/transform';
import type * as Normalized from './types';

export function toContractInfo(
	raw: IndexerGen.ContractInfo,
): Normalized.ContractInfo | undefined {
	// Handle missing or invalid address - return undefined instead of throwing
	// The Indexer API sometimes returns contractInfo with empty address field
	if (
		!raw.address ||
		!raw.address.startsWith('0x') ||
		raw.address.length !== 42
	) {
		return undefined;
	}

	return spreadWith(raw, {
		chainId: normalizeChainId(raw.chainId),
		address: normalizeAddress(raw.address),
		extensions: transformOptional(raw.extensions, (ext) => {
			const result: any = { ...ext };
			if (ext.originChainId !== undefined) {
				result.originChainId = normalizeChainId(ext.originChainId);
			}
			if (
				ext.originAddress?.startsWith('0x') &&
				ext.originAddress.length === 42
			) {
				result.originAddress = normalizeAddress(ext.originAddress);
			}
			return result;
		}),
	});
}

export function toTokenMetadata(
	raw: IndexerGen.TokenMetadata,
): Normalized.TokenMetadata {
	return spreadWith(raw, {
		tokenId: normalizeTokenId(raw.tokenId),
		// biome-ignore lint/suspicious/noExplicitAny: Raw API attributes are more flexible than normalized type
		attributes: raw.attributes as any,
	});
}

export function toNativeTokenBalance(
	raw: IndexerGen.NativeTokenBalance,
): Normalized.NativeTokenBalance {
	const result: Normalized.NativeTokenBalance = {
		accountAddress: normalizeAddress(raw.accountAddress),
		chainId: normalizeChainId(raw.chainId),
		balance: BigInt(raw.balance),
	};

	// Only include errorReason if provided
	if (raw.errorReason) {
		result.errorReason = raw.errorReason;
	}

	return result;
}

export function toTokenBalance(
	raw: IndexerGen.TokenBalance,
): Normalized.TokenBalance {
	// biome-ignore lint/correctness/noUnusedVariables: Destructuring to exclude raw tokenID field
	const { tokenID, contractType, ...rest } = raw;
	return spreadWith(rest, {
		contractType,
		contractAddress: normalizeAddress(raw.contractAddress),
		accountAddress: normalizeAddress(raw.accountAddress),
		tokenId: raw.tokenID ? normalizeTokenId(raw.tokenID) : 0n,
		balance: BigInt(raw.balance),
		chainId: normalizeChainId(raw.chainId),
		contractInfo: transformOptional(raw.contractInfo, toContractInfo),
		tokenMetadata: transformOptional(raw.tokenMetadata, toTokenMetadata),
		uniqueCollectibles: transformOptional(raw.uniqueCollectibles, BigInt),
	});
}

export function toTokenSupply(
	raw: IndexerGen.TokenSupply,
	contractAddress?: Address,
): Normalized.TokenSupply {
	return {
		tokenId: normalizeTokenId(raw.tokenID),
		supply: BigInt(raw.supply),
		chainId: normalizeChainId(raw.chainId),
		contractAddress,
		contractInfo: transformOptional(raw.contractInfo, toContractInfo),
		tokenMetadata: transformOptional(raw.tokenMetadata, toTokenMetadata),
	};
}

export function toTransactionReceipt(
	raw: IndexerGen.TransactionReceipt,
): Normalized.TransactionReceipt {
	// Build result without spreading raw (to avoid type conflicts)
	const result: Normalized.TransactionReceipt = {
		txnHash: raw.txnHash,
		blockHash: raw.blockHash,
		blockNumber: raw.blockNumber,
		txnIndex: raw.txnIndex,
		gasUsed: raw.gasUsed,
		effectiveGasPrice: transformOptional(raw.effectiveGasPrice, BigInt),
		logs: transformOptionalArray(raw.logs, (log) => ({
			address: normalizeAddress(log.contractAddress),
			topics: log.topics,
			data: log.data,
			logIndex: log.index,
		})),
	};

	if (raw.from?.startsWith('0x') && raw.from.length === 42) {
		result.from = normalizeAddress(raw.from);
	}
	if (raw.to?.startsWith('0x') && raw.to.length === 42) {
		result.to = normalizeAddress(raw.to);
	}
	// chainId is not in raw API, so we don't set it (it's optional in our type)

	return result;
}

export function toTokenIDRange(
	raw: IndexerGen.TokenIDRange,
): Normalized.TokenIDRange {
	return {
		startTokenId: normalizeTokenId(raw.start),
		endTokenId: normalizeTokenId(raw.end),
	};
}

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

export function toGetTokenBalancesResponse(
	raw: IndexerGen.GetTokenBalancesReturn,
): Normalized.GetTokenBalancesResponse {
	return {
		balances: transformArray(raw.balances, toTokenBalance),
		page: toPage(raw.page),
	};
}

export function toGetTokenSuppliesResponse(
	raw: IndexerGen.GetTokenSuppliesReturn,
	contractAddress: Address,
): Normalized.GetTokenSuppliesResponse {
	const { contractType, ...rest } = raw;
	return {
		...rest,
		contractType,
		contractAddress,
		supplies:
			transformOptionalArray(raw.tokenIDs, (tokenSupply) =>
				toTokenSupply(tokenSupply, contractAddress),
			) || [],
		page: toPage(raw.page),
	};
}

export function toGetTokenIDRangesResponse(
	raw: IndexerGen.GetTokenIDRangesReturn,
	contractAddress: Address,
): Normalized.GetTokenIDRangesResponse {
	return {
		contractAddress,
		ranges: transformOptionalArray(raw.tokenIDRanges, toTokenIDRange) || [],
	};
}

export function toGetTokenBalancesArgs(
	req: Normalized.GetTokenBalancesRequest,
): IndexerGen.GetTokenBalancesArgs {
	// Destructure fields that need transformation or removal
	// collectionAddress is SDK-only alias for contractAddress, must not be sent to API
	const {
		tokenId,
		collectionAddress: _collectionAddress,
		contractAddress: _contractAddress,
		...rest
	} = req as Normalized.GetTokenBalancesRequest & {
		collectionAddress?: string;
		contractAddress?: string;
	};

	// Handle collectionAddress → contractAddress transformation
	const contractAddress = _collectionAddress || _contractAddress;

	return {
		...rest,
		...(contractAddress && { contractAddress }),
		// Convert tokenId (bigint) → tokenID (string) for API
		...(tokenId !== undefined && { tokenID: tokenId.toString() }),
	};
}

export function toGetTokenSuppliesArgs(
	req: Normalized.GetTokenSuppliesRequest,
): IndexerGen.GetTokenSuppliesArgs {
	const {
		collectionAddress: _collectionAddress,
		contractAddress: _contractAddress,
		...rest
	} = req as Normalized.GetTokenSuppliesRequest & {
		collectionAddress?: string;
		contractAddress?: string;
	};
	const contractAddress = _contractAddress || _collectionAddress;
	return {
		...rest,
		contractAddress,
	};
}

export function toGetTokenIDRangesArgs(
	req: Normalized.GetTokenIDRangesRequest,
): IndexerGen.GetTokenIDRangesArgs {
	const contractAddress = req.contractAddress || req.collectionAddress;
	return {
		contractAddress,
	};
}
