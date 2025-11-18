/**
 * Transformation functions between raw metadata API types and normalized types
 *
 * These functions handle the conversion between:
 * - chainID: string → chainId: number (metadata API uses string)
 * - tokenId: string ↔ tokenId: bigint
 * - tokenIDs: string[] ↔ tokenIds: bigint[]
 *
 * REFACTORED: Now uses generic transform utilities for cleaner, more maintainable code
 */

import type * as MetadataGen from '@0xsequence/metadata';
import {
	normalizeAddress,
	normalizeChainId,
	normalizeTokenId,
	toApiTokenId,
	toMetadataChainId,
} from '../../utils/normalize';
import {
	spreadWith,
	transformArray,
	transformOptional,
	transformOptionalArray,
	transformRecord,
} from '../../utils/transform';
import type * as NormalizedTypes from './types';

// ============================================================================
// Response Transformers (API → Normalized)
// ============================================================================

/**
 * Transform ContractInfoExtensionBridgeInfo from API to normalized format
 */
function toBridgeInfo(
	raw: MetadataGen.ContractInfoExtensionBridgeInfo,
): NormalizedTypes.ContractInfoExtensionBridgeInfo {
	return {
		tokenAddress: normalizeAddress(raw.tokenAddress),
	};
}

/**
 * Transform ContractInfo from API to normalized format
 */
export function toContractInfo(
	raw: MetadataGen.ContractInfo,
): NormalizedTypes.ContractInfo {
	return spreadWith(raw, {
		address: normalizeAddress(raw.address),
		chainId: normalizeChainId(raw.chainId),
		extensions: spreadWith(raw.extensions, {
			originChainId: transformOptional(
				raw.extensions.originChainId,
				normalizeChainId,
			),
			originAddress: transformOptional(
				raw.extensions.originAddress,
				normalizeAddress,
			),
			bridgeInfo: raw.extensions.bridgeInfo
				? transformRecord(raw.extensions.bridgeInfo, toBridgeInfo)
				: undefined,
		}),
	});
}

/**
 * Transform Asset from API to normalized format
 */
export function toAsset(raw: MetadataGen.Asset): NormalizedTypes.Asset {
	return spreadWith(raw, {
		tokenId: transformOptional(raw.tokenId, normalizeTokenId),
	});
}

/**
 * Transform TokenMetadata from API to normalized format
 */
export function toTokenMetadata(
	raw: MetadataGen.TokenMetadata,
): NormalizedTypes.TokenMetadata {
	return spreadWith(raw, {
		chainId: transformOptional(raw.chainId, normalizeChainId),
		contractAddress: transformOptional(raw.contractAddress, normalizeAddress),
		tokenId: normalizeTokenId(raw.tokenId),
		assets: transformOptionalArray(raw.assets, toAsset),
	});
}

/**
 * Transform GetContractInfoReturn from API to normalized format
 */
export function toGetContractInfoReturn(
	raw: MetadataGen.GetContractInfoReturn,
): NormalizedTypes.GetContractInfoReturn {
	return spreadWith(raw, {
		contractInfo: toContractInfo(raw.contractInfo),
	});
}

/**
 * Transform GetContractInfoBatchReturn from API to normalized format
 */
export function toGetContractInfoBatchReturn(
	raw: MetadataGen.GetContractInfoBatchReturn,
): NormalizedTypes.GetContractInfoBatchReturn {
	return spreadWith(raw, {
		contractInfoMap: transformRecord(raw.contractInfoMap, toContractInfo),
	});
}

/**
 * Transform GetTokenMetadataReturn from API to normalized format
 */
export function toGetTokenMetadataReturn(
	raw: MetadataGen.GetTokenMetadataReturn,
): NormalizedTypes.GetTokenMetadataReturn {
	return spreadWith(raw, {
		tokenMetadata: transformArray(raw.tokenMetadata, toTokenMetadata),
	});
}

/**
 * Transform GetTokenMetadataBatchReturn from API to normalized format
 */
export function toGetTokenMetadataBatchReturn(
	raw: MetadataGen.GetTokenMetadataBatchReturn,
): NormalizedTypes.GetTokenMetadataBatchReturn {
	return spreadWith(raw, {
		contractTokenMetadata: transformRecord(
			raw.contractTokenMetadata,
			(metadata) => transformArray(metadata, toTokenMetadata),
		),
	});
}

/**
 * Transform SearchTokenMetadataReturn from API to normalized format
 */
