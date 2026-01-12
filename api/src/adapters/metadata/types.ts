import type {
	Filter,
	Asset as GenAsset,
	ContractInfo as GenContractInfo,
	ContractInfoExtensionBridgeInfo as GenContractInfoExtensionBridgeInfo,
	ContractInfoExtensions as GenContractInfoExtensions,
	GetContractInfoArgs as GenGetContractInfoArgs,
	GetContractInfoBatchArgs as GenGetContractInfoBatchArgs,
	GetContractInfoBatchReturn as GenGetContractInfoBatchReturn,
	GetContractInfoReturn as GenGetContractInfoReturn,
	GetTokenMetadataArgs as GenGetTokenMetadataArgs,
	GetTokenMetadataBatchArgs as GenGetTokenMetadataBatchArgs,
	GetTokenMetadataBatchReturn as GenGetTokenMetadataBatchReturn,
	GetTokenMetadataPropertyFiltersArgs as GenGetTokenMetadataPropertyFiltersArgs,
	GetTokenMetadataPropertyFiltersReturn as GenGetTokenMetadataPropertyFiltersReturn,
	GetTokenMetadataReturn as GenGetTokenMetadataReturn,
	Page as GenPage,
	RefreshTokenMetadataArgs as GenRefreshTokenMetadataArgs,
	RefreshTokenMetadataReturn as GenRefreshTokenMetadataReturn,
	SearchTokenMetadataArgs as GenSearchTokenMetadataArgs,
	SearchTokenMetadataReturn as GenSearchTokenMetadataReturn,
	TokenMetadata as GenTokenMetadata,
	PropertyFilter,
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

export type GetContractInfoArgs = Omit<
	GenGetContractInfoArgs,
	'chainID' | 'contractAddress'
> & {
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

export type GetTokenMetadataArgs = Omit<
	GenGetTokenMetadataArgs,
	'chainID' | 'contractAddress' | 'tokenIDs'
> & {
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

export type RefreshTokenMetadataArgs = Omit<
	GenRefreshTokenMetadataArgs,
	'chainID' | 'contractAddress' | 'tokenIDs'
> & {
	chainId: ChainId;
	tokenIds?: TokenId[];
	refreshAll?: boolean;
} & (
		| { contractAddress: string; collectionAddress?: never }
		| { collectionAddress: string; contractAddress?: never }
	);

export type RefreshTokenMetadataReturn = GenRefreshTokenMetadataReturn;

export type SearchTokenMetadataArgs = Omit<
	GenSearchTokenMetadataArgs,
	'chainID' | 'contractAddress'
> & {
	chainId: ChainId;
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

export type GetTokenMetadataPropertyFiltersArgs = Omit<
	GenGetTokenMetadataPropertyFiltersArgs,
	'chainID' | 'contractAddress'
> & {
	chainId: ChainId;
} & (
		| { contractAddress: string; collectionAddress?: never }
		| { collectionAddress: string; contractAddress?: never }
	);

export type GetTokenMetadataPropertyFiltersReturn =
	GenGetTokenMetadataPropertyFiltersReturn;

export type GetSingleTokenMetadataArgs = Omit<
	GetTokenMetadataArgs,
	'tokenIds' | 'contractAddress' | 'collectionAddress'
> & {
	contractAddress?: Address;
	collectionAddress?: Address;
	tokenId: TokenId;
};

export type GetFiltersArgs = Omit<
	GetTokenMetadataPropertyFiltersArgs,
	'excludeProperties' | 'contractAddress' | 'collectionAddress'
> & {
	contractAddress?: Address;
	collectionAddress?: Address;
	showAllFilters?: boolean;
};

export type GetContractInfoSdkArgs = Omit<
	GetContractInfoArgs,
	'contractAddress' | 'collectionAddress'
> & {
	contractAddress?: Address;
	collectionAddress?: Address;
};

export type GetTokenMetadataSdkArgs = Omit<
	GetTokenMetadataArgs,
	'contractAddress' | 'collectionAddress'
> & {
	contractAddress?: Address;
	collectionAddress?: Address;
};

export type SearchTokenMetadataSdkArgs = Omit<
	SearchTokenMetadataArgs,
	'contractAddress' | 'collectionAddress'
> & {
	contractAddress?: Address;
	collectionAddress?: Address;
};
