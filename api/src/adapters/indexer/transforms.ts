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
	return spreadWith(raw, {
		effectiveGasPrice: BigInt(raw.effectiveGasPrice),
		from:
			raw.from?.startsWith('0x') && raw.from.length === 42
				? normalizeAddress(raw.from)
				: undefined,
		to:
			raw.to?.startsWith('0x') && raw.to.length === 42
				? normalizeAddress(raw.to)
				: undefined,
		logs: transformArray(raw.logs, (log) => {
			const { contractAddress, index, ...rest } = log;
			return spreadWith(rest, {
				address: normalizeAddress(contractAddress),
				logIndex: index,
			});
		}),
	});
}

export function toTokenIDRange(
	raw: IndexerGen.TokenIDRange,
): Normalized.TokenIDRange {
	return {
		startTokenId: normalizeTokenId(raw.start),
		endTokenId: normalizeTokenId(raw.end),
	};
}

export function toPage(raw: IndexerGen.Page | undefined): Normalized.Page {
	if (!raw) {
		return {
			page: 0,
			pageSize: 0,
			more: false,
		};
	}

	return spreadWith(raw, {
		page: raw.page || 0,
		pageSize: raw.pageSize || 0,
		more: raw.more || false,
	});
}

export function toGetTokenBalancesResponse(
	raw: IndexerGen.GetTokenBalancesReturn,
): Normalized.GetTokenBalancesResponse {
	return spreadWith(raw, {
		balances: transformArray(raw.balances, toTokenBalance),
		page: toPage(raw.page),
	});
}

export function toGetTokenSuppliesResponse(
	raw: IndexerGen.GetTokenSuppliesReturn,
	contractAddress: Address,
): Normalized.GetTokenSuppliesResponse {
	const tokenIDs =
		transformOptionalArray(raw.tokenIDs, (tokenSupply) =>
			toTokenSupply(tokenSupply, contractAddress),
		) || [];

	return spreadWith(raw, {
		contractAddress,
		tokenIDs,
		supplies: tokenIDs,
		page: toPage(raw.page),
	});
}

export function toGetTokenIDRangesResponse(
	raw: IndexerGen.GetTokenIDRangesReturn,
	contractAddress: Address,
): Normalized.GetTokenIDRangesResponse {
	const tokenIDRanges =
		transformOptionalArray(raw.tokenIDRanges, toTokenIDRange) || [];

	return spreadWith(raw, {
		contractAddress,
		tokenIDRanges,
		ranges: tokenIDRanges,
	});
}

export function toGetTokenBalancesDetailsResponse(
	raw: IndexerGen.GetTokenBalancesDetailsReturn,
): Normalized.GetTokenBalancesDetailsResponse {
	return spreadWith(raw, {
		page: toPage(raw.page),
		nativeBalances: (raw.nativeBalances || []).map(toNativeTokenBalance),
		balances: raw.balances.map(toTokenBalance),
	});
}

export function toGetTokenBalancesByContractResponse(
	raw: IndexerGen.GetTokenBalancesByContractReturn,
): Normalized.GetTokenBalancesByContractResponse {
	return spreadWith(raw, {
		page: toPage(raw.page),
		balances: raw.balances.map(toTokenBalance),
	});
}

export function toGetNativeTokenBalanceResponse(
	raw: IndexerGen.GetNativeTokenBalanceReturn,
): Normalized.GetNativeTokenBalanceResponse {
	return spreadWith(raw, {
		balance: toNativeTokenBalance(raw.balance),
	});
}

export function toGetTokenBalancesArgs(
	req: Normalized.GetTokenBalancesRequest,
): IndexerGen.GetTokenBalancesArgs {
	const { tokenId, ...rest } = req;

	const accountAddress =
		'userAddress' in req && req.userAddress
			? req.userAddress
			: 'accountAddress' in req
				? req.accountAddress
				: undefined;

	const contractAddress =
		'collectionAddress' in req && req.collectionAddress
			? req.collectionAddress
			: 'contractAddress' in req && req.contractAddress
				? req.contractAddress
				: undefined;

	return {
		...rest,
		...(accountAddress && { accountAddress }),
		...(contractAddress && { contractAddress }),
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

export function toGetUserCollectionBalancesArgs(
	req: Normalized.GetUserCollectionBalancesRequest,
): IndexerGen.GetTokenBalancesByContractArgs {
	return {
		filter: {
			accountAddresses: [req.userAddress],
			contractAddresses: [req.collectionAddress],
		},
		omitMetadata: req.includeMetadata === false ? true : undefined,
	};
}
