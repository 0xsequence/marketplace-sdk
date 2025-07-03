//#region src/react/_internal/api/marketplace.gen.d.ts
declare const WebrpcHeader = "Webrpc";
declare const WebrpcHeaderValue = "webrpc@v0.25.4;gen-typescript@v0.17.0;marketplace-api@v0.0.0-cf3a5fae407a732cd5a90e4fd68184ac5591b2c1";
declare const WebRPCVersion = "v1";
declare const WebRPCSchemaVersion = "";
declare const WebRPCSchemaHash = "cf3a5fae407a732cd5a90e4fd68184ac5591b2c1";
type WebrpcGenVersions = {
  webrpcGenVersion: string;
  codeGenName: string;
  codeGenVersion: string;
  schemaName: string;
  schemaVersion: string;
};
declare function VersionFromHeader(headers: Headers): WebrpcGenVersions;
interface TokenMetadata {
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
}
declare enum SourceKind {
  unknown = "unknown",
  external = "external",
  sequence_marketplace_v1 = "sequence_marketplace_v1",
  sequence_marketplace_v2 = "sequence_marketplace_v2",
}
declare enum OrderSide {
  unknown = "unknown",
  listing = "listing",
  offer = "offer",
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
  LAOS_ERC_721 = "LAOS-ERC-721",
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
declare enum PrimarySaleItemDetailType {
  unknown = "unknown",
  global = "global",
  individual = "individual",
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
interface Filter {
  text?: string;
  properties?: Array<PropertyFilter>;
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
}
interface Order {
  orderId: string;
  marketplace: MarketplaceKind;
  side: OrderSide;
  status: OrderStatus;
  chainId: number;
  originName: string;
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
  supply: string;
  supplyCap: string;
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
  page?: Page;
}
interface ListCollectionsReturn {
  collections: Array<Collection>;
  page?: Page;
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
interface Marketplace$1 {
  listCurrencies(args: ListCurrenciesArgs, headers?: object, signal?: AbortSignal): Promise<ListCurrenciesReturn>;
  getCollectionDetail(args: GetCollectionDetailArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectionDetailReturn>;
  getCollectible(args: GetCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleReturn>;
  getLowestPriceOfferForCollectible(args: GetLowestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetLowestPriceOfferForCollectibleReturn>;
  getHighestPriceOfferForCollectible(args: GetHighestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetHighestPriceOfferForCollectibleReturn>;
  getLowestPriceListingForCollectible(args: GetLowestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetLowestPriceListingForCollectibleReturn>;
  getHighestPriceListingForCollectible(args: GetHighestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetHighestPriceListingForCollectibleReturn>;
  listListingsForCollectible(args: ListListingsForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<ListListingsForCollectibleReturn>;
  listOffersForCollectible(args: ListOffersForCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<ListOffersForCollectibleReturn>;
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
   * only used in a case of external transactions ( when we create off-chain transactions ) for instance opensea market
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
interface GetCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}
interface GetCollectibleReturn {
  metadata: TokenMetadata;
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
  page?: Page;
}
interface ListListingsForCollectibleReturn {
  listings: Array<Order>;
  page?: Page;
}
interface ListOffersForCollectibleArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page;
}
interface ListOffersForCollectibleReturn {
  offers: Array<Order>;
  page?: Page;
}
interface ListListingsArgs {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page;
}
interface ListListingsReturn {
  listings: Array<Order>;
  page?: Page;
}
interface ListOffersArgs {
  chainId: string;
  contractAddress: string;
  filter?: OrderFilter;
  page?: Page;
}
interface ListOffersReturn {
  offers: Array<Order>;
  page?: Page;
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
  page?: Page;
}
interface ListCollectibleListingsReturn {
  listings: Array<Order>;
  page?: Page;
}
interface ListCollectibleOffersArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  filter?: OrderFilter;
  page?: Page;
}
interface ListCollectibleOffersReturn {
  offers: Array<Order>;
  page?: Page;
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
  walletType?: WalletKind;
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
  chainId: string;
  signature: string;
  method: string;
  endpoint: string;
  executeType: ExecuteType;
  body: any;
}
interface ExecuteReturn {
  orderId: string;
}
interface ListCollectiblesArgs {
  chainId: string;
  side: OrderSide;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page;
}
interface ListCollectiblesReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
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
  page?: Page;
}
interface ListCollectionActivitiesReturn {
  activities: Array<Activity>;
  page?: Page;
}
interface ListCollectibleActivitiesArgs {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  page?: Page;
}
interface ListCollectibleActivitiesReturn {
  activities: Array<Activity>;
  page?: Page;
}
interface ListCollectiblesWithLowestListingArgs {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page;
}
interface ListCollectiblesWithLowestListingReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
}
interface ListCollectiblesWithHighestOfferArgs {
  chainId: string;
  contractAddress: string;
  filter?: CollectiblesFilter;
  page?: Page;
}
interface ListCollectiblesWithHighestOfferReturn {
  collectibles: Array<CollectibleOrder>;
  page?: Page;
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
  page?: Page;
}
interface GetOrdersReturn {
  orders: Array<Order>;
  page?: Page;
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
  page?: Page;
}
interface ListPrimarySaleItemsReturn {
  primarySaleItems: Array<CollectiblePrimarySaleItem>;
  page?: Page;
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
  protected fetch: Fetch$1;
  protected path: string;
  constructor(hostname: string, fetch: Fetch$1);
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
declare class Marketplace$1 implements Marketplace$1 {
  protected hostname: string;
  protected fetch: Fetch$1;
  protected path: string;
  constructor(hostname: string, fetch: Fetch$1);
  private url;
  listCurrencies: (args: ListCurrenciesArgs, headers?: object, signal?: AbortSignal) => Promise<ListCurrenciesReturn>;
  getCollectionDetail: (args: GetCollectionDetailArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectionDetailReturn>;
  getCollectible: (args: GetCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetCollectibleReturn>;
  getLowestPriceOfferForCollectible: (args: GetLowestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetLowestPriceOfferForCollectibleReturn>;
  getHighestPriceOfferForCollectible: (args: GetHighestPriceOfferForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetHighestPriceOfferForCollectibleReturn>;
  getLowestPriceListingForCollectible: (args: GetLowestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetLowestPriceListingForCollectibleReturn>;
  getHighestPriceListingForCollectible: (args: GetHighestPriceListingForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<GetHighestPriceListingForCollectibleReturn>;
  listListingsForCollectible: (args: ListListingsForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<ListListingsForCollectibleReturn>;
  listOffersForCollectible: (args: ListOffersForCollectibleArgs, headers?: object, signal?: AbortSignal) => Promise<ListOffersForCollectibleReturn>;
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
type Fetch$1 = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
//#endregion
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
}
interface LookupMarketplaceReturn {
  marketplace: Marketplace;
  marketCollections: Array<MarketCollection$2>;
  shopCollections: Array<ShopCollection$2>;
}
interface Marketplace {
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
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings$1;
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
  createdAt?: string;
  updatedAt?: string;
}
interface MarketplaceService {
  /**
   * Public Methods
   */
  lookupMarketplace(args: LookupMarketplaceArgs, headers?: object, signal?: AbortSignal): Promise<LookupMarketplaceReturn>;
}
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
declare class MarketplaceService {
  protected hostname: string;
  protected fetch: Fetch;
  protected path: string;
  constructor(hostname: string, fetch: Fetch);
  private url;
  lookupMarketplace: (args: LookupMarketplaceArgs, headers?: object, signal?: AbortSignal) => Promise<LookupMarketplaceReturn>;
}
//#endregion
//#region src/types/types.d.ts
type Price = {
  amountRaw: string;
  currency: Currency;
};
type MarketplaceType = 'market' | 'shop';
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
} & SdkConfig;
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
interface MarketplaceCollection {
  chainId: number;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
}
interface MarketCollection extends MarketplaceCollection {
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
}
interface ShopCollection extends MarketplaceCollection {
  marketplaceType: MarketplaceType;
  saleAddress: string;
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
export { Activity, ActivityAction, AddCollectiblesArgs, AddCollectiblesReturn, AdditionalFee, Admin, ApiConfig, Asset, CheckoutOptions, CheckoutOptionsItem, CheckoutOptionsMarketplaceArgs, CheckoutOptionsMarketplaceOrder, CheckoutOptionsMarketplaceReturn, CheckoutOptionsSalesContractArgs, CheckoutOptionsSalesContractReturn, Collectible, CollectibleCardAction, CollectibleOrder, CollectiblePrimarySaleItem, CollectibleSource, CollectibleStatus, CollectiblesFilter, Collection, CollectionConfig, CollectionFilterSettings, CollectionLastSynced, CollectionPriority, CollectionStatus, ContractType, CreateCollectionArgs, CreateCollectionReturn, CreateCurrenciesArgs, CreateCurrenciesReturn, CreateCurrencyArgs, CreateCurrencyReturn, CreatePrimarySaleContractArgs, CreatePrimarySaleContractReturn, CreateReq, Currency, CurrencyStatus, DeleteCollectionArgs, DeleteCollectionReturn, DeleteCurrencyArgs, DeleteCurrencyReturn, DeletePrimarySaleContractArgs, DeletePrimarySaleContractReturn, Domain, EcosystemWalletSettings, Env, ExecuteArgs, ExecuteReturn, ExecuteType, FeeBreakdown, Fetch$1 as Fetch, Filter, FilterCondition, GenerateBuyTransactionArgs, GenerateBuyTransactionReturn, GenerateCancelTransactionArgs, GenerateCancelTransactionReturn, GenerateListingTransactionArgs, GenerateListingTransactionReturn, GenerateOfferTransactionArgs, GenerateOfferTransactionReturn, GenerateSellTransactionArgs, GenerateSellTransactionReturn, GetCollectibleArgs, GetCollectibleHighestListingArgs, GetCollectibleHighestListingReturn, GetCollectibleHighestOfferArgs, GetCollectibleHighestOfferReturn, GetCollectibleLowestListingArgs, GetCollectibleLowestListingReturn, GetCollectibleLowestOfferArgs, GetCollectibleLowestOfferReturn, GetCollectibleReturn, GetCollectionArgs, GetCollectionDetailArgs, GetCollectionDetailReturn, GetCollectionReturn, GetCountOfAllCollectiblesArgs, GetCountOfAllCollectiblesReturn, GetCountOfFilteredCollectiblesArgs, GetCountOfFilteredCollectiblesReturn, GetCountOfListingsForCollectibleArgs, GetCountOfListingsForCollectibleReturn, GetCountOfOffersForCollectibleArgs, GetCountOfOffersForCollectibleReturn, GetCountOfPrimarySaleItemsArgs, GetCountOfPrimarySaleItemsReturn, GetFloorOrderArgs, GetFloorOrderReturn, GetHighestPriceListingForCollectibleArgs, GetHighestPriceListingForCollectibleReturn, GetHighestPriceOfferForCollectibleArgs, GetHighestPriceOfferForCollectibleReturn, GetLowestPriceListingForCollectibleArgs, GetLowestPriceListingForCollectibleReturn, GetLowestPriceOfferForCollectibleArgs, GetLowestPriceOfferForCollectibleReturn, GetOrdersArgs, GetOrdersInput, GetOrdersReturn, GetPrimarySaleItemArgs, GetPrimarySaleItemReturn, InvalidArgumentError, InvalidTierError, ItemsContract, ItemsContractStatus, ListCollectibleActivitiesArgs, ListCollectibleActivitiesReturn, ListCollectibleListingsArgs, ListCollectibleListingsReturn, ListCollectibleOffersArgs, ListCollectibleOffersReturn, ListCollectiblesArgs, ListCollectiblesReturn, ListCollectiblesWithHighestOfferArgs, ListCollectiblesWithHighestOfferReturn, ListCollectiblesWithLowestListingArgs, ListCollectiblesWithLowestListingReturn, ListCollectionActivitiesArgs, ListCollectionActivitiesReturn, ListCollectionsArgs, ListCollectionsReturn, ListCurrenciesArgs, ListCurrenciesReturn, ListListingsArgs, ListListingsForCollectibleArgs, ListListingsForCollectibleReturn, ListListingsReturn, ListOffersArgs, ListOffersForCollectibleArgs, ListOffersForCollectibleReturn, ListOffersReturn, ListPrimarySaleItemsArgs, ListPrimarySaleItemsReturn, LookupMarketplaceReturn, MarketCollection$1 as MarketCollection, MarketPage, Marketplace$1 as Marketplace, MarketplaceConfig, MarketplaceKind, MarketplaceSdkContext, MarketplaceService, MarketplaceSocials, MarketplaceType, MarketplaceWallet, MarketplaceWalletEcosystem, MarketplaceWalletEmbedded, MarketplaceWalletOptions, MarketplaceWalletType, MarketplaceWalletWaasSettings, MetadataFilterRule, MethodNotFoundError, NotFoundError, NotImplementedError, Order, OrderData, OrderFilter, OrderSide, OrderStatus, OrderbookKind, Page, PermissionDeniedError, PostRequest, Price, PrimarySaleContract, PrimarySaleContractStatus, PrimarySaleItem, PrimarySaleItemDetailType, PrimarySaleItemsFilter, Project, ProjectLimitReachedError, ProjectNotFoundError, ProjectStatus, PropertyFilter, PropertyType, SdkConfig, SessionExpiredError, ShopCollection$1 as ShopCollection, ShopPage, Signature, SortBy, SortOrder, SourceKind, Step, StepType, SupportedMarketplacesArgs, SupportedMarketplacesReturn, SyncCollectionArgs, SyncCollectionReturn, SyncOrderArgs, SyncOrderReturn, SyncOrdersArgs, SyncOrdersReturn, TimeoutError, TokenMetadata, TransactionCrypto, TransactionNFTCheckoutProvider, TransactionOnRampProvider, TransactionSwapProvider, UnauthorizedError, UpdateCollectionArgs, UpdateCollectionReturn, UpdateCurrencyArgs, UpdateCurrencyReturn, UserNotFoundError, VersionFromHeader, WalletKind, WebRPCSchemaHash, WebRPCSchemaVersion, WebRPCVersion, WebrpcBadMethodError, WebrpcBadRequestError, WebrpcBadResponseError, WebrpcBadRouteError, WebrpcClientDisconnectedError, WebrpcEndpointError, WebrpcError, WebrpcErrorCodes, WebrpcHeader, WebrpcHeaderValue, WebrpcInternalErrorError, WebrpcRequestFailedError, WebrpcServerPanicError, WebrpcStreamFinishedError, WebrpcStreamLostError, errors, webrpcErrorByCode };
//# sourceMappingURL=new-marketplace-types-Cggo50UM.d.ts.map