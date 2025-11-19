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
): Normalized.ContractInfo {
	return spreadWith(raw, {
		chainId: normalizeChainId(raw.chainId),
		address: normalizeAddress(raw.address),
		extensions: transformOptional(raw.extensions, (ext) => {
			// Build extensions object without adding undefined for missing fields
			const result: any = { ...ext };
			if (ext.originChainId !== undefined) {
				result.originChainId = normalizeChainId(ext.originChainId);
			}
			if (ext.originAddress !== undefined) {
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
	return {
		accountAddress: normalizeAddress(raw.accountAddress),
		chainId: normalizeChainId(raw.chainId),
		balance: BigInt(raw.balance),
		errorReason: raw.errorReason,
	};
}

export function toTokenBalance(
	raw: IndexerGen.TokenBalance,
): Normalized.TokenBalance {
	// biome-ignore lint/correctness/noUnusedVariables: Destructuring to exclude raw tokenID field
	const { tokenID, ...rest } = raw;
	return spreadWith(rest, {
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

	// Only add optional Address fields if they exist (don't add undefined)
	if (raw.from !== undefined) {
		result.from = normalizeAddress(raw.from);
	}
	if (raw.to !== undefined) {
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

export function toGetTokenSuppliesArgs(
	req: Normalized.GetTokenSuppliesRequest,
): IndexerGen.GetTokenSuppliesArgs {
	const contractAddress = req.contractAddress || req.collectionAddress;
	return {
		...req,
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
