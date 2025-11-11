/**
 * Transformation functions between raw metadata API types and normalized types
 *
 * These functions handle the conversion between:
 * - chainID: string → chainId: number (metadata API uses string)
 * - tokenId: string ↔ tokenId: bigint
 * - tokenIDs: string[] ↔ tokenIds: bigint[]
 */

import type * as MetadataGen from '@0xsequence/metadata';
import { normalizeChainId, toMetadataChainId } from '../../utils/chain';
import { normalizeTokenId, toApiTokenId } from '../../utils/token';
import type * as NormalizedTypes from './types';

// ============================================================================
// Response Transformers (API → Normalized)
// ============================================================================

/**
 * Transform ContractInfoExtensions from API to normalized format
 */
export function toContractInfoExtensions(
	raw: MetadataGen.ContractInfoExtensions,
): NormalizedTypes.ContractInfoExtensions {
	return {
		...raw,
		originChainId:
			raw.originChainId !== undefined
				? normalizeChainId(raw.originChainId)
				: undefined,
	};
}

/**
 * Transform ContractInfo from API to normalized format
 */
export function toContractInfo(
	raw: MetadataGen.ContractInfo,
): NormalizedTypes.ContractInfo {
	return {
		...raw,
		chainId: normalizeChainId(raw.chainId),
		extensions: toContractInfoExtensions(raw.extensions),
	};
}

/**
 * Transform Asset from API to normalized format
 */
export function toAsset(raw: MetadataGen.Asset): NormalizedTypes.Asset {
	return {
		...raw,
		tokenId:
			raw.tokenId !== undefined ? normalizeTokenId(raw.tokenId) : undefined,
	};
}

/**
 * Transform TokenMetadata from API to normalized format
 */
export function toTokenMetadata(
	raw: MetadataGen.TokenMetadata,
): NormalizedTypes.TokenMetadata {
	return {
		...raw,
		chainId:
			raw.chainId !== undefined ? normalizeChainId(raw.chainId) : undefined,
		tokenId: normalizeTokenId(raw.tokenId),
		assets: raw.assets?.map(toAsset),
	};
}

/**
 * Transform Page (pass-through, no bigint fields)
 */
export function toPage(raw: MetadataGen.Page): NormalizedTypes.Page {
	return raw;
}

/**
 * Transform GetContractInfoReturn from API to normalized format
 */
export function toGetContractInfoReturn(
	raw: MetadataGen.GetContractInfoReturn,
): NormalizedTypes.GetContractInfoReturn {
	return {
		...raw,
		contractInfo: toContractInfo(raw.contractInfo),
	};
}

/**
 * Transform GetContractInfoBatchReturn from API to normalized format
 */
export function toGetContractInfoBatchReturn(
	raw: MetadataGen.GetContractInfoBatchReturn,
): NormalizedTypes.GetContractInfoBatchReturn {
	return {
		...raw,
		contractInfoMap: Object.fromEntries(
			Object.entries(raw.contractInfoMap).map(([address, info]) => [
				address,
				toContractInfo(info),
			]),
		),
	};
}

/**
 * Transform GetTokenMetadataReturn from API to normalized format
 */
export function toGetTokenMetadataReturn(
	raw: MetadataGen.GetTokenMetadataReturn,
): NormalizedTypes.GetTokenMetadataReturn {
	return {
		...raw,
		tokenMetadata: raw.tokenMetadata.map(toTokenMetadata),
	};
}

/**
 * Transform GetTokenMetadataBatchReturn from API to normalized format
 */
export function toGetTokenMetadataBatchReturn(
	raw: MetadataGen.GetTokenMetadataBatchReturn,
): NormalizedTypes.GetTokenMetadataBatchReturn {
	return {
		...raw,
		contractTokenMetadata: Object.fromEntries(
			Object.entries(raw.contractTokenMetadata).map(([address, metadata]) => [
				address,
				metadata.map(toTokenMetadata),
			]),
		),
	};
}

/**
 * Transform SearchTokenMetadataReturn from API to normalized format
 */
export function toSearchTokenMetadataReturn(
	raw: MetadataGen.SearchTokenMetadataReturn,
): NormalizedTypes.SearchTokenMetadataReturn {
	return {
		...raw,
		tokenMetadata: raw.tokenMetadata.map(toTokenMetadata),
	};
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
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress: normalized.contractAddress,
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
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress: normalized.contractAddress,
		tokenIDs: normalized.tokenIds.map(toApiTokenId),
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
		contractTokenMap: Object.fromEntries(
			Object.entries(normalized.contractTokenMap).map(([address, tokenIds]) => [
				address,
				tokenIds.map(toApiTokenId),
			]),
		),
	};
}

/**
 * Transform RefreshTokenMetadataArgs from normalized to API format
 */
export function toRefreshTokenMetadataArgs(
	normalized: NormalizedTypes.RefreshTokenMetadataArgs,
): MetadataGen.RefreshTokenMetadataArgs {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress: normalized.contractAddress,
		tokenIDs: normalized.tokenIds?.map(toApiTokenId),
		refreshAll: normalized.refreshAll,
	};
}

/**
 * Transform SearchTokenMetadataArgs from normalized to API format
 */
export function toSearchTokenMetadataArgs(
	normalized: NormalizedTypes.SearchTokenMetadataArgs,
): MetadataGen.SearchTokenMetadataArgs {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress: normalized.contractAddress,
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
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress: normalized.contractAddress,
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
	return raw; // PropertyFilter[] doesn't contain bigint fields, pass through
}

// ============================================================================
// Batch Transformers (convenience)
// ============================================================================

/**
 * Transform array of TokenMetadata
 */
export function toTokenMetadataList(
	raw: MetadataGen.TokenMetadata[],
): NormalizedTypes.TokenMetadata[] {
	return raw.map(toTokenMetadata);
}

/**
 * Transform array of ContractInfo
 */
export function toContractInfoList(
	raw: MetadataGen.ContractInfo[],
): NormalizedTypes.ContractInfo[] {
	return raw.map(toContractInfo);
}

/**
 * Transform array of Assets
 */
export function toAssetList(raw: MetadataGen.Asset[]): NormalizedTypes.Asset[] {
	return raw.map(toAsset);
}
