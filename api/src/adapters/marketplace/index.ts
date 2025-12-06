/**
 * Marketplace Adapter
 *
 * Provides normalized types and transformation functions for the Marketplace API.
 */

// Export normalized response types from client.ts (with Address and proper types)
export type {
	CheckoutOptionsItem,
	CheckoutOptionsMarketplaceRequest,
	CheckoutOptionsSalesContractRequest,
	CreateReq,
	GenerateBuyTransactionRequest,
	GenerateBuyTransactionResponse,
	GenerateCancelTransactionRequest,
	GenerateCancelTransactionResponse,
	GenerateListingTransactionRequest,
	GenerateListingTransactionResponse,
	GenerateOfferTransactionRequest,
	GenerateOfferTransactionResponse,
	GenerateSellTransactionRequest,
	GenerateSellTransactionResponse,
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
	GetFloorOrderResponse,
	GetHighestPriceOfferForCollectibleRequest,
	GetLowestPriceListingForCollectibleRequest,
	GetOrdersRequest,
	GetOrdersResponse,
	GetPrimarySaleItemRequest,
	GetPrimarySaleItemResponse,
	ListCollectibleActivitiesRequest,
	ListCollectibleListingsResponse,
	ListCollectibleOffersResponse,
	ListCollectiblesRequest,
	ListCollectiblesResponse,
	ListCollectionActivitiesRequest,
	ListCurrenciesRequest,
	ListCurrenciesResponse,
	ListListingsForCollectibleRequest,
	ListListingsForCollectibleResponse,
	ListOffersForCollectibleRequest,
	ListOffersForCollectibleResponse,
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
	ListPrimarySaleItemsRequest,
	ListPrimarySaleItemsResponse,
	OrderData,
} from './client';
export { MarketplaceClient } from './client';

// Export request types and other non-response types from marketplace.gen
export type {
	AdditionalFee,
	CheckoutOptions,
	CheckoutOptionsMarketplaceResponse,
	CheckoutOptionsSalesContractResponse,
	CollectiblesFilter,
	GetCollectibleHighestOfferRequest,
	GetCollectibleHighestOfferResponse,
	GetCollectibleLowestListingRequest,
	GetCollectibleLowestListingResponse,
	GetCountOfListingsForCollectibleResponse,
	GetCountOfOffersForCollectibleResponse,
	GetCountOfPrimarySaleItemsResponse,
	GetOrdersInput,
	ListCollectibleActivitiesResponse,
	ListCollectibleListingsRequest,
	ListCollectionActivitiesResponse,
	OrderFilter,
	OrdersFilter,
	Page,
	PriceFilter,
	PrimarySaleItemsFilter,
	PropertyFilter,
	SortBy,
	WebrpcError,
} from './marketplace.gen';
// Export raw API types under a namespace (re-export from gen for convenience)
export * as MarketplaceAPI from './marketplace.gen';
export {
	CollectionStatus,
	ContractType as MarketplaceContractType,
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
// Re-export normalized types from types.ts (with Address instead of string)
export type { CollectiblePrimarySaleItem, PrimarySaleItem } from './types';

export * from './types';
