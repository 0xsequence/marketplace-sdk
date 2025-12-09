import { AdditionalFee, AdditionalFee as AdditionalFee$1, AdditionalFee as AdditionalFee$2, ApprovalStep, Builder, CheckoutOptions, CheckoutOptions as CheckoutOptions$1, CheckoutOptions as CheckoutOptions$2, CheckoutOptionsItem as CheckoutOptionsItem$1, CheckoutOptionsItem as CheckoutOptionsItem$2, CheckoutOptionsMarketplaceRequest, Collectible, Collectible as Collectible$1, CollectibleOrder, CollectibleOrder as CollectibleOrder$1, CollectiblesFilter as CollectiblesFilter$1, CollectiblesFilter as CollectiblesFilter$2, Collection, Collection as Collection$1, CollectionStatus, CollectionStatus as CollectionStatus$1, ContractInfo, ContractType, ContractType as ContractType$1, ContractType as ContractType$2, CreateReq, CreateReq as CreateReq$1, CreateReq as CreateReq$2, Currency, Currency as Currency$1, Currency as Currency$2, CurrencyStatus, ExecuteType, Filter as Filter$1, FilterCondition, FilterCondition as FilterCondition$1, GenerateCancelTransactionRequest, GenerateListingTransactionRequest, GenerateOfferTransactionRequest, GenerateSellTransactionRequest, GetCollectibleHighestOfferRequest, GetCollectibleHighestOfferResponse, GetCountOfListingsForCollectibleResponse, GetCountOfOffersForCollectibleResponse, GetCountOfPrimarySaleItemsRequest as GetCountOfPrimarySaleItemsRequest$1, GetCountOfPrimarySaleItemsResponse as GetCountOfPrimarySaleItemsResponse$1, GetFloorOrderRequest, GetHighestPriceOfferForCollectibleRequest, GetLowestPriceListingForCollectibleRequest, ListCollectibleActivitiesRequest, ListCollectibleActivitiesResponse, ListCollectibleListingsRequest, ListCollectibleListingsResponse as ListCollectibleListingsResponse$1, ListCollectibleOffersResponse, ListCollectiblesRequest, ListCollectiblesResponse, ListCollectionActivitiesRequest, ListCollectionActivitiesResponse, ListCurrenciesRequest, ListListingsForCollectibleResponse, ListOffersForCollectibleRequest, ListOffersForCollectibleResponse, ListOrdersWithCollectiblesRequest, ListOrdersWithCollectiblesResponse, ListPrimarySaleItemsRequest, ListPrimarySaleItemsResponse, LookupMarketplaceReturn, MarketCollection, MarketPage, MarketplaceClient, MarketplaceCollection, MarketplaceKind, MarketplaceKind as MarketplaceKind$1, MarketplaceKind as MarketplaceKind$2, MarketplaceSettings, MarketplaceWallet, MarketplaceWalletType, MetadataStatus, OfferType, OpenIdProvider, Order as Order$1, Order as Order$2, OrderData, OrderData as OrderData$1, OrderFilter as OrderFilter$1, OrderFilter as OrderFilter$2, OrderSide as OrderSide$1, OrderSide as OrderSide$2, OrderStatus, OrderStatus as OrderStatus$1, OrderbookKind, OrderbookKind as OrderbookKind$1, OrderbookKind as OrderbookKind$2, Page as Page$1, Page as Page$2, PostRequest, PostRequest as PostRequest$1, PriceFilter, PriceFilter as PriceFilter$1, PrimarySaleItem, PrimarySaleItemsFilter as PrimarySaleItemsFilter$1, PropertyFilter as PropertyFilter$1, PropertyFilter as PropertyFilter$2, PropertyType, PropertyType as PropertyType$1, SequenceIndexer, SequenceMetadata, ShopCollection, ShopPage, Signature, Signature as Signature$1, SignatureStep, SortBy, SortBy as SortBy$1, SortOrder, SortOrder as SortOrder$1, Step, Step as Step$1, Step as Step$2, StepType as StepType$1, StepType as StepType$2, TokenMetadata as TokenMetadata$1, TransactionCrypto, TransactionCrypto as TransactionCrypto$1, TransactionOnRampProvider, TransactionStep, WalletKind as WalletKind$1, WalletKind as WalletKind$2, isSignatureStep, isTransactionStep } from "@0xsequence/api-client";
import * as wagmi0 from "wagmi";
import { CreateConnectorFn } from "wagmi";
import { Wallet } from "@0xsequence/connect";
import { Address as Address$1, Chain, Hex, Transport } from "viem";
import * as _tanstack_react_query437 from "@tanstack/react-query";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { SequenceAPIClient } from "@0xsequence/api";
import { Databeat, Event } from "@databeat/tracker";
import "@xstate/store";

