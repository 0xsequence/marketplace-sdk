// Metadata API Transformations
// Note: Metadata API uses chainID (string) and tokenIDs (string[])

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

function toBridgeInfo(
	raw: MetadataGen.ContractInfoExtensionBridgeInfo,
): NormalizedTypes.ContractInfoExtensionBridgeInfo {
	return {
		tokenAddress: normalizeAddress(raw.tokenAddress),
	};
}

export function toContractInfo(
	raw: MetadataGen.ContractInfo,
): NormalizedTypes.ContractInfo {
	// Build extensions object - copy non-transformed fields and transform others
	const extensions: NormalizedTypes.ContractInfoExtensions = {
		link: raw.extensions.link,
		description: raw.extensions.description,
		categories: raw.extensions.categories,
		ogImage: raw.extensions.ogImage,
		ogName: raw.extensions.ogName,
		blacklist: raw.extensions.blacklist,
		verified: raw.extensions.verified,
		verifiedBy: raw.extensions.verifiedBy,
		featured: raw.extensions.featured,
		featureIndex: raw.extensions.featureIndex,
	};

	// Transform optional fields only if they exist (don't add undefined)
	if (raw.extensions.originChainId !== undefined) {
		extensions.originChainId = normalizeChainId(raw.extensions.originChainId);
	}
	if (raw.extensions.originAddress !== undefined) {
		extensions.originAddress = normalizeAddress(raw.extensions.originAddress);
	}
	if (raw.extensions.bridgeInfo !== undefined) {
		extensions.bridgeInfo = transformRecord(
			raw.extensions.bridgeInfo,
			toBridgeInfo,
		);
	}

	return spreadWith(raw, {
		address: normalizeAddress(raw.address),
		chainId: normalizeChainId(raw.chainId),
		extensions,
	});
}

export function toAsset(raw: MetadataGen.Asset): NormalizedTypes.Asset {
	return spreadWith(raw, {
		tokenId: transformOptional(raw.tokenId, normalizeTokenId),
	});
}

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

export function toGetContractInfoReturn(
	raw: MetadataGen.GetContractInfoReturn,
): NormalizedTypes.GetContractInfoReturn {
	return spreadWith(raw, {
		contractInfo: toContractInfo(raw.contractInfo),
	});
}

export function toGetContractInfoBatchReturn(
	raw: MetadataGen.GetContractInfoBatchReturn,
): NormalizedTypes.GetContractInfoBatchReturn {
	return spreadWith(raw, {
		contractInfoMap: transformRecord(raw.contractInfoMap, toContractInfo),
	});
}

export function toGetTokenMetadataReturn(
	raw: MetadataGen.GetTokenMetadataReturn,
): NormalizedTypes.GetTokenMetadataReturn {
	return spreadWith(raw, {
		tokenMetadata: transformArray(raw.tokenMetadata, toTokenMetadata),
	});
}

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

export function toSearchTokenMetadataReturn(
	raw: MetadataGen.SearchTokenMetadataReturn,
): NormalizedTypes.SearchTokenMetadataReturn {
	return spreadWith(raw, {
		tokenMetadata: transformArray(raw.tokenMetadata, toTokenMetadata),
	});
}

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

export function toGetContractInfoBatchArgs(
	normalized: NormalizedTypes.GetContractInfoBatchArgs,
): MetadataGen.GetContractInfoBatchArgs {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddresses: normalized.contractAddresses,
	};
}

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
	};
}

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

export function toGetTokenMetadataPropertyFiltersReturn(
	raw: MetadataGen.GetTokenMetadataPropertyFiltersReturn,
): NormalizedTypes.GetTokenMetadataPropertyFiltersReturn {
	return raw;
}
