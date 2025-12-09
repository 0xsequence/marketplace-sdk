// Normalized Indexer Types

import type { Address, Amount, ChainId, TokenId } from '../../types/primitives';

export interface ContractInfo {
	chainId: ChainId;
	address: Address;
	name?: string;
	type?: string;
	symbol?: string;
	decimals?: number;
	logoURI?: string;
	deployed?: boolean;
	bytecodeHash?: string;
	extensions?: {
		link?: string;
		description?: string;
		ogImage?: string;
		ogName?: string;
		originChainId?: ChainId;
		originAddress?: Address;
		blacklist?: boolean;
		verified?: boolean;
		verifiedBy?: string;
		featured?: boolean;
		featureIndex?: number;
		categories?: string[];
	};
	updatedAt?: string;
}

export interface TokenMetadata {
	tokenId: TokenId;
	name?: string;
	description?: string;
	image?: string;
	decimals?: number;
	properties?: Record<string, unknown>;
	attributes?: Array<{
		trait_type: string;
		value: string | number;
		display_type?: string;
	}>;
	video?: string;
	audio?: string;
	image_data?: string;
	external_url?: string;
	background_color?: string;
	animation_url?: string;
}

export interface TokenBalance {
	contractType: string;
	contractAddress: Address;
	accountAddress: Address;
	tokenId: TokenId;
	balance: Amount;
	blockHash?: string;
	blockNumber?: number;
	chainId: ChainId;
	contractInfo?: ContractInfo;
	tokenMetadata?: TokenMetadata;
	uniqueCollectibles?: Amount;
	isSummary?: boolean;
}

export interface TokenSupply {
	tokenId: TokenId;
	supply: Amount;
	chainId: ChainId;
	contractAddress?: Address;
	contractInfo?: ContractInfo;
	tokenMetadata?: TokenMetadata;
}

export interface TransactionReceipt {
	txnHash: string;
	blockHash: string;
	blockNumber: number;
	chainId?: ChainId;
	txnIndex: number;
	from?: Address;
	to?: Address;
	gasUsed?: number;
	effectiveGasPrice?: Amount;
	logs?: Array<{
		address: Address;
		topics: string[];
		data: string;
		logIndex: number;
	}>;
}

export interface TokenIDRange {
	startTokenId: TokenId;
	endTokenId: TokenId;
}

export interface Page {
	page: number;
	pageSize: number;
	more: boolean;
}

export type GetTokenBalancesRequest = {
	accountAddress: Address;
	tokenId?: TokenId;
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
	};
	page?: {
		page?: number;
		pageSize?: number;
		more?: boolean;
	};
} & (
	| { contractAddress?: Address; collectionAddress?: never }
	| { collectionAddress?: Address; contractAddress?: never }
);

export interface GetTokenBalancesResponse {
	balances: TokenBalance[];
	page?: Page;
}

export type GetTokenSuppliesRequest = {
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
	};
	page?: {
		page?: number;
		pageSize?: number;
		more?: boolean;
	};
} & (
	| { contractAddress: Address; collectionAddress?: never }
	| { collectionAddress: Address; contractAddress?: never }
);

export interface GetTokenSuppliesResponse {
	contractType: string;
	contractAddress: Address;
	supplies: TokenSupply[];
	page?: Page;
}

export type GetTokenIDRangesRequest =
	| { contractAddress: Address; collectionAddress?: never }
	| { collectionAddress: Address; contractAddress?: never };

export interface GetTokenIDRangesResponse {
	contractAddress: string;
	ranges: TokenIDRange[];
}

export interface NativeTokenBalance {
	accountAddress: Address;
	chainId: ChainId;
	balance: Amount;
	errorReason?: string;
}

export interface GetTokenBalancesDetailsResponse {
	page: Page;
	nativeBalances: Array<NativeTokenBalance>;
	balances: Array<TokenBalance>;
}

export interface GetTokenBalancesByContractResponse {
	page: Page;
	balances: Array<TokenBalance>;
}

export interface GetNativeTokenBalanceResponse {
	balance: NativeTokenBalance;
}
