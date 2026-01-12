import type {
	ContractInfo as GenContractInfo,
	ContractInfoExtensions as GenContractInfoExtensions,
	GetNativeTokenBalanceReturn as GenGetNativeTokenBalanceReturn,
	GetTokenBalancesArgs as GenGetTokenBalancesArgs,
	GetTokenBalancesByContractArgs as GenGetTokenBalancesByContractArgs,
	GetTokenBalancesByContractReturn as GenGetTokenBalancesByContractReturn,
	GetTokenBalancesDetailsArgs as GenGetTokenBalancesDetailsArgs,
	GetTokenBalancesDetailsReturn as GenGetTokenBalancesDetailsReturn,
	GetTokenBalancesReturn as GenGetTokenBalancesReturn,
	GetTokenIDRangesArgs as GenGetTokenIDRangesArgs,
	GetTokenIDRangesReturn as GenGetTokenIDRangesReturn,
	GetTokenSuppliesArgs as GenGetTokenSuppliesArgs,
	GetTokenSuppliesReturn as GenGetTokenSuppliesReturn,
	MetadataOptions as GenMetadataOptions,
	NativeTokenBalance as GenNativeTokenBalance,
	Page as GenPage,
	TokenBalance as GenTokenBalance,
	TokenBalancesByContractFilter as GenTokenBalancesByContractFilter,
	TokenBalancesFilter as GenTokenBalancesFilter,
	TokenIDRange as GenTokenIDRange,
	TokenMetadata as GenTokenMetadata,
	TokenSupply as GenTokenSupply,
	TransactionLog as GenTransactionLog,
	TransactionReceipt as GenTransactionReceipt,
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

export type TransactionReceipt = Omit<
	GenTransactionReceipt,
	'effectiveGasPrice' | 'from' | 'to' | 'logs'
> & {
	chainId?: ChainId;
	from?: Address;
	to?: Address;
	effectiveGasPrice: Amount;
	logs: TransactionLog[];
};

export type TokenIDRange = Omit<GenTokenIDRange, 'start' | 'end'> & {
	startTokenId: TokenId;
	endTokenId: TokenId;
};

export type Page = GenPage;

export type MetadataOptions = Omit<GenMetadataOptions, 'includeContracts'> & {
	includeContracts?: Array<Address>;
};

export type GetTokenBalancesRequest = Omit<
	GenGetTokenBalancesArgs,
	'accountAddress' | 'contractAddress' | 'tokenID' | 'page' | 'metadataOptions'
> & {
	tokenId?: TokenId;
	metadataOptions?: MetadataOptions;
	page?: Page;
} & (
		| { accountAddress: Address; userAddress?: never }
		| { userAddress: Address; accountAddress?: never }
	) &
	(
		| { contractAddress?: Address; collectionAddress?: never }
		| { collectionAddress?: Address; contractAddress?: never }
	);

export type GetTokenBalancesResponse = Omit<
	GenGetTokenBalancesReturn,
	'balances' | 'page'
> & {
	balances: TokenBalance[];
	page: Page;
};

export type GetTokenSuppliesRequest = Omit<
	GenGetTokenSuppliesArgs,
	'contractAddress' | 'page' | 'metadataOptions'
> & {
	metadataOptions?: MetadataOptions;
	page?: Page;
} & (
		| { contractAddress: Address; collectionAddress?: never }
		| { collectionAddress: Address; contractAddress?: never }
	);

export type GetTokenSuppliesResponse = Omit<
	GenGetTokenSuppliesReturn,
	'page' | 'tokenIDs'
> & {
	contractAddress: Address;
	tokenIDs: TokenSupply[];
	supplies: TokenSupply[];
	page: Page;
};

export type GetTokenIDRangesRequest = Omit<
	GenGetTokenIDRangesArgs,
	'contractAddress'
> &
	(
		| { contractAddress: Address; collectionAddress?: never }
		| { collectionAddress: Address; contractAddress?: never }
	);

export type GetTokenIDRangesResponse = Omit<
	GenGetTokenIDRangesReturn,
	'tokenIDRanges'
> & {
	contractAddress: Address;
	tokenIDRanges: TokenIDRange[];
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

export type GetTokenBalancesDetailsResponse = Omit<
	GenGetTokenBalancesDetailsReturn,
	'page' | 'nativeBalances' | 'balances'
> & {
	page: Page;
	nativeBalances: NativeTokenBalance[];
	balances: TokenBalance[];
};

export type GetTokenBalancesByContractResponse = Omit<
	GenGetTokenBalancesByContractReturn,
	'page' | 'balances'
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

export type GetNativeTokenBalanceResponse = Omit<
	GenGetNativeTokenBalanceReturn,
	'balance'
> & {
	balance: NativeTokenBalance;
};

export type GetBalanceOfCollectibleRequest = Omit<
	GetTokenBalancesRequest,
	| 'page'
	| 'contractAddress'
	| 'collectionAddress'
	| 'userAddress'
	| 'accountAddress'
> & {
	chainId: ChainId;
	collectionAddress?: Address;
	contractAddress?: Address;
	userAddress?: Address;
	accountAddress?: Address;
};

export type GetTokenBalancesSdkRequest = Omit<
	GetTokenBalancesRequest,
	'contractAddress' | 'collectionAddress' | 'userAddress' | 'accountAddress'
> & {
	chainId: ChainId;
	collectionAddress?: Address;
	contractAddress?: Address;
	userAddress?: Address;
	accountAddress?: Address;
};