//#region src/react/_internal/api/builder-api.d.ts
/**
 * BuilderAPI wraps the generated MarketplaceService to apply type transformations
 * Transforms raw API responses to use bigint primitives and nested structures
 */
declare class BuilderAPI {
  projectAccessKey?: string | undefined;
  jwtAuth?: string | undefined;
  private client;
  constructor(hostname: string, projectAccessKey?: string | undefined, jwtAuth?: string | undefined);
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /**
   * Lookup marketplace configuration with transformed types
   * - Nests collections within market/shop pages
   * - Converts tokenIds to bigint[]
   */
  lookupMarketplace(args: Builder.LookupMarketplaceArgs, headers?: object, signal?: AbortSignal): Promise<Builder.LookupMarketplaceReturn>;
}
//#endregion
//#region src/react/queries/marketplace/config.d.ts
declare const fetchMarketplaceConfig: ({
  config,
  prefetchedMarketplaceSettings
}: {
  config: SdkConfig;
  prefetchedMarketplaceSettings?: Builder.LookupMarketplaceReturn;
}) => Promise<MarketplaceConfig>;
declare const marketplaceConfigOptions: (config: SdkConfig) => _tanstack_react_query437.OmitKeyof<_tanstack_react_query437.UseQueryOptions<MarketplaceConfig, Error, MarketplaceConfig, readonly ["marketplace", string, {}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query437.QueryFunction<MarketplaceConfig, readonly ["marketplace", string, {}], never> | undefined;
} & {
  queryKey: readonly ["marketplace", string, {}] & {
    [dataTagSymbol]: MarketplaceConfig;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/_internal/api/get-query-client.d.ts
declare function getQueryClient(): QueryClient;
//#endregion
//#region src/react/_internal/api/marketplace-api.d.ts
declare class SequenceMarketplace extends MarketplaceClient {
  projectAccessKey: string;
  jwtAuth?: string;
  constructor(hostname: string, projectAccessKey: string, jwtAuth?: string);
}
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
//#region src/react/types/query.d.ts
/**
 * Standard query options that can be used across all marketplace SDK hooks
 *
 * Based on TanStack Query v5 UseQueryOptions, but simplified, the type from TanStack is hard to modify
 */
interface StandardQueryOptions<TError = Error> {
  /** Whether the query should be enabled/disabled */
  enabled?: boolean;
  /** Time in milliseconds that  data is considered fresh */
  staleTime?: number;
  gcTime?: number;
  refetchInterval?: number | false | ((query: any) => number | false);
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: TError) => number);
  suspense?: boolean;
}
/**
 * Standard infinite query options that can be used across all marketplace SDK hooks
 * that support infinite pagination
 */
interface StandardInfiniteQueryOptions<TError = Error> extends StandardQueryOptions<TError> {
  /** Maximum number of pages to fetch */
  maxPages?: number;
}
//#endregion
//#region src/react/_internal/query-builder.d.ts
interface BaseQueryParams {
  config: SdkConfig;
  query?: StandardQueryOptions;
}
interface BaseInfiniteQueryParams {
  config: SdkConfig;
  query?: StandardInfiniteQueryOptions;
}
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
/**
 * Validates that a readonly tuple contains ALL required keys from a type
 * This ensures developers don't forget to list any required parameters
 *
 * How it works:
 * - Checks if every RequiredKey<TParams> exists in the provided tuple
 * - Returns the tuple type if valid, or 'never' if keys are missing
 * - Must be used with 'as const' for proper type inference
 *
 * Example:
 * type Keys = RequiredKeys<{a: string, b: number, c?: boolean}>; // 'a' | 'b'
 * type Valid = EnsureAllRequiredKeys<Params, ['a', 'b']>; // ✅ OK - returns ['a', 'b']
 * type Invalid = EnsureAllRequiredKeys<Params, ['a']>; // ❌ Error - returns 'never'
 */
