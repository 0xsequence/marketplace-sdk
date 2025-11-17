/**
 * NORMALIZED Indexer Types
 *
 * These are the normalized, developer-friendly types used throughout our SDK.
 * All chain IDs are numbers, all token IDs are bigint, all amounts are bigint.
 *
 * KEY NORMALIZATIONS:
 * - chainId: number (API) → ChainId: number (normalized, no change)
 * - tokenID: string (API, uppercase!) → TokenId: bigint (normalized)
 * - balance: string (API) → Amount: bigint (normalized)
 * - Various numeric strings → bigint
 *
 * @packageDocumentation
 */

import type { Address, Amount, ChainId, TokenId } from '../../types/primitives';

/**
 * NORMALIZED: Contract information
 * Source: IndexerAPI.ContractInfo with normalized types
 */
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

/**
 * NORMALIZED: Token metadata
 * Source: IndexerAPI.TokenMetadata with normalized types
 */
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

/**
 * NORMALIZED: Token balance
 * Source: IndexerAPI.TokenBalance with normalized types
 */
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

/**
 * NORMALIZED: Token supply
 * Source: IndexerAPI.TokenSupply with normalized types
 */
export interface TokenSupply {
	tokenId: TokenId;
	supply: Amount;
	chainId: ChainId;
	contractAddress?: Address;
	contractInfo?: ContractInfo;
	tokenMetadata?: TokenMetadata;
}

/**
 * NORMALIZED: Transaction receipt
 * Source: IndexerAPI.TransactionReceipt with normalized types
 */
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

/**
 * NORMALIZED: Token ID range
 * Source: IndexerAPI.TokenIDRange with normalized types
 */
export interface TokenIDRange {
	startTokenId: TokenId;
	endTokenId: TokenId;
}

/**
 * Page information for paginated responses
 */
export interface Page {
	page: number;
	pageSize: number;
	more: boolean;
}

/**
 * NORMALIZED: Get token balances request
 */
export interface GetTokenBalancesRequest {
	accountAddress: Address;
	contractAddress?: Address;
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
}

/**
 * NORMALIZED: Get token balances response
 */
export interface GetTokenBalancesResponse {
	balances: TokenBalance[];
	page?: Page;
}

/**
 * NORMALIZED: Get token supplies request
 */
export interface GetTokenSuppliesRequest {
	contractAddress: Address;
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
	};
	page?: {
		page?: number;
		pageSize?: number;
		more?: boolean;
	};
}

/**
 * NORMALIZED: Get token supplies response
 */
export interface GetTokenSuppliesResponse {
	contractType: string;
	contractAddress: Address;
	supplies: TokenSupply[];
	page?: Page;
}

/**
 * NORMALIZED: Get token ID ranges request
 */
export interface GetTokenIDRangesRequest {
	contractAddress: Address;
}

/**
 * NORMALIZED: Get token ID ranges response
 */
export interface GetTokenIDRangesResponse {
	contractAddress: string;
	ranges: TokenIDRange[];
}

/**
 * NORMALIZED: Native token balance (e.g., ETH, MATIC)
 * Source: IndexerAPI.NativeTokenBalance with normalized types
 */
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
