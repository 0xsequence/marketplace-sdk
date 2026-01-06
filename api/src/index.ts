// @0xsequence/api-client
// Unified API adapter layer for Sequence services with normalized types

export {
	ContractType,
	ResourceStatus,
	TransactionStatus,
	TransactionType,
} from '@0xsequence/indexer';

export type {
	CollectionFilterSettings,
	LookupMarketplaceReturn,
	MarketCollection,
	MarketPage,
	Marketplace as BuilderMarketplace,
	MarketplaceCollection,
	MarketplaceSettings,
	MarketplaceWallet,
	MetadataFilterRule,
	OpenIdProvider,
	ShopCollection,
	ShopPage,
} from './adapters/builder';
export * as Builder from './adapters/builder';
export { FilterCondition, MarketplaceWalletType } from './adapters/builder';

export * as BuilderAPI from './adapters/builder/builder.gen';

export { MarketplaceService } from './adapters/builder/builder.gen';

export type {
	ContractInfo as IndexerContractInfo,
	GetTokenBalancesDetailsResponse,
	GetTokenBalancesResponse,
	GetTokenIDRangesResponse,
	GetTokenSuppliesResponse,
	TokenBalance as IndexerTokenBalance,
	TokenMetadata as IndexerTokenMetadata,
	TokenSupply as IndexerTokenSupply,
} from './adapters/indexer';
export * as Indexer from './adapters/indexer';

export { IndexerClient as SequenceIndexer } from './adapters/indexer';

export type {
	AdditionalFee,
	CheckoutOptions,
	CheckoutOptionsItem,
	CheckoutOptionsMarketplaceRequest,
	CheckoutOptionsMarketplaceResponse,
	CheckoutOptionsSalesContractRequest,
	CheckoutOptionsSalesContractResponse,
	Collectible,
	CollectibleOrder,
	CollectiblePrimarySaleItem,
	CollectiblesFilter,
	Collection,
	CreateReq,
	Currency,
	GenerateCancelTransactionRequest,
	GenerateListingTransactionRequest,
	GenerateOfferTransactionRequest,
	GenerateSellTransactionRequest,
	GetCollectibleHighestOfferRequest,
	GetCollectibleHighestOfferResponse,
	GetCollectibleLowestListingResponse,
	GetCollectionDetailRequest,
	GetCountOfAllCollectiblesRequest,
	GetCountOfAllOrdersRequest,
	GetCountOfFilteredCollectiblesRequest,
	GetCountOfFilteredOrdersRequest,
	GetCountOfListingsForCollectibleRequest,
	GetCountOfListingsForCollectibleResponse,
	GetCountOfOffersForCollectibleRequest,
	GetCountOfOffersForCollectibleResponse,
	GetCountOfPrimarySaleItemsRequest,
	GetCountOfPrimarySaleItemsResponse,
	GetFloorOrderRequest,
	GetHighestPriceOfferForCollectibleRequest,
	GetLowestPriceListingForCollectibleRequest,
	GetOrdersInput,
	GetOrdersRequest,
	GetPrimarySaleItemRequest,
	GetPrimarySaleItemResponse,
	ListCollectibleActivitiesRequest,
	ListCollectibleActivitiesResponse,
	ListCollectibleListingsRequest,
	ListCollectibleListingsResponse,
	ListCollectibleOffersResponse,
	ListCollectiblesRequest,
	ListCollectiblesResponse,
	ListCollectionActivitiesRequest,
	ListCollectionActivitiesResponse,
	ListCurrenciesRequest,
	ListListingsForCollectibleRequest,
	ListListingsForCollectibleResponse,
	ListOffersForCollectibleRequest,
	ListOffersForCollectibleResponse,
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
	ListPrimarySaleItemsRequest,
	ListPrimarySaleItemsResponse,
	Order,
	OrderData,
	OrderFilter,
	OrdersFilter,
	Page,
	PriceFilter,
	PrimarySaleItem,
	PrimarySaleItemsFilter,
	PropertyFilter,
	SortBy,
	Step,
	WebrpcError,
} from './adapters/marketplace';

export * as Marketplace from './adapters/marketplace';

export {
	type ApprovalStep,
	type BuyStep,
	type CancelStep,
	CollectionStatus,
	type CreateListingStep,
	type CreateOfferStep,
	CurrencyStatus,
	ExecuteType,
	findApprovalStep,
	findBuyStep,
	findSellStep,
	findStepByType,
	hasPendingApproval,
	isApprovalStep,
	isBuyStep,
	isCancelStep,
	isCreateListingStep,
	isCreateOfferStep,
	isSellStep,
	isSignatureStep,
	isTransactionStep,
	MarketplaceKind,
	MetadataStatus,
	OfferType,
	OrderbookKind,
	OrderSide,
	OrderStatus,
	PropertyType,
	type SellStep,
	type Signature,
	type SignatureStep,
	SortOrder,
	StepType,
	TransactionCrypto,
	type TransactionStep,
} from './adapters/marketplace';
// ContractType is already exported from @0xsequence/indexer above

export { MarketplaceClient } from './adapters/marketplace/client';

export type {
	Asset as MarketplaceAsset,
	PostRequest,
} from './adapters/marketplace/marketplace.gen';
export * as MarketplaceAPI from './adapters/marketplace/marketplace.gen';

export {
	TransactionOnRampProvider,
	WalletKind,
} from './adapters/marketplace/marketplace.gen';

export type {
	Asset as MetadataAsset,
	ContractInfo,
	ContractInfoExtensionBridgeInfo,
	ContractInfoExtensions,
	Filter,
	GetContractInfoArgs,
	GetContractInfoBatchArgs,
	GetTokenMetadataArgs,
	GetTokenMetadataPropertyFiltersArgs,
	GetTokenMetadataPropertyFiltersReturn,
	GetTokenMetadataReturn,
	Page as MetadataPage,
	SearchTokenMetadataArgs,
	SearchTokenMetadataReturn,
	TokenMetadata,
} from './adapters/metadata';
export * as Metadata from './adapters/metadata';

export { MetadataClient as SequenceMetadata } from './adapters/metadata';

export * from './types';
export * from './utils/normalize';
export { type BuildPageParams, buildPage } from './utils/transform';
export * from './utils/type-assertions';
