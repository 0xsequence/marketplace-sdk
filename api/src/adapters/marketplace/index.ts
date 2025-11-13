/**
 * Marketplace Adapter
 *
 * Provides normalized types and transformation functions for the Marketplace API.
 */

export type {
	CheckoutOptionsItem,
	CheckoutOptionsMarketplaceRequest,
	CheckoutOptionsSalesContractRequest,
	CreateReq, // SDK-facing CreateReq with bigint tokenId
	GenerateBuyTransactionRequest,
	GenerateCancelTransactionRequest,
	GenerateListingTransactionRequest,
	GenerateOfferTransactionRequest,
	GenerateSellTransactionRequest,
	GetCollectibleRequest,
	GetCollectionDetailRequest,
	GetCountOfAllCollectiblesRequest,
	GetCountOfAllOrdersRequest,
	GetCountOfFilteredCollectiblesRequest,
	GetCountOfFilteredOrdersRequest,
	GetCountOfListingsForCollectibleRequest,
	GetCountOfOffersForCollectibleRequest,
	GetCountOfPrimarySaleItemsRequest,
	GetFloorOrderRequest,
	GetHighestPriceOfferForCollectibleRequest,
	GetLowestPriceListingForCollectibleRequest,
	GetOrdersRequest,
	ListCollectibleActivitiesRequest,
	ListCollectiblesRequest,
	ListCollectionActivitiesRequest,
	ListCurrenciesRequest,
	ListListingsForCollectibleRequest,
	ListOffersForCollectibleRequest,
	ListOrdersWithCollectiblesRequest,
	ListPrimarySaleItemsRequest,
	OrderData, // SDK-facing OrderData with bigint quantity
} from './client';
// Export wrapped client and its normalized request types
export { MarketplaceClient } from './client';
// Re-export request/response types that SDK needs (these don't require normalization)
// IMPORTANT: Do NOT re-export types that are shadowed by normalized client types
export type {
	AdditionalFee,
	CheckoutOptions,
	// CheckoutOptionsItem - exported from client.ts with bigint tokenId
	CheckoutOptionsMarketplaceResponse,
	CheckoutOptionsSalesContractResponse,
	CollectiblePrimarySaleItem,
	CollectiblesFilter,
	// CreateReq - exported from client.ts with bigint tokenId
	// OrderData - exported from client.ts with bigint quantity
	// Request types are exported from client.ts with normalized chainId (number)
	// DO NOT export these from gen:
	// - CheckoutOptionsMarketplaceRequest
	// - CheckoutOptionsSalesContractRequest
	// - GenerateCancelTransactionRequest
	// - GenerateListingTransactionRequest
	// - GenerateOfferTransactionRequest
	// - GenerateSellTransactionRequest
	// - GetCollectionDetailRequest
	// - GetCountOfAllCollectiblesRequest
	// - GetCountOfAllOrdersRequest
	// - GetCountOfFilteredCollectiblesRequest
	// - GetCountOfFilteredOrdersRequest
	// - GetCountOfListingsForCollectibleRequest
	// - GetCountOfOffersForCollectibleRequest
	// - GetCountOfPrimarySaleItemsRequest
	// - GetFloorOrderRequest
	// - ListCollectibleActivitiesRequest
	// - ListCollectionActivitiesRequest
	// - ListCurrenciesRequest
	// - ListOffersForCollectibleRequest
	// - ListOrdersWithCollectiblesRequest
	// - ListPrimarySaleItemsRequest
	GetCollectibleHighestOfferRequest,
	GetCollectibleHighestOfferResponse,
	GetCollectibleLowestListingRequest,
	GetCollectibleLowestListingResponse,
	GetCountOfListingsForCollectibleResponse,
	GetCountOfOffersForCollectibleResponse,
	GetCountOfPrimarySaleItemsResponse,
	ListCollectibleActivitiesResponse,
	ListCollectibleListingsRequest,
	ListCollectibleListingsResponse,
	ListCollectibleOffersResponse,
	ListCollectiblesResponse,
	ListCollectionActivitiesResponse,
	ListListingsForCollectibleResponse,
	ListOffersForCollectibleResponse,
	ListOrdersWithCollectiblesResponse,
	ListPrimarySaleItemsResponse,
	OrderFilter,
	OrdersFilter,
	Page,
	PriceFilter,
	PrimarySaleItem,
	PrimarySaleItemsFilter,
	PropertyFilter,
	SortBy,
	// Step - exported from types.ts with better discriminated types
	WebrpcError,
} from './marketplace.gen';
// Export raw API types under a namespace (re-export from gen for convenience)
export * as MarketplaceAPI from './marketplace.gen';
// Re-export enums from generated types for SDK usage (enums are safe to re-export)
export {
	CollectionStatus,
	ContractType as MarketplaceContractType, // Marketplace's subset of ContractType (no NATIVE)
	CurrencyStatus,
	ExecuteType,
	MarketplaceKind,
	MetadataStatus,
	OfferType,
	OrderbookKind,
	OrderSide,
	OrderStatus,
	PropertyType, // Also exists in metadata package, but same values
	SortOrder,
	StepType,
	TransactionCrypto,
} from './marketplace.gen';
// Note: transforms.ts no longer exports functions - all types are already normalized
// Export normalized types FIRST (these are what consumers should use)
export * from './types';
