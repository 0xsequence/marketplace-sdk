import * as wagmi0 from "wagmi";
import { CreateConnectorFn } from "wagmi";
import { Wallet } from "@0xsequence/connect";
import * as _tanstack_react_query372 from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { SequenceAPIClient } from "@0xsequence/api";
import { SequenceIndexer } from "@0xsequence/indexer";
import { SequenceMetadata } from "@0xsequence/metadata";
import { Address, Chain, Hash, Transport } from "viem";
import { Databeat, Event } from "@databeat/tracker";
import "@xstate/store";

//#region src/react/_internal/api/builder.gen.d.ts
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
  marketplace: Marketplace$1;
  marketCollections: Array<MarketCollection$2>;
  shopCollections: Array<ShopCollection$2>;
}
interface Marketplace$1 {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketplacePage$1;
  shop: MarketplacePage$1;
  createdAt?: string;
  updatedAt?: string;
}
interface MarketplaceSettings {
  style: {
    [key: string]: any;
  };
  publisherId: string;
  title: string;
  socials: MarketplaceSocials$1;
  faviconUrl: string;
  walletOptions: MarketplaceWallet;
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
interface MarketCollection$2 {
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
interface ShopCollection$2 {
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
//#region src/react/_internal/api/builder-api.d.ts
declare class BuilderAPI extends MarketplaceService {
  projectAccessKey?: string | undefined;
  jwtAuth?: string | undefined;
  constructor(hostname: string, projectAccessKey?: string | undefined, jwtAuth?: string | undefined);
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
//#endregion
//#region src/react/_internal/api/get-query-client.d.ts
declare function getQueryClient(): QueryClient;
//#endregion
//#region src/react/_internal/api/marketplace.gen.d.ts
declare const WebrpcVersion = "v1";
declare const WebrpcSchemaVersion = "";
declare const WebrpcSchemaHash = "449bbd3abca8b0fc38376c11d82c94413000a0d6";
interface AdminClient {
  createCollection(req: CreateCollectionRequest, headers?: object, signal?: AbortSignal): Promise<CreateCollectionResponse>;
  getCollection(req: GetCollectionRequest, headers?: object, signal?: AbortSignal): Promise<GetCollectionResponse>;
  updateCollection(req: UpdateCollectionRequest, headers?: object, signal?: AbortSignal): Promise<UpdateCollectionResponse>;
  listCollections(req: ListCollectionsRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectionsResponse>;
  deleteCollection(req: DeleteCollectionRequest, headers?: object, signal?: AbortSignal): Promise<DeleteCollectionResponse>;
  /**
   * determine what should happen here
   */
  syncCollection(req: SyncCollectionRequest, headers?: object, signal?: AbortSignal): Promise<SyncCollectionResponse>;
  createPrimarySaleContract(req: CreatePrimarySaleContractRequest, headers?: object, signal?: AbortSignal): Promise<CreatePrimarySaleContractResponse>;
  deletePrimarySaleContract(req: DeletePrimarySaleContractRequest, headers?: object, signal?: AbortSignal): Promise<DeletePrimarySaleContractResponse>;
  createCurrency(req: CreateCurrencyRequest, headers?: object, signal?: AbortSignal): Promise<CreateCurrencyResponse>;
  createCurrencies(req: CreateCurrenciesRequest, headers?: object, signal?: AbortSignal): Promise<CreateCurrenciesResponse>;
  updateCurrency(req: UpdateCurrencyRequest, headers?: object, signal?: AbortSignal): Promise<UpdateCurrencyResponse>;
  listCurrencies(req: ListCurrenciesRequest, headers?: object, signal?: AbortSignal): Promise<ListCurrenciesResponse>;
  deleteCurrency(req: DeleteCurrencyRequest, headers?: object, signal?: AbortSignal): Promise<DeleteCurrencyResponse>;
  /**
   * This for manual adding of non minted ERC1155 tokens, it's used for purposes of Shop.
   */
  addCollectibles(req: AddCollectiblesRequest, headers?: object, signal?: AbortSignal): Promise<AddCollectiblesResponse>;
}
interface MarketplaceClient {
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
  listCollectibleListings(req: ListCollectibleListingsRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectibleListingsResponse>;
  /**
   * @deprecated Please use ListOffersForCollectible instead.
   */
  listCollectibleOffers(req: ListCollectibleOffersRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectibleOffersResponse>;
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
  listCollectionActivities(req: ListCollectionActivitiesRequest, headers?: object, signal?: AbortSignal): Promise<ListCollectionActivitiesResponse>;
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
declare enum SourceKind {
  unknown = "unknown",
  external = "external",
  sequence_marketplace_v1 = "sequence_marketplace_v1",
  sequence_marketplace_v2 = "sequence_marketplace_v2",
  opensea = "opensea",
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
declare enum ContractType {
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
declare enum ProjectStatus {
  unknown = "unknown",
  active = "active",
  inactive = "inactive",
}
declare enum ItemsContractStatus {
  unknown = "unknown",
  created = "created",
  syncing_contract_metadata = "syncing_contract_metadata",
  synced_contract_metadata = "synced_contract_metadata",
  syncing_tokens = "syncing_tokens",
  synced_tokens = "synced_tokens",
  active = "active",
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
declare enum PrimarySaleContractStatus {
  unknown = "unknown",
  created = "created",
  syncing_items = "syncing_items",
  active = "active",
  inactive = "inactive",
  incompatible_type = "incompatible_type",
  failed = "failed",
}
declare enum PrimarySaleVersion {
  v0 = "v0",
  v1 = "v1",
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
interface Filter$1 {
  text?: string;
  properties?: Array<PropertyFilter$1>;
}
interface PropertyFilter$1 {
  name: string;
  type: PropertyType;
  min?: number;
  max?: number;
  values?: Array<any>;
}
interface CollectiblesFilter {
  includeEmpty: boolean;
  searchText?: string;
  properties?: Array<PropertyFilter$1>;
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
  properties?: Array<PropertyFilter$1>;
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
  min?: string;
  max?: string;
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
  tokenId?: string;
  createdBy: string;
  priceAmount: string;
  priceAmountFormatted: string;
  priceAmountNet: string;
  priceAmountNetFormatted: string;
  priceCurrencyAddress: string;
  priceDecimals: number;
  priceUSD: number;
  priceUSDFormatted: string;
  quantityInitial: string;
  quantityInitialFormatted: string;
  quantityRemaining: string;
  quantityRemainingFormatted: string;
  quantityAvailable: string;
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
  metadata: TokenMetadata$1;
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
  contractType: ContractType;
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
interface Project {
  projectId: number;
  chainId: number;
  contractAddress: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface ItemsContract {
  status: ItemsContractStatus;
  chainId: number;
  contractAddress: string;
  contractType: ContractType;
  lastSynced: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface Collectible {
  status: CollectibleStatus;
  tokenId: string;
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
  quantity: string;
  tokenId?: string;
}
interface AdditionalFee {
  amount: string;
  receiver: string;
}
interface Step {
  id: StepType;
  data: string;
  to: string;
  value: string;
  price: string;
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
  tokenId: string;
  quantity: string;
  expiry: string;
  currencyAddress: string;
  pricePerToken: string;
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
interface CheckoutOptionsMarketplaceOrder {
  contractAddress: string;
  orderId: string;
  marketplace: MarketplaceKind;
}
interface CheckoutOptionsItem {
  tokenId: string;
  quantity: string;
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
  tokenId: string;
  action: ActivityAction;
  txHash: string;
  from: string;
  to?: string;
  quantity: string;
  quantityDecimals: number;
  priceAmount?: string;
  priceAmountFormatted?: string;
  priceCurrencyAddress?: string;
  priceDecimals?: number;
  activityCreatedAt: string;
  uniqueHash: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface PrimarySaleContract {
  chainId: number;
  contractAddress: string;
  collectionAddress: string;
  contractType: ContractType;
  version: PrimarySaleVersion;
  currencyAddress: string;
  priceDecimals: number;
  status: PrimarySaleContractStatus;
  lastSynced: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface PrimarySaleItem {
  itemAddress: string;
  contractType: ContractType;
  tokenId: string;
  itemType: PrimarySaleItemDetailType;
  startDate: string;
  endDate: string;
  currencyAddress: string;
  priceDecimals: number;
  priceAmount: string;
  priceAmountFormatted: string;
  priceUsd: number;
  priceUsdFormatted: string;
  supply: string;
  supplyCap: string;
  unlimitedSupply: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
interface CollectiblePrimarySaleItem {
  metadata: TokenMetadata$1;
  primarySaleItem: PrimarySaleItem;
}
interface PrimarySaleItemsFilter {
  includeEmpty: boolean;
  searchText?: string;
  properties?: Array<PropertyFilter$1>;
  detailTypes?: Array<PrimarySaleItemDetailType>;
  startDateAfter?: string;
  startDateBefore?: string;
  endDateAfter?: string;
  endDateBefore?: string;
}
interface TokenMetadata$1 {
  tokenId: string;
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
  tokenId: string;
  url?: string;
  metadataField: string;
  name?: string;
  filesize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  updatedAt?: string;
}
interface CreateCollectionRequest {
  chainId: string;
  projectId: number;
  contractAddress: string;
}
interface CreateCollectionResponse {
  collection: Collection;
}
interface GetCollectionRequest {
  chainId: string;
  projectId: number;
  contractAddress: string;
}
interface GetCollectionResponse {
  collection: Collection;
}
interface UpdateCollectionRequest {
  chainId: string;
  collection: Collection;
}
interface UpdateCollectionResponse {
  collection: Collection;
}
interface ListCollectionsRequest {
  chainId: string;
  projectId: number;
  page?: Page$2;
}
interface ListCollectionsResponse {
  collections: Array<Collection>;
  page?: Page$2;
}
interface DeleteCollectionRequest {
  chainId: string;
  projectId: number;
  contractAddress: string;
}
interface DeleteCollectionResponse {
  collection: Collection;
}
interface SyncCollectionRequest {
  chainId: string;
  contractAddress: string;
}
interface SyncCollectionResponse {}
interface CreatePrimarySaleContractRequest {
  chainId: string;
  projectId: number;
  primarySaleContractAddress: string;
  itemsContractAddress: string;
}
interface CreatePrimarySaleContractResponse {
  primarySaleContract: PrimarySaleContract;
}
interface DeletePrimarySaleContractRequest {
  chainId: string;
  projectId: number;
  primarySaleContractAddress: string;
}
interface DeletePrimarySaleContractResponse {}
interface CreateCurrencyRequest {
  chainId: string;
  currency: Currency;
}
interface CreateCurrencyResponse {
  currency: Currency;
}
interface CreateCurrenciesRequest {
  chainId: string;
  currencies: Array<Currency>;
}
interface CreateCurrenciesResponse {
  currency: {
    [key: string]: Currency;
  };
}
interface UpdateCurrencyRequest {
  chainId: string;
  currency: Currency;
}
interface UpdateCurrencyResponse {
  currency: Currency;
}
interface ListCurrenciesRequest {
  chainId: string;
}
interface ListCurrenciesResponse {
  currencies: Array<Currency>;
}
interface DeleteCurrencyRequest {
  chainId: string;
  contractAddress: string;
}
interface DeleteCurrencyResponse {
  currency: Currency;
}
interface AddCollectiblesRequest {
  chainId: string;
  itemsContractAddress: string;
  tokenIds: Array<string>;
}
interface AddCollectiblesResponse {}
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
  tokenId: string;
}
interface GetCollectibleResponse {
  metadata: TokenMetadata$1;
}
interface GetLowestPriceOfferForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetLowestPriceOfferForCollectibleResponse {
  order: Order;
}
interface GetHighestPriceOfferForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetHighestPriceOfferForCollectibleResponse {
  order: Order;
}
interface GetLowestPriceListingForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetLowestPriceListingForCollectibleResponse {
  order: Order;
}
interface GetHighestPriceListingForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetHighestPriceListingForCollectibleResponse {
  order: Order;
}
interface ListListingsForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
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
  tokenId: string;
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
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCountOfListingsForCollectibleResponse {
  count: number;
}
interface GetCountOfOffersForCollectibleRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCountOfOffersForCollectibleResponse {
  count: number;
}
interface GetCollectibleLowestOfferRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleLowestOfferResponse {
  order?: Order;
}
interface GetCollectibleHighestOfferRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleHighestOfferResponse {
  order?: Order;
}
interface GetCollectibleLowestListingRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleLowestListingResponse {
  order?: Order;
}
interface GetCollectibleHighestListingRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleHighestListingResponse {
  order?: Order;
}
interface ListCollectibleListingsRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListCollectibleListingsResponse {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListCollectibleOffersRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListCollectibleOffersResponse {
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
}
interface GenerateBuyTransactionResponse {
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
}
interface GenerateSellTransactionResponse {
  steps: Array<Step>;
}
interface GenerateListingTransactionRequest {
  chainId: string;
  collectionAddress: string;
  owner: string;
  contractType: ContractType;
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
  contractType: ContractType;
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
interface ListCollectionActivitiesRequest {
  chainId: string;
  contractAddress: string;
  page?: Page$2;
}
interface ListCollectionActivitiesResponse {
  activities: Array<Activity>;
  page?: Page$2;
}
interface ListCollectibleActivitiesRequest {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  page?: Page$2;
}
interface ListCollectibleActivitiesResponse {
  activities: Array<Activity>;
  page?: Page$2;
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
  tokenId: string;
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
declare class Admin implements AdminClient {
  protected hostname: string;
  protected fetch: Fetch;
  protected path: string;
  constructor(hostname: string, fetch: Fetch);
  private url;
  queryKey: {
    createCollection: (req: CreateCollectionRequest) => readonly ["Admin", "createCollection", CreateCollectionRequest];
    getCollection: (req: GetCollectionRequest) => readonly ["Admin", "getCollection", GetCollectionRequest];
    updateCollection: (req: UpdateCollectionRequest) => readonly ["Admin", "updateCollection", UpdateCollectionRequest];
    listCollections: (req: ListCollectionsRequest) => readonly ["Admin", "listCollections", ListCollectionsRequest];
    deleteCollection: (req: DeleteCollectionRequest) => readonly ["Admin", "deleteCollection", DeleteCollectionRequest];
    syncCollection: (req: SyncCollectionRequest) => readonly ["Admin", "syncCollection", SyncCollectionRequest];
    createPrimarySaleContract: (req: CreatePrimarySaleContractRequest) => readonly ["Admin", "createPrimarySaleContract", CreatePrimarySaleContractRequest];
    deletePrimarySaleContract: (req: DeletePrimarySaleContractRequest) => readonly ["Admin", "deletePrimarySaleContract", DeletePrimarySaleContractRequest];
    createCurrency: (req: CreateCurrencyRequest) => readonly ["Admin", "createCurrency", CreateCurrencyRequest];
    createCurrencies: (req: CreateCurrenciesRequest) => readonly ["Admin", "createCurrencies", CreateCurrenciesRequest];
    updateCurrency: (req: UpdateCurrencyRequest) => readonly ["Admin", "updateCurrency", UpdateCurrencyRequest];
    listCurrencies: (req: ListCurrenciesRequest) => readonly ["Admin", "listCurrencies", ListCurrenciesRequest];
    deleteCurrency: (req: DeleteCurrencyRequest) => readonly ["Admin", "deleteCurrency", DeleteCurrencyRequest];
    addCollectibles: (req: AddCollectiblesRequest) => readonly ["Admin", "addCollectibles", AddCollectiblesRequest];
  };
  createCollection: (req: CreateCollectionRequest, headers?: object, signal?: AbortSignal) => Promise<CreateCollectionResponse>;
  getCollection: (req: GetCollectionRequest, headers?: object, signal?: AbortSignal) => Promise<GetCollectionResponse>;
  updateCollection: (req: UpdateCollectionRequest, headers?: object, signal?: AbortSignal) => Promise<UpdateCollectionResponse>;
  listCollections: (req: ListCollectionsRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectionsResponse>;
  deleteCollection: (req: DeleteCollectionRequest, headers?: object, signal?: AbortSignal) => Promise<DeleteCollectionResponse>;
  syncCollection: (req: SyncCollectionRequest, headers?: object, signal?: AbortSignal) => Promise<SyncCollectionResponse>;
  createPrimarySaleContract: (req: CreatePrimarySaleContractRequest, headers?: object, signal?: AbortSignal) => Promise<CreatePrimarySaleContractResponse>;
  deletePrimarySaleContract: (req: DeletePrimarySaleContractRequest, headers?: object, signal?: AbortSignal) => Promise<DeletePrimarySaleContractResponse>;
  createCurrency: (req: CreateCurrencyRequest, headers?: object, signal?: AbortSignal) => Promise<CreateCurrencyResponse>;
  createCurrencies: (req: CreateCurrenciesRequest, headers?: object, signal?: AbortSignal) => Promise<CreateCurrenciesResponse>;
  updateCurrency: (req: UpdateCurrencyRequest, headers?: object, signal?: AbortSignal) => Promise<UpdateCurrencyResponse>;
  listCurrencies: (req: ListCurrenciesRequest, headers?: object, signal?: AbortSignal) => Promise<ListCurrenciesResponse>;
  deleteCurrency: (req: DeleteCurrencyRequest, headers?: object, signal?: AbortSignal) => Promise<DeleteCurrencyResponse>;
  addCollectibles: (req: AddCollectiblesRequest, headers?: object, signal?: AbortSignal) => Promise<AddCollectiblesResponse>;
}
declare class Marketplace implements MarketplaceClient {
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
  listCollectibleListings: (req: ListCollectibleListingsRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleListingsResponse>;
  listCollectibleOffers: (req: ListCollectibleOffersRequest, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleOffersResponse>;
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
declare const JsonEncode: <T = any>(obj: T, _typ?: string) => string;
declare const JsonDecode: <T = any>(data: string | any, _typ?: string) => T;
type WebrpcErrorParams = {
  name?: string;
  code?: number;
  message?: string;
  status?: number;
  cause?: string;
};
declare class WebrpcError extends Error {
  code: number;
  status: number;
  constructor(error?: WebrpcErrorParams);
  static new(payload: any): WebrpcError;
}
declare class WebrpcEndpointError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcRequestFailedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcBadRouteError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcBadMethodError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcBadRequestError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcBadResponseError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcServerPanicError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcInternalErrorError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcClientAbortedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcStreamLostError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class WebrpcStreamFinishedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class UnauthorizedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class PermissionDeniedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class SessionExpiredError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class MethodNotFoundError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class TimeoutError$1 extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class InvalidArgumentError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class NotFoundError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class UserNotFoundError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class ProjectNotFoundError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class InvalidTierError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class ProjectLimitReachedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
}
declare class NotImplementedError extends WebrpcError {
  constructor(error?: WebrpcErrorParams);
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
  WebrpcClientAborted = "WebrpcClientAborted",
  WebrpcStreamLost = "WebrpcStreamLost",
  WebrpcStreamFinished = "WebrpcStreamFinished",
  Unauthorized = "Unauthorized",
  PermissionDenied = "PermissionDenied",
  SessionExpired = "SessionExpired",
  MethodNotFound = "MethodNotFound",
  Timeout = "Timeout",
  InvalidArgument = "InvalidArgument",
  NotFound = "NotFound",
  UserNotFound = "UserNotFound",
  ProjectNotFound = "ProjectNotFound",
  InvalidTier = "InvalidTier",
  ProjectLimitReached = "ProjectLimitReached",
  NotImplemented = "NotImplemented",
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
  WebrpcClientAborted = -8,
  WebrpcStreamLost = -9,
  WebrpcStreamFinished = -10,
  Unauthorized = 1000,
  PermissionDenied = 1001,
  SessionExpired = 1002,
  MethodNotFound = 1003,
  Timeout = 2000,
  InvalidArgument = 2001,
  NotFound = 3000,
  UserNotFound = 3001,
  ProjectNotFound = 3002,
  InvalidTier = 3003,
  ProjectLimitReached = 3005,
  NotImplemented = 9999,
}
declare const webrpcErrorByCode: {
  [code: number]: any;
};
declare const WebrpcHeader = "Webrpc";
declare const WebrpcHeaderValue = "webrpc@v0.30.1;gen-typescript@v0.22.0;@v0.0.0-449bbd3abca8b0fc38376c11d82c94413000a0d6";
type WebrpcGenVersions = {
  WebrpcGenVersion: string;
  codeGenName: string;
  codeGenVersion: string;
  schemaName: string;
  schemaVersion: string;
};
declare function VersionFromHeader(headers: Headers): WebrpcGenVersions;
//#endregion
//#region src/react/_internal/api/marketplace-api.d.ts
declare class SequenceMarketplace extends Marketplace {
  projectAccessKey: string;
  jwtAuth?: string | undefined;
  constructor(hostname: string, projectAccessKey: string, jwtAuth?: string | undefined);
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
//#endregion
//#region src/react/ui/modals/_internal/types.d.ts
interface ActionButton {
  label: string;
  action: () => void;
}
type ModalCallbacks = {
  onSuccess?: ({
    hash,
    orderId
  }: {
    hash?: Hash;
    orderId?: string;
  }) => void;
  onError?: (error: Error) => void;
  successActionButtons?: ActionButton[];
};
//#endregion
//#region src/react/ui/modals/BuyModal/store.d.ts
type PaymentModalProps = {
  collectibleId: string;
  marketplace: MarketplaceKind;
  orderId: string;
  customCreditCardProviderCallback?: (buyStep: Step) => void;
};
type BuyModalBaseProps = {
  chainId: number;
  collectionAddress: Address;
  skipNativeBalanceCheck?: boolean;
  nativeTokenAddress?: Address;
  cardType?: CardType;
  customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
  successActionButtons?: ActionButton[];
  hideQuantitySelector?: boolean;
  onRampProvider?: TransactionOnRampProvider;
};
type ShopBuyModalProps = BuyModalBaseProps & {
  cardType: 'shop';
  salesContractAddress: Address;
  items: Array<Partial<CheckoutOptionsItem> & {
    tokenId?: string;
  }>;
  quantityDecimals: number;
  quantityRemaining: number;
  salePrice: {
    amount: string;
    currencyAddress: Address;
  };
  unlimitedSupply?: boolean;
};
type MarketplaceBuyModalProps = BuyModalBaseProps & {
  cardType?: 'market';
  collectibleId: string;
  marketplace: MarketplaceKind;
  orderId: string;
};
type BuyModalProps = ShopBuyModalProps | MarketplaceBuyModalProps;
//#endregion
//#region src/react/_internal/databeat/types.d.ts
declare enum EventType {
  BUY_ITEMS = 0,
  SELL_ITEMS = 1,
  CREATE_LISTING = 2,
  CREATE_OFFER = 3,
  CANCEL_LISTING = 4,
  CANCEL_OFFER = 5,
  TRANSACTION_FAILED = 6,
  BUY_MODAL_OPENED = 7,
}
interface PropsEvent {
  [key: string]: string;
}
interface NumsEvent {
  [key: string]: number;
}
interface Transaction extends PropsEvent {
  chainId: string;
  txnHash: string;
}
interface TradeItemsInfo extends PropsEvent {
  marketplaceKind: MarketplaceKind;
  userId: string;
  collectionAddress: string;
  currencyAddress: string;
  currencySymbol: string;
}
interface TradeItemsValues extends NumsEvent {
  currencyValueDecimal: number;
  currencyValueRaw: number;
}
type BuyModalOpenedProps = Omit<BuyModalProps, 'marketplaceType' | 'customCreditCardProviderCallback' | 'chainId' | 'skipNativeBalanceCheck' | 'nativeTokenAddress' | 'successActionButtons' | 'hideQuantitySelector'> & {
  buyAnalyticsId: string;
};
type BuyModalOpenedNums = {
  chainId: number;
};
interface TrackBuyModalOpened {
  props: BuyModalOpenedProps;
  nums: BuyModalOpenedNums;
}
interface TrackSellItems {
  props: TradeItemsInfo & Transaction;
  nums: TradeItemsValues;
}
interface ListOfferItemsInfo extends PropsEvent {
  orderbookKind: OrderbookKind;
  collectionAddress: string;
  currencyAddress: string;
  currencySymbol: string;
}
interface ListOfferItemsValues extends NumsEvent {
  currencyValueDecimal: number;
  currencyValueRaw: number;
}
interface TrackCreateListing {
  props: ListOfferItemsInfo & Transaction;
  nums: ListOfferItemsValues;
}
interface TrackCreateOffer {
  props: ListOfferItemsInfo & Transaction;
  nums: ListOfferItemsValues;
}
interface TrackTransactionFailed extends Transaction, PropsEvent {}
//#endregion
//#region src/react/_internal/databeat/index.d.ts
type EventTypes = keyof typeof EventType;
type Event$1 = Event<EventTypes>;
declare class DatabeatAnalytics extends Databeat<Extract<EventTypes, string>> {
  trackSellItems(args: TrackSellItems): void;
  trackBuyModalOpened(args: TrackBuyModalOpened): void;
  trackCreateListing(args: TrackCreateListing): void;
  trackCreateOffer(args: TrackCreateOffer): void;
  trackTransactionFailed(args: TrackTransactionFailed): void;
}
declare const useAnalytics: () => DatabeatAnalytics;
//#endregion
//#region src/types/types.d.ts
type Price = {
  amountRaw: string;
  currency: Currency;
};
type CardType = 'market' | 'shop' | 'inventory-non-tradable';
declare enum CollectibleCardAction {
  BUY = "Buy",
  SELL = "Sell",
  LIST = "Create listing",
  OFFER = "Make an offer",
  TRANSFER = "Transfer",
}
type MarketCollection$1 = MarketplaceConfig['market']['collections'][number];
type ShopCollection$1 = MarketplaceConfig['shop']['collections'][number];
//#endregion
//#region src/types/sdk-config.d.ts
type Env = 'development' | 'production' | 'next';
type ApiConfig = {
  env?: Env;
  url?: string;
  accessKey?: string;
};
type SdkConfig = {
  projectAccessKey: string;
  projectId: string;
  walletConnectProjectId?: string;
  shadowDom?: boolean;
  experimentalShadowDomCssOverride?: string;
  _internal?: {
    prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
    overrides?: {
      marketplaceConfig?: Partial<MarketplaceConfig>;
      api?: {
        builder?: ApiConfig;
        marketplace?: ApiConfig;
        nodeGateway?: ApiConfig;
        metadata?: ApiConfig;
        indexer?: ApiConfig;
        sequenceApi?: ApiConfig;
        sequenceWallet?: ApiConfig;
      };
    };
  };
};
type MarketplaceSdkContext = {
  openConnectModal: () => void;
  analytics: DatabeatAnalytics;
} & SdkConfig;
//#endregion
//#region src/react/_internal/api/services.d.ts
type ChainNameOrId = string | number;
declare const marketplaceApiURL: (env?: Env) => string;
declare const sequenceApiUrl: (env?: Env) => string;
declare const getBuilderClient: (config: SdkConfig) => BuilderAPI;
declare const getMetadataClient: (config: SdkConfig) => SequenceMetadata;
declare const getIndexerClient: (chain: ChainNameOrId, config: SdkConfig) => SequenceIndexer;
declare const getMarketplaceClient: (config: SdkConfig) => SequenceMarketplace;
declare const getSequenceApiClient: (config: SdkConfig) => SequenceAPIClient;
//#endregion
//#region src/react/_internal/consts.d.ts
declare const DEFAULT_NETWORK = 137;
//#endregion
//#region src/react/_internal/get-provider.d.ts
declare const PROVIDER_ID = "sdk-provider";
declare function getProviderEl(): HTMLElement | null;
//#endregion
//#region src/react/_internal/types.d.ts
interface QueryArg {
  enabled?: boolean;
}
type CollectableId = string | number;
type CollectionType = ContractType.ERC1155 | ContractType.ERC721;
type TransactionStep = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
type TransactionSteps = {
  approval: TransactionStep;
  transaction: TransactionStep;
};
declare enum TransactionType {
  BUY = "BUY",
  SELL = "SELL",
  LISTING = "LISTING",
  OFFER = "OFFER",
  TRANSFER = "TRANSFER",
  CANCEL = "CANCEL",
}
interface BuyInput {
  orderId: string;
  collectableDecimals: number;
  marketplace: MarketplaceKind;
  quantity: string;
}
interface SellInput {
  orderId: string;
  marketplace: MarketplaceKind;
  quantity?: string;
}
interface ListingInput {
  contractType: ContractType;
  listing: CreateReq;
}
interface OfferInput {
  contractType: ContractType;
  offer: CreateReq;
}
interface CancelInput {
  orderId: string;
  marketplace: MarketplaceKind;
}
type ValuesOptional<T> = { [K in keyof T]: T[K] | undefined };
type RequiredKeys<T> = { [K in keyof T]-?: T[K] };
type QueryKeyArgs<T> = { [K in keyof Required<T>]: T[K] | undefined };
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
/**
 * Extracts only API-relevant fields from query params, excluding SDK config and query options
 * Converts optional properties (prop?: T) to explicit union types (prop: T | undefined)
 */
type ApiArgs<T> = ValuesOptional<Omit<T, 'config' | 'query'>>;
//#endregion
//#region src/react/_internal/wagmi/get-connectors.d.ts
declare function getConnectors({
  marketplaceConfig,
  sdkConfig,
  walletType
}: {
  marketplaceConfig: MarketplaceConfig;
  sdkConfig: SdkConfig;
  walletType: MarketplaceWalletType;
}): CreateConnectorFn[];
declare function getWaasConnectors(config: SdkConfig, marketplaceConfig: MarketplaceConfig): Wallet[];
declare function getEcosystemConnector(marketplaceConfig: MarketplaceConfig, sdkConfig: SdkConfig): Wallet;
//#endregion
//#region src/types/new-marketplace-types.d.ts
interface MarketplaceConfig {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketPage;
  shop: ShopPage;
}
interface MarketplacePage {
  enabled: boolean;
  bannerUrl: string;
  ogImage?: string;
  private: boolean;
}
interface MarketPage extends MarketplacePage {
  collections: MarketCollection[];
}
interface ShopPage extends MarketplacePage {
  collections: ShopCollection[];
}
interface MarketplaceSocials {
  twitter: string;
  discord: string;
  website: string;
  tiktok: string;
  instagram: string;
  youtube: string;
}
interface MarketplaceCollection {
  chainId: number;
  bannerUrl: string;
  itemsAddress: Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
}
interface MarketCollection extends MarketplaceCollection {
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
}
interface ShopCollection extends MarketplaceCollection {
  cardType: CardType;
  saleAddress: Address;
}
interface EcosystemWalletSettings {
  walletUrl: string;
  walletAppName: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
}
interface MarketplaceWalletOptions {
  walletType: MarketplaceWalletType;
  oidcIssuers: {
    [key: string]: string;
  };
  connectors: Array<string>;
  includeEIP6963Wallets: boolean;
  ecosystem?: EcosystemWalletSettings;
  waas?: MarketplaceWalletWaasSettings;
}
interface MarketplaceWalletWaasSettings {
  tenantKey: string;
  emailEnabled: boolean;
  providers: Array<OpenIdProvider>;
}
interface MetadataFilterRule {
  key: string;
  condition: FilterCondition;
  value?: string;
}
interface CollectionFilterSettings {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule>;
}
//#endregion
//#region src/react/queries/marketplace/config.d.ts
declare const fetchMarketplaceConfig: ({
  config,
  prefetchedMarketplaceSettings
}: {
  config: SdkConfig;
  prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
}) => Promise<MarketplaceConfig>;
declare const marketplaceConfigOptions: (config: SdkConfig) => _tanstack_react_query372.OmitKeyof<_tanstack_react_query372.UseQueryOptions<MarketplaceConfig, Error, MarketplaceConfig, string[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query372.QueryFunction<MarketplaceConfig, string[], never> | undefined;
} & {
  queryKey: string[] & {
    [dataTagSymbol]: MarketplaceConfig;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/_internal/wagmi/create-config.d.ts
declare const createWagmiConfig: (marketplaceConfig: MarketplaceConfig, sdkConfig: SdkConfig, ssr?: boolean) => wagmi0.Config<[Chain, ...Chain[]], Record<number, Transport>, wagmi0.CreateConnectorFn[]>;
declare function getWagmiChainsAndTransports({
  marketplaceConfig,
  sdkConfig
}: {
  marketplaceConfig: MarketplaceConfig;
  sdkConfig: SdkConfig;
}): {
  chains: [Chain, ...Chain[]];
  transports: Record<number, Transport>;
};
//#endregion
export { EventTypes as $, WebrpcError as $i, GetLowestPriceOfferForCollectibleResponse as $n, OrderStatus as $r, FeeBreakdown as $t, TransactionType as A, SyncOrderResponse as Ai, GetCountOfAllCollectiblesRequest as An, ListListingsForCollectibleResponse as Ar, ContractType as At, marketplaceApiURL as B, UpdateCollectionRequest as Bi, GetCountOfOffersForCollectibleRequest as Bn, ListPrimarySaleItemsResponse as Br, Currency as Bt, OfferInput as C, Step as Ci, GetCollectionActiveListingsCurrenciesResponse as Cn, ListCollectionActivitiesRequest as Cr, CollectibleStatus as Ct, RequiredKeys as D, SyncCollectionRequest as Di, GetCollectionDetailResponse as Dn, ListCurrenciesRequest as Dr, CollectionLastSynced as Dt, QueryKeyArgs as E, SupportedMarketplacesResponse as Ei, GetCollectionDetailRequest as En, ListCollectionsResponse as Er, CollectionConfig as Et, getBuilderClient as F, TransactionCrypto as Fi, GetCountOfFilteredCollectiblesResponse as Fn, ListOffersRequest as Fr, CreateCurrencyRequest as Ft, SdkConfig as G, VersionFromHeader as Gi, GetFloorOrderResponse as Gn, MethodNotFoundError as Gr, DeleteCurrencyResponse as Gt, ApiConfig as H, UpdateCurrencyRequest as Hi, GetCountOfPrimarySaleItemsRequest as Hn, MarketplaceClient as Hr, DeleteCollectionRequest as Ht, getIndexerClient as I, TransactionNFTCheckoutProvider as Ii, GetCountOfFilteredOrdersRequest as In, ListOffersResponse as Ir, CreateCurrencyResponse as It, MarketCollection$1 as J, WebrpcBadRequestError as Ji, GetHighestPriceOfferForCollectibleRequest as Jn, OfferType as Jr, Domain as Jt, CardType as K, WalletKind as Ki, GetHighestPriceListingForCollectibleRequest as Kn, NotFoundError as Kr, DeletePrimarySaleContractRequest as Kt, getMarketplaceClient as L, TransactionOnRampProvider as Li, GetCountOfFilteredOrdersResponse as Ln, ListOrdersWithCollectiblesRequest as Lr, CreatePrimarySaleContractRequest as Lt, PROVIDER_ID as M, SyncOrdersResponse as Mi, GetCountOfAllOrdersRequest as Mn, ListListingsResponse as Mr, CreateCollectionResponse as Mt, getProviderEl as N, TimeoutError$1 as Ni, GetCountOfAllOrdersResponse as Nn, ListOffersForCollectibleRequest as Nr, CreateCurrenciesRequest as Nt, SellInput as O, SyncCollectionResponse as Oi, GetCollectionRequest as On, ListCurrenciesResponse as Or, CollectionPriority as Ot, DEFAULT_NETWORK as P, TokenMetadata$1 as Pi, GetCountOfFilteredCollectiblesRequest as Pn, ListOffersForCollectibleResponse as Pr, CreateCurrenciesResponse as Pt, Event$1 as Q, WebrpcEndpointError as Qi, GetLowestPriceOfferForCollectibleRequest as Qn, OrderSide as Qr, ExecuteType as Qt, getMetadataClient as R, TransactionSwapProvider as Ri, GetCountOfListingsForCollectibleRequest as Rn, ListOrdersWithCollectiblesResponse as Rr, CreatePrimarySaleContractResponse as Rt, ListingInput as S, SourceKind as Si, GetCollectionActiveListingsCurrenciesRequest as Sn, ListCollectiblesWithLowestListingResponse as Sr, CollectibleSource as St, QueryArg as T, SupportedMarketplacesRequest as Ti, GetCollectionActiveOffersCurrenciesResponse as Tn, ListCollectionsRequest as Tr, Collection as Tt, Env as U, UpdateCurrencyResponse as Ui, GetCountOfPrimarySaleItemsResponse as Un, MarketplaceKind as Ur, DeleteCollectionResponse as Ut, sequenceApiUrl as V, UpdateCollectionResponse as Vi, GetCountOfOffersForCollectibleResponse as Vn, Marketplace as Vr, CurrencyStatus as Vt, MarketplaceSdkContext as W, UserNotFoundError as Wi, GetFloorOrderRequest as Wn, MetadataStatus as Wr, DeleteCurrencyRequest as Wt, ShopCollection$1 as X, WebrpcBadRouteError as Xi, GetLowestPriceListingForCollectibleRequest as Xn, OrderData as Xr, ExecuteRequest as Xt, Price as Y, WebrpcBadResponseError as Yi, GetHighestPriceOfferForCollectibleResponse as Yn, Order as Yr, ExecuteInput as Yt, DatabeatAnalytics as Z, WebrpcClientAbortedError as Zi, GetLowestPriceListingForCollectibleResponse as Zn, OrderFilter as Zr, ExecuteResponse as Zt, ApiArgs as _, PropertyType as _i, GetCollectibleLowestListingResponse as _n, ListCollectiblesRequest as _r, CheckoutOptionsSalesContractRequest as _t, CollectionFilterSettings as a, WebrpcSchemaHash as aa, PriceFilter as ai, GenerateCancelTransactionResponse as an, InvalidArgumentError as ar, ActivityAction as at, CollectableId as b, SortBy as bi, GetCollectibleRequest as bn, ListCollectiblesWithHighestOfferResponse as br, CollectibleOrder as bt, MarketplaceConfig as c, WebrpcStreamFinishedError as ca, PrimarySaleItem as ci, GenerateOfferTransactionRequest as cn, ItemsContractStatus as cr, AdditionalFee as ct, MarketplaceWalletWaasSettings as d, errors as da, PrimarySaleVersion as di, GenerateSellTransactionResponse as dn, ListCollectibleActivitiesRequest as dr, Asset as dt, WebrpcErrorCodes as ea, OrderbookKind as ei, Fetch as en, GetOrdersInput as er, useAnalytics as et, MetadataFilterRule as f, webrpcErrorByCode as fa, Project as fi, GetCollectibleHighestListingRequest as fn, ListCollectibleActivitiesResponse as fr, CheckoutOptions as ft, getWaasConnectors as g, MarketplaceWallet as ga, PropertyFilter$1 as gi, GetCollectibleLowestListingRequest as gn, ListCollectibleOffersResponse as gr, CheckoutOptionsMarketplaceResponse as gt, getEcosystemConnector as h, FilterCondition as ha, ProjectStatus as hi, GetCollectibleHighestOfferResponse as hn, ListCollectibleOffersRequest as hr, CheckoutOptionsMarketplaceRequest as ht, marketplaceConfigOptions as i, WebrpcRequestFailedError as ia, PostRequest as ii, GenerateCancelTransactionRequest as in, GetPrimarySaleItemResponse as ir, Activity as it, ValuesOptional as j, SyncOrdersRequest as ji, GetCountOfAllCollectiblesResponse as jn, ListListingsRequest as jr, CreateCollectionRequest as jt, TransactionSteps as k, SyncOrderRequest as ki, GetCollectionResponse as kn, ListListingsForCollectibleRequest as kr, CollectionStatus as kt, MarketplaceSocials as l, WebrpcStreamLostError as la, PrimarySaleItemDetailType as li, GenerateOfferTransactionResponse as ln, JsonDecode as lr, Admin as lt, getConnectors as m, BuilderAPI as ma, ProjectNotFoundError as mi, GetCollectibleHighestOfferRequest as mn, ListCollectibleListingsResponse as mr, CheckoutOptionsMarketplaceOrder as mt, getWagmiChainsAndTransports as n, WebrpcHeaderValue as na, Page$2 as ni, GenerateBuyTransactionRequest as nn, GetOrdersResponse as nr, ModalCallbacks as nt, EcosystemWalletSettings as o, WebrpcSchemaVersion as oa, PrimarySaleContract as oi, GenerateListingTransactionRequest as on, InvalidTierError as or, AddCollectiblesRequest as ot, ShopPage as p, getQueryClient as pa, ProjectLimitReachedError as pi, GetCollectibleHighestListingResponse as pn, ListCollectibleListingsRequest as pr, CheckoutOptionsItem as pt, CollectibleCardAction as q, WebrpcBadMethodError as qi, GetHighestPriceListingForCollectibleResponse as qn, NotImplementedError as qr, DeletePrimarySaleContractResponse as qt, fetchMarketplaceConfig as r, WebrpcInternalErrorError as ra, PermissionDeniedError as ri, GenerateBuyTransactionResponse as rn, GetPrimarySaleItemRequest as rr, SequenceMarketplace as rt, MarketPage as s, WebrpcServerPanicError as sa, PrimarySaleContractStatus as si, GenerateListingTransactionResponse as sn, ItemsContract as sr, AddCollectiblesResponse as st, createWagmiConfig as t, WebrpcHeader as ta, OrdersFilter as ti, Filter$1 as tn, GetOrdersRequest as tr, BuyModalProps as tt, MarketplaceWalletOptions as u, WebrpcVersion as ua, PrimarySaleItemsFilter as ui, GenerateSellTransactionRequest as un, JsonEncode as ur, AdminClient as ut, BuyInput as v, SessionExpiredError as vi, GetCollectibleLowestOfferRequest as vn, ListCollectiblesResponse as vr, CheckoutOptionsSalesContractResponse as vt, Optional as w, StepType as wi, GetCollectionActiveOffersCurrenciesRequest as wn, ListCollectionActivitiesResponse as wr, CollectiblesFilter as wt, CollectionType as x, SortOrder as xi, GetCollectibleResponse as xn, ListCollectiblesWithLowestListingRequest as xr, CollectiblePrimarySaleItem as xt, CancelInput as y, Signature as yi, GetCollectibleLowestOfferResponse as yn, ListCollectiblesWithHighestOfferRequest as yr, Collectible as yt, getSequenceApiClient as z, UnauthorizedError as zi, GetCountOfListingsForCollectibleResponse as zn, ListPrimarySaleItemsRequest as zr, CreateReq as zt };
//# sourceMappingURL=create-config-BO68TZC5.d.ts.map