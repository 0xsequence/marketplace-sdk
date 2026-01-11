import type {
	ContractInfo as GenContractInfo,
	ContractInfoExtensions as GenContractInfoExtensions,
	ContractInfoExtensionBridgeInfo as GenContractInfoExtensionBridgeInfo,
	TokenMetadata as GenTokenMetadata,
	Asset as GenAsset,
	Page as GenPage,
	Filter,
	PropertyFilter,
	GetContractInfoReturn as GenGetContractInfoReturn,
	GetContractInfoBatchArgs as GenGetContractInfoBatchArgs,
	GetContractInfoBatchReturn as GenGetContractInfoBatchReturn,
	GetTokenMetadataReturn as GenGetTokenMetadataReturn,
	GetTokenMetadataBatchArgs as GenGetTokenMetadataBatchArgs,
	GetTokenMetadataBatchReturn as GenGetTokenMetadataBatchReturn,
	RefreshTokenMetadataReturn as GenRefreshTokenMetadataReturn,
	SearchTokenMetadataReturn as GenSearchTokenMetadataReturn,
	GetTokenMetadataPropertyFiltersReturn as GenGetTokenMetadataPropertyFiltersReturn,
} from '@0xsequence/metadata';

import type { Address, ChainId, TokenId } from '../../types/primitives';

export type { Filter, PropertyFilter };

export type ContractInfoExtensionBridgeInfo = Omit<
	GenContractInfoExtensionBridgeInfo,
	'tokenAddress'
> & {
	tokenAddress: Address;
};

export type ContractInfoExtensions = Omit<
	GenContractInfoExtensions,
	'originChainId' | 'originAddress' | 'bridgeInfo'
> & {
	originChainId?: ChainId;
	originAddress?: Address;
	bridgeInfo?: {
		[key: string]: ContractInfoExtensionBridgeInfo;
	};
};

export type ContractInfo = Omit<
	GenContractInfo,
	'chainId' | 'address' | 'extensions'
> & {
	chainId: ChainId;
	address: Address;
	extensions: ContractInfoExtensions;
};

export type Asset = Omit<GenAsset, 'tokenId'> & {
	tokenId?: TokenId;
};

export type TokenMetadata = Omit<
	GenTokenMetadata,
	'chainId' | 'contractAddress' | 'tokenId' | 'assets'
> & {
	chainId?: ChainId;
	contractAddress?: Address;
	tokenId: TokenId;
	assets?: Asset[];
};

export type Page = GenPage;

export type GetContractInfoArgs = {
	chainId: ChainId;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export type GetContractInfoReturn = Omit<
	GenGetContractInfoReturn,
	'contractInfo'
> & {
	contractInfo: ContractInfo;
	taskID?: number;
};

export type GetContractInfoBatchArgs = Omit<
	GenGetContractInfoBatchArgs,
	'chainID'
> & {
	chainId: ChainId;
};

export type GetContractInfoBatchReturn = Omit<
	GenGetContractInfoBatchReturn,
	'contractInfoMap'
> & {
	contractInfoMap: {
		[key: string]: ContractInfo;
	};
	taskID?: number;
};

export type GetTokenMetadataArgs = {
	chainId: ChainId;
	tokenIds: TokenId[];
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export type GetTokenMetadataReturn = Omit<
	GenGetTokenMetadataReturn,
	'tokenMetadata'
> & {
	tokenMetadata: TokenMetadata[];
	taskID?: number;
};

export type GetTokenMetadataBatchArgs = Omit<
	GenGetTokenMetadataBatchArgs,
	'chainID' | 'contractTokenMap'
> & {
	chainId: ChainId;
	contractTokenMap: {
		[key: string]: TokenId[];
	};
};

export type GetTokenMetadataBatchReturn = Omit<
	GenGetTokenMetadataBatchReturn,
	'contractTokenMetadata'
> & {
	contractTokenMetadata: {
		[key: string]: TokenMetadata[];
	};
	taskID?: number;
};

export type RefreshTokenMetadataArgs = {
	chainId: ChainId;
	tokenIds?: TokenId[];
	refreshAll?: boolean;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export type RefreshTokenMetadataReturn = GenRefreshTokenMetadataReturn;

export type SearchTokenMetadataArgs = {
	chainId: ChainId;
	filter: Filter;
	page?: Page;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export type SearchTokenMetadataReturn = Omit<
	GenSearchTokenMetadataReturn,
	'tokenMetadata'
> & {
	page: Page;
	tokenMetadata: TokenMetadata[];
};

export type GetTokenMetadataPropertyFiltersArgs = {
	chainId: ChainId;
	excludeProperties: Array<string>;
	excludePropertyValues?: boolean;
} & (
	| { contractAddress: string; collectionAddress?: never }
	| { collectionAddress: string; contractAddress?: never }
);

export type GetTokenMetadataPropertyFiltersReturn =
	GenGetTokenMetadataPropertyFiltersReturn;
