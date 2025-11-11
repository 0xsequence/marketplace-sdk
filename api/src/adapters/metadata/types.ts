/**
 * Normalized metadata types with standard primitives
 *
 * These types use our standard primitives (ChainId=number, TokenId=bigint, etc.) instead of
 * the raw API types (number, string).
 */

// Import and re-export Filter and PropertyFilter from gen - they don't need normalization
import type { Filter, PropertyFilter } from '@0xsequence/metadata';
import type { ChainId, TokenId } from '../../types/primitives';
export type { Filter, PropertyFilter };

export interface ContractInfo {
	chainId: ChainId; // NORMALIZED: number
	address: string;
	source: string;
	name: string;
	type: string;
	symbol: string;
	decimals?: number;
	logoURI: string;
	deployed: boolean;
	bytecodeHash: string;
	extensions: ContractInfoExtensions;
	updatedAt: string;
	queuedAt?: string;
	status: string; // ResourceStatus enum
}

export interface ContractInfoExtensions {
	link?: string;
	description?: string;
	categories?: string[];
	bridgeInfo?: {
		[key: string]: ContractInfoExtensionBridgeInfo;
	};
	ogImage?: string;
	ogName?: string;
	originChainId?: ChainId;
	originAddress?: string;
	blacklist?: boolean;
	verified?: boolean;
	verifiedBy?: string;
	featured?: boolean;
	featureIndex?: number;
}

export interface ContractInfoExtensionBridgeInfo {
	tokenAddress: string;
}

export interface TokenMetadata {
	chainId?: ChainId; // NORMALIZED: number
	contractAddress?: string;
	tokenId: TokenId; // NORMALIZED: bigint (was string)
	source: string;
	name: string;
	description?: string;
	image?: string;
	video?: string;
	audio?: string;
	properties?: {
		[key: string]: unknown;
	};
	attributes: Array<{
		[key: string]: unknown;
	}>;
	image_data?: string;
	external_url?: string;
	background_color?: string;
	animation_url?: string;
	decimals?: number;
	updatedAt?: string;
	assets?: Asset[];
	status: string; // ResourceStatus enum
	queuedAt?: string;
	lastFetched?: string;
}

export interface Asset {
	id: number;
	collectionId: number;
	tokenId?: TokenId; // NORMALIZED: bigint (was string)
	url?: string;
	metadataField: string;
	name?: string;
	filesize?: number;
	mimeType?: string;
	width?: number;
	height?: number;
	updatedAt?: string;
}

export interface Page {
	page?: number;
	column?: string;
	before?: unknown;
	after?: unknown;
	pageSize?: number;
	more?: boolean;
}

// Request argument types (normalized)
export interface GetContractInfoArgs {
	chainId: ChainId; // NORMALIZED: bigint (API expects string)
	contractAddress: string;
}

export interface GetContractInfoReturn {
	contractInfo: ContractInfo;
	taskID?: number;
}

export interface GetContractInfoBatchArgs {
	chainId: ChainId; // NORMALIZED: bigint (API expects string)
	contractAddresses: string[];
}

export interface GetContractInfoBatchReturn {
	contractInfoMap: {
		[key: string]: ContractInfo;
	};
	taskID?: number;
}

export interface GetTokenMetadataArgs {
	chainId: ChainId; // NORMALIZED: bigint (API expects string)
	contractAddress: string;
	tokenIds: TokenId[]; // NORMALIZED: bigint[] (API expects string[])
}

export interface GetTokenMetadataReturn {
	tokenMetadata: TokenMetadata[];
	taskID?: number;
}

export interface GetTokenMetadataBatchArgs {
	chainId: ChainId; // NORMALIZED: bigint (API expects string)
	contractTokenMap: {
		[key: string]: TokenId[]; // NORMALIZED: bigint[] (API expects string[])
	};
}

export interface GetTokenMetadataBatchReturn {
	contractTokenMetadata: {
		[key: string]: TokenMetadata[];
	};
	taskID?: number;
}

export interface RefreshTokenMetadataArgs {
	chainId: ChainId; // NORMALIZED: bigint (API expects string)
	contractAddress: string;
	tokenIds?: TokenId[]; // NORMALIZED: bigint[] (API expects string[])
	refreshAll?: boolean;
}

export interface RefreshTokenMetadataReturn {
	taskID: number;
}

export interface SearchTokenMetadataArgs {
	chainId: ChainId; // NORMALIZED: bigint (API expects string)
	contractAddress: string;
	filter: Filter;
	page?: Page;
}

export interface SearchTokenMetadataReturn {
	page: Page;
	tokenMetadata: TokenMetadata[];
}

export interface GetTokenMetadataPropertyFiltersArgs {
	chainId: ChainId; // NORMALIZED: number (API expects string chainID)
	contractAddress: string;
	excludeProperties: Array<string>;
	excludePropertyValues?: boolean;
}

export interface GetTokenMetadataPropertyFiltersReturn {
	filters: Array<PropertyFilter>;
}
