import * as IndexerGen from "@0xsequence/indexer";
import { ContractInfo, ContractInfoExtensions, ContractType, ContractType as ContractType$2, GetNativeTokenBalanceReturn, GetTokenBalancesArgs, GetTokenBalancesByContractArgs, GetTokenBalancesByContractReturn, GetTokenBalancesDetailsArgs, GetTokenBalancesDetailsReturn, GetTokenBalancesReturn, GetTokenIDRangesArgs, GetTokenIDRangesReturn, GetTokenSuppliesArgs, GetTokenSuppliesReturn, MetadataOptions, NativeTokenBalance, Page, ResourceStatus, SequenceIndexer, TokenBalance, TokenBalancesByContractFilter, TokenBalancesFilter, TokenIDRange, TokenMetadata, TokenSupply, TransactionLog, TransactionReceipt, TransactionStatus, TransactionType } from "@0xsequence/indexer";
import { Asset, ContractInfo as ContractInfo$1, ContractInfoExtensionBridgeInfo, ContractInfoExtensions as ContractInfoExtensions$1, Filter, GetContractInfoArgs, GetContractInfoBatchArgs, GetContractInfoBatchReturn, GetContractInfoReturn, GetTokenMetadataArgs, GetTokenMetadataBatchArgs, GetTokenMetadataBatchReturn, GetTokenMetadataPropertyFiltersArgs, GetTokenMetadataPropertyFiltersReturn, GetTokenMetadataReturn, Page as Page$1, RefreshTokenMetadataArgs, RefreshTokenMetadataReturn, SearchTokenMetadataArgs, SearchTokenMetadataReturn, SequenceMetadata, TokenMetadata as TokenMetadata$1 } from "@0xsequence/metadata";
import { Address, Hash, TypedDataDomain } from "viem";