export function toSearchTokenMetadataReturn(
	raw: MetadataGen.SearchTokenMetadataReturn,
): NormalizedTypes.SearchTokenMetadataReturn {
	return spreadWith(raw, {
		tokenMetadata: transformArray(raw.tokenMetadata, toTokenMetadata),
	});
}

// ============================================================================
// Request Transformers (Normalized → API)
// ============================================================================

/**
 * Transform GetContractInfoArgs from normalized to API format
 *
 * KEY: chainId (bigint) → chainID (string)
 */
export function toGetContractInfoArgs(
	normalized: NormalizedTypes.GetContractInfoArgs,
): MetadataGen.GetContractInfoArgs {
	const contractAddress =
		'collectionAddress' in normalized && normalized.collectionAddress
			? normalized.collectionAddress
			: 'contractAddress' in normalized && normalized.contractAddress
				? normalized.contractAddress
				: '';

	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
	};
}

/**
 * Transform GetContractInfoBatchArgs from normalized to API format
 */
export function toGetContractInfoBatchArgs(
	normalized: NormalizedTypes.GetContractInfoBatchArgs,
): MetadataGen.GetContractInfoBatchArgs {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddresses: normalized.contractAddresses,
	};
}

/**
 * Transform GetTokenMetadataArgs from normalized to API format
 *
 * KEY: chainId (bigint) → chainID (string), tokenIds (bigint[]) → tokenIDs (string[])
 */
export function toGetTokenMetadataArgs(
	normalized: NormalizedTypes.GetTokenMetadataArgs,
): MetadataGen.GetTokenMetadataArgs {
	const contractAddress =
		'collectionAddress' in normalized && normalized.collectionAddress
			? normalized.collectionAddress
			: 'contractAddress' in normalized && normalized.contractAddress
				? normalized.contractAddress
				: '';

	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		tokenIDs: transformArray(normalized.tokenIds, toApiTokenId),
	};
}

/**
 * Transform GetTokenMetadataBatchArgs from normalized to API format
 */
export function toGetTokenMetadataBatchArgs(
	normalized: NormalizedTypes.GetTokenMetadataBatchArgs,
): MetadataGen.GetTokenMetadataBatchArgs {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractTokenMap: transformRecord(normalized.contractTokenMap, (tokenIds) =>
			transformArray(tokenIds, toApiTokenId),
		),
	};
}

/**
 * Transform RefreshTokenMetadataArgs from normalized to API format
 */
export function toRefreshTokenMetadataArgs(
	normalized: NormalizedTypes.RefreshTokenMetadataArgs,
): MetadataGen.RefreshTokenMetadataArgs {
	const contractAddress =
		'collectionAddress' in normalized && normalized.collectionAddress
			? normalized.collectionAddress
			: 'contractAddress' in normalized && normalized.contractAddress
				? normalized.contractAddress
				: '';

	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		tokenIDs: transformOptionalArray(normalized.tokenIds, toApiTokenId),
		refreshAll: normalized.refreshAll,
	};
}

/**
 * Transform SearchTokenMetadataArgs from normalized to API format
 */
export function toSearchTokenMetadataArgs(
	normalized: NormalizedTypes.SearchTokenMetadataArgs,
): MetadataGen.SearchTokenMetadataArgs {
	const contractAddress =
		'collectionAddress' in normalized && normalized.collectionAddress
			? normalized.collectionAddress
			: 'contractAddress' in normalized && normalized.contractAddress
				? normalized.contractAddress
				: '';

	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		filter: normalized.filter,
		page: normalized.page,
	};
}

/**
 * Transform GetTokenMetadataPropertyFiltersArgs from normalized to API format
 */
export function toGetTokenMetadataPropertyFiltersArgs(
	normalized: NormalizedTypes.GetTokenMetadataPropertyFiltersArgs,
): MetadataGen.GetTokenMetadataPropertyFiltersArgs {
	const contractAddress =
		'collectionAddress' in normalized &&
		normalized.collectionAddress !== undefined
			? normalized.collectionAddress
			: (normalized as { contractAddress: string }).contractAddress;

	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		excludeProperties: normalized.excludeProperties,
		excludePropertyValues: normalized.excludePropertyValues,
	};
}

/**
 * Transform GetTokenMetadataPropertyFiltersReturn (pass-through, no transformation needed)
 */
export function toGetTokenMetadataPropertyFiltersReturn(
	raw: MetadataGen.GetTokenMetadataPropertyFiltersReturn,
): NormalizedTypes.GetTokenMetadataPropertyFiltersReturn {
	return raw;
}
