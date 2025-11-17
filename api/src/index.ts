/**
 * @0xsequence/marketplace-api
 *
 * Unified API adapter layer for all Sequence services
 * Normalizes inconsistent API types into a clean, developer-friendly interface
 *
 * IMPORTANT: This package ONLY exports normalized types (bigint, not string/number).
 * RAW API types are kept internal and only available through namespaced exports for testing.
 */

export {
	ContractType,
	ResourceStatus,
	TransactionStatus,
	TransactionType,
} from '@0xsequence/indexer';

export * as BuilderMocks from './__mocks__/builder.msw';
export * as IndexerMocks from './__mocks__/indexer.msw';
export * as MarketplaceMocks from './__mocks__/marketplace.msw';
export * as MetadataMocks from './__mocks__/metadata.msw';

export type {
	LookupMarketplaceReturn,
	MarketplaceSettings,
	MarketplaceWallet,
	OpenIdProvider,
} from './adapters/builder';
export * as Builder from './adapters/builder';
export {
	FilterCondition,
	MarketplaceWalletType,
} from './adapters/builder';

export * as BuilderAPI from './adapters/builder/builder.gen';

export { MarketplaceService } from './adapters/builder/builder.gen';

// (wrapped IndexerClient returns these)
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
// Export wrapped client classes for SDK use

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
	GetOrdersRequest,
	ListCollectibleActivitiesRequest,
	ListCollectibleActivitiesResponse,
	ListCollectibleListingsRequest,
	ListCollectibleListingsResponse,
	ListCollectibleOffersResponse,
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
	MarketplaceContractType, // Marketplace's subset of ContractType (no NATIVE)
	MarketplaceKind,
	MetadataStatus,
	OfferType,
	OrderbookKind,
	OrderSide,
	OrderStatus,
	PropertyType, // Same enum exists in both marketplace and metadata
	type SellStep,
	type SignatureStep,
	SortOrder,
	StepType,
	TransactionCrypto,
	type TransactionStep,
} from './adapters/marketplace';

export { MarketplaceClient } from './adapters/marketplace/client';

export type {
	Asset as MarketplaceAsset,
	ListCollectiblesRequest,
	PostRequest,
	Signature,
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
export * from './utils/bigint';

export * from './utils/chain';
export * from './utils/token';

export * from './utils/type-assertions';

/**
 * Raw API Clients - NOT EXPORTED
 *
 * Previously, we exported SequenceIndexer and SequenceMetadata from this package.
 * This has been removed to prevent accidental use of raw API types.
 *
 * Why removed?
 * - These clients return RAW API types (tokenID: string, chainId: number)
 * - Developers could accidentally use them without adapter transforms
 * - This led to type inconsistencies and required .toString() conversions
 *
 * How to use these clients now:
 * 1. Import directly from their packages (if you REALLY need raw access):
 *    import { SequenceIndexer } from '@0xsequence/indexer';
 *    import { SequenceMetadata } from '@0xsequence/metadata';
 *
 * 2. ALWAYS use with adapter transforms:
 *    import { Indexer, Metadata } from '@0xsequence/marketplace-api';
 *
 *    const client = new SequenceIndexer(url, key);
 *    const args = Indexer.toGetTokenBalancesRequest({ accountAddress: '0x...' });
 *    const raw = await client.getTokenBalances(args);
 *    const normalized = Indexer.toGetTokenBalancesResponse(raw);
 *
 * Recommended: Use the SDK's getIndexerClient() and getMetadataClient() helpers
 * from '@0xsequence/kit' which are internal and should always be paired with adapters.
 */
