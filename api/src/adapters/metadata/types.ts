// Normalized Metadata Types

import type { ContractType } from '@0xsequence/indexer';
import type { Filter, PropertyFilter } from '@0xsequence/metadata';
import type { Address, ChainId, TokenId } from '../../types/primitives';
export type { Filter, PropertyFilter };

export interface ContractInfo {
	chainId: ChainId;
	address: Address;
	source: string;
	name: string;
	type: ContractType;
	symbol: string;
	decimals?: number;
	logoURI: string;
	deployed: boolean;
	bytecodeHash: string;
	extensions: ContractInfoExtensions;
	updatedAt: string;
	queuedAt?: string;
	status: string;
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
	originAddress?: Address;
	blacklist?: boolean;
	verified?: boolean;
	verifiedBy?: string;
	featured?: boolean;
	featureIndex?: number;
}

export interface ContractInfoExtensionBridgeInfo {
	tokenAddress: Address;
}

export interface TokenMetadata {
	chainId?: ChainId;
	contractAddress?: Address;
	tokenId: TokenId;
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
	status: string;
	queuedAt?: string;
	lastFetched?: string;
}

export interface Asset {
	id: number;
	collectionId: number;
	tokenId?: TokenId;
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

export type GetContractInfoArgs = {
	chainId: ChainId;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export interface GetContractInfoReturn {
	contractInfo: ContractInfo;
	taskID?: number;
}

export interface GetContractInfoBatchArgs {
	chainId: ChainId;
	contractAddresses: string[];
}

export interface GetContractInfoBatchReturn {
	contractInfoMap: {
		[key: string]: ContractInfo;
	};
	taskID?: number;
}

export type GetTokenMetadataArgs = {
	chainId: ChainId;
	tokenIds: TokenId[];
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export interface GetTokenMetadataReturn {
	tokenMetadata: TokenMetadata[];
	taskID?: number;
}

export interface GetTokenMetadataBatchArgs {
	chainId: ChainId;
	contractTokenMap: {
		[key: string]: TokenId[];
	};
}

export interface GetTokenMetadataBatchReturn {
	contractTokenMetadata: {
		[key: string]: TokenMetadata[];
	};
	taskID?: number;
}

export type RefreshTokenMetadataArgs = {
	chainId: ChainId;
	tokenIds?: TokenId[];
	refreshAll?: boolean;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export interface RefreshTokenMetadataReturn {
	taskID: number;
}

export type SearchTokenMetadataArgs = {
	chainId: ChainId;
	filter: Filter;
	page?: Page;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export interface SearchTokenMetadataReturn {
	page: Page;
	tokenMetadata: TokenMetadata[];
}

export type GetTokenMetadataPropertyFiltersArgs = {
	chainId: ChainId;
	excludeProperties: Array<string>;
	excludePropertyValues?: boolean;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export interface GetTokenMetadataPropertyFiltersReturn {
	filters: Array<PropertyFilter>;
}
