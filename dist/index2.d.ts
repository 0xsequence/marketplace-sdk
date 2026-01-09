import * as IndexerGen from "@0xsequence/indexer";
import { ContractType, ContractType as ContractType$1, ResourceStatus, SequenceIndexer, TransactionStatus, TransactionType } from "@0xsequence/indexer";
import * as MetadataGen from "@0xsequence/metadata";
import { Filter, PropertyFilter as PropertyFilter$1, SequenceMetadata } from "@0xsequence/metadata";
import { Address, Hash, TypedDataDomain } from "viem";

//#region ../api/dist/builder.gen.d.ts
declare namespace builder_gen_d_exports {
  export { AlreadyCollaboratorError, CollectionFilterSettings$1 as CollectionFilterSettings, EmailTemplateExistsError, FeatureNotIncludedError, Fetch$1 as Fetch, FilterCondition, InvalidArgumentError, InvalidNetworkError, InvalidTierError, InvitationExpiredError, LookupMarketplaceArgs$1 as LookupMarketplaceArgs, LookupMarketplaceReturn, MarketCollection, Marketplace$2 as Marketplace, MarketplacePage$1 as MarketplacePage, MarketplaceService, MarketplaceSettings$1 as MarketplaceSettings, MarketplaceSocials$1 as MarketplaceSocials, MarketplaceWallet$1 as MarketplaceWallet, MarketplaceWalletEcosystem$1 as MarketplaceWalletEcosystem, MarketplaceWalletEmbedded$1 as MarketplaceWalletEmbedded, MarketplaceWalletType, MetadataFilterRule$1 as MetadataFilterRule, MethodNotFoundError, NotFoundError, OpenIdProvider$1 as OpenIdProvider, PermissionDeniedError, ProjectNotFoundError, RequestConflictError, ServiceDisabledError, SessionExpiredError, ShopCollection, SubscriptionLimitError, TimeoutError$1 as TimeoutError, UnauthorizedError, UserNotFoundError, WebrpcBadMethodError, WebrpcBadRequestError, WebrpcBadResponseError, WebrpcBadRouteError, WebrpcClientDisconnectedError, WebrpcEndpointError, WebrpcError, WebrpcErrorCodes, WebrpcHeader, WebrpcHeaderValue, WebrpcInternalErrorError, WebrpcRequestFailedError, WebrpcServerPanicError, WebrpcStreamFinishedError, WebrpcStreamLostError, errors, webrpcErrorByCode };
}
declare const WebrpcHeader = "Webrpc";
declare const WebrpcHeaderValue = "webrpc@v0.26.0;gen-typescript@v0.17.0;sequence-builder@v0.1.0";
declare enum MarketplaceWalletType {
  UNIVERSAL = "UNIVERSAL",
  EMBEDDED = "EMBEDDED",
  ECOSYSTEM = "ECOSYSTEM",
}
declare enum FilterCondition {
  ENTIRE_KEY = "ENTIRE_KEY",
  SPECIFIC_VALUE = "SPECIFIC_VALUE",
}
interface LookupMarketplaceArgs$1 {
  projectId?: number;
  domain?: string;
  userAddress?: string;
}
interface LookupMarketplaceReturn {
  marketplace: Marketplace$2;
  marketCollections: Array<MarketCollection>;
  shopCollections: Array<ShopCollection>;
}
interface Marketplace$2 {
  projectId: number;
  settings: MarketplaceSettings$1;
  market: MarketplacePage$1;
  shop: MarketplacePage$1;
  createdAt?: string;
  updatedAt?: string;
}
interface MarketplaceSettings$1 {
  style: {
    [key: string]: any;
  };
  publisherId: string;
  title: string;
  socials: MarketplaceSocials$1;
  faviconUrl: string;
  walletOptions: MarketplaceWallet$1;
  logoUrl: string;
  fontUrl: string;
  accessKey?: string;
}
interface MarketplacePage$1 {
  enabled: boolean;
  bannerUrl: string;
  ogImage: string;
  private: boolean;
}
interface MarketplaceSocials$1 {
  twitter: string;
  discord: string;
  website: string;
  tiktok: string;
  instagram: string;
  youtube: string;
}
interface MarketplaceWallet$1 {
  walletType: MarketplaceWalletType;
  oidcIssuers: {
    [key: string]: string;
  };
  connectors: Array<string>;
  includeEIP6963Wallets: boolean;
  ecosystem?: MarketplaceWalletEcosystem$1;
  embedded?: MarketplaceWalletEmbedded$1;
}
interface MarketplaceWalletEcosystem$1 {
  walletUrl: string;
  walletAppName: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
}
interface MarketplaceWalletEmbedded$1 {
  tenantKey: string;
  emailEnabled: boolean;
  providers: Array<OpenIdProvider$1>;
}
interface OpenIdProvider$1 {
  iss: string;
  aud: Array<string>;
}
interface MarketCollection {
  id: number;
  projectId: number;
  chainId: number;
  itemsAddress: string;
  contractType: string;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  destinationMarketplace: string;
  filterSettings?: CollectionFilterSettings$1;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface CollectionFilterSettings$1 {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule$1>;
}
interface MetadataFilterRule$1 {
  key: string;
  condition: FilterCondition;
  value?: string;
}
interface ShopCollection {
  id: number;
  projectId: number;
  chainId: number;
  itemsAddress: string;
  saleAddress: string;
  name: string;
  bannerUrl: string;
  tokenIds: Array<string>;
  customTokenIds: Array<string>;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface MarketplaceService {
  /**
   * Public Methods
   */
  lookupMarketplace(args: LookupMarketplaceArgs$1, headers?: object, signal?: AbortSignal): Promise<LookupMarketplaceReturn>;
}
declare class WebrpcError extends Error {
  name: string;
  code: number;
  message: string;
  status: number;
  cause?: string;
  /** @deprecated Use message instead of msg. Deprecated in webrpc v0.11.0. */
  msg: string;
  constructor(name: string, code: number, message: string, status: number, cause?: string);
  static new(payload: any): WebrpcError;
}
declare class WebrpcEndpointError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcRequestFailedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcBadRouteError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcBadMethodError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcBadRequestError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcBadResponseError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcServerPanicError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcInternalErrorError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcClientDisconnectedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcStreamLostError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class WebrpcStreamFinishedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class UnauthorizedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class PermissionDeniedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class SessionExpiredError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class MethodNotFoundError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class RequestConflictError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class ServiceDisabledError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class TimeoutError$1 extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class InvalidArgumentError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class NotFoundError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class UserNotFoundError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class ProjectNotFoundError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class InvalidTierError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class EmailTemplateExistsError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class SubscriptionLimitError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class FeatureNotIncludedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class InvalidNetworkError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class InvitationExpiredError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class AlreadyCollaboratorError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare enum errors {
  WebrpcEndpoint = "WebrpcEndpoint",
  WebrpcRequestFailed = "WebrpcRequestFailed",
  WebrpcBadRoute = "WebrpcBadRoute",
  WebrpcBadMethod = "WebrpcBadMethod",
  WebrpcBadRequest = "WebrpcBadRequest",
  WebrpcBadResponse = "WebrpcBadResponse",
  WebrpcServerPanic = "WebrpcServerPanic",
  WebrpcInternalError = "WebrpcInternalError",
  WebrpcClientDisconnected = "WebrpcClientDisconnected",
  WebrpcStreamLost = "WebrpcStreamLost",
  WebrpcStreamFinished = "WebrpcStreamFinished",
  Unauthorized = "Unauthorized",
  PermissionDenied = "PermissionDenied",
  SessionExpired = "SessionExpired",
  MethodNotFound = "MethodNotFound",
  RequestConflict = "RequestConflict",
  ServiceDisabled = "ServiceDisabled",
  Timeout = "Timeout",
  InvalidArgument = "InvalidArgument",
  NotFound = "NotFound",
  UserNotFound = "UserNotFound",
  ProjectNotFound = "ProjectNotFound",
  InvalidTier = "InvalidTier",
  EmailTemplateExists = "EmailTemplateExists",
  SubscriptionLimit = "SubscriptionLimit",
  FeatureNotIncluded = "FeatureNotIncluded",
  InvalidNetwork = "InvalidNetwork",
  InvitationExpired = "InvitationExpired",
  AlreadyCollaborator = "AlreadyCollaborator",
}
declare enum WebrpcErrorCodes {
  WebrpcEndpoint = 0,
  WebrpcRequestFailed = -1,
  WebrpcBadRoute = -2,
  WebrpcBadMethod = -3,
  WebrpcBadRequest = -4,
  WebrpcBadResponse = -5,
  WebrpcServerPanic = -6,
  WebrpcInternalError = -7,
  WebrpcClientDisconnected = -8,
  WebrpcStreamLost = -9,
  WebrpcStreamFinished = -10,
  Unauthorized = 1000,
  PermissionDenied = 1001,
  SessionExpired = 1002,
  MethodNotFound = 1003,
  RequestConflict = 1004,
  ServiceDisabled = 1005,
  Timeout = 2000,
  InvalidArgument = 2001,
  NotFound = 3000,
  UserNotFound = 3001,
  ProjectNotFound = 3002,
  InvalidTier = 3003,
  EmailTemplateExists = 3004,
  SubscriptionLimit = 3005,
  FeatureNotIncluded = 3006,
  InvalidNetwork = 3007,
  InvitationExpired = 4000,
  AlreadyCollaborator = 4001,
}
declare const webrpcErrorByCode: {
  [code: number]: any;
};
type Fetch$1 = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
declare class MarketplaceService {
  protected hostname: string;
  protected fetch: Fetch$1;
  protected path: string;
  constructor(hostname: string, fetch: Fetch$1);
  private url;
  lookupMarketplace: (args: LookupMarketplaceArgs$1, headers?: object, signal?: AbortSignal) => Promise<LookupMarketplaceReturn>;
}
//#endregion
//#endregion
//#region ../api/dist/marketplace.gen.d.ts
interface MarketplaceClient$1 {
  listCurrencies(req: ListCurrenciesRequest, headers?: object, signal?: AbortSignal): Promise<ListCurrenciesResponse>;
  getCollectionDetail(req: GetCollectionDetailRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectionDetailResponse>;
  getCollectionActiveListingsCurrencies(req: GetCollectionActiveListingsCurrenciesRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectionActiveListingsCurrenciesResponse>;
  getCollectionActiveOffersCurrencies(req: GetCollectionActiveOffersCurrenciesRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectionActiveOffersCurrenciesResponse>;
  getCollectible(req: GetCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectibleResponse>;
  getLowestPriceOfferForCollectible(req: GetLowestPriceOfferForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetLowestPriceOfferForCollectibleResponse>;
  getHighestPriceOfferForCollectible(req: GetHighestPriceOfferForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetHighestPriceOfferForCollectibleResponse>;
  getLowestPriceListingForCollectible(req: GetLowestPriceListingForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetLowestPriceListingForCollectibleResponse>;
  getHighestPriceListingForCollectible(req: GetHighestPriceListingForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetHighestPriceListingForCollectibleResponse>;
  listListingsForCollectible(req: ListListingsForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<ListListingsForCollectibleResponse>;
  listOffersForCollectible(req: ListOffersForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<ListOffersForCollectibleResponse>;
  listOrdersWithCollectibles(req: ListOrdersWithCollectiblesRequest, headers?: object, signal?: AbortSignal): Promise<ListOrdersWithCollectiblesResponse>;
  getCountOfAllOrders(req: GetCountOfAllOrdersRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfAllOrdersResponse>;
  getCountOfFilteredOrders(req: GetCountOfFilteredOrdersRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfFilteredOrdersResponse>;
  listListings(req: ListListingsRequest, headers?: object, signal?: AbortSignal): Promise<ListListingsResponse>;
  listOffers(req: ListOffersRequest, headers?: object, signal?: AbortSignal): Promise<ListOffersResponse>;
  getCountOfListingsForCollectible(req: GetCountOfListingsForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfListingsForCollectibleResponse>;
  getCountOfOffersForCollectible(req: GetCountOfOffersForCollectibleRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfOffersForCollectibleResponse>;
  /**
   * @deprecated Please use GetLowestPriceOfferForCollectible instead.
   */
  getCollectibleLowestOffer(req: GetCollectibleLowestOfferRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestOfferResponse>;
  /**
   * @deprecated Please use GetHighestPriceOfferForCollectible instead.
   */
  getCollectibleHighestOffer(req: GetCollectibleHighestOfferRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestOfferResponse>;
  /**
   * @deprecated Please use GetLowestPriceListingForCollectible instead.
   */
  getCollectibleLowestListing(req: GetCollectibleLowestListingRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestListingResponse>;
  /**
   * @deprecated Please use GetHighestPriceListingForCollectible instead.
   */
  getCollectibleHighestListing(req: GetCollectibleHighestListingRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestListingResponse>;
  /**
   * @deprecated Please use ListListingsForCollectible instead.
   */
  listCollectibleListings(req: ListCollectibleListingsRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectibleListingsResponse$1>;
  /**
   * @deprecated Please use ListOffersForCollectible instead.
   */
  listCollectibleOffers(req: ListCollectibleOffersRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectibleOffersResponse$1>;
  /**
   * checkout process
   */
  generateBuyTransaction(req: GenerateBuyTransactionRequest, headers?: object, signal?: AbortSignal): Promise<GenerateBuyTransactionResponse>;
  generateSellTransaction(req: GenerateSellTransactionRequest, headers?: object, signal?: AbortSignal): Promise<GenerateSellTransactionResponse>;
  generateListingTransaction(req: GenerateListingTransactionRequest, headers?: object, signal?: AbortSignal): Promise<GenerateListingTransactionResponse>;
  generateOfferTransaction(req: GenerateOfferTransactionRequest, headers?: object, signal?: AbortSignal): Promise<GenerateOfferTransactionResponse>;
  generateCancelTransaction(req: GenerateCancelTransactionRequest, headers?: object, signal?: AbortSignal): Promise<GenerateCancelTransactionResponse>;
  /**
   * only used in a case of external transactions ( when we create off-chain transactions ) for instance opensea market, use only ExecuteInput params and leave other root inputs empty, they are depracated and kept only for backward compatibility
   */
  execute(req: ExecuteRequest, headers?: object, signal?: AbortSignal): Promise<ExecuteResponse>;
  /**
   * list of collectibles with best order for each collectible, by default this only returns collectibles with an order
   */
  listCollectibles(req: ListCollectiblesRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesResponse>;
  getCountOfAllCollectibles(req: GetCountOfAllCollectiblesRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfAllCollectiblesResponse>;
  getCountOfFilteredCollectibles(req: GetCountOfFilteredCollectiblesRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfFilteredCollectiblesResponse>;
  getFloorOrder(req: GetFloorOrderRequest, headers?: object, signal?: AbortSignal): Promise<GetFloorOrderResponse>;
  /**
   * Not Implemented
   */
  listCollectionActivities(req: ListCollectionActivitiesRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectionActivitiesResponse>;
  /**
   * Not Implemented
   */
  listCollectibleActivities(req: ListCollectibleActivitiesRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectibleActivitiesResponse>;
  listCollectiblesWithLowestListing(req: ListCollectiblesWithLowestListingRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithLowestListingResponse>;
  listCollectiblesWithHighestOffer(req: ListCollectiblesWithHighestOfferRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithHighestOfferResponse>;
  syncOrder(req: SyncOrderRequest, headers?: object, signal?: AbortSignal): Promise<SyncOrderResponse>;
  syncOrders(req: SyncOrdersRequest, headers?: object, signal?: AbortSignal): Promise<SyncOrdersResponse>;
  getOrders(req: GetOrdersRequest, headers?: object, signal?: AbortSignal): Promise<GetOrdersResponse>;
  checkoutOptionsMarketplace(req: CheckoutOptionsMarketplaceRequest, headers?: object, signal?: AbortSignal): Promise<CheckoutOptionsMarketplaceResponse>;
  checkoutOptionsSalesContract(req: CheckoutOptionsSalesContractRequest, headers?: object, signal?: AbortSignal): Promise<CheckoutOptionsSalesContractResponse>;
  supportedMarketplaces(req: SupportedMarketplacesRequest, headers?: object, signal?: AbortSignal): Promise<SupportedMarketplacesResponse>;
  getPrimarySaleItem(req: GetPrimarySaleItemRequest, headers?: object, signal?: AbortSignal): Promise<GetPrimarySaleItemResponse>;
  listPrimarySaleItems(req: ListPrimarySaleItemsRequest, headers?: object, signal?: AbortSignal): Promise<ListPrimarySaleItemsResponse>;
  getCountOfPrimarySaleItems(req: GetCountOfPrimarySaleItemsRequest, headers?: object, signal?: AbortSignal): Promise<GetCountOfPrimarySaleItemsResponse>;
}
declare enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
declare enum PropertyType {
  INT = "INT",
  STRING = "STRING",
  ARRAY = "ARRAY",
  GENERIC = "GENERIC",
}
declare enum MarketplaceKind {
  unknown = "unknown",
  sequence_marketplace_v1 = "sequence_marketplace_v1",
  sequence_marketplace_v2 = "sequence_marketplace_v2",
  blur = "blur",
  zerox = "zerox",
  opensea = "opensea",
  looks_rare = "looks_rare",
  x2y2 = "x2y2",
  alienswap = "alienswap",
  payment_processor = "payment_processor",
  mintify = "mintify",
  magic_eden = "magic_eden",
}
declare enum OrderbookKind {
  unknown = "unknown",
  sequence_marketplace_v1 = "sequence_marketplace_v1",
  sequence_marketplace_v2 = "sequence_marketplace_v2",
  blur = "blur",
  opensea = "opensea",
  looks_rare = "looks_rare",
  reservoir = "reservoir",
  x2y2 = "x2y2",
  magic_eden = "magic_eden",
}
declare enum OrderSide {
  unknown = "unknown",
  listing = "listing",
  offer = "offer",
}
declare enum OfferType {
  unknown = "unknown",
  item = "item",
  collection = "collection",
}
declare enum OrderStatus {
  unknown = "unknown",
  active = "active",
  inactive = "inactive",
  expired = "expired",
  cancelled = "cancelled",
  filled = "filled",
  decimals_missing = "decimals_missing",
}
declare enum ContractType$2 {
  UNKNOWN = "UNKNOWN",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}
declare enum CollectionPriority {
  unknown = "unknown",
  low = "low",
  normal = "normal",
  high = "high",
}
declare enum CollectionStatus {
  unknown = "unknown",
  created = "created",
  syncing_orders = "syncing_orders",
  active = "active",
  failed = "failed",
  inactive = "inactive",
  incompatible_type = "incompatible_type",
}
declare enum CollectibleStatus {
  unknown = "unknown",
  active = "active",
  inactive = "inactive",
}
declare enum CollectibleSource {
  unknown = "unknown",
  indexer = "indexer",
  manual = "manual",
}
declare enum CurrencyStatus {
  unknown = "unknown",
  created = "created",
  syncing_metadata = "syncing_metadata",
  active = "active",
  failed = "failed",
}
declare enum WalletKind {
  unknown = "unknown",
  sequence = "sequence",
}
declare enum StepType {
  unknown = "unknown",
  tokenApproval = "tokenApproval",
  buy = "buy",
  sell = "sell",
  createListing = "createListing",
  createOffer = "createOffer",
  signEIP712 = "signEIP712",
  signEIP191 = "signEIP191",
  cancel = "cancel",
}
declare enum TransactionCrypto {
  none = "none",
  partially = "partially",
  all = "all",
}
declare enum TransactionNFTCheckoutProvider {
  unknown = "unknown",
  transak = "transak",
  sardine = "sardine",
}
declare enum TransactionOnRampProvider {
  unknown = "unknown",
  transak = "transak",
  sardine = "sardine",
}
declare enum TransactionSwapProvider {
  unknown = "unknown",
  lifi = "lifi",
}
declare enum ExecuteType {
  unknown = "unknown",
  order = "order",
  createListing = "createListing",
  createItemOffer = "createItemOffer",
  createTraitOffer = "createTraitOffer",
}
declare enum ActivityAction {
  unknown = "unknown",
  listing = "listing",
  offer = "offer",
  mint = "mint",
  sale = "sale",
  listingCancel = "listingCancel",
  offerCancel = "offerCancel",
  transfer = "transfer",
}
declare enum PrimarySaleItemDetailType {
  unknown = "unknown",
  global = "global",
  individual = "individual",
}
declare enum MetadataStatus {
  NOT_AVAILABLE = "NOT_AVAILABLE",
  REFRESHING = "REFRESHING",
  AVAILABLE = "AVAILABLE",
}
interface Page {
  page: number;
  pageSize: number;
  more?: boolean;
  sort?: Array<SortBy>;
}
interface SortBy {
  column: string;
  order: SortOrder;
}
interface PropertyFilter {
  name: string;
  type: PropertyType;
  min?: number;
  max?: number;
  values?: Array<any>;
}
interface CollectiblesFilter {
  includeEmpty: boolean;
  searchText?: string;
  properties?: Array<PropertyFilter>;
  marketplaces?: Array<MarketplaceKind>;
  inAccounts?: Array<string>;
  notInAccounts?: Array<string>;
  ordersCreatedBy?: Array<string>;
  ordersNotCreatedBy?: Array<string>;
  inCurrencyAddresses?: Array<string>;
  notInCurrencyAddresses?: Array<string>;
  prices?: Array<PriceFilter>;
}
interface OrdersFilter {
  searchText?: string;
  properties?: Array<PropertyFilter>;
  marketplaces?: Array<MarketplaceKind>;
  inAccounts?: Array<string>;
  notInAccounts?: Array<string>;
  ordersCreatedBy?: Array<string>;
  ordersNotCreatedBy?: Array<string>;
  inCurrencyAddresses?: Array<string>;
  notInCurrencyAddresses?: Array<string>;
  prices?: Array<PriceFilter>;
}
interface PriceFilter {
  contractAddress: string;
  min?: bigint;
  max?: bigint;
}
interface Order {
  orderId: string;
  marketplace: MarketplaceKind;
  side: OrderSide;
  status: OrderStatus;
  chainId: number;
  originName: string;
  slug: string;
  collectionContractAddress: string;
  tokenId?: bigint;
  createdBy: string;
  priceAmount: bigint;
  priceAmountFormatted: string;
  priceAmountNet: bigint;
  priceAmountNetFormatted: string;
  priceCurrencyAddress: string;
  priceDecimals: number;
  priceUSD: number;
  priceUSDFormatted: string;
  quantityInitial: bigint;
  quantityInitialFormatted: string;
  quantityRemaining: bigint;
  quantityRemainingFormatted: string;
  quantityAvailable: bigint;
  quantityAvailableFormatted: string;
  quantityDecimals: number;
  feeBps: number;
  feeBreakdown: Array<FeeBreakdown>;
  validFrom: string;
  validUntil: string;
  blockNumber: number;
  orderCreatedAt?: string;
  orderUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface FeeBreakdown {
  kind: string;
  recipientAddress: string;
  bps: number;
}
interface CollectibleOrder {
  metadata: TokenMetadata;
  order?: Order;
  listing?: Order;
  offer?: Order;
}
interface OrderFilter {
  createdBy?: Array<string>;
  marketplace?: Array<MarketplaceKind>;
  currencies?: Array<string>;
}
interface Collection {
  status: CollectionStatus;
  chainId: number;
  contractAddress: string;
  contractType: ContractType$2;
  priority: CollectionPriority;
  tokenQuantityDecimals: number;
  config: CollectionConfig;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface CollectionConfig {
  lastSynced: {
    [key: string]: CollectionLastSynced;
  };
  collectiblesSynced: string;
  activitiesSynced: string;
  activitiesSyncedContinuity: string;
}
interface CollectionLastSynced {
  allOrders: string;
  newOrders: string;
  names: Array<string>;
  cursors: {
    [key: string]: string;
  };
}
interface Collectible {
  status: CollectibleStatus;
  tokenId: bigint;
  decimals: number;
  source: CollectibleSource;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface Currency {
  chainId: number;
  contractAddress: string;
  status: CurrencyStatus;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
  exchangeRate: number;
  defaultChainCurrency: boolean;
  nativeCurrency: boolean;
  openseaListing: boolean;
  openseaOffer: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface OrderData$1 {
  orderId: string;
  quantity: bigint;
  tokenId?: bigint;
}
interface AdditionalFee {
  amount: bigint;
  receiver: string;
}
interface Step {
  id: StepType;
  data: string;
  to: string;
  value: bigint;
  price: bigint;
  signature?: Signature;
  post?: PostRequest;
  executeType?: ExecuteType;
}
interface PostRequest {
  endpoint: string;
  method: string;
  body: any;
}
interface CreateReq$1 {
  tokenId: bigint;
  quantity: bigint;
  expiry: string;
  currencyAddress: string;
  pricePerToken: bigint;
}
interface GetOrdersInput {
  contractAddress: string;
  orderId: string;
  marketplace: MarketplaceKind;
}
interface Signature {
  domain: Domain;
  types: any;
  primaryType: string;
  value: any;
}
interface Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}
interface GenerateBuySellTransactionResponse {
  steps: Array<Step>;
  canBeUsedWithTrails: boolean;
}
interface CheckoutOptionsMarketplaceOrder {
  contractAddress: string;
  orderId: string;
  marketplace: MarketplaceKind;
}
interface CheckoutOptionsItem$1 {
  tokenId: bigint;
  quantity: bigint;
}
interface CheckoutOptions {
  crypto: TransactionCrypto;
  swap: Array<TransactionSwapProvider>;
  nftCheckout: Array<TransactionNFTCheckoutProvider>;
  onRamp: Array<TransactionOnRampProvider>;
}
interface ExecuteInput {
  chainId: string;
  signature: string;
  method: string;
  endpoint: string;
  executeType: ExecuteType;
  body: any;
  slug?: string;
}
interface Activity {
  chainId: number;
  contractAddress: string;
  tokenId: bigint;
  action: ActivityAction;
  txHash: string;
  from: string;
  to?: string;
  quantity: bigint;
  quantityDecimals: number;
  priceAmount?: bigint;
  priceAmountFormatted?: string;
  priceCurrencyAddress?: string;
  priceDecimals?: number;
  activityCreatedAt: string;
  uniqueHash: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface PrimarySaleItem {
  itemAddress: string;
  contractType: ContractType$2;
  tokenId: bigint;
  itemType: PrimarySaleItemDetailType;
  startDate: string;
  endDate: string;
  currencyAddress: string;
  priceDecimals: number;
  priceAmount: bigint;
  priceAmountFormatted: string;
  priceUsd: number;
  priceUsdFormatted: string;
  supply: bigint;
  supplyCap: bigint;
  unlimitedSupply: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface CollectiblePrimarySaleItem {
  metadata: TokenMetadata;
  primarySaleItem: PrimarySaleItem;
}
interface PrimarySaleItemsFilter {
  includeEmpty: boolean;
  searchText?: string;
  properties?: Array<PropertyFilter>;
  detailTypes?: Array<PrimarySaleItemDetailType>;
  startDateAfter?: string;
  startDateBefore?: string;
  endDateAfter?: string;
  endDateBefore?: string;
}
interface TokenMetadata {
  tokenId: bigint;
  name: string;
  description?: string;
  image?: string;
  video?: string;
  audio?: string;
  properties?: {
    [key: string]: any;
  };
  attributes: Array<{
    [key: string]: any;
  }>;
  image_data?: string;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
  decimals?: number;
  updatedAt?: string;
  assets?: Array<Asset>;
  status: MetadataStatus;
}
interface Asset {
  id: number;
  collectionId: number;
  tokenId: bigint;
  url?: string;
  metadataField: string;
  name?: string;
  filesize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  updatedAt?: string;
}
interface ListCurrenciesRequest {
  chainId: string;
}
interface ListCurrenciesResponse {
  currencies: Array<Currency>;
}
interface ListCurrenciesRequest {
  chainId: string;
}
interface ListCurrenciesResponse {
  currencies: Array<Currency>;
}
interface GetCollectionDetailRequest {
  chainId: string;
  contractAddress: string;
}
interface GetCollectionDetailResponse {
  collection: Collection;
}
interface GetCollectionActiveListingsCurrenciesRequest {
  chainId: string;
  contractAddress: string;
}
interface GetCollectionActiveListingsCurrenciesResponse {
  currencies: Array<Currency>;
}
interface GetCollectionActiveOffersCurrenciesRequest {
  chainId: string;
  contractAddress: string;
}
interface GetCollectionActiveOffersCurrenciesResponse {
  currencies: Array<Currency>;
}
interface GetCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
}
interface GetCollectibleResponse {
  metadata: TokenMetadata;
}
interface GetLowestPriceOfferForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetLowestPriceOfferForCollectibleResponse {
  order: Order;
}
interface GetHighestPriceOfferForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetHighestPriceOfferForCollectibleResponse {
  order: Order;
}
interface GetLowestPriceListingForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetLowestPriceListingForCollectibleResponse {
  order: Order;
}
interface GetHighestPriceListingForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetHighestPriceListingForCollectibleResponse {
  order: Order;
}
interface ListListingsForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
  page?: Page;
}
interface ListListingsForCollectibleResponse {
  listings: Array<Order>;
  page?: Page;
}
interface ListOffersForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
  page?: Page;
}
interface ListOffersForCollectibleResponse {
  offers: Array<Order>;
  page?: Page;
}
interface ListOrdersWithCollectiblesRequest {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: OrdersFilter;
  page?: Page;
}
interface ListOrdersWithCollectiblesResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
}
interface GetCountOfAllOrdersRequest {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
}
interface GetCountOfAllOrdersResponse {
  count: number;
}
interface GetCountOfFilteredOrdersRequest {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: OrdersFilter;
}
interface GetCountOfFilteredOrdersResponse {
  count: number;
}
interface ListListingsRequest {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page;
}
interface ListListingsResponse {
  listings: Array<Order>;
  page?: Page;
}
interface ListOffersRequest {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page;
}
interface ListOffersResponse {
  offers: Array<Order>;
  page?: Page;
}
interface GetCountOfListingsForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetCountOfListingsForCollectibleResponse {
  count: number;
}
interface GetCountOfOffersForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetCountOfOffersForCollectibleResponse {
  count: number;
}
interface GetCollectibleLowestOfferRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetCollectibleLowestOfferResponse {
  order?: Order;
}
interface GetCollectibleHighestOfferRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetCollectibleHighestOfferResponse {
  order?: Order;
}
interface GetCollectibleLowestListingRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetCollectibleLowestListingResponse {
  order?: Order;
}
interface GetCollectibleHighestListingRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
}
interface GetCollectibleHighestListingResponse {
  order?: Order;
}
interface ListCollectibleListingsRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
  page?: Page;
}
interface ListCollectibleListingsResponse$1 {
  listings: Array<Order>;
  page?: Page;
}
interface ListCollectibleOffersRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
  page?: Page;
}
interface ListCollectibleOffersResponse$1 {
  offers: Array<Order>;
  page?: Page;
}
interface GenerateBuyTransactionRequest {
  chainId: string;
  collectionAddress: string;
  buyer: string;
  marketplace: MarketplaceKind;
  ordersData: Array<OrderData$1>;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
  useWithTrails: boolean;
}
interface GenerateBuyTransactionResponse {
  resp?: GenerateBuySellTransactionResponse;
  steps: Array<Step>;
}
interface GenerateSellTransactionRequest {
  chainId: string;
  collectionAddress: string;
  seller: string;
  marketplace: MarketplaceKind;
  ordersData: Array<OrderData$1>;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
  useWithTrails: boolean;
}
interface GenerateSellTransactionResponse {
  resp?: GenerateBuySellTransactionResponse;
  steps: Array<Step>;
}
interface GenerateListingTransactionRequest {
  chainId: string;
  collectionAddress: string;
  owner: string;
  contractType: ContractType$2;
  orderbook: OrderbookKind;
  listing: CreateReq$1;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
}
interface GenerateListingTransactionResponse {
  steps: Array<Step>;
}
interface GenerateOfferTransactionRequest {
  chainId: string;
  collectionAddress: string;
  maker: string;
  contractType: ContractType$2;
  orderbook: OrderbookKind;
  offer: CreateReq$1;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
  offerType: OfferType;
}
interface GenerateOfferTransactionResponse {
  steps: Array<Step>;
}
interface GenerateCancelTransactionRequest {
  chainId: string;
  collectionAddress: string;
  maker: string;
  marketplace: MarketplaceKind;
  orderId: string;
}
interface GenerateCancelTransactionResponse {
  steps: Array<Step>;
}
interface ExecuteRequest {
  params: ExecuteInput;
  chainId?: string;
  signature?: string;
  method?: string;
  endpoint?: string;
  executeType?: ExecuteType;
  body?: any;
}
interface ExecuteResponse {
  orderId: string;
}
interface ListCollectiblesRequest {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page;
}
interface ListCollectiblesResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
}
interface GetCountOfAllCollectiblesRequest {
  chainId: string;
  contractAddress: string;
}
interface GetCountOfAllCollectiblesResponse {
  count: number;
}
interface GetCountOfFilteredCollectiblesRequest {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: CollectiblesFilter;
}
interface GetCountOfFilteredCollectiblesResponse {
  count: number;
}
interface GetFloorOrderRequest {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
}
interface GetFloorOrderResponse {
  collectible: CollectibleOrder;
}
interface ListCollectionActivitiesRequest {
  chainId: string;
  contractAddress: string;
  page?: Page;
}
interface ListCollectionActivitiesResponse {
  activities: Array<Activity>;
  page?: Page;
}
interface ListCollectibleActivitiesRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  page?: Page;
}
interface ListCollectibleActivitiesResponse {
  activities: Array<Activity>;
  page?: Page;
}
interface ListCollectiblesWithLowestListingRequest {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page;
}
interface ListCollectiblesWithLowestListingResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
}
interface ListCollectiblesWithHighestOfferRequest {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page;
}
interface ListCollectiblesWithHighestOfferResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
}
interface SyncOrderRequest {
  chainId: string;
  order: Order;
}
interface SyncOrderResponse {}
interface SyncOrdersRequest {
  chainId: string;
  orders: Array<Order>;
}
interface SyncOrdersResponse {}
interface GetOrdersRequest {
  chainId: string;
  input: Array<GetOrdersInput>;
  page?: Page;
}
interface GetOrdersResponse {
  orders: Array<Order>;
  page?: Page;
}
interface CheckoutOptionsMarketplaceRequest {
  chainId: string;
  wallet: string;
  orders: Array<CheckoutOptionsMarketplaceOrder>;
  additionalFee: number;
}
interface CheckoutOptionsMarketplaceResponse {
  options: CheckoutOptions;
}
interface CheckoutOptionsSalesContractRequest {
  chainId: string;
  wallet: string;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem$1>;
}
interface CheckoutOptionsSalesContractResponse {
  options: CheckoutOptions;
}
interface SupportedMarketplacesRequest {
  chainId: string;
}
interface SupportedMarketplacesResponse {
  marketplaces: Array<MarketplaceKind>;
}
interface GetPrimarySaleItemRequest {
  chainId: string;
  primarySaleContractAddress: string;
  tokenId: bigint;
}
interface GetPrimarySaleItemResponse {
  item: CollectiblePrimarySaleItem;
}
interface ListPrimarySaleItemsRequest {
  chainId: string;
  primarySaleContractAddress: string;
  filter?: PrimarySaleItemsFilter;
  page?: Page;
}
interface ListPrimarySaleItemsResponse {
  primarySaleItems: Array<CollectiblePrimarySaleItem>;
  page?: Page;
}
interface GetCountOfPrimarySaleItemsRequest {
  chainId: string;
  primarySaleContractAddress: string;
  filter?: PrimarySaleItemsFilter;
}
interface GetCountOfPrimarySaleItemsResponse {
  count: number;
}
declare class Marketplace implements MarketplaceClient$1 {
  protected hostname: string;
  protected fetch: Fetch;
  protected path: string;
  constructor(hostname: string, fetch: Fetch);
  private url;
  queryKey: {
    listCurrencies: (req: ListCurrenciesRequest) => readonly ["Marketplace", "listCurrencies", ListCurrenciesRequest];
    getCollectionDetail: (req: GetCollectionDetailRequest) => readonly ["Marketplace", "getCollectionDetail", GetCollectionDetailRequest];
    getCollectionActiveListingsCurrencies: (req: GetCollectionActiveListingsCurrenciesRequest) => readonly ["Marketplace", "getCollectionActiveListingsCurrencies", GetCollectionActiveListingsCurrenciesRequest];
    getCollectionActiveOffersCurrencies: (req: GetCollectionActiveOffersCurrenciesRequest) => readonly ["Marketplace", "getCollectionActiveOffersCurrencies", GetCollectionActiveOffersCurrenciesRequest];
    getCollectible: (req: GetCollectibleRequest) => readonly ["Marketplace", "getCollectible", GetCollectibleRequest];
    getLowestPriceOfferForCollectible: (req: GetLowestPriceOfferForCollectibleRequest) => readonly ["Marketplace", "getLowestPriceOfferForCollectible", GetLowestPriceOfferForCollectibleRequest];
    getHighestPriceOfferForCollectible: (req: GetHighestPriceOfferForCollectibleRequest) => readonly ["Marketplace", "getHighestPriceOfferForCollectible", GetHighestPriceOfferForCollectibleRequest];
    getLowestPriceListingForCollectible: (req: GetLowestPriceListingForCollectibleRequest) => readonly ["Marketplace", "getLowestPriceListingForCollectible", GetLowestPriceListingForCollectibleRequest];
    getHighestPriceListingForCollectible: (req: GetHighestPriceListingForCollectibleRequest) => readonly ["Marketplace", "getHighestPriceListingForCollectible", GetHighestPriceListingForCollectibleRequest];
    listListingsForCollectible: (req: ListListingsForCollectibleRequest) => readonly ["Marketplace", "listListingsForCollectible", ListListingsForCollectibleRequest];
    listOffersForCollectible: (req: ListOffersForCollectibleRequest) => readonly ["Marketplace", "listOffersForCollectible", ListOffersForCollectibleRequest];
    listOrdersWithCollectibles: (req: ListOrdersWithCollectiblesRequest) => readonly ["Marketplace", "listOrdersWithCollectibles", ListOrdersWithCollectiblesRequest];
    getCountOfAllOrders: (req: GetCountOfAllOrdersRequest) => readonly ["Marketplace", "getCountOfAllOrders", GetCountOfAllOrdersRequest];
    getCountOfFilteredOrders: (req: GetCountOfFilteredOrdersRequest) => readonly ["Marketplace", "getCountOfFilteredOrders", GetCountOfFilteredOrdersRequest];
    listListings: (req: ListListingsRequest) => readonly ["Marketplace", "listListings", ListListingsRequest];
    listOffers: (req: ListOffersRequest) => readonly ["Marketplace", "listOffers", ListOffersRequest];
    getCountOfListingsForCollectible: (req: GetCountOfListingsForCollectibleRequest) => readonly ["Marketplace", "getCountOfListingsForCollectible", GetCountOfListingsForCollectibleRequest];
    getCountOfOffersForCollectible: (req: GetCountOfOffersForCollectibleRequest) => readonly ["Marketplace", "getCountOfOffersForCollectible", GetCountOfOffersForCollectibleRequest];
    getCollectibleLowestOffer: (req: GetCollectibleLowestOfferRequest) => readonly ["Marketplace", "getCollectibleLowestOffer", GetCollectibleLowestOfferRequest];
    getCollectibleHighestOffer: (req: GetCollectibleHighestOfferRequest) => readonly ["Marketplace", "getCollectibleHighestOffer", GetCollectibleHighestOfferRequest];
    getCollectibleLowestListing: (req: GetCollectibleLowestListingRequest) => readonly ["Marketplace", "getCollectibleLowestListing", GetCollectibleLowestListingRequest];
    getCollectibleHighestListing: (req: GetCollectibleHighestListingRequest) => readonly ["Marketplace", "getCollectibleHighestListing", GetCollectibleHighestListingRequest];
    listCollectibleListings: (req: ListCollectibleListingsRequest) => readonly ["Marketplace", "listCollectibleListings", ListCollectibleListingsRequest];
    listCollectibleOffers: (req: ListCollectibleOffersRequest) => readonly ["Marketplace", "listCollectibleOffers", ListCollectibleOffersRequest];
    generateBuyTransaction: (req: GenerateBuyTransactionRequest) => readonly ["Marketplace", "generateBuyTransaction", GenerateBuyTransactionRequest];
    generateSellTransaction: (req: GenerateSellTransactionRequest) => readonly ["Marketplace", "generateSellTransaction", GenerateSellTransactionRequest];
    generateListingTransaction: (req: GenerateListingTransactionRequest) => readonly ["Marketplace", "generateListingTransaction", GenerateListingTransactionRequest];
    generateOfferTransaction: (req: GenerateOfferTransactionRequest) => readonly ["Marketplace", "generateOfferTransaction", GenerateOfferTransactionRequest];
    generateCancelTransaction: (req: GenerateCancelTransactionRequest) => readonly ["Marketplace", "generateCancelTransaction", GenerateCancelTransactionRequest];
    execute: (req: ExecuteRequest) => readonly ["Marketplace", "execute", ExecuteRequest];
    listCollectibles: (req: ListCollectiblesRequest) => readonly ["Marketplace", "listCollectibles", ListCollectiblesRequest];
    getCountOfAllCollectibles: (req: GetCountOfAllCollectiblesRequest) => readonly ["Marketplace", "getCountOfAllCollectibles", GetCountOfAllCollectiblesRequest];
    getCountOfFilteredCollectibles: (req: GetCountOfFilteredCollectiblesRequest) => readonly ["Marketplace", "getCountOfFilteredCollectibles", GetCountOfFilteredCollectiblesRequest];
    getFloorOrder: (req: GetFloorOrderRequest) => readonly ["Marketplace", "getFloorOrder", GetFloorOrderRequest];
    listCollectionActivities: (req: ListCollectionActivitiesRequest) => readonly ["Marketplace", "listCollectionActivities", ListCollectionActivitiesRequest];
    listCollectibleActivities: (req: ListCollectibleActivitiesRequest) => readonly ["Marketplace", "listCollectibleActivities", ListCollectibleActivitiesRequest];
    listCollectiblesWithLowestListing: (req: ListCollectiblesWithLowestListingRequest) => readonly ["Marketplace", "listCollectiblesWithLowestListing", ListCollectiblesWithLowestListingRequest];
    listCollectiblesWithHighestOffer: (req: ListCollectiblesWithHighestOfferRequest) => readonly ["Marketplace", "listCollectiblesWithHighestOffer", ListCollectiblesWithHighestOfferRequest];
    syncOrder: (req: SyncOrderRequest) => readonly ["Marketplace", "syncOrder", SyncOrderRequest];
    syncOrders: (req: SyncOrdersRequest) => readonly ["Marketplace", "syncOrders", SyncOrdersRequest];
    getOrders: (req: GetOrdersRequest) => readonly ["Marketplace", "getOrders", GetOrdersRequest];
    checkoutOptionsMarketplace: (req: CheckoutOptionsMarketplaceRequest) => readonly ["Marketplace", "checkoutOptionsMarketplace", CheckoutOptionsMarketplaceRequest];
    checkoutOptionsSalesContract: (req: CheckoutOptionsSalesContractRequest) => readonly ["Marketplace", "checkoutOptionsSalesContract", CheckoutOptionsSalesContractRequest];
    supportedMarketplaces: (req: SupportedMarketplacesRequest) => readonly ["Marketplace", "supportedMarketplaces", SupportedMarketplacesRequest];
    getPrimarySaleItem: (req: GetPrimarySaleItemRequest) => readonly ["Marketplace", "getPrimarySaleItem", GetPrimarySaleItemRequest];
    listPrimarySaleItems: (req: ListPrimarySaleItemsRequest) => readonly ["Marketplace", "listPrimarySaleItems", ListPrimarySaleItemsRequest];
    getCountOfPrimarySaleItems: (req: GetCountOfPrimarySaleItemsRequest) => readonly ["Marketplace", "getCountOfPrimarySaleItems", GetCountOfPrimarySaleItemsRequest];
  };
  listCurrencies: (req: ListCurrenciesRequest, headers?: object, signal?: AbortSignal) => Promise<ListCurrenciesResponse>;
  getCollectionDetail: (req: GetCollectionDetailRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectionDetailResponse>;
  getCollectionActiveListingsCurrencies: (req: GetCollectionActiveListingsCurrenciesRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectionActiveListingsCurrenciesResponse>;
  getCollectionActiveOffersCurrencies: (req: GetCollectionActiveOffersCurrenciesRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectionActiveOffersCurrenciesResponse>;
  getCollectible: (req: GetCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleResponse>;
  getLowestPriceOfferForCollectible: (req: GetLowestPriceOfferForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetLowestPriceOfferForCollectibleResponse>;
  getHighestPriceOfferForCollectible: (req: GetHighestPriceOfferForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetHighestPriceOfferForCollectibleResponse>;
  getLowestPriceListingForCollectible: (req: GetLowestPriceListingForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetLowestPriceListingForCollectibleResponse>;
  getHighestPriceListingForCollectible: (req: GetHighestPriceListingForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetHighestPriceListingForCollectibleResponse>;
  listListingsForCollectible: (req: ListListingsForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<ListListingsForCollectibleResponse>;
  listOffersForCollectible: (req: ListOffersForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<ListOffersForCollectibleResponse>;
  listOrdersWithCollectibles: (req: ListOrdersWithCollectiblesRequest, headers?: object, signal?: AbortSignal) => Promise<ListOrdersWithCollectiblesResponse>;
  getCountOfAllOrders: (req: GetCountOfAllOrdersRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfAllOrdersResponse>;
  getCountOfFilteredOrders: (req: GetCountOfFilteredOrdersRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfFilteredOrdersResponse>;
  listListings: (req: ListListingsRequest, headers?: object, signal?: AbortSignal) => Promise<ListListingsResponse>;
  listOffers: (req: ListOffersRequest, headers?: object, signal?: AbortSignal) => Promise<ListOffersResponse>;
  getCountOfListingsForCollectible: (req: GetCountOfListingsForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfListingsForCollectibleResponse>;
  getCountOfOffersForCollectible: (req: GetCountOfOffersForCollectibleRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfOffersForCollectibleResponse>;
  getCollectibleLowestOffer: (req: GetCollectibleLowestOfferRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleLowestOfferResponse>;
  getCollectibleHighestOffer: (req: GetCollectibleHighestOfferRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleHighestOfferResponse>;
  getCollectibleLowestListing: (req: GetCollectibleLowestListingRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleLowestListingResponse>;
  getCollectibleHighestListing: (req: GetCollectibleHighestListingRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleHighestListingResponse>;
  listCollectibleListings: (req: ListCollectibleListingsRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleListingsResponse$1>;
  listCollectibleOffers: (req: ListCollectibleOffersRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleOffersResponse$1>;
  generateBuyTransaction: (req: GenerateBuyTransactionRequest, headers?: object, signal?: AbortSignal) => Promise<GenerateBuyTransactionResponse>;
  generateSellTransaction: (req: GenerateSellTransactionRequest, headers?: object, signal?: AbortSignal) => Promise<GenerateSellTransactionResponse>;
  generateListingTransaction: (req: GenerateListingTransactionRequest, headers?: object, signal?: AbortSignal) => Promise<GenerateListingTransactionResponse>;
  generateOfferTransaction: (req: GenerateOfferTransactionRequest, headers?: object, signal?: AbortSignal) => Promise<GenerateOfferTransactionResponse>;
  generateCancelTransaction: (req: GenerateCancelTransactionRequest, headers?: object, signal?: AbortSignal) => Promise<GenerateCancelTransactionResponse>;
  execute: (req: ExecuteRequest, headers?: object, signal?: AbortSignal) => Promise<ExecuteResponse>;
  listCollectibles: (req: ListCollectiblesRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectiblesResponse>;
  getCountOfAllCollectibles: (req: GetCountOfAllCollectiblesRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfAllCollectiblesResponse>;
  getCountOfFilteredCollectibles: (req: GetCountOfFilteredCollectiblesRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfFilteredCollectiblesResponse>;
  getFloorOrder: (req: GetFloorOrderRequest, headers?: object, signal?: AbortSignal) => Promise<GetFloorOrderResponse>;
  listCollectionActivities: (req: ListCollectionActivitiesRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectionActivitiesResponse>;
  listCollectibleActivities: (req: ListCollectibleActivitiesRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleActivitiesResponse>;
  listCollectiblesWithLowestListing: (req: ListCollectiblesWithLowestListingRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectiblesWithLowestListingResponse>;
  listCollectiblesWithHighestOffer: (req: ListCollectiblesWithHighestOfferRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectiblesWithHighestOfferResponse>;
  syncOrder: (req: SyncOrderRequest, headers?: object, signal?: AbortSignal) => Promise<SyncOrderResponse>;
  syncOrders: (req: SyncOrdersRequest, headers?: object, signal?: AbortSignal) => Promise<SyncOrdersResponse>;
  getOrders: (req: GetOrdersRequest, headers?: object, signal?: AbortSignal) => Promise<GetOrdersResponse>;
  checkoutOptionsMarketplace: (req: CheckoutOptionsMarketplaceRequest, headers?: object, signal?: AbortSignal) => Promise<CheckoutOptionsMarketplaceResponse>;
  checkoutOptionsSalesContract: (req: CheckoutOptionsSalesContractRequest, headers?: object, signal?: AbortSignal) => Promise<CheckoutOptionsSalesContractResponse>;
  supportedMarketplaces: (req: SupportedMarketplacesRequest, headers?: object, signal?: AbortSignal) => Promise<SupportedMarketplacesResponse>;
  getPrimarySaleItem: (req: GetPrimarySaleItemRequest, headers?: object, signal?: AbortSignal) => Promise<GetPrimarySaleItemResponse>;
  listPrimarySaleItems: (req: ListPrimarySaleItemsRequest, headers?: object, signal?: AbortSignal) => Promise<ListPrimarySaleItemsResponse>;
  getCountOfPrimarySaleItems: (req: GetCountOfPrimarySaleItemsRequest, headers?: object, signal?: AbortSignal) => Promise<GetCountOfPrimarySaleItemsResponse>;
}
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
//#endregion
//#region ../api/dist/primitives.d.ts
//#region src/types/primitives.d.ts

/**
 * Universal chain identifier as number
 * Replaces: chainID (number), chainID (string)
 */
type ChainId = number;
/**
 * Universal token identifier as bigint
 * Replaces: tokenId (string), tokenID (string)
 */
type TokenId = bigint;
/**
 * Universal address type (viem compatible)
 */
type Address$1 = Address;
/**
 * Universal contract address
 */

/**
 * Universal amount/balance type (wei)
 */
type Amount = bigint;
/**
 * Universal quantity type
 */

/**
 * Universal project identifier as number
 */
type ProjectId = number;
//#endregion
//#endregion
//#region ../api/dist/types.d.ts
//#region src/adapters/indexer/types.d.ts
interface ContractInfo$1 {
  chainId: ChainId;
  address: Address$1;
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
    originAddress?: Address$1;
    blacklist?: boolean;
    verified?: boolean;
    verifiedBy?: string;
    featured?: boolean;
    featureIndex?: number;
    categories?: string[];
  };
  updatedAt?: string;
}
interface TokenMetadata$1 {
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
interface TokenBalance$1 {
  contractType: ContractType;
  contractAddress: Address$1;
  accountAddress: Address$1;
  tokenId: TokenId;
  balance: Amount;
  blockHash?: string;
  blockNumber?: number;
  chainId: ChainId;
  contractInfo?: ContractInfo$1;
  tokenMetadata?: TokenMetadata$1;
  uniqueCollectibles?: Amount;
  isSummary?: boolean;
}
interface TokenSupply$1 {
  tokenId: TokenId;
  supply: Amount;
  chainId: ChainId;
  contractAddress?: Address$1;
  contractInfo?: ContractInfo$1;
  tokenMetadata?: TokenMetadata$1;
}
interface TransactionReceipt$1 {
  txnHash: string;
  blockHash: string;
  blockNumber: number;
  chainId?: ChainId;
  txnIndex: number;
  from?: Address$1;
  to?: Address$1;
  gasUsed?: number;
  effectiveGasPrice?: Amount;
  logs?: Array<{
    address: Address$1;
    topics: string[];
    data: string;
    logIndex: number;
  }>;
}
interface TokenIDRange {
  startTokenId: TokenId;
  endTokenId: TokenId;
}
interface Page$1 {
  page: number;
  pageSize: number;
  more: boolean;
}
type GetTokenBalancesRequest = {
  accountAddress: Address$1;
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
} & ({
  contractAddress?: Address$1;
  collectionAddress?: never;
} | {
  collectionAddress?: Address$1;
  contractAddress?: never;
});
interface GetTokenBalancesResponse {
  balances: TokenBalance$1[];
  page?: Page$1;
}
type GetTokenSuppliesRequest = {
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
  };
  page?: {
    page?: number;
    pageSize?: number;
    more?: boolean;
  };
} & ({
  contractAddress: Address$1;
  collectionAddress?: never;
} | {
  collectionAddress: Address$1;
  contractAddress?: never;
});
interface GetTokenSuppliesResponse {
  contractType: ContractType;
  contractAddress: Address$1;
  supplies: TokenSupply$1[];
  page?: Page$1;
}
type GetTokenIDRangesRequest = {
  contractAddress: Address$1;
  collectionAddress?: never;
} | {
  collectionAddress: Address$1;
  contractAddress?: never;
};
interface GetTokenIDRangesResponse {
  contractAddress: string;
  ranges: TokenIDRange[];
}
interface NativeTokenBalance {
  accountAddress: Address$1;
  chainId: ChainId;
  balance: Amount;
  errorReason?: string;
}
interface GetTokenBalancesDetailsResponse {
  page: Page$1;
  nativeBalances: Array<NativeTokenBalance>;
  balances: Array<TokenBalance$1>;
}
interface GetTokenBalancesByContractResponse {
  page: Page$1;
  balances: Array<TokenBalance$1>;
}
interface GetNativeTokenBalanceResponse {
  balance: NativeTokenBalance;
}
//#endregion
//#endregion
//#region ../api/dist/types2.d.ts
//#region src/adapters/metadata/types.d.ts
interface ContractInfo$2 {
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: ContractType;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
}
interface ContractInfoExtensions {
  link?: string;
  description?: string;
  categories?: string[];
  bridgeInfo?: {
    [key: string]: ContractInfoExtensionBridgeInfo;
  };
  ogImage?: string;
  ogName?: string;
  originChainId?: ChainId;
  originAddress?: Address$1;
  blacklist?: boolean;
  verified?: boolean;
  verifiedBy?: string;
  featured?: boolean;
  featureIndex?: number;
}
interface ContractInfoExtensionBridgeInfo {
  tokenAddress: Address$1;
}
interface TokenMetadata$2 {
  chainId?: ChainId;
  contractAddress?: Address$1;
  tokenId: TokenId;
  source: string;
  name: string;
  description?: string;
  image?: string;
  video?: string;
  audio?: string;
  properties?: {
    [key: string]: unknown;
  };
  attributes: Array<{
    [key: string]: unknown;
  }>;
  image_data?: string;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
  decimals?: number;
  updatedAt?: string;
  assets?: Asset$1[];
  status: string;
  queuedAt?: string;
  lastFetched?: string;
}
interface Asset$1 {
  id: number;
  collectionId: number;
  tokenId?: TokenId;
  url?: string;
  metadataField: string;
  name?: string;
  filesize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  updatedAt?: string;
}
interface Page$2 {
  page?: number;
  column?: string;
  before?: unknown;
  after?: unknown;
  pageSize?: number;
  more?: boolean;
}
type GetContractInfoArgs = {
  chainId: ChainId;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
interface GetContractInfoReturn {
  contractInfo: ContractInfo$2;
  taskID?: number;
}
interface GetContractInfoBatchArgs {
  chainId: ChainId;
  contractAddresses: string[];
}
interface GetContractInfoBatchReturn {
  contractInfoMap: {
    [key: string]: ContractInfo$2;
  };
  taskID?: number;
}
type GetTokenMetadataArgs = {
  chainId: ChainId;
  tokenIds: TokenId[];
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
interface GetTokenMetadataReturn {
  tokenMetadata: TokenMetadata$2[];
  taskID?: number;
}
interface GetTokenMetadataBatchArgs {
  chainId: ChainId;
  contractTokenMap: {
    [key: string]: TokenId[];
  };
}
interface GetTokenMetadataBatchReturn {
  contractTokenMetadata: {
    [key: string]: TokenMetadata$2[];
  };
  taskID?: number;
}
type RefreshTokenMetadataArgs = {
  chainId: ChainId;
  tokenIds?: TokenId[];
  refreshAll?: boolean;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
interface RefreshTokenMetadataReturn {
  taskID: number;
}
type SearchTokenMetadataArgs = {
  chainId: ChainId;
  filter: Filter;
  page?: Page$2;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
interface SearchTokenMetadataReturn {
  page: Page$2;
  tokenMetadata: TokenMetadata$2[];
}
type GetTokenMetadataPropertyFiltersArgs = {
  chainId: ChainId;
  excludeProperties: Array<string>;
  excludePropertyValues?: boolean;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
interface GetTokenMetadataPropertyFiltersReturn {
  filters: Array<PropertyFilter$1>;
}
//#endregion
//#endregion
//#region ../api/dist/index.d.ts
//#region src/adapters/marketplace/types.d.ts
interface Currency$1 extends Omit<Currency, 'contractAddress'> {
  contractAddress: Address;
}
interface PrimarySaleItem$1 extends Omit<PrimarySaleItem, 'currencyAddress' | 'itemAddress'> {
  currencyAddress: Address;
  itemAddress: Address;
}
interface CollectiblePrimarySaleItem$1 extends Omit<CollectiblePrimarySaleItem, 'primarySaleItem'> {
  primarySaleItem: PrimarySaleItem$1;
}
interface Order$1 extends Omit<Order, 'priceCurrencyAddress'> {
  priceCurrencyAddress: Address;
}
interface CollectibleOrder$1 extends Omit<CollectibleOrder, 'order' | 'listing' | 'offer'> {
  order?: Order$1;
  listing?: Order$1;
  offer?: Order$1;
}
type StepBase = Omit<Step, 'to'> & {
  to: Address;
};
type Signature$1 = Omit<Signature, 'domain'> & {
  domain: TypedDataDomain;
};
type SignatureStep = (Omit<StepBase, 'signature'> & {
  id: StepType.signEIP191;
  post: PostRequest;
  signature?: never;
}) | (Omit<StepBase, 'signature'> & {
  id: StepType.signEIP712;
  post: PostRequest;
  signature: Signature$1;
});
type TransactionStep = Omit<StepBase, 'data'> & {
  id: StepType.tokenApproval | StepType.buy | StepType.sell | StepType.cancel | StepType.createOffer | StepType.createListing;
  data: Hash;
};
type ApprovalStep = TransactionStep & {
  id: StepType.tokenApproval;
};
type UnknownStep = StepBase & {
  id: StepType.unknown;
};
type Step$1 = SignatureStep | TransactionStep | UnknownStep;
declare function isSignatureStep(step: Step$1): step is SignatureStep;
declare function isTransactionStep(step: Step$1): step is TransactionStep;
//#endregion
//#region src/adapters/marketplace/client.d.ts
interface CheckoutOptionsItem {
  tokenId: TokenId;
  quantity: bigint;
}
interface CreateReq {
  tokenId: TokenId;
  quantity: bigint;
  expiry: string;
  currencyAddress: Address$1;
  pricePerToken: bigint;
}
type GenerateListingTransactionResponse$1 = Omit<GenerateListingTransactionResponse, 'steps'> & {
  steps: Step$1[];
};
type GenerateOfferTransactionResponse$1 = Omit<GenerateOfferTransactionResponse, 'steps'> & {
  steps: Step$1[];
};
type GenerateSellTransactionResponse$1 = Omit<GenerateSellTransactionResponse, 'steps'> & {
  steps: Step$1[];
};
type GenerateCancelTransactionResponse$1 = Omit<GenerateCancelTransactionResponse, 'steps'> & {
  steps: Step$1[];
};
type GenerateBuyTransactionResponse$1 = Omit<GenerateBuyTransactionResponse, 'steps'> & {
  steps: Step$1[];
};
type ListCollectibleListingsResponse = Omit<ListListingsForCollectibleResponse, 'listings'> & {
  listings: Order$1[];
};
type ListListingsForCollectibleResponse$1 = ListCollectibleListingsResponse;
type ListCollectibleOffersResponse = Omit<ListOffersForCollectibleResponse, 'offers'> & {
  offers: Order$1[];
};
/**
 * Alias for ListCollectibleOffersResponse
 * Both names refer to the same normalized type
 */
type ListOffersForCollectibleResponse$1 = ListCollectibleOffersResponse;
type ListOrdersWithCollectiblesResponse$1 = Omit<ListOrdersWithCollectiblesResponse, 'collectibles'> & {
  collectibles: CollectibleOrder$1[];
};
type ListCollectiblesResponse$1 = Omit<ListCollectiblesResponse, 'collectibles'> & {
  collectibles: CollectibleOrder$1[];
};
type ListCurrenciesResponse$1 = Omit<ListCurrenciesResponse, 'currencies'> & {
  currencies: Currency$1[];
};
type ListPrimarySaleItemsResponse$1 = Omit<ListPrimarySaleItemsResponse, 'primarySaleItems'> & {
  primarySaleItems: Array<CollectiblePrimarySaleItem$1>;
};
type GetCollectibleLowestListingResponse$1 = Omit<GetCollectibleLowestListingResponse, 'order'> & {
  order?: Order$1;
};
type GetCollectibleHighestOfferResponse$1 = Omit<GetCollectibleHighestOfferResponse, 'order'> & {
  order?: Order$1;
};
type GetFloorOrderResponse$1 = Omit<GetFloorOrderResponse, 'collectible'> & {
  collectible: CollectibleOrder$1;
};
type GetOrdersResponse$1 = Omit<GetOrdersResponse, 'orders'> & {
  orders: Order$1[];
};
type GenerateListingTransactionRequest$1 = Omit<GenerateListingTransactionRequest, 'chainId' | 'contractType' | 'listing'> & {
  chainId: ChainId;
  contractType: ContractType;
  listing: CreateReq;
};
type GenerateOfferTransactionRequest$1 = Omit<GenerateOfferTransactionRequest, 'chainId' | 'contractType' | 'offer'> & {
  chainId: ChainId;
  contractType: ContractType;
  offer: CreateReq;
};
/**
 * SDK-facing OrderData type with bigint quantity
 */
interface OrderData {
  orderId: string;
  quantity: bigint;
  tokenId?: TokenId;
}
type GenerateSellTransactionRequest$1 = Omit<GenerateSellTransactionRequest, 'chainId' | 'ordersData'> & {
  chainId: ChainId;
  ordersData: Array<OrderData>;
};
type GenerateCancelTransactionRequest$1 = Omit<GenerateCancelTransactionRequest, 'chainId'> & {
  chainId: ChainId;
};
type GenerateBuyTransactionRequest$1 = Omit<GenerateBuyTransactionRequest, 'chainId' | 'ordersData'> & {
  chainId: ChainId;
  ordersData: Array<OrderData>;
};
type GetCollectionDetailRequest$1 = Omit<GetCollectionDetailRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type ListCurrenciesRequest$1 = Omit<ListCurrenciesRequest, 'chainId'> & {
  chainId: ChainId;
};
type GetCollectibleRequest$1 = Omit<GetCollectibleRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type GetLowestPriceListingForCollectibleRequest$1 = Omit<GetLowestPriceListingForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
  tokenId: TokenId;
};
type GetHighestPriceOfferForCollectibleRequest$1 = Omit<GetHighestPriceOfferForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
  tokenId: TokenId;
};
type ListListingsForCollectibleRequest$1 = Omit<ListListingsForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
  tokenId: TokenId;
};
type ListOffersForCollectibleRequest$1 = Omit<ListOffersForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
  tokenId: TokenId;
};
type ListOrdersWithCollectiblesRequest$1 = Omit<ListOrdersWithCollectiblesRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type GetFloorOrderRequest$1 = Omit<GetFloorOrderRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type ListCollectiblesRequest$1 = Omit<ListCollectiblesRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type ListCollectibleActivitiesRequest$1 = Omit<ListCollectibleActivitiesRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type ListCollectionActivitiesRequest$1 = Omit<ListCollectionActivitiesRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type ListPrimarySaleItemsRequest$1 = Omit<ListPrimarySaleItemsRequest, 'chainId'> & {
  chainId: ChainId;
};
type GetPrimarySaleItemRequest$1 = Omit<GetPrimarySaleItemRequest, 'chainId'> & {
  chainId: ChainId;
};
type GetPrimarySaleItemResponse$1 = Omit<GetPrimarySaleItemResponse, 'item'> & {
  item: CollectiblePrimarySaleItem$1;
};
type GetCountOfPrimarySaleItemsRequest$1 = Omit<GetCountOfPrimarySaleItemsRequest, 'chainId'> & {
  chainId: ChainId;
};
type CheckoutOptionsMarketplaceRequest$1 = Omit<CheckoutOptionsMarketplaceRequest, 'chainId' | 'wallet'> & {
  chainId: ChainId;
} & ({
  wallet: string;
  walletAddress?: never;
} | {
  walletAddress: string;
  wallet?: never;
});
type GetCountOfFilteredCollectiblesRequest$1 = Omit<GetCountOfFilteredCollectiblesRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type GetCountOfAllCollectiblesRequest$1 = Omit<GetCountOfAllCollectiblesRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type GetCountOfListingsForCollectibleRequest$1 = Omit<GetCountOfListingsForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
  tokenId: TokenId;
};
type GetCountOfOffersForCollectibleRequest$1 = Omit<GetCountOfOffersForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
  tokenId: TokenId;
};
type GetCountOfFilteredOrdersRequest$1 = Omit<GetCountOfFilteredOrdersRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type GetCountOfAllOrdersRequest$1 = Omit<GetCountOfAllOrdersRequest, 'chainId' | 'contractAddress'> & {
  chainId: ChainId;
  collectionAddress: Address$1;
};
type CheckoutOptionsSalesContractRequest$1 = Omit<CheckoutOptionsSalesContractRequest, 'chainId' | 'items'> & {
  chainId: ChainId;
  items: Array<CheckoutOptionsItem>;
};
type GetOrdersRequest$1 = Omit<GetOrdersRequest, 'chainId'> & {
  chainId: ChainId;
};
/**
 * Wrapped Marketplace Client
 *
 * Wraps the raw Marketplace client with methods that accept normalized types (number chainId).
 * Uses proxy utilities to automatically convert chainId from number to string for API calls.
 * Methods are created using wrapper functions to eliminate repetitive conversion code.
 */
declare class MarketplaceClient {
  private client;
  queryKey: Marketplace['queryKey'];
  readonly generateListingTransaction: (req: GenerateListingTransactionRequest$1) => Promise<GenerateListingTransactionResponse$1>;
  readonly generateOfferTransaction: (req: GenerateOfferTransactionRequest$1) => Promise<GenerateOfferTransactionResponse$1>;
  readonly generateSellTransaction: (req: GenerateSellTransactionRequest$1) => Promise<GenerateSellTransactionResponse$1>;
  readonly generateCancelTransaction: (req: GenerateCancelTransactionRequest$1) => Promise<GenerateCancelTransactionResponse$1>;
  readonly generateBuyTransaction: (req: GenerateBuyTransactionRequest$1) => Promise<GenerateBuyTransactionResponse$1>;
  readonly getCollectionDetail: (req: GetCollectionDetailRequest$1) => Promise<GetCollectionDetailResponse>;
  readonly listCurrencies: (req: ListCurrenciesRequest$1) => Promise<ListCurrenciesResponse$1>;
  readonly getCollectionActiveListingsCurrencies: (req: GetCollectionActiveListingsCurrenciesRequest) => Promise<ListCurrenciesResponse$1>;
  readonly getCollectionActiveOffersCurrencies: (req: GetCollectionActiveOffersCurrenciesRequest) => Promise<ListCurrenciesResponse$1>;
  readonly getCollectible: (req: GetCollectibleRequest$1) => Promise<GetCollectibleResponse>;
  readonly getLowestPriceListingForCollectible: (req: GetLowestPriceListingForCollectibleRequest$1) => Promise<GetCollectibleLowestListingResponse$1>;
  readonly getHighestPriceOfferForCollectible: (req: GetHighestPriceOfferForCollectibleRequest$1) => Promise<GetCollectibleHighestOfferResponse$1>;
  readonly listListingsForCollectible: (req: ListListingsForCollectibleRequest$1) => Promise<ListCollectibleListingsResponse>;
  readonly listOffersForCollectible: (req: ListOffersForCollectibleRequest$1) => Promise<ListCollectibleOffersResponse>;
  readonly listOrdersWithCollectibles: (req: ListOrdersWithCollectiblesRequest$1) => Promise<ListOrdersWithCollectiblesResponse$1>;
  readonly getFloorOrder: (req: GetFloorOrderRequest$1) => Promise<GetFloorOrderResponse$1>;
  readonly getOrders: (req: GetOrdersRequest$1) => Promise<GetOrdersResponse$1>;
  readonly listCollectibles: (req: ListCollectiblesRequest$1) => Promise<ListCollectiblesResponse$1>;
  readonly listCollectibleActivities: (req: ListCollectibleActivitiesRequest$1) => Promise<ListCollectibleActivitiesResponse>;
  readonly listCollectionActivities: (req: ListCollectionActivitiesRequest$1) => Promise<ListCollectionActivitiesResponse>;
  readonly listPrimarySaleItems: (req: ListPrimarySaleItemsRequest$1) => Promise<ListPrimarySaleItemsResponse$1>;
  readonly getPrimarySaleItem: (req: GetPrimarySaleItemRequest$1) => Promise<GetPrimarySaleItemResponse$1>;
  readonly getCountOfPrimarySaleItems: (req: GetCountOfPrimarySaleItemsRequest$1) => Promise<GetCountOfPrimarySaleItemsResponse>;
  readonly getCountOfFilteredCollectibles: (req: GetCountOfFilteredCollectiblesRequest$1) => Promise<GetCountOfFilteredCollectiblesResponse>;
  readonly getCountOfAllCollectibles: (req: GetCountOfAllCollectiblesRequest$1) => Promise<GetCountOfAllCollectiblesResponse>;
  readonly getCountOfListingsForCollectible: (req: GetCountOfListingsForCollectibleRequest$1) => Promise<GetCountOfListingsForCollectibleResponse>;
  readonly getCountOfOffersForCollectible: (req: GetCountOfOffersForCollectibleRequest$1) => Promise<GetCountOfOffersForCollectibleResponse>;
  readonly getCountOfFilteredOrders: (req: GetCountOfFilteredOrdersRequest$1) => Promise<GetCountOfFilteredOrdersResponse>;
  readonly getCountOfAllOrders: (req: GetCountOfAllOrdersRequest$1) => Promise<GetCountOfAllOrdersResponse>;
  readonly checkoutOptionsMarketplace: (req: CheckoutOptionsMarketplaceRequest$1) => Promise<CheckoutOptionsMarketplaceResponse>;
  readonly checkoutOptionsSalesContract: (req: CheckoutOptionsSalesContractRequest$1) => Promise<CheckoutOptionsSalesContractResponse>;
  readonly execute: (req: ExecuteRequest) => Promise<ExecuteResponse>;
  constructor(hostname: string, fetch: typeof globalThis.fetch);
  /**
   * Access the underlying raw client for any methods not wrapped
   */
  get raw(): Marketplace;
}
//#endregion
//#region src/adapters/builder/types.d.ts
interface LookupMarketplaceArgs {
  projectId?: ProjectId;
  domain?: string;
  userAddress?: string;
}
interface LookupMarketplaceReturn$1 {
  marketplace: Marketplace$1;
  marketCollections: MarketCollection$1[];
  shopCollections: ShopCollection$1[];
}
interface Marketplace$1 {
  projectId: ProjectId;
  settings: MarketplaceSettings;
  market: MarketPage;
  shop: ShopPage;
  createdAt?: string;
  updatedAt?: string;
}
interface MarketplaceSettings {
  style: {
    [key: string]: any;
  };
  publisherId: string;
  title: string;
  socials: MarketplaceSocials;
  faviconUrl: string;
  walletOptions: MarketplaceWallet;
  logoUrl: string;
  fontUrl: string;
  accessKey?: string;
}
interface MarketplacePage {
  enabled: boolean;
  bannerUrl: string;
  ogImage: string;
  private: boolean;
}
interface MarketPage extends MarketplacePage {
  collections: MarketCollection$1[];
}
interface ShopPage extends MarketplacePage {
  collections: ShopCollection$1[];
}
interface MarketplaceSocials {
  twitter: string;
  discord: string;
  website: string;
  tiktok: string;
  instagram: string;
  youtube: string;
}
interface MarketplaceWallet {
  walletType: MarketplaceWalletType;
  oidcIssuers: {
    [key: string]: string;
  };
  connectors: string[];
  includeEIP6963Wallets: boolean;
  ecosystem?: MarketplaceWalletEcosystem;
  embedded?: MarketplaceWalletEmbedded;
}
interface MarketplaceWalletEcosystem {
  walletUrl: string;
  walletAppName: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
}
interface MarketplaceWalletEmbedded {
  tenantKey: string;
  emailEnabled: boolean;
  providers: OpenIdProvider[];
}
interface OpenIdProvider {
  iss: string;
  aud: string[];
}
interface BaseMarketplaceCollection {
  id: number;
  projectId: ProjectId;
  chainId: ChainId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface MarketCollection$1 extends BaseMarketplaceCollection {
  marketplaceCollectionType: 'market';
  contractType: ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
}
interface CollectionFilterSettings {
  filterOrder: string[];
  exclusions: MetadataFilterRule[];
}
interface MetadataFilterRule {
  key: string;
  condition: FilterCondition;
  value?: string;
}
interface ShopCollection$1 extends BaseMarketplaceCollection {
  marketplaceCollectionType: 'shop';
  saleAddress: Address$1;
  name: string;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
}
type MarketplaceCollection = MarketCollection$1 | ShopCollection$1;
interface MarketplaceService$1 {
  lookupMarketplace(args: LookupMarketplaceArgs, headers?: object, signal?: AbortSignal): Promise<LookupMarketplaceReturn$1>;
}
//#endregion
//#region src/adapters/builder/transforms.d.ts
declare function toLookupMarketplaceReturn(data: LookupMarketplaceReturn): LookupMarketplaceReturn$1;
declare function toMarketCollection(data: MarketCollection): MarketCollection$1;
declare function toShopCollection(data: ShopCollection): ShopCollection$1;
declare function fromLookupMarketplaceReturn(data: LookupMarketplaceReturn$1): LookupMarketplaceReturn;
declare function fromMarketCollection(data: MarketCollection$1): MarketCollection;
declare function fromShopCollection(data: ShopCollection$1): ShopCollection;
declare namespace index_d_exports {
  export { builder_gen_d_exports as BuilderAPI, CollectionFilterSettings, FilterCondition, LookupMarketplaceArgs, LookupMarketplaceReturn$1 as LookupMarketplaceReturn, MarketCollection$1 as MarketCollection, MarketPage, Marketplace$1 as Marketplace, MarketplaceCollection, MarketplacePage, MarketplaceService$1 as MarketplaceService, MarketplaceSettings, MarketplaceSocials, MarketplaceWallet, MarketplaceWalletEcosystem, MarketplaceWalletEmbedded, MarketplaceWalletType, MetadataFilterRule, OpenIdProvider, ShopCollection$1 as ShopCollection, ShopPage, WebrpcBadMethodError, WebrpcBadRequestError, WebrpcBadResponseError, WebrpcBadRouteError, WebrpcClientDisconnectedError, WebrpcEndpointError, WebrpcError, WebrpcInternalErrorError, WebrpcRequestFailedError, WebrpcServerPanicError, WebrpcStreamFinishedError, WebrpcStreamLostError, fromLookupMarketplaceReturn, fromMarketCollection, fromShopCollection, toLookupMarketplaceReturn, toMarketCollection, toShopCollection };
}
//#endregion
//#region src/adapters/indexer/client.d.ts
/**
 * Wrapped Indexer Client
 *
 * Wraps the raw SequenceIndexer with methods that return normalized types.
 * Uses composition rather than inheritance to avoid type conflicts.
 */
declare class IndexerClient {
  private client;
  constructor(hostname: string, projectAccessKey?: string, jwtAuth?: string);
  /**
   * Get token balances for an account with normalized types (bigint)
   * Accepts tokenId as bigint, transforms to tokenID string for API
   */
  getTokenBalances(args: GetTokenBalancesRequest): Promise<GetTokenBalancesResponse>;
  /**
   * Get token supplies for a contract with normalized types (bigint)
   */
  getTokenSupplies(args: GetTokenSuppliesRequest): Promise<GetTokenSuppliesResponse>;
  /**
   * Get token ID ranges for a contract with normalized types (bigint)
   */
  getTokenIDRanges(args: GetTokenIDRangesRequest): Promise<GetTokenIDRangesResponse>;
  /**
   * Get token balance details with normalized types (bigint)
   */
  getTokenBalancesDetails(args: IndexerGen.GetTokenBalancesDetailsArgs): Promise<GetTokenBalancesDetailsResponse>;
  /**
   * Get token balances by contract with normalized types (bigint)
   */
  getTokenBalancesByContract(args: IndexerGen.GetTokenBalancesByContractArgs): Promise<GetTokenBalancesByContractResponse>;
  /**
   * Get native token balance with normalized types (bigint)
   */
  getNativeTokenBalance(args: IndexerGen.GetNativeTokenBalanceArgs): Promise<GetNativeTokenBalanceResponse>;
  /**
   * Fetch transaction receipt with normalized types (bigint)
   */
  fetchTransactionReceipt(args: {
    txnHash: string;
    maxBlockWait?: number;
  }): Promise<{
    receipt: TransactionReceipt$1;
  }>;
  /**
   * Access the underlying raw client for any methods not wrapped
   */
  get raw(): SequenceIndexer;
}
//#endregion
//#region src/adapters/indexer/transforms.d.ts
declare function toContractInfo$1(raw: IndexerGen.ContractInfo): ContractInfo$1 | undefined;
declare function toTokenMetadata$1(raw: IndexerGen.TokenMetadata): TokenMetadata$1;
declare function toNativeTokenBalance(raw: IndexerGen.NativeTokenBalance): NativeTokenBalance;
declare function toTokenBalance(raw: IndexerGen.TokenBalance): TokenBalance$1;
declare function toTokenSupply(raw: IndexerGen.TokenSupply, contractAddress?: Address$1): TokenSupply$1;
declare function toTransactionReceipt(raw: IndexerGen.TransactionReceipt): TransactionReceipt$1;
declare function toTokenIDRange(raw: IndexerGen.TokenIDRange): TokenIDRange;
declare function toPage(raw: IndexerGen.Page | undefined): Page$1 | undefined;
declare function toGetTokenBalancesResponse(raw: IndexerGen.GetTokenBalancesReturn): GetTokenBalancesResponse;
declare function toGetTokenSuppliesResponse(raw: IndexerGen.GetTokenSuppliesReturn, contractAddress: Address$1): GetTokenSuppliesResponse;
declare function toGetTokenIDRangesResponse(raw: IndexerGen.GetTokenIDRangesReturn, contractAddress: Address$1): GetTokenIDRangesResponse;
declare function toGetTokenBalancesArgs(req: GetTokenBalancesRequest): IndexerGen.GetTokenBalancesArgs;
declare function toGetTokenSuppliesArgs(req: GetTokenSuppliesRequest): IndexerGen.GetTokenSuppliesArgs;
declare function toGetTokenIDRangesArgs(req: GetTokenIDRangesRequest): IndexerGen.GetTokenIDRangesArgs;
declare namespace index_d_exports$1 {
  export { ContractInfo$1 as ContractInfo, ContractType, GetNativeTokenBalanceResponse, GetTokenBalancesByContractResponse, GetTokenBalancesDetailsResponse, GetTokenBalancesRequest, GetTokenBalancesResponse, GetTokenIDRangesRequest, GetTokenIDRangesResponse, GetTokenSuppliesRequest, GetTokenSuppliesResponse, IndexerGen as IndexerAPI, IndexerClient, NativeTokenBalance, Page$1 as Page, ResourceStatus, TokenBalance$1 as TokenBalance, TokenIDRange, TokenMetadata$1 as TokenMetadata, TokenSupply$1 as TokenSupply, TransactionReceipt$1 as TransactionReceipt, TransactionStatus, TransactionType, toContractInfo$1 as toContractInfo, toGetTokenBalancesArgs, toGetTokenBalancesResponse, toGetTokenIDRangesArgs, toGetTokenIDRangesResponse, toGetTokenSuppliesArgs, toGetTokenSuppliesResponse, toNativeTokenBalance, toPage, toTokenBalance, toTokenIDRange, toTokenMetadata$1 as toTokenMetadata, toTokenSupply, toTransactionReceipt };
}
//#endregion
//#region src/adapters/metadata/client.d.ts
/**
 * Wrapped Metadata Client
 *
 * This client accepts SDK-friendly types (number for chainId, bigint for tokenId)
 * and handles conversion to/from the raw API types internally.
 */
declare class MetadataClient {
  private client;
  constructor(hostname: string, projectAccessKey?: string, jwtAuth?: string);
  /**
   * Get contract info
   * Accepts normalized types (chainId: number)
   */
  getContractInfo(args: GetContractInfoArgs): Promise<GetContractInfoReturn>;
  /**
   * Get contract info batch
   * Accepts normalized types (chainId: number)
   */
  getContractInfoBatch(args: GetContractInfoBatchArgs): Promise<GetContractInfoBatchReturn>;
  /**
   * Get token metadata
   * Accepts normalized types (chainId: number, tokenIds: bigint[])
   */
  getTokenMetadata(args: GetTokenMetadataArgs): Promise<GetTokenMetadataReturn>;
  /**
   * Get token metadata batch
   * Accepts normalized types (chainId: number, tokenIds: bigint[])
   */
  getTokenMetadataBatch(args: GetTokenMetadataBatchArgs): Promise<GetTokenMetadataBatchReturn>;
  /**
   * Refresh token metadata
   * Accepts normalized types (chainId: number, tokenIds: bigint[])
   */
  refreshTokenMetadata(args: RefreshTokenMetadataArgs): Promise<RefreshTokenMetadataReturn>;
  /**
   * Search token metadata
   * Accepts normalized types (chainId: number)
   */
  searchTokenMetadata(args: SearchTokenMetadataArgs): Promise<SearchTokenMetadataReturn>;
  /**
   * Get token metadata property filters
   * Accepts normalized types (chainId: number)
   */
  getTokenMetadataPropertyFilters(args: GetTokenMetadataPropertyFiltersArgs): Promise<GetTokenMetadataPropertyFiltersReturn>;
  /**
   * Access the underlying raw client if needed
   * (for advanced use cases or methods not yet wrapped)
   */
  get raw(): SequenceMetadata;
}
//#endregion
//#region src/adapters/metadata/transforms.d.ts
declare function toContractInfo(raw: MetadataGen.ContractInfo): ContractInfo$2;
declare function toAsset(raw: MetadataGen.Asset): Asset$1;
declare function toTokenMetadata(raw: MetadataGen.TokenMetadata): TokenMetadata$2;
declare function toGetContractInfoReturn(raw: MetadataGen.GetContractInfoReturn): GetContractInfoReturn;
declare function toGetContractInfoBatchReturn(raw: MetadataGen.GetContractInfoBatchReturn): GetContractInfoBatchReturn;
declare function toGetTokenMetadataReturn(raw: MetadataGen.GetTokenMetadataReturn): GetTokenMetadataReturn;
declare function toGetTokenMetadataBatchReturn(raw: MetadataGen.GetTokenMetadataBatchReturn): GetTokenMetadataBatchReturn;
declare function toSearchTokenMetadataReturn(raw: MetadataGen.SearchTokenMetadataReturn): SearchTokenMetadataReturn;
declare function toGetContractInfoArgs(normalized: GetContractInfoArgs): MetadataGen.GetContractInfoArgs;
declare function toGetContractInfoBatchArgs(normalized: GetContractInfoBatchArgs): MetadataGen.GetContractInfoBatchArgs;
declare function toGetTokenMetadataArgs(normalized: GetTokenMetadataArgs): MetadataGen.GetTokenMetadataArgs;
declare function toGetTokenMetadataBatchArgs(normalized: GetTokenMetadataBatchArgs): MetadataGen.GetTokenMetadataBatchArgs;
declare function toRefreshTokenMetadataArgs(normalized: RefreshTokenMetadataArgs): MetadataGen.RefreshTokenMetadataArgs;
declare function toSearchTokenMetadataArgs(normalized: SearchTokenMetadataArgs): MetadataGen.SearchTokenMetadataArgs;
declare function toGetTokenMetadataPropertyFiltersArgs(normalized: GetTokenMetadataPropertyFiltersArgs): MetadataGen.GetTokenMetadataPropertyFiltersArgs;
declare function toGetTokenMetadataPropertyFiltersReturn(raw: MetadataGen.GetTokenMetadataPropertyFiltersReturn): GetTokenMetadataPropertyFiltersReturn;
declare namespace index_d_exports$3 {
  export { Asset$1 as Asset, ContractInfo$2 as ContractInfo, ContractInfoExtensionBridgeInfo, ContractInfoExtensions, Filter, GetContractInfoArgs, GetContractInfoBatchArgs, GetContractInfoBatchReturn, GetContractInfoReturn, GetTokenMetadataArgs, GetTokenMetadataBatchArgs, GetTokenMetadataBatchReturn, GetTokenMetadataPropertyFiltersArgs, GetTokenMetadataPropertyFiltersReturn, GetTokenMetadataReturn, MetadataGen as MetadataAPI, MetadataClient, Page$2 as Page, PropertyFilter$1 as PropertyFilter, RefreshTokenMetadataArgs, RefreshTokenMetadataReturn, SearchTokenMetadataArgs, SearchTokenMetadataReturn, TokenMetadata$2 as TokenMetadata, toAsset, toContractInfo, toGetContractInfoArgs, toGetContractInfoBatchArgs, toGetContractInfoBatchReturn, toGetContractInfoReturn, toGetTokenMetadataArgs, toGetTokenMetadataBatchArgs, toGetTokenMetadataBatchReturn, toGetTokenMetadataPropertyFiltersArgs, toGetTokenMetadataPropertyFiltersReturn, toGetTokenMetadataReturn, toRefreshTokenMetadataArgs, toSearchTokenMetadataArgs, toSearchTokenMetadataReturn, toTokenMetadata };
}
//#endregion
//#region src/utils/normalize.d.ts

//#endregion
export { ShopCollection$1 as $, PostRequest as $t, ListCollectiblesResponse$1 as A, Collectible as At, ListPrimarySaleItemsResponse$1 as B, GetCountOfPrimarySaleItemsResponse as Bt, GetLowestPriceListingForCollectibleRequest$1 as C, ChainId as Ct, ListCollectibleListingsResponse as D, Asset as Dt, ListCollectibleActivitiesRequest$1 as E, AdditionalFee as Et, ListOffersForCollectibleRequest$1 as F, ExecuteType as Ft, MarketplaceCollection as G, MetadataStatus as Gt, MarketCollection$1 as H, ListCollectibleListingsRequest as Ht, ListOffersForCollectibleResponse$1 as I, GetCollectibleHighestOfferRequest as It, MetadataClient as J, OrderSide as Jt, MarketplaceSettings as K, OfferType as Kt, ListOrdersWithCollectiblesRequest$1 as L, GetCollectibleHighestOfferResponse as Lt, ListCurrenciesRequest$1 as M, Collection as Mt, ListListingsForCollectibleRequest$1 as N, CollectionStatus as Nt, ListCollectibleOffersResponse as O, CheckoutOptions as Ot, ListListingsForCollectibleResponse$1 as P, CurrencyStatus as Pt, PrimarySaleItem$1 as Q, Page as Qt, ListOrdersWithCollectiblesResponse$1 as R, GetCountOfListingsForCollectibleResponse as Rt, GetHighestPriceOfferForCollectibleRequest$1 as S, Address$1 as St, IndexerClient as T, TokenId as Tt, MarketPage as U, ListCollectionActivitiesResponse as Ut, LookupMarketplaceReturn$1 as V, ListCollectibleActivitiesResponse as Vt, MarketplaceClient as W, MarketplaceKind as Wt, Order$1 as X, OrderbookKind as Xt, OpenIdProvider as Y, OrderStatus as Yt, OrderData as Z, OrdersFilter as Zt, GetCountOfFilteredOrdersRequest$1 as _, GetTokenBalancesDetailsResponse as _t, CollectiblePrimarySaleItem$1 as a, SortOrder as an, index_d_exports as at, GetCountOfPrimarySaleItemsRequest$1 as b, GetTokenSuppliesResponse as bt, CreateReq as c, TransactionOnRampProvider as cn, isSignatureStep as ct, GenerateListingTransactionRequest$1 as d, MarketplaceWalletType as dn, ContractInfoExtensions as dt, PriceFilter as en, ShopPage as et, GenerateOfferTransactionRequest$1 as f, Filter as ft, GetCountOfAllOrdersRequest$1 as g, ContractInfo$1 as gt, GetCountOfAllCollectiblesRequest$1 as h, TokenMetadata$2 as ht, CollectibleOrder$1 as i, SortBy as in, TransactionStep as it, ListCollectionActivitiesRequest$1 as j, CollectiblesFilter as jt, ListCollectiblesRequest$1 as k, CheckoutOptionsSalesContractResponse as kt, Currency$1 as l, WalletKind as ln, isTransactionStep as lt, GetCollectionDetailRequest$1 as m, SearchTokenMetadataReturn as mt, CheckoutOptionsItem as n, PropertyFilter as nn, SignatureStep as nt, CollectionFilterSettings as o, StepType as on, index_d_exports$1 as ot, GenerateSellTransactionRequest$1 as p, Page$2 as pt, MarketplaceWallet as q, OrderFilter as qt, CheckoutOptionsMarketplaceRequest$1 as r, PropertyType as rn, Step$1 as rt, ContractType$1 as s, TransactionCrypto as sn, index_d_exports$3 as st, ApprovalStep as t, PrimarySaleItemsFilter as tn, Signature$1 as tt, GenerateCancelTransactionRequest$1 as u, FilterCondition as un, ContractInfo$2 as ut, GetCountOfListingsForCollectibleRequest$1 as v, GetTokenBalancesResponse as vt, GetPrimarySaleItemResponse$1 as w, ProjectId as wt, GetFloorOrderRequest$1 as x, TokenBalance$1 as xt, GetCountOfOffersForCollectibleRequest$1 as y, GetTokenIDRangesResponse as yt, ListPrimarySaleItemsRequest$1 as z, GetCountOfOffersForCollectibleResponse as zt };
//# sourceMappingURL=index2.d.ts.map