//#region ../api/dist/builder.gen.d.ts
declare namespace builder_gen_d_exports {
  export { AlreadyCollaboratorError, CollectionFilterSettings, EmailTemplateExistsError, FeatureNotIncludedError, Fetch$1 as Fetch, FilterCondition, InvalidArgumentError, InvalidNetworkError, InvalidTierError, InvitationExpiredError, LookupMarketplaceArgs, LookupMarketplaceReturn, MarketCollection, Marketplace, MarketplacePage, MarketplaceService, MarketplaceSettings, MarketplaceSocials, MarketplaceWallet, MarketplaceWalletEcosystem, MarketplaceWalletEmbedded, MarketplaceWalletType, MetadataFilterRule, MethodNotFoundError, NotFoundError, OpenIdProvider, PermissionDeniedError, ProjectNotFoundError, RequestConflictError, ServiceDisabledError, SessionExpiredError, ShopCollection, SubscriptionLimitError, TimeoutError$1 as TimeoutError, UnauthorizedError, UserNotFoundError, WebrpcBadMethodError, WebrpcBadRequestError, WebrpcBadResponseError, WebrpcBadRouteError, WebrpcClientDisconnectedError, WebrpcEndpointError, WebrpcError, WebrpcErrorCodes, WebrpcHeader, WebrpcHeaderValue, WebrpcInternalErrorError, WebrpcRequestFailedError, WebrpcServerPanicError, WebrpcStreamFinishedError, WebrpcStreamLostError, errors, webrpcErrorByCode };
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
interface LookupMarketplaceArgs {
  projectId?: number;
  domain?: string;
  userAddress?: string;
}
interface LookupMarketplaceReturn {
  marketplace: Marketplace;
  marketCollections: Array<MarketCollection>;
  shopCollections: Array<ShopCollection>;
}
interface Marketplace {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketplacePage;
  shop: MarketplacePage;
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
  isTrailsEnabled: boolean;
}
interface MarketplacePage {
  enabled: boolean;
  bannerUrl: string;
  ogImage: string;
  private: boolean;
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
  connectors: Array<string>;
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
  providers: Array<OpenIdProvider>;
}
interface OpenIdProvider {
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
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface CollectionFilterSettings {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule>;
}
interface MetadataFilterRule {
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
  lookupMarketplace(args: LookupMarketplaceArgs, headers?: object, signal?: AbortSignal): Promise<LookupMarketplaceReturn>;
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
  lookupMarketplace: (args: LookupMarketplaceArgs, headers?: object, signal?: AbortSignal) => Promise<LookupMarketplaceReturn>;
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
declare enum ContractType$1 {
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
interface Page$2 {
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
  metadata: TokenMetadata$2;
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
  contractType: ContractType$1;
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
interface OrderData {
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
interface CreateReq {
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
interface CheckoutOptionsItem {
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
interface PrimarySaleItem {
  itemAddress: string;
  contractType: ContractType$1;
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
  metadata: TokenMetadata$2;
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
interface TokenMetadata$2 {
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
  assets?: Array<Asset$1>;
  status: MetadataStatus;
}
interface Asset$1 {
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
  metadata: TokenMetadata$2;
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
  page?: Page$2;
}
interface ListListingsForCollectibleResponse {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListOffersForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListOffersForCollectibleResponse {
  offers: Array<Order>;
  page?: Page$2;
}
interface ListOrdersWithCollectiblesRequest {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: OrdersFilter;
  page?: Page$2;
}
interface ListOrdersWithCollectiblesResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
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
  page?: Page$2;
}
interface ListListingsResponse {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListOffersRequest {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListOffersResponse {
  offers: Array<Order>;
  page?: Page$2;
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
  page?: Page$2;
}
interface ListCollectibleListingsResponse$1 {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListCollectibleOffersRequest {
  chainId: string;
  contractAddress: string;
  tokenId: bigint;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListCollectibleOffersResponse$1 {
  offers: Array<Order>;
  page?: Page$2;
}
interface GenerateBuyTransactionRequest {
  chainId: string;
  collectionAddress: string;
  buyer: string;
  marketplace: MarketplaceKind;
  ordersData: Array<OrderData>;
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
  ordersData: Array<OrderData>;
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
  contractType: ContractType$1;
  orderbook: OrderbookKind;
  listing: CreateReq;
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
  contractType: ContractType$1;
  orderbook: OrderbookKind;
  offer: CreateReq;
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
  page?: Page$2;
}
interface ListCollectiblesResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
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
interface ListCollectiblesWithLowestListingRequest {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page$2;
}
interface ListCollectiblesWithLowestListingResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
}
interface ListCollectiblesWithHighestOfferRequest {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page$2;
}
interface ListCollectiblesWithHighestOfferResponse {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
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
  page?: Page$2;
}
interface GetOrdersResponse {
  orders: Array<Order>;
  page?: Page$2;
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
  items: Array<CheckoutOptionsItem>;
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
  page?: Page$2;
}
interface ListPrimarySaleItemsResponse {
  primarySaleItems: Array<CollectiblePrimarySaleItem>;
  page?: Page$2;
}
interface GetCountOfPrimarySaleItemsRequest {
  chainId: string;
  primarySaleContractAddress: string;
  filter?: PrimarySaleItemsFilter;
}
interface GetCountOfPrimarySaleItemsResponse {
  count: number;
}
declare class Marketplace$1 implements MarketplaceClient$1 {
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
 * Universal hash type (transaction, block, etc)
 */
type Hash$1 = Hash;
/**
 * Universal project identifier as number
 */
type ProjectId = number;
//#endregion
//#endregion
//#region ../api/dist/types.d.ts
//#region src/adapters/indexer/types.d.ts
type ContractInfoExtensions$1$1 = Omit<ContractInfoExtensions, 'originChainId' | 'originAddress'> & {
  originChainId?: ChainId;
  originAddress?: Address$1;
};
type ContractInfo$1$1 = Omit<ContractInfo, 'chainId' | 'address' | 'extensions'> & {
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
};
type TokenMetadata$1$1 = Omit<TokenMetadata, 'tokenId'> & {
  tokenId: TokenId;
};
type TokenBalance$1 = Omit<TokenBalance, 'tokenID' | 'balance' | 'chainId' | 'contractAddress' | 'accountAddress' | 'uniqueCollectibles' | 'contractInfo' | 'tokenMetadata'> & {
  tokenId: TokenId;
  balance: Amount;
  chainId: ChainId;
  contractAddress: Address$1;
  accountAddress: Address$1;
  uniqueCollectibles?: Amount;
  contractInfo?: ContractInfo$1$1;
  tokenMetadata?: TokenMetadata$1$1;
};
type TokenSupply$1 = Omit<TokenSupply, 'tokenID' | 'supply' | 'chainId' | 'contractInfo' | 'tokenMetadata'> & {
  tokenId: TokenId;
  supply: Amount;
  chainId: ChainId;
  contractAddress?: Address$1;
  contractInfo?: ContractInfo$1$1;
  tokenMetadata?: TokenMetadata$1$1;
};
type TransactionLog$1 = Omit<TransactionLog, 'contractAddress' | 'index'> & {
  address: Address$1;
  logIndex: number;
};
type TransactionReceipt$1 = Omit<TransactionReceipt, 'effectiveGasPrice' | 'from' | 'to' | 'logs'> & {
  chainId?: ChainId;
  from?: Address$1;
  to?: Address$1;
  effectiveGasPrice: Amount;
  logs: TransactionLog$1[];
};
type TokenIDRange$1 = Omit<TokenIDRange, 'start' | 'end'> & {
  startTokenId: TokenId;
  endTokenId: TokenId;
};
type Page$1$1 = Page;
type MetadataOptions$1 = Omit<MetadataOptions, 'includeContracts'> & {
  includeContracts?: Array<Address$1>;
};
type GetTokenBalancesRequest = Omit<GetTokenBalancesArgs, 'accountAddress' | 'contractAddress' | 'tokenID' | 'page' | 'metadataOptions'> & {
  tokenId?: TokenId;
  metadataOptions?: MetadataOptions$1;
  page?: Page$1$1;
} & ({
  accountAddress: Address$1;
  userAddress?: never;
} | {
  userAddress: Address$1;
  accountAddress?: never;
}) & ({
  contractAddress?: Address$1;
  collectionAddress?: never;
} | {
  collectionAddress?: Address$1;
  contractAddress?: never;
});
type GetTokenBalancesResponse = Omit<GetTokenBalancesReturn, 'balances' | 'page'> & {
  balances: TokenBalance$1[];
  page: Page$1$1;
};
type GetTokenSuppliesRequest = Omit<GetTokenSuppliesArgs, 'contractAddress' | 'page' | 'metadataOptions'> & {
  metadataOptions?: MetadataOptions$1;
  page?: Page$1$1;
} & ({
  contractAddress: Address$1;
  collectionAddress?: never;
} | {
  collectionAddress: Address$1;
  contractAddress?: never;
});
type GetTokenSuppliesResponse = Omit<GetTokenSuppliesReturn, 'page' | 'tokenIDs'> & {
  contractAddress: Address$1;
  tokenIDs: TokenSupply$1[];
  supplies: TokenSupply$1[];
  page: Page$1$1;
};
type GetTokenIDRangesRequest = Omit<GetTokenIDRangesArgs, 'contractAddress'> & ({
  contractAddress: Address$1;
  collectionAddress?: never;
} | {
  collectionAddress: Address$1;
  contractAddress?: never;
});
type GetTokenIDRangesResponse = Omit<GetTokenIDRangesReturn, 'tokenIDRanges'> & {
  contractAddress: Address$1;
  tokenIDRanges: TokenIDRange$1[];
  ranges: TokenIDRange$1[];
};
type NativeTokenBalance$1 = Omit<NativeTokenBalance, 'accountAddress' | 'chainId' | 'balance'> & {
  accountAddress: Address$1;
  chainId: ChainId;
  balance: Amount;
};
type GetTokenBalancesDetailsResponse = Omit<GetTokenBalancesDetailsReturn, 'page' | 'nativeBalances' | 'balances'> & {
  page: Page$1$1;
  nativeBalances: NativeTokenBalance$1[];
  balances: TokenBalance$1[];
};
type GetTokenBalancesByContractResponse = Omit<GetTokenBalancesByContractReturn, 'page' | 'balances'> & {
  page: Page$1$1;
  balances: TokenBalance$1[];
};
type TokenBalancesByContractFilter$1 = Omit<TokenBalancesByContractFilter, 'contractAddresses' | 'accountAddresses'> & {
  contractAddresses: Array<Address$1>;
  accountAddresses?: Array<Address$1>;
};
type GetTokenBalancesByContractRequest = Omit<GetTokenBalancesByContractArgs, 'filter'> & {
  filter: TokenBalancesByContractFilter$1;
};
type GetUserCollectionBalancesRequest = Pick<GetTokenBalancesByContractArgs, 'omitMetadata'> & {
  userAddress: Address$1;
  collectionAddress: Address$1;
  includeMetadata?: boolean;
};
type TokenBalancesFilter$1 = Omit<TokenBalancesFilter, 'accountAddresses' | 'contractWhitelist' | 'contractBlacklist'> & {
  accountAddresses: Array<Address$1>;
  contractWhitelist?: Array<Address$1>;
  contractBlacklist?: Array<Address$1>;
};
type GetTokenBalancesDetailsRequest = Omit<GetTokenBalancesDetailsArgs, 'filter'> & {
  filter: TokenBalancesFilter$1;
};
type GetNativeTokenBalanceResponse = Omit<GetNativeTokenBalanceReturn, 'balance'> & {
  balance: NativeTokenBalance$1;
};
type GetBalanceOfCollectibleRequest = Omit<GetTokenBalancesRequest, 'page' | 'contractAddress' | 'collectionAddress' | 'userAddress' | 'accountAddress'> & {
  chainId: ChainId;
  collectionAddress?: Address$1;
  contractAddress?: Address$1;
  userAddress?: Address$1;
  accountAddress?: Address$1;
};
type GetTokenBalancesSdkRequest = Omit<GetTokenBalancesRequest, 'contractAddress' | 'collectionAddress' | 'userAddress' | 'accountAddress'> & {
  chainId: ChainId;
  collectionAddress?: Address$1;
  contractAddress?: Address$1;
  userAddress?: Address$1;
  accountAddress?: Address$1;
};
//#endregion
//#endregion
//#region ../api/dist/types2.d.ts
//#region src/adapters/metadata/types.d.ts
type ContractInfoExtensionBridgeInfo$1 = Omit<ContractInfoExtensionBridgeInfo, 'tokenAddress'> & {
  tokenAddress: Address$1;
};
type ContractInfoExtensions$1$2 = Omit<ContractInfoExtensions$1, 'originChainId' | 'originAddress' | 'bridgeInfo'> & {
  originChainId?: ChainId;
  originAddress?: Address$1;
  bridgeInfo?: {
    [key: string]: ContractInfoExtensionBridgeInfo$1;
  };
};
type ContractInfo$1$2 = Omit<ContractInfo$1, 'chainId' | 'address' | 'extensions'> & {
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$2;
};
type Asset$1$1 = Omit<Asset, 'tokenId'> & {
  tokenId?: TokenId;
};
type TokenMetadata$1$2 = Omit<TokenMetadata$1, 'chainId' | 'contractAddress' | 'tokenId' | 'assets'> & {
  chainId?: ChainId;
  contractAddress?: Address$1;
  tokenId: TokenId;
  assets?: Asset$1$1[];
};
type Page$1$2 = Page$1;
type GetContractInfoArgs$1 = Omit<GetContractInfoArgs, 'chainID' | 'contractAddress'> & {
  chainId: ChainId;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
type GetContractInfoReturn$1 = Omit<GetContractInfoReturn, 'contractInfo'> & {
  contractInfo: ContractInfo$1$2;
  taskID?: number;
};
type GetContractInfoBatchArgs$1 = Omit<GetContractInfoBatchArgs, 'chainID'> & {
  chainId: ChainId;
};
type GetContractInfoBatchReturn$1 = Omit<GetContractInfoBatchReturn, 'contractInfoMap'> & {
  contractInfoMap: {
    [key: string]: ContractInfo$1$2;
  };
  taskID?: number;
};
type GetTokenMetadataArgs$1 = Omit<GetTokenMetadataArgs, 'chainID' | 'contractAddress' | 'tokenIDs'> & {
  chainId: ChainId;
  tokenIds: TokenId[];
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
type GetTokenMetadataReturn$1 = Omit<GetTokenMetadataReturn, 'tokenMetadata'> & {
  tokenMetadata: TokenMetadata$1$2[];
  taskID?: number;
};
type GetTokenMetadataBatchArgs$1 = Omit<GetTokenMetadataBatchArgs, 'chainID' | 'contractTokenMap'> & {
  chainId: ChainId;
  contractTokenMap: {
    [key: string]: TokenId[];
  };
};
type GetTokenMetadataBatchReturn$1 = Omit<GetTokenMetadataBatchReturn, 'contractTokenMetadata'> & {
  contractTokenMetadata: {
    [key: string]: TokenMetadata$1$2[];
  };
  taskID?: number;
};
type RefreshTokenMetadataArgs$1 = Omit<RefreshTokenMetadataArgs, 'chainID' | 'contractAddress' | 'tokenIDs'> & {
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
type RefreshTokenMetadataReturn$1 = RefreshTokenMetadataReturn;
type SearchTokenMetadataArgs$1 = Omit<SearchTokenMetadataArgs, 'chainID' | 'contractAddress'> & {
  chainId: ChainId;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
type SearchTokenMetadataReturn$1 = Omit<SearchTokenMetadataReturn, 'tokenMetadata'> & {
  page: Page$1$2;
  tokenMetadata: TokenMetadata$1$2[];
};
type GetTokenMetadataPropertyFiltersArgs$1 = Omit<GetTokenMetadataPropertyFiltersArgs, 'chainID' | 'contractAddress'> & {
  chainId: ChainId;
} & ({
  contractAddress: string;
  collectionAddress?: never;
} | {
  collectionAddress: string;
  contractAddress?: never;
});
type GetTokenMetadataPropertyFiltersReturn$1 = GetTokenMetadataPropertyFiltersReturn;
type GetSingleTokenMetadataArgs = Omit<GetTokenMetadataArgs$1, 'tokenIds' | 'contractAddress' | 'collectionAddress'> & {
  contractAddress?: Address$1;
  collectionAddress?: Address$1;
  tokenId: TokenId;
};
type GetFiltersArgs = Omit<GetTokenMetadataPropertyFiltersArgs$1, 'excludeProperties' | 'contractAddress' | 'collectionAddress'> & {
  contractAddress?: Address$1;
  collectionAddress?: Address$1;
  showAllFilters?: boolean;
};
type GetContractInfoSdkArgs = Omit<GetContractInfoArgs$1, 'contractAddress' | 'collectionAddress'> & {
  contractAddress?: Address$1;
  collectionAddress?: Address$1;
};
type GetTokenMetadataSdkArgs = Omit<GetTokenMetadataArgs$1, 'contractAddress' | 'collectionAddress'> & {
  contractAddress?: Address$1;
  collectionAddress?: Address$1;
};
type SearchTokenMetadataSdkArgs = Omit<SearchTokenMetadataArgs$1, 'contractAddress' | 'collectionAddress'> & {
  contractAddress?: Address$1;
  collectionAddress?: Address$1;
};
//#endregion
//#endregion
//#region ../api/dist/index.d.ts
//#region src/adapters/marketplace/types.d.ts
type Currency$1 = Omit<Currency, 'contractAddress'> & {
  contractAddress: Address;
};
type PrimarySaleItem$1 = Omit<PrimarySaleItem, 'currencyAddress' | 'itemAddress'> & {
  currencyAddress: Address;
  itemAddress: Address;
};
type CollectiblePrimarySaleItem$1 = Omit<CollectiblePrimarySaleItem, 'primarySaleItem'> & {
  primarySaleItem: PrimarySaleItem$1;
};
type Order$1 = Omit<Order, 'priceCurrencyAddress'> & {
  priceCurrencyAddress: Address;
};
type CollectibleOrder$1 = Omit<CollectibleOrder, 'order' | 'listing' | 'offer'> & {
  order?: Order$1;
  listing?: Order$1;
  offer?: Order$1;
};
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
type GetPrimarySaleCheckoutOptionsRequest = Omit<CheckoutOptionsSalesContractRequest, 'chainId' | 'wallet' | 'contractAddress' | 'collectionAddress'> & {
  chainId: ChainId;
  walletAddress: Address;
  contractAddress: Address;
  collectionAddress: Address;
};
//#endregion
//#region src/adapters/marketplace/client.d.ts
type CheckoutOptionsItem$1 = Omit<CheckoutOptionsItem, 'tokenId'> & {
  tokenId: TokenId;
};
type CreateReq$1 = Omit<CreateReq, 'currencyAddress' | 'tokenId'> & {
  currencyAddress: Address$1;
  tokenId: TokenId;
};
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
  listing: CreateReq$1;
};
type GenerateOfferTransactionRequest$1 = Omit<GenerateOfferTransactionRequest, 'chainId' | 'contractType' | 'offer'> & {
  chainId: ChainId;
  contractType: ContractType;
  offer: CreateReq$1;
};
/**
 * SDK-facing OrderData type with bigint quantity
 */
type OrderData$1 = Omit<OrderData, 'tokenId'> & {
  tokenId?: TokenId;
};
type GenerateSellTransactionRequest$1 = Omit<GenerateSellTransactionRequest, 'chainId' | 'ordersData'> & {
  chainId: ChainId;
  ordersData: Array<OrderData$1>;
};
type GenerateCancelTransactionRequest$1 = Omit<GenerateCancelTransactionRequest, 'chainId'> & {
  chainId: ChainId;
};
type GenerateBuyTransactionRequest$1 = Omit<GenerateBuyTransactionRequest, 'chainId' | 'ordersData'> & {
  chainId: ChainId;
  ordersData: Array<OrderData$1>;
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
  items: Array<CheckoutOptionsItem$1>;
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
  queryKey: Marketplace$1['queryKey'];
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
  get raw(): Marketplace$1;
}
//#endregion
//#region src/adapters/builder/types.d.ts
type LookupMarketplaceArgs$1 = Omit<LookupMarketplaceArgs, 'projectId' | 'userAddress'> & {
  projectId?: ProjectId;
  userAddress?: Address$1;
};
type LookupMarketplaceReturn$1 = Omit<LookupMarketplaceReturn, 'marketplace' | 'marketCollections' | 'shopCollections'> & {
  marketplace: Marketplace$2;
  marketCollections: MarketCollection$1[];
  shopCollections: ShopCollection$1[];
};
type Marketplace$2 = Omit<Marketplace, 'projectId' | 'market' | 'shop'> & {
  projectId: ProjectId;
  market: MarketPage;
  shop: ShopPage;
};
type MarketplaceSettings$1 = Omit<MarketplaceSettings, 'style' | 'walletOptions'> & {
  style: Record<string, unknown>;
  walletOptions: MarketplaceWallet$1;
};
type MarketplacePage$1 = MarketplacePage;
type MarketPage = MarketplacePage$1 & {
  collections: MarketCollection$1[];
};
type ShopPage = MarketplacePage$1 & {
  collections: ShopCollection$1[];
};
type MarketplaceSocials$1 = MarketplaceSocials;
type MarketplaceWallet$1 = Omit<MarketplaceWallet, 'ecosystem' | 'embedded'> & {
  ecosystem?: MarketplaceWalletEcosystem$1;
  embedded?: MarketplaceWalletEmbedded$1;
};
type MarketplaceWalletEcosystem$1 = MarketplaceWalletEcosystem;
type MarketplaceWalletEmbedded$1 = Omit<MarketplaceWalletEmbedded, 'providers'> & {
  providers: OpenIdProvider$1[];
};
type OpenIdProvider$1 = OpenIdProvider;
type CollectionFilterSettings$1 = Omit<CollectionFilterSettings, 'exclusions'> & {
  exclusions: MetadataFilterRule$1[];
};
type MetadataFilterRule$1 = Omit<MetadataFilterRule, 'condition'> & {
  condition: FilterCondition;
};
type MarketCollection$1 = Omit<MarketCollection, 'projectId' | 'chainId' | 'itemsAddress' | 'contractType' | 'destinationMarketplace' | 'filterSettings'> & {
  marketplaceCollectionType: 'market';
  projectId: ProjectId;
  chainId: ChainId;
  itemsAddress: Address$1;
  contractType: ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings$1;
};
type ShopCollection$1 = Omit<ShopCollection, 'projectId' | 'chainId' | 'itemsAddress' | 'saleAddress' | 'tokenIds' | 'customTokenIds'> & {
  marketplaceCollectionType: 'shop';
  projectId: ProjectId;
  chainId: ChainId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
};
type MarketplaceCollection = MarketCollection$1 | ShopCollection$1;
type MarketplaceService$1 = MarketplaceService;
//#endregion
//#region src/adapters/builder/transforms.d.ts
declare function toLookupMarketplaceReturn(data: LookupMarketplaceReturn): LookupMarketplaceReturn$1;
declare function toMarketCollection(data: MarketCollection): MarketCollection$1;
declare function toShopCollection(data: ShopCollection): ShopCollection$1;
declare function fromLookupMarketplaceReturn(data: LookupMarketplaceReturn$1): LookupMarketplaceReturn;
declare function fromMarketCollection(data: MarketCollection$1): MarketCollection;
declare function fromShopCollection(data: ShopCollection$1): ShopCollection;
declare namespace index_d_exports {
  export { builder_gen_d_exports as BuilderAPI, CollectionFilterSettings$1 as CollectionFilterSettings, FilterCondition, LookupMarketplaceArgs$1 as LookupMarketplaceArgs, LookupMarketplaceReturn$1 as LookupMarketplaceReturn, MarketCollection$1 as MarketCollection, MarketPage, Marketplace$2 as Marketplace, MarketplaceCollection, MarketplacePage$1 as MarketplacePage, MarketplaceService$1 as MarketplaceService, MarketplaceSettings$1 as MarketplaceSettings, MarketplaceSocials$1 as MarketplaceSocials, MarketplaceWallet$1 as MarketplaceWallet, MarketplaceWalletEcosystem$1 as MarketplaceWalletEcosystem, MarketplaceWalletEmbedded$1 as MarketplaceWalletEmbedded, MarketplaceWalletType, MetadataFilterRule$1 as MetadataFilterRule, OpenIdProvider$1 as OpenIdProvider, ShopCollection$1 as ShopCollection, ShopPage, WebrpcBadMethodError, WebrpcBadRequestError, WebrpcBadResponseError, WebrpcBadRouteError, WebrpcClientDisconnectedError, WebrpcEndpointError, WebrpcError, WebrpcInternalErrorError, WebrpcRequestFailedError, WebrpcServerPanicError, WebrpcStreamFinishedError, WebrpcStreamLostError, fromLookupMarketplaceReturn, fromMarketCollection, fromShopCollection, toLookupMarketplaceReturn, toMarketCollection, toShopCollection };
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
   * Get token balances for a user in a specific collection
   * Convenience method with user-friendly parameter names
   */
  getUserCollectionBalances(args: GetUserCollectionBalancesRequest): Promise<TokenBalance$1[]>;
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
declare function toContractInfo$1(raw: IndexerGen.ContractInfo): ContractInfo$1$1 | undefined;
declare function toTokenMetadata$1(raw: IndexerGen.TokenMetadata): TokenMetadata$1$1;
declare function toNativeTokenBalance(raw: IndexerGen.NativeTokenBalance): NativeTokenBalance$1;
declare function toTokenBalance(raw: IndexerGen.TokenBalance): TokenBalance$1;
declare function toTokenSupply(raw: IndexerGen.TokenSupply, contractAddress?: Address$1): TokenSupply$1;
declare function toTransactionReceipt(raw: IndexerGen.TransactionReceipt): TransactionReceipt$1;
declare function toTokenIDRange(raw: IndexerGen.TokenIDRange): TokenIDRange$1;
declare function toPage(raw: IndexerGen.Page | undefined): Page$1$1;
declare function toGetTokenBalancesResponse(raw: IndexerGen.GetTokenBalancesReturn): GetTokenBalancesResponse;
declare function toGetTokenSuppliesResponse(raw: IndexerGen.GetTokenSuppliesReturn, contractAddress: Address$1): GetTokenSuppliesResponse;
declare function toGetTokenIDRangesResponse(raw: IndexerGen.GetTokenIDRangesReturn, contractAddress: Address$1): GetTokenIDRangesResponse;
declare function toGetTokenBalancesDetailsResponse(raw: IndexerGen.GetTokenBalancesDetailsReturn): GetTokenBalancesDetailsResponse;
declare function toGetTokenBalancesByContractResponse(raw: IndexerGen.GetTokenBalancesByContractReturn): GetTokenBalancesByContractResponse;
declare function toGetNativeTokenBalanceResponse(raw: IndexerGen.GetNativeTokenBalanceReturn): GetNativeTokenBalanceResponse;
declare function toGetTokenBalancesArgs(req: GetTokenBalancesRequest): IndexerGen.GetTokenBalancesArgs;
declare function toGetTokenSuppliesArgs(req: GetTokenSuppliesRequest): IndexerGen.GetTokenSuppliesArgs;
declare function toGetTokenIDRangesArgs(req: GetTokenIDRangesRequest): IndexerGen.GetTokenIDRangesArgs;
declare function toGetUserCollectionBalancesArgs(req: GetUserCollectionBalancesRequest): IndexerGen.GetTokenBalancesByContractArgs;
declare namespace index_d_exports$1 {
  export { ContractInfo$1$1 as ContractInfo, ContractInfoExtensions$1$1 as ContractInfoExtensions, ContractType, GetBalanceOfCollectibleRequest, GetNativeTokenBalanceResponse, GetTokenBalancesByContractRequest, GetTokenBalancesByContractResponse, GetTokenBalancesDetailsRequest, GetTokenBalancesDetailsResponse, GetTokenBalancesRequest, GetTokenBalancesResponse, GetTokenBalancesSdkRequest, GetTokenIDRangesRequest, GetTokenIDRangesResponse, GetTokenSuppliesRequest, GetTokenSuppliesResponse, GetUserCollectionBalancesRequest, IndexerGen as IndexerAPI, IndexerClient, MetadataOptions$1 as MetadataOptions, NativeTokenBalance$1 as NativeTokenBalance, Page$1$1 as Page, ResourceStatus, TokenBalance$1 as TokenBalance, TokenBalancesByContractFilter$1 as TokenBalancesByContractFilter, TokenBalancesFilter$1 as TokenBalancesFilter, TokenIDRange$1 as TokenIDRange, TokenMetadata$1$1 as TokenMetadata, TokenSupply$1 as TokenSupply, TransactionLog$1 as TransactionLog, TransactionReceipt$1 as TransactionReceipt, TransactionStatus, TransactionType, toContractInfo$1 as toContractInfo, toGetNativeTokenBalanceResponse, toGetTokenBalancesArgs, toGetTokenBalancesByContractResponse, toGetTokenBalancesDetailsResponse, toGetTokenBalancesResponse, toGetTokenIDRangesArgs, toGetTokenIDRangesResponse, toGetTokenSuppliesArgs, toGetTokenSuppliesResponse, toGetUserCollectionBalancesArgs, toNativeTokenBalance, toPage, toTokenBalance, toTokenIDRange, toTokenMetadata$1 as toTokenMetadata, toTokenSupply, toTransactionReceipt };
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
  getContractInfo(args: GetContractInfoArgs$1): Promise<GetContractInfoReturn$1>;
  /**
   * Get contract info batch
   * Accepts normalized types (chainId: number)
   */
  getContractInfoBatch(args: GetContractInfoBatchArgs$1): Promise<GetContractInfoBatchReturn$1>;
  /**
   * Get token metadata
   * Accepts normalized types (chainId: number, tokenIds: bigint[])
   */
  getTokenMetadata(args: GetTokenMetadataArgs$1): Promise<GetTokenMetadataReturn$1>;
  /**
   * Get token metadata batch
   * Accepts normalized types (chainId: number, tokenIds: bigint[])
   */
  getTokenMetadataBatch(args: GetTokenMetadataBatchArgs$1): Promise<GetTokenMetadataBatchReturn$1>;
  /**
   * Refresh token metadata
   * Accepts normalized types (chainId: number, tokenIds: bigint[])
   */
  refreshTokenMetadata(args: RefreshTokenMetadataArgs$1): Promise<RefreshTokenMetadataReturn$1>;
  /**
   * Search token metadata
   * Accepts normalized types (chainId: number)
   */
  searchTokenMetadata(args: SearchTokenMetadataArgs$1): Promise<SearchTokenMetadataReturn$1>;
  /**
   * Get token metadata property filters
   * Accepts normalized types (chainId: number)
   */
  getTokenMetadataPropertyFilters(args: GetTokenMetadataPropertyFiltersArgs$1): Promise<GetTokenMetadataPropertyFiltersReturn$1>;
  /**
   * Access the underlying raw client if needed
   * (for advanced use cases or methods not yet wrapped)
   */
  get raw(): SequenceMetadata;
}
//#endregion
//#region src/adapters/metadata/transforms.d.ts

//#endregion
export { PrimarySaleItem$1 as $, GetCollectionActiveOffersCurrenciesRequest as $t, ListCollectibleOffersResponse as A, MetadataOptions$1 as At, ListPrimarySaleItemsRequest$1 as B, AdditionalFee as Bt, GetHighestPriceOfferForCollectibleRequest$1 as C, TransactionOnRampProvider as Cn, GetTokenBalancesResponse as Ct, GetPrimarySaleItemResponse$1 as D, GetTokenSuppliesRequest as Dt, GetPrimarySaleItemRequest$1 as E, MarketplaceWalletType as En, GetTokenIDRangesResponse as Et, ListListingsForCollectibleResponse$1 as F, Address$1 as Ft, MarketplaceClient as G, CollectiblesFilter as Gt, LookupMarketplaceReturn$1 as H, CheckoutOptions as Ht, ListOffersForCollectibleRequest$1 as I, ChainId as It, MarketplaceWallet$1 as J, CurrencyStatus as Jt, MarketplaceCollection as K, Collection as Kt, ListOffersForCollectibleResponse$1 as L, Hash$1 as Lt, ListCollectiblesResponse$1 as M, TokenBalance$1 as Mt, ListCurrenciesRequest$1 as N, TokenBalancesFilter$1 as Nt, IndexerClient as O, GetTokenSuppliesResponse as Ot, ListListingsForCollectibleRequest$1 as P, TokenMetadata$1$1 as Pt, OrderData$1 as Q, GetCollectionActiveListingsCurrenciesRequest as Qt, ListOrdersWithCollectiblesRequest$1 as R, ProjectId as Rt, GetFloorOrderRequest$1 as S, TransactionCrypto as Sn, GetTokenBalancesDetailsResponse as St, GetPrimarySaleCheckoutOptionsRequest as T, FilterCondition as Tn, GetTokenIDRangesRequest as Tt, MarketCollection$1 as U, CheckoutOptionsSalesContractResponse as Ut, ListPrimarySaleItemsResponse$1 as V, Asset$1 as Vt, MarketPage as W, Collectible as Wt, OpenIdProvider$1 as X, GetCollectibleHighestOfferRequest as Xt, MetadataClient as Y, ExecuteType as Yt, Order$1 as Z, GetCollectibleHighestOfferResponse as Zt, GetCountOfFilteredCollectiblesRequest$1 as _, PropertyType as _n, SearchTokenMetadataReturn$1 as _t, CollectiblePrimarySaleItem$1 as a, MetadataStatus as an, TransactionStep as at, GetCountOfOffersForCollectibleRequest$1 as b, StepType as bn, GetBalanceOfCollectibleRequest as bt, CreateReq$1 as c, OrderSide as cn, isSignatureStep as ct, GenerateListingTransactionRequest$1 as d, OrdersFilter as dn, ContractInfoExtensions$1$2 as dt, GetCountOfListingsForCollectibleResponse as en, ShopCollection$1 as et, GenerateOfferTransactionRequest$1 as f, Page$2 as fn, Filter as ft, GetCountOfAllOrdersRequest$1 as g, PropertyFilter as gn, GetTokenMetadataSdkArgs as gt, GetCountOfAllCollectiblesRequest$1 as h, PrimarySaleItemsFilter as hn, GetSingleTokenMetadataArgs as ht, CollectibleOrder$1 as i, MarketplaceKind as in, Step$1 as it, ListCollectiblesRequest$1 as j, Page$1$1 as jt, ListCollectibleListingsResponse as k, GetUserCollectionBalancesRequest as kt, Currency$1 as l, OrderStatus as ln, isTransactionStep as lt, GetCollectionDetailRequest$1 as m, PriceFilter as mn, GetFiltersArgs as mt, CheckoutOptionsItem$1 as n, GetCountOfPrimarySaleItemsResponse as nn, Signature$1 as nt, CollectionFilterSettings$1 as o, OfferType as on, index_d_exports as ot, GenerateSellTransactionRequest$1 as p, PostRequest as pn, GetContractInfoSdkArgs as pt, MarketplaceSettings$1 as q, CollectionStatus as qt, CheckoutOptionsMarketplaceRequest$1 as r, ListCollectibleListingsRequest as rn, SignatureStep as rt, ContractType$2 as s, OrderFilter as sn, index_d_exports$1 as st, ApprovalStep as t, GetCountOfOffersForCollectibleResponse as tn, ShopPage as tt, GenerateCancelTransactionRequest$1 as u, OrderbookKind as un, ContractInfo$1$2 as ut, GetCountOfFilteredOrdersRequest$1 as v, SortBy as vn, SearchTokenMetadataSdkArgs as vt, GetLowestPriceListingForCollectibleRequest$1 as w, WalletKind as wn, GetTokenBalancesSdkRequest as wt, GetCountOfPrimarySaleItemsRequest$1 as x, TokenMetadata$2 as xn, GetTokenBalancesDetailsRequest as xt, GetCountOfListingsForCollectibleRequest$1 as y, SortOrder as yn, TokenMetadata$1$2 as yt, ListOrdersWithCollectiblesResponse$1 as z, TokenId as zt };
//# sourceMappingURL=index2.d.ts.map