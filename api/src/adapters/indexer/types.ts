import type {
	ContractInfo as GenContractInfo,
	ContractInfoExtensions as GenContractInfoExtensions,
	TokenMetadata as GenTokenMetadata,
	TokenBalance as GenTokenBalance,
	TokenSupply as GenTokenSupply,
	TransactionLog as GenTransactionLog,
	TransactionReceipt as GenTransactionReceipt,
	TokenIDRange as GenTokenIDRange,
	Page as GenPage,
	NativeTokenBalance as GenNativeTokenBalance,
	GetTokenBalancesReturn as GenGetTokenBalancesReturn,
	GetTokenSuppliesReturn as GenGetTokenSuppliesReturn,
	GetTokenIDRangesReturn as GenGetTokenIDRangesReturn,
	GetTokenBalancesDetailsReturn as GenGetTokenBalancesDetailsReturn,
	GetTokenBalancesDetailsArgs as GenGetTokenBalancesDetailsArgs,
	GetTokenBalancesByContractReturn as GenGetTokenBalancesByContractReturn,
	GetTokenBalancesByContractArgs as GenGetTokenBalancesByContractArgs,
	GetNativeTokenBalanceReturn as GenGetNativeTokenBalanceReturn,
	TokenBalancesFilter as GenTokenBalancesFilter,
	TokenBalancesByContractFilter as GenTokenBalancesByContractFilter,
} from '@0xsequence/indexer';

import type { Address, Amount, ChainId, TokenId } from '../../types/primitives';

export { ContractType, ResourceStatus } from '@0xsequence/indexer';

export type ContractInfoExtensions = Omit<
	GenContractInfoExtensions,
	'originChainId' | 'originAddress'
> & {
	originChainId?: ChainId;
	originAddress?: Address;
};

export type ContractInfo = Omit<
	GenContractInfo,
	'chainId' | 'address' | 'extensions'
> & {
	chainId: ChainId;
	address: Address;
	extensions: ContractInfoExtensions;
};

export type TokenMetadata = Omit<GenTokenMetadata, 'tokenId'> & {
	tokenId: TokenId;
};

export type TokenBalance = Omit<
	GenTokenBalance,
	| 'tokenID'
	| 'balance'
	| 'chainId'
	| 'contractAddress'
	| 'accountAddress'
	| 'uniqueCollectibles'
	| 'contractInfo'
	| 'tokenMetadata'
> & {
	tokenId: TokenId;
	balance: Amount;
	chainId: ChainId;
	contractAddress: Address;
	accountAddress: Address;
	uniqueCollectibles?: Amount;
	contractInfo?: ContractInfo;
	tokenMetadata?: TokenMetadata;
};

export type TokenSupply = Omit<
	GenTokenSupply,
	'tokenID' | 'supply' | 'chainId' | 'contractInfo' | 'tokenMetadata'
> & {
	tokenId: TokenId;
	supply: Amount;
	chainId: ChainId;
	contractAddress?: Address;
	contractInfo?: ContractInfo;
	tokenMetadata?: TokenMetadata;
};

export type TransactionLog = Omit<
	GenTransactionLog,
	'contractAddress' | 'index'
> & {
	address: Address;
	logIndex: number;
};

export type TransactionReceipt = Pick<
	GenTransactionReceipt,
	'txnHash' | 'blockHash' | 'blockNumber' | 'txnIndex' | 'gasUsed'
> & {
	chainId?: ChainId;
	from?: Address;
	to?: Address;
	effectiveGasPrice?: Amount;
	logs?: TransactionLog[];
};

export type TokenIDRange = Omit<GenTokenIDRange, 'start' | 'end'> & {
	startTokenId: TokenId;
	endTokenId: TokenId;
};

export type Page = GenPage;

export type GetTokenBalancesRequest = Pick<GenTokenBalance, never> & {
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
	| { accountAddress: Address; userAddress?: never }
	| { userAddress: Address; accountAddress?: never }
) & (
	| { contractAddress?: Address; collectionAddress?: never }
	| { collectionAddress?: Address; contractAddress?: never }
);

export type GetTokenBalancesResponse = Pick<GenGetTokenBalancesReturn, never> & {
	balances: TokenBalance[];
	page?: Page;
};

export type GetTokenSuppliesRequest = Pick<GenTokenSupply, never> & {
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

export type GetTokenSuppliesResponse = Pick<
	GenGetTokenSuppliesReturn,
	'contractType'
> & {
	contractAddress: Address;
	supplies: TokenSupply[];
	page?: Page;
};

export type GetTokenIDRangesRequest = Pick<GenTokenIDRange, never> &
	(
		| { contractAddress: Address; collectionAddress?: never }
		| { collectionAddress: Address; contractAddress?: never }
	);

export type GetTokenIDRangesResponse = Pick<GenGetTokenIDRangesReturn, never> & {
	contractAddress: string;
	ranges: TokenIDRange[];
};

export type NativeTokenBalance = Omit<
	GenNativeTokenBalance,
	'accountAddress' | 'chainId' | 'balance'
> & {
	accountAddress: Address;
	chainId: ChainId;
	balance: Amount;
};

export type GetTokenBalancesDetailsResponse = Pick<
	GenGetTokenBalancesDetailsReturn,
	never
> & {
	page: Page;
	nativeBalances: NativeTokenBalance[];
	balances: TokenBalance[];
};

export type GetTokenBalancesByContractResponse = Pick<
	GenGetTokenBalancesByContractReturn,
	never
> & {
	page: Page;
	balances: TokenBalance[];
};

export type TokenBalancesByContractFilter = Omit<
	GenTokenBalancesByContractFilter,
	'contractAddresses' | 'accountAddresses'
> & {
	contractAddresses: Array<Address>;
	accountAddresses?: Array<Address>;
};

export type GetTokenBalancesByContractRequest = Omit<
	GenGetTokenBalancesByContractArgs,
	'filter'
> & {
	filter: TokenBalancesByContractFilter;
};

export type GetUserCollectionBalancesRequest = Pick<
	GenGetTokenBalancesByContractArgs,
	'omitMetadata'
> & {
	userAddress: Address;
	collectionAddress: Address;
	includeMetadata?: boolean;
};

export type TokenBalancesFilter = Omit<
	GenTokenBalancesFilter,
	'accountAddresses' | 'contractWhitelist' | 'contractBlacklist'
> & {
	accountAddresses: Array<Address>;
	contractWhitelist?: Array<Address>;
	contractBlacklist?: Array<Address>;
};

export type GetTokenBalancesDetailsRequest = Omit<
	GenGetTokenBalancesDetailsArgs,
	'filter'
> & {
	filter: TokenBalancesFilter;
};

export type GetNativeTokenBalanceResponse = Pick<
	GenGetNativeTokenBalanceReturn,
	never
> & {
	balance: NativeTokenBalance;
};