type EnsureAllRequiredKeys<TParams, TKeys extends ReadonlyArray<RequiredKeys<TParams>>> = RequiredKeys<TParams> extends TKeys[number] ? TKeys : never;
interface QueryBuilderConfig<TParams extends BaseQueryParams, TData> {
  getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
  /**
   * Type-safe: Must include ALL required keys from TParams
   * Example: ['chainId', 'collectionAddress', 'tokenId', 'config']
   */
  requiredParams: EnsureAllRequiredKeys<TParams, ReadonlyArray<RequiredKeys<TParams>>>;
  fetcher: (params: TParams) => Promise<TData>;
  /**
   * Optional custom validation beyond truthiness checks
   * Example: (params) => (params.orders?.length ?? 0) > 0
   */
  customValidation?: (params: WithOptionalParams<TParams>) => boolean;
}
interface InfiniteQueryBuilderConfig<TParams extends BaseInfiniteQueryParams, TResponse> {
  getQueryKey: (params: WithOptionalInfiniteParams<TParams>) => QueryKey;
  /**
   * Type-safe: Must include ALL required keys from TParams
   * Example: ['chainId', 'collectionAddress', 'side', 'config']
   */
  requiredParams: EnsureAllRequiredKeys<TParams, ReadonlyArray<RequiredKeys<TParams>>>;
  fetcher: (params: TParams, page: Page$2) => Promise<TResponse>;
  getPageInfo: (response: TResponse) => Page$2 | undefined;
  /**
   * Optional custom validation beyond truthiness checks
   * Example: (params) => (params.orders?.length ?? 0) > 0
   */
  customValidation?: (params: WithOptionalInfiniteParams<TParams>) => boolean;
}
type WithOptionalParams<T extends BaseQueryParams> = { [K in keyof T]?: T[K] } & Pick<T, 'config'> & Partial<Pick<T, 'query'>>;
type WithOptionalInfiniteParams<T extends BaseInfiniteQueryParams> = { [K in keyof T]?: T[K] } & Pick<T, 'config'> & Partial<Pick<T, 'query'>>;
declare function requiredParamsFor<TParams>(): <const TKeys extends ReadonlyArray<RequiredKeys<TParams>>>(keys: TKeys & (RequiredKeys<TParams> extends TKeys[number] ? TKeys : never)) => TKeys;
/**
 * Type Safety:
 * - requiredParams must include ALL required fields from TParams
 * - TypeScript validates this at compile time
 */
declare function buildQueryOptions<TParams extends BaseQueryParams, TData, const TKeys extends ReadonlyArray<RequiredKeys<TParams>>>(config: {
  getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
  requiredParams: TKeys & (RequiredKeys<TParams> extends TKeys[number] ? TKeys : never);
  fetcher: (params: TParams) => Promise<TData>;
  customValidation?: (params: WithOptionalParams<TParams>) => boolean;
}, params: WithOptionalParams<TParams>): _tanstack_react_query437.OmitKeyof<_tanstack_react_query437.UseQueryOptions<TData, Error, TData, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query437.QueryFunction<TData, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TData;
    [dataTagErrorSymbol]: Error;
  };
};
/**
 * Type Safety:
 * - requiredParams must include ALL required fields from TParams
 * - TypeScript validates this at compile time
 */
