import * as wagmi0 from "wagmi";
import { CreateConnectorFn } from "wagmi";
import { Wallet } from "@0xsequence/connect";
import * as _tanstack_react_query107 from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { SequenceAPIClient } from "@0xsequence/api";
import { SequenceIndexer } from "@0xsequence/indexer";
import { SequenceMetadata } from "@0xsequence/metadata";
import { Address, Chain, Hash, Hex, Transport } from "viem";
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
declare const WebrpcHeader = "Webrpc";
declare const WebrpcHeaderValue = "webrpc@v0.25.4;gen-typescript@v0.17.0;marketplace-api@v0.0.0-1ecb14ce28259b0a60c8b90d3e247aced7bcdfad;marketplace-sdk@v1.2.0";
declare const WebRPCVersion = "v1";
declare const WebRPCSchemaVersion = "";
declare const WebRPCSchemaHash = "1ecb14ce28259b0a60c8b90d3e247aced7bcdfad";
type WebrpcGenVersions = {
  webrpcGenVersion: string;
  codeGenName: string;
  codeGenVersion: string;
  schemaName: string;
  schemaVersion: string;
};
declare function VersionFromHeader(headers: Headers): WebrpcGenVersions;
declare enum MetadataStatus {
  NOT_AVAILABLE = "NOT_AVAILABLE",
  REFRESHING = "REFRESHING",
  AVAILABLE = "AVAILABLE",
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
interface Admin {
  createCollection(args: CreateCollectionArgs, headers?: object, signal?: AbortSignal): Promise<CreateCollectionReturn>;
  getCollection(args: GetCollectionArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectionReturn>;
  updateCollection(args: UpdateCollectionArgs, headers?: object, signal?: AbortSignal): Promise<UpdateCollectionReturn>;
  listCollections(args: ListCollectionsArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectionsReturn>;
  deleteCollection(args: DeleteCollectionArgs, headers?: object, signal?: AbortSignal): Promise<DeleteCollectionReturn>;
  /**
   * determine what should happen here
   */
  syncCollection(args: SyncCollectionArgs, headers?: object, signal?: AbortSignal): Promise<SyncCollectionReturn>;
  createPrimarySaleContract(args: CreatePrimarySaleContractArgs, headers?: object, signal?: AbortSignal): Promise<CreatePrimarySaleContractReturn>;
  deletePrimarySaleContract(args: DeletePrimarySaleContractArgs, headers?: object, signal?: AbortSignal): Promise<DeletePrimarySaleContractReturn>;
  createCurrency(args: CreateCurrencyArgs, headers?: object, signal?: AbortSignal): Promise<CreateCurrencyReturn>;
  createCurrencies(args: CreateCurrenciesArgs, headers?: object, signal?: AbortSignal): Promise<CreateCurrenciesReturn>;
  updateCurrency(args: UpdateCurrencyArgs, headers?: object, signal?: AbortSignal): Promise<UpdateCurrencyReturn>;
  listCurrencies(args: ListCurrenciesArgs, headers?: object, signal?: AbortSignal): Promise<ListCurrenciesReturn>;
  deleteCurrency(args: DeleteCurrencyArgs, headers?: object, signal?: AbortSignal): Promise<DeleteCurrencyReturn>;
  /**
   * This for manual adding of non minted ERC1155 tokens, it's used for purposes of Shop.
   */
  addCollectibles(args: AddCollectiblesArgs, headers?: object, signal?: AbortSignal): Promise<AddCollectiblesReturn>;
}
interface CreateCollectionArgs {
  chainId: string;
  projectId: number;
  contractAddress: string;
}
interface CreateCollectionReturn {
  collection: Collection;
}
interface GetCollectionArgs {
  chainId: string;
  projectId: number;
  contractAddress: string;
}
interface GetCollectionReturn {
  collection: Collection;
}
interface UpdateCollectionArgs {
  chainId: string;
  collection: Collection;
}
interface UpdateCollectionReturn {
  collection: Collection;
}
interface ListCollectionsArgs {
  chainId: string;
  projectId: number;
  page?: Page$2;
}
interface ListCollectionsReturn {
  collections: Array<Collection>;
  page?: Page$2;
}
interface DeleteCollectionArgs {
  chainId: string;
  projectId: number;
  contractAddress: string;
}
interface DeleteCollectionReturn {
  collection: Collection;
}
interface SyncCollectionArgs {
  chainId: string;
  contractAddress: string;
}
interface SyncCollectionReturn {}
interface CreatePrimarySaleContractArgs {
  chainId: string;
  projectId: number;
  primarySaleContractAddress: string;
  itemsContractAddress: string;
}
interface CreatePrimarySaleContractReturn {
  primarySaleContract: PrimarySaleContract;
}
interface DeletePrimarySaleContractArgs {
  chainId: string;
  projectId: number;
  primarySaleContractAddress: string;
}
interface DeletePrimarySaleContractReturn {}
interface CreateCurrencyArgs {
  chainId: string;
  currency: Currency;
}
interface CreateCurrencyReturn {
  currency: Currency;
}
interface CreateCurrenciesArgs {
  chainId: string;
  currencies: Array<Currency>;
}
interface CreateCurrenciesReturn {
  currency: {
    [key: string]: Currency;
  };
}
interface UpdateCurrencyArgs {
  chainId: string;
  currency: Currency;
}
interface UpdateCurrencyReturn {
  currency: Currency;
}
interface ListCurrenciesArgs {
  chainId: string;
}
interface ListCurrenciesReturn {
  currencies: Array<Currency>;
}
interface DeleteCurrencyArgs {
  chainId: string;
  contractAddress: string;
}
interface DeleteCurrencyReturn {
  currency: Currency;
}
interface AddCollectiblesArgs {
  chainId: string;
  itemsContractAddress: string;
  tokenIds: Array<string>;
}
interface AddCollectiblesReturn {}
interface Marketplace {
  listCurrencies(args: ListCurrenciesArgs, headers?: object, signal?: AbortSignal): Promise<ListCurrenciesReturn>;
  getCollectionDetail(args: GetCollectionDetailArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectionDetailReturn>;
  getCollectionActiveListingsCurrencies(args: GetCollectionActiveListingsCurrenciesArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectionActiveListingsCurrenciesReturn>;
  getCollectionActiveOffersCurrencies(args: GetCollectionActiveOffersCurrenciesArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectionActiveOffersCurrenciesReturn>;
  getCollectible(args: GetCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleReturn>;
  getLowestPriceOfferForCollectible(args: GetLowestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetLowestPriceOfferForCollectibleReturn>;
  getHighestPriceOfferForCollectible(args: GetHighestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetHighestPriceOfferForCollectibleReturn>;
  getLowestPriceListingForCollectible(args: GetLowestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetLowestPriceListingForCollectibleReturn>;
  getHighestPriceListingForCollectible(args: GetHighestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetHighestPriceListingForCollectibleReturn>;
  listListingsForCollectible(args: ListListingsForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<ListListingsForCollectibleReturn>;
  listOffersForCollectible(args: ListOffersForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<ListOffersForCollectibleReturn>;
  listOrdersWithCollectibles(args: ListOrdersWithCollectiblesArgs, headers?: object, signal?: AbortSignal): Promise<ListOrdersWithCollectiblesReturn>;
  getCountOfAllOrders(args: GetCountOfAllOrdersArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfAllOrdersReturn>;
  getCountOfFilteredOrders(args: GetCountOfFilteredOrdersArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfFilteredOrdersReturn>;
  listListings(args: ListListingsArgs, headers?: object, signal?: AbortSignal): Promise<ListListingsReturn>;
  listOffers(args: ListOffersArgs, headers?: object, signal?: AbortSignal): Promise<ListOffersReturn>;
  getCountOfListingsForCollectible(args: GetCountOfListingsForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfListingsForCollectibleReturn>;
  getCountOfOffersForCollectible(args: GetCountOfOffersForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfOffersForCollectibleReturn>;
  /**
   * @deprecated Please use GetLowestPriceOfferForCollectible instead.
   */
  getCollectibleLowestOffer(args: GetCollectibleLowestOfferArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestOfferReturn>;
  /**
   * @deprecated Please use GetHighestPriceOfferForCollectible instead.
   */
  getCollectibleHighestOffer(args: GetCollectibleHighestOfferArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestOfferReturn>;
  /**
   * @deprecated Please use GetLowestPriceListingForCollectible instead.
   */
  getCollectibleLowestListing(args: GetCollectibleLowestListingArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestListingReturn>;
  /**
   * @deprecated Please use GetHighestPriceListingForCollectible instead.
   */
  getCollectibleHighestListing(args: GetCollectibleHighestListingArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestListingReturn>;
  /**
   * @deprecated Please use ListListingsForCollectible instead.
   */
  listCollectibleListings(args: ListCollectibleListingsArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleListingsReturn>;
  /**
   * @deprecated Please use ListOffersForCollectible instead.
   */
  listCollectibleOffers(args: ListCollectibleOffersArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleOffersReturn>;
  /**
   * checkout process
   */
  generateBuyTransaction(args: GenerateBuyTransactionArgs, headers?: object, signal?: AbortSignal): Promise<GenerateBuyTransactionReturn>;
  generateSellTransaction(args: GenerateSellTransactionArgs, headers?: object, signal?: AbortSignal): Promise<GenerateSellTransactionReturn>;
  generateListingTransaction(args: GenerateListingTransactionArgs, headers?: object, signal?: AbortSignal): Promise<GenerateListingTransactionReturn>;
  generateOfferTransaction(args: GenerateOfferTransactionArgs, headers?: object, signal?: AbortSignal): Promise<GenerateOfferTransactionReturn>;
  generateCancelTransaction(args: GenerateCancelTransactionArgs, headers?: object, signal?: AbortSignal): Promise<GenerateCancelTransactionReturn>;
  /**
   * only used in a case of external transactions ( when we create off-chain transactions ) for instance opensea market, use only ExecuteInput params and leave other root inputs empty, they are depracated and kept only for backward compatibility
   */
  execute(args: ExecuteArgs, headers?: object, signal?: AbortSignal): Promise<ExecuteReturn>;
  /**
   * list of collectibles with best order for each collectible, by default this only returns collectibles with an order
   */
  listCollectibles(args: ListCollectiblesArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesReturn>;
  getCountOfAllCollectibles(args: GetCountOfAllCollectiblesArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfAllCollectiblesReturn>;
  getCountOfFilteredCollectibles(args: GetCountOfFilteredCollectiblesArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfFilteredCollectiblesReturn>;
  getFloorOrder(args: GetFloorOrderArgs, headers?: object, signal?: AbortSignal): Promise<GetFloorOrderReturn>;
  listCollectionActivities(args: ListCollectionActivitiesArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectionActivitiesReturn>;
  listCollectibleActivities(args: ListCollectibleActivitiesArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleActivitiesReturn>;
  listCollectiblesWithLowestListing(args: ListCollectiblesWithLowestListingArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithLowestListingReturn>;
  listCollectiblesWithHighestOffer(args: ListCollectiblesWithHighestOfferArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithHighestOfferReturn>;
  syncOrder(args: SyncOrderArgs, headers?: object, signal?: AbortSignal): Promise<SyncOrderReturn>;
  syncOrders(args: SyncOrdersArgs, headers?: object, signal?: AbortSignal): Promise<SyncOrdersReturn>;
  getOrders(args: GetOrdersArgs, headers?: object, signal?: AbortSignal): Promise<GetOrdersReturn>;
  checkoutOptionsMarketplace(args: CheckoutOptionsMarketplaceArgs, headers?: object, signal?: AbortSignal): Promise<CheckoutOptionsMarketplaceReturn>;
  checkoutOptionsSalesContract(args: CheckoutOptionsSalesContractArgs, headers?: object, signal?: AbortSignal): Promise<CheckoutOptionsSalesContractReturn>;
  supportedMarketplaces(args: SupportedMarketplacesArgs, headers?: object, signal?: AbortSignal): Promise<SupportedMarketplacesReturn>;
  getPrimarySaleItem(args: GetPrimarySaleItemArgs, headers?: object, signal?: AbortSignal): Promise<GetPrimarySaleItemReturn>;
  listPrimarySaleItems(args: ListPrimarySaleItemsArgs, headers?: object, signal?: AbortSignal): Promise<ListPrimarySaleItemsReturn>;
  getCountOfPrimarySaleItems(args: GetCountOfPrimarySaleItemsArgs, headers?: object, signal?: AbortSignal): Promise<GetCountOfPrimarySaleItemsReturn>;
}
interface ListCurrenciesArgs {
  chainId: string;
}
interface ListCurrenciesReturn {
  currencies: Array<Currency>;
}
interface GetCollectionDetailArgs {
  chainId: string;
  contractAddress: string;
}
interface GetCollectionDetailReturn {
  collection: Collection;
}
interface GetCollectionActiveListingsCurrenciesArgs {
  chainId: string;
  contractAddress: string;
}
interface GetCollectionActiveListingsCurrenciesReturn {
  currencies: Array<Currency>;
}
interface GetCollectionActiveOffersCurrenciesArgs {
  chainId: string;
  contractAddress: string;
}
interface GetCollectionActiveOffersCurrenciesReturn {
  currencies: Array<Currency>;
}
interface GetCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}
interface GetCollectibleReturn {
  metadata: TokenMetadata$1;
}
interface GetLowestPriceOfferForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetLowestPriceOfferForCollectibleReturn {
  order: Order;
}
interface GetHighestPriceOfferForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetHighestPriceOfferForCollectibleReturn {
  order: Order;
}
interface GetLowestPriceListingForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetLowestPriceListingForCollectibleReturn {
  order: Order;
}
interface GetHighestPriceListingForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetHighestPriceListingForCollectibleReturn {
  order: Order;
}
interface ListListingsForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListListingsForCollectibleReturn {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListOffersForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListOffersForCollectibleReturn {
  offers: Array<Order>;
  page?: Page$2;
}
interface ListOrdersWithCollectiblesArgs {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: OrdersFilter;
  page?: Page$2;
}
interface ListOrdersWithCollectiblesReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
}
interface GetCountOfAllOrdersArgs {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
}
interface GetCountOfAllOrdersReturn {
  count: number;
}
interface GetCountOfFilteredOrdersArgs {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: OrdersFilter;
}
interface GetCountOfFilteredOrdersReturn {
  count: number;
}
interface ListListingsArgs {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListListingsReturn {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListOffersArgs {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListOffersReturn {
  offers: Array<Order>;
  page?: Page$2;
}
interface GetCountOfListingsForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCountOfListingsForCollectibleReturn {
  count: number;
}
interface GetCountOfOffersForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCountOfOffersForCollectibleReturn {
  count: number;
}
interface GetCollectibleLowestOfferArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleLowestOfferReturn {
  order?: Order;
}
interface GetCollectibleHighestOfferArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleHighestOfferReturn {
  order?: Order;
}
interface GetCollectibleLowestListingArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleLowestListingReturn {
  order?: Order;
}
interface GetCollectibleHighestListingArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
}
interface GetCollectibleHighestListingReturn {
  order?: Order;
}
interface ListCollectibleListingsArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListCollectibleListingsReturn {
  listings: Array<Order>;
  page?: Page$2;
}
interface ListCollectibleOffersArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page$2;
}
interface ListCollectibleOffersReturn {
  offers: Array<Order>;
  page?: Page$2;
}
interface GenerateBuyTransactionArgs {
  chainId: string;
  collectionAddress: string;
  buyer: string;
  marketplace: MarketplaceKind;
  ordersData: Array<OrderData>;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
}
interface GenerateBuyTransactionReturn {
  steps: Array<Step>;
}
interface GenerateSellTransactionArgs {
  chainId: string;
  collectionAddress: string;
  seller: string;
  marketplace: MarketplaceKind;
  ordersData: Array<OrderData>;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
}
interface GenerateSellTransactionReturn {
  steps: Array<Step>;
}
interface GenerateListingTransactionArgs {
  chainId: string;
  collectionAddress: string;
  owner: string;
  contractType: ContractType;
  orderbook: OrderbookKind;
  listing: CreateReq;
  additionalFees: Array<AdditionalFee>;
  walletType?: WalletKind;
}
interface GenerateListingTransactionReturn {
  steps: Array<Step>;
}
interface GenerateOfferTransactionArgs {
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
interface GenerateOfferTransactionReturn {
  steps: Array<Step>;
}
interface GenerateCancelTransactionArgs {
  chainId: string;
  collectionAddress: string;
  maker: string;
  marketplace: MarketplaceKind;
  orderId: string;
}
interface GenerateCancelTransactionReturn {
  steps: Array<Step>;
}
interface ExecuteArgs {
  params: ExecuteInput;
  chainId?: string;
  signature?: string;
  method?: string;
  endpoint?: string;
  executeType?: ExecuteType;
  body?: any;
}
interface ExecuteReturn {
  orderId: string;
}
interface ListCollectiblesArgs {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page$2;
}
interface ListCollectiblesReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
}
interface GetCountOfAllCollectiblesArgs {
  chainId: string;
  contractAddress: string;
}
interface GetCountOfAllCollectiblesReturn {
  count: number;
}
interface GetCountOfFilteredCollectiblesArgs {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: CollectiblesFilter;
}
interface GetCountOfFilteredCollectiblesReturn {
  count: number;
}
interface GetFloorOrderArgs {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
}
interface GetFloorOrderReturn {
  collectible: CollectibleOrder;
}
interface ListCollectionActivitiesArgs {
  chainId: string;
  contractAddress: string;
  page?: Page$2;
}
interface ListCollectionActivitiesReturn {
  activities: Array<Activity>;
  page?: Page$2;
}
interface ListCollectibleActivitiesArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  page?: Page$2;
}
interface ListCollectibleActivitiesReturn {
  activities: Array<Activity>;
  page?: Page$2;
}
interface ListCollectiblesWithLowestListingArgs {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page$2;
}
interface ListCollectiblesWithLowestListingReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
}
interface ListCollectiblesWithHighestOfferArgs {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page$2;
}
interface ListCollectiblesWithHighestOfferReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page$2;
}
interface SyncOrderArgs {
  chainId: string;
  order: Order;
}
interface SyncOrderReturn {}
interface SyncOrdersArgs {
  chainId: string;
  orders: Array<Order>;
}
interface SyncOrdersReturn {}
interface GetOrdersArgs {
  chainId: string;
  input: Array<GetOrdersInput>;
  page?: Page$2;
}
interface GetOrdersReturn {
  orders: Array<Order>;
  page?: Page$2;
}
interface CheckoutOptionsMarketplaceArgs {
  chainId: string;
  wallet: string;
  orders: Array<CheckoutOptionsMarketplaceOrder>;
  additionalFee: number;
}
interface CheckoutOptionsMarketplaceReturn {
  options: CheckoutOptions;
}
interface CheckoutOptionsSalesContractArgs {
  chainId: string;
  wallet: string;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
}
interface CheckoutOptionsSalesContractReturn {
  options: CheckoutOptions;
}
interface SupportedMarketplacesArgs {
  chainId: string;
}
interface SupportedMarketplacesReturn {
  marketplaces: Array<MarketplaceKind>;
}
interface GetPrimarySaleItemArgs {
  chainId: string;
  primarySaleContractAddress: string;
  tokenId: string;
}
interface GetPrimarySaleItemReturn {
  item: CollectiblePrimarySaleItem;
}
interface ListPrimarySaleItemsArgs {
  chainId: string;
  primarySaleContractAddress: string;
  filter?: PrimarySaleItemsFilter;
  page?: Page$2;
}
interface ListPrimarySaleItemsReturn {
  primarySaleItems: Array<CollectiblePrimarySaleItem>;
  page?: Page$2;
}
interface GetCountOfPrimarySaleItemsArgs {
  chainId: string;
  primarySaleContractAddress: string;
  filter?: PrimarySaleItemsFilter;
}
interface GetCountOfPrimarySaleItemsReturn {
  count: number;
}
declare class Admin implements Admin {
  protected hostname: string;
  protected fetch: Fetch;
  protected path: string;
  constructor(hostname: string, fetch: Fetch);
  private url;
  createCollection: (args: CreateCollectionArgs, headers?: object, signal?: AbortSignal) => Promise<CreateCollectionReturn>;
  getCollection: (args: GetCollectionArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectionReturn>;
  updateCollection: (args: UpdateCollectionArgs, headers?: object, signal?: AbortSignal) => Promise<UpdateCollectionReturn>;
  listCollections: (args: ListCollectionsArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectionsReturn>;
  deleteCollection: (args: DeleteCollectionArgs, headers?: object, signal?: AbortSignal) => Promise<DeleteCollectionReturn>;
  syncCollection: (args: SyncCollectionArgs, headers?: object, signal?: AbortSignal) => Promise<SyncCollectionReturn>;
  createPrimarySaleContract: (args: CreatePrimarySaleContractArgs, headers?: object, signal?: AbortSignal) => Promise<CreatePrimarySaleContractReturn>;
  deletePrimarySaleContract: (args: DeletePrimarySaleContractArgs, headers?: object, signal?: AbortSignal) => Promise<DeletePrimarySaleContractReturn>;
  createCurrency: (args: CreateCurrencyArgs, headers?: object, signal?: AbortSignal) => Promise<CreateCurrencyReturn>;
  createCurrencies: (args: CreateCurrenciesArgs, headers?: object, signal?: AbortSignal) => Promise<CreateCurrenciesReturn>;
  updateCurrency: (args: UpdateCurrencyArgs, headers?: object, signal?: AbortSignal) => Promise<UpdateCurrencyReturn>;
  listCurrencies: (args: ListCurrenciesArgs, headers?: object, signal?: AbortSignal) => Promise<ListCurrenciesReturn>;
  deleteCurrency: (args: DeleteCurrencyArgs, headers?: object, signal?: AbortSignal) => Promise<DeleteCurrencyReturn>;
  addCollectibles: (args: AddCollectiblesArgs, headers?: object, signal?: AbortSignal) => Promise<AddCollectiblesReturn>;
}
declare class Marketplace implements Marketplace {
  protected hostname: string;
  protected fetch: Fetch;
  protected path: string;
  constructor(hostname: string, fetch: Fetch);
  private url;
  listCurrencies: (args: ListCurrenciesArgs, headers?: object, signal?: AbortSignal) => Promise<ListCurrenciesReturn>;
  getCollectionDetail: (args: GetCollectionDetailArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectionDetailReturn>;
  getCollectionActiveListingsCurrencies: (args: GetCollectionActiveListingsCurrenciesArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectionActiveListingsCurrenciesReturn>;
  getCollectionActiveOffersCurrencies: (args: GetCollectionActiveOffersCurrenciesArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectionActiveOffersCurrenciesReturn>;
  getCollectible: (args: GetCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleReturn>;
  getLowestPriceOfferForCollectible: (args: GetLowestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetLowestPriceOfferForCollectibleReturn>;
  getHighestPriceOfferForCollectible: (args: GetHighestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetHighestPriceOfferForCollectibleReturn>;
  getLowestPriceListingForCollectible: (args: GetLowestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetLowestPriceListingForCollectibleReturn>;
  getHighestPriceListingForCollectible: (args: GetHighestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetHighestPriceListingForCollectibleReturn>;
  listListingsForCollectible: (args: ListListingsForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<ListListingsForCollectibleReturn>;
  listOffersForCollectible: (args: ListOffersForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<ListOffersForCollectibleReturn>;
  listOrdersWithCollectibles: (args: ListOrdersWithCollectiblesArgs, headers?: object, signal?: AbortSignal) => Promise<ListOrdersWithCollectiblesReturn>;
  getCountOfAllOrders: (args: GetCountOfAllOrdersArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfAllOrdersReturn>;
  getCountOfFilteredOrders: (args: GetCountOfFilteredOrdersArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfFilteredOrdersReturn>;
  listListings: (args: ListListingsArgs, headers?: object, signal?: AbortSignal) => Promise<ListListingsReturn>;
  listOffers: (args: ListOffersArgs, headers?: object, signal?: AbortSignal) => Promise<ListOffersReturn>;
  getCountOfListingsForCollectible: (args: GetCountOfListingsForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfListingsForCollectibleReturn>;
  getCountOfOffersForCollectible: (args: GetCountOfOffersForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfOffersForCollectibleReturn>;
  getCollectibleLowestOffer: (args: GetCollectibleLowestOfferArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleLowestOfferReturn>;
  getCollectibleHighestOffer: (args: GetCollectibleHighestOfferArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleHighestOfferReturn>;
  getCollectibleLowestListing: (args: GetCollectibleLowestListingArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleLowestListingReturn>;
  getCollectibleHighestListing: (args: GetCollectibleHighestListingArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleHighestListingReturn>;
  listCollectibleListings: (args: ListCollectibleListingsArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleListingsReturn>;
  listCollectibleOffers: (args: ListCollectibleOffersArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleOffersReturn>;
  generateBuyTransaction: (args: GenerateBuyTransactionArgs, headers?: object, signal?: AbortSignal) => Promise<GenerateBuyTransactionReturn>;
  generateSellTransaction: (args: GenerateSellTransactionArgs, headers?: object, signal?: AbortSignal) => Promise<GenerateSellTransactionReturn>;
  generateListingTransaction: (args: GenerateListingTransactionArgs, headers?: object, signal?: AbortSignal) => Promise<GenerateListingTransactionReturn>;
  generateOfferTransaction: (args: GenerateOfferTransactionArgs, headers?: object, signal?: AbortSignal) => Promise<GenerateOfferTransactionReturn>;
  generateCancelTransaction: (args: GenerateCancelTransactionArgs, headers?: object, signal?: AbortSignal) => Promise<GenerateCancelTransactionReturn>;
  execute: (args: ExecuteArgs, headers?: object, signal?: AbortSignal) => Promise<ExecuteReturn>;
  listCollectibles: (args: ListCollectiblesArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectiblesReturn>;
  getCountOfAllCollectibles: (args: GetCountOfAllCollectiblesArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfAllCollectiblesReturn>;
  getCountOfFilteredCollectibles: (args: GetCountOfFilteredCollectiblesArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfFilteredCollectiblesReturn>;
  getFloorOrder: (args: GetFloorOrderArgs, headers?: object, signal?: AbortSignal) => Promise<GetFloorOrderReturn>;
  listCollectionActivities: (args: ListCollectionActivitiesArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectionActivitiesReturn>;
  listCollectibleActivities: (args: ListCollectibleActivitiesArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectibleActivitiesReturn>;
  listCollectiblesWithLowestListing: (args: ListCollectiblesWithLowestListingArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectiblesWithLowestListingReturn>;
  listCollectiblesWithHighestOffer: (args: ListCollectiblesWithHighestOfferArgs, headers?: object, signal?: AbortSignal) => Promise<ListCollectiblesWithHighestOfferReturn>;
  syncOrder: (args: SyncOrderArgs, headers?: object, signal?: AbortSignal) => Promise<SyncOrderReturn>;
  syncOrders: (args: SyncOrdersArgs, headers?: object, signal?: AbortSignal) => Promise<SyncOrdersReturn>;
  getOrders: (args: GetOrdersArgs, headers?: object, signal?: AbortSignal) => Promise<GetOrdersReturn>;
  checkoutOptionsMarketplace: (args: CheckoutOptionsMarketplaceArgs, headers?: object, signal?: AbortSignal) => Promise<CheckoutOptionsMarketplaceReturn>;
  checkoutOptionsSalesContract: (args: CheckoutOptionsSalesContractArgs, headers?: object, signal?: AbortSignal) => Promise<CheckoutOptionsSalesContractReturn>;
  supportedMarketplaces: (args: SupportedMarketplacesArgs, headers?: object, signal?: AbortSignal) => Promise<SupportedMarketplacesReturn>;
  getPrimarySaleItem: (args: GetPrimarySaleItemArgs, headers?: object, signal?: AbortSignal) => Promise<GetPrimarySaleItemReturn>;
  listPrimarySaleItems: (args: ListPrimarySaleItemsArgs, headers?: object, signal?: AbortSignal) => Promise<ListPrimarySaleItemsReturn>;
  getCountOfPrimarySaleItems: (args: GetCountOfPrimarySaleItemsArgs, headers?: object, signal?: AbortSignal) => Promise<GetCountOfPrimarySaleItemsReturn>;
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
declare class TimeoutError extends WebrpcError {
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
declare class ProjectLimitReachedError extends WebrpcError {
  constructor(name?: string, code?: number, message?: string, status?: number, cause?: string);
}
declare class NotImplementedError extends WebrpcError {
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
  WebrpcClientDisconnected = -8,
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
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
//#endregion
//#region src/react/_internal/api/marketplace-api.d.ts
declare class SequenceMarketplace extends Marketplace {
  projectAccessKey: string;
  jwtAuth?: string | undefined;
  constructor(hostname: string, projectAccessKey: string, jwtAuth?: string | undefined);
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
//#endregion
//#region src/react/_internal/api/query-keys.d.ts
declare class CollectableKeys {
  static all: readonly ["collectable"];
  static details: readonly ["collectable", "details"];
  static lists: readonly ["collectable", "list"];
  static floorOrders: readonly ["collectable", "floorOrders"];
  static userBalances: readonly ["collectable", "collectable", "details", "userBalances"];
  static royaltyPercentage: readonly ["collectable", "royaltyPercentage"];
  static highestOffers: readonly ["collectable", "collectable", "details", "highestOffers"];
  static lowestListings: readonly ["collectable", "collectable", "details", "lowestListings"];
  static offers: readonly ["collectable", "offers"];
  static offersCount: readonly ["collectable", "offersCount"];
  static listings: readonly ["collectable", "listings"];
  static listingsCount: readonly ["collectable", "listingsCount"];
  static listPrimarySaleItems: readonly ["listPrimarySaleItems"];
  static primarySaleItem: readonly ["primarySaleItem"];
  static primarySaleItemsCount: readonly ["primarySaleItemsCount"];
  static filter: readonly ["collectable", "filter"];
  static counts: readonly ["collectable", "counts"];
  static collectibleActivities: readonly ["collectable", "collectibleActivities"];
}
declare class CollectionKeys {
  static all: readonly ["collections"];
  static list: readonly ["collections", "list"];
  static detail: readonly ["collections", "detail"];
  static collectionActivities: readonly ["collections", "collectionActivities"];
  static collectionItemsOrders: readonly ["collections", "collectionItemsOrders"];
  static collectionItemsOrdersCount: readonly ["collections", "collectionItemsOrdersCount"];
  static getCountOfFilteredOrders: readonly ["collections", "getCountOfFilteredOrders"];
  static activeListingsCurrencies: readonly ["collections", "activeListingsCurrencies"];
  static activeOffersCurrencies: readonly ["collections", "activeOffersCurrencies"];
}
declare class BalanceQueries {
  static all: readonly ["balances"];
  static lists: readonly ["balances", "tokenBalances"];
  static collectionBalanceDetails: readonly ["balances", "collectionBalanceDetails"];
  static inventory: readonly ["inventory"];
}
declare class CheckoutKeys {
  static all: readonly ["checkouts"];
  static options: readonly ["checkouts", "options"];
  static cartItems: readonly ["checkouts", "cartItems"];
}
declare class CurrencyKeys {
  static all: readonly ["currencies"];
  static lists: readonly ["currencies", "list"];
  static details: readonly ["currencies", "details"];
  static conversion: readonly ["currencies", "conversion"];
}
declare class ConfigKeys {
  static all: readonly ["configs"];
  static marketplace: readonly ["configs", "marketplace"];
}
declare class TokenKeys {
  static all: readonly ["tokens"];
  static metadata: readonly ["tokens", "metadata"];
  static supplies: readonly ["tokens", "supplies"];
  static ranges: readonly ["tokens", "ranges"];
}
declare class TokenSuppliesKeys {
  static all: readonly ["tokenSupplies"];
  static maps: readonly ["tokenSupplies", "map"];
}
declare const collectableKeys: typeof CollectableKeys;
declare const collectionKeys: typeof CollectionKeys;
declare const balanceQueries: typeof BalanceQueries;
declare const checkoutKeys: typeof CheckoutKeys;
declare const currencyKeys: typeof CurrencyKeys;
declare const configKeys: typeof ConfigKeys;
declare const tokenKeys: typeof TokenKeys;
declare const tokenSuppliesKeys: typeof TokenSuppliesKeys;
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
type BuyModalBaseProps = {
  chainId: number;
  collectionAddress: Address;
  cardType?: CardType;
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
interface Transaction$1 extends PropsEvent {
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
  props: TradeItemsInfo & Transaction$1;
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
  props: ListOfferItemsInfo & Transaction$1;
  nums: ListOfferItemsValues;
}
interface TrackCreateOffer {
  props: ListOfferItemsInfo & Transaction$1;
  nums: ListOfferItemsValues;
}
interface TrackTransactionFailed extends Transaction$1, PropsEvent {}
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
interface Transaction {
  to: Hex;
  data?: Hex;
  value?: bigint;
}
type TransactionStep = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
type TransactionSteps = {
  approval: TransactionStep;
  transaction: TransactionStep;
};
declare enum TransactionType$1 {
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
//#region src/react/queries/market/marketplaceConfig.d.ts
declare const fetchMarketplaceConfig: ({
  config,
  prefetchedMarketplaceSettings
}: {
  config: SdkConfig;
  prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
}) => Promise<MarketplaceConfig>;
declare const marketplaceConfigOptions: (config: SdkConfig) => _tanstack_react_query107.OmitKeyof<_tanstack_react_query107.UseQueryOptions<MarketplaceConfig, Error, MarketplaceConfig, ("configs" | "marketplace")[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query107.QueryFunction<MarketplaceConfig, ("configs" | "marketplace")[], never> | undefined;
} & {
  queryKey: ("configs" | "marketplace")[] & {
    [dataTagSymbol]: MarketplaceConfig;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/types/transactions.d.ts
/**
 * Transaction types supported by the new buy modal
 */
declare enum TransactionType {
  MARKET_BUY = "MARKET_BUY",
  // Secondary market purchases
  PRIMARY_SALE = "PRIMARY_SALE",
}
/**
 * Base transaction parameters
 */
interface BaseTransactionParams {
  chainId: number;
  buyer: Address;
  recipient?: Address;
  transactionType: TransactionType;
}
/**
 * Market transaction parameters (secondary sales)
 */
interface MarketTransactionParams extends BaseTransactionParams {
  transactionType: TransactionType.MARKET_BUY;
  collectionAddress: Address;
  marketplace: MarketplaceKind;
  orderId: string;
  collectibleId: string;
  quantity: string;
  additionalFees: AdditionalFee[];
}
/**
 * Primary sale transaction parameters (minting/shop)
 */
interface PrimarySaleTransactionParams extends BaseTransactionParams {
  transactionType: TransactionType.PRIMARY_SALE;
  collectionAddress: Address;
  salesContractAddress: Address;
  tokenIds: string[];
  amounts: number[];
  maxTotal: string;
  paymentToken: Address;
  merkleProof?: string[];
  contractVersion: 'v1';
  tokenType: 'ERC721' | 'ERC1155';
}
/**
 * Union type for all transaction parameters
 */
type TransactionParams = MarketTransactionParams | PrimarySaleTransactionParams;
/**
 * Parameters for the useTransactionSteps hook
 */
interface TransactionStepsParams extends BaseTransactionParams {
  enabled?: boolean;
}
/**
 * Native token address constant
 */
declare const NATIVE_TOKEN_ADDRESS: Address;
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
export { SdkConfig as $, UpdateCollectionReturn as $i, GetCountOfListingsForCollectibleArgs as $n, ListPrimarySaleItemsReturn as $r, CreatePrimarySaleContractReturn as $t, OfferInput as A, SessionExpiredError as Ai, GetCollectibleHighestOfferArgs as An, ListCollectiblesArgs as Ar, CheckoutOptionsMarketplaceOrder as At, PROVIDER_ID as B, SyncCollectionReturn as Bi, GetCollectionActiveOffersCurrenciesReturn as Bn, ListCurrenciesArgs as Br, Collection as Bt, getWaasConnectors as C, errors as Ca, PrimarySaleVersion as Ci, GenerateOfferTransactionArgs as Cn, ItemsContractStatus as Cr, AddCollectiblesReturn as Ct, CollectableId as D, FilterCondition as Da, ProjectStatus as Di, GetCollectibleArgs as Dn, ListCollectibleListingsReturn as Dr, CheckoutOptions as Dt, CancelInput as E, BuilderAPI as Ea, ProjectNotFoundError as Ei, GenerateSellTransactionReturn as En, ListCollectibleListingsArgs as Er, Asset as Et, SellInput as F, Step as Fi, GetCollectibleLowestOfferReturn as Fn, ListCollectiblesWithLowestListingReturn as Fr, CollectibleOrder as Ft, getMarketplaceClient as G, TimeoutError as Gi, GetCountOfAllCollectiblesArgs as Gn, ListListingsReturn as Gr, ContractType as Gt, DEFAULT_NETWORK as H, SyncOrderReturn as Hi, GetCollectionDetailArgs as Hn, ListListingsArgs as Hr, CollectionLastSynced as Ht, Transaction as I, StepType as Ii, GetCollectibleReturn as In, ListCollectionActivitiesArgs as Ir, CollectiblePrimarySaleItem as It, marketplaceApiURL as J, TransactionNFTCheckoutProvider as Ji, GetCountOfAllOrdersReturn as Jn, ListOffersForCollectibleReturn as Jr, CreateCurrenciesArgs as Jt, getMetadataClient as K, TokenMetadata$1 as Ki, GetCountOfAllCollectiblesReturn as Kn, ListOffersArgs as Kr, CreateCollectionArgs as Kt, TransactionSteps as L, SupportedMarketplacesArgs as Li, GetCollectionActiveListingsCurrenciesArgs as Ln, ListCollectionActivitiesReturn as Lr, CollectibleSource as Lt, QueryArg as M, SortBy as Mi, GetCollectibleLowestListingArgs as Mn, ListCollectiblesWithHighestOfferArgs as Mr, CheckoutOptionsSalesContractArgs as Mt, QueryKeyArgs as N, SortOrder as Ni, GetCollectibleLowestListingReturn as Nn, ListCollectiblesWithHighestOfferReturn as Nr, CheckoutOptionsSalesContractReturn as Nt, CollectionType as O, MarketplaceWallet as Oa, PropertyFilter$1 as Oi, GetCollectibleHighestListingArgs as On, ListCollectibleOffersArgs as Or, CheckoutOptionsItem as Ot, RequiredKeys as P, SourceKind as Pi, GetCollectibleLowestOfferArgs as Pn, ListCollectiblesWithLowestListingArgs as Pr, Collectible as Pt, MarketplaceSdkContext as Q, UpdateCollectionArgs as Qi, GetCountOfFilteredOrdersReturn as Qn, ListPrimarySaleItemsArgs as Qr, CreatePrimarySaleContractArgs as Qt, TransactionType$1 as R, SupportedMarketplacesReturn as Ri, GetCollectionActiveListingsCurrenciesReturn as Rn, ListCollectionsArgs as Rr, CollectibleStatus as Rt, getEcosystemConnector as S, WebrpcStreamLostError as Sa, PrimarySaleItemsFilter as Si, GenerateListingTransactionReturn as Sn, ItemsContract as Sr, AddCollectiblesArgs as St, BuyInput as T, getQueryClient as Ta, ProjectLimitReachedError as Ti, GenerateSellTransactionArgs as Tn, ListCollectibleActivitiesReturn as Tr, Admin as Tt, getBuilderClient as U, SyncOrdersArgs as Ui, GetCollectionDetailReturn as Un, ListListingsForCollectibleArgs as Ur, CollectionPriority as Ut, getProviderEl as V, SyncOrderArgs as Vi, GetCollectionArgs as Vn, ListCurrenciesReturn as Vr, CollectionConfig as Vt, getIndexerClient as W, SyncOrdersReturn as Wi, GetCollectionReturn as Wn, ListListingsForCollectibleReturn as Wr, CollectionStatus as Wt, ApiConfig as X, TransactionSwapProvider as Xi, GetCountOfFilteredCollectiblesReturn as Xn, ListOrdersWithCollectiblesArgs as Xr, CreateCurrencyArgs as Xt, sequenceApiUrl as Y, TransactionOnRampProvider as Yi, GetCountOfFilteredCollectiblesArgs as Yn, ListOffersReturn as Yr, CreateCurrenciesReturn as Yt, Env as Z, UnauthorizedError as Zi, GetCountOfFilteredOrdersArgs as Zn, ListOrdersWithCollectiblesReturn as Zr, CreateCurrencyReturn as Zt, MarketplaceWalletOptions as _, WebrpcHeaderValue as _a, PriceFilter as _i, GenerateBuyTransactionArgs as _n, GetOrdersReturn as _r, tokenKeys as _t, NATIVE_TOKEN_ADDRESS as a, WebRPCSchemaHash as aa, NotImplementedError as ai, DeleteCurrencyArgs as an, GetFloorOrderArgs as ar, DatabeatAnalytics as at, ShopPage as b, WebrpcServerPanicError as ba, PrimarySaleItem as bi, GenerateCancelTransactionReturn as bn, InvalidArgumentError as br, Activity as bt, TransactionStepsParams as c, WebrpcBadMethodError as ca, OrderData as ci, DeletePrimarySaleContractReturn as cn, GetHighestPriceListingForCollectibleReturn as cr, useAnalytics as ct, marketplaceConfigOptions as d, WebrpcBadRouteError as da, OrderStatus as di, ExecuteInput as dn, GetLowestPriceListingForCollectibleArgs as dr, balanceQueries as dt, UpdateCurrencyArgs as ea, Marketplace as ei, CreateReq as en, GetCountOfListingsForCollectibleReturn as er, CardType as et, CollectionFilterSettings as f, WebrpcClientDisconnectedError as fa, OrderbookKind as fi, ExecuteReturn as fn, GetLowestPriceListingForCollectibleReturn as fr, checkoutKeys as ft, MarketplaceSocials as g, WebrpcHeader as ga, PostRequest as gi, Filter$1 as gn, GetOrdersInput as gr, currencyKeys as gt, MarketplaceConfig as h, WebrpcErrorCodes as ha, PermissionDeniedError as hi, Fetch as hn, GetOrdersArgs as hr, configKeys as ht, MarketTransactionParams as i, WalletKind as ia, NotFoundError as ii, DeleteCollectionReturn as in, GetCountOfPrimarySaleItemsReturn as ir, ShopCollection$1 as it, Optional as j, Signature as ji, GetCollectibleHighestOfferReturn as jn, ListCollectiblesReturn as jr, CheckoutOptionsMarketplaceReturn as jt, ListingInput as k, PropertyType as ki, GetCollectibleHighestListingReturn as kn, ListCollectibleOffersReturn as kr, CheckoutOptionsMarketplaceArgs as kt, TransactionType as l, WebrpcBadRequestError as la, OrderFilter as li, Domain as ln, GetHighestPriceOfferForCollectibleArgs as lr, BuyModalProps as lt, MarketPage as m, WebrpcError as ma, Page$2 as mi, FeeBreakdown as mn, GetLowestPriceOfferForCollectibleReturn as mr, collectionKeys as mt, getWagmiChainsAndTransports as n, UserNotFoundError as na, MetadataStatus as ni, CurrencyStatus as nn, GetCountOfOffersForCollectibleReturn as nr, MarketCollection$1 as nt, PrimarySaleTransactionParams as o, WebRPCSchemaVersion as oa, OfferType as oi, DeleteCurrencyReturn as on, GetFloorOrderReturn as or, Event$1 as ot, EcosystemWalletSettings as p, WebrpcEndpointError as pa, OrdersFilter as pi, ExecuteType as pn, GetLowestPriceOfferForCollectibleArgs as pr, collectableKeys as pt, getSequenceApiClient as q, TransactionCrypto as qi, GetCountOfAllOrdersArgs as qn, ListOffersForCollectibleArgs as qr, CreateCollectionReturn as qt, BaseTransactionParams as r, VersionFromHeader as ra, MethodNotFoundError as ri, DeleteCollectionArgs as rn, GetCountOfPrimarySaleItemsArgs as rr, Price as rt, TransactionParams as s, WebRPCVersion as sa, Order as si, DeletePrimarySaleContractArgs as sn, GetHighestPriceListingForCollectibleArgs as sr, EventTypes as st, createWagmiConfig as t, UpdateCurrencyReturn as ta, MarketplaceKind as ti, Currency as tn, GetCountOfOffersForCollectibleArgs as tr, CollectibleCardAction as tt, fetchMarketplaceConfig as u, WebrpcBadResponseError as ua, OrderSide as ui, ExecuteArgs as un, GetHighestPriceOfferForCollectibleReturn as ur, ModalCallbacks as ut, MarketplaceWalletWaasSettings as v, WebrpcInternalErrorError as va, PrimarySaleContract as vi, GenerateBuyTransactionReturn as vn, GetPrimarySaleItemArgs as vr, tokenSuppliesKeys as vt, ApiArgs as w, webrpcErrorByCode as wa, Project as wi, GenerateOfferTransactionReturn as wn, ListCollectibleActivitiesArgs as wr, AdditionalFee as wt, getConnectors as x, WebrpcStreamFinishedError as xa, PrimarySaleItemDetailType as xi, GenerateListingTransactionArgs as xn, InvalidTierError as xr, ActivityAction as xt, MetadataFilterRule as y, WebrpcRequestFailedError as ya, PrimarySaleContractStatus as yi, GenerateCancelTransactionArgs as yn, GetPrimarySaleItemReturn as yr, SequenceMarketplace as yt, ValuesOptional as z, SyncCollectionArgs as zi, GetCollectionActiveOffersCurrenciesArgs as zn, ListCollectionsReturn as zr, CollectiblesFilter as zt };
//# sourceMappingURL=create-config-BA_ne-vj.d.ts.map