declare function buildInfiniteQueryOptions<TParams extends BaseInfiniteQueryParams, TResponse, const TKeys extends ReadonlyArray<RequiredKeys<TParams>>>(config: {
  getQueryKey: (params: WithOptionalInfiniteParams<TParams>) => QueryKey;
  requiredParams: TKeys & (RequiredKeys<TParams> extends TKeys[number] ? TKeys : never);
  fetcher: (params: TParams, page: Page$2) => Promise<TResponse>;
  getPageInfo: (response: TResponse) => Page$2 | undefined;
  customValidation?: (params: WithOptionalInfiniteParams<TParams>) => boolean;
}, params: WithOptionalInfiniteParams<TParams>): _tanstack_react_query437.OmitKeyof<_tanstack_react_query437.UseInfiniteQueryOptions<TResponse, Error, _tanstack_react_query437.InfiniteData<TResponse, unknown>, readonly unknown[], Page$2>, "queryFn"> & {
  queryFn?: _tanstack_react_query437.QueryFunction<TResponse, readonly unknown[], Page$2> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query437.InfiniteData<TResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/_internal/types.d.ts
interface QueryArg {
  enabled?: boolean;
}
type CollectableId = string | number;
type CollectionType = ContractType.ERC1155 | ContractType.ERC721;
interface Transaction$1 {
  to: Hex;
  data?: Hex;
  value?: bigint;
}
type TransactionStep$1 = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
type TransactionSteps = {
  approval: TransactionStep$1;
  transaction: TransactionStep$1;
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
/**
 * Makes all properties in T required (removes optionality)
 * Note: Different from RequiredKeys in query-builder.ts which extracts required key names
 */
type AllRequired<T> = { [K in keyof T]-?: T[K] };
type QueryKeyArgs<T> = { [K in keyof AllRequired<T>]: T[K] | undefined };
type Optional<T, K$1 extends keyof T> = Pick<Partial<T>, K$1> & Omit<T, K$1>;
/**
 * Extracts only API-relevant fields from query params, excluding SDK config and query options
 * Converts optional properties (prop?: T) to explicit union types (prop: T | undefined)
 */
type ApiArgs<T> = ValuesOptional<Omit<T, 'config' | 'query'>>;
/**
 * Wraps API request types with SDK-specific requirements
 * - Adds config and query fields
 * - Makes all fields optional including config (hooks use useConfig() as default)
 * - Works with standard queries
 */
type SdkQueryParams<TApiRequest, TQuery = StandardQueryOptions> = { [K in keyof TApiRequest]?: TApiRequest[K] } & {
  config?: SdkConfig;
  query?: TQuery;
};
/**
 * Wraps API request types with SDK-specific requirements for infinite queries
 * - Adds config and query fields
 * - Makes all fields optional including config (hooks use useConfig() as default)
 */
type SdkInfiniteQueryParams<TApiRequest> = SdkQueryParams<TApiRequest, StandardInfiniteQueryOptions>;
/**
 * Makes specified keys required in an object type
 * Used in fetchers to ensure required params exist
 */
type WithRequired<T, K$1 extends keyof T = keyof T> = T & { [P in K$1]-?: T[P] };
//#endregion
//#region src/react/_internal/utils.d.ts
declare const clamp: (val: number, min: number, max: number) => number;
/**
 * Recursively converts all bigint values to strings in an object
 * This is needed for React Query keys which must be JSON-serializable
 */
declare function serializeBigInts<T>(obj: T): T;
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
//#region src/react/ui/modals/_internal/types.d.ts
interface ActionButton {
  label: string;
  action: () => void;
}
//#endregion
//#region src/react/ui/modals/BuyModal/store.d.ts
type PaymentModalProps = {
  tokenId: bigint;
  marketplace: MarketplaceKind$1;
  orderId: string;
  customCreditCardProviderCallback?: (buyStep: Step) => void;
};
type BuyModalBaseProps = {
  chainId: number;
  skipNativeBalanceCheck?: boolean;
  nativeTokenAddress?: Address$1;
  customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
  collectionAddress: Address$1;
  cardType?: CardType;
  successActionButtons?: ActionButton[];
  hideQuantitySelector?: boolean;
  onRampProvider?: TransactionOnRampProvider;
};
type ShopBuyModalProps = BuyModalBaseProps & {
  cardType: 'shop';
  salesContractAddress: Address$1;
  items: Array<Partial<CheckoutOptionsItem$1> & {
    tokenId?: bigint;
  }>;
  quantityRemaining: bigint;
  salePrice: {
    amount: bigint;
    currencyAddress: Address$1;
  };
  unlimitedSupply?: boolean;
};
type MarketplaceBuyModalProps = BuyModalBaseProps & {
  cardType?: 'market';
  tokenId: bigint;
  marketplace: MarketplaceKind$1;
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
interface MarketplaceConfig {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketPage;
  shop: ShopPage;
}
/**
 * Type guard to check if a collection is a ShopCollection
 * Shop collections are for primary sales
 */
declare function isShopCollection(collection: MarketplaceCollection): collection is ShopCollection;
/**
 * Type guard to check if a collection is a MarketCollection
 * Market collections are for secondary market trading
 */
declare function isMarketCollection(collection: MarketplaceCollection): collection is MarketCollection;
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
type Price = {
  amountRaw: bigint;
  currency: Currency;
};
/**
 * Card type for UI rendering
 * Note: For collections, use type guards (isShopCollection/isMarketCollection) instead
 */
type CardType = 'market' | 'shop' | 'inventory-non-tradable';
declare enum CollectibleCardAction {
  BUY = "Buy",
  SELL = "Sell",
  LIST = "Create listing",
  OFFER = "Make an offer",
  TRANSFER = "Transfer",
}
//#endregion
//#region src/types/sdk-config.d.ts
type Env = 'development' | 'production' | 'next';
type ApiConfig = {
  env?: Env;
  url?: string;
  accessKey?: string;
};
type CheckoutMode = 'crypto' | 'trails' | {
  mode: 'sequence-checkout';
  options: CheckoutOptions;
};
type SdkConfig = {
  projectAccessKey: string;
  projectId: string;
  walletConnectProjectId?: string;
  shadowDom?: boolean;
  experimentalShadowDomCssOverride?: string;
  checkoutMode?: CheckoutMode | undefined;
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
  buyer: Address$1;
  recipient?: Address$1;
  transactionType: TransactionType;
}
/**
 * Market transaction parameters (secondary sales)
 */
interface MarketTransactionParams extends BaseTransactionParams {
  transactionType: TransactionType.MARKET_BUY;
  collectionAddress: Address$1;
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
  collectionAddress: Address$1;
  salesContractAddress: Address$1;
  tokenIds: string[];
  amounts: number[];
  maxTotal: string;
  paymentToken: Address$1;
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
declare const NATIVE_TOKEN_ADDRESS: Address$1;
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
export { GenerateCancelTransactionRequest as $, AdditionalFee$2 as $n, getConnectors as $t, ShopCollection as A, EnsureAllRequiredKeys as An, WalletKind$2 as Ar, MetadataStatus as At, CheckoutOptions$1 as B, StandardQueryOptions as Bn, PriceFilter as Bt, MarketPage as C, Transaction$1 as Cn, Signature$1 as Cr, ListOffersForCollectibleRequest as Ct, MarketplaceWalletWaasSettings as D, WithRequired as Dn, StepType$2 as Dr, ListPrimarySaleItemsRequest as Dt, MarketplaceWalletOptions as E, ValuesOptional as En, Step$2 as Er, ListOrdersWithCollectiblesResponse as Et, Event$1 as F, WithOptionalParams as Fn, OrderSide$1 as Ft, CollectiblesFilter$1 as G, getIndexerClient as Gn, Signature as Gt, CheckoutOptionsMarketplaceRequest as H, getProviderEl as Hn, PrimarySaleItemsFilter$1 as Ht, EventTypes as I, buildInfiniteQueryOptions as In, OrderStatus as It, ContractType$1 as J, getSequenceApiClient as Jn, Step$1 as Jt, Collection as K, getMarketplaceClient as Kn, SortBy as Kt, useAnalytics as L, buildQueryOptions as Ln, OrderbookKind$1 as Lt, isMarketCollection as M, QueryBuilderConfig as Mn, marketplaceConfigOptions as Mr, Order$1 as Mt, isShopCollection as N, RequiredKeys as Nn, BuilderAPI as Nr, OrderData as Nt, MetadataFilterRule as O, BaseInfiniteQueryParams as On, TokenMetadata$1 as Or, ListPrimarySaleItemsResponse as Ot, DatabeatAnalytics as P, WithOptionalInfiniteParams as Pn, OrderFilter$1 as Pt, ExecuteType as Q, getQueryClient as Qn, WalletKind$1 as Qt, BuyModalProps as R, requiredParamsFor as Rn, Page$1 as Rt, MarketCollection as S, SellInput as Sn, PropertyType$1 as Sr, ListListingsForCollectibleResponse as St, MarketplaceConfig as T, TransactionType$1 as Tn, SortOrder$1 as Tr, ListOrdersWithCollectiblesRequest as Tt, Collectible as U, DEFAULT_NETWORK as Un, PropertyFilter$1 as Ut, CheckoutOptionsItem$2 as V, PROVIDER_ID as Vn, PrimarySaleItem as Vt, CollectibleOrder as W, getBuilderClient as Wn, PropertyType as Wt, Currency$1 as X, sequenceApiUrl as Xn, TransactionCrypto as Xt, CreateReq$1 as Y, marketplaceApiURL as Yn, StepType$1 as Yt, CurrencyStatus as Z, SequenceMarketplace as Zn, TransactionOnRampProvider as Zt, SdkConfig as _, Optional as _n, OrderbookKind$2 as _r, ListCollectiblesRequest as _t, MarketplaceWallet as a, clamp as an, Collection$1 as ar, GetCountOfListingsForCollectibleResponse as at, CollectionFilterSettings as b, SdkInfiniteQueryParams as bn, PriceFilter$1 as br, ListCollectionActivitiesResponse as bt, NATIVE_TOKEN_ADDRESS as c, serializeBigInts as cn, CreateReq$2 as cr, GetCountOfPrimarySaleItemsResponse$1 as ct, TransactionStepsParams as d, BuyInput as dn, MarketplaceKind$1 as dr, GetLowestPriceListingForCollectibleRequest as dt, getEcosystemConnector as en, CheckoutOptions$2 as er, GenerateListingTransactionRequest as et, TransactionType as f, CancelInput as fn, Order$2 as fr, ListCollectibleActivitiesRequest as ft, MarketplaceSdkContext as g, OfferInput as gn, OrderStatus$1 as gr, ListCollectibleOffersResponse as gt, Env as h, ListingInput as hn, OrderSide$2 as hr, ListCollectibleListingsResponse$1 as ht, FilterCondition$1 as i, TransactionStep as in, CollectiblesFilter$2 as ir, GetCollectibleHighestOfferResponse as it, ShopPage as j, InfiniteQueryBuilderConfig as jn, fetchMarketplaceConfig as jr, OfferType as jt, Price as k, BaseQueryParams as kn, TransactionCrypto$1 as kr, MarketplaceKind$2 as kt, PrimarySaleTransactionParams as l, AllRequired as ln, Currency$2 as lr, GetFloorOrderRequest as lt, CheckoutMode as m, CollectionType as mn, OrderFilter$2 as mr, ListCollectibleListingsRequest as mt, getWagmiChainsAndTransports as n, ApprovalStep as nn, Collectible$1 as nr, GenerateSellTransactionRequest as nt, BaseTransactionParams as o, isSignatureStep as on, CollectionStatus$1 as or, GetCountOfOffersForCollectibleResponse as ot, ApiConfig as p, CollectableId as pn, OrderData$1 as pr, ListCollectibleActivitiesResponse as pt, CollectionStatus as q, getMetadataClient as qn, SortOrder as qt, ContractInfo as r, SignatureStep as rn, CollectibleOrder$1 as rr, GetCollectibleHighestOfferRequest as rt, MarketTransactionParams as s, isTransactionStep as sn, ContractType$2 as sr, GetCountOfPrimarySaleItemsRequest$1 as st, createWagmiConfig as t, getWaasConnectors as tn, CheckoutOptionsItem$1 as tr, GenerateOfferTransactionRequest as tt, TransactionParams as u, ApiArgs as un, Filter$1 as ur, GetHighestPriceOfferForCollectibleRequest as ut, CardType as v, QueryArg as vn, Page$2 as vr, ListCollectiblesResponse as vt, MarketplaceCollection as w, TransactionSteps as wn, SortBy$1 as wr, ListOffersForCollectibleResponse as wt, EcosystemWalletSettings as x, SdkQueryParams as xn, PropertyFilter$2 as xr, ListCurrenciesRequest as xt, CollectibleCardAction as y, QueryKeyArgs as yn, PostRequest$1 as yr, ListCollectionActivitiesRequest as yt, AdditionalFee$1 as z, StandardInfiniteQueryOptions as zn, PostRequest as zt };
//# sourceMappingURL=create-config.d.ts.map