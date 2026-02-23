/// <reference types="node" />
import { Cn as TransactionOnRampProvider, En as MarketplaceWalletType, Ft as Address$1, G as MarketplaceClient, H as LookupMarketplaceReturn, Ht as CheckoutOptions, K as MarketplaceCollection, O as IndexerClient, Tn as FilterCondition, U as MarketCollection, W as MarketPage, X as OpenIdProvider, Y as MetadataClient, c as CreateReq, et as ShopCollection, fn as Page$2, in as MarketplaceKind, it as Step, l as Currency, ot as index_d_exports, q as MarketplaceSettings, s as ContractType$1, tt as ShopPage, un as OrderbookKind } from "./index2.js";
import { Page, SequenceIndexer, TokenBalance, TransactionReceipt } from "@0xsequence/indexer";
import { ContractInfo as ContractInfo$1, GetContractInfoArgs, GetTokenMetadataArgs, SequenceMetadata } from "@0xsequence/metadata";
import "@0xsequence/network";
import * as wagmi0 from "wagmi";
import { CreateConnectorFn, State } from "wagmi";
import React$1, { ComponentType, FunctionComponent, JSX, ReactNode, SVGProps } from "react";
import "react/jsx-runtime";
import { AddEthereumChainParameter, Address, BaseError, BaseErrorType, Chain, Client, EIP1193RequestFn, Hex, ProviderConnectInfo, ProviderMessage, PublicClient, Transport } from "viem";
import * as _tanstack_react_query432 from "@tanstack/react-query";
import { QueryClient, QueryKey, UseQueryResult } from "@tanstack/react-query";
import { SequenceAPIClient } from "@0xsequence/api";
import { VariantProps } from "class-variance-authority";
import BN from "bn.js";

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
  lookupMarketplace(args: index_d_exports.LookupMarketplaceArgs, headers?: object, signal?: AbortSignal): Promise<index_d_exports.LookupMarketplaceReturn>;
}
//#endregion
//#region src/react/queries/marketplace/config.d.ts
declare const fetchMarketplaceConfig: ({
  config,
  prefetchedMarketplaceSettings
}: {
  config: SdkConfig;
  prefetchedMarketplaceSettings?: index_d_exports.LookupMarketplaceReturn;
}) => Promise<MarketplaceConfig>;
declare const marketplaceConfigOptions: (config: SdkConfig) => _tanstack_react_query432.OmitKeyof<_tanstack_react_query432.UseQueryOptions<MarketplaceConfig, Error, MarketplaceConfig, readonly ["marketplace", string, {}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query432.QueryFunction<MarketplaceConfig, readonly ["marketplace", string, {}], never> | undefined;
} & {
  queryKey: readonly ["marketplace", string, {}] & {
    [dataTagSymbol]: MarketplaceConfig;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region ../node_modules/.pnpm/@databeat+tracker@0.9.3/node_modules/@databeat/tracker/dist/databeat-tracker.d.ts
declare enum EventType$2 {
  INIT = "INIT",
  VIEW = "VIEW",
  REQUEST = "REQUEST",
}
interface Event$1$1 {
  event: string;
  projectId?: number;
  source?: string;
  ident?: number;
  userId?: string;
  sessionId?: string;
  device?: Device;
  countryCode?: string;
  props?: {
    [key: string]: string;
  };
  nums?: {
    [key: string]: number;
  };
}
interface Device {
  type: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
}
interface Auth {
  jwt?: string;
  headers?: {
    [key: string]: string;
  };
}
interface Event$1<K$1 extends string = any> extends Event$1$1 {
  event: keyof typeof EventType$2 | K$1;
}
interface DatabeatOptions {
  defaultEnabled?: boolean;
  projectId?: number;
  privacy?: PrivacyOptions;
  userIdentTracking?: boolean;
  strictMode?: boolean;
  flushInterval?: number;
  noop?: boolean;
  initProps?: () => {};
}
interface PrivacyOptions {
  userIdHash?: boolean;
  userAgentSalt?: boolean;
  extraSalt?: string;
}
declare enum Ident {
  ANON = 0,
  PRIVATE = 1,
  USER = 2,
}
declare class Databeat<K$1 extends string> {
  private rpc;
  private auth;
  private options;
  private enabled;
  private ident;
  private userId;
  private sessionId;
  private allowUserTracking;
  private projectId;
  private queue;
  private flushTimeout;
  private defaultProps;
  private dedupeIdentKey;
  private dedupeViewKey;
  private ts?;
  constructor(host: string, auth: Auth | string, options?: DatabeatOptions);
  private init;
  reset(skipInit?: boolean): void;
  identify(userId?: string, options?: PrivacyOptions & {
    allowTracking?: boolean;
  }): void;
  allowTracking(allowTracking: boolean): void;
  track(events: Event$1<K$1> | Event$1<K$1>[], options?: {
    flush?: boolean;
  }): Promise<void>;
  trackView(props?: {
    [key: string]: string;
  }): void;
  flush: () => Promise<void>;
  isEnabled(): boolean;
  isAnon(): boolean;
  getIdent(): Ident;
  getUserId(): string;
  getSessionId(): string;
  getStorageTS(): number | undefined;
  enable(): void;
  disable(): void;
  private dedupedQueue;
}
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
declare const indexerURL: (chain: ChainNameOrId, env?: Env) => string;
declare const marketplaceApiURL: (env?: Env) => string;
declare const sequenceApiUrl: (env?: Env) => string;
declare const getBuilderClient: (config: SdkConfig) => BuilderAPI;
declare const getMetadataClient: (config: SdkConfig) => MetadataClient;
declare const getIndexerClient: (chain: ChainNameOrId, config: SdkConfig) => IndexerClient;
declare const getMarketplaceClient: (config: SdkConfig) => SequenceMarketplace;
declare const getSequenceApiClient: (config: SdkConfig) => SequenceAPIClient;
declare const getTrailsApiUrl: (config: SdkConfig) => string;
declare const getSequenceIndexerUrl: (config: SdkConfig) => string;
declare const getSequenceNodeGatewayUrl: (config: SdkConfig) => string;
declare const getSequenceApiUrl: (config: SdkConfig) => string;
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
type StandardQueryOptions<TError = Error> = {
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
};
/**
 * Standard infinite query options that can be used across all marketplace SDK hooks
 * that support infinite pagination
 */
type StandardInfiniteQueryOptions<TError = Error> = StandardQueryOptions<TError> & {
  /** Maximum number of pages to fetch */
  maxPages?: number;
};
//#endregion
//#region src/react/_internal/query-builder.d.ts
type BaseQueryParams = {
  config: SdkConfig;
  query?: StandardQueryOptions;
};
type BaseInfiniteQueryParams = {
  config: SdkConfig;
  query?: StandardInfiniteQueryOptions;
};
type RequiredKeys<T$1> = { [K in keyof T$1]-?: {} extends Pick<T$1, K> ? never : K }[keyof T$1];
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
type QueryBuilderConfig<TParams extends BaseQueryParams, TData> = {
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
};
type InfiniteQueryBuilderConfig<TParams extends BaseInfiniteQueryParams, TResponse> = {
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
};
type WithOptionalParams<T$1 extends BaseQueryParams> = { [K in keyof T$1]?: T$1[K] } & Pick<T$1, 'config'> & Partial<Pick<T$1, 'query'>>;
type WithOptionalInfiniteParams<T$1 extends BaseInfiniteQueryParams> = { [K in keyof T$1]?: T$1[K] } & Pick<T$1, 'config'> & Partial<Pick<T$1, 'query'>>;
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
}, params: WithOptionalParams<TParams>): _tanstack_react_query432.OmitKeyof<_tanstack_react_query432.UseQueryOptions<TData, Error, TData, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query432.QueryFunction<TData, readonly unknown[], never> | undefined;
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
}, params: WithOptionalInfiniteParams<TParams>): _tanstack_react_query432.OmitKeyof<_tanstack_react_query432.UseInfiniteQueryOptions<TResponse, Error, _tanstack_react_query432.InfiniteData<TResponse, unknown>, readonly unknown[], Page$2>, "queryFn"> & {
  queryFn?: _tanstack_react_query432.QueryFunction<TResponse, readonly unknown[], Page$2> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query432.InfiniteData<TResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/_internal/types.d.ts
type QueryArg = {
  enabled?: boolean;
};
type CollectableId = string | number;
type CollectionType = ContractType$1.ERC1155 | ContractType$1.ERC721;
type Transaction$2 = {
  to: Hex;
  data?: Hex;
  value?: bigint;
};
type TransactionStep$1 = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
type TransactionSteps = {
  approval: TransactionStep$1;
  transaction: TransactionStep$1;
};
declare enum TransactionType$4 {
  BUY = "BUY",
  SELL = "SELL",
  LISTING = "LISTING",
  OFFER = "OFFER",
  TRANSFER = "TRANSFER",
  CANCEL = "CANCEL",
}
type BuyInput = {
  orderId: string;
  marketplace: MarketplaceKind;
  quantity: string;
};
type SellInput = {
  orderId: string;
  marketplace: MarketplaceKind;
  quantity?: string;
};
type ListingInput = {
  contractType: ContractType$1;
  listing: CreateReq;
};
type OfferInput = {
  contractType: ContractType$1;
  offer: CreateReq;
};
type CancelInput = {
  orderId: string;
  marketplace: MarketplaceKind;
};
type ValuesOptional<T$1> = { [K in keyof T$1]: T$1[K] | undefined };
/**
 * Makes all properties in T required (removes optionality)
 * Note: Different from RequiredKeys in query-builder.ts which extracts required key names
 */
type AllRequired<T$1> = { [K in keyof T$1]-?: T$1[K] };
type QueryKeyArgs<T$1> = { [K in keyof AllRequired<T$1>]: T$1[K] | undefined };
type Optional<T$1, K$1 extends keyof T$1> = Pick<Partial<T$1>, K$1> & Omit<T$1, K$1>;
/**
 * Extracts only API-relevant fields from query params, excluding SDK config and query options
 * Converts optional properties (prop?: T) to explicit union types (prop: T | undefined)
 */
type ApiArgs<T$1> = ValuesOptional<Omit<T$1, 'config' | 'query'>>;
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
type WithRequired<T$1, K$1 extends keyof T$1 = keyof T$1> = T$1 & { [P in K$1]-?: T$1[P] };
/**
 * Creates hook params from API request types:
 * - Required API fields → key required, value can be undefined
 * - Optional API fields → key optional (key doesn't need to exist)
 * - SDK fields (config, query) → key optional
 */
type HookParamsFromApiRequest<TApiRequest, TSdkParams extends Record<string, unknown> = Record<string, never>> = { [K in RequiredKeys<TApiRequest>]: TApiRequest[K] | undefined } & { [K in Exclude<keyof TApiRequest, RequiredKeys<TApiRequest>>]?: TApiRequest[K] } & { [K in keyof TSdkParams]?: TSdkParams[K] };
//#endregion
//#region src/react/_internal/utils.d.ts
declare const clamp: (val: number, min: number, max: number) => number;
/**
 * Recursively converts all bigint values to strings in an object
 * This is needed for React Query keys which must be JSON-serializable
 */
declare function serializeBigInts<T$1>(obj: T$1): T$1;
//#endregion
//#region ../node_modules/.pnpm/@0xsequence+connect@5.4.8_70c73263aff80b108b915be6fe22f975/node_modules/@0xsequence/connect/dist/cjs/types.d.ts
interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}
interface WalletProperties {
  id: string;
  logoDark: FunctionComponent<LogoProps>;
  logoLight: FunctionComponent<LogoProps>;
  monochromeLogoDark?: FunctionComponent<LogoProps>;
  monochromeLogoLight?: FunctionComponent<LogoProps>;
  name: string;
  iconBackground?: string;
  hideConnectorId?: string | null;
  isSequenceBased?: boolean;
  type?: 'social' | 'wallet';
}
type Wallet = WalletProperties & {
  createConnector: (projectAccessKey: string) => CreateConnectorFn;
};
//#endregion
//#region ../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.3.5/node_modules/abitype/dist/types/register.d.ts
interface Register$1 {}
type ResolvedRegister$1 = {
  /**
   * TypeScript type to use for `address` values
   * @default `0x${string}`
   */
  addressType: Register$1 extends {
    addressType: infer type;
  } ? type : Register$1 extends {
    AddressType: infer type;
  } ? type : DefaultRegister$1['addressType'];
  /**
   * TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48`
   * @default bigint
   */
  bigIntType: Register$1 extends {
    bigIntType: infer type;
  } ? type : Register$1 extends {
    BigIntType: infer type;
  } ? type : DefaultRegister$1['bigIntType'];
  /**
   * TypeScript type to use for `bytes` values
   * @default { inputs: `0x${string}`; outputs: `0x${string}`; }
   */
  bytesType: Register$1 extends {
    bytesType: infer type extends {
      inputs: unknown;
      outputs: unknown;
    };
  } ? type : Register$1 extends {
    BytesType: infer type extends {
      inputs: unknown;
      outputs: unknown;
    };
  } ? type : DefaultRegister$1['bytesType'];
  /**
   * TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48`
   * @default number
   */
  intType: Register$1 extends {
    intType: infer type;
  } ? type : Register$1 extends {
    IntType: infer type;
  } ? type : DefaultRegister$1['intType'];
  /**
   * Maximum depth for nested array types (e.g. string[][])
   *
   * Note: You probably only want to set this to a specific number if parsed types are returning as `unknown`
   * and you want to figure out why. If you set this, you should probably also reduce `FixedArrayMaxLength`.
   *
   * @default false
   */
  arrayMaxDepth: Register$1 extends {
    arrayMaxDepth: infer type extends number | false;
  } ? type : Register$1 extends {
    ArrayMaxDepth: infer type extends number | false;
  } ? type : DefaultRegister$1['arrayMaxDepth'];
  /**
   * Lower bound for fixed array length
   * @default 1
   */
  fixedArrayMinLength: Register$1 extends {
    fixedArrayMinLength: infer type extends number;
  } ? type : Register$1 extends {
    FixedArrayMinLength: infer type extends number;
  } ? type : DefaultRegister$1['fixedArrayMinLength'];
  /**
   * Upper bound for fixed array length
   * @default 99
   */
  fixedArrayMaxLength: Register$1 extends {
    fixedArrayMaxLength: infer type extends number;
  } ? type : Register$1 extends {
    FixedArrayMaxLength: infer type extends number;
  } ? type : DefaultRegister$1['fixedArrayMaxLength'];
  /**
   * Enables named tuple generation in {@link AbiParametersToPrimitiveTypes} for common ABI parameter names.
   *
   * @default false
   */
  experimental_namedTuples: Register$1 extends {
    experimental_namedTuples: infer type extends boolean;
  } ? type : DefaultRegister$1['experimental_namedTuples'];
  /**
   * When set, validates {@link AbiParameter}'s `type` against {@link AbiType}
   *
   * Note: You probably only want to set this to `true` if parsed types are returning as `unknown`
   * and you want to figure out why.
   *
   * @default false
   */
  strictAbiType: Register$1 extends {
    strictAbiType: infer type extends boolean;
  } ? type : Register$1 extends {
    StrictAbiType: infer type extends boolean;
  } ? type : DefaultRegister$1['strictAbiType'];
  /** @deprecated Use `addressType` instead */
  AddressType: ResolvedRegister$1['addressType'];
  /** @deprecated Use `addressType` instead */
  BigIntType: ResolvedRegister$1['bigIntType'];
  /** @deprecated Use `bytesType` instead */
  BytesType: ResolvedRegister$1['bytesType'];
  /** @deprecated Use `intType` instead */
  IntType: ResolvedRegister$1['intType'];
  /** @deprecated Use `arrayMaxDepth` instead */
  ArrayMaxDepth: ResolvedRegister$1['arrayMaxDepth'];
  /** @deprecated Use `fixedArrayMinLength` instead */
  FixedArrayMinLength: ResolvedRegister$1['fixedArrayMinLength'];
  /** @deprecated Use `fixedArrayMaxLength` instead */
  FixedArrayMaxLength: ResolvedRegister$1['fixedArrayMaxLength'];
  /** @deprecated Use `strictAbiType` instead */
  StrictAbiType: ResolvedRegister$1['strictAbiType'];
};
type DefaultRegister$1 = {
  /** Maximum depth for nested array types (e.g. string[][]) */
  arrayMaxDepth: false;
  /** Lower bound for fixed array length */
  fixedArrayMinLength: 1;
  /** Upper bound for fixed array length */
  fixedArrayMaxLength: 99;
  /** TypeScript type to use for `address` values */
  addressType: `0x${string}`;
  /** TypeScript type to use for `bytes` values */
  bytesType: {
    /** TypeScript type to use for `bytes` input values */
    inputs: `0x${string}`;
    /** TypeScript type to use for `bytes` output values */
    outputs: `0x${string}`;
  };
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48` */
  bigIntType: bigint;
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48` */
  intType: number;
  /** Enables named tuple generation in {@link AbiParametersToPrimitiveTypes} for common ABI parameter names */
  experimental_namedTuples: false;
  /** When set, validates {@link AbiParameter}'s `type` against {@link AbiType} */
  strictAbiType: false;
  /** @deprecated Use `arrayMaxDepth` instead */
  ArrayMaxDepth: DefaultRegister$1['arrayMaxDepth'];
  /** @deprecated Use `fixedArrayMinLength` instead */
  FixedArrayMinLength: DefaultRegister$1['fixedArrayMinLength'];
  /** @deprecated Use `fixedArrayMaxLength` instead */
  FixedArrayMaxLength: DefaultRegister$1['fixedArrayMaxLength'];
  /** @deprecated Use `addressType` instead */
  AddressType: DefaultRegister$1['addressType'];
  /** @deprecated Use `bytesType` instead */
  BytesType: {
    inputs: DefaultRegister$1['bytesType']['inputs'];
    outputs: DefaultRegister$1['bytesType']['outputs'];
  };
  /** @deprecated Use `bigIntType` instead */
  BigIntType: DefaultRegister$1['bigIntType'];
  /** @deprecated Use `intType` instead */
  IntType: DefaultRegister$1['intType'];
  /** @deprecated Use `strictAbiType` instead */
  StrictAbiType: DefaultRegister$1['strictAbiType'];
};
//#endregion
//#region ../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.3.5/node_modules/abitype/dist/types/types.d.ts
/**
 * Prints custom error message
 *
 * @param messages - Error message
 * @returns Custom error message
 *
 * @example
 * type Result = Error<'Custom error message'>
 * //   ^? type Result = ['Error: Custom error message']
 */
type Error$1<messages extends string | string[]> = messages extends string ? [`Error: ${messages}`] : { [key in keyof messages]: messages[key] extends infer message extends string ? `Error: ${message}` : never };
/**
 * Merges two object types into new type
 *
 * @param object1 - Object to merge into
 * @param object2 - Object to merge and override keys from {@link object1}
 * @returns New object type with keys from {@link object1} and {@link object2}. If a key exists in both {@link object1} and {@link object2}, the key from {@link object2} will be used.
 *
 * @example
 * type Result = Merge<{ foo: string }, { foo: number; bar: string }>
 * //   ^? type Result = { foo: number; bar: string }
 */
type Merge<object1, object2> = Omit<object1, keyof object2> & object2;
/**
 * Combines members of an intersection into a readable type.
 *
 * @link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 * @example
 * type Result = Pretty<{ a: string } | { b: string } | { c: number, d: bigint }>
 * //   ^? type Result = { a: string; b: string; c: number; d: bigint }
 */
type Pretty<type$1> = { [key in keyof type$1]: type$1[key] } & unknown;
/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types).
 *
 * @param start - Number to start range
 * @param stop - Number to end range
 * @returns Array with inclusive range from {@link start} to {@link stop}
 *
 * @example
 * type Result = Range<1, 3>
 * //   ^? type Result = [1, 2, 3]
 */
type Range<start extends number, stop extends number, result extends number[] = [], padding extends 0[] = [], current extends number = [...padding, ...result]['length'] & number> = current extends stop ? current extends start ? [current] : result extends [] ? [] : [...result, current] : current extends start ? Range<start, stop, [current], padding> : result extends [] ? Range<start, stop, [], [...padding, 0]> : Range<start, stop, [...result, current], padding>;
/**
 * Create tuple of {@link type} type with {@link size} size
 *
 * @param Type - Type of tuple
 * @param Size - Size of tuple
 * @returns Tuple of {@link type} type with {@link size} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * //   ^? type Result = [string, string]
 */
type Tuple<type$1, size$1 extends number> = size$1 extends size$1 ? number extends size$1 ? type$1[] : _TupleOf<type$1, size$1, []> : never;
type _TupleOf<length$1, size$1 extends number, acc extends readonly unknown[]> = acc['length'] extends size$1 ? acc : _TupleOf<length$1, size$1, readonly [length$1, ...acc]>;
//#endregion
//#region ../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.3.5/node_modules/abitype/dist/types/abi.d.ts
type Address$2 = ResolvedRegister$1['addressType'];
type MBytes = '' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;
type MBits = '' | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 88 | 96 | 104 | 112 | 120 | 128 | 136 | 144 | 152 | 160 | 168 | 176 | 184 | 192 | 200 | 208 | 216 | 224 | 232 | 240 | 248 | 256;
type SolidityAddress = 'address';
type SolidityBool = 'bool';
type SolidityBytes = `bytes${MBytes}`;
type SolidityFunction = 'function';
type SolidityString = 'string';
type SolidityTuple = 'tuple';
type SolidityInt = `${'u' | ''}int${MBits}`;
type SolidityFixedArrayRange = Range<ResolvedRegister$1['fixedArrayMinLength'], ResolvedRegister$1['fixedArrayMaxLength']>[number];
type SolidityFixedArraySizeLookup = { [Prop in SolidityFixedArrayRange as `${Prop}`]: Prop };
/**
 * Recursively build arrays up to maximum depth
 * or use a more broad type when maximum depth is switched "off"
 */
type _BuildArrayTypes<T$1 extends string, Depth extends readonly number[] = []> = ResolvedRegister$1['arrayMaxDepth'] extends false ? `${T$1}[${string}]` : Depth['length'] extends ResolvedRegister$1['arrayMaxDepth'] ? T$1 : T$1 extends `${any}[${SolidityFixedArrayRange | ''}]` ? _BuildArrayTypes<T$1 | `${T$1}[${SolidityFixedArrayRange | ''}]`, [...Depth, 1]> : _BuildArrayTypes<`${T$1}[${SolidityFixedArrayRange | ''}]`, [...Depth, 1]>;
type SolidityArrayWithoutTuple = _BuildArrayTypes<SolidityAddress | SolidityBool | SolidityBytes | SolidityFunction | SolidityInt | SolidityString>;
type SolidityArrayWithTuple = _BuildArrayTypes<SolidityTuple>;
type SolidityArray = SolidityArrayWithoutTuple | SolidityArrayWithTuple;
type AbiType = SolidityArray | SolidityAddress | SolidityBool | SolidityBytes | SolidityFunction | SolidityInt | SolidityString | SolidityTuple;
type ResolvedAbiType = ResolvedRegister$1['strictAbiType'] extends true ? AbiType : string;
type AbiInternalType = ResolvedAbiType | `address ${string}` | `contract ${string}` | `enum ${string}` | `struct ${string}`;
type AbiParameter = Pretty<{
  type: ResolvedAbiType;
  name?: string | undefined;
  /** Representation used by Solidity compiler */
  internalType?: AbiInternalType | undefined;
} & ({
  type: Exclude<ResolvedAbiType, SolidityTuple | SolidityArrayWithTuple>;
} | {
  type: SolidityTuple | SolidityArrayWithTuple;
  components: readonly AbiParameter[];
})>;
type AbiEventParameter = AbiParameter & {
  indexed?: boolean | undefined;
};
/**
 * State mutability for {@link AbiFunction}
 *
 * @see https://docs.soliditylang.org/en/latest/contracts.html#state-mutability
 */
type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable';
/** Kind of {@link AbiParameter} */
type AbiParameterKind = 'inputs' | 'outputs';
/** ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type */
type AbiFunction = {
  type: 'function';
  /**
   * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
   * @see https://github.com/ethereum/solidity/issues/992
   */
  constant?: boolean | undefined;
  /**
   * @deprecated Vyper used to provide gas estimates
   * @see https://github.com/vyperlang/vyper/issues/2151
   */
  gas?: number | undefined;
  inputs: readonly AbiParameter[];
  name: string;
  outputs: readonly AbiParameter[];
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * @see https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean | undefined;
  stateMutability: AbiStateMutability;
};
/** ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type */
type AbiConstructor = {
  type: 'constructor';
  inputs: readonly AbiParameter[];
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * @see https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean | undefined;
  stateMutability: Extract<AbiStateMutability, 'payable' | 'nonpayable'>;
};
/** ABI ["fallback"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type */
type AbiFallback = {
  type: 'fallback';
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * @see https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean | undefined;
  stateMutability: Extract<AbiStateMutability, 'payable' | 'nonpayable'>;
};
/** ABI ["receive"](https://docs.soliditylang.org/en/latest/contracts.html#receive-ether-function) type */
type AbiReceive = {
  type: 'receive';
  stateMutability: Extract<AbiStateMutability, 'payable'>;
};
/** ABI ["event"](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type */
type AbiEvent = {
  type: 'event';
  anonymous?: boolean | undefined;
  inputs: readonly AbiEventParameter[];
  name: string;
};
/** ABI ["error"](https://docs.soliditylang.org/en/latest/abi-spec.html#errors) type */
type AbiError = {
  type: 'error';
  inputs: readonly AbiParameter[];
  name: string;
};
/**
 * Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)
 */
type Abi = readonly (AbiConstructor | AbiError | AbiEvent | AbiFallback | AbiFunction | AbiReceive)[];
type TypedDataDomain$1 = {
  chainId?: number | bigint | undefined;
  name?: string | undefined;
  salt?: ResolvedRegister$1['bytesType']['outputs'] | undefined;
  verifyingContract?: Address$2 | undefined;
  version?: string | undefined;
};
type TypedDataType = Exclude<AbiType, SolidityFunction | SolidityTuple | SolidityArrayWithTuple | 'int' | 'uint'>;
type TypedDataParameter = {
  name: string;
  type: TypedDataType | keyof TypedData | `${keyof TypedData}[${string | ''}]`;
};
/**
 * [EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Typed Data Specification
 */
type TypedData = Pretty<Record<string, readonly TypedDataParameter[]> & { [_ in TypedDataType]?: never }>;
//#endregion
//#region ../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.3.5/node_modules/abitype/dist/types/narrow.d.ts
/**
 * Infers embedded primitive type of any type
 *
 * @param T - Type to infer
 * @returns Embedded type of {@link type}
 *
 * @example
 * type Result = Narrow<['foo', 'bar', 1]>
 */
type Narrow<type$1> = (unknown extends type$1 ? unknown : never) | (type$1 extends Function ? type$1 : never) | (type$1 extends bigint | boolean | number | string ? type$1 : never) | (type$1 extends [] ? [] : never) | { [K in keyof type$1]: Narrow<type$1[K]> };
//#endregion
//#region ../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.3.5/node_modules/abitype/dist/types/generated.d.ts
interface AbiParameterTupleNameLookup<type$1> extends Record<string, [type$1]> {
  _a: [_a: type$1];
  _acceptablePrice: [_acceptablePrice: type$1];
  _account: [_account: type$1];
  _accounts: [_accounts: type$1];
  _action: [_action: type$1];
  _actionId: [_actionId: type$1];
  _active: [_active: type$1];
  _adapter: [_adapter: type$1];
  _adapterParams: [_adapterParams: type$1];
  _add: [_add: type$1];
  _addr: [_addr: type$1];
  _address: [_address: type$1];
  _addresses: [_addresses: type$1];
  _admin: [_admin: type$1];
  _agent: [_agent: type$1];
  _aggregator: [_aggregator: type$1];
  _allocPoint: [_allocPoint: type$1];
  _allow: [_allow: type$1];
  _allowed: [_allowed: type$1];
  _amm: [_amm: type$1];
  _amount: [_amount: type$1];
  _amountIn: [_amountIn: type$1];
  _amountOut: [_amountOut: type$1];
  _amountOutMin: [_amountOutMin: type$1];
  _amountSetToken: [_amountSetToken: type$1];
  _amounts: [_amounts: type$1];
  _amt: [_amt: type$1];
  _app: [_app: type$1];
  _approved: [_approved: type$1];
  _args: [_args: type$1];
  _asset: [_asset: type$1];
  _assetAddr: [_assetAddr: type$1];
  _assetId: [_assetId: type$1];
  _assets: [_assets: type$1];
  _attribute: [_attribute: type$1];
  _auctionId: [_auctionId: type$1];
  _avatar: [_avatar: type$1];
  _b: [_b: type$1];
  _balance: [_balance: type$1];
  _balances: [_balances: type$1];
  _base: [_base: type$1];
  _baseToken: [_baseToken: type$1];
  _baseURI: [_baseURI: type$1];
  _batch: [_batch: type$1];
  _batchId: [_batchId: type$1];
  _beneficiary: [_beneficiary: type$1];
  _bidId: [_bidId: type$1];
  _block: [_block: type$1];
  _blockNumber: [_blockNumber: type$1];
  _bool: [_bool: type$1];
  _borrowAmount: [_borrowAmount: type$1];
  _borrower: [_borrower: type$1];
  _bps: [_bps: type$1];
  _bridge: [_bridge: type$1];
  _bridgeData: [_bridgeData: type$1];
  _burnFee: [_burnFee: type$1];
  _burn_amount: [_burn_amount: type$1];
  _buyFee: [_buyFee: type$1];
  _buyInAmount: [_buyInAmount: type$1];
  _buyer: [_buyer: type$1];
  _c: [_c: type$1];
  _cType: [_cType: type$1];
  _callData: [_callData: type$1];
  _calldata: [_calldata: type$1];
  _caller: [_caller: type$1];
  _campaignId: [_campaignId: type$1];
  _cap: [_cap: type$1];
  _category: [_category: type$1];
  _categoryId: [_categoryId: type$1];
  _ccy: [_ccy: type$1];
  _cdpId: [_cdpId: type$1];
  _chainId: [_chainId: type$1];
  _cid: [_cid: type$1];
  _claim: [_claim: type$1];
  _claimId: [_claimId: type$1];
  _claimer: [_claimer: type$1];
  _clanId: [_clanId: type$1];
  _code: [_code: type$1];
  _collateral: [_collateral: type$1];
  _collateralAddress: [_collateralAddress: type$1];
  _collateralAmount: [_collateralAmount: type$1];
  _collateralAsset: [_collateralAsset: type$1];
  _collateralDelta: [_collateralDelta: type$1];
  _collateralIndex: [_collateralIndex: type$1];
  _collateralToken: [_collateralToken: type$1];
  _collateralType: [_collateralType: type$1];
  _collaterals: [_collaterals: type$1];
  _collection: [_collection: type$1];
  _collectionId: [_collectionId: type$1];
  _component: [_component: type$1];
  _compound: [_compound: type$1];
  _comptrollerProxy: [_comptrollerProxy: type$1];
  _config: [_config: type$1];
  _contract: [_contract: type$1];
  _contractAddress: [_contractAddress: type$1];
  _contractName: [_contractName: type$1];
  _contractURI: [_contractURI: type$1];
  _contracts: [_contracts: type$1];
  _contributor: [_contributor: type$1];
  _controller: [_controller: type$1];
  _cost: [_cost: type$1];
  _count: [_count: type$1];
  _creator: [_creator: type$1];
  _currency: [_currency: type$1];
  _dao: [_dao: type$1];
  _data: [_data: type$1];
  _date: [_date: type$1];
  _day: [_day: type$1];
  _days: [_days: type$1];
  _deadline: [_deadline: type$1];
  _debt: [_debt: type$1];
  _decimals: [_decimals: type$1];
  _defaultAdmin: [_defaultAdmin: type$1];
  _delay: [_delay: type$1];
  _delegate: [_delegate: type$1];
  _delegatee: [_delegatee: type$1];
  _delegator: [_delegator: type$1];
  _delta: [_delta: type$1];
  _denominator: [_denominator: type$1];
  _deployer: [_deployer: type$1];
  _deposit: [_deposit: type$1];
  _depositAmount: [_depositAmount: type$1];
  _depositId: [_depositId: type$1];
  _depositToken: [_depositToken: type$1];
  _depositor: [_depositor: type$1];
  _description: [_description: type$1];
  _destination: [_destination: type$1];
  _dev: [_dev: type$1];
  _devFee: [_devFee: type$1];
  _dex: [_dex: type$1];
  _discount: [_discount: type$1];
  _disputeID: [_disputeID: type$1];
  _distributor: [_distributor: type$1];
  _domain: [_domain: type$1];
  _dst: [_dst: type$1];
  _dstChainId: [_dstChainId: type$1];
  _dstEid: [_dstEid: type$1];
  _dstPoolId: [_dstPoolId: type$1];
  _duration: [_duration: type$1];
  _editionId: [_editionId: type$1];
  _editionNumber: [_editionNumber: type$1];
  _editionSize: [_editionSize: type$1];
  _eid: [_eid: type$1];
  _enable: [_enable: type$1];
  _enabled: [_enabled: type$1];
  _end: [_end: type$1];
  _endBlock: [_endBlock: type$1];
  _endDate: [_endDate: type$1];
  _endIndex: [_endIndex: type$1];
  _endTime: [_endTime: type$1];
  _endTimestamp: [_endTimestamp: type$1];
  _entity: [_entity: type$1];
  _entityAddress: [_entityAddress: type$1];
  _epoch: [_epoch: type$1];
  _epochId: [_epochId: type$1];
  _erc20: [_erc20: type$1];
  _eventId: [_eventId: type$1];
  _evidence: [_evidence: type$1];
  _exchange: [_exchange: type$1];
  _executionFee: [_executionFee: type$1];
  _executionFeeReceiver: [_executionFeeReceiver: type$1];
  _executor: [_executor: type$1];
  _expiration: [_expiration: type$1];
  _expiry: [_expiry: type$1];
  _extraData: [_extraData: type$1];
  _factory: [_factory: type$1];
  _fee: [_fee: type$1];
  _feePercent: [_feePercent: type$1];
  _feeRate: [_feeRate: type$1];
  _feeReceiver: [_feeReceiver: type$1];
  _feeRecipient: [_feeRecipient: type$1];
  _feeToken: [_feeToken: type$1];
  _fees: [_fees: type$1];
  _flag: [_flag: type$1];
  _for: [_for: type$1];
  _from: [_from: type$1];
  _fromToken: [_fromToken: type$1];
  _futureId: [_futureId: type$1];
  _game: [_game: type$1];
  _gameId: [_gameId: type$1];
  _gameIds: [_gameIds: type$1];
  _gasLimit: [_gasLimit: type$1];
  _gauge: [_gauge: type$1];
  _gauges: [_gauges: type$1];
  _generation: [_generation: type$1];
  _governance: [_governance: type$1];
  _group: [_group: type$1];
  _groupId: [_groupId: type$1];
  _guardian: [_guardian: type$1];
  _handler: [_handler: type$1];
  _hash: [_hash: type$1];
  _hatId: [_hatId: type$1];
  _holder: [_holder: type$1];
  _hook: [_hook: type$1];
  _hopData: [_hopData: type$1];
  _iToken: [_iToken: type$1];
  _id: [_id: type$1];
  _idempotencyKey: [_idempotencyKey: type$1];
  _ids: [_ids: type$1];
  _idx: [_idx: type$1];
  _implementation: [_implementation: type$1];
  _index: [_index: type$1];
  _indexToken: [_indexToken: type$1];
  _indices: [_indices: type$1];
  _info: [_info: type$1];
  _initialOwner: [_initialOwner: type$1];
  _input: [_input: type$1];
  _inputToken: [_inputToken: type$1];
  _inputs: [_inputs: type$1];
  _integrator: [_integrator: type$1];
  _interval: [_interval: type$1];
  _isActive: [_isActive: type$1];
  _isEnabled: [_isEnabled: type$1];
  _isLong: [_isLong: type$1];
  _isPaused: [_isPaused: type$1];
  _issuer: [_issuer: type$1];
  _itemId: [_itemId: type$1];
  _itemIds: [_itemIds: type$1];
  _keeper: [_keeper: type$1];
  _key: [_key: type$1];
  _keyHash: [_keyHash: type$1];
  _l1Token: [_l1Token: type$1];
  _label: [_label: type$1];
  _legoId: [_legoId: type$1];
  _lender: [_lender: type$1];
  _lenderId: [_lenderId: type$1];
  _length: [_length: type$1];
  _level: [_level: type$1];
  _leverage: [_leverage: type$1];
  _limit: [_limit: type$1];
  _linkId: [_linkId: type$1];
  _liqUser: [_liqUser: type$1];
  _liquidator: [_liquidator: type$1];
  _liquidity: [_liquidity: type$1];
  _liquidityFee: [_liquidityFee: type$1];
  _listingId: [_listingId: type$1];
  _loan: [_loan: type$1];
  _loanId: [_loanId: type$1];
  _location: [_location: type$1];
  _lock: [_lock: type$1];
  _lockDuration: [_lockDuration: type$1];
  _lockId: [_lockId: type$1];
  _long: [_long: type$1];
  _lowerHint: [_lowerHint: type$1];
  _lp: [_lp: type$1];
  _lpAddress: [_lpAddress: type$1];
  _lpAmount: [_lpAmount: type$1];
  _lpToken: [_lpToken: type$1];
  _manager: [_manager: type$1];
  _marginDelta: [_marginDelta: type$1];
  _market: [_market: type$1];
  _marketId: [_marketId: type$1];
  _marketIndex: [_marketIndex: type$1];
  _marketKey: [_marketKey: type$1];
  _marketing: [_marketing: type$1];
  _marketingFee: [_marketingFee: type$1];
  _maturity: [_maturity: type$1];
  _max: [_max: type$1];
  _maxAmount: [_maxAmount: type$1];
  _maxFeePercentage: [_maxFeePercentage: type$1];
  _maxPrice: [_maxPrice: type$1];
  _maxSupply: [_maxSupply: type$1];
  _member: [_member: type$1];
  _memo: [_memo: type$1];
  _merkleProof: [_merkleProof: type$1];
  _merkleRoot: [_merkleRoot: type$1];
  _message: [_message: type$1];
  _messageId: [_messageId: type$1];
  _metadata: [_metadata: type$1];
  _min: [_min: type$1];
  _minAmount: [_minAmount: type$1];
  _minAmountOut: [_minAmountOut: type$1];
  _minOut: [_minOut: type$1];
  _minPrice: [_minPrice: type$1];
  _minReturn: [_minReturn: type$1];
  _mintAmount: [_mintAmount: type$1];
  _mintPrice: [_mintPrice: type$1];
  _minter: [_minter: type$1];
  _mode: [_mode: type$1];
  _module: [_module: type$1];
  _multiplier: [_multiplier: type$1];
  _n: [_n: type$1];
  _name: [_name: type$1];
  _names: [_names: type$1];
  _new: [_new: type$1];
  _newAddress: [_newAddress: type$1];
  _newAmount: [_newAmount: type$1];
  _newFee: [_newFee: type$1];
  _newImpl: [_newImpl: type$1];
  _newLimit: [_newLimit: type$1];
  _newOwner: [_newOwner: type$1];
  _newPrice: [_newPrice: type$1];
  _newStatus: [_newStatus: type$1];
  _newValue: [_newValue: type$1];
  _nft: [_nft: type$1];
  _nftAddress: [_nftAddress: type$1];
  _nftContract: [_nftContract: type$1];
  _nftContractAddress: [_nftContractAddress: type$1];
  _nftID: [_nftID: type$1];
  _nftId: [_nftId: type$1];
  _nftIndex: [_nftIndex: type$1];
  _nftTokenId: [_nftTokenId: type$1];
  _nfts: [_nfts: type$1];
  _node: [_node: type$1];
  _nodeAddress: [_nodeAddress: type$1];
  _nodeId: [_nodeId: type$1];
  _nodeType: [_nodeType: type$1];
  _nonce: [_nonce: type$1];
  _num: [_num: type$1];
  _number: [_number: type$1];
  _of: [_of: type$1];
  _offer: [_offer: type$1];
  _offerId: [_offerId: type$1];
  _offset: [_offset: type$1];
  _open: [_open: type$1];
  _operator: [_operator: type$1];
  _option: [_option: type$1];
  _optionId: [_optionId: type$1];
  _options: [_options: type$1];
  _oracle: [_oracle: type$1];
  _order: [_order: type$1];
  _orderId: [_orderId: type$1];
  _orderIndex: [_orderIndex: type$1];
  _orderType: [_orderType: type$1];
  _origin: [_origin: type$1];
  _outcome: [_outcome: type$1];
  _outputToken: [_outputToken: type$1];
  _owner: [_owner: type$1];
  _ownerAddress: [_ownerAddress: type$1];
  _owners: [_owners: type$1];
  _pair: [_pair: type$1];
  _pairId: [_pairId: type$1];
  _pairIndex: [_pairIndex: type$1];
  _pairs: [_pairs: type$1];
  _param: [_param: type$1];
  _parameters: [_parameters: type$1];
  _params: [_params: type$1];
  _participant: [_participant: type$1];
  _path: [_path: type$1];
  _pause: [_pause: type$1];
  _paused: [_paused: type$1];
  _payToken: [_payToken: type$1];
  _payload: [_payload: type$1];
  _paymentAmount: [_paymentAmount: type$1];
  _paymentToken: [_paymentToken: type$1];
  _percent: [_percent: type$1];
  _percentage: [_percentage: type$1];
  _period: [_period: type$1];
  _permitData: [_permitData: type$1];
  _phase: [_phase: type$1];
  _pid: [_pid: type$1];
  _pids: [_pids: type$1];
  _platform: [_platform: type$1];
  _player: [_player: type$1];
  _playerId: [_playerId: type$1];
  _plotID: [_plotID: type$1];
  _point: [_point: type$1];
  _pool: [_pool: type$1];
  _poolAddress: [_poolAddress: type$1];
  _poolID: [_poolID: type$1];
  _poolId: [_poolId: type$1];
  _poolManagerId: [_poolManagerId: type$1];
  _poolToken: [_poolToken: type$1];
  _poolTokenAddress: [_poolTokenAddress: type$1];
  _pools: [_pools: type$1];
  _posId: [_posId: type$1];
  _position: [_position: type$1];
  _positionId: [_positionId: type$1];
  _positionManager: [_positionManager: type$1];
  _price: [_price: type$1];
  _priceData: [_priceData: type$1];
  _priceFeed: [_priceFeed: type$1];
  _priceInWei: [_priceInWei: type$1];
  _priceUpdateData: [_priceUpdateData: type$1];
  _prices: [_prices: type$1];
  _productId: [_productId: type$1];
  _profileId: [_profileId: type$1];
  _projectId: [_projectId: type$1];
  _proof: [_proof: type$1];
  _proofs: [_proofs: type$1];
  _prop: [_prop: type$1];
  _property: [_property: type$1];
  _proposal: [_proposal: type$1];
  _proposalID: [_proposalID: type$1];
  _proposalId: [_proposalId: type$1];
  _protocolFee: [_protocolFee: type$1];
  _protocolId: [_protocolId: type$1];
  _provider: [_provider: type$1];
  _proxy: [_proxy: type$1];
  _qty: [_qty: type$1];
  _quantities: [_quantities: type$1];
  _quantity: [_quantity: type$1];
  _questId: [_questId: type$1];
  _quoteAsset: [_quoteAsset: type$1];
  _r: [_r: type$1];
  _raffleId: [_raffleId: type$1];
  _rarity: [_rarity: type$1];
  _rate: [_rate: type$1];
  _ratio: [_ratio: type$1];
  _realmId: [_realmId: type$1];
  _reason: [_reason: type$1];
  _receiver: [_receiver: type$1];
  _receivers: [_receivers: type$1];
  _recipient: [_recipient: type$1];
  _recipients: [_recipients: type$1];
  _refer: [_refer: type$1];
  _referral: [_referral: type$1];
  _referralCode: [_referralCode: type$1];
  _referrer: [_referrer: type$1];
  _refundAddress: [_refundAddress: type$1];
  _registry: [_registry: type$1];
  _reportId: [_reportId: type$1];
  _request: [_request: type$1];
  _requestId: [_requestId: type$1];
  _reserve: [_reserve: type$1];
  _reservePrice: [_reservePrice: type$1];
  _reward: [_reward: type$1];
  _rewardAmount: [_rewardAmount: type$1];
  _rewardPerBlock: [_rewardPerBlock: type$1];
  _rewardToken: [_rewardToken: type$1];
  _rewardTokens: [_rewardTokens: type$1];
  _rewarder: [_rewarder: type$1];
  _rewards: [_rewards: type$1];
  _rewardsToken: [_rewardsToken: type$1];
  _role: [_role: type$1];
  _root: [_root: type$1];
  _round: [_round: type$1];
  _roundID: [_roundID: type$1];
  _roundId: [_roundId: type$1];
  _route: [_route: type$1];
  _router: [_router: type$1];
  _s: [_s: type$1];
  _safe: [_safe: type$1];
  _saleId: [_saleId: type$1];
  _salt: [_salt: type$1];
  _season: [_season: type$1];
  _seconds: [_seconds: type$1];
  _selector: [_selector: type$1];
  _sellFee: [_sellFee: type$1];
  _seller: [_seller: type$1];
  _sender: [_sender: type$1];
  _seriesId: [_seriesId: type$1];
  _set: [_set: type$1];
  _setAmount: [_setAmount: type$1];
  _setToken: [_setToken: type$1];
  _settings: [_settings: type$1];
  _share: [_share: type$1];
  _shares: [_shares: type$1];
  _sharesAmount: [_sharesAmount: type$1];
  _side: [_side: type$1];
  _sig: [_sig: type$1];
  _signature: [_signature: type$1];
  _signatures: [_signatures: type$1];
  _signer: [_signer: type$1];
  _sigs: [_sigs: type$1];
  _silo: [_silo: type$1];
  _size: [_size: type$1];
  _sizeDelta: [_sizeDelta: type$1];
  _slippage: [_slippage: type$1];
  _slot: [_slot: type$1];
  _source: [_source: type$1];
  _spender: [_spender: type$1];
  _srcAddress: [_srcAddress: type$1];
  _srcChainId: [_srcChainId: type$1];
  _stake: [_stake: type$1];
  _stakeID: [_stakeID: type$1];
  _stakeToken: [_stakeToken: type$1];
  _staker: [_staker: type$1];
  _stakerAddress: [_stakerAddress: type$1];
  _staking: [_staking: type$1];
  _stakingModuleId: [_stakingModuleId: type$1];
  _stakingToken: [_stakingToken: type$1];
  _start: [_start: type$1];
  _startBlock: [_startBlock: type$1];
  _startDate: [_startDate: type$1];
  _startIndex: [_startIndex: type$1];
  _startTime: [_startTime: type$1];
  _startTimestamp: [_startTimestamp: type$1];
  _state: [_state: type$1];
  _status: [_status: type$1];
  _strategies: [_strategies: type$1];
  _strategist: [_strategist: type$1];
  _strategy: [_strategy: type$1];
  _subAccount: [_subAccount: type$1];
  _subAccountId: [_subAccountId: type$1];
  _subgraphDeploymentID: [_subgraphDeploymentID: type$1];
  _subject: [_subject: type$1];
  _subscriptionId: [_subscriptionId: type$1];
  _supply: [_supply: type$1];
  _swap: [_swap: type$1];
  _swapData: [_swapData: type$1];
  _swapRouter: [_swapRouter: type$1];
  _symbol: [_symbol: type$1];
  _t: [_t: type$1];
  _target: [_target: type$1];
  _targets: [_targets: type$1];
  _taskId: [_taskId: type$1];
  _team: [_team: type$1];
  _teamId: [_teamId: type$1];
  _threshold: [_threshold: type$1];
  _tier: [_tier: type$1];
  _tierId: [_tierId: type$1];
  _tigAsset: [_tigAsset: type$1];
  _time: [_time: type$1];
  _timestamp: [_timestamp: type$1];
  _to: [_to: type$1];
  _toAddress: [_toAddress: type$1];
  _toToken: [_toToken: type$1];
  _token: [_token: type$1];
  _token0: [_token0: type$1];
  _token1: [_token1: type$1];
  _tokenA: [_tokenA: type$1];
  _tokenAddr: [_tokenAddr: type$1];
  _tokenAddress: [_tokenAddress: type$1];
  _tokenAddresses: [_tokenAddresses: type$1];
  _tokenAmount: [_tokenAmount: type$1];
  _tokenB: [_tokenB: type$1];
  _tokenContract: [_tokenContract: type$1];
  _tokenID: [_tokenID: type$1];
  _tokenId: [_tokenId: type$1];
  _tokenIds: [_tokenIds: type$1];
  _tokenIn: [_tokenIn: type$1];
  _tokenName: [_tokenName: type$1];
  _tokenOut: [_tokenOut: type$1];
  _tokenSymbol: [_tokenSymbol: type$1];
  _tokenType: [_tokenType: type$1];
  _tokenURI: [_tokenURI: type$1];
  _tokens: [_tokens: type$1];
  _total: [_total: type$1];
  _totalAmount: [_totalAmount: type$1];
  _totalSupply: [_totalSupply: type$1];
  _tournamentId: [_tournamentId: type$1];
  _trade: [_trade: type$1];
  _tradeData: [_tradeData: type$1];
  _trader: [_trader: type$1];
  _tranche: [_tranche: type$1];
  _transactionId: [_transactionId: type$1];
  _transferFee: [_transferFee: type$1];
  _treasury: [_treasury: type$1];
  _treasuryFee: [_treasuryFee: type$1];
  _trigger: [_trigger: type$1];
  _triggerAboveThreshold: [_triggerAboveThreshold: type$1];
  _triggerPrice: [_triggerPrice: type$1];
  _troveId: [_troveId: type$1];
  _type: [_type: type$1];
  _underlying: [_underlying: type$1];
  _underlyingAsset: [_underlyingAsset: type$1];
  _universe: [_universe: type$1];
  _unlockTime: [_unlockTime: type$1];
  _updateData: [_updateData: type$1];
  _upperHint: [_upperHint: type$1];
  _uri: [_uri: type$1];
  _user: [_user: type$1];
  _userAddr: [_userAddr: type$1];
  _userAddress: [_userAddress: type$1];
  _users: [_users: type$1];
  _v: [_v: type$1];
  _val: [_val: type$1];
  _validator: [_validator: type$1];
  _validatorId: [_validatorId: type$1];
  _value: [_value: type$1];
  _values: [_values: type$1];
  _vault: [_vault: type$1];
  _vaultId: [_vaultId: type$1];
  _vaultProxy: [_vaultProxy: type$1];
  _vaultToken: [_vaultToken: type$1];
  _vaults: [_vaults: type$1];
  _verifier: [_verifier: type$1];
  _version: [_version: type$1];
  _vestingId: [_vestingId: type$1];
  _voter: [_voter: type$1];
  _wallet: [_wallet: type$1];
  _walletAddress: [_walletAddress: type$1];
  _week: [_week: type$1];
  _weiAmount: [_weiAmount: type$1];
  _weight: [_weight: type$1];
  _weights: [_weights: type$1];
  _weth: [_weth: type$1];
  _whitelist: [_whitelist: type$1];
  _who: [_who: type$1];
  _withUpdate: [_withUpdate: type$1];
  _withdrawAmount: [_withdrawAmount: type$1];
  _worker: [_worker: type$1];
  _x: [_x: type$1];
  _y: [_y: type$1];
  _zroPaymentAddress: [_zroPaymentAddress: type$1];
  a: [a: type$1];
  acceptableFixedInterestRate: [acceptableFixedInterestRate: type$1];
  account: [account: type$1];
  accountAddress: [accountAddress: type$1];
  accountId: [accountId: type$1];
  account_: [account_: type$1];
  accounts: [accounts: type$1];
  action: [action: type$1];
  actions: [actions: type$1];
  active: [active: type$1];
  adapter: [adapter: type$1];
  add: [add: type$1];
  addr: [addr: type$1];
  addr_: [addr_: type$1];
  address: [address: type$1];
  address_: [address_: type$1];
  addresses: [addresses: type$1];
  addrs: [addrs: type$1];
  addy: [addy: type$1];
  admin: [admin: type$1];
  adr: [adr: type$1];
  affiliate: [affiliate: type$1];
  agent: [agent: type$1];
  allocation: [allocation: type$1];
  allow: [allow: type$1];
  allowFailure: [allowFailure: type$1];
  allowance: [allowance: type$1];
  allowed: [allowed: type$1];
  amm: [amm: type$1];
  amount: [amount: type$1];
  amount0: [amount0: type$1];
  amount0Min: [amount0Min: type$1];
  amount1: [amount1: type$1];
  amount1Min: [amount1Min: type$1];
  amountADesired: [amountADesired: type$1];
  amountAMin: [amountAMin: type$1];
  amountBDesired: [amountBDesired: type$1];
  amountBMin: [amountBMin: type$1];
  amountETHMin: [amountETHMin: type$1];
  amountIn: [amountIn: type$1];
  amountInMax: [amountInMax: type$1];
  amountOut: [amountOut: type$1];
  amountOutMin: [amountOutMin: type$1];
  amountOutMinimum: [amountOutMinimum: type$1];
  amountTokenDesired: [amountTokenDesired: type$1];
  amountTokenMin: [amountTokenMin: type$1];
  amount_: [amount_: type$1];
  amounts: [amounts: type$1];
  amounts_: [amounts_: type$1];
  amt: [amt: type$1];
  ancillaryData: [ancillaryData: type$1];
  app: [app: type$1];
  appId: [appId: type$1];
  approveMax: [approveMax: type$1];
  approved: [approved: type$1];
  approver: [approver: type$1];
  arg0: [arg0: type$1];
  arg1: [arg1: type$1];
  args: [args: type$1];
  ask: [ask: type$1];
  asset: [asset: type$1];
  assetAddress: [assetAddress: type$1];
  assetAmount: [assetAmount: type$1];
  assetId: [assetId: type$1];
  assetIds: [assetIds: type$1];
  assetToken: [assetToken: type$1];
  assetType: [assetType: type$1];
  asset_: [asset_: type$1];
  assets: [assets: type$1];
  auctionId: [auctionId: type$1];
  author: [author: type$1];
  authority: [authority: type$1];
  authorized: [authorized: type$1];
  available: [available: type$1];
  b: [b: type$1];
  balance: [balance: type$1];
  balances: [balances: type$1];
  base: [base: type$1];
  baseAmount: [baseAmount: type$1];
  baseToken: [baseToken: type$1];
  baseURI: [baseURI: type$1];
  baseURI_: [baseURI_: type$1];
  baseUri: [baseUri: type$1];
  batch: [batch: type$1];
  batchId: [batchId: type$1];
  batchSize: [batchSize: type$1];
  beneficiary: [beneficiary: type$1];
  bid: [bid: type$1];
  bidder: [bidder: type$1];
  binStep: [binStep: type$1];
  blockNumber: [blockNumber: type$1];
  boardId: [boardId: type$1];
  bond: [bond: type$1];
  borrowAmount: [borrowAmount: type$1];
  borrower: [borrower: type$1];
  borrowers: [borrowers: type$1];
  boxId: [boxId: type$1];
  bps: [bps: type$1];
  bridgeRequest: [bridgeRequest: type$1];
  buffer: [buffer: type$1];
  bundleId: [bundleId: type$1];
  burn: [burn: type$1];
  burnAmount: [burnAmount: type$1];
  burner: [burner: type$1];
  buy: [buy: type$1];
  buyAmount: [buyAmount: type$1];
  buyToken: [buyToken: type$1];
  buyer: [buyer: type$1];
  c: [c: type$1];
  cToken: [cToken: type$1];
  cTokens: [cTokens: type$1];
  call: [call: type$1];
  callData: [callData: type$1];
  callback: [callback: type$1];
  callbackData: [callbackData: type$1];
  calldatas: [calldatas: type$1];
  caller: [caller: type$1];
  caller_: [caller_: type$1];
  calls: [calls: type$1];
  campaign: [campaign: type$1];
  campaignId: [campaignId: type$1];
  candidate: [candidate: type$1];
  cap: [cap: type$1];
  category: [category: type$1];
  categoryId: [categoryId: type$1];
  cdp: [cdp: type$1];
  chainId: [chainId: type$1];
  chainId_: [chainId_: type$1];
  channel: [channel: type$1];
  channelId: [channelId: type$1];
  cityId: [cityId: type$1];
  claim: [claim: type$1];
  claimAmount: [claimAmount: type$1];
  claimId: [claimId: type$1];
  claimer: [claimer: type$1];
  claims: [claims: type$1];
  clone: [clone: type$1];
  code: [code: type$1];
  coin: [coin: type$1];
  coinIndex: [coinIndex: type$1];
  coinType: [coinType: type$1];
  collateral: [collateral: type$1];
  collateralAmount: [collateralAmount: type$1];
  collateralAsset: [collateralAsset: type$1];
  collateralId: [collateralId: type$1];
  collateralToken: [collateralToken: type$1];
  collateralType: [collateralType: type$1];
  collection: [collection: type$1];
  collectionAddress: [collectionAddress: type$1];
  collectionId: [collectionId: type$1];
  collection_: [collection_: type$1];
  cometProxy: [cometProxy: type$1];
  comment: [comment: type$1];
  component: [component: type$1];
  comptroller: [comptroller: type$1];
  comptroller_: [comptroller_: type$1];
  conditionId: [conditionId: type$1];
  config: [config: type$1];
  context: [context: type$1];
  contractAddr: [contractAddr: type$1];
  contractAddress: [contractAddress: type$1];
  contributor: [contributor: type$1];
  controller: [controller: type$1];
  core: [core: type$1];
  cost: [cost: type$1];
  count: [count: type$1];
  coverId: [coverId: type$1];
  creator: [creator: type$1];
  creatorContractAddress: [creatorContractAddress: type$1];
  creditAccount: [creditAccount: type$1];
  creditor: [creditor: type$1];
  ctx: [ctx: type$1];
  cup: [cup: type$1];
  curr: [curr: type$1];
  currency: [currency: type$1];
  currencyAmount: [currencyAmount: type$1];
  currencyCt: [currencyCt: type$1];
  currencyId: [currencyId: type$1];
  currencyKey: [currencyKey: type$1];
  currencyKeys: [currencyKeys: type$1];
  currency_: [currency_: type$1];
  cursor: [cursor: type$1];
  d: [d: type$1];
  data: [data: type$1];
  dataStore: [dataStore: type$1];
  data_: [data_: type$1];
  datas: [datas: type$1];
  date: [date: type$1];
  day: [day: type$1];
  deadLine: [deadLine: type$1];
  deadline: [deadline: type$1];
  deadline_: [deadline_: type$1];
  debt: [debt: type$1];
  decimals: [decimals: type$1];
  decimals_: [decimals_: type$1];
  defaultAdmin: [defaultAdmin: type$1];
  delegate: [delegate: type$1];
  delegatee: [delegatee: type$1];
  delegator: [delegator: type$1];
  delta: [delta: type$1];
  denominator: [denominator: type$1];
  deployer: [deployer: type$1];
  deposit: [deposit: type$1];
  depositAmount: [depositAmount: type$1];
  depositData: [depositData: type$1];
  depositId: [depositId: type$1];
  depositToken: [depositToken: type$1];
  depositor: [depositor: type$1];
  desc: [desc: type$1];
  description: [description: type$1];
  dest: [dest: type$1];
  destToken: [destToken: type$1];
  destination: [destination: type$1];
  destinationAddress: [destinationAddress: type$1];
  destinationChain: [destinationChain: type$1];
  destinationChainId: [destinationChainId: type$1];
  destinationDomain: [destinationDomain: type$1];
  details: [details: type$1];
  dev: [dev: type$1];
  dexData: [dexData: type$1];
  dexId: [dexId: type$1];
  direction: [direction: type$1];
  disabled: [disabled: type$1];
  distributionId: [distributionId: type$1];
  distributor: [distributor: type$1];
  divisor: [divisor: type$1];
  dns: [dns: type$1];
  domain: [domain: type$1];
  domainHash: [domainHash: type$1];
  domainSeparator: [domainSeparator: type$1];
  dropId: [dropId: type$1];
  dsId: [dsId: type$1];
  dst: [dst: type$1];
  dstChainId: [dstChainId: type$1];
  dungeonId: [dungeonId: type$1];
  duration: [duration: type$1];
  dx: [dx: type$1];
  e: [e: type$1];
  edition: [edition: type$1];
  editionId: [editionId: type$1];
  eid: [eid: type$1];
  enable: [enable: type$1];
  enabled: [enabled: type$1];
  end: [end: type$1];
  endIdx: [endIdx: type$1];
  endIndex: [endIndex: type$1];
  endTime: [endTime: type$1];
  endTime_: [endTime_: type$1];
  endTimestamp: [endTimestamp: type$1];
  ens: [ens: type$1];
  epoch: [epoch: type$1];
  epochId: [epochId: type$1];
  erc20: [erc20: type$1];
  erc20Address: [erc20Address: type$1];
  erc721Address: [erc721Address: type$1];
  errorData: [errorData: type$1];
  eth: [eth: type$1];
  ethAmount: [ethAmount: type$1];
  eventId: [eventId: type$1];
  exchange: [exchange: type$1];
  exchangeData: [exchangeData: type$1];
  exchangeId: [exchangeId: type$1];
  excluded: [excluded: type$1];
  executor: [executor: type$1];
  exempt: [exempt: type$1];
  expiration: [expiration: type$1];
  expirationTime: [expirationTime: type$1];
  expiry: [expiry: type$1];
  extension: [extension: type$1];
  extraData: [extraData: type$1];
  f: [f: type$1];
  factory: [factory: type$1];
  failures: [failures: type$1];
  farmId: [farmId: type$1];
  fee: [fee: type$1];
  feeAmount: [feeAmount: type$1];
  feeBps: [feeBps: type$1];
  feeRecipient: [feeRecipient: type$1];
  feeType: [feeType: type$1];
  fee_: [fee_: type$1];
  fees: [fees: type$1];
  fid: [fid: type$1];
  flag: [flag: type$1];
  flags: [flags: type$1];
  from: [from: type$1];
  fromAmount: [fromAmount: type$1];
  fromMode: [fromMode: type$1];
  fromToken: [fromToken: type$1];
  from_: [from_: type$1];
  fund: [fund: type$1];
  funder: [funder: type$1];
  fyToken: [fyToken: type$1];
  g: [g: type$1];
  gameId: [gameId: type$1];
  gas: [gas: type$1];
  gasLimit: [gasLimit: type$1];
  gateway: [gateway: type$1];
  gateways: [gateways: type$1];
  gauge: [gauge: type$1];
  goodUntil: [goodUntil: type$1];
  group: [group: type$1];
  groupId: [groupId: type$1];
  guardian: [guardian: type$1];
  guildId: [guildId: type$1];
  guy: [guy: type$1];
  h: [h: type$1];
  handler: [handler: type$1];
  hash: [hash: type$1];
  hashes: [hashes: type$1];
  hero: [hero: type$1];
  heroId: [heroId: type$1];
  heroToken: [heroToken: type$1];
  holder: [holder: type$1];
  holders: [holders: type$1];
  hook: [hook: type$1];
  hookData: [hookData: type$1];
  host: [host: type$1];
  i: [i: type$1];
  id: [id: type$1];
  id_: [id_: type$1];
  identifier: [identifier: type$1];
  identity: [identity: type$1];
  ids: [ids: type$1];
  idsLength: [idsLength: type$1];
  idx: [idx: type$1];
  ilk: [ilk: type$1];
  ilkIndex: [ilkIndex: type$1];
  impl: [impl: type$1];
  implementation: [implementation: type$1];
  inbound_tkn: [inbound_tkn: type$1];
  increase: [increase: type$1];
  index: [index: type$1];
  indexToken: [indexToken: type$1];
  index_: [index_: type$1];
  indexes: [indexes: type$1];
  indices: [indices: type$1];
  info: [info: type$1];
  initData: [initData: type$1];
  initialExchangeRateMantissa_: [initialExchangeRateMantissa_: type$1];
  initialOwner: [initialOwner: type$1];
  initiator: [initiator: type$1];
  input: [input: type$1];
  inputAmount: [inputAmount: type$1];
  inputAsset: [inputAsset: type$1];
  inputToken: [inputToken: type$1];
  inputs: [inputs: type$1];
  instanceId: [instanceId: type$1];
  instrument: [instrument: type$1];
  instrumentId: [instrumentId: type$1];
  interestRateModel_: [interestRateModel_: type$1];
  interfaceId: [interfaceId: type$1];
  interval: [interval: type$1];
  investor: [investor: type$1];
  ipfsHash: [ipfsHash: type$1];
  isActive: [isActive: type$1];
  isAllowed: [isAllowed: type$1];
  isEnabled: [isEnabled: type$1];
  isExcluded: [isExcluded: type$1];
  isLong: [isLong: type$1];
  isPaused: [isPaused: type$1];
  issuer: [issuer: type$1];
  item: [item: type$1];
  itemId: [itemId: type$1];
  itemIds: [itemIds: type$1];
  items: [items: type$1];
  j: [j: type$1];
  k: [k: type$1];
  keeper: [keeper: type$1];
  key: [key: type$1];
  keys: [keys: type$1];
  kind: [kind: type$1];
  l: [l: type$1];
  label: [label: type$1];
  leaf: [leaf: type$1];
  lender: [lender: type$1];
  length: [length: type$1];
  level: [level: type$1];
  leverage: [leverage: type$1];
  lien: [lien: type$1];
  lienId: [lienId: type$1];
  limit: [limit: type$1];
  liquidator: [liquidator: type$1];
  liquidity: [liquidity: type$1];
  liquidityFee: [liquidityFee: type$1];
  listingId: [listingId: type$1];
  loan: [loan: type$1];
  loanId: [loanId: type$1];
  lock: [lock: type$1];
  lockDuration: [lockDuration: type$1];
  lockTime: [lockTime: type$1];
  locked: [locked: type$1];
  long: [long: type$1];
  lp: [lp: type$1];
  lpAmount: [lpAmount: type$1];
  lpToken: [lpToken: type$1];
  lpTokens: [lpTokens: type$1];
  m: [m: type$1];
  maker: [maker: type$1];
  makerSignature: [makerSignature: type$1];
  manager: [manager: type$1];
  margin: [margin: type$1];
  marginAccountID: [marginAccountID: type$1];
  market: [market: type$1];
  marketId: [marketId: type$1];
  marketId_: [marketId_: type$1];
  marketIndex: [marketIndex: type$1];
  marketParams: [marketParams: type$1];
  marketing: [marketing: type$1];
  marketingFee: [marketingFee: type$1];
  markets: [markets: type$1];
  maturity: [maturity: type$1];
  max: [max: type$1];
  maxAmount: [maxAmount: type$1];
  maxAmountIn: [maxAmountIn: type$1];
  maxPrice: [maxPrice: type$1];
  maxSupply: [maxSupply: type$1];
  member: [member: type$1];
  memo: [memo: type$1];
  merchant: [merchant: type$1];
  merkleProof: [merkleProof: type$1];
  merkleProofs: [merkleProofs: type$1];
  merkleRoot: [merkleRoot: type$1];
  merkleRoot_: [merkleRoot_: type$1];
  message: [message: type$1];
  messageHash: [messageHash: type$1];
  metadata: [metadata: type$1];
  metadataURI: [metadataURI: type$1];
  min: [min: type$1];
  minAmount: [minAmount: type$1];
  minAmountOut: [minAmountOut: type$1];
  minAmounts: [minAmounts: type$1];
  minBuyAmount: [minBuyAmount: type$1];
  minOut: [minOut: type$1];
  minPrice: [minPrice: type$1];
  minReturn: [minReturn: type$1];
  minReturnAmount: [minReturnAmount: type$1];
  miner: [miner: type$1];
  mintAmount: [mintAmount: type$1];
  mintId: [mintId: type$1];
  minter: [minter: type$1];
  minter_: [minter_: type$1];
  mode: [mode: type$1];
  module: [module: type$1];
  month: [month: type$1];
  msgSender: [msgSender: type$1];
  multiplier: [multiplier: type$1];
  n: [n: type$1];
  name: [name: type$1];
  name_: [name_: type$1];
  names: [names: type$1];
  namespace: [namespace: type$1];
  ne: [ne: type$1];
  needed: [needed: type$1];
  new: [new: type$1];
  newAddress: [newAddress: type$1];
  newAdmin: [newAdmin: type$1];
  newAmount: [newAmount: type$1];
  newContract: [newContract: type$1];
  newFee: [newFee: type$1];
  newImplementation: [newImplementation: type$1];
  newLimit: [newLimit: type$1];
  newManager: [newManager: type$1];
  newMax: [newMax: type$1];
  newName: [newName: type$1];
  newOwner: [newOwner: type$1];
  newPrice: [newPrice: type$1];
  newRate: [newRate: type$1];
  newRatio: [newRatio: type$1];
  newRecipient: [newRecipient: type$1];
  newStatus: [newStatus: type$1];
  newThreshold: [newThreshold: type$1];
  newValue: [newValue: type$1];
  newWallet: [newWallet: type$1];
  next: [next: type$1];
  nextOwner: [nextOwner: type$1];
  nft: [nft: type$1];
  nftAddress: [nftAddress: type$1];
  nftAsset: [nftAsset: type$1];
  nftContract: [nftContract: type$1];
  nftID: [nftID: type$1];
  nftId: [nftId: type$1];
  nftIds: [nftIds: type$1];
  nftRecipient: [nftRecipient: type$1];
  nftTokenId: [nftTokenId: type$1];
  nft_: [nft_: type$1];
  node: [node: type$1];
  nodeID: [nodeID: type$1];
  nodeId: [nodeId: type$1];
  nodeIndex: [nodeIndex: type$1];
  nodeOperatorId: [nodeOperatorId: type$1];
  nonce: [nonce: type$1];
  nonceKey: [nonceKey: type$1];
  nonce_: [nonce_: type$1];
  num: [num: type$1];
  numToMint: [numToMint: type$1];
  numTokens: [numTokens: type$1];
  number: [number: type$1];
  numberOfTokens: [numberOfTokens: type$1];
  numerator: [numerator: type$1];
  o: [o: type$1];
  offer: [offer: type$1];
  offerId: [offerId: type$1];
  offerer: [offerer: type$1];
  offset: [offset: type$1];
  olKey: [olKey: type$1];
  old: [old: type$1];
  onBehalf: [onBehalf: type$1];
  onBehalfOf: [onBehalfOf: type$1];
  open: [open: type$1];
  operation: [operation: type$1];
  operator: [operator: type$1];
  operatorId: [operatorId: type$1];
  operatorIds: [operatorIds: type$1];
  operators: [operators: type$1];
  option: [option: type$1];
  options: [options: type$1];
  oracle: [oracle: type$1];
  oracles: [oracles: type$1];
  order: [order: type$1];
  orderHash: [orderHash: type$1];
  orderId: [orderId: type$1];
  orderType: [orderType: type$1];
  order_: [order_: type$1];
  orders: [orders: type$1];
  outbound_tkn: [outbound_tkn: type$1];
  output: [output: type$1];
  outputAmount: [outputAmount: type$1];
  outputReference: [outputReference: type$1];
  outputToken: [outputToken: type$1];
  owner: [owner: type$1];
  ownerAddress: [ownerAddress: type$1];
  owner_: [owner_: type$1];
  owners: [owners: type$1];
  p: [p: type$1];
  pToken: [pToken: type$1];
  pageSize: [pageSize: type$1];
  pair: [pair: type$1];
  pairId: [pairId: type$1];
  pairIndex: [pairIndex: type$1];
  pairs: [pairs: type$1];
  param: [param: type$1];
  parameters: [parameters: type$1];
  params: [params: type$1];
  params_: [params_: type$1];
  parentId: [parentId: type$1];
  partner: [partner: type$1];
  partyA: [partyA: type$1];
  path: [path: type$1];
  paths: [paths: type$1];
  pause: [pause: type$1];
  paused: [paused: type$1];
  payee: [payee: type$1];
  payer: [payer: type$1];
  payload: [payload: type$1];
  paymentToken: [paymentToken: type$1];
  percent: [percent: type$1];
  percentage: [percentage: type$1];
  period: [period: type$1];
  permission: [permission: type$1];
  permissions: [permissions: type$1];
  permit: [permit: type$1];
  permitData: [permitData: type$1];
  permitDeadline: [permitDeadline: type$1];
  petId: [petId: type$1];
  phase: [phase: type$1];
  pid: [pid: type$1];
  plan: [plan: type$1];
  planId: [planId: type$1];
  player: [player: type$1];
  playerId: [playerId: type$1];
  points: [points: type$1];
  policyId: [policyId: type$1];
  policyType: [policyType: type$1];
  pool: [pool: type$1];
  poolAddress: [poolAddress: type$1];
  poolFee: [poolFee: type$1];
  poolHash: [poolHash: type$1];
  poolID: [poolID: type$1];
  poolId: [poolId: type$1];
  poolId_: [poolId_: type$1];
  poolIndex: [poolIndex: type$1];
  poolKey: [poolKey: type$1];
  poolToken: [poolToken: type$1];
  poolType: [poolType: type$1];
  pool_: [pool_: type$1];
  pools: [pools: type$1];
  pos: [pos: type$1];
  position: [position: type$1];
  positionId: [positionId: type$1];
  positions: [positions: type$1];
  previous: [previous: type$1];
  previousOwner: [previousOwner: type$1];
  price: [price: type$1];
  priceUpdateData: [priceUpdateData: type$1];
  price_: [price_: type$1];
  prices: [prices: type$1];
  primary: [primary: type$1];
  principal: [principal: type$1];
  product: [product: type$1];
  productId: [productId: type$1];
  profileId: [profileId: type$1];
  profit: [profit: type$1];
  projectId: [projectId: type$1];
  proof: [proof: type$1];
  proof_: [proof_: type$1];
  proofs: [proofs: type$1];
  proposal: [proposal: type$1];
  proposalId: [proposalId: type$1];
  proposer: [proposer: type$1];
  protocol: [protocol: type$1];
  provider: [provider: type$1];
  proxy: [proxy: type$1];
  publicKey: [publicKey: type$1];
  q: [q: type$1];
  qty: [qty: type$1];
  quantities: [quantities: type$1];
  quantity: [quantity: type$1];
  queries: [queries: type$1];
  questID: [questID: type$1];
  questId: [questId: type$1];
  questId_: [questId_: type$1];
  questionID: [questionID: type$1];
  question_id: [question_id: type$1];
  quorumNumber: [quorumNumber: type$1];
  quote: [quote: type$1];
  quoteId: [quoteId: type$1];
  quoteToken: [quoteToken: type$1];
  r: [r: type$1];
  raffleId: [raffleId: type$1];
  rarity: [rarity: type$1];
  rate: [rate: type$1];
  ratio: [ratio: type$1];
  reason: [reason: type$1];
  receiver: [receiver: type$1];
  receiverAddress: [receiverAddress: type$1];
  receiver_: [receiver_: type$1];
  receivers: [receivers: type$1];
  recipient: [recipient: type$1];
  recipient_: [recipient_: type$1];
  recipients: [recipients: type$1];
  redeemer: [redeemer: type$1];
  ref: [ref: type$1];
  referral: [referral: type$1];
  referralCode: [referralCode: type$1];
  referralId: [referralId: type$1];
  referrer: [referrer: type$1];
  refund: [refund: type$1];
  refundAddress: [refundAddress: type$1];
  registry: [registry: type$1];
  relayer: [relayer: type$1];
  repayAmount: [repayAmount: type$1];
  req: [req: type$1];
  request: [request: type$1];
  requestId: [requestId: type$1];
  requestIds: [requestIds: type$1];
  requester: [requester: type$1];
  requests: [requests: type$1];
  required: [required: type$1];
  rescueOrder: [rescueOrder: type$1];
  reserve: [reserve: type$1];
  reserveId: [reserveId: type$1];
  resolvedName: [resolvedName: type$1];
  resolver: [resolver: type$1];
  resourceID: [resourceID: type$1];
  responses: [responses: type$1];
  restricted: [restricted: type$1];
  result: [result: type$1];
  returnData: [returnData: type$1];
  reverseName: [reverseName: type$1];
  reverseResolver: [reverseResolver: type$1];
  reward: [reward: type$1];
  rewardAmount: [rewardAmount: type$1];
  rewardToken: [rewardToken: type$1];
  rewards: [rewards: type$1];
  riskIndicatorsInputs: [riskIndicatorsInputs: type$1];
  role: [role: type$1];
  roleId: [roleId: type$1];
  roles: [roles: type$1];
  root: [root: type$1];
  round: [round: type$1];
  roundId: [roundId: type$1];
  route: [route: type$1];
  router: [router: type$1];
  routes: [routes: type$1];
  s: [s: type$1];
  safe: [safe: type$1];
  salt: [salt: type$1];
  scId: [scId: type$1];
  schainHash: [schainHash: type$1];
  schainName: [schainName: type$1];
  score: [score: type$1];
  season: [season: type$1];
  seasonId: [seasonId: type$1];
  secret: [secret: type$1];
  secs: [secs: type$1];
  seed: [seed: type$1];
  selector: [selector: type$1];
  sell: [sell: type$1];
  sellAmount: [sellAmount: type$1];
  sellOrder: [sellOrder: type$1];
  sellToken: [sellToken: type$1];
  seller: [seller: type$1];
  sender: [sender: type$1];
  seriesId: [seriesId: type$1];
  serviceId: [serviceId: type$1];
  settings: [settings: type$1];
  share: [share: type$1];
  shareAmount: [shareAmount: type$1];
  shares: [shares: type$1];
  sharesAmount: [sharesAmount: type$1];
  sharesSubject: [sharesSubject: type$1];
  shares_: [shares_: type$1];
  side: [side: type$1];
  sig: [sig: type$1];
  signature: [signature: type$1];
  signature_: [signature_: type$1];
  signatures: [signatures: type$1];
  signer: [signer: type$1];
  size: [size: type$1];
  sizeDelta: [sizeDelta: type$1];
  slippage: [slippage: type$1];
  slot: [slot: type$1];
  slot_: [slot_: type$1];
  smartVault: [smartVault: type$1];
  source: [source: type$1];
  sourceAmount: [sourceAmount: type$1];
  sourceToken: [sourceToken: type$1];
  spender: [spender: type$1];
  sqrtPriceLimitX96: [sqrtPriceLimitX96: type$1];
  sqrtPriceX96: [sqrtPriceX96: type$1];
  src: [src: type$1];
  srcAmount: [srcAmount: type$1];
  srcToken: [srcToken: type$1];
  stable: [stable: type$1];
  stage: [stage: type$1];
  stake: [stake: type$1];
  stakeAmount: [stakeAmount: type$1];
  stakeId: [stakeId: type$1];
  stakeIndex: [stakeIndex: type$1];
  staker: [staker: type$1];
  stakerAddr: [stakerAddr: type$1];
  stakingToken: [stakingToken: type$1];
  starkKey: [starkKey: type$1];
  start: [start: type$1];
  startDate: [startDate: type$1];
  startIdx: [startIdx: type$1];
  startIndex: [startIndex: type$1];
  startTime: [startTime: type$1];
  startTime_: [startTime_: type$1];
  startTimestamp: [startTimestamp: type$1];
  state: [state: type$1];
  status: [status: type$1];
  statuses: [statuses: type$1];
  strategies: [strategies: type$1];
  strategy: [strategy: type$1];
  streamId: [streamId: type$1];
  strike: [strike: type$1];
  subAccountId: [subAccountId: type$1];
  subId: [subId: type$1];
  subaccount: [subaccount: type$1];
  subject: [subject: type$1];
  subjectType: [subjectType: type$1];
  subscriber: [subscriber: type$1];
  success: [success: type$1];
  superToken: [superToken: type$1];
  supply: [supply: type$1];
  support: [support: type$1];
  swap: [swap: type$1];
  swapData: [swapData: type$1];
  swapFee: [swapFee: type$1];
  swapFeePercentage: [swapFeePercentage: type$1];
  swapId: [swapId: type$1];
  swapParams: [swapParams: type$1];
  swapTarget: [swapTarget: type$1];
  swaps: [swaps: type$1];
  sweepTokens: [sweepTokens: type$1];
  symbol: [symbol: type$1];
  symbol_: [symbol_: type$1];
  t: [t: type$1];
  tAmount: [tAmount: type$1];
  tableId: [tableId: type$1];
  tag: [tag: type$1];
  taker: [taker: type$1];
  target: [target: type$1];
  targetAddress: [targetAddress: type$1];
  targetContract: [targetContract: type$1];
  targetToken: [targetToken: type$1];
  targets: [targets: type$1];
  taskId: [taskId: type$1];
  tax: [tax: type$1];
  taxFee: [taxFee: type$1];
  term: [term: type$1];
  termAuctionId: [termAuctionId: type$1];
  termId: [termId: type$1];
  termRepoId: [termRepoId: type$1];
  theSignature: [theSignature: type$1];
  threshold: [threshold: type$1];
  tick: [tick: type$1];
  tickLower: [tickLower: type$1];
  tickSpacing: [tickSpacing: type$1];
  tickUpper: [tickUpper: type$1];
  ticketId: [ticketId: type$1];
  tid: [tid: type$1];
  tier: [tier: type$1];
  tierId: [tierId: type$1];
  time: [time: type$1];
  timestamp: [timestamp: type$1];
  to: [to: type$1];
  toAddress: [toAddress: type$1];
  toChain: [toChain: type$1];
  toChainId: [toChainId: type$1];
  toToken: [toToken: type$1];
  to_: [to_: type$1];
  tok: [tok: type$1];
  token: [token: type$1];
  token0: [token0: type$1];
  token1: [token1: type$1];
  tokenA: [tokenA: type$1];
  tokenAddr: [tokenAddr: type$1];
  tokenAddress: [tokenAddress: type$1];
  tokenAddresses: [tokenAddresses: type$1];
  tokenAmount: [tokenAmount: type$1];
  tokenAmountIn: [tokenAmountIn: type$1];
  tokenAmounts: [tokenAmounts: type$1];
  tokenB: [tokenB: type$1];
  tokenContract: [tokenContract: type$1];
  tokenID: [tokenID: type$1];
  tokenIDs: [tokenIDs: type$1];
  tokenId: [tokenId: type$1];
  tokenId_: [tokenId_: type$1];
  tokenIds: [tokenIds: type$1];
  tokenIds_: [tokenIds_: type$1];
  tokenIn: [tokenIn: type$1];
  tokenIndex: [tokenIndex: type$1];
  tokenName: [tokenName: type$1];
  tokenOut: [tokenOut: type$1];
  tokenOwner: [tokenOwner: type$1];
  tokenRecipient: [tokenRecipient: type$1];
  tokenSymbol: [tokenSymbol: type$1];
  tokenType: [tokenType: type$1];
  tokenURI: [tokenURI: type$1];
  tokenUri: [tokenUri: type$1];
  tokenX: [tokenX: type$1];
  tokenY: [tokenY: type$1];
  token_: [token_: type$1];
  tokenid: [tokenid: type$1];
  tokens: [tokens: type$1];
  tokens_: [tokens_: type$1];
  tos: [tos: type$1];
  total: [total: type$1];
  totalAmount: [totalAmount: type$1];
  totalSupply: [totalSupply: type$1];
  tournamentId: [tournamentId: type$1];
  trade: [trade: type$1];
  trader: [trader: type$1];
  traitId: [traitId: type$1];
  tranche: [tranche: type$1];
  trancheId: [trancheId: type$1];
  transactionId: [transactionId: type$1];
  treasury: [treasury: type$1];
  true_or_false: [true_or_false: type$1];
  ts: [ts: type$1];
  ttl: [ttl: type$1];
  txHash: [txHash: type$1];
  typeId: [typeId: type$1];
  type_: [type_: type$1];
  u: [u: type$1];
  underlying: [underlying: type$1];
  underlyingToken: [underlyingToken: type$1];
  underlying_: [underlying_: type$1];
  updateData: [updateData: type$1];
  updater: [updater: type$1];
  uri: [uri: type$1];
  uri_: [uri_: type$1];
  url: [url: type$1];
  usdcAmount: [usdcAmount: type$1];
  user: [user: type$1];
  userAddr: [userAddr: type$1];
  userAddress: [userAddress: type$1];
  userData: [userData: type$1];
  userId: [userId: type$1];
  userOp: [userOp: type$1];
  user_: [user_: type$1];
  users: [users: type$1];
  usr: [usr: type$1];
  v: [v: type$1];
  vToken: [vToken: type$1];
  val: [val: type$1];
  validAfter: [validAfter: type$1];
  validBefore: [validBefore: type$1];
  validUntil: [validUntil: type$1];
  validator: [validator: type$1];
  validatorId: [validatorId: type$1];
  value: [value: type$1];
  value_: [value_: type$1];
  values: [values: type$1];
  valuesLength: [valuesLength: type$1];
  vars: [vars: type$1];
  vault: [vault: type$1];
  vaultAddress: [vaultAddress: type$1];
  vaultAddresses: [vaultAddresses: type$1];
  vaultID: [vaultID: type$1];
  vaultId: [vaultId: type$1];
  vault_: [vault_: type$1];
  vectorId: [vectorId: type$1];
  verifier: [verifier: type$1];
  version: [version: type$1];
  volume: [volume: type$1];
  voter: [voter: type$1];
  vs: [vs: type$1];
  w: [w: type$1];
  wad: [wad: type$1];
  wallet: [wallet: type$1];
  walletAddress: [walletAddress: type$1];
  wallet_: [wallet_: type$1];
  wallets: [wallets: type$1];
  week: [week: type$1];
  weight: [weight: type$1];
  weights: [weights: type$1];
  weth: [weth: type$1];
  what: [what: type$1];
  whitelist: [whitelist: type$1];
  whitelisted: [whitelisted: type$1];
  who: [who: type$1];
  withdrawAmount: [withdrawAmount: type$1];
  worldId: [worldId: type$1];
  wrappedToken: [wrappedToken: type$1];
  x: [x: type$1];
  y: [y: type$1];
  year: [year: type$1];
  yieldToken: [yieldToken: type$1];
  z: [z: type$1];
  zeroForOne: [zeroForOne: type$1];
  zone: [zone: type$1];
}
//#endregion
//#region ../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.3.5/node_modules/abitype/dist/types/utils.d.ts
/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Does not include full array or tuple conversion. Use {@link AbiParameterToPrimitiveType} to fully convert arrays and tuples.
 *
 * @param abiType - {@link AbiType} to convert to TypeScript representation
 * @param abiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns TypeScript primitive type
 */
type AbiTypeToPrimitiveType<abiType extends AbiType, abiParameterKind extends AbiParameterKind = AbiParameterKind> = abiType extends SolidityBytes ? PrimitiveTypeLookup[abiType][abiParameterKind] : PrimitiveTypeLookup[abiType];
interface PrimitiveTypeLookup extends SolidityIntMap, SolidityByteMap, SolidityArrayMap {
  address: ResolvedRegister$1['addressType'];
  bool: boolean;
  function: `${ResolvedRegister$1['addressType']}${string}`;
  string: string;
  tuple: Record<string, unknown>;
}
type SolidityIntMap = { [_ in SolidityInt]: _ extends `${'u' | ''}int${infer bits extends keyof BitsTypeLookup}` ? BitsTypeLookup[bits] : never };
type SolidityByteMap = { [_ in SolidityBytes]: ResolvedRegister$1['bytesType'] };
type SolidityArrayMap = { [_ in SolidityArray]: readonly unknown[] };
type GreaterThan48Bits = Exclude<MBits, 8 | 16 | 24 | 32 | 40 | 48 | NoBits>;
type LessThanOrEqualTo48Bits = Exclude<MBits, GreaterThan48Bits | NoBits>;
type NoBits = '';
type BitsTypeLookup = { [key in MBits]: ResolvedRegister$1[key extends LessThanOrEqualTo48Bits ? 'intType' : 'bigIntType'] };
/**
 * Converts {@link AbiParameter} to corresponding TypeScript primitive type.
 *
 * @param abiParameter - {@link AbiParameter} to convert to TypeScript representation
 * @param abiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns TypeScript primitive type
 */
type AbiParameterToPrimitiveType<abiParameter extends AbiParameter | {
  name: string;
  type: unknown;
}, abiParameterKind extends AbiParameterKind = AbiParameterKind> = abiParameter['type'] extends AbiBasicType ? AbiTypeToPrimitiveType<abiParameter['type'], abiParameterKind> : abiParameter extends {
  type: SolidityTuple;
  components: infer components extends readonly AbiParameter[];
} ? AbiComponentsToPrimitiveType<components, abiParameterKind> : MaybeExtractArrayParameterType<abiParameter['type']> extends [infer head extends string, infer size] ? AbiArrayToPrimitiveType<abiParameter, abiParameterKind, head, size> : ResolvedRegister$1['strictAbiType'] extends true ? Error$1<`Unknown type '${abiParameter['type'] & string}'.`> : abiParameter extends {
  components: Error$1<string>;
} ? abiParameter['components'] : unknown;
type AbiBasicType = Exclude<AbiType, SolidityTuple | SolidityArray>;
type AbiComponentsToPrimitiveType<components$1 extends readonly AbiParameter[], abiParameterKind extends AbiParameterKind> = components$1 extends readonly [] ? [] : components$1[number]['name'] extends Exclude<components$1[number]['name'] & string, undefined | ''> ? { [component in components$1[number] as component['name'] & {}]: AbiParameterToPrimitiveType<component, abiParameterKind> } : { [key in keyof components$1]: AbiParameterToPrimitiveType<components$1[key], abiParameterKind> };
type MaybeExtractArrayParameterType<type$1> =
/**
 * First, infer `Head` against a known size type (either fixed-length array value or `""`).
 *
 * | Input           | Head         |
 * | --------------- | ------------ |
 * | `string[]`      | `string`     |
 * | `string[][][3]` | `string[][]` |
 */
type$1 extends `${infer head}[${'' | `${SolidityFixedArrayRange}`}]` ? type$1 extends `${head}[${infer size}]` ? [head, size] : undefined : undefined;
type AbiArrayToPrimitiveType<abiParameter extends AbiParameter | {
  name: string;
  type: unknown;
}, abiParameterKind extends AbiParameterKind, head$1 extends string, size$1> = size$1 extends keyof SolidityFixedArraySizeLookup ? Tuple<AbiParameterToPrimitiveType<Merge<abiParameter, {
  type: head$1;
}>, abiParameterKind>, SolidityFixedArraySizeLookup[size$1]> : readonly AbiParameterToPrimitiveType<Merge<abiParameter, {
  type: head$1;
}>, abiParameterKind>[];
/**
 * Converts array of {@link AbiParameter} to corresponding TypeScript primitive types.
 *
 * @param abiParameters - Array of {@link AbiParameter} to convert to TypeScript representations
 * @param abiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns Array of TypeScript primitive types
 */
type AbiParametersToPrimitiveTypes<abiParameters extends readonly AbiParameter[], abiParameterKind extends AbiParameterKind = AbiParameterKind, experimental_namedTuples extends boolean = ResolvedRegister$1['experimental_namedTuples']> = experimental_namedTuples extends true ? AbiParametersToPrimitiveTypes_named<abiParameters, abiParameterKind> : AbiParametersToPrimitiveTypes_mapped<abiParameters, abiParameterKind>;
type AbiParametersToPrimitiveTypes_mapped<abiParameters extends readonly AbiParameter[], abiParameterKind extends AbiParameterKind = AbiParameterKind> = Pretty<{ [key in keyof abiParameters]: AbiParameterToPrimitiveType<abiParameters[key], abiParameterKind> }>;
type AbiParametersToPrimitiveTypes_named<abiParameters extends readonly AbiParameter[], abiParameterKind extends AbiParameterKind = AbiParameterKind, acc extends readonly unknown[] = [], depth extends readonly number[] = []> = depth['length'] extends 15 ? readonly unknown[] : abiParameters extends readonly [infer head1 extends AbiParameter, infer head2 extends AbiParameter, infer head3 extends AbiParameter, infer head4 extends AbiParameter, infer head5 extends AbiParameter, infer head6 extends AbiParameter, ...infer tail extends readonly AbiParameter[]] ? AbiParametersToPrimitiveTypes_named<tail, abiParameterKind, readonly [...acc, ...ToNamedTuple<head1, abiParameterKind>, ...ToNamedTuple<head2, abiParameterKind>, ...ToNamedTuple<head3, abiParameterKind>, ...ToNamedTuple<head4, abiParameterKind>, ...ToNamedTuple<head5, abiParameterKind>, ...ToNamedTuple<head6, abiParameterKind>], [...depth, 1]> : abiParameters extends readonly [infer head1 extends AbiParameter, infer head2 extends AbiParameter, infer head3 extends AbiParameter, infer head4 extends AbiParameter, infer head5 extends AbiParameter] ? readonly [...acc, ...ToNamedTuple<head1, abiParameterKind>, ...ToNamedTuple<head2, abiParameterKind>, ...ToNamedTuple<head3, abiParameterKind>, ...ToNamedTuple<head4, abiParameterKind>, ...ToNamedTuple<head5, abiParameterKind>] : abiParameters extends readonly [infer head1 extends AbiParameter, infer head2 extends AbiParameter, infer head3 extends AbiParameter, infer head4 extends AbiParameter] ? readonly [...acc, ...ToNamedTuple<head1, abiParameterKind>, ...ToNamedTuple<head2, abiParameterKind>, ...ToNamedTuple<head3, abiParameterKind>, ...ToNamedTuple<head4, abiParameterKind>] : abiParameters extends readonly [infer head1 extends AbiParameter, infer head2 extends AbiParameter, infer head3 extends AbiParameter] ? readonly [...acc, ...ToNamedTuple<head1, abiParameterKind>, ...ToNamedTuple<head2, abiParameterKind>, ...ToNamedTuple<head3, abiParameterKind>] : abiParameters extends readonly [infer head1 extends AbiParameter, infer head2 extends AbiParameter] ? readonly [...acc, ...ToNamedTuple<head1, abiParameterKind>, ...ToNamedTuple<head2, abiParameterKind>] : abiParameters extends readonly [infer head extends AbiParameter] ? readonly [...acc, ...ToNamedTuple<head, abiParameterKind>] : acc extends readonly [] ? abiParameters extends readonly [] ? readonly [] : readonly unknown[] : acc;
type ToNamedTuple<abiParameter extends AbiParameter, abiParameterKind extends AbiParameterKind> = unwrapName<AbiParameterToPrimitiveType<abiParameter, abiParameterKind>, abiParameter['name']>;
type unwrapName<type$1, name$1> = name$1 extends string ? AbiParameterTupleNameLookup<type$1>[name$1] : [type$1];
/**
 * Checks if type is {@link Abi}.
 *
 * @param abi - {@link Abi} to check
 * @returns Boolean for whether {@link abi} is {@link Abi}
 */

/**
 * Extracts all {@link AbiFunction} types from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract functions from
 * @param abiStateMutability - {@link AbiStateMutability} to filter by
 * @returns All {@link AbiFunction} types from {@link Abi}
 */
type ExtractAbiFunctions<abi$1 extends Abi, abiStateMutability extends AbiStateMutability = AbiStateMutability> = Extract<abi$1[number], {
  type: 'function';
  stateMutability: abiStateMutability;
}>;
/**
 * Extracts all {@link AbiFunction} names from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract function names from
 * @param abiStateMutability - {@link AbiStateMutability} to filter by
 * @returns Union of function names
 */
type ExtractAbiFunctionNames<abi$1 extends Abi, abiStateMutability extends AbiStateMutability = AbiStateMutability> = ExtractAbiFunctions<abi$1, abiStateMutability>['name'];
/**
 * Extracts {@link AbiFunction} with name from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract {@link AbiFunction} from
 * @param functionName - String name of function to extract from {@link Abi}
 * @param abiStateMutability - {@link AbiStateMutability} to filter by
 * @returns Matching {@link AbiFunction}
 */
type ExtractAbiFunction<abi$1 extends Abi, functionName$1 extends ExtractAbiFunctionNames<abi$1>, abiStateMutability extends AbiStateMutability = AbiStateMutability> = Extract<ExtractAbiFunctions<abi$1, abiStateMutability>, {
  name: functionName$1;
}>;
/**
 * Extracts all {@link AbiEvent} types from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract events from
 * @returns All {@link AbiEvent} types from {@link Abi}
 */
type ExtractAbiEvents<abi$1 extends Abi> = Extract<abi$1[number], {
  type: 'event';
}>;
/**
 * Extracts all {@link AbiEvent} names from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract event names from
 * @returns Union of event names
 */
type ExtractAbiEventNames<abi$1 extends Abi> = ExtractAbiEvents<abi$1>['name'];
/**
 * Extracts {@link AbiEvent} with name from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract {@link AbiEvent} from
 * @param eventName - String name of event to extract from {@link Abi}
 * @returns Matching {@link AbiEvent}
 */
type ExtractAbiEvent<abi$1 extends Abi, eventName$1 extends ExtractAbiEventNames<abi$1>> = Extract<ExtractAbiEvents<abi$1>, {
  name: eventName$1;
}>;
/**
 * Extracts all {@link AbiError} types from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract errors from
 * @returns All {@link AbiError} types from {@link Abi}
 */
type ExtractAbiErrors<abi$1 extends Abi> = Extract<abi$1[number], {
  type: 'error';
}>;
/**
 * Extracts all {@link AbiError} names from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract error names from
 * @returns Union of error names
 */
type ExtractAbiErrorNames<abi$1 extends Abi> = ExtractAbiErrors<abi$1>['name'];
/**
 * Extracts {@link AbiError} with name from {@link Abi}.
 *
 * @param abi - {@link Abi} to extract {@link AbiError} from
 * @param errorName - String name of error to extract from {@link Abi}
 * @returns Matching {@link AbiError}
 */
type ExtractAbiError<abi$1 extends Abi, errorName$1 extends ExtractAbiErrorNames<abi$1>> = Extract<ExtractAbiErrors<abi$1>, {
  name: errorName$1;
}>;
/**
 * Converts {@link typedData} to corresponding TypeScript primitive types.
 *
 * @param typedData - {@link TypedData} to convert
 * @param abiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns Union of TypeScript primitive types
 */
type TypedDataToPrimitiveTypes<typedData extends TypedData, abiParameterKind extends AbiParameterKind = AbiParameterKind, keyReferences extends {
  [_: string]: unknown;
} | unknown = unknown> = { [key in keyof typedData]: { [key2 in typedData[key][number] as key2['name']]: key2['type'] extends key ? Error$1<`Cannot convert self-referencing struct '${key2['type']}' to primitive type.`> : key2['type'] extends keyof typedData ? key2['type'] extends keyof keyReferences ? Error$1<`Circular reference detected. '${key2['type']}' is a circular reference.`> : TypedDataToPrimitiveTypes<Exclude<typedData, key>, abiParameterKind, keyReferences & { [_ in key2['type'] | key]: true }>[key2['type']] : key2['type'] extends `${infer type extends keyof typedData & string}[${infer tail}]` ? AbiParameterToPrimitiveType<{
  name: key2['name'];
  type: `tuple[${tail}]`;
  components: _TypedDataParametersToAbiParameters<typedData[type], typedData, keyReferences & { [_ in type | key]: true }>;
}, abiParameterKind> : key2['type'] extends TypedDataType ? AbiParameterToPrimitiveType<key2, abiParameterKind> : Error$1<`Cannot convert unknown type '${key2['type']}' to primitive type.`> } } & unknown;
type _TypedDataParametersToAbiParameters<typedDataParameters extends readonly TypedDataParameter[], typedData extends TypedData, keyReferences extends {
  [_: string]: unknown;
} | unknown = unknown> = { [key in keyof typedDataParameters]: typedDataParameters[key] extends infer typedDataParameter extends {
  name: string;
  type: unknown;
} ? typedDataParameter['type'] extends keyof typedData & string ? {
  name: typedDataParameter['name'];
  type: 'tuple';
  components: typedDataParameter['type'] extends keyof keyReferences ? Error$1<`Circular reference detected. '${typedDataParameter['type']}' is a circular reference.`> : _TypedDataParametersToAbiParameters<typedData[typedDataParameter['type']], typedData, keyReferences & { [_ in typedDataParameter['type']]: true }>;
} : typedDataParameter['type'] extends `${infer type extends keyof typedData & string}[${infer tail}]` ? {
  name: typedDataParameter['name'];
  type: `tuple[${tail}]`;
  components: type extends keyof keyReferences ? Error$1<`Circular reference detected. '${typedDataParameter['type']}' is a circular reference.`> : _TypedDataParametersToAbiParameters<typedData[type], typedData, keyReferences & { [_ in type]: true }>;
} : typedDataParameter : never };
//#endregion
//#region ../node_modules/.pnpm/ox@0.11.3_typescript@5.9.3_zod@4.3.5/node_modules/ox/_types/core/Hex.d.ts
/** Root type for a Hex string. */
type Hex$2 = `0x${string}`;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/utils.d.ts
type ErrorType$2<name$1 extends string = 'Error'> = Error & {
  name: name$1;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/utils.d.ts
declare const symbol: unique symbol;
/**
 * Creates a branded type of {@link T} with the brand {@link U}.
 *
 * @param T - Type to brand
 * @param U - Label
 * @returns Branded type
 *
 * @example
 * type Result = Branded<string, 'foo'>
 * //   ^? type Result = string & { [symbol]: 'foo' }
 */
type Branded<T$1, U> = T$1 & {
  [symbol]: U;
};
/**
 * Filters out all members of {@link T} that are not {@link P}
 *
 * @param T - Items to filter
 * @param P - Type to filter out
 * @returns Filtered items
 *
 * @example
 * type Result = Filter<['a', 'b', 'c'], 'b'>
 * //   ^? type Result = ['a', 'c']
 */
type Filter$1<T$1 extends readonly unknown[], P$1, Acc extends readonly unknown[] = []> = T$1 extends readonly [infer F, ...infer Rest extends readonly unknown[]] ? [F] extends [P$1] ? Filter$1<Rest, P$1, [...Acc, F]> : Filter$1<Rest, P$1, Acc> : readonly [...Acc];
/**
 * @description Checks if {@link T} can be narrowed further than {@link U}
 * @param T - Type to check
 * @param U - Type to against
 * @example
 * type Result = IsNarrowable<'foo', string>
 * //   ^? true
 */
type IsNarrowable<T$1, U> = IsNever<(T$1 extends U ? true : false) & (U extends T$1 ? false : true)> extends true ? false : true;
/**
 * @description Checks if {@link T} is `never`
 * @param T - Type to check
 * @example
 * type Result = IsNever<never>
 * //   ^? type Result = true
 */
type IsNever<T$1> = [T$1] extends [never] ? true : false;
/**
 * @description Checks if {@link T} is `undefined`
 * @param T - Type to check
 * @example
 * type Result = IsUndefined<undefined>
 * //   ^? type Result = true
 */
type IsUndefined<T$1> = [undefined] extends [T$1] ? true : false;
type MaybePromise<T$1> = T$1 | Promise<T$1>;
/**
 * @description Makes attributes on the type T required if required is true.
 *
 * @example
 * MaybeRequired<{ a: string, b?: number }, true>
 * => { a: string, b: number }
 *
 * MaybeRequired<{ a: string, b?: number }, false>
 * => { a: string, b?: number }
 */
type MaybeRequired<T$1, required extends boolean> = required extends true ? ExactRequired<T$1> : T$1;
/**
 * @description Assigns the properties of U onto T.
 *
 * @example
 * Assign<{ a: string, b: number }, { a: undefined, c: boolean }>
 * => { a: undefined, b: number, c: boolean }
 */
type Assign<T$1, U> = Assign_<T$1, U> & U;
type Assign_<T$1, U> = { [K in keyof T$1 as K extends keyof U ? U[K] extends void ? never : K : K]: K extends keyof U ? U[K] : T$1[K] };
type NoInfer<type$1> = [type$1][type$1 extends any ? 0 : never];
/** Strict version of built-in Omit type */
type Omit$1<type$1, keys extends keyof type$1> = Pick<type$1, Exclude<keyof type$1, keys>>;
/**
 * @description Creates a type that is a partial of T, but with the required keys K.
 *
 * @example
 * PartialBy<{ a: string, b: number }, 'a'>
 * => { a?: string, b: number }
 */
type PartialBy<T$1, K$1 extends keyof T$1> = Omit$1<T$1, K$1> & ExactPartial$1<Pick<T$1, K$1>>;
/**
 * @description Combines members of an intersection into a readable type.
 *
 * @see {@link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg}
 * @example
 * Prettify<{ a: string } & { b: string } & { c: number, d: bigint }>
 * => { a: string, b: string, c: number, d: bigint }
 */
type Prettify<T$1> = { [K in keyof T$1]: T$1[K] } & {};
/**
 * @description Creates a type that is T with the required keys K.
 *
 * @example
 * RequiredBy<{ a?: string, b: number }, 'a'>
 * => { a: string, b: number }
 */
type RequiredBy<T$1, K$1 extends keyof T$1> = Omit$1<T$1, K$1> & ExactRequired<Pick<T$1, K$1>>;
/**
 * @description Returns truthy if `array` contains `value`.
 *
 * @example
 * Some<[1, 2, 3], 2>
 * => true
 */
type Some<array extends readonly unknown[], value$1> = array extends readonly [value$1, ...unknown[]] ? true : array extends readonly [unknown, ...infer rest] ? Some<rest, value$1> : false;
type UnionToTuple<union, last = LastInUnion<union>> = [union] extends [never] ? [] : [...UnionToTuple<Exclude<union, last>>, last];
type LastInUnion<U> = UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends ((x: infer l) => 0) ? l : never;
type UnionToIntersection<union> = (union extends unknown ? (arg: union) => 0 : never) extends ((arg: infer i) => 0) ? i : never;
type IsUnion<union, union2 = union> = union extends union2 ? ([union2] extends [union] ? false : true) : never;
type MaybePartial<type$1, enabled extends boolean | undefined> = enabled extends true ? Prettify<ExactPartial$1<type$1>> : type$1;
type ExactPartial$1<type$1> = { [key in keyof type$1]?: type$1[key] | undefined };
type ExactRequired<type$1> = { [P in keyof type$1]-?: Exclude<type$1[P], undefined> };
type OneOf$1<union extends object, fallback extends object | undefined = undefined, keys extends KeyofUnion$1<union> = KeyofUnion$1<union>> = union extends infer item ? Prettify<item & { [key in Exclude<keys, keyof item>]?: fallback extends object ? key extends keyof fallback ? fallback[key] : undefined : undefined }> : never;
type KeyofUnion$1<type$1> = type$1 extends type$1 ? keyof type$1 : never;
/**
 * Loose version of {@link Omit}
 * @internal
 */
type LooseOmit$1<type$1, keys extends string> = Pick<type$1, Exclude<keyof type$1, keys>>;
type UnionEvaluate<type$1> = type$1 extends object ? Prettify<type$1> : type$1;
type UnionLooseOmit<type$1, keys extends string> = type$1 extends any ? LooseOmit$1<type$1, keys> : never;
/**
 * @description Construct a type with the properties of union type T except for those in type K.
 * @example
 * type Result = UnionOmit<{ a: string, b: number } | { a: string, b: undefined, c: number }, 'a'>
 * => { b: number } | { b: undefined, c: number }
 */
type UnionOmit<type$1, keys extends keyof type$1> = type$1 extends any ? Omit$1<type$1, keys> : never;
/**
 * @description Creates a type that is a partial of T, but with the required keys K.
 *
 * @example
 * PartialBy<{ a: string, b: number } | { a: string, b: undefined, c: number }, 'a'>
 * => { a?: string, b: number } | { a?: string, b: undefined, c: number }
 */
type UnionPartialBy<T$1, K$1 extends keyof T$1> = T$1 extends any ? PartialBy<T$1, K$1> : never;
/**
 * @description Creates a type that is T with the required keys K.
 *
 * @example
 * RequiredBy<{ a?: string, b: number } | { a?: string, c?: number }, 'a'>
 * => { a: string, b: number } | { a: string, c?: number }
 */
type UnionRequiredBy<T$1, K$1 extends keyof T$1> = T$1 extends any ? RequiredBy<T$1, K$1> : never;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/account.d.ts
type DeriveAccount<account$1 extends Account$1 | undefined, accountOverride extends Account$1 | Address$2 | undefined> = accountOverride extends Account$1 | Address$2 ? accountOverride : account$1;
type GetAccountParameter<account$1 extends Account$1 | undefined = Account$1 | undefined, accountOverride extends Account$1 | Address$2 | undefined = Account$1 | Address$2, required extends boolean = true, nullish extends boolean = false> = MaybeRequired<{
  account?: accountOverride | Account$1 | Address$2 | (nullish extends true ? null : never) | undefined;
}, IsUndefined<account$1> extends true ? required extends true ? true : false : false>;
type ParseAccount<accountOrAddress extends Account$1 | Address$2 | null | undefined = Account$1 | Address$2 | null | undefined> = accountOrAddress extends Address$2 ? Prettify<JsonRpcAccount<accountOrAddress>> : accountOrAddress;
//#endregion
//#region ../node_modules/.pnpm/ox@0.11.3_typescript@5.9.3_zod@4.3.5/node_modules/ox/_types/core/Address.d.ts
/** Root type for Address. */
type Address$3 = Address$2;
//#endregion
//#region ../node_modules/.pnpm/ox@0.11.3_typescript@5.9.3_zod@4.3.5/node_modules/ox/_types/core/Withdrawal.d.ts
/** A Withdrawal as defined in the [Execution API specification](https://github.com/ethereum/execution-apis/blob/main/src/schemas/withdrawal.yaml). */
type Withdrawal$1<bigintType = bigint, numberType = number> = {
  address: Hex$2;
  amount: bigintType;
  index: numberType;
  validatorIndex: numberType;
};
//#endregion
//#region ../node_modules/.pnpm/ox@0.11.3_typescript@5.9.3_zod@4.3.5/node_modules/ox/_types/core/BlockOverrides.d.ts
/**
 * Block overrides.
 */
type BlockOverrides<bigintType = bigint, numberType = number> = {
  /** Base fee per gas. */
  baseFeePerGas?: bigintType | undefined;
  /** Blob base fee. */
  blobBaseFee?: bigintType | undefined;
  /** Fee recipient (also known as coinbase). */
  feeRecipient?: Address$3 | undefined;
  /** Gas limit. */
  gasLimit?: bigintType | undefined;
  /** Block number. */
  number?: bigintType | undefined;
  /** The previous value of randomness beacon. */
  prevRandao?: bigintType | undefined;
  /** Block timestamp. */
  time?: bigintType | undefined;
  /** Withdrawals made by validators. */
  withdrawals?: Withdrawal$1<bigintType, numberType>[] | undefined;
};
/**
 * RPC block overrides.
 */
type Rpc = BlockOverrides<Hex$2, Hex$2>;
//#endregion
//#region ../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.d.ts
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
declare class EventEmitter<EventTypes$1 extends EventEmitter.ValidEventTypes = string | symbol, Context extends any = any> {
  static prefixed: string | boolean;

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  eventNames(): Array<EventEmitter.EventNames<EventTypes$1>>;

  /**
   * Return the listeners registered for a given event.
   */
  listeners<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1): Array<EventEmitter.EventListener<EventTypes$1, T$1>>;

  /**
   * Return the number of listeners listening to a given event.
   */
  listenerCount(event: EventEmitter.EventNames<EventTypes$1>): number;

  /**
   * Calls each of the listeners registered for a given event.
   */
  emit<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1, ...args: EventEmitter.EventArgs<EventTypes$1, T$1>): boolean;

  /**
   * Add a listener for a given event.
   */
  on<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1, fn: EventEmitter.EventListener<EventTypes$1, T$1>, context?: Context): this;
  addListener<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1, fn: EventEmitter.EventListener<EventTypes$1, T$1>, context?: Context): this;

  /**
   * Add a one-time listener for a given event.
   */
  once<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1, fn: EventEmitter.EventListener<EventTypes$1, T$1>, context?: Context): this;

  /**
   * Remove the listeners of a given event.
   */
  removeListener<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1, fn?: EventEmitter.EventListener<EventTypes$1, T$1>, context?: Context, once?: boolean): this;
  off<T$1 extends EventEmitter.EventNames<EventTypes$1>>(event: T$1, fn?: EventEmitter.EventListener<EventTypes$1, T$1>, context?: Context, once?: boolean): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: EventEmitter.EventNames<EventTypes$1>): this;
}
declare namespace EventEmitter {
  export interface ListenerFn<Args extends any[] = any[]> {
    (...args: Args): void;
  }
  export interface EventEmitterStatic {
    new <EventTypes$1 extends ValidEventTypes = string | symbol, Context = any>(): EventEmitter<EventTypes$1, Context>;
  }

  /**
   * `object` should be in either of the following forms:
   * ```
   * interface EventTypes {
   *   'event-with-parameters': any[]
   *   'event-with-example-handler': (...args: any[]) => void
   * }
   * ```
   */
  export type ValidEventTypes = string | symbol | object;
  export type EventNames<T$1 extends ValidEventTypes> = T$1 extends string | symbol ? T$1 : keyof T$1;
  export type ArgumentMap<T$1 extends object> = { [K in keyof T$1]: T$1[K$1] extends ((...args: any[]) => void) ? Parameters<T$1[K$1]> : T$1[K$1] extends any[] ? T$1[K$1] : any[] };
  export type EventListener<T$1 extends ValidEventTypes, K$1 extends EventNames<T$1>> = T$1 extends string | symbol ? (...args: any[]) => void : (...args: ArgumentMap<Exclude<T$1, string | symbol>>[Extract<K$1, keyof T$1>]) => void;
  export type EventArgs<T$1 extends ValidEventTypes, K$1 extends EventNames<T$1>> = Parameters<EventListener<T$1, K$1>>;
  export const EventEmitter: EventEmitterStatic;
}
//#endregion
//#region ../node_modules/.pnpm/ox@0.11.3_typescript@5.9.3_zod@4.3.5/node_modules/ox/_types/core/RpcResponse.d.ts
/** JSON-RPC error object as per the [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification#error_object). */
type ErrorObject = {
  code: number;
  message: string;
  data?: unknown | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/misc.d.ts
type ByteArray = Uint8Array;
type Hex$1 = `0x${string}`;
type Hash$1 = `0x${string}`;
type LogTopic = Hex$1 | Hex$1[] | null;
type SignableMessage = string | {
  /** Raw data representation of the message. */
  raw: Hex$1 | ByteArray;
};
type SignatureLegacy<bigintType = bigint> = {
  r: Hex$1;
  s: Hex$1;
  v: bigintType;
};
type Signature$1<numberType = number, bigintType = bigint> = OneOf$1<SignatureLegacy | {
  r: Hex$1;
  s: Hex$1;
  /** @deprecated use `yParity`. */
  v: bigintType;
  yParity?: numberType | undefined;
} | {
  r: Hex$1;
  s: Hex$1;
  /** @deprecated use `yParity`. */
  v?: bigintType | undefined;
  yParity: numberType;
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/authorization.d.ts
type Authorization<uint32 = number, signed$1 extends boolean = false> = {
  /** Address of the contract to delegate to. */
  address: Address$2;
  /** Chain ID. */
  chainId: uint32;
  /** Nonce of the EOA to delegate to. */
  nonce: uint32;
} & (signed$1 extends true ? Signature$1<uint32> : ExactPartial$1<Signature$1<uint32>>);
type AuthorizationList<uint32 = number, signed$1 extends boolean = false> = readonly Authorization<uint32, signed$1>[];
type AuthorizationRequest<uint32 = number> = OneOf$1<{
  /** Address of the contract to delegate to. */
  address: Address$2;
} | {
  /**
   * Address of the contract to delegate to.
   * @alias `address`
   */
  contractAddress: Address$2;
}> & {
  /** Chain ID. */
  chainId: uint32;
  /** Nonce of the EOA to delegate to. */
  nonce: uint32;
};
type SignedAuthorization<uint32 = number> = Authorization<uint32, true>;
type SignedAuthorizationList<uint32 = number> = readonly SignedAuthorization<uint32>[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/eip4844.d.ts
type BlobSidecar<type$1 extends Hex$1 | ByteArray = Hex$1 | ByteArray> = {
  /** The blob associated with the transaction. */
  blob: type$1;
  /** The KZG commitment corresponding to this blob. */
  commitment: type$1;
  /** The KZG proof corresponding to this blob and commitment. */
  proof: type$1;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/fee.d.ts
type FeeHistory<quantity = bigint> = {
  /**
   * An array of block base fees per gas (in wei). This includes the next block after
   * the newest of the returned range, because this value can be derived from the newest block.
   * Zeroes are returned for pre-EIP-1559 blocks. */
  baseFeePerGas: quantity[];
  /** An array of block gas used ratios. These are calculated as the ratio of gasUsed and gasLimit. */
  gasUsedRatio: number[];
  /** Lowest number block of the returned range. */
  oldestBlock: quantity;
  /** An array of effective priority fees (in wei) per gas data points from a single block. All zeroes are returned if the block is empty. */
  reward?: quantity[][] | undefined;
};
type FeeValuesLegacy<quantity = bigint> = {
  /** Base fee per gas. */
  gasPrice: quantity;
  maxFeePerBlobGas?: undefined;
  maxFeePerGas?: undefined;
  maxPriorityFeePerGas?: undefined;
};
type FeeValuesEIP1559<quantity = bigint> = {
  gasPrice?: undefined;
  maxFeePerBlobGas?: undefined;
  /** Total fee per gas in wei (gasPrice/baseFeePerGas + maxPriorityFeePerGas). */
  maxFeePerGas: quantity;
  /** Max priority fee per gas (in wei). */
  maxPriorityFeePerGas: quantity;
};
type FeeValuesEIP4844<quantity = bigint> = {
  gasPrice?: undefined;
  /** Maximum total fee per gas sender is willing to pay for blob gas (in wei). */
  maxFeePerBlobGas: quantity;
  /** Total fee per gas in wei (gasPrice/baseFeePerGas + maxPriorityFeePerGas). */
  maxFeePerGas: quantity;
  /** Max priority fee per gas (in wei). */
  maxPriorityFeePerGas: quantity;
};
type FeeValuesType = 'legacy' | 'eip1559' | 'eip4844';
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/kzg.d.ts
type Kzg = {
  /**
   * Convert a blob to a KZG commitment.
   */
  blobToKzgCommitment(blob: ByteArray): ByteArray;
  /**
   * Given a blob, return the KZG proof that is used to verify it against the
   * commitment.
   */
  computeBlobKzgProof(blob: ByteArray, commitment: ByteArray): ByteArray;
};
type GetTransactionRequestKzgParameter<request$1 extends unknown | undefined = undefined> = MaybeRequired<{
  /** KZG implementation */
  kzg?: Kzg | undefined;
}, request$1 extends {
  account: LocalAccount<string, Address$2>;
  blobs: TransactionRequestEIP4844['blobs'];
} ? true : false>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/contract.d.ts
type ContractFunctionName<abi$1 extends Abi | readonly unknown[] = Abi, mutability extends AbiStateMutability = AbiStateMutability> = ExtractAbiFunctionNames<abi$1 extends Abi ? abi$1 : Abi, mutability> extends infer functionName extends string ? [functionName] extends [never] ? string : functionName : string;
type ContractErrorName<abi$1 extends Abi | readonly unknown[] = Abi> = ExtractAbiErrorNames<abi$1 extends Abi ? abi$1 : Abi> extends infer errorName extends string ? [errorName] extends [never] ? string : errorName : string;
type ContractEventName<abi$1 extends Abi | readonly unknown[] = Abi> = ExtractAbiEventNames<abi$1 extends Abi ? abi$1 : Abi> extends infer eventName extends string ? [eventName] extends [never] ? string : eventName : string;
type ContractFunctionArgs<abi$1 extends Abi | readonly unknown[] = Abi, mutability extends AbiStateMutability = AbiStateMutability, functionName$1 extends ContractFunctionName<abi$1, mutability> = ContractFunctionName<abi$1, mutability>> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<abi$1 extends Abi ? abi$1 : Abi, functionName$1, mutability>['inputs'], 'inputs', true> extends infer args ? [args] extends [never] ? readonly unknown[] : args : readonly unknown[];
type ContractConstructorArgs<abi$1 extends Abi | readonly unknown[] = Abi> = AbiParametersToPrimitiveTypes<Extract<(abi$1 extends Abi ? abi$1 : Abi)[number], {
  type: 'constructor';
}>['inputs'], 'inputs', true> extends infer args ? [args] extends [never] ? readonly unknown[] : args : readonly unknown[];
type ContractErrorArgs<abi$1 extends Abi | readonly unknown[] = Abi, errorName$1 extends ContractErrorName<abi$1> = ContractErrorName<abi$1>> = AbiParametersToPrimitiveTypes<ExtractAbiError<abi$1 extends Abi ? abi$1 : Abi, errorName$1>['inputs'], 'inputs', true> extends infer args ? [args] extends [never] ? readonly unknown[] : args : readonly unknown[];
type ContractEventArgs<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> = ContractEventName<abi$1>> = AbiEventParametersToPrimitiveTypes<ExtractAbiEvent<abi$1 extends Abi ? abi$1 : Abi, eventName$1>['inputs']> extends infer args ? [args] extends [never] ? readonly unknown[] | Record<string, unknown> : args : readonly unknown[] | Record<string, unknown>;
type Widen<type$1> = ([unknown] extends [type$1] ? unknown : never) | (type$1 extends Function ? type$1 : never) | (type$1 extends ResolvedRegister$1['BigIntType'] ? bigint : never) | (type$1 extends boolean ? boolean : never) | (type$1 extends ResolvedRegister$1['IntType'] ? number : never) | (type$1 extends string ? type$1 extends ResolvedRegister$1['AddressType'] ? ResolvedRegister$1['AddressType'] : type$1 extends ResolvedRegister$1['BytesType']['inputs'] ? ResolvedRegister$1['BytesType'] : string : never) | (type$1 extends readonly [] ? readonly [] : never) | (type$1 extends Record<string, unknown> ? { [K in keyof type$1]: Widen<type$1[K]> } : never) | (type$1 extends {
  length: number;
} ? { [K in keyof type$1]: Widen<type$1[K]> } extends infer Val extends readonly unknown[] ? readonly [...Val] : never : never);
type UnionWiden<type$1> = type$1 extends any ? Widen<type$1> : never;
type ExtractAbiFunctionForArgs<abi$1 extends Abi, mutability extends AbiStateMutability, functionName$1 extends ContractFunctionName<abi$1, mutability>, args$1 extends ContractFunctionArgs<abi$1, mutability, functionName$1>> = ExtractAbiFunction<abi$1, functionName$1, mutability> extends infer abiFunction extends AbiFunction ? IsUnion<abiFunction> extends true ? UnionToTuple<abiFunction> extends infer abiFunctions extends readonly AbiFunction[] ? { [k in keyof abiFunctions]: CheckArgs<abiFunctions[k], args$1> }[number] : never : abiFunction : never;
type CheckArgs<abiFunction$1 extends AbiFunction, args$1, targetArgs extends AbiParametersToPrimitiveTypes<abiFunction$1['inputs'], 'inputs', true> = AbiParametersToPrimitiveTypes<abiFunction$1['inputs'], 'inputs', true>> = (readonly [] extends args$1 ? readonly [] : args$1) extends targetArgs ? abiFunction$1 : never;
type ContractFunctionParameters<abi$1 extends Abi | readonly unknown[] = Abi, mutability extends AbiStateMutability = AbiStateMutability, functionName$1 extends ContractFunctionName<abi$1, mutability> = ContractFunctionName<abi$1, mutability>, args$1 extends ContractFunctionArgs<abi$1, mutability, functionName$1> = ContractFunctionArgs<abi$1, mutability, functionName$1>, deployless extends boolean = false, allFunctionNames$1 = ContractFunctionName<abi$1, mutability>, allArgs = ContractFunctionArgs<abi$1, mutability, functionName$1>, abiFunction$1 = ExtractAbiFunction<abi$1 extends Abi ? abi$1 : Abi, functionName$1, mutability>> = {
  abi: abi$1;
  functionName: allFunctionNames$1 | (functionName$1 extends allFunctionNames$1 ? functionName$1 : never);
} & (readonly [] extends allArgs ? {
  args?: allArgs | (abi$1 extends Abi ? Abi extends abi$1 ? never : UnionWiden<IsUnion<abiFunction$1> extends true ? args$1 : allArgs> : never) | undefined;
} : {
  args: IsUnion<abiFunction$1> extends true ? args$1 : allArgs;
}) & (deployless extends true ? {
  address?: undefined;
  code: Hex$1;
} : {
  address: Address$2;
});
type ContractFunctionReturnType<abi$1 extends Abi | readonly unknown[] = Abi, mutability extends AbiStateMutability = AbiStateMutability, functionName$1 extends ContractFunctionName<abi$1, mutability> = ContractFunctionName<abi$1, mutability>, args$1 extends ContractFunctionArgs<abi$1, mutability, functionName$1> = ContractFunctionArgs<abi$1, mutability, functionName$1>> = abi$1 extends Abi ? Abi extends abi$1 ? unknown : AbiParametersToPrimitiveTypes<ExtractAbiFunctionForArgs<abi$1, mutability, functionName$1, args$1>['outputs'], 'outputs', true> extends infer types ? types extends readonly [] ? void : types extends readonly [infer type] ? type : types : never : unknown;
type AbiItem = Abi[number];
type GetValue<abi$1 extends Abi | readonly unknown[], functionName$1 extends string, valueType = TransactionRequest['value'], abiFunction$1 extends AbiFunction = (abi$1 extends Abi ? ExtractAbiFunction<abi$1, functionName$1> : AbiFunction), _Narrowable extends boolean = IsNarrowable<abi$1, Abi>> = _Narrowable extends true ? abiFunction$1['stateMutability'] extends 'payable' ? {
  value?: NoInfer<valueType> | undefined;
} : abiFunction$1['payable'] extends true ? {
  value?: NoInfer<valueType> | undefined;
} : {
  value?: undefined;
} : {
  value?: NoInfer<valueType> | undefined;
};
type MaybeAbiEventName<abiEvent extends AbiEvent | undefined> = abiEvent extends AbiEvent ? abiEvent['name'] : undefined;
type MaybeExtractEventArgsFromAbi<abi$1 extends Abi | readonly unknown[] | undefined, eventName$1 extends string | undefined> = abi$1 extends Abi | readonly unknown[] ? eventName$1 extends string ? GetEventArgs<abi$1, eventName$1> : undefined : undefined;
type GetEventArgs<abi$1 extends Abi | readonly unknown[], eventName$1 extends string, config$1 extends EventParameterOptions = DefaultEventParameterOptions, abiEvent extends AbiEvent & {
  type: 'event';
} = (abi$1 extends Abi ? ExtractAbiEvent<abi$1, eventName$1> : AbiEvent & {
  type: 'event';
}), args$1 = AbiEventParametersToPrimitiveTypes<abiEvent['inputs'], config$1>> = args$1 extends Record<PropertyKey, never> ? readonly unknown[] | Record<string, unknown> : args$1;
type EventParameterOptions = {
  EnableUnion?: boolean;
  IndexedOnly?: boolean;
  Required?: boolean;
};
type DefaultEventParameterOptions = {
  EnableUnion: true;
  IndexedOnly: true;
  Required: false;
};
type AbiEventParametersToPrimitiveTypes<abiParameters extends readonly AbiParameter[], _options extends EventParameterOptions = DefaultEventParameterOptions> = abiParameters extends readonly [] ? readonly [] : Filter$1<abiParameters, _options['IndexedOnly'] extends true ? {
  indexed: true;
} : object> extends infer Filtered extends readonly AbiParameter[] ? _HasUnnamedAbiParameter<Filtered> extends true ? readonly [...{ [K in keyof Filtered]: AbiEventParameterToPrimitiveType<Filtered[K], _options> }] | (_options['Required'] extends true ? never : Filtered extends readonly [...infer Head extends readonly AbiParameter[], infer _] ? AbiEventParametersToPrimitiveTypes<readonly [...{ [K in keyof Head]: Omit<Head[K], 'name'> }], _options> : never) : { [Parameter in Filtered[number] as Parameter extends {
  name: infer Name extends string;
} ? Name : never]?: AbiEventParameterToPrimitiveType<Parameter, _options> | undefined } extends infer Mapped ? Prettify<MaybeRequired<Mapped, _options['Required'] extends boolean ? _options['Required'] : false>> : never : never;
type _HasUnnamedAbiParameter<abiParameters extends readonly AbiParameter[]> = abiParameters extends readonly [infer Head extends AbiParameter, ...infer Tail extends readonly AbiParameter[]] ? Head extends {
  name: string;
} ? Head['name'] extends '' ? true : _HasUnnamedAbiParameter<Tail> : true : false;
/**
 * @internal
 */
type LogTopicType<primitiveType = Hex$1, topic extends LogTopic = LogTopic> = topic extends Hex$1 ? primitiveType : topic extends Hex$1[] ? primitiveType[] : topic extends null ? null : never;
/**
 * @internal
 */
type AbiEventParameterToPrimitiveType<abiParameter extends AbiParameter, _options extends EventParameterOptions = DefaultEventParameterOptions, _type = AbiParameterToPrimitiveType<abiParameter>> = _options['EnableUnion'] extends true ? LogTopicType<_type> : _type;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/log.d.ts
type Log<quantity = bigint, index$1 = number, pending extends boolean = boolean, abiEvent extends AbiEvent | undefined = undefined, strict$1 extends boolean | undefined = undefined, abi$1 extends Abi | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), eventName$1 extends string | undefined = (abiEvent extends AbiEvent ? abiEvent['name'] : undefined)> = {
  /** The address from which this log originated */
  address: Address$2;
  /** Hash of block containing this log or `null` if pending */
  blockHash: pending extends true ? null : Hash$1;
  /** Number of block containing this log or `null` if pending */
  blockNumber: pending extends true ? null : quantity;
  /** Timestamp of block containing this log or `null` if pending */
  blockTimestamp?: (pending extends true ? null : quantity) | undefined;
  /** Contains the non-indexed arguments of the log */
  data: Hex$1;
  /** Index of this log within its block or `null` if pending */
  logIndex: pending extends true ? null : index$1;
  /** Hash of the transaction that created this log or `null` if pending */
  transactionHash: pending extends true ? null : Hash$1;
  /** Index of the transaction that created this log or `null` if pending */
  transactionIndex: pending extends true ? null : index$1;
  /** `true` if this filter has been destroyed and is invalid */
  removed: boolean;
} & GetInferredLogValues<abiEvent, abi$1, eventName$1, strict$1>;
type Topics<head$1 extends AbiEvent['inputs'], base = [Hex$1]> = head$1 extends readonly [infer _Head, ...infer Tail extends AbiEvent['inputs']] ? _Head extends {
  indexed: true;
} ? [Hex$1, ...Topics<Tail>] : Topics<Tail> : base;
type GetTopics<abiEvent extends AbiEvent | undefined = undefined, abi$1 extends Abi | readonly unknown[] = [abiEvent], eventName$1 extends string | undefined = (abiEvent extends AbiEvent ? abiEvent['name'] : undefined), _AbiEvent extends AbiEvent | undefined = (abi$1 extends Abi ? eventName$1 extends string ? ExtractAbiEvent<abi$1, eventName$1> : undefined : undefined), _Args = (_AbiEvent extends AbiEvent ? AbiEventParametersToPrimitiveTypes<_AbiEvent['inputs']> : never), _FailedToParseArgs = ([_Args] extends [never] ? true : false) | (readonly unknown[] extends _Args ? true : false)> = true extends _FailedToParseArgs ? [Hex$1, ...Hex$1[]] | [] : abiEvent extends AbiEvent ? Topics<abiEvent['inputs']> : _AbiEvent extends AbiEvent ? Topics<_AbiEvent['inputs']> : [Hex$1, ...Hex$1[]] | [];
type GetInferredLogValues<abiEvent extends AbiEvent | undefined = undefined, abi$1 extends Abi | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), eventName$1 extends string | undefined = (abiEvent extends AbiEvent ? abiEvent['name'] : undefined), strict$1 extends boolean | undefined = undefined, _EventNames extends string = (abi$1 extends Abi ? Abi extends abi$1 ? string : ExtractAbiEventNames<abi$1> : string)> = abi$1 extends Abi ? eventName$1 extends string ? {
  args: GetEventArgs<abi$1, eventName$1, {
    EnableUnion: false;
    IndexedOnly: false;
    Required: strict$1 extends boolean ? strict$1 : false;
  }>;
  /** The event name decoded from `topics`. */
  eventName: eventName$1;
  /** List of order-dependent topics */
  topics: GetTopics<abiEvent, abi$1, eventName$1>;
} : { [name in _EventNames]: {
  args: GetEventArgs<abi$1, name, {
    EnableUnion: false;
    IndexedOnly: false;
    Required: strict$1 extends boolean ? strict$1 : false;
  }>;
  /** The event name decoded from `topics`. */
  eventName: name;
  /** List of order-dependent topics */
  topics: GetTopics<abiEvent, abi$1, name>;
} }[_EventNames] : {
  topics: [Hex$1, ...Hex$1[]] | [];
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/transaction.d.ts
type AccessList = readonly {
  address: Address$2;
  storageKeys: readonly Hex$1[];
}[];
type TransactionType$2 = 'legacy' | 'eip1559' | 'eip2930' | 'eip4844' | 'eip7702' | (string & {});
type TransactionReceipt$1<quantity = bigint, index$1 = number, status$1 = 'success' | 'reverted', type$1 = TransactionType$2> = {
  /** The actual value per gas deducted from the sender's account for blob gas. Only specified for blob transactions as defined by EIP-4844. */
  blobGasPrice?: quantity | undefined;
  /** The amount of blob gas used. Only specified for blob transactions as defined by EIP-4844. */
  blobGasUsed?: quantity | undefined;
  /** Hash of block containing this transaction */
  blockHash: Hash$1;
  /** Number of block containing this transaction */
  blockNumber: quantity;
  /** Address of new contract or `null` if no contract was created */
  contractAddress: Address$2 | null | undefined;
  /** Gas used by this and all preceding transactions in this block */
  cumulativeGasUsed: quantity;
  /** Pre-London, it is equal to the transaction's gasPrice. Post-London, it is equal to the actual gas price paid for inclusion. */
  effectiveGasPrice: quantity;
  /** Transaction sender */
  from: Address$2;
  /** Gas used by this transaction */
  gasUsed: quantity;
  /** List of log objects generated by this transaction */
  logs: Log<quantity, index$1, false>[];
  /** Logs bloom filter */
  logsBloom: Hex$1;
  /** The post-transaction state root. Only specified for transactions included before the Byzantium upgrade. */
  root?: Hash$1 | undefined;
  /** `success` if this transaction was successful or `reverted` if it failed */
  status: status$1;
  /** Transaction recipient or `null` if deploying a contract */
  to: Address$2 | null;
  /** Hash of this transaction */
  transactionHash: Hash$1;
  /** Index of this transaction in the block */
  transactionIndex: index$1;
  /** Transaction type */
  type: type$1;
};
type TransactionBase<quantity = bigint, index$1 = number, isPending extends boolean = boolean> = {
  /** Hash of block containing this transaction or `null` if pending */
  blockHash: isPending extends true ? null : Hash$1;
  /** Number of block containing this transaction or `null` if pending */
  blockNumber: isPending extends true ? null : quantity;
  /** Transaction sender */
  from: Address$2;
  /** Gas provided for transaction execution */
  gas: quantity;
  /** Hash of this transaction */
  hash: Hash$1;
  /** Contract code or a hashed method call */
  input: Hex$1;
  /** Unique number identifying this transaction */
  nonce: index$1;
  /** ECDSA signature r */
  r: Hex$1;
  /** ECDSA signature s */
  s: Hex$1;
  /** Transaction recipient or `null` if deploying a contract */
  to: Address$2 | null;
  /** Index of this transaction in the block or `null` if pending */
  transactionIndex: isPending extends true ? null : index$1;
  /** The type represented as hex. */
  typeHex: Hex$1 | null;
  /** ECDSA recovery ID */
  v: quantity;
  /** Value in wei sent with this transaction */
  value: quantity;
  /** The parity of the y-value of the secp256k1 signature. */
  yParity: index$1;
};
type TransactionLegacy<quantity = bigint, index$1 = number, isPending extends boolean = boolean, type$1 = 'legacy'> = Omit$1<TransactionBase<quantity, index$1, isPending>, 'yParity'> & {
  /** EIP-2930 Access List. */
  accessList?: undefined;
  authorizationList?: undefined;
  blobVersionedHashes?: undefined;
  /** Chain ID that this transaction is valid on. */
  chainId?: index$1 | undefined;
  yParity?: undefined;
  type: type$1;
} & FeeValuesLegacy<quantity>;
type TransactionEIP2930<quantity = bigint, index$1 = number, isPending extends boolean = boolean, type$1 = 'eip2930'> = TransactionBase<quantity, index$1, isPending> & {
  /** EIP-2930 Access List. */
  accessList: AccessList;
  authorizationList?: undefined;
  blobVersionedHashes?: undefined;
  /** Chain ID that this transaction is valid on. */
  chainId: index$1;
  type: type$1;
} & FeeValuesLegacy<quantity>;
type TransactionEIP1559<quantity = bigint, index$1 = number, isPending extends boolean = boolean, type$1 = 'eip1559'> = TransactionBase<quantity, index$1, isPending> & {
  /** EIP-2930 Access List. */
  accessList: AccessList;
  authorizationList?: undefined;
  blobVersionedHashes?: undefined;
  /** Chain ID that this transaction is valid on. */
  chainId: index$1;
  type: type$1;
} & FeeValuesEIP1559<quantity>;
type TransactionEIP4844<quantity = bigint, index$1 = number, isPending extends boolean = boolean, type$1 = 'eip4844'> = TransactionBase<quantity, index$1, isPending> & {
  /** EIP-2930 Access List. */
  accessList: AccessList;
  authorizationList?: undefined;
  /** List of versioned blob hashes associated with the transaction's blobs. */
  blobVersionedHashes: readonly Hex$1[];
  /** Chain ID that this transaction is valid on. */
  chainId: index$1;
  type: type$1;
} & FeeValuesEIP4844<quantity>;
type TransactionEIP7702<quantity = bigint, index$1 = number, isPending extends boolean = boolean, type$1 = 'eip7702'> = TransactionBase<quantity, index$1, isPending> & {
  /** EIP-2930 Access List. */
  accessList: AccessList;
  /** Authorization list for the transaction. */
  authorizationList: SignedAuthorizationList;
  blobVersionedHashes?: undefined;
  /** Chain ID that this transaction is valid on. */
  chainId: index$1;
  type: type$1;
} & FeeValuesEIP1559<quantity>;
type Transaction$1<quantity = bigint, index$1 = number, isPending extends boolean = boolean> = OneOf$1<TransactionLegacy<quantity, index$1, isPending> | TransactionEIP2930<quantity, index$1, isPending> | TransactionEIP1559<quantity, index$1, isPending> | TransactionEIP4844<quantity, index$1, isPending> | TransactionEIP7702<quantity, index$1, isPending>>;
type TransactionRequestBase<quantity = bigint, index$1 = number, type$1 = string> = {
  /** Contract code or a hashed method call with encoded args */
  data?: Hex$1 | undefined;
  /** Transaction sender */
  from?: Address$2 | undefined;
  /** Gas provided for transaction execution */
  gas?: quantity | undefined;
  /** Unique number identifying this transaction */
  nonce?: index$1 | undefined;
  /** Transaction recipient */
  to?: Address$2 | null | undefined;
  /** Transaction type */
  type?: type$1 | undefined;
  /** Value in wei sent with this transaction */
  value?: quantity | undefined;
};
type TransactionRequestLegacy<quantity = bigint, index$1 = number, type$1 = 'legacy'> = TransactionRequestBase<quantity, index$1, type$1> & ExactPartial$1<FeeValuesLegacy<quantity>>;
type TransactionRequestEIP2930<quantity = bigint, index$1 = number, type$1 = 'eip2930'> = TransactionRequestBase<quantity, index$1, type$1> & ExactPartial$1<FeeValuesLegacy<quantity>> & {
  accessList?: AccessList | undefined;
};
type TransactionRequestEIP1559<quantity = bigint, index$1 = number, type$1 = 'eip1559'> = TransactionRequestBase<quantity, index$1, type$1> & ExactPartial$1<FeeValuesEIP1559<quantity>> & {
  accessList?: AccessList | undefined;
};
type TransactionRequestEIP4844<quantity = bigint, index$1 = number, type$1 = 'eip4844'> = RequiredBy<TransactionRequestBase<quantity, index$1, type$1>, 'to'> & ExactPartial$1<FeeValuesEIP4844<quantity>> & {
  accessList?: AccessList | undefined;
  sidecars?: readonly BlobSidecar<Hex$1>[] | undefined;
} & OneOf$1<{
  blobs?: readonly Hex$1[] | readonly ByteArray[] | undefined;
  blobVersionedHashes: readonly Hex$1[];
} | {
  blobs: readonly Hex$1[] | readonly ByteArray[];
  blobVersionedHashes?: readonly Hex$1[] | undefined;
  kzg?: Kzg | undefined;
}>;
type TransactionRequestEIP7702<quantity = bigint, index$1 = number, type$1 = 'eip7702'> = TransactionRequestBase<quantity, index$1, type$1> & ExactPartial$1<FeeValuesEIP1559<quantity>> & {
  accessList?: AccessList | undefined;
  authorizationList?: AuthorizationList<index$1, boolean> | undefined;
};
type TransactionRequest<quantity = bigint, index$1 = number> = OneOf$1<TransactionRequestLegacy<quantity, index$1> | TransactionRequestEIP2930<quantity, index$1> | TransactionRequestEIP1559<quantity, index$1> | TransactionRequestEIP4844<quantity, index$1> | TransactionRequestEIP7702<quantity, index$1>>;
type TransactionRequestGeneric<quantity = bigint, index$1 = number> = TransactionRequestBase<quantity, index$1> & {
  accessList?: AccessList | undefined;
  blobs?: readonly Hex$1[] | readonly ByteArray[] | undefined;
  blobVersionedHashes?: readonly Hex$1[] | undefined;
  gasPrice?: quantity | undefined;
  maxFeePerBlobGas?: quantity | undefined;
  maxFeePerGas?: quantity | undefined;
  maxPriorityFeePerGas?: quantity | undefined;
  type?: string | undefined;
};
type TransactionSerializedEIP1559 = `0x02${string}`;
type TransactionSerializedEIP2930 = `0x01${string}`;
type TransactionSerializedEIP4844 = `0x03${string}`;
type TransactionSerializedEIP7702 = `0x04${string}`;
type TransactionSerializedLegacy = Branded<`0x${string}`, 'legacy'>;
type TransactionSerializedGeneric = `0x${string}`;
type TransactionSerialized<type$1 extends TransactionType$2 = TransactionType$2, result = (type$1 extends 'eip1559' ? TransactionSerializedEIP1559 : never) | (type$1 extends 'eip2930' ? TransactionSerializedEIP2930 : never) | (type$1 extends 'eip4844' ? TransactionSerializedEIP4844 : never) | (type$1 extends 'eip7702' ? TransactionSerializedEIP7702 : never) | (type$1 extends 'legacy' ? TransactionSerializedLegacy : never)> = IsNever<result> extends true ? TransactionSerializedGeneric : result;
type TransactionSerializableBase<quantity = bigint, index$1 = number> = Omit$1<TransactionRequestBase<quantity, index$1>, 'from'> & ExactPartial$1<Signature$1>;
type TransactionSerializableLegacy<quantity = bigint, index$1 = number> = TransactionSerializableBase<quantity, index$1> & ExactPartial$1<FeeValuesLegacy<quantity>> & {
  chainId?: number | undefined;
  type?: 'legacy' | undefined;
};
type TransactionSerializableEIP2930<quantity = bigint, index$1 = number> = TransactionSerializableBase<quantity, index$1> & ExactPartial$1<FeeValuesLegacy<quantity>> & {
  accessList?: AccessList | undefined;
  chainId: number;
  type?: 'eip2930' | undefined;
  yParity?: number | undefined;
};
type TransactionSerializableEIP1559<quantity = bigint, index$1 = number> = TransactionSerializableBase<quantity, index$1> & ExactPartial$1<FeeValuesEIP1559<quantity>> & {
  accessList?: AccessList | undefined;
  chainId: number;
  type?: 'eip1559' | undefined;
  yParity?: number | undefined;
};
type TransactionSerializableEIP4844<quantity = bigint, index$1 = number, nullableSidecars extends boolean = boolean> = RequiredBy<TransactionSerializableBase<quantity, index$1>, 'to'> & ExactPartial$1<FeeValuesEIP4844<quantity>> & {
  accessList?: AccessList | undefined;
  chainId: number;
  sidecars?: readonly BlobSidecar<Hex$1>[] | (nullableSidecars extends true ? false : never) | undefined;
  type?: 'eip4844' | undefined;
  yParity?: number | undefined;
} & OneOf$1<{
  blobs?: readonly Hex$1[] | readonly ByteArray[] | undefined;
  blobVersionedHashes: readonly Hex$1[];
} | {
  blobs: readonly Hex$1[] | readonly ByteArray[];
  blobVersionedHashes?: readonly Hex$1[] | undefined;
  kzg: Kzg;
}>;
type TransactionSerializableEIP7702<quantity = bigint, index$1 = number> = TransactionSerializableBase<quantity, index$1> & ExactPartial$1<FeeValuesEIP1559<quantity>> & {
  accessList?: AccessList | undefined;
  authorizationList: SignedAuthorizationList;
  chainId: number;
  type?: 'eip7702' | undefined;
  yParity?: number | undefined;
};
type TransactionSerializable<quantity = bigint, index$1 = number> = OneOf$1<TransactionSerializableLegacy<quantity, index$1> | TransactionSerializableEIP2930<quantity, index$1> | TransactionSerializableEIP1559<quantity, index$1> | TransactionSerializableEIP4844<quantity, index$1> | TransactionSerializableEIP7702<quantity, index$1>>;
type TransactionSerializableGeneric<quantity = bigint, index$1 = number> = TransactionSerializableBase<quantity, index$1> & {
  accessList?: AccessList | undefined;
  authorizationList?: AuthorizationList<index$1, boolean> | undefined;
  blobs?: readonly Hex$1[] | readonly ByteArray[] | undefined;
  blobVersionedHashes?: readonly Hex$1[] | undefined;
  chainId?: number | undefined;
  gasPrice?: quantity | undefined;
  maxFeePerBlobGas?: quantity | undefined;
  maxFeePerGas?: quantity | undefined;
  maxPriorityFeePerGas?: quantity | undefined;
  sidecars?: readonly BlobSidecar<Hex$1>[] | false | undefined;
  type?: string | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/withdrawal.d.ts
type Withdrawal = {
  address: Hex$1;
  amount: Hex$1;
  index: Hex$1;
  validatorIndex: Hex$1;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/block.d.ts
type Block<quantity = bigint, includeTransactions extends boolean = boolean, blockTag$1 extends BlockTag = BlockTag, transaction$1 = Transaction$1<bigint, number, blockTag$1 extends 'pending' ? true : false>> = {
  /** Base fee per gas */
  baseFeePerGas: quantity | null;
  /** Total used blob gas by all transactions in this block */
  blobGasUsed: quantity;
  /** Difficulty for this block */
  difficulty: quantity;
  /** Excess blob gas */
  excessBlobGas: quantity;
  /** "Extra data" field of this block */
  extraData: Hex$1;
  /** Maximum gas allowed in this block */
  gasLimit: quantity;
  /** Total used gas by all transactions in this block */
  gasUsed: quantity;
  /** Block hash or `null` if pending */
  hash: blockTag$1 extends 'pending' ? null : Hash$1;
  /** Logs bloom filter or `null` if pending */
  logsBloom: blockTag$1 extends 'pending' ? null : Hex$1;
  /** Address that received this block’s mining rewards, COINBASE address */
  miner: Address$2;
  /** Unique identifier for the block. */
  mixHash: Hash$1;
  /** Proof-of-work hash or `null` if pending */
  nonce: blockTag$1 extends 'pending' ? null : Hex$1;
  /** Block number or `null` if pending */
  number: blockTag$1 extends 'pending' ? null : quantity;
  /** Root of the parent beacon chain block */
  parentBeaconBlockRoot?: Hex$1 | undefined;
  /** Parent block hash */
  parentHash: Hash$1;
  /** Root of the this block’s receipts trie */
  receiptsRoot: Hex$1;
  sealFields: Hex$1[];
  /** SHA3 of the uncles data in this block */
  sha3Uncles: Hash$1;
  /** Size of this block in bytes */
  size: quantity;
  /** Root of this block’s final state trie */
  stateRoot: Hash$1;
  /** Unix timestamp of when this block was collated */
  timestamp: quantity;
  /** Total difficulty of the chain until this block */
  totalDifficulty: quantity | null;
  /** List of transaction objects or hashes */
  transactions: includeTransactions extends true ? transaction$1[] : Hash$1[];
  /** Root of this block’s transaction trie */
  transactionsRoot: Hash$1;
  /** List of uncle hashes */
  uncles: Hash$1[];
  /** List of withdrawal objects */
  withdrawals?: Withdrawal[] | undefined;
  /** Root of the this block’s withdrawals trie */
  withdrawalsRoot?: Hex$1 | undefined;
};
type BlockIdentifier<quantity = bigint> = {
  /** Whether or not to throw an error if the block is not in the canonical chain as described below. Only allowed in conjunction with the blockHash tag. Defaults to false. */
  requireCanonical?: boolean | undefined;
} & ({
  /** The block in the canonical chain with this number */
  blockNumber: BlockNumber<quantity>;
} | {
  /** The block uniquely identified by this hash. The `blockNumber` and `blockHash` properties are mutually exclusive; exactly one of them must be set. */
  blockHash: Hash$1;
});
/** Represents a block number in the blockchain. */
type BlockNumber<quantity = bigint> = quantity;
/**
 * Specifies a particular block in the blockchain.
 *
 * - `"latest"`: the latest proposed block
 * - `"earliest"`: the earliest/genesis block – lowest numbered block the client has available
 * - `"pending"`: pending state/transactions – next block built by the client on top
 *   of unsafe and containing the set of transactions usually taken from local mempool
 * - `"safe"`: the latest safe head block – the most recent block that is safe from
 *   re-orgs under honest majority and certain synchronicity assumptions
 * - `"finalized"`: the latest finalized block – the most recent crypto-economically secure block;
 *   cannot be re-orged outside of manual intervention driven by community coordination
 *
 * Using `pending`, while allowed, is not advised, as it may lead
 * to internally inconsistent results. Use of `latest` is safe and will not
 * lead to inconsistent results. Depending on the backing RPC networks caching system,
 * the usage of `pending` may lead to inconsistencies as a result of an
 * overly aggressive cache system. This may cause downstream errors/invalid states.
 */
type BlockTag = 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
type Uncle<quantity = bigint, includeTransactions extends boolean = boolean, blockTag$1 extends BlockTag = BlockTag, transaction$1 = Transaction$1<bigint, number, blockTag$1 extends 'pending' ? true : false>> = Block<quantity, includeTransactions, blockTag$1, transaction$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/proof.d.ts
type AccountProof = Hash$1;
type StorageProof<quantity = bigint> = {
  key: Hash$1;
  proof: Hash$1[];
  value: quantity;
};
type Proof<quantity = bigint, index$1 = number> = {
  address: Address$2;
  balance: quantity;
  codeHash: Hash$1;
  nonce: index$1;
  storageHash: Hash$1;
  accountProof: AccountProof[];
  storageProof: StorageProof<quantity>[];
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/rpc.d.ts
type Index = `0x${string}`;
type Quantity = `0x${string}`;
type Status = '0x0' | '0x1';
type TransactionType$3 = '0x0' | '0x1' | '0x2' | '0x3' | '0x4' | (string & {});
type RpcAuthorization = {
  /** Address of the contract to set as code for the Authority. */
  address: Address$2;
  /** Chain ID to authorize. */
  chainId: Hex$1;
  /** Nonce of the Authority to authorize. */
  nonce: Hex$1;
  /** ECDSA r value. */
  r: Hex$1;
  /** ECDSA s value. */
  s: Hex$1;
  /** y parity. */
  yParity: Hex$1;
};
type RpcAuthorizationList = readonly RpcAuthorization[];
type RpcBlock<blockTag$1 extends BlockTag = BlockTag, includeTransactions extends boolean = boolean, transaction$1 = RpcTransaction<blockTag$1 extends 'pending' ? true : false>> = Block<Quantity, includeTransactions, blockTag$1, transaction$1>;
type RpcBlockNumber = BlockNumber<Quantity>;
type RpcBlockIdentifier = BlockIdentifier<Quantity>;
type RpcUncle = Uncle<Quantity>;
type RpcFeeHistory = FeeHistory<Quantity>;
type RpcLog = Log<Quantity, Index>;
type RpcProof = Proof<Quantity, Index>;
type RpcTransactionReceipt = TransactionReceipt$1<Quantity, Index, Status, TransactionType$3>;
type RpcTransactionRequest = OneOf$1<TransactionRequestLegacy<Quantity, Index, '0x0'> | TransactionRequestEIP2930<Quantity, Index, '0x1'> | TransactionRequestEIP1559<Quantity, Index, '0x2'> | TransactionRequestEIP4844<Quantity, Index, '0x3'> | (Omit$1<TransactionRequestEIP7702<Quantity, Index, '0x4'>, 'authorizationList'> & {
  authorizationList?: RpcAuthorizationList | undefined;
})>;
type RpcTransaction<pending extends boolean = boolean> = OneOf$1<Omit$1<TransactionLegacy<Quantity, Index, pending, '0x0'>, 'typeHex'> | PartialBy<Omit$1<TransactionEIP2930<Quantity, Index, pending, '0x1'>, 'typeHex'>, 'yParity'> | PartialBy<Omit$1<TransactionEIP1559<Quantity, Index, pending, '0x2'>, 'typeHex'>, 'yParity'> | PartialBy<Omit$1<TransactionEIP4844<Quantity, Index, pending, '0x3'>, 'typeHex'>, 'yParity'> | PartialBy<Omit$1<TransactionEIP7702<Quantity, Index, pending, '0x4'>, 'authorizationList' | 'typeHex'> & {
  authorizationList?: RpcAuthorizationList | undefined;
}, 'yParity'>>;
/** A key-value mapping of slot and storage values (supposedly 32 bytes each) */
type RpcStateMapping = {
  [slots: Hex$1]: Hex$1;
};
type RpcAccountStateOverride = {
  /** Fake balance to set for the account before executing the call. <32 bytes */
  balance?: Hex$1 | undefined;
  /** Fake nonce to set for the account before executing the call. <8 bytes */
  nonce?: Hex$1 | undefined;
  /** Fake EVM bytecode to inject into the account before executing the call. */
  code?: Hex$1 | undefined;
  /** Fake key-value mapping to override all slots in the account storage before executing the call. */
  state?: RpcStateMapping | undefined;
  /** Fake key-value mapping to override individual slots in the account storage before executing the call. */
  stateDiff?: RpcStateMapping | undefined;
};
type RpcStateOverride = {
  [address: Address$2]: RpcAccountStateOverride;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/account-abstraction/types/entryPointVersion.d.ts
/** @link https://github.com/eth-infinitism/account-abstraction/releases */
type EntryPointVersion = '0.6' | '0.7' | '0.8' | '0.9';
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/account-abstraction/types/userOperation.d.ts
/** @link https://eips.ethereum.org/EIPS/eip-4337#-eth_estimateuseroperationgas */
type EstimateUserOperationGasReturnType<entryPointVersion extends EntryPointVersion = EntryPointVersion, uint256 = bigint> = OneOf$1<(entryPointVersion extends '0.9' ? {
  preVerificationGas: uint256;
  verificationGasLimit: uint256;
  callGasLimit: uint256;
  paymasterVerificationGasLimit?: uint256 | undefined;
  paymasterPostOpGasLimit?: uint256 | undefined;
} : never) | (entryPointVersion extends '0.8' ? {
  preVerificationGas: uint256;
  verificationGasLimit: uint256;
  callGasLimit: uint256;
  paymasterVerificationGasLimit?: uint256 | undefined;
  paymasterPostOpGasLimit?: uint256 | undefined;
} : never) | (entryPointVersion extends '0.7' ? {
  preVerificationGas: uint256;
  verificationGasLimit: uint256;
  callGasLimit: uint256;
  paymasterVerificationGasLimit?: uint256 | undefined;
  paymasterPostOpGasLimit?: uint256 | undefined;
} : never) | (entryPointVersion extends '0.6' ? {
  preVerificationGas: uint256;
  verificationGasLimit: uint256;
  callGasLimit: uint256;
} : never)>;
/** @link https://eips.ethereum.org/EIPS/eip-4337#-eth_getuseroperationbyhash */
type GetUserOperationByHashReturnType<entryPointVersion extends EntryPointVersion = EntryPointVersion, uint256 = bigint, uint32 = number> = {
  blockHash: Hash$1;
  blockNumber: uint256;
  entryPoint: Address$2;
  transactionHash: Hash$1;
  userOperation: UserOperation<entryPointVersion, uint256, uint32>;
};
/** @link https://eips.ethereum.org/EIPS/eip-4337#useroperation */
type UserOperation<entryPointVersion extends EntryPointVersion = EntryPointVersion, uint256 = bigint, uint32 = number> = OneOf$1<(entryPointVersion extends '0.9' ? {
  /** Authorization data. */
  authorization?: SignedAuthorization<uint32> | undefined;
  /** The data to pass to the `sender` during the main execution call. */
  callData: Hex$1;
  /** The amount of gas to allocate the main execution call */
  callGasLimit: uint256;
  /** Account factory. Only for new accounts. */
  factory?: Address$2 | undefined;
  /** Data for account factory. */
  factoryData?: Hex$1 | undefined;
  /** Maximum fee per gas. */
  maxFeePerGas: uint256;
  /** Maximum priority fee per gas. */
  maxPriorityFeePerGas: uint256;
  /** Anti-replay parameter. */
  nonce: uint256;
  /** Address of paymaster contract. */
  paymaster?: Address$2 | undefined;
  /** Data for paymaster. */
  paymasterData?: Hex$1 | undefined;
  /** The amount of gas to allocate for the paymaster post-operation code. */
  paymasterPostOpGasLimit?: uint256 | undefined;
  /** Paymaster signature. Can be provided separately for parallelizable signing. */
  paymasterSignature?: Hex$1 | undefined;
  /** The amount of gas to allocate for the paymaster validation code. */
  paymasterVerificationGasLimit?: uint256 | undefined;
  /** Extra gas to pay the Bundler. */
  preVerificationGas: uint256;
  /** The account making the operation. */
  sender: Address$2;
  /** Data passed into the account to verify authorization. */
  signature: Hex$1;
  /** The amount of gas to allocate for the verification step. */
  verificationGasLimit: uint256;
} : never) | (entryPointVersion extends '0.8' ? {
  /** Authorization data. */
  authorization?: SignedAuthorization<uint32> | undefined;
  /** The data to pass to the `sender` during the main execution call. */
  callData: Hex$1;
  /** The amount of gas to allocate the main execution call */
  callGasLimit: uint256;
  /** Account factory. Only for new accounts. */
  factory?: Address$2 | undefined;
  /** Data for account factory. */
  factoryData?: Hex$1 | undefined;
  /** Maximum fee per gas. */
  maxFeePerGas: uint256;
  /** Maximum priority fee per gas. */
  maxPriorityFeePerGas: uint256;
  /** Anti-replay parameter. */
  nonce: uint256;
  /** Address of paymaster contract. */
  paymaster?: Address$2 | undefined;
  /** Data for paymaster. */
  paymasterData?: Hex$1 | undefined;
  /** The amount of gas to allocate for the paymaster post-operation code. */
  paymasterPostOpGasLimit?: uint256 | undefined;
  /** The amount of gas to allocate for the paymaster validation code. */
  paymasterVerificationGasLimit?: uint256 | undefined;
  /** Extra gas to pay the Bundler. */
  preVerificationGas: uint256;
  /** The account making the operation. */
  sender: Address$2;
  /** Data passed into the account to verify authorization. */
  signature: Hex$1;
  /** The amount of gas to allocate for the verification step. */
  verificationGasLimit: uint256;
} : never) | (entryPointVersion extends '0.7' ? {
  /** Authorization data. */
  authorization?: SignedAuthorization<uint32> | undefined;
  /** The data to pass to the `sender` during the main execution call. */
  callData: Hex$1;
  /** The amount of gas to allocate the main execution call */
  callGasLimit: uint256;
  /** Account factory. Only for new accounts. */
  factory?: Address$2 | undefined;
  /** Data for account factory. */
  factoryData?: Hex$1 | undefined;
  /** Maximum fee per gas. */
  maxFeePerGas: uint256;
  /** Maximum priority fee per gas. */
  maxPriorityFeePerGas: uint256;
  /** Anti-replay parameter. */
  nonce: uint256;
  /** Address of paymaster contract. */
  paymaster?: Address$2 | undefined;
  /** Data for paymaster. */
  paymasterData?: Hex$1 | undefined;
  /** The amount of gas to allocate for the paymaster post-operation code. */
  paymasterPostOpGasLimit?: uint256 | undefined;
  /** The amount of gas to allocate for the paymaster validation code. */
  paymasterVerificationGasLimit?: uint256 | undefined;
  /** Extra gas to pay the Bundler. */
  preVerificationGas: uint256;
  /** The account making the operation. */
  sender: Address$2;
  /** Data passed into the account to verify authorization. */
  signature: Hex$1;
  /** The amount of gas to allocate for the verification step. */
  verificationGasLimit: uint256;
} : never) | (entryPointVersion extends '0.6' ? {
  /** Authorization data. */
  authorization?: SignedAuthorization<uint32> | undefined;
  /** The data to pass to the `sender` during the main execution call. */
  callData: Hex$1;
  /** The amount of gas to allocate the main execution call */
  callGasLimit: uint256;
  /** Account init code. Only for new accounts. */
  initCode?: Hex$1 | undefined;
  /** Maximum fee per gas. */
  maxFeePerGas: uint256;
  /** Maximum priority fee per gas. */
  maxPriorityFeePerGas: uint256;
  /** Anti-replay parameter. */
  nonce: uint256;
  /** Paymaster address with calldata. */
  paymasterAndData?: Hex$1 | undefined;
  /** Extra gas to pay the Bundler. */
  preVerificationGas: uint256;
  /** The account making the operation. */
  sender: Address$2;
  /** Data passed into the account to verify authorization. */
  signature: Hex$1;
  /** The amount of gas to allocate for the verification step. */
  verificationGasLimit: uint256;
} : never)>;
type UserOperationRequest<entryPointVersion extends EntryPointVersion = EntryPointVersion, uint256 = bigint, uint32 = number> = OneOf$1<(entryPointVersion extends '0.9' ? UnionPartialBy<UserOperation<'0.9', uint256, uint32>, keyof EstimateUserOperationGasReturnType<'0.9'> | 'callData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'signature'> : never) | (entryPointVersion extends '0.8' ? UnionPartialBy<UserOperation<'0.8', uint256, uint32>, keyof EstimateUserOperationGasReturnType<'0.8'> | 'callData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'signature'> : never) | (entryPointVersion extends '0.7' ? UnionPartialBy<UserOperation<'0.7', uint256, uint32>, keyof EstimateUserOperationGasReturnType<'0.7'> | 'callData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'signature'> : never) | (entryPointVersion extends '0.6' ? UnionPartialBy<UserOperation<'0.6', uint256, uint32>, keyof EstimateUserOperationGasReturnType<'0.6'> | 'callData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'signature'> : never)>;
/** @link https://eips.ethereum.org/EIPS/eip-4337#-eth_getuseroperationreceipt */
type UserOperationReceipt<_entryPointVersion extends EntryPointVersion = EntryPointVersion, uint256 = bigint, int32 = number, status$1 = 'success' | 'reverted'> = {
  /** Actual gas cost. */
  actualGasCost: uint256;
  /** Actual gas used. */
  actualGasUsed: uint256;
  /** Entrypoint address. */
  entryPoint: Address$2;
  /** Logs emitted during execution. */
  logs: Log<uint256, int32, false>[];
  /** Anti-replay parameter. */
  nonce: uint256;
  /** Paymaster for the user operation. */
  paymaster?: Address$2 | undefined;
  /** Revert reason, if unsuccessful. */
  reason?: string | undefined;
  /** Transaction receipt of the user operation execution. */
  receipt: TransactionReceipt$1<uint256, int32, status$1>;
  sender: Address$2;
  /** If the user operation execution was successful. */
  success: boolean;
  /** Hash of the user operation. */
  userOpHash: Hash$1;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/account-abstraction/types/rpc.d.ts
type RpcEstimateUserOperationGasReturnType<entryPointVersion extends EntryPointVersion = EntryPointVersion> = EstimateUserOperationGasReturnType<entryPointVersion, Hex$1>;
type RpcGetUserOperationByHashReturnType<entryPointVersion extends EntryPointVersion = EntryPointVersion> = GetUserOperationByHashReturnType<entryPointVersion, Hex$1, Hex$1>;
type RpcUserOperation<entryPointVersion extends EntryPointVersion = EntryPointVersion> = UserOperation<entryPointVersion, Hex$1, Hex$1> & {
  eip7702Auth?: RpcAuthorization;
};
type RpcUserOperationReceipt<entryPointVersion extends EntryPointVersion = EntryPointVersion> = UserOperationReceipt<entryPointVersion, Hex$1, Hex$1, Hex$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/base.d.ts
type BaseErrorParameters = {
  cause?: BaseError$2 | Error | undefined;
  details?: string | undefined;
  docsBaseUrl?: string | undefined;
  docsPath?: string | undefined;
  docsSlug?: string | undefined;
  metaMessages?: string[] | undefined;
  name?: string | undefined;
};
declare class BaseError$2 extends Error {
  details: string;
  docsPath?: string | undefined;
  metaMessages?: string[] | undefined;
  shortMessage: string;
  version: string;
  name: string;
  constructor(shortMessage: string, args?: BaseErrorParameters);
  walk(): Error;
  walk(fn: (err: unknown) => boolean): Error | null;
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/request.d.ts
type HttpRequestErrorType = HttpRequestError$1 & {
  name: 'HttpRequestError';
};
declare class HttpRequestError$1 extends BaseError$2 {
  body?: {
    [x: string]: unknown;
  } | {
    [y: string]: unknown;
  }[] | undefined;
  headers?: Headers | undefined;
  status?: number | undefined;
  url: string;
  constructor({
    body,
    cause,
    details,
    headers,
    status,
    url
  }: {
    body?: {
      [x: string]: unknown;
    } | {
      [y: string]: unknown;
    }[] | undefined;
    cause?: Error | undefined;
    details?: string | undefined;
    headers?: Headers | undefined;
    status?: number | undefined;
    url: string;
  });
}
type WebSocketRequestErrorType = WebSocketRequestError & {
  name: 'WebSocketRequestError';
};
declare class WebSocketRequestError extends BaseError$2 {
  url: string;
  constructor({
    body,
    cause,
    details,
    url
  }: {
    body?: {
      [key: string]: unknown;
    } | undefined;
    cause?: Error | undefined;
    details?: string | undefined;
    url: string;
  });
}
type RpcRequestErrorType = RpcRequestError & {
  name: 'RpcRequestError';
};
declare class RpcRequestError extends BaseError$2 {
  code: number;
  data?: unknown;
  url: string;
  constructor({
    body,
    error,
    url
  }: {
    body: {
      [x: string]: unknown;
    } | {
      [y: string]: unknown;
    }[];
    error: {
      code: number;
      data?: unknown;
      message: string;
    };
    url: string;
  });
}
type TimeoutErrorType = TimeoutError$1 & {
  name: 'TimeoutError';
};
declare class TimeoutError$1 extends BaseError$2 {
  url: string;
  constructor({
    body,
    url
  }: {
    body: {
      [x: string]: unknown;
    } | {
      [y: string]: unknown;
    }[];
    url: string;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/rpc.d.ts
type RpcErrorCode = -1 | -32700 | -32600 | -32601 | -32602 | -32603 | -32000 | -32001 | -32002 | -32003 | -32004 | -32005 | -32006 | -32042;
type RpcErrorOptions<code$1 extends number = RpcErrorCode> = {
  code?: code$1 | (number & {}) | undefined;
  docsPath?: string | undefined;
  metaMessages?: string[] | undefined;
  name?: string | undefined;
  shortMessage: string;
};
/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1474
 */
type RpcErrorType = RpcError & {
  name: 'RpcError';
};
declare class RpcError<code_ extends number = RpcErrorCode> extends BaseError$2 {
  code: code_ | (number & {});
  constructor(cause: Error, {
    code,
    docsPath,
    metaMessages,
    name,
    shortMessage
  }: RpcErrorOptions<code_>);
}
type ProviderRpcErrorCode = 4001 | 4100 | 4200 | 4900 | 4901 | 4902 | 5700 | 5710 | 5720 | 5730 | 5740 | 5750 | 5760;
declare class ProviderRpcError<T$1 = undefined> extends RpcError<ProviderRpcErrorCode> {
  data?: T$1 | undefined;
  constructor(cause: Error, options: Prettify<RpcErrorOptions<ProviderRpcErrorCode> & {
    data?: T$1 | undefined;
  }>);
}
/**
 * Subclass for a "Parse error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type ParseRpcErrorType = ParseRpcError & {
  code: -32700;
  name: 'ParseRpcError';
};
declare class ParseRpcError extends RpcError {
  static code: -32700;
  constructor(cause: Error);
}
/**
 * Subclass for a "Invalid request" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type InvalidRequestRpcErrorType = InvalidRequestRpcError & {
  code: -32600;
  name: 'InvalidRequestRpcError';
};
declare class InvalidRequestRpcError extends RpcError {
  static code: -32600;
  constructor(cause: Error);
}
/**
 * Subclass for a "Method not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type MethodNotFoundRpcErrorType = MethodNotFoundRpcError & {
  code: -32601;
  name: 'MethodNotFoundRpcError';
};
declare class MethodNotFoundRpcError extends RpcError {
  static code: -32601;
  constructor(cause: Error, {
    method
  }?: {
    method?: string;
  });
}
/**
 * Subclass for an "Invalid params" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type InvalidParamsRpcErrorType = InvalidParamsRpcError & {
  code: -32602;
  name: 'InvalidParamsRpcError';
};
declare class InvalidParamsRpcError extends RpcError {
  static code: -32602;
  constructor(cause: Error);
}
/**
 * Subclass for an "Internal error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type InternalRpcErrorType = InternalRpcError & {
  code: -32603;
  name: 'InternalRpcError';
};
declare class InternalRpcError extends RpcError {
  static code: -32603;
  constructor(cause: Error);
}
/**
 * Subclass for an "Invalid input" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type InvalidInputRpcErrorType = InvalidInputRpcError & {
  code: -32000;
  name: 'InvalidInputRpcError';
};
declare class InvalidInputRpcError extends RpcError {
  static code: -32000;
  constructor(cause: Error);
}
/**
 * Subclass for a "Resource not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type ResourceNotFoundRpcErrorType = ResourceNotFoundRpcError & {
  code: -32001;
  name: 'ResourceNotFoundRpcError';
};
declare class ResourceNotFoundRpcError extends RpcError {
  name: string;
  static code: -32001;
  constructor(cause: Error);
}
/**
 * Subclass for a "Resource unavailable" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type ResourceUnavailableRpcErrorType = ResourceUnavailableRpcError & {
  code: -32002;
  name: 'ResourceUnavailableRpcError';
};
declare class ResourceUnavailableRpcError extends RpcError {
  static code: -32002;
  constructor(cause: Error);
}
/**
 * Subclass for a "Transaction rejected" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type TransactionRejectedRpcErrorType = TransactionRejectedRpcError & {
  code: -32003;
  name: 'TransactionRejectedRpcError';
};
declare class TransactionRejectedRpcError extends RpcError {
  static code: -32003;
  constructor(cause: Error);
}
/**
 * Subclass for a "Method not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type MethodNotSupportedRpcErrorType = MethodNotSupportedRpcError & {
  code: -32004;
  name: 'MethodNotSupportedRpcError';
};
declare class MethodNotSupportedRpcError extends RpcError {
  static code: -32004;
  constructor(cause: Error, {
    method
  }?: {
    method?: string;
  });
}
/**
 * Subclass for a "Limit exceeded" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type LimitExceededRpcErrorType = LimitExceededRpcError$1 & {
  code: -32005;
  name: 'LimitExceededRpcError';
};
declare class LimitExceededRpcError$1 extends RpcError {
  static code: -32005;
  constructor(cause: Error);
}
/**
 * Subclass for a "JSON-RPC version not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
type JsonRpcVersionUnsupportedErrorType = JsonRpcVersionUnsupportedError & {
  code: -32006;
  name: 'JsonRpcVersionUnsupportedError';
};
declare class JsonRpcVersionUnsupportedError extends RpcError {
  static code: -32006;
  constructor(cause: Error);
}
/**
 * Subclass for a "User Rejected Request" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
type UserRejectedRequestErrorType = UserRejectedRequestError$1 & {
  code: 4001;
  name: 'UserRejectedRequestError';
};
declare class UserRejectedRequestError$1 extends ProviderRpcError {
  static code: 4001;
  constructor(cause: Error);
}
/**
 * Subclass for an "Unauthorized" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
type UnauthorizedProviderErrorType = UnauthorizedProviderError & {
  code: 4100;
  name: 'UnauthorizedProviderError';
};
declare class UnauthorizedProviderError extends ProviderRpcError {
  static code: 4100;
  constructor(cause: Error);
}
/**
 * Subclass for an "Unsupported Method" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
type UnsupportedProviderMethodErrorType = UnsupportedProviderMethodError & {
  code: 4200;
  name: 'UnsupportedProviderMethodError';
};
declare class UnsupportedProviderMethodError extends ProviderRpcError {
  static code: 4200;
  constructor(cause: Error, {
    method
  }?: {
    method?: string;
  });
}
/**
 * Subclass for an "Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
type ProviderDisconnectedErrorType = ProviderDisconnectedError & {
  code: 4900;
  name: 'ProviderDisconnectedError';
};
declare class ProviderDisconnectedError extends ProviderRpcError {
  static code: 4900;
  constructor(cause: Error);
}
/**
 * Subclass for an "Chain Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
type ChainDisconnectedErrorType = ChainDisconnectedError & {
  code: 4901;
  name: 'ChainDisconnectedError';
};
declare class ChainDisconnectedError extends ProviderRpcError {
  static code: 4901;
  constructor(cause: Error);
}
/**
 * Subclass for an "Switch Chain" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
type SwitchChainErrorType = SwitchChainError$1 & {
  code: 4902;
  name: 'SwitchChainError';
};
declare class SwitchChainError$1 extends ProviderRpcError {
  static code: 4902;
  constructor(cause: Error);
}
/**
 * Subclass for an "Unsupported non-optional capability" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type UnsupportedNonOptionalCapabilityErrorType = UnsupportedNonOptionalCapabilityError & {
  code: 5700;
  name: 'UnsupportedNonOptionalCapabilityError';
};
declare class UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
  static code: 5700;
  constructor(cause: Error);
}
/**
 * Subclass for an "Unsupported chain id" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type UnsupportedChainIdErrorType = UnsupportedChainIdError & {
  code: 5710;
  name: 'UnsupportedChainIdError';
};
declare class UnsupportedChainIdError extends ProviderRpcError {
  static code: 5710;
  constructor(cause: Error);
}
/**
 * Subclass for an "Duplicate ID" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type DuplicateIdErrorType = DuplicateIdError & {
  code: 5720;
  name: 'DuplicateIdError';
};
declare class DuplicateIdError extends ProviderRpcError {
  static code: 5720;
  constructor(cause: Error);
}
/**
 * Subclass for an "Unknown bundle ID" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type UnknownBundleIdErrorType = UnknownBundleIdError & {
  code: 5730;
  name: 'UnknownBundleIdError';
};
declare class UnknownBundleIdError extends ProviderRpcError {
  static code: 5730;
  constructor(cause: Error);
}
/**
 * Subclass for an "Bundle too large" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type BundleTooLargeErrorType = BundleTooLargeError & {
  code: 5740;
  name: 'BundleTooLargeError';
};
declare class BundleTooLargeError extends ProviderRpcError {
  static code: 5740;
  constructor(cause: Error);
}
/**
 * Subclass for an "Atomic-ready wallet rejected upgrade" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type AtomicReadyWalletRejectedUpgradeErrorType = AtomicReadyWalletRejectedUpgradeError & {
  code: 5750;
  name: 'AtomicReadyWalletRejectedUpgradeError';
};
declare class AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
  static code: 5750;
  constructor(cause: Error);
}
/**
 * Subclass for an "Atomicity not supported" EIP-5792 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-5792#error-codes
 */
type AtomicityNotSupportedErrorType = AtomicityNotSupportedError & {
  code: 5760;
  name: 'AtomicityNotSupportedError';
};
declare class AtomicityNotSupportedError extends ProviderRpcError {
  static code: 5760;
  constructor(cause: Error);
}
/**
 * Subclass for an unknown RPC error.
 */
type UnknownRpcErrorType = UnknownRpcError & {
  name: 'UnknownRpcError';
};
declare class UnknownRpcError extends RpcError {
  constructor(cause: Error);
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/promise/createBatchScheduler.d.ts
type CreateBatchSchedulerErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/promise/withRetry.d.ts
type WithRetryParameters = {
  delay?: ((config: {
    count: number;
    error: Error;
  }) => number) | number | undefined;
  retryCount?: number | undefined;
  shouldRetry?: (({
    count,
    error
  }: {
    count: number;
    error: Error;
  }) => Promise<boolean> | boolean) | undefined;
};
type WithRetryErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/rpc/socket.d.ts
type GetSocketRpcClientErrorType = CreateBatchSchedulerErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/buildRequest.d.ts
type RequestErrorType = AtomicityNotSupportedErrorType | AtomicReadyWalletRejectedUpgradeErrorType | BundleTooLargeErrorType | ChainDisconnectedErrorType | CreateBatchSchedulerErrorType | DuplicateIdErrorType | HttpRequestErrorType | InternalRpcErrorType | InvalidInputRpcErrorType | InvalidParamsRpcErrorType | InvalidRequestRpcErrorType | GetSocketRpcClientErrorType | JsonRpcVersionUnsupportedErrorType | LimitExceededRpcErrorType | MethodNotFoundRpcErrorType | MethodNotSupportedRpcErrorType | ParseRpcErrorType | ProviderDisconnectedErrorType | ResourceNotFoundRpcErrorType | ResourceUnavailableRpcErrorType | RpcErrorType | RpcRequestErrorType | SwitchChainErrorType | TimeoutErrorType | TransactionRejectedRpcErrorType | UnauthorizedProviderErrorType | UnknownBundleIdErrorType | UnknownRpcErrorType | UnsupportedChainIdErrorType | UnsupportedNonOptionalCapabilityErrorType | UnsupportedProviderMethodErrorType | UserRejectedRequestErrorType | WebSocketRequestErrorType | WithRetryErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/experimental/erc7895/actions/addSubAccount.d.ts
type AddSubAccountParameters = Prettify<OneOf$1<{
  keys?: readonly {
    publicKey: Hex$1;
    type: 'address' | 'p256' | 'webcrypto-p256' | 'webauthn-p256';
  }[] | undefined;
  type: 'create';
} | {
  address: Address$2;
  chainId?: number | undefined;
  type: 'deployed';
} | {
  address: Address$2;
  chainId?: number | undefined;
  factory: Address$2;
  factoryData: Hex$1;
  type: 'undeployed';
}>>;
type AddSubAccountReturnType = Prettify<{
  address: Address$2;
  factory?: Address$2 | undefined;
  factoryData?: Hex$1 | undefined;
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/siwe/types.d.ts
/**
 * @description EIP-4361 message fields
 *
 * @see https://eips.ethereum.org/EIPS/eip-4361
 */
type SiweMessage = {
  /**
   * The Ethereum address performing the signing.
   */
  address: Address$2;
  /**
   * The [EIP-155](https://eips.ethereum.org/EIPS/eip-155) Chain ID to which the session is bound,
   */
  chainId: number;
  /**
   * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority that is requesting the signing.
   */
  domain: string;
  /**
   * Time when the signed authentication message is no longer valid.
   */
  expirationTime?: Date | undefined;
  /**
   * Time when the message was generated, typically the current time.
   */
  issuedAt?: Date | undefined;
  /**
   * A random string typically chosen by the relying party and used to prevent replay attacks.
   */
  nonce: string;
  /**
   * Time when the signed authentication message will become valid.
   */
  notBefore?: Date | undefined;
  /**
   * A system-specific identifier that may be used to uniquely refer to the sign-in request.
   */
  requestId?: string | undefined;
  /**
   * A list of information or references to information the user wishes to have resolved as part of authentication by the relying party.
   */
  resources?: string[] | undefined;
  /**
   * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme of the origin of the request.
   */
  scheme?: string | undefined;
  /**
   * A human-readable ASCII assertion that the user will sign.
   */
  statement?: string | undefined;
  /**
   * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) URI referring to the resource that is the subject of the signing (as in the subject of a claim).
   */
  uri: string;
  /**
   * The current version of the SIWE Message.
   */
  version: '1';
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/register.d.ts
interface Register {}
type ResolvedRegister = {
  CapabilitiesSchema: Register extends {
    CapabilitiesSchema: infer schema;
  } ? schema : DefaultRegister['CapabilitiesSchema'];
};
/** @internal */
type DefaultRegister = {
  CapabilitiesSchema: DefaultCapabilitiesSchema;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/capabilities.d.ts
type CapabilitiesSchema = ResolvedRegister['CapabilitiesSchema'];
type DefaultCapabilitiesSchema = {
  connect: {
    Request: {
      unstable_addSubAccount?: {
        account: AddSubAccountParameters;
      } | undefined;
      unstable_signInWithEthereum?: RequiredBy<Partial<SiweMessage>, 'chainId' | 'nonce'> | undefined;
    };
    ReturnType: {
      unstable_signInWithEthereum?: {
        message: string;
        signature: Hex$1;
      } | undefined;
      unstable_subAccounts?: readonly AddSubAccountReturnType[] | undefined;
    };
  };
  getCapabilities: {
    ReturnType: {
      atomic?: {
        status: 'supported' | 'ready' | 'unsupported';
      } | undefined;
      unstable_addSubAccount?: {
        keyTypes: ('address' | 'p256' | 'webcrypto-p256' | 'webauthn-p256')[];
        supported: boolean;
      } | undefined;
      paymasterService?: {
        supported: boolean;
      } | undefined;
    };
  };
  sendCalls: {
    Request: {
      paymasterService?: {
        context?: Record<string, any> | undefined;
        optional?: boolean | undefined;
        url: string;
      } | undefined;
    };
  };
};
type Capabilities<capabilities extends Record<string, any> = {}> = {
  [key: string]: any;
} & capabilities;
type ChainIdToCapabilities<capabilities extends Capabilities = Capabilities, id$1 extends string | number = Hex$1> = { [chainId in id$1]: capabilities };
type ExtractCapabilities<method$1 extends string, key$1 extends 'Request' | 'ReturnType'> = Prettify<method$1 extends keyof CapabilitiesSchema ? CapabilitiesSchema[method$1] extends { [k in key$1]: infer value extends Record<string, any> } ? Capabilities<value> : Capabilities : Capabilities>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/eip1193.d.ts
type EIP1474Methods = [...PublicRpcSchema, ...WalletRpcSchema, ...BundlerRpcSchema, ...PaymasterRpcSchema];
type AddEthereumChainParameter$1 = {
  /** A 0x-prefixed hexadecimal string */
  chainId: string;
  /** The chain name. */
  chainName: string;
  /** Native currency for the chain. */
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  } | undefined;
  rpcUrls: readonly string[];
  blockExplorerUrls?: string[] | undefined;
  iconUrls?: string[] | undefined;
};
type NetworkSync = {
  /** The current block number */
  currentBlock: Quantity;
  /** Number of latest block on the network */
  highestBlock: Quantity;
  /** Block number at which syncing started */
  startingBlock: Quantity;
};
type WalletCallReceipt<quantity = Hex$1, status$1 = Hex$1> = {
  logs: {
    address: Hex$1;
    data: Hex$1;
    topics: Hex$1[];
  }[];
  status: status$1;
  blockHash: Hex$1;
  blockNumber: quantity;
  gasUsed: quantity;
  transactionHash: Hex$1;
};
type WalletGrantPermissionsParameters = {
  signer?: {
    type: string;
    data?: unknown | undefined;
  } | undefined;
  permissions: readonly {
    data: unknown;
    policies: readonly {
      data: unknown;
      type: string;
    }[];
    required?: boolean | undefined;
    type: string;
  }[];
  expiry: number;
};
type WalletGrantPermissionsReturnType = {
  expiry: number;
  factory?: `0x${string}` | undefined;
  factoryData?: string | undefined;
  grantedPermissions: readonly {
    data: unknown;
    policies: readonly {
      data: unknown;
      type: string;
    }[];
    required?: boolean | undefined;
    type: string;
  }[];
  permissionsContext: string;
  signerData?: {
    userOpBuilder?: `0x${string}` | undefined;
    submitToAddress?: `0x${string}` | undefined;
  } | undefined;
};
type WalletGetAssetsParameters = {
  account: Address$2;
  assetFilter?: {
    [chainId: Hex$1]: readonly {
      address: Address$2;
      type: 'native' | 'erc20' | 'erc721' | (string & {});
    }[];
  } | undefined;
  assetTypeFilter?: readonly ('native' | 'erc20' | 'erc721' | (string & {}))[] | undefined;
  chainFilter?: readonly Hex$1[] | undefined;
};
type WalletGetAssetsReturnType = {
  [chainId: Hex$1]: readonly {
    address: Address$2 | 'native';
    balance: Hex$1;
    metadata?: unknown | undefined;
    type: 'native' | 'erc20' | 'erc721' | (string & {});
  }[];
};
type WalletGetCallsStatusReturnType<capabilities extends Capabilities = Capabilities, numberType = Hex$1, bigintType = Hex$1, receiptStatus = Hex$1> = {
  atomic: boolean;
  capabilities?: capabilities | Capabilities | undefined;
  chainId: numberType;
  id: string;
  receipts?: WalletCallReceipt<bigintType, receiptStatus>[] | undefined;
  status: number;
  version: string;
};
type WalletPermissionCaveat = {
  type: string;
  value: any;
};
type WalletPermission = {
  caveats: WalletPermissionCaveat[];
  date: number;
  id: string;
  invoker: `http://${string}` | `https://${string}`;
  parentCapability: 'eth_accounts' | string;
};
type WalletSendCallsParameters<capabilities extends Capabilities = Capabilities, chainId$1 extends Hex$1 | number = Hex$1, quantity extends Quantity | bigint = Quantity> = [{
  atomicRequired: boolean;
  calls: readonly {
    capabilities?: capabilities | Capabilities | undefined;
    to?: Address$2 | undefined;
    data?: Hex$1 | undefined;
    value?: quantity | undefined;
  }[];
  capabilities?: capabilities | Capabilities | undefined;
  chainId?: chainId$1 | undefined;
  id?: string | undefined;
  from?: Address$2 | undefined;
  version: string;
}];
type WalletSendCallsReturnType<capabilities extends Capabilities = Capabilities> = {
  capabilities?: capabilities | undefined;
  id: string;
};
type WatchAssetParams = {
  /** Token type. */
  type: 'ERC20';
  options: {
    /** The address of the token contract */
    address: string;
    /** A ticker symbol or shorthand, up to 11 characters */
    symbol: string;
    /** The number of token decimals */
    decimals: number;
    /** A string url of the token logo */
    image?: string | undefined;
  };
};
type BundlerRpcSchema = [
/**
 * @description Returns the chain ID associated with the current network
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_chainid
 */
{
  Method: 'eth_chainId';
  Parameters?: undefined;
  ReturnType: Hex$1;
},
/**
 * @description Estimate the gas values for a UserOperation.
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_estimateuseroperationgas
 *
 * @example
 * provider.request({
 *  method: 'eth_estimateUserOperationGas',
 *  params: [{ ... }]
 * })
 * // => { ... }
 */
{
  Method: 'eth_estimateUserOperationGas';
  Parameters: [userOperation: RpcUserOperation, entrypoint: Address$2] | [userOperation: RpcUserOperation, entrypoint: Address$2, stateOverrideSet: RpcStateOverride];
  ReturnType: RpcEstimateUserOperationGasReturnType;
},
/**
 * @description Return a UserOperation based on a hash.
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_getuseroperationbyhash
 *
 * @example
 * provider.request({
 *  method: 'eth_getUserOperationByHash',
 *  params: ['0x...']
 * })
 * // => { ... }
 */
{
  Method: 'eth_getUserOperationByHash';
  Parameters: [hash: Hash$1];
  ReturnType: RpcGetUserOperationByHashReturnType | null;
},
/**
 * @description Return a UserOperation receipt based on a hash.
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_getuseroperationreceipt
 *
 * @example
 * provider.request({
 *  method: 'eth_getUserOperationReceipt',
 *  params: ['0x...']
 * })
 * // => { ... }
 */
{
  Method: 'eth_getUserOperationReceipt';
  Parameters: [hash: Hash$1];
  ReturnType: RpcUserOperationReceipt | null;
},
/**
 * @description Submits a User Operation object to the User Operation pool of the client.
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_senduseroperation
 *
 * @example
 * provider.request({
 *  method: 'eth_sendUserOperation',
 *  params: [{ ... }]
 * })
 * // => '0x...'
 */
{
  Method: 'eth_sendUserOperation';
  Parameters: [userOperation: RpcUserOperation, entrypoint: Address$2];
  ReturnType: Hash$1;
},
/**
 * @description Return the list of supported entry points by the client.
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_supportedentrypoints
 */
{
  Method: 'eth_supportedEntryPoints';
  Parameters?: undefined;
  ReturnType: readonly Address$2[];
}];
type PaymasterRpcSchema = [
/**
 * @description Returns the chain ID associated with the current network
 *
 * @link https://eips.ethereum.org/EIPS/eip-4337#-eth_chainid
 */
{
  Method: 'pm_getPaymasterStubData';
  Parameters?: [userOperation: OneOf$1<PartialBy<Pick<RpcUserOperation<'0.6'>, 'callData' | 'callGasLimit' | 'initCode' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'preVerificationGas' | 'verificationGasLimit'>, 'callGasLimit' | 'initCode' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'preVerificationGas' | 'verificationGasLimit'> | PartialBy<Pick<RpcUserOperation<'0.7'>, 'callData' | 'callGasLimit' | 'factory' | 'factoryData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'preVerificationGas' | 'verificationGasLimit'>, 'callGasLimit' | 'factory' | 'factoryData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'preVerificationGas' | 'verificationGasLimit'>>, entrypoint: Address$2, chainId: Hex$1, context: unknown];
  ReturnType: OneOf$1<{
    paymasterAndData: Hex$1;
  } | {
    paymaster: Address$2;
    paymasterData: Hex$1;
    paymasterVerificationGasLimit: Hex$1;
    paymasterPostOpGasLimit: Hex$1;
  }> & {
    sponsor?: {
      name: string;
      icon?: string | undefined;
    } | undefined;
    isFinal?: boolean | undefined;
  };
},
/**
 * @description Returns values to be used in paymaster-related fields of a signed user operation.
 *
 * @link https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7677.md#pm_getpaymasterdata
 */
{
  Method: 'pm_getPaymasterData';
  Parameters?: [userOperation: Pick<RpcUserOperation<'0.6'>, 'callData' | 'callGasLimit' | 'initCode' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'preVerificationGas' | 'verificationGasLimit'> | Pick<RpcUserOperation<'0.7'>, 'callData' | 'callGasLimit' | 'factory' | 'factoryData' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce' | 'sender' | 'preVerificationGas' | 'verificationGasLimit'>, entrypoint: Address$2, chainId: Hex$1, context: unknown];
  ReturnType: OneOf$1<{
    paymasterAndData: Hex$1;
  } | {
    paymaster: Address$2;
    paymasterData: Hex$1;
    paymasterVerificationGasLimit: Hex$1;
    paymasterPostOpGasLimit: Hex$1;
  }>;
}];
type PublicRpcSchema = [
/**
 * @description Returns the version of the current client
 *
 * @example
 * provider.request({ method: 'web3_clientVersion' })
 * // => 'MetaMask/v1.0.0'
 */
{
  Method: 'web3_clientVersion';
  Parameters?: undefined;
  ReturnType: string;
},
/**
 * @description Hashes data using the Keccak-256 algorithm
 *
 * @example
 * provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] })
 * // => '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
 */
{
  Method: 'web3_sha3';
  Parameters: [data: Hash$1];
  ReturnType: string;
},
/**
 * @description Determines if this client is listening for new network connections
 *
 * @example
 * provider.request({ method: 'net_listening' })
 * // => true
 */
{
  Method: 'net_listening';
  Parameters?: undefined;
  ReturnType: boolean;
},
/**
 * @description Returns the number of peers currently connected to this client
 *
 * @example
 * provider.request({ method: 'net_peerCount' })
 * // => '0x1'
 */
{
  Method: 'net_peerCount';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Returns the chain ID associated with the current network
 *
 * @example
 * provider.request({ method: 'net_version' })
 * // => '1'
 */
{
  Method: 'net_version';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Returns the base fee per blob gas in wei.
 *
 * @example
 * provider.request({ method: 'eth_blobBaseFee' })
 * // => '0x09184e72a000'
 */
{
  Method: 'eth_blobBaseFee';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Returns the number of the most recent block seen by this client
 *
 * @example
 * provider.request({ method: 'eth_blockNumber' })
 * // => '0x1b4'
 */
{
  Method: 'eth_blockNumber';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Executes a new message call immediately without submitting a transaction to the network
 *
 * @example
 * provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] })
 * // => '0x...'
 */
{
  Method: 'eth_call';
  Parameters: readonly [transaction: ExactPartial$1<RpcTransactionRequest>] | readonly [transaction: ExactPartial$1<RpcTransactionRequest>, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier] | readonly [transaction: ExactPartial$1<RpcTransactionRequest>, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier, stateOverrideSet: RpcStateOverride] | readonly [transaction: ExactPartial$1<RpcTransactionRequest>, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier, stateOverrideSet: RpcStateOverride, blockOverrides: Rpc];
  ReturnType: Hex$1;
},
/**
 * @description Creates an EIP-2930 access list that can be included in a transaction.
 *
 * @example
 * provider.request({ method: 'eth_createAccessList', params: [{ to: '0x...', data: '0x...' }] })
 * // => {
 * //   accessList: ['0x...', '0x...'],
 * //   gasUsed: '0x123',
 * // }
 */
{
  Method: 'eth_createAccessList';
  Parameters: [transaction: ExactPartial$1<RpcTransactionRequest>] | [transaction: ExactPartial$1<RpcTransactionRequest>, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier];
  ReturnType: {
    accessList: AccessList;
    gasUsed: Quantity;
  };
},
/**
 * @description Returns the chain ID associated with the current network
 * @example
 * provider.request({ method: 'eth_chainId' })
 * // => '1'
 */
{
  Method: 'eth_chainId';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Returns the client coinbase address.
 * @example
 * provider.request({ method: 'eth_coinbase' })
 * // => '0x...'
 */
{
  Method: 'eth_coinbase';
  Parameters?: undefined;
  ReturnType: Address$2;
},
/**
 * @description Estimates the gas necessary to complete a transaction without submitting it to the network
 *
 * @example
 * provider.request({
 *  method: 'eth_estimateGas',
 *  params: [{ from: '0x...', to: '0x...', value: '0x...' }]
 * })
 * // => '0x5208'
 */
{
  Method: 'eth_estimateGas';
  Parameters: [transaction: RpcTransactionRequest] | [transaction: RpcTransactionRequest, block: RpcBlockNumber | BlockTag] | [transaction: RpcTransactionRequest, block: RpcBlockNumber | BlockTag, stateOverride: RpcStateOverride];
  ReturnType: Quantity;
},
/**
 * @description Fills a transaction with the necessary data to be signed.
 *
 * @example
 * provider.request({ method: 'eth_fillTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
 * // => '0x...'
 */
{
  Method: 'eth_fillTransaction';
  Parameters: [transaction: RpcTransactionRequest];
  ReturnType: {
    raw: Hex$1;
    tx: RpcTransaction;
  };
},
/**
 * @description Returns a collection of historical gas information
 *
 * @example
 * provider.request({
 *  method: 'eth_feeHistory',
 *  params: ['4', 'latest', ['25', '75']]
 * })
 * // => {
 * //   oldestBlock: '0x1',
 * //   baseFeePerGas: ['0x1', '0x2', '0x3', '0x4'],
 * //   gasUsedRatio: ['0x1', '0x2', '0x3', '0x4'],
 * //   reward: [['0x1', '0x2'], ['0x3', '0x4'], ['0x5', '0x6'], ['0x7', '0x8']]
 * // }
 * */
{
  Method: 'eth_feeHistory';
  Parameters: [/** Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. Less than requested may be returned if not all blocks are available. */
  blockCount: Quantity, /** Highest number block of the requested range. */
  newestBlock: RpcBlockNumber | BlockTag, /** A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used. */
  rewardPercentiles: number[] | undefined];
  ReturnType: RpcFeeHistory;
},
/**
 * @description Returns the current price of gas expressed in wei
 *
 * @example
 * provider.request({ method: 'eth_gasPrice' })
 * // => '0x09184e72a000'
 */
{
  Method: 'eth_gasPrice';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Returns the balance of an address in wei
 *
 * @example
 * provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] })
 * // => '0x12a05...'
 */
{
  Method: 'eth_getBalance';
  Parameters: [address: Address$2, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier];
  ReturnType: Quantity;
},
/**
 * @description Returns information about a block specified by hash
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getBlockByHash', params: ['0x...', true] })
 * // => {
 * //   number: '0x1b4',
 * //   hash: '0x...',
 * //   parentHash: '0x...',
 * //   ...
 * // }
 */
{
  Method: 'eth_getBlockByHash';
  Parameters: [/** hash of a block */
  hash: Hash$1, /** true will pull full transaction objects, false will pull transaction hashes */
  includeTransactionObjects: boolean];
  ReturnType: RpcBlock | null;
},
/**
 * @description Returns information about a block specified by number
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getBlockByNumber', params: ['0x1b4', true] })
 * // => {
 * //   number: '0x1b4',
 * //   hash: '0x...',
 * //   parentHash: '0x...',
 * //   ...
 * // }
 */
{
  Method: 'eth_getBlockByNumber';
  Parameters: [/** block number, or one of "latest", "safe", "finalized", "earliest" or "pending" */
  block: RpcBlockNumber | BlockTag, /** true will pull full transaction objects, false will pull transaction hashes */
  includeTransactionObjects: boolean];
  ReturnType: RpcBlock | null;
},
/**
 * @description Returns the number of transactions in a block specified by block hash
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] })
 * // => '0x1'
 */
{
  Method: 'eth_getBlockTransactionCountByHash';
  Parameters: [hash: Hash$1];
  ReturnType: Quantity;
},
/**
 * @description Returns the number of transactions in a block specified by block number
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] })
 * // => '0x1'
 */
{
  Method: 'eth_getBlockTransactionCountByNumber';
  Parameters: [block: RpcBlockNumber | BlockTag];
  ReturnType: Quantity;
},
/**
 * @description Returns the contract code stored at a given address
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] })
 * // => '0x...'
 */
{
  Method: 'eth_getCode';
  Parameters: [address: Address$2, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier];
  ReturnType: Hex$1;
},
/**
 * @description Returns a list of all logs based on filter ID since the last log retrieval
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] })
 * // => [{ ... }, { ... }]
 */
{
  Method: 'eth_getFilterChanges';
  Parameters: [filterId: Quantity];
  ReturnType: RpcLog[] | Hex$1[];
},
/**
 * @description Returns a list of all logs based on filter ID
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] })
 * // => [{ ... }, { ... }]
 */
{
  Method: 'eth_getFilterLogs';
  Parameters: [filterId: Quantity];
  ReturnType: RpcLog[];
},
/**
 * @description Returns a list of all logs based on a filter object
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
 * // => [{ ... }, { ... }]
 */
{
  Method: 'eth_getLogs';
  Parameters: [{
    address?: Address$2 | Address$2[] | undefined;
    topics?: LogTopic[] | undefined;
  } & ({
    fromBlock?: RpcBlockNumber | BlockTag | undefined;
    toBlock?: RpcBlockNumber | BlockTag | undefined;
    blockHash?: undefined;
  } | {
    fromBlock?: undefined;
    toBlock?: undefined;
    blockHash?: Hash$1 | undefined;
  })];
  ReturnType: RpcLog[];
},
/**
 * @description Returns the account and storage values of the specified account including the Merkle-proof.
 * @link https://eips.ethereum.org/EIPS/eip-1186
 * @example
 * provider.request({ method: 'eth_getProof', params: ['0x...', ['0x...'], 'latest'] })
 * // => {
 * //   ...
 * // }
 */
{
  Method: 'eth_getProof';
  Parameters: [/** Address of the account. */
  address: Address$2, /** An array of storage-keys that should be proofed and included. */
  storageKeys: Hash$1[], block: RpcBlockNumber | BlockTag];
  ReturnType: RpcProof;
},
/**
 * @description Returns the value from a storage position at an address
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] })
 * // => '0x...'
 */
{
  Method: 'eth_getStorageAt';
  Parameters: [address: Address$2, index: Quantity, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier];
  ReturnType: Hex$1;
},
/**
 * @description Returns information about a transaction specified by block hash and transaction index
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getTransactionByBlockHashAndIndex';
  Parameters: [hash: Hash$1, index: Quantity];
  ReturnType: RpcTransaction | null;
},
/**
 * @description Returns information about a transaction specified by block number and transaction index
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getTransactionByBlockNumberAndIndex';
  Parameters: [block: RpcBlockNumber | BlockTag, index: Quantity];
  ReturnType: RpcTransaction | null;
},
/**
 * @description Returns information about a transaction specified by hash
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getTransactionByHash';
  Parameters: [hash: Hash$1];
  ReturnType: RpcTransaction | null;
},
/**
 * @description Returns information about a transaction specified by sender and nonce
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getTransactionBySenderAndNonce', params: ['0x...', '0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getTransactionBySenderAndNonce';
  Parameters: [sender: Address$2, nonce: Quantity];
  ReturnType: RpcTransaction | null;
},
/**
 * @description Returns the number of transactions sent from an address
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] })
 * // => '0x1'
 */
{
  Method: 'eth_getTransactionCount';
  Parameters: [address: Address$2, block: RpcBlockNumber | BlockTag | RpcBlockIdentifier];
  ReturnType: Quantity;
},
/**
 * @description Returns the receipt of a transaction specified by hash
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getTransactionReceipt';
  Parameters: [hash: Hash$1];
  ReturnType: RpcTransactionReceipt | null;
},
/**
 * @description Returns information about an uncle specified by block hash and uncle index position
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getUncleByBlockHashAndIndex';
  Parameters: [hash: Hash$1, index: Quantity];
  ReturnType: RpcUncle | null;
},
/**
 * @description Returns information about an uncle specified by block number and uncle index position
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] })
 * // => { ... }
 */
{
  Method: 'eth_getUncleByBlockNumberAndIndex';
  Parameters: [block: RpcBlockNumber | BlockTag, index: Quantity];
  ReturnType: RpcUncle | null;
},
/**
 * @description Returns the number of uncles in a block specified by block hash
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] })
 * // => '0x1'
 */
{
  Method: 'eth_getUncleCountByBlockHash';
  Parameters: [hash: Hash$1];
  ReturnType: Quantity;
},
/**
 * @description Returns the number of uncles in a block specified by block number
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] })
 * // => '0x1'
 */
{
  Method: 'eth_getUncleCountByBlockNumber';
  Parameters: [block: RpcBlockNumber | BlockTag];
  ReturnType: Quantity;
},
/**
 * @description Returns the current maxPriorityFeePerGas in wei.
 * @link https://ethereum.github.io/execution-apis/api-documentation/
 * @example
 * provider.request({ method: 'eth_maxPriorityFeePerGas' })
 * // => '0x5f5e100'
 */
{
  Method: 'eth_maxPriorityFeePerGas';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_newBlockFilter' })
 * // => '0x1'
 */
{
  Method: 'eth_newBlockFilter';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
 * // => '0x1'
 */
{
  Method: 'eth_newFilter';
  Parameters: [filter: {
    fromBlock?: RpcBlockNumber | BlockTag | undefined;
    toBlock?: RpcBlockNumber | BlockTag | undefined;
    address?: Address$2 | Address$2[] | undefined;
    topics?: LogTopic[] | undefined;
  }];
  ReturnType: Quantity;
},
/**
 * @description Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_newPendingTransactionFilter' })
 * // => '0x1'
 */
{
  Method: 'eth_newPendingTransactionFilter';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Returns the current Ethereum protocol version
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_protocolVersion' })
 * // => '54'
 */
{
  Method: 'eth_protocolVersion';
  Parameters?: undefined;
  ReturnType: string;
},
/**
 * @description Sends a **signed** transaction to the network
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
 * // => '0x...'
 */
{
  Method: 'eth_sendRawTransaction';
  Parameters: [signedTransaction: Hex$1];
  ReturnType: Hash$1;
},
/**
 * @description Sends a **signed** transaction to the network synchronously
 * @link https://eips.ethereum.org/EIPS/eip-7966
 * @example
 * provider.request({ method: 'eth_sendRawTransactionSync', params: ['0x...'] })
 * // => '0x...'
 */
{
  Method: 'eth_sendRawTransactionSync';
  Parameters: [signedTransaction: Hex$1] | [signedTransaction: Hex$1, timeout: Hex$1];
  ReturnType: RpcTransactionReceipt;
},
/**
 * @description Simulates execution of a set of calls with optional block and state overrides.
 * @example
 * provider.request({ method: 'eth_simulateV1', params: [{ blockStateCalls: [{ calls: [{ from: '0x...', to: '0x...', value: '0x...', data: '0x...' }] }] }, 'latest'] })
 * // => { ... }
 */
{
  Method: 'eth_simulateV1';
  Parameters: [{
    blockStateCalls: readonly {
      blockOverrides?: Rpc | undefined;
      calls?: readonly ExactPartial$1<RpcTransactionRequest>[] | undefined;
      stateOverrides?: RpcStateOverride | undefined;
    }[];
    returnFullTransactions?: boolean | undefined;
    traceTransfers?: boolean | undefined;
    validation?: boolean | undefined;
  }, RpcBlockNumber | BlockTag];
  ReturnType: readonly (RpcBlock & {
    calls: readonly {
      error?: {
        data?: Hex$1 | undefined;
        code: number;
        message: string;
      } | undefined;
      logs?: readonly RpcLog[] | undefined;
      gasUsed: Hex$1;
      returnData: Hex$1;
      status: Hex$1;
    }[];
  })[];
},
/**
 * @description Destroys a filter based on filter ID
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
 * // => true
 */
{
  Method: 'eth_uninstallFilter';
  Parameters: [filterId: Quantity];
  ReturnType: boolean;
}];
type WalletRpcSchema = [
/**
 * @description Returns a list of addresses owned by this client
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_accounts' })
 * // => ['0x0fB69...']
 */
{
  Method: 'eth_accounts';
  Parameters?: undefined;
  ReturnType: Address$2[];
},
/**
 * @description Returns the current chain ID associated with the wallet.
 * @example
 * provider.request({ method: 'eth_chainId' })
 * // => '1'
 */
{
  Method: 'eth_chainId';
  Parameters?: undefined;
  ReturnType: Quantity;
},
/**
 * @description Estimates the gas necessary to complete a transaction without submitting it to the network
 *
 * @example
 * provider.request({
 *  method: 'eth_estimateGas',
 *  params: [{ from: '0x...', to: '0x...', value: '0x...' }]
 * })
 * // => '0x5208'
 */
{
  Method: 'eth_estimateGas';
  Parameters: [transaction: RpcTransactionRequest] | [transaction: RpcTransactionRequest, block: RpcBlockNumber | BlockTag] | [transaction: RpcTransactionRequest, block: RpcBlockNumber | BlockTag, stateOverride: RpcStateOverride];
  ReturnType: Quantity;
},
/**
 * @description Fills a transaction with the necessary data to be signed.
 *
 * @example
 * provider.request({ method: 'eth_fillTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
 * // => '0x...'
 */
{
  Method: 'eth_fillTransaction';
  Parameters: [transaction: RpcTransactionRequest];
  ReturnType: {
    raw: Hex$1;
    tx: RpcTransaction;
  };
},
/**
 * @description Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear.
 * @link https://eips.ethereum.org/EIPS/eip-1102
 * @example
 * provider.request({ method: 'eth_requestAccounts' }] })
 * // => ['0x...', '0x...']
 */
{
  Method: 'eth_requestAccounts';
  Parameters?: undefined;
  ReturnType: Address$2[];
},
/**
 * @description Creates, signs, and sends a new transaction to the network
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
 * // => '0x...'
 */
{
  Method: 'eth_sendTransaction';
  Parameters: [transaction: RpcTransactionRequest];
  ReturnType: Hash$1;
},
/**
 * @description Sends and already-signed transaction to the network
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
 * // => '0x...'
 */
{
  Method: 'eth_sendRawTransaction';
  Parameters: [signedTransaction: Hex$1];
  ReturnType: Hash$1;
},
/**
 * @description Sends and already-signed transaction to the network synchronously
 * @link https://eips.ethereum.org/EIPS/eip-7966
 * @example
 * provider.request({ method: 'eth_sendRawTransactionSync', params: ['0x...'] })
 * // => '0x...'
 */
{
  Method: 'eth_sendRawTransactionSync';
  Parameters: [signedTransaction: Hex$1] | [signedTransaction: Hex$1, timeout: Hex$1];
  ReturnType: RpcTransactionReceipt;
},
/**
 * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] })
 * // => '0x...'
 */
{
  Method: 'eth_sign';
  Parameters: [/** Address to use for signing */
  address: Address$2, /** Data to sign */
  data: Hex$1];
  ReturnType: Hex$1;
},
/**
 * @description Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
 * // => '0x...'
 */
{
  Method: 'eth_signTransaction';
  Parameters: [request: RpcTransactionRequest];
  ReturnType: Hex$1;
},
/**
 * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] })
 * // => '0x...'
 */
{
  Method: 'eth_signTypedData_v4';
  Parameters: [/** Address to use for signing */
  address: Address$2, /** Message to sign containing type information, a domain separator, and data */
  message: string];
  ReturnType: Hex$1;
},
/**
 * @description Returns information about the status of this client’s network synchronization
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'eth_syncing' })
 * // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }
 */
{
  Method: 'eth_syncing';
  Parameters?: undefined;
  ReturnType: NetworkSync | false;
},
/**
 * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] })
 * // => '0x...'
 */
{
  Method: 'personal_sign';
  Parameters: [/** Data to sign */
  data: Hex$1, /** Address to use for signing */
  address: Address$2];
  ReturnType: Hex$1;
},
/**
 * @description Add an Ethereum chain to the wallet.
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @example
 * provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] })
 * // => { ... }
 */
{
  Method: 'wallet_addEthereumChain';
  Parameters: [chain: AddEthereumChainParameter$1];
  ReturnType: null;
},
/**
 *
 */
{
  Method: 'wallet_addSubAccount';
  Parameters: [{
    account: OneOf$1<{
      keys: readonly {
        publicKey: Hex$1;
        type: 'address' | 'p256' | 'webcrypto-p256' | 'webauthn-p256';
      }[];
      type: 'create';
    } | {
      address: Address$2;
      chainId?: number | undefined;
      type: 'deployed';
    } | {
      address: Address$2;
      chainId?: number | undefined;
      factory: Address$2;
      factoryData: Hex$1;
      type: 'undeployed';
    }>;
    version: string;
  }];
  ReturnType: {
    address: Address$2;
    factory?: Address$2 | undefined;
    factoryData?: Hex$1 | undefined;
  };
},
/**
 * @description Requests to connect account(s).
 * @link https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md
 * @example
 * provider.request({ method: 'wallet_connect' })
 * // => { ... }
 */
{
  Method: 'wallet_connect';
  Parameters: [{
    capabilities?: Capabilities | undefined;
    version: string;
  }];
  ReturnType: {
    accounts: readonly {
      address: Address$2;
      capabilities?: Capabilities | undefined;
    }[];
  };
},
/**
 * @description Disconnects connected account(s).
 * @link https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md
 * @example
 * provider.request({ method: 'wallet_disconnect' })
 */
{
  Method: 'wallet_disconnect';
  Parameters?: undefined;
  ReturnType: void;
},
/**
 * @description Returns the assets owned by the wallet.
 * @link https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7811.md
 * @example
 * provider.request({ method: 'wallet_getAssets', params: [...] })
 * // => { ... }
 */
{
  Method: 'wallet_getAssets';
  Parameters?: [WalletGetAssetsParameters];
  ReturnType: WalletGetAssetsReturnType;
},
/**
 * @description Returns the status of a call batch that was sent via `wallet_sendCalls`.
 * @link https://eips.ethereum.org/EIPS/eip-5792
 * @example
 * provider.request({ method: 'wallet_getCallsStatus' })
 * // => { ... }
 */
{
  Method: 'wallet_getCallsStatus';
  Parameters?: [string];
  ReturnType: WalletGetCallsStatusReturnType;
},
/**
 * @description Gets the connected wallet's capabilities.
 * @link https://eips.ethereum.org/EIPS/eip-5792
 * @example
 * provider.request({ method: 'wallet_getCapabilities' })
 * // => { ... }
 */
{
  Method: 'wallet_getCapabilities';
  Parameters?: readonly [] | readonly [Address$2 | undefined] | readonly [Address$2 | undefined, readonly Hex$1[] | undefined] | undefined;
  ReturnType: Prettify<ChainIdToCapabilities>;
},
/**
 * @description Gets the wallets current permissions.
 * @link https://eips.ethereum.org/EIPS/eip-2255
 * @example
 * provider.request({ method: 'wallet_getPermissions' })
 * // => { ... }
 */
{
  Method: 'wallet_getPermissions';
  Parameters?: undefined;
  ReturnType: WalletPermission[];
},
/**
 * @description Requests permissions from a wallet
 * @link https://eips.ethereum.org/EIPS/eip-7715
 * @example
 * provider.request({ method: 'wallet_grantPermissions', params: [{ ... }] })
 * // => { ... }
 */
{
  Method: 'wallet_grantPermissions';
  Parameters?: [WalletGrantPermissionsParameters];
  ReturnType: Prettify<WalletGrantPermissionsReturnType>;
},
/**
 * @description Requests the given permissions from the user.
 * @link https://eips.ethereum.org/EIPS/eip-2255
 * @example
 * provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
 * // => { ... }
 */
{
  Method: 'wallet_requestPermissions';
  Parameters: [permissions: {
    eth_accounts: Record<string, any>;
  }];
  ReturnType: WalletPermission[];
},
/**
 * @description Revokes the given permissions from the user.
 * @link https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
 * @example
 * provider.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] })
 * // => { ... }
 */
{
  Method: 'wallet_revokePermissions';
  Parameters: [permissions: {
    eth_accounts: Record<string, any>;
  }];
  ReturnType: null;
},
/**
 * @description Requests the connected wallet to send a batch of calls.
 * @link https://eips.ethereum.org/EIPS/eip-5792
 * @example
 * provider.request({ method: 'wallet_sendCalls' })
 * // => { ... }
 */
{
  Method: 'wallet_sendCalls';
  Parameters?: WalletSendCallsParameters;
  ReturnType: WalletSendCallsReturnType;
},
/**
 * @description Creates, signs, and sends a new transaction to the network
 * @link https://eips.ethereum.org/EIPS/eip-1474
 * @example
 * provider.request({ method: 'wallet_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
 * // => '0x...'
 */
{
  Method: 'wallet_sendTransaction';
  Parameters: [transaction: RpcTransactionRequest];
  ReturnType: Hash$1;
},
/**
 * @description Requests for the wallet to show information about a call batch
 * that was sent via `wallet_sendCalls`.
 * @link https://eips.ethereum.org/EIPS/eip-5792
 * @example
 * provider.request({ method: 'wallet_showCallsStatus', params: ['...'] })
 */
{
  Method: 'wallet_showCallsStatus';
  Parameters?: [string];
  ReturnType: void;
},
/**
 * @description Switch the wallet to the given Ethereum chain.
 * @link https://eips.ethereum.org/EIPS/eip-3326
 * @example
 * provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] })
 * // => { ... }
 */
{
  Method: 'wallet_switchEthereumChain';
  Parameters: [chain: {
    chainId: string;
  }];
  ReturnType: null;
},
/**
 * @description Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added.
 * @link https://eips.ethereum.org/EIPS/eip-747
 * @example
 * provider.request({ method: 'wallet_watchAsset' }] })
 * // => true
 */
{
  Method: 'wallet_watchAsset';
  Parameters: WatchAssetParams;
  ReturnType: boolean;
}];
type RpcSchema = readonly {
  Method: string;
  Parameters?: unknown | undefined;
  ReturnType: unknown;
}[];
type RpcSchemaOverride = Omit<RpcSchema[number], 'Method'>;
type EIP1193Parameters<rpcSchema extends RpcSchema | undefined = undefined> = rpcSchema extends RpcSchema ? { [K in keyof rpcSchema]: Prettify<{
  method: rpcSchema[K] extends rpcSchema[number] ? rpcSchema[K]['Method'] : never;
} & (rpcSchema[K] extends rpcSchema[number] ? rpcSchema[K]['Parameters'] extends undefined ? {
  params?: undefined;
} : {
  params: rpcSchema[K]['Parameters'];
} : never)> }[number] : {
  method: string;
  params?: unknown | undefined;
};
type EIP1193RequestOptions = {
  /** Deduplicate in-flight requests. */
  dedupe?: boolean | undefined;
  /** Methods to include or exclude from executing RPC requests. */
  methods?: OneOf$1<{
    include?: string[] | undefined;
  } | {
    exclude?: string[] | undefined;
  }> | undefined;
  /** The base delay (in ms) between retries. */
  retryDelay?: number | undefined;
  /** The max number of times to retry. */
  retryCount?: number | undefined;
  /** Unique identifier for the request. */
  uid?: string | undefined;
};
type DerivedRpcSchema<rpcSchema extends RpcSchema | undefined, rpcSchemaOverride extends RpcSchemaOverride | undefined> = rpcSchemaOverride extends RpcSchemaOverride ? [rpcSchemaOverride & {
  Method: string;
}] : rpcSchema;
type EIP1193RequestFn$1<rpcSchema extends RpcSchema | undefined = undefined, raw extends boolean = false> = <rpcSchemaOverride extends RpcSchemaOverride | undefined = undefined, _parameters extends EIP1193Parameters<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>> = EIP1193Parameters<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>>, _returnType = (DerivedRpcSchema<rpcSchema, rpcSchemaOverride> extends RpcSchema ? raw extends true ? OneOf$1<{
  result: Extract<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>[number], {
    Method: _parameters['method'];
  }>['ReturnType'];
} | {
  error: ErrorObject;
}> : Extract<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>[number], {
  Method: _parameters['method'];
}>['ReturnType'] : raw extends true ? OneOf$1<{
  result: unknown;
} | {
  error: ErrorObject;
}> : unknown)>(args: _parameters, options?: EIP1193RequestOptions | undefined) => Promise<_returnType>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/clients/transports/createTransport.d.ts
type TransportConfig<type$1 extends string = string, eip1193RequestFn extends EIP1193RequestFn$1 = EIP1193RequestFn$1> = {
  /** The name of the transport. */
  name: string;
  /** The key of the transport. */
  key: string;
  /** Methods to include or exclude from executing RPC requests. */
  methods?: OneOf$1<{
    include?: string[] | undefined;
  } | {
    exclude?: string[] | undefined;
  }> | undefined;
  /** The JSON-RPC request function that matches the EIP-1193 request spec. */
  request: eip1193RequestFn;
  /** The base delay (in ms) between retries. */
  retryDelay?: number | undefined;
  /** The max number of times to retry. */
  retryCount?: number | undefined;
  /** The timeout (in ms) for requests. */
  timeout?: number | undefined;
  /** The type of the transport. */
  type: type$1;
};
type Transport$2<type$1 extends string = string, rpcAttributes = Record<string, any>, eip1193RequestFn extends EIP1193RequestFn$1 = EIP1193RequestFn$1> = <chain$1 extends Chain$1 | undefined = Chain$1>({
  chain: chain$1
}: {
  account?: Account$1 | undefined;
  chain?: chain$1 | undefined;
  pollingInterval?: ClientConfig$1['pollingInterval'] | undefined;
  retryCount?: TransportConfig['retryCount'] | undefined;
  timeout?: TransportConfig['timeout'] | undefined;
}) => {
  config: TransportConfig<type$1>;
  request: eip1193RequestFn;
  value?: rpcAttributes | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/typedData.d.ts
type TypedDataDefinition<typedData extends TypedData | Record<string, unknown> = TypedData, primaryType$1 extends keyof typedData | 'EIP712Domain' = keyof typedData, primaryTypes = (typedData extends TypedData ? keyof typedData : string)> = primaryType$1 extends 'EIP712Domain' ? EIP712DomainDefinition<typedData, primaryType$1> : MessageDefinition<typedData, primaryType$1, 'message', primaryTypes>;
type MessageDefinition<typedData extends TypedData | Record<string, unknown> = TypedData, primaryType$1 extends keyof typedData = keyof typedData, messageKey extends string = 'message', primaryTypes = (typedData extends TypedData ? keyof typedData : string), schema extends Record<string, unknown> = (typedData extends TypedData ? TypedDataToPrimitiveTypes<typedData> : Record<string, unknown>), message$1 = schema[primaryType$1 extends keyof schema ? primaryType$1 : keyof schema]> = {
  types: typedData;
} & {
  primaryType: primaryTypes | (primaryType$1 extends primaryTypes ? primaryType$1 : never);
  domain?: (schema extends {
    EIP712Domain: infer domain;
  } ? domain : Prettify<TypedDataDomain$1>) | undefined;
} & { [k in messageKey]: {
  [_: string]: any;
} extends message$1 ? Record<string, unknown> : message$1 };
type EIP712DomainDefinition<typedData extends TypedData | Record<string, unknown> = TypedData, primaryType$1 extends 'EIP712Domain' = 'EIP712Domain', schema extends Record<string, unknown> = (typedData extends TypedData ? TypedDataToPrimitiveTypes<typedData> : Record<string, unknown>)> = {
  types?: typedData | undefined;
} & {
  primaryType: 'EIP712Domain' | primaryType$1;
  domain: schema extends {
    EIP712Domain: infer domain;
  } ? domain : Prettify<TypedDataDomain$1>;
  message?: undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/nonceManager.d.ts
type FunctionParameters = {
  address: Address$2;
  chainId: number;
};
type NonceManager = {
  /** Get and increment a nonce. */
  consume: (parameters: FunctionParameters & {
    client: Client$1;
  }) => Promise<number>;
  /** Increment a nonce. */
  increment: (chainId: FunctionParameters) => void;
  /** Get a nonce. */
  get: (chainId: FunctionParameters & {
    client: Client$1;
  }) => Promise<number>;
  /** Reset a nonce. */
  reset: (chainId: FunctionParameters) => void;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/account-abstraction/accounts/types.d.ts
type Call$1 = {
  to: Hex$1;
  data?: Hex$1 | undefined;
  value?: bigint | undefined;
};
type SmartAccountImplementation<entryPointAbi extends Abi | readonly unknown[] = Abi, entryPointVersion extends EntryPointVersion = EntryPointVersion, extend extends object = object, eip7702 extends boolean = boolean> = {
  /** Client used to retrieve Smart Account data, and perform signing (if owner is a JSON-RPC Account). */
  client: Client$1<Transport$2, Chain$1 | undefined, JsonRpcAccount | LocalAccount | undefined>;
  /** Compatible EntryPoint of the Smart Account. */
  entryPoint: {
    /** Compatible EntryPoint ABI. */
    abi: entryPointAbi;
    /** Compatible EntryPoint address. */
    address: Address$2;
    /** Compatible EntryPoint version. */
    version: entryPointVersion;
  };
  /** Extend the Smart Account with custom properties. */
  extend?: extend | undefined;
  /**
   * Retrieves the Smart Account's address.
   *
   * @example
   * ```ts
   * const address = await account.getAddress()
   * // '0x...'
   * ```
   */
  getAddress: () => Promise<Address$2>;
  /**
   * Decodes calldata into structured calls.
   *
   * @example
   * ```ts
   * const calls = await account.decodeCalls('0x...')
   * // [{ to: '0x...', data: '0x...', value: 100n }, ...]
   * ```
   */
  decodeCalls?: ((data: Hex$1) => Promise<readonly Call$1[]>) | undefined;
  /**
   * Encodes the calls into calldata for executing a User Operation.
   *
   * @example
   * ```ts
   * const callData = await account.encodeCalls([
   *   { to: '0x...', data: '0x...' },
   *   { to: '0x...', data: '0x...', value: 100n },
   * ])
   * // '0x...'
   * ```
   */
  encodeCalls: (calls: readonly Call$1[]) => Promise<Hex$1>;
  /**
   * Retrieves the calldata for factory call to deploy a Smart Account.
   * If the Smart Account has already been deployed, this will return undefined values.
   *
   * @example Counterfactual account
   * ```ts
   * const { factory, factoryData } = await account.getFactoryArgs()
   * // { factory: '0x...', factoryData: '0x...' }
   * ```
   *
   * @example Deployed account
   * ```ts
   * const { factory, factoryData } = await account.getFactoryArgs()
   * // { factory: undefined, factoryData: undefined }
   * ```
   */
  getFactoryArgs: () => Promise<{
    factory?: Address$2 | undefined;
    factoryData?: Hex$1 | undefined;
  }>;
  /**
   * Retrieves the nonce of the Account.
   *
   * @example
   * ```ts
   * const nonce = await account.getNonce()
   * // 1n
   * ```
   */
  getNonce?: ((parameters?: {
    key?: bigint | undefined;
  } | undefined) => Promise<bigint>) | undefined;
  /**
   * Retrieves the User Operation "stub" signature for gas estimation.
   *
   * ```ts
   * const signature = await account.getStubSignature()
   * // '0x...'
   * ```
   */
  getStubSignature: (parameters?: UserOperationRequest | undefined) => Promise<Hex$1>;
  /** Custom nonce key manager. */
  nonceKeyManager?: NonceManager | undefined;
  /**
   * Signs a hash via the Smart Account's owner.
   *
   * @example
   * ```ts
   * const signature = await account.sign({
   *   hash: '0x...'
   * })
   * // '0x...'
   * ```
   */
  sign?: ((parameters: {
    hash: Hash$1;
  }) => Promise<Hex$1>) | undefined;
  /**
   * Signs a [EIP-191 Personal Sign message](https://eips.ethereum.org/EIPS/eip-191).
   *
   * @example
   * ```ts
   * const signature = await account.signMessage({
   *   message: 'Hello, World!'
   * })
   * // '0x...'
   * ```
   */
  signMessage: (parameters: {
    message: SignableMessage;
  }) => Promise<Hex$1>;
  /**
   * Signs [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712).
   *
   * @example
   * ```ts
   * const signature = await account.signTypedData({
   *   domain,
   *   types,
   *   primaryType: 'Mail',
   *   message,
   * })
   * ```
   */
  signTypedData: <const typedData extends TypedData | Record<string, unknown>, primaryType$1 extends keyof typedData | 'EIP712Domain' = keyof typedData>(parameters: TypedDataDefinition<typedData, primaryType$1>) => Promise<Hex$1>;
  /**
   * Signs the User Operation.
   *
   * @example
   * ```ts
   * const signature = await account.signUserOperation({
   *   chainId: 1,
   *   userOperation,
   * })
   * ```
   */
  signUserOperation: (parameters: UnionPartialBy<UserOperation, 'sender'> & {
    chainId?: number | undefined;
  }) => Promise<Hex$1>;
  /** User Operation configuration properties. */
  userOperation?: {
    /** Prepares gas properties for the User Operation request. */
    estimateGas?: ((userOperation: UserOperationRequest) => Promise<ExactPartial$1<EstimateUserOperationGasReturnType> | undefined>) | undefined;
  } | undefined;
} & (eip7702 extends true ? {
  /** EIP-7702 authorization properties, if applicable. */
  authorization: {
    /** EOA to delegate to. */
    account: PrivateKeyAccount;
    /** Delegation address. */
    address: Address$2;
  };
} : {
  authorization?: undefined;
});
type SmartAccount<implementation extends SmartAccountImplementation = SmartAccountImplementation> = Assign<implementation['extend'], Assign<implementation, {
  /** Address of the Smart Account. */
  address: Address$2;
  /**
   * Retrieves the nonce of the Account.
   *
   * @example
   * ```ts
   * const nonce = await account.getNonce()
   * // 1n
   * ```
   */
  getNonce: NonNullable<SmartAccountImplementation['getNonce']>;
  /** Whether or not the Smart Account has been deployed. */
  isDeployed: () => Promise<boolean>;
  /** Type of account. */
  type: 'smart';
}>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/accounts/utils/parseAccount.d.ts
type ParseAccountErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/data/isHex.d.ts
type IsHexErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/data.d.ts
type SliceOffsetOutOfBoundsErrorType = SliceOffsetOutOfBoundsError & {
  name: 'SliceOffsetOutOfBoundsError';
};
declare class SliceOffsetOutOfBoundsError extends BaseError$2 {
  constructor({
    offset,
    position,
    size
  }: {
    offset: number;
    position: 'start' | 'end';
    size: number;
  });
}
type SizeExceedsPaddingSizeErrorType = SizeExceedsPaddingSizeError & {
  name: 'SizeExceedsPaddingSizeError';
};
declare class SizeExceedsPaddingSizeError extends BaseError$2 {
  constructor({
    size,
    targetSize,
    type
  }: {
    size: number;
    targetSize: number;
    type: 'hex' | 'bytes';
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/data/pad.d.ts
type PadErrorType = PadHexErrorType | PadBytesErrorType | ErrorType$2;
type PadHexErrorType = SizeExceedsPaddingSizeErrorType | ErrorType$2;
type PadBytesErrorType = SizeExceedsPaddingSizeErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/encoding.d.ts
type IntegerOutOfRangeErrorType = IntegerOutOfRangeError & {
  name: 'IntegerOutOfRangeError';
};
declare class IntegerOutOfRangeError extends BaseError$2 {
  constructor({
    max,
    min,
    signed,
    size,
    value
  }: {
    max?: string | undefined;
    min: string;
    signed?: boolean | undefined;
    size?: number | undefined;
    value: string;
  });
}
type SizeOverflowErrorType = SizeOverflowError & {
  name: 'SizeOverflowError';
};
declare class SizeOverflowError extends BaseError$2 {
  constructor({
    givenSize,
    maxSize
  }: {
    givenSize: number;
    maxSize: number;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/data/size.d.ts
type SizeErrorType = IsHexErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/encoding/fromHex.d.ts
type AssertSizeErrorType = SizeOverflowErrorType | SizeErrorType | ErrorType$2;
type HexToBigIntErrorType = AssertSizeErrorType | ErrorType$2;
type HexToNumberErrorType = HexToBigIntErrorType | IntegerOutOfRangeErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/encoding/toHex.d.ts
type ToHexErrorType = BoolToHexErrorType | BytesToHexErrorType | NumberToHexErrorType | StringToHexErrorType | ErrorType$2;
type BoolToHexErrorType = AssertSizeErrorType | PadErrorType | ErrorType$2;
type BytesToHexErrorType = AssertSizeErrorType | PadErrorType | ErrorType$2;
type NumberToHexErrorType = IntegerOutOfRangeErrorType | PadErrorType | ErrorType$2;
type StringToHexErrorType = BytesToHexErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/encoding/toBytes.d.ts
type ToBytesErrorType = NumberToBytesErrorType | BoolToBytesErrorType | HexToBytesErrorType | StringToBytesErrorType | IsHexErrorType | ErrorType$2;
type BoolToBytesErrorType = AssertSizeErrorType | PadErrorType | ErrorType$2;
type HexToBytesErrorType = AssertSizeErrorType | PadErrorType | ErrorType$2;
type NumberToBytesErrorType = NumberToHexErrorType | HexToBytesErrorType | ErrorType$2;
type StringToBytesErrorType = AssertSizeErrorType | PadErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/hash/keccak256.d.ts
type Keccak256ErrorType = IsHexErrorType | ToBytesErrorType | ToHexErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/abi.d.ts
type AbiEncodingArrayLengthMismatchErrorType = AbiEncodingArrayLengthMismatchError & {
  name: 'AbiEncodingArrayLengthMismatchError';
};
declare class AbiEncodingArrayLengthMismatchError extends BaseError$2 {
  constructor({
    expectedLength,
    givenLength,
    type
  }: {
    expectedLength: number;
    givenLength: number;
    type: string;
  });
}
type AbiEncodingBytesSizeMismatchErrorType = AbiEncodingBytesSizeMismatchError & {
  name: 'AbiEncodingBytesSizeMismatchError';
};
declare class AbiEncodingBytesSizeMismatchError extends BaseError$2 {
  constructor({
    expectedSize,
    value
  }: {
    expectedSize: number;
    value: Hex$1;
  });
}
type AbiEncodingLengthMismatchErrorType = AbiEncodingLengthMismatchError & {
  name: 'AbiEncodingLengthMismatchError';
};
declare class AbiEncodingLengthMismatchError extends BaseError$2 {
  constructor({
    expectedLength,
    givenLength
  }: {
    expectedLength: number;
    givenLength: number;
  });
}
type AbiFunctionNotFoundErrorType = AbiFunctionNotFoundError & {
  name: 'AbiFunctionNotFoundError';
};
declare class AbiFunctionNotFoundError extends BaseError$2 {
  constructor(functionName?: string | undefined, {
    docsPath
  }?: {
    docsPath?: string | undefined;
  });
}
type AbiItemAmbiguityErrorType = AbiItemAmbiguityError & {
  name: 'AbiItemAmbiguityError';
};
declare class AbiItemAmbiguityError extends BaseError$2 {
  constructor(x: {
    abiItem: Abi[number];
    type: string;
  }, y: {
    abiItem: Abi[number];
    type: string;
  });
}
type InvalidAbiEncodingTypeErrorType = InvalidAbiEncodingTypeError & {
  name: 'InvalidAbiEncodingTypeError';
};
declare class InvalidAbiEncodingTypeError extends BaseError$2 {
  constructor(type: string, {
    docsPath
  }: {
    docsPath: string;
  });
}
type InvalidArrayErrorType = InvalidArrayError & {
  name: 'InvalidArrayError';
};
declare class InvalidArrayError extends BaseError$2 {
  constructor(value: unknown);
}
type InvalidDefinitionTypeErrorType = InvalidDefinitionTypeError & {
  name: 'InvalidDefinitionTypeError';
};
declare class InvalidDefinitionTypeError extends BaseError$2 {
  constructor(type: string);
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/address/isAddress.d.ts
type IsAddressErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/cursor.d.ts
type NegativeOffsetErrorType = NegativeOffsetError & {
  name: 'NegativeOffsetError';
};
declare class NegativeOffsetError extends BaseError$2 {
  constructor({
    offset
  }: {
    offset: number;
  });
}
type PositionOutOfBoundsErrorType = PositionOutOfBoundsError & {
  name: 'PositionOutOfBoundsError';
};
declare class PositionOutOfBoundsError extends BaseError$2 {
  constructor({
    length,
    position
  }: {
    length: number;
    position: number;
  });
}
type RecursiveReadLimitExceededErrorType = RecursiveReadLimitExceededError & {
  name: 'RecursiveReadLimitExceededError';
};
declare class RecursiveReadLimitExceededError extends BaseError$2 {
  constructor({
    count,
    limit
  }: {
    count: number;
    limit: number;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/cursor.d.ts
type CursorErrorType = CursorAssertPositionErrorType | CursorDecrementPositionErrorType | CursorIncrementPositionErrorType | ErrorType$2;
type CursorAssertPositionErrorType = PositionOutOfBoundsErrorType | ErrorType$2;
type CursorDecrementPositionErrorType = NegativeOffsetErrorType | ErrorType$2;
type CursorIncrementPositionErrorType = NegativeOffsetErrorType | ErrorType$2;
type StaticCursorErrorType = NegativeOffsetErrorType | RecursiveReadLimitExceededErrorType;
type CreateCursorErrorType = CursorErrorType | StaticCursorErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/data/slice.d.ts
type SliceErrorType = IsHexErrorType | SliceBytesErrorType | SliceHexErrorType | ErrorType$2;
type AssertStartOffsetErrorType = SliceOffsetOutOfBoundsErrorType | SizeErrorType | ErrorType$2;
type AssertEndOffsetErrorType = SliceOffsetOutOfBoundsErrorType | SizeErrorType | ErrorType$2;
type SliceBytesErrorType = AssertStartOffsetErrorType | AssertEndOffsetErrorType | ErrorType$2;
type SliceHexErrorType = AssertStartOffsetErrorType | AssertEndOffsetErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/hash/hashSignature.d.ts
type HashSignatureErrorType = Keccak256ErrorType | ToBytesErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/hash/normalizeSignature.d.ts
type NormalizeSignatureErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/hash/toSignature.d.ts
type ToSignatureErrorType = NormalizeSignatureErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/hash/toSignatureHash.d.ts
type ToSignatureHashErrorType = HashSignatureErrorType | ToSignatureErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/hash/toFunctionSelector.d.ts
type ToFunctionSelectorErrorType = ToSignatureHashErrorType | SliceErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/abi/getAbiItem.d.ts
type GetAbiItemErrorType = IsArgOfTypeErrorType | IsHexErrorType | ToFunctionSelectorErrorType | AbiItemAmbiguityErrorType | ErrorType$2;
type IsArgOfTypeErrorType = IsAddressErrorType | ErrorType$2;
/** @internal */
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/data/concat.d.ts
type ConcatErrorType = ConcatBytesErrorType | ConcatHexErrorType | ErrorType$2;
type ConcatBytesErrorType = ErrorType$2;
type ConcatHexErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/address.d.ts
type InvalidAddressErrorType = InvalidAddressError$1 & {
  name: 'InvalidAddressError';
};
declare class InvalidAddressError$1 extends BaseError$2 {
  constructor({
    address
  }: {
    address: string;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/abi/encodeAbiParameters.d.ts
type EncodeAbiParametersErrorType = AbiEncodingLengthMismatchErrorType | PrepareParamsErrorType | EncodeParamsErrorType | ErrorType$2;
type PrepareParamsErrorType = PrepareParamErrorType | ErrorType$2;
type PrepareParamErrorType = EncodeAddressErrorType | EncodeArrayErrorType | EncodeBytesErrorType | EncodeBoolErrorType | EncodeNumberErrorType | EncodeStringErrorType | EncodeTupleErrorType | GetArrayComponentsErrorType | InvalidAbiEncodingTypeErrorType | ErrorType$2;
type EncodeParamsErrorType = NumberToHexErrorType | SizeErrorType | ErrorType$2;
type EncodeAddressErrorType = InvalidAddressErrorType | IsAddressErrorType | ErrorType$2;
type EncodeArrayErrorType = AbiEncodingArrayLengthMismatchErrorType | ConcatErrorType | EncodeParamsErrorType | InvalidArrayErrorType | NumberToHexErrorType | ErrorType$2;
type EncodeBytesErrorType = AbiEncodingBytesSizeMismatchErrorType | ConcatErrorType | PadHexErrorType | NumberToHexErrorType | SizeErrorType | ErrorType$2;
type EncodeBoolErrorType = PadHexErrorType | BoolToHexErrorType | ErrorType$2;
type EncodeNumberErrorType = NumberToHexErrorType | ErrorType$2;
type EncodeStringErrorType = ConcatErrorType | NumberToHexErrorType | PadHexErrorType | SizeErrorType | SliceErrorType | StringToHexErrorType | ErrorType$2;
type EncodeTupleErrorType = ConcatErrorType | EncodeParamsErrorType | ErrorType$2;
type GetArrayComponentsErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/abi/formatAbiItem.d.ts
type FormatAbiItemErrorType = FormatAbiParamsErrorType | InvalidDefinitionTypeErrorType | ErrorType$2;
type FormatAbiParamsErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts
type EncodeFunctionDataErrorType = AbiFunctionNotFoundErrorType | ConcatHexErrorType | EncodeAbiParametersErrorType | FormatAbiItemErrorType | GetAbiItemErrorType | ToFunctionSelectorErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/chain.d.ts
type ChainMismatchErrorType = ChainMismatchError$1 & {
  name: 'ChainMismatchError';
};
declare class ChainMismatchError$1 extends BaseError$2 {
  constructor({
    chain,
    currentChainId
  }: {
    chain: Chain$1;
    currentChainId: number;
  });
}
type ChainNotFoundErrorType = ChainNotFoundError$1 & {
  name: 'ChainNotFoundError';
};
declare class ChainNotFoundError$1 extends BaseError$2 {
  constructor();
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/stateOverride.d.ts
type StateMapping = Array<{
  slot: Hex$1;
  value: Hex$1;
}>;
type StateOverride = Array<{
  address: Address$2;
  balance?: bigint | undefined;
  nonce?: number | undefined;
  code?: Hex$1 | undefined;
} & OneOf$1<{
  /** Fake key-value mapping to override all slots in the account storage before executing the call. */
  state?: StateMapping | undefined;
} | {
  /** Fake key-value mapping to override individual slots in the account storage before executing the call. */
  stateDiff?: StateMapping | undefined;
}>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/node.d.ts
/**
 * geth:    https://github.com/ethereum/go-ethereum/blob/master/core/error.go
 *          https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go#L34-L41
 *
 * erigon:  https://github.com/ledgerwatch/erigon/blob/master/core/error.go
 *          https://github.com/ledgerwatch/erigon/blob/master/core/types/transaction.go#L41-L46
 *
 * anvil:   https://github.com/foundry-rs/foundry/blob/master/anvil/src/eth/error.rs#L108
 */
type ExecutionRevertedErrorType = ExecutionRevertedError & {
  code: 3;
  name: 'ExecutionRevertedError';
};
declare class ExecutionRevertedError extends BaseError$2 {
  static code: number;
  static nodeMessage: RegExp;
  constructor({
    cause,
    message
  }?: {
    cause?: BaseError$2 | undefined;
    message?: string | undefined;
  });
}
type FeeCapTooHighErrorType = FeeCapTooHighError$1 & {
  name: 'FeeCapTooHighError';
};
declare class FeeCapTooHighError$1 extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    maxFeePerGas
  }?: {
    cause?: BaseError$2 | undefined;
    maxFeePerGas?: bigint | undefined;
  });
}
type FeeCapTooLowErrorType = FeeCapTooLowError$1 & {
  name: 'FeeCapTooLowError';
};
declare class FeeCapTooLowError$1 extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    maxFeePerGas
  }?: {
    cause?: BaseError$2 | undefined;
    maxFeePerGas?: bigint | undefined;
  });
}
type NonceTooHighErrorType = NonceTooHighError & {
  name: 'NonceTooHighError';
};
declare class NonceTooHighError extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    nonce
  }?: {
    cause?: BaseError$2 | undefined;
    nonce?: number | undefined;
  });
}
type NonceTooLowErrorType = NonceTooLowError$1 & {
  name: 'NonceTooLowError';
};
declare class NonceTooLowError$1 extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    nonce
  }?: {
    cause?: BaseError$2 | undefined;
    nonce?: number | undefined;
  });
}
type NonceMaxValueErrorType = NonceMaxValueError & {
  name: 'NonceMaxValueError';
};
declare class NonceMaxValueError extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    nonce
  }?: {
    cause?: BaseError$2 | undefined;
    nonce?: number | undefined;
  });
}
type InsufficientFundsErrorType = InsufficientFundsError$1 & {
  name: 'InsufficientFundsError';
};
declare class InsufficientFundsError$1 extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause
  }?: {
    cause?: BaseError$2 | undefined;
  });
}
type IntrinsicGasTooHighErrorType = IntrinsicGasTooHighError$1 & {
  name: 'IntrinsicGasTooHighError';
};
declare class IntrinsicGasTooHighError$1 extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    gas
  }?: {
    cause?: BaseError$2 | undefined;
    gas?: bigint | undefined;
  });
}
type IntrinsicGasTooLowErrorType = IntrinsicGasTooLowError$1 & {
  name: 'IntrinsicGasTooLowError';
};
declare class IntrinsicGasTooLowError$1 extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    gas
  }?: {
    cause?: BaseError$2 | undefined;
    gas?: bigint | undefined;
  });
}
type TransactionTypeNotSupportedErrorType = TransactionTypeNotSupportedError & {
  name: 'TransactionTypeNotSupportedError';
};
declare class TransactionTypeNotSupportedError extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause
  }: {
    cause?: BaseError$2 | undefined;
  });
}
type TipAboveFeeCapErrorType = TipAboveFeeCapError & {
  name: 'TipAboveFeeCapError';
};
declare class TipAboveFeeCapError extends BaseError$2 {
  static nodeMessage: RegExp;
  constructor({
    cause,
    maxPriorityFeePerGas,
    maxFeePerGas
  }?: {
    cause?: BaseError$2 | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
  });
}
type UnknownNodeErrorType = UnknownNodeError & {
  name: 'UnknownNodeError';
};
declare class UnknownNodeError extends BaseError$2 {
  constructor({
    cause
  }: {
    cause?: BaseError$2 | undefined;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/errors/getNodeError.d.ts
type GetNodeErrorReturnType = ExecutionRevertedErrorType | FeeCapTooHighErrorType | FeeCapTooLowErrorType | NonceTooHighErrorType | NonceTooLowErrorType | NonceMaxValueErrorType | InsufficientFundsErrorType | IntrinsicGasTooHighErrorType | IntrinsicGasTooLowErrorType | TransactionTypeNotSupportedErrorType | TipAboveFeeCapErrorType | UnknownNodeErrorType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/formatters/transactionRequest.d.ts
type FormattedTransactionRequest<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = ExtractChainFormatterParameters<chain$1, 'transactionRequest', TransactionRequest>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/transaction/assertRequest.d.ts
type AssertRequestErrorType = InvalidAddressErrorType | FeeConflictErrorType | FeeCapTooHighErrorType | ParseAccountErrorType | TipAboveFeeCapErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/call.d.ts
type CallParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = UnionOmit<FormattedCall<chain$1>, 'from'> & {
  /** Account attached to the call (msg.sender). */
  account?: Account$1 | Address$2 | undefined;
  /** Whether or not to enable multicall batching on this call. */
  batch?: boolean | undefined;
  /** Block overrides for the call. */
  blockOverrides?: BlockOverrides | undefined;
  /** Bytecode to perform the call on. */
  code?: Hex$1 | undefined;
  /** Contract deployment factory address (ie. Create2 factory, Smart Account factory, etc). */
  factory?: Address$2 | undefined;
  /** Calldata to execute on the factory to deploy the contract. */
  factoryData?: Hex$1 | undefined;
  /** State overrides for the call. */
  stateOverride?: StateOverride | undefined;
} & ({
  /** The balance of the account at a block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /**
   * The balance of the account at a block tag.
   * @default 'latest'
   */
  blockTag?: BlockTag | undefined;
});
type FormattedCall<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = FormattedTransactionRequest<chain$1>;
type CallReturnType = {
  data: Hex$1 | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/abi/decodeErrorResult.d.ts
type DecodeErrorResultReturnType<abi$1 extends Abi | readonly unknown[] = Abi, allErrorNames extends ContractErrorName<abi$1> = ContractErrorName<abi$1>> = IsNarrowable<abi$1, Abi> extends true ? UnionEvaluate<{ [errorName in allErrorNames]: {
  abiItem: abi$1 extends Abi ? Abi extends abi$1 ? AbiItem : ExtractAbiError<abi$1, errorName> : AbiItem;
  args: ContractErrorArgs<abi$1, errorName>;
  errorName: errorName;
} }[allErrorNames]> : {
  abiItem: AbiItem;
  args: readonly unknown[] | undefined;
  errorName: string;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/contract.d.ts
type ContractFunctionExecutionErrorType = ContractFunctionExecutionError$1 & {
  name: 'ContractFunctionExecutionError';
};
declare class ContractFunctionExecutionError$1 extends BaseError$2 {
  abi: Abi;
  args?: unknown[] | undefined;
  cause: BaseError$2;
  contractAddress?: Address$2 | undefined;
  formattedArgs?: string | undefined;
  functionName: string;
  sender?: Address$2 | undefined;
  constructor(cause: BaseError$2, {
    abi,
    args,
    contractAddress,
    docsPath,
    functionName,
    sender
  }: {
    abi: Abi;
    args?: any | undefined;
    contractAddress?: Address$2 | undefined;
    docsPath?: string | undefined;
    functionName: string;
    sender?: Address$2 | undefined;
  });
}
type ContractFunctionRevertedErrorType = ContractFunctionRevertedError$1 & {
  name: 'ContractFunctionRevertedError';
};
declare class ContractFunctionRevertedError$1 extends BaseError$2 {
  data?: DecodeErrorResultReturnType | undefined;
  raw?: Hex$1 | undefined;
  reason?: string | undefined;
  signature?: Hex$1 | undefined;
  constructor({
    abi,
    data,
    functionName,
    message
  }: {
    abi: Abi;
    data?: Hex$1 | undefined;
    functionName: string;
    message?: string | undefined;
  });
}
type ContractFunctionZeroDataErrorType = ContractFunctionZeroDataError$1 & {
  name: 'ContractFunctionZeroDataError';
};
declare class ContractFunctionZeroDataError$1 extends BaseError$2 {
  constructor({
    functionName
  }: {
    functionName: string;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/errors/getContractError.d.ts
type GetContractErrorReturnType<cause$1 = ErrorType$2> = Omit<ContractFunctionExecutionErrorType, 'cause'> & {
  cause: cause$1 | ContractFunctionZeroDataErrorType | ContractFunctionRevertedErrorType;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/readContract.d.ts
type ReadContractParameters<abi$1 extends Abi | readonly unknown[] = Abi, functionName$1 extends ContractFunctionName<abi$1, 'pure' | 'view'> = ContractFunctionName<abi$1, 'pure' | 'view'>, args$1 extends ContractFunctionArgs<abi$1, 'pure' | 'view', functionName$1> = ContractFunctionArgs<abi$1, 'pure' | 'view', functionName$1>> = UnionEvaluate<Pick<CallParameters, 'account' | 'authorizationList' | 'blockNumber' | 'blockOverrides' | 'blockTag' | 'factory' | 'factoryData' | 'stateOverride'>> & ContractFunctionParameters<abi$1, 'pure' | 'view', functionName$1, args$1, boolean>;
type ReadContractReturnType<abi$1 extends Abi | readonly unknown[] = Abi, functionName$1 extends ContractFunctionName<abi$1, 'pure' | 'view'> = ContractFunctionName<abi$1, 'pure' | 'view'>, args$1 extends ContractFunctionArgs<abi$1, 'pure' | 'view', functionName$1> = ContractFunctionArgs<abi$1, 'pure' | 'view', functionName$1>> = ContractFunctionReturnType<abi$1, 'pure' | 'view', functionName$1, args$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/ens/getEnsAddress.d.ts
type GetEnsAddressParameters = Prettify<Pick<ReadContractParameters, 'blockNumber' | 'blockTag'> & {
  /**
   * ENSIP-9 compliant coinType (chain) to get ENS address for.
   *
   * To get the `coinType` for a chain id, use the `toCoinType` function:
   * ```ts
   * import { toCoinType } from 'viem'
   * import { base } from 'viem/chains'
   *
   * const coinType = toCoinType(base.id)
   * ```
   *
   * @default 60n
   */
  coinType?: bigint | undefined;
  /**
   * Universal Resolver gateway URLs to use for resolving CCIP-read requests.
   */
  gatewayUrls?: string[] | undefined;
  /**
   * Name to get the address for.
   */
  name: string;
  /**
   * Whether or not to throw errors propagated from the ENS Universal Resolver Contract.
   */
  strict?: boolean | undefined;
  /**
   * Address of ENS Universal Resolver Contract.
   */
  universalResolverAddress?: Address$2 | undefined;
}>;
type GetEnsAddressReturnType = Address$2 | null;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/ens.d.ts
type AssetGateway = 'ipfs' | 'arweave';
type AssetGatewayUrls = { [_key in AssetGateway]?: string | undefined };
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/ens/getEnsText.d.ts
type GetEnsTextParameters = Prettify<Pick<ReadContractParameters, 'blockNumber' | 'blockTag'> & {
  /** ENS name to get Text for. */
  name: string;
  /** Universal Resolver gateway URLs to use for resolving CCIP-read requests. */
  gatewayUrls?: string[] | undefined;
  /** Text record to retrieve. */
  key: string;
  /** Whether or not to throw errors propagated from the ENS Universal Resolver Contract. */
  strict?: boolean | undefined;
  /** Address of ENS Universal Resolver Contract. */
  universalResolverAddress?: Address$2 | undefined;
}>;
type GetEnsTextReturnType = string | null;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/ens/getEnsAvatar.d.ts
type GetEnsAvatarParameters = Prettify<Omit<GetEnsTextParameters, 'key'> & {
  /** Gateway urls to resolve IPFS and/or Arweave assets. */
  assetGatewayUrls?: AssetGatewayUrls | undefined;
}>;
type GetEnsAvatarReturnType = string | null;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/ens/getEnsName.d.ts
type GetEnsNameParameters = Prettify<Pick<ReadContractParameters, 'blockNumber' | 'blockTag'> & {
  /**
   * Address to get ENS name for.
   */
  address: Address$2;
  /**
   * ENSIP-9 compliant coinType (chain) to get ENS name for.
   *
   * To get the `coinType` for a chain id, use the `toCoinType` function:
   * ```ts
   * import { toCoinType } from 'viem'
   * import { base } from 'viem/chains'
   *
   * const coinType = toCoinType(base.id)
   * ```
   *
   * @default 60n
   */
  coinType?: bigint | undefined;
  /**
   * Universal Resolver gateway URLs to use for resolving CCIP-read requests.
   */
  gatewayUrls?: string[] | undefined;
  /**
   * Whether or not to throw errors propagated from the ENS Universal Resolver Contract.
   */
  strict?: boolean | undefined;
  /**
   * Address of ENS Universal Resolver Contract.
   */
  universalResolverAddress?: Address$2 | undefined;
}>;
type GetEnsNameReturnType = string | null;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/ens/getEnsResolver.d.ts
type GetEnsResolverParameters = Prettify<Pick<ReadContractParameters, 'blockNumber' | 'blockTag'> & {
  /** Name to get the address for. */
  name: string;
  /** Address of ENS Universal Resolver Contract. */
  universalResolverAddress?: Address$2 | undefined;
}>;
type GetEnsResolverReturnType = Address$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/filter.d.ts
type FilterType = 'transaction' | 'block' | 'event';
type FilterRpcSchema = Filter$1<PublicRpcSchema, {
  Method: 'eth_getFilterLogs' | 'eth_getFilterChanges' | 'eth_uninstallFilter';
}>;
type Filter<filterType extends FilterType = 'event', abi$1 extends Abi | readonly unknown[] | undefined = undefined, eventName$1 extends string | undefined = undefined, args$1 extends MaybeExtractEventArgsFromAbi<abi$1, eventName$1> | undefined = MaybeExtractEventArgsFromAbi<abi$1, eventName$1>, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined> = {
  id: Hex$1;
  request: EIP1193RequestFn$1<FilterRpcSchema>;
  type: filterType;
} & (filterType extends 'event' ? {
  fromBlock?: fromBlock$1 | undefined;
  toBlock?: toBlock | undefined;
} & (abi$1 extends Abi ? undefined extends eventName$1 ? {
  abi: abi$1;
  args?: undefined;
  eventName?: undefined;
  strict: strict$1;
} : args$1 extends MaybeExtractEventArgsFromAbi<abi$1, eventName$1> ? {
  abi: abi$1;
  args: args$1;
  eventName: eventName$1;
  strict: strict$1;
} : {
  abi: abi$1;
  args?: undefined;
  eventName: eventName$1;
  strict: strict$1;
} : {
  abi?: undefined;
  args?: undefined;
  eventName?: undefined;
  strict?: undefined;
}) : {});
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/createContractEventFilter.d.ts
type CreateContractEventFilterParameters<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> | undefined = undefined, args$1 extends MaybeExtractEventArgsFromAbi<abi$1, eventName$1> | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined> = {
  address?: Address$2 | Address$2[] | undefined;
  abi: abi$1;
  eventName?: eventName$1 | ContractEventName<abi$1> | undefined;
  fromBlock?: fromBlock$1 | BlockNumber | BlockTag | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments in the event ABI item.
   * @default false
   */
  strict?: strict$1 | boolean | undefined;
  toBlock?: toBlock | BlockNumber | BlockTag | undefined;
} & (undefined extends eventName$1 ? {
  args?: undefined;
} : MaybeExtractEventArgsFromAbi<abi$1, eventName$1> extends infer eventFilterArgs ? {
  args?: eventFilterArgs | (args$1 extends eventFilterArgs ? args$1 : never) | undefined;
} : {
  args?: undefined;
});
type CreateContractEventFilterReturnType<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> | undefined = undefined, args$1 extends MaybeExtractEventArgsFromAbi<abi$1, eventName$1> | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined> = Filter<'event', abi$1, eventName$1, args$1, strict$1, fromBlock$1, toBlock>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/signature/recoverAddress.d.ts
type RecoverAddressErrorType = ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/encoding/toRlp.d.ts
type ToRlpErrorType = CreateCursorErrorType | BytesToHexErrorType | HexToBytesErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/authorization/hashAuthorization.d.ts
type HashAuthorizationErrorType = Keccak256ErrorType | ConcatHexErrorType | ToRlpErrorType | NumberToHexErrorType | HexToBytesErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/authorization/recoverAuthorizationAddress.d.ts
type RecoverAuthorizationAddressErrorType = HashAuthorizationErrorType | RecoverAddressErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/estimateGas.d.ts
type EstimateGasExecutionErrorType = EstimateGasExecutionError & {
  name: 'EstimateGasExecutionError';
};
declare class EstimateGasExecutionError extends BaseError$2 {
  cause: BaseError$2;
  constructor(cause: BaseError$2, {
    account,
    docsPath,
    chain,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value
  }: Omit<EstimateGasParameters<any>, 'account'> & {
    account?: Account$1 | undefined;
    chain?: Chain$1 | undefined;
    docsPath?: string | undefined;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/errors/getEstimateGasError.d.ts
type GetEstimateGasErrorReturnType<cause$1 = ErrorType$2> = Omit<EstimateGasExecutionErrorType, 'cause'> & {
  cause: cause$1 | GetNodeErrorReturnType;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/block.d.ts
type BlockNotFoundErrorType = BlockNotFoundError & {
  name: 'BlockNotFoundError';
};
declare class BlockNotFoundError extends BaseError$2 {
  constructor({
    blockHash,
    blockNumber
  }: {
    blockHash?: Hash$1 | undefined;
    blockNumber?: bigint | undefined;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/formatters/transaction.d.ts
type TransactionPendingDependencies = 'blockHash' | 'blockNumber' | 'transactionIndex';
type FormattedTransaction<chain$1 extends Chain$1 | undefined = undefined, blockTag$1 extends BlockTag = BlockTag, _FormatterReturnType = ExtractChainFormatterReturnType<chain$1, 'transaction', Transaction$1>, _ExcludedPendingDependencies extends string = TransactionPendingDependencies & ExtractChainFormatterExclude<chain$1, 'transaction'>> = UnionLooseOmit<_FormatterReturnType, TransactionPendingDependencies> & { [_K in _ExcludedPendingDependencies]: never } & Pick<Transaction$1<bigint, number, blockTag$1 extends 'pending' ? true : false>, TransactionPendingDependencies>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/formatters/block.d.ts
type BlockPendingDependencies = 'hash' | 'logsBloom' | 'nonce' | 'number';
type FormattedBlock<chain$1 extends Chain$1 | undefined = undefined, includeTransactions extends boolean = boolean, blockTag$1 extends BlockTag = BlockTag, _FormatterReturnType = ExtractChainFormatterReturnType<chain$1, 'block', Block<bigint, includeTransactions>>, _ExcludedPendingDependencies extends string = BlockPendingDependencies & ExtractChainFormatterExclude<chain$1, 'block'>, _Formatted = Omit<_FormatterReturnType, BlockPendingDependencies> & { [_key in _ExcludedPendingDependencies]: never } & Pick<Block<bigint, includeTransactions, blockTag$1>, BlockPendingDependencies>, _Transactions = (includeTransactions extends true ? Prettify<FormattedTransaction<chain$1, blockTag$1>>[] : Hash$1[])> = Omit<_Formatted, 'transactions'> & {
  transactions: _Transactions;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getBlock.d.ts
type GetBlockParameters<includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'> = {
  /** Whether or not to include transaction data in the response. */
  includeTransactions?: includeTransactions | undefined;
} & ({
  /** Hash of the block. */
  blockHash?: Hash$1 | undefined;
  blockNumber?: undefined;
  blockTag?: undefined;
} | {
  blockHash?: undefined;
  /** The block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockHash?: undefined;
  blockNumber?: undefined;
  /**
   * The block tag.
   * @default 'latest'
   */
  blockTag?: blockTag$1 | BlockTag | undefined;
});
type GetBlockReturnType<chain$1 extends Chain$1 | undefined = undefined, includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'> = Prettify<FormattedBlock<chain$1, includeTransactions, blockTag$1>>;
type GetBlockErrorType = BlockNotFoundErrorType | NumberToHexErrorType | RequestErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getTransactionCount.d.ts
type GetTransactionCountParameters = {
  /** The account address. */
  address: Address$2;
} & ({
  /** The block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /** The block tag. Defaults to 'latest'. */
  blockTag?: BlockTag | undefined;
});
type GetTransactionCountReturnType = number;
type GetTransactionCountErrorType = RequestErrorType | NumberToHexErrorType | HexToNumberErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/account.d.ts
type AccountNotFoundErrorType = AccountNotFoundError & {
  name: 'AccountNotFoundError';
};
declare class AccountNotFoundError extends BaseError$2 {
  constructor({
    docsPath
  }?: {
    docsPath?: string | undefined;
  });
}
type AccountTypeNotSupportedErrorType = AccountTypeNotSupportedError & {
  name: 'AccountTypeNotSupportedError';
};
declare class AccountTypeNotSupportedError extends BaseError$2 {
  constructor({
    docsPath,
    metaMessages,
    type
  }: {
    docsPath?: string | undefined;
    metaMessages?: string[] | undefined;
    type: string;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/prepareTransactionRequest.d.ts
declare const defaultParameters: readonly ["blobVersionedHashes", "chainId", "fees", "gas", "nonce", "type"];
type PrepareTransactionRequestParameterType = 'blobVersionedHashes' | 'chainId' | 'fees' | 'gas' | 'nonce' | 'sidecars' | 'type';
type ParameterTypeToParameters<parameterType extends PrepareTransactionRequestParameterType> = parameterType extends 'fees' ? 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'gasPrice' : parameterType;
type PrepareTransactionRequestRequest<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'> & GetTransactionRequestKzgParameter & {
  /**
   * Nonce manager to use for the transaction request.
   */
  nonceManager?: NonceManager | undefined;
  /**
   * Parameters to prepare for the transaction request.
   *
   * @default ['blobVersionedHashes', 'chainId', 'fees', 'gas', 'nonce', 'type']
   */
  parameters?: readonly PrepareTransactionRequestParameterType[] | undefined;
};
type PrepareTransactionRequestParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, accountOverride extends Account$1 | Address$2 | undefined = Account$1 | Address$2 | undefined, request$1 extends PrepareTransactionRequestRequest<chain$1, chainOverride> = PrepareTransactionRequestRequest<chain$1, chainOverride>> = request$1 & GetAccountParameter<account$1, accountOverride, false, true> & GetChainParameter<chain$1, chainOverride> & GetTransactionRequestKzgParameter<request$1> & {
  chainId?: number | undefined;
};
type PrepareTransactionRequestReturnType<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, accountOverride extends Account$1 | Address$2 | undefined = Account$1 | Address$2 | undefined, request$1 extends PrepareTransactionRequestRequest<chain$1, chainOverride> = PrepareTransactionRequestRequest<chain$1, chainOverride>, _derivedAccount extends Account$1 | Address$2 | undefined = DeriveAccount<account$1, accountOverride>, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>, _transactionType = (request$1['type'] extends string | undefined ? request$1['type'] : GetTransactionType<request$1> extends 'legacy' ? unknown : GetTransactionType<request$1>), _transactionRequest extends TransactionRequest = (_transactionType extends 'legacy' ? TransactionRequestLegacy : never) | (_transactionType extends 'eip1559' ? TransactionRequestEIP1559 : never) | (_transactionType extends 'eip2930' ? TransactionRequestEIP2930 : never) | (_transactionType extends 'eip4844' ? TransactionRequestEIP4844 : never) | (_transactionType extends 'eip7702' ? TransactionRequestEIP7702 : never)> = Prettify<UnionRequiredBy<Extract<UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'> & (_derivedChain extends Chain$1 ? {
  chain: _derivedChain;
} : {
  chain?: undefined;
}) & (_derivedAccount extends Account$1 ? {
  account: _derivedAccount;
  from: Address$2;
} : {
  account?: undefined;
  from?: undefined;
}), IsNever<_transactionRequest> extends true ? unknown : ExactPartial$1<_transactionRequest>> & {
  chainId?: number | undefined;
}, ParameterTypeToParameters<request$1['parameters'] extends readonly PrepareTransactionRequestParameterType[] ? request$1['parameters'][number] : (typeof defaultParameters)[number]>> & (unknown extends request$1['kzg'] ? {} : Pick<request$1, 'kzg'>)>;
type PrepareTransactionRequestErrorType = AccountNotFoundErrorType | AssertRequestErrorType | ParseAccountErrorType | GetBlockErrorType | GetTransactionCountErrorType | EstimateGasErrorType | EstimateFeesPerGasErrorType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/estimateGas.d.ts
type EstimateGasParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = UnionOmit<FormattedEstimateGas<chain$1>, 'from'> & {
  account?: Account$1 | Address$2 | undefined;
  prepare?: boolean | readonly PrepareTransactionRequestParameterType[] | undefined;
  stateOverride?: StateOverride | undefined;
} & ({
  /** The balance of the account at a block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /**
   * The balance of the account at a block tag.
   * @default 'latest'
   */
  blockTag?: BlockTag | undefined;
});
type FormattedEstimateGas<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = FormattedTransactionRequest<chain$1>;
type EstimateGasReturnType = bigint;
type EstimateGasErrorType = GetEstimateGasErrorReturnType<ParseAccountErrorType | NumberToHexErrorType | RequestErrorType | RecoverAuthorizationAddressErrorType | AssertRequestErrorType>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/estimateContractGas.d.ts
type EstimateContractGasParameters<abi$1 extends Abi | readonly unknown[] = Abi, functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'> = ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1> = ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>, chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = ContractFunctionParameters<abi$1, 'nonpayable' | 'payable', functionName$1, args$1> & UnionOmit<EstimateGasParameters<chain$1>, 'data' | 'to' | 'value'> & GetValue<abi$1, functionName$1, EstimateGasParameters<chain$1> extends EstimateGasParameters ? EstimateGasParameters<chain$1>['value'] : EstimateGasParameters['value']> & {
  /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
  dataSuffix?: Hex$1 | undefined;
};
type EstimateContractGasReturnType = bigint;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getLogs.d.ts
type GetLogsParameters<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _eventName extends string | undefined = MaybeAbiEventName<abiEvent>> = {
  /** Address or list of addresses from which logs originated */
  address?: Address$2 | Address$2[] | undefined;
} & ({
  event: abiEvent;
  events?: undefined;
  args?: MaybeExtractEventArgsFromAbi<abiEvents, _eventName> | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  event?: undefined;
  events: abiEvents;
  args?: undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  event?: undefined;
  events?: undefined;
  args?: undefined;
  strict?: undefined;
}) & ({
  /** Block number or tag after which to include logs */
  fromBlock?: fromBlock$1 | BlockNumber | BlockTag | undefined;
  /** Block number or tag before which to include logs */
  toBlock?: toBlock | BlockNumber | BlockTag | undefined;
  blockHash?: undefined;
} | {
  fromBlock?: undefined;
  toBlock?: undefined;
  /** Hash of block to include logs from */
  blockHash?: Hash$1 | undefined;
});
type GetLogsReturnType<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _eventName extends string | undefined = MaybeAbiEventName<abiEvent>, _pending extends boolean = (fromBlock$1 extends 'pending' ? true : false) | (toBlock extends 'pending' ? true : false)> = Log<bigint, number, _pending, abiEvent, strict$1, abiEvents, _eventName>[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getContractEvents.d.ts
type GetContractEventsParameters<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> | undefined = ContractEventName<abi$1> | undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined> = {
  /** The address of the contract. */
  address?: Address$2 | Address$2[] | undefined;
  /** Contract ABI. */
  abi: abi$1;
  args?: ContractEventArgs<abi$1, eventName$1 extends ContractEventName<abi$1> ? eventName$1 : ContractEventName<abi$1>> | undefined;
  /** Contract event. */
  eventName?: eventName$1 | ContractEventName<abi$1> | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | boolean | undefined;
} & ({
  /** Block number or tag after which to include logs */
  fromBlock?: fromBlock$1 | BlockNumber | BlockTag | undefined;
  /** Block number or tag before which to include logs */
  toBlock?: toBlock | BlockNumber | BlockTag | undefined;
  blockHash?: undefined;
} | {
  fromBlock?: undefined;
  toBlock?: undefined;
  /** Hash of block to include logs from */
  blockHash?: Hash$1 | undefined;
});
type GetContractEventsReturnType<abi$1 extends Abi | readonly unknown[] = readonly unknown[], eventName$1 extends ContractEventName<abi$1> | undefined = ContractEventName<abi$1> | undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, isPending extends boolean = (fromBlock$1 extends 'pending' ? true : false) | (toBlock extends 'pending' ? true : false)> = Log<bigint, number, isPending, undefined, strict$1, abi$1, eventName$1>[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/chain/assertCurrentChain.d.ts
type AssertCurrentChainErrorType = ChainNotFoundErrorType | ChainMismatchErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/errors/getTransactionError.d.ts
type GetTransactionErrorReturnType<cause$1 = ErrorType$2> = Omit<TransactionExecutionErrorType, 'cause'> & {
  cause: cause$1 | GetNodeErrorReturnType;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getChainId.d.ts
type GetChainIdReturnType = number;
type GetChainIdErrorType = HexToNumberErrorType | RequestErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/accounts/utils/sign.d.ts
type To$1 = 'object' | 'bytes' | 'hex';
type SignReturnType<to$1 extends To$1 = 'object'> = (to$1 extends 'object' ? Signature$1 : never) | (to$1 extends 'bytes' ? ByteArray : never) | (to$1 extends 'hex' ? Hex$1 : never);
type SignErrorType = HexToBytesErrorType | IsHexErrorType | NumberToHexErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/accounts/utils/signAuthorization.d.ts
type To = 'object' | 'bytes' | 'hex';
type SignAuthorizationReturnType<to$1 extends To = 'object'> = Prettify<to$1 extends 'object' ? SignedAuthorization : SignReturnType<to$1>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getTransaction.d.ts
type GetTransactionParameters<blockTag$1 extends BlockTag = 'latest'> = OneOf$1<{
  /** The block hash */
  blockHash: Hash$1;
  /** The index of the transaction on the block. */
  index: number;
} | {
  /** The block number */
  blockNumber: bigint;
  /** The index of the transaction on the block. */
  index: number;
} | {
  /** The block tag. */
  blockTag: blockTag$1 | BlockTag;
  /** The index of the transaction on the block. */
  index: number;
} | {
  /** The hash of the transaction. */
  hash: Hash$1;
} | {
  /** The sender of the transaction. */
  sender: Address$2;
  /** The nonce of the transaction on the sender. */
  nonce: number;
}>;
type GetTransactionReturnType<chain$1 extends Chain$1 | undefined = undefined, blockTag$1 extends BlockTag = 'latest'> = Prettify<FormattedTransaction<chain$1, blockTag$1>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/formatters/transactionReceipt.d.ts
type FormattedTransactionReceipt<chain$1 extends Chain$1 | undefined = undefined> = ExtractChainFormatterReturnType<chain$1, 'transactionReceipt', TransactionReceipt$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getTransactionReceipt.d.ts
type GetTransactionReceiptParameters = {
  /** The hash of the transaction. */
  hash: Hash$1;
};
type GetTransactionReceiptReturnType<chain$1 extends Chain$1 | undefined = undefined> = FormattedTransactionReceipt<chain$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/clients/transports/fallback.d.ts
type OnResponseFn = (args: {
  method: string;
  params: unknown[];
  transport: ReturnType<Transport$2>;
} & ({
  error?: undefined;
  response: unknown;
  status: 'success';
} | {
  error: Error;
  response?: undefined;
  status: 'error';
})) => void;
type FallbackTransport<transports$1 extends readonly Transport$2[] = readonly Transport$2[]> = Transport$2<'fallback', {
  onResponse: (fn: OnResponseFn) => void;
  transports: { [key in keyof transports$1]: ReturnType<transports$1[key]> };
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/transport.d.ts
type GetTransportConfig<transport extends Transport$2> = ReturnType<transport>['config'];
type GetPollOptions<transport extends Transport$2> = (HasTransportType<transport, 'webSocket' | 'ipc'> extends true ? {
  batch?: undefined;
  /**
   * Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`.
   * @default false
   */
  poll?: false | undefined;
  pollingInterval?: undefined;
} : never) | {
  poll?: true | undefined;
  /**
   * Whether or not the transaction hashes should be batched on each invocation.
   * @default true
   */
  batch?: boolean | undefined;
  /**
   * Polling frequency (in ms). Defaults to Client's pollingInterval config.
   * @default client.pollingInterval
   */
  pollingInterval?: number | undefined;
};
type HasTransportType<transport extends Transport$2, type$1 extends string> = GetTransportConfig<transport>['type'] extends type$1 ? true : transport extends FallbackTransport<infer transports extends readonly Transport$2[]> ? Some<{ [key in keyof transports]: GetTransportConfig<transports[key]>['type'] }, type$1> : false;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getBlockNumber.d.ts
type GetBlockNumberParameters = {
  /** Time (in ms) that cached block number will remain in memory. */
  cacheTime?: number | undefined;
};
type GetBlockNumberReturnType = bigint;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/watchBlockNumber.d.ts
type OnBlockNumberParameter = GetBlockNumberReturnType;
type OnBlockNumberFn = (blockNumber: OnBlockNumberParameter, prevBlockNumber: OnBlockNumberParameter | undefined) => void;
type WatchBlockNumberParameters<transport extends Transport$2 = Transport$2> = {
  /** The callback to call when a new block number is received. */
  onBlockNumber: OnBlockNumberFn;
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
} & ((HasTransportType<transport, 'webSocket' | 'ipc'> extends true ? {
  emitMissed?: undefined;
  emitOnBegin?: undefined;
  /** Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`. */
  poll?: false | undefined;
  pollingInterval?: undefined;
} : never) | {
  /** Whether or not to emit the missed block numbers to the callback. */
  emitMissed?: boolean | undefined;
  /** Whether or not to emit the latest block number to the callback when the subscription opens. */
  emitOnBegin?: boolean | undefined;
  poll?: true | undefined;
  /** Polling frequency (in ms). Defaults to Client's pollingInterval config. */
  pollingInterval?: number | undefined;
});
type WatchBlockNumberReturnType = () => void;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/waitForTransactionReceipt.d.ts
type ReplacementReason = 'cancelled' | 'replaced' | 'repriced';
type ReplacementReturnType<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = {
  reason: ReplacementReason;
  replacedTransaction: Transaction$1;
  transaction: Transaction$1;
  transactionReceipt: GetTransactionReceiptReturnType<chain$1>;
};
type WaitForTransactionReceiptReturnType<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = GetTransactionReceiptReturnType<chain$1>;
type WaitForTransactionReceiptParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = {
  /**
   * Whether to check for transaction replacements.
   * @default true
   */
  checkReplacement?: boolean | undefined;
  /**
   * The number of confirmations (blocks that have passed) to wait before resolving.
   * @default 1
   */
  confirmations?: number | undefined;
  /** The hash of the transaction. */
  hash: Hash$1;
  /** Optional callback to emit if the transaction has been replaced. */
  onReplaced?: ((response: ReplacementReturnType<chain$1>) => void) | undefined;
  /**
   * Polling frequency (in ms). Defaults to the client's pollingInterval config.
   * @default client.pollingInterval
   */
  pollingInterval?: number | undefined;
  /**
   * Number of times to retry if the transaction or block is not found.
   * @default 6 (exponential backoff)
   */
  retryCount?: WithRetryParameters['retryCount'] | undefined;
  /**
   * Time to wait (in ms) between retries.
   * @default `({ count }) => ~~(1 << count) * 200` (exponential backoff)
   */
  retryDelay?: WithRetryParameters['delay'] | undefined;
  /**
   * Optional timeout (in milliseconds) to wait before stopping polling.
   * @default 180_000
   */
  timeout?: number | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/ccip.d.ts
type CcipRequestParameters = {
  data: Hex$1;
  sender: Address$2;
  urls: readonly string[];
};
type CcipRequestReturnType = Hex$1;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/createAccessList.d.ts
type CreateAccessListParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = UnionOmit<FormattedTransactionRequest<chain$1>, 'from' | 'nonce' | 'accessList'> & {
  /** Account attached to the call (msg.sender). */
  account?: Account$1 | Address$2 | undefined;
} & ({
  /** The balance of the account at a block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /**
   * The balance of the account at a block tag.
   * @default 'latest'
   */
  blockTag?: BlockTag | undefined;
});
type CreateAccessListReturnType = Prettify<{
  accessList: AccessList;
  gasUsed: bigint;
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/createBlockFilter.d.ts
type CreateBlockFilterReturnType = Filter<'block'>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/createEventFilter.d.ts
type CreateEventFilterParameters<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _eventName extends string | undefined = MaybeAbiEventName<abiEvent>, _args extends MaybeExtractEventArgsFromAbi<abiEvents, _eventName> | undefined = undefined> = {
  address?: Address$2 | Address$2[] | undefined;
  fromBlock?: fromBlock$1 | BlockNumber | BlockTag | undefined;
  toBlock?: toBlock | BlockNumber | BlockTag | undefined;
} & (MaybeExtractEventArgsFromAbi<abiEvents, _eventName> extends infer eventFilterArgs ? {
  args: eventFilterArgs | (_args extends eventFilterArgs ? _args : never);
  event: abiEvent;
  events?: undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  args?: undefined;
  event?: abiEvent | undefined;
  events?: undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  args?: undefined;
  event?: undefined;
  events: abiEvents | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  args?: undefined;
  event?: undefined;
  events?: undefined;
  strict?: undefined;
} : {
  args?: undefined;
  event?: undefined;
  events?: undefined;
  strict?: undefined;
});
type CreateEventFilterReturnType<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _eventName extends string | undefined = MaybeAbiEventName<abiEvent>, _args extends MaybeExtractEventArgsFromAbi<abiEvents, _eventName> | undefined = undefined> = Prettify<Filter<'event', abiEvents, _eventName, _args, strict$1, fromBlock$1, toBlock>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/createPendingTransactionFilter.d.ts
type CreatePendingTransactionFilterReturnType = Filter<'transaction'>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/fee.d.ts
type BaseFeeScalarErrorType = BaseFeeScalarError & {
  name: 'BaseFeeScalarError';
};
declare class BaseFeeScalarError extends BaseError$2 {
  constructor();
}
type Eip1559FeesNotSupportedErrorType = Eip1559FeesNotSupportedError & {
  name: 'Eip1559FeesNotSupportedError';
};
declare class Eip1559FeesNotSupportedError extends BaseError$2 {
  constructor();
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getGasPrice.d.ts
type GetGasPriceReturnType = bigint;
type GetGasPriceErrorType = RequestErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/estimateMaxPriorityFeePerGas.d.ts
type EstimateMaxPriorityFeePerGasParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined> = GetChainParameter<chain$1, chainOverride>;
type EstimateMaxPriorityFeePerGasReturnType = bigint;
type EstimateMaxPriorityFeePerGasErrorType = GetBlockErrorType | HexToBigIntErrorType | RequestErrorType | GetBlockErrorType | GetGasPriceErrorType | Eip1559FeesNotSupportedErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/fillTransaction.d.ts
type FillTransactionParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, accountOverride extends Account$1 | Address$2 | undefined = Account$1 | Address$2 | undefined, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'> & GetAccountParameter<account$1, accountOverride, false, true> & GetChainParameter<chain$1, chainOverride> & {
  /**
   * Nonce manager to use for the transaction request.
   */
  nonceManager?: NonceManager | undefined;
};
type FillTransactionReturnType<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = {
  raw: Hex$1;
  transaction: FormattedTransaction<_derivedChain>;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getBalance.d.ts
type GetBalanceParameters = {
  /** The address of the account. */
  address: Address$2;
} & ({
  /** The balance of the account at a block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /** The balance of the account at a block tag. */
  blockTag?: BlockTag | undefined;
});
type GetBalanceReturnType = bigint;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getBlobBaseFee.d.ts
type GetBlobBaseFeeReturnType = bigint;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getBlockTransactionCount.d.ts
type GetBlockTransactionCountParameters = {
  /** Hash of the block. */
  blockHash?: Hash$1 | undefined;
  blockNumber?: undefined;
  blockTag?: undefined;
} | {
  blockHash?: undefined;
  /** The block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockHash?: undefined;
  blockNumber?: undefined;
  /** The block tag. Defaults to 'latest'. */
  blockTag?: BlockTag | undefined;
};
type GetBlockTransactionCountReturnType = number;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getCode.d.ts
type GetCodeParameters = {
  address: Address$2;
} & ({
  blockNumber?: undefined;
  blockTag?: BlockTag | undefined;
} | {
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
});
type GetCodeReturnType = Hex$1 | undefined;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getEip712Domain.d.ts
type GetEip712DomainParameters = {
  address: Address$2;
} & Pick<ReadContractParameters, 'factory' | 'factoryData'>;
type GetEip712DomainReturnType = {
  domain: RequiredBy<TypedDataDomain$1, 'chainId' | 'name' | 'verifyingContract' | 'salt' | 'version'>;
  fields: Hex$1;
  extensions: readonly bigint[];
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getFeeHistory.d.ts
type GetFeeHistoryParameters = {
  /**
   * Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. Less than requested may be returned if not all blocks are available.
   */
  blockCount: number;
  /**
   * A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used.
   */
  rewardPercentiles: number[];
} & ({
  blockNumber?: undefined;
  /**
   * Highest number block of the requested range.
   * @default 'latest'
   */
  blockTag?: BlockTag | undefined;
} | {
  /** Highest number block of the requested range. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
});
type GetFeeHistoryReturnType = FeeHistory;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getFilterChanges.d.ts
type GetFilterChangesParameters<filterType extends FilterType = FilterType, abi$1 extends Abi | readonly unknown[] | undefined = undefined, eventName$1 extends string | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined> = {
  filter: Filter<filterType, abi$1, eventName$1, any, strict$1, fromBlock$1, toBlock>;
};
type GetFilterChangesReturnType<filterType extends FilterType = FilterType, abi$1 extends Abi | readonly unknown[] | undefined = undefined, eventName$1 extends string | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _AbiEvent extends AbiEvent | undefined = (abi$1 extends Abi ? eventName$1 extends string ? ExtractAbiEvent<abi$1, eventName$1> : undefined : undefined), _Pending extends boolean = (fromBlock$1 extends 'pending' ? true : false) | (toBlock extends 'pending' ? true : false)> = filterType extends 'event' ? Log<bigint, number, _Pending, _AbiEvent, strict$1, abi$1, eventName$1>[] : Hash$1[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getFilterLogs.d.ts
type GetFilterLogsParameters<abi$1 extends Abi | readonly unknown[] | undefined = undefined, eventName$1 extends string | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined> = {
  filter: Filter<'event', abi$1, eventName$1, any, strict$1, fromBlock$1, toBlock>;
};
type GetFilterLogsReturnType<abi$1 extends Abi | readonly unknown[] | undefined = undefined, eventName$1 extends string | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _AbiEvent extends AbiEvent | undefined = (abi$1 extends Abi ? eventName$1 extends string ? ExtractAbiEvent<abi$1, eventName$1> : undefined : undefined), _Pending extends boolean = (fromBlock$1 extends 'pending' ? true : false) | (toBlock extends 'pending' ? true : false)> = Log<bigint, number, _Pending, _AbiEvent, strict$1, abi$1, eventName$1>[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getProof.d.ts
type GetProofParameters = {
  /** Account address. */
  address: Address$2;
  /** Array of storage-keys that should be proofed and included. */
  storageKeys: Hash$1[];
} & ({
  /** The block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /**
   * The block tag.
   * @default 'latest'
   */
  blockTag?: BlockTag | undefined;
});
type GetProofReturnType = Proof;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getStorageAt.d.ts
type GetStorageAtParameters = {
  address: Address$2;
  slot: Hex$1;
} & ({
  blockNumber?: undefined;
  blockTag?: BlockTag | undefined;
} | {
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
});
type GetStorageAtReturnType = Hex$1 | undefined;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/getTransactionConfirmations.d.ts
type GetTransactionConfirmationsParameters<chain$1 extends Chain$1 | undefined = Chain$1> = {
  /** The transaction hash. */
  hash: Hash$1;
  transactionReceipt?: undefined;
} | {
  hash?: undefined;
  /** The transaction receipt. */
  transactionReceipt: FormattedTransactionReceipt<chain$1>;
};
type GetTransactionConfirmationsReturnType = bigint;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/multicall.d.ts
type MulticallContracts<contracts extends readonly unknown[], options extends {
  mutability: AbiStateMutability;
  optional?: boolean;
  properties?: Record<string, any>;
} = {
  mutability: AbiStateMutability;
}, result extends readonly any[] = []> = contracts extends readonly [] ? readonly [] : contracts extends readonly [infer contract] ? readonly [...result, MaybePartial<Prettify<GetMulticallContractParameters<contract, options['mutability']> & options['properties']>, options['optional']>] : contracts extends readonly [infer contract, ...infer rest] ? MulticallContracts<[...rest], options, [...result, MaybePartial<Prettify<GetMulticallContractParameters<contract, options['mutability']> & options['properties']>, options['optional']>]> : readonly unknown[] extends contracts ? contracts : contracts extends readonly (infer contract extends ContractFunctionParameters)[] ? readonly MaybePartial<Prettify<contract & options['properties']>, options['optional']>[] : readonly MaybePartial<Prettify<ContractFunctionParameters & options['properties']>, options['optional']>[];
type MulticallResults<contracts extends readonly unknown[] = readonly ContractFunctionParameters[], allowFailure extends boolean = true, options extends {
  error?: Error | undefined;
  extraProperties?: Record<string, unknown> | undefined;
  mutability: AbiStateMutability;
} = {
  error: Error;
  extraProperties: {};
  mutability: AbiStateMutability;
}, result extends any[] = []> = contracts extends readonly [] ? readonly [] : contracts extends readonly [infer contract] ? [...result, MulticallResponse<GetMulticallContractReturnType<contract, options['mutability']>, options['error'], allowFailure, options['extraProperties']>] : contracts extends readonly [infer contract, ...infer rest] ? MulticallResults<[...rest], allowFailure, options, [...result, MulticallResponse<GetMulticallContractReturnType<contract, options['mutability']>, options['error'], allowFailure, options['extraProperties']>]> : readonly unknown[] extends contracts ? MulticallResponse<unknown, options['error'], allowFailure, options['extraProperties']>[] : contracts extends readonly (infer contract extends ContractFunctionParameters)[] ? MulticallResponse<GetMulticallContractReturnType<contract, options['mutability']>, options['error'], allowFailure, options['extraProperties']>[] : MulticallResponse<unknown, options['error'], allowFailure, options['extraProperties']>[];
type MulticallResponse<result = unknown, error$1 = unknown, allowFailure extends boolean = true, extraProperties extends Record<string, unknown> | undefined = {}> = allowFailure extends true ? (extraProperties & {
  error?: undefined;
  result: result;
  status: 'success';
}) | (extraProperties & {
  error: unknown extends error$1 ? Error : error$1;
  result?: undefined;
  status: 'failure';
}) : result;
type GetMulticallContractParameters<contract$1, mutability extends AbiStateMutability> = contract$1 extends {
  abi: infer abi extends Abi;
} ? contract$1 extends {
  functionName: infer functionName extends ContractFunctionName<abi, mutability>;
} ? contract$1 extends {
  args: infer args extends ContractFunctionArgs<abi, mutability, functionName>;
} ? ContractFunctionParameters<abi, mutability, functionName, args> : ContractFunctionParameters<abi, mutability, functionName> : Abi extends abi ? ContractFunctionParameters : ContractFunctionParameters<abi, mutability> : ContractFunctionParameters<readonly unknown[]>;
type GetMulticallContractReturnType<contract$1, mutability extends AbiStateMutability> = contract$1 extends {
  abi: infer abi extends Abi;
} ? contract$1 extends {
  functionName: infer functionName extends ContractFunctionName<abi, mutability>;
} ? contract$1 extends {
  args: infer args extends ContractFunctionArgs<abi, mutability, functionName>;
} ? ContractFunctionReturnType<abi, mutability, functionName, args> : ContractFunctionReturnType<abi, mutability, functionName> : ContractFunctionReturnType<abi, mutability> : ContractFunctionReturnType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/multicall.d.ts
type MulticallParameters<contracts extends readonly unknown[] = readonly ContractFunctionParameters[], allowFailure extends boolean = true, options extends {
  optional?: boolean;
  properties?: Record<string, any>;
} = {}> = Pick<CallParameters, 'authorizationList' | 'blockNumber' | 'blockOverrides' | 'blockTag' | 'stateOverride'> & {
  /** The account to use for the multicall. */
  account?: Address$2 | undefined;
  /** Whether to allow failures. */
  allowFailure?: allowFailure | boolean | undefined;
  /** The size of each batch of calls. */
  batchSize?: number | undefined;
  /** Enable deployless multicall. */
  deployless?: boolean | undefined;
  /** The contracts to call. */
  contracts: MulticallContracts<Narrow<contracts>, {
    mutability: AbiStateMutability;
  } & options>;
  /** The address of the multicall3 contract to use. */
  multicallAddress?: Address$2 | undefined;
};
type MulticallReturnType<contracts extends readonly unknown[] = readonly ContractFunctionParameters[], allowFailure extends boolean = true, options extends {
  error?: Error;
} = {
  error: Error;
}> = MulticallResults<Narrow<contracts>, allowFailure, {
  mutability: AbiStateMutability;
} & options>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/calls.d.ts
type Call<call$1 = unknown, extraProperties extends Record<string, unknown> = {}> = OneOf$1<Assign<{
  data?: Hex$1 | undefined;
  dataSuffix?: Hex$1 | undefined;
  to: Address$2;
  value?: bigint | undefined;
}, extraProperties> | Assign<Omit<GetMulticallContractParameters<call$1, AbiStateMutability>, 'address'> & {
  data?: Hex$1 | undefined;
  dataSuffix?: Hex$1 | undefined;
  to: Address$2;
  value?: bigint | undefined;
}, extraProperties>>;
type Calls<calls extends readonly unknown[], extraProperties extends Record<string, unknown> = {}, result extends readonly any[] = []> = calls extends readonly [] ? readonly [] : calls extends readonly [infer call] ? readonly [...result, Prettify<Call<call, extraProperties>>] : calls extends readonly [infer call, ...infer rest] ? Calls<[...rest], extraProperties, [...result, Prettify<Call<call, extraProperties>>]> : readonly unknown[] extends calls ? calls : calls extends readonly (infer call extends OneOf$1<Call<unknown, extraProperties>>)[] ? readonly Prettify<call>[] : readonly OneOf$1<Call>[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/simulateBlocks.d.ts
type CallExtraProperties = ExactPartial$1<UnionOmit<TransactionRequest, 'blobs' | 'data' | 'kzg' | 'to' | 'sidecars' | 'value'>> & {
  /** Account attached to the call (msg.sender). */
  account?: Account$1 | Address$2 | undefined;
  /** Recipient. `null` if contract deployment. */
  to?: Address$2 | null | undefined;
};
type SimulateBlocksParameters<calls extends readonly unknown[] = readonly unknown[]> = {
  /** Blocks to simulate. */
  blocks: readonly {
    /** Block overrides. */
    blockOverrides?: BlockOverrides | undefined;
    /** Calls to execute. */
    calls: Calls<Narrow<calls>, CallExtraProperties>;
    /** State overrides. */
    stateOverrides?: StateOverride | undefined;
  }[];
  /** Whether to return the full transactions. */
  returnFullTransactions?: boolean | undefined;
  /** Whether to trace transfers. */
  traceTransfers?: boolean | undefined;
  /** Whether to enable validation mode. */
  validation?: boolean | undefined;
} & ({
  /** The balance of the account at a block number. */
  blockNumber?: bigint | undefined;
  blockTag?: undefined;
} | {
  blockNumber?: undefined;
  /**
   * The balance of the account at a block tag.
   * @default 'latest'
   */
  blockTag?: BlockTag | undefined;
});
type SimulateBlocksReturnType<calls extends readonly unknown[] = readonly unknown[]> = readonly (Block & {
  calls: MulticallResults<Narrow<calls>, true, {
    extraProperties: {
      data: Hex$1;
      gasUsed: bigint;
      logs?: Log[] | undefined;
    };
    error: Error;
    mutability: AbiStateMutability;
  }>;
})[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/simulateCalls.d.ts
type SimulateCallsParameters<calls extends readonly unknown[] = readonly unknown[], account$1 extends Account$1 | Address$2 | undefined = Account$1 | Address$2 | undefined> = Omit<SimulateBlocksParameters, 'blocks' | 'returnFullTransactions'> & {
  /** Account attached to the calls (msg.sender). */
  account?: account$1 | undefined;
  /** Calls to simulate. */
  calls: Calls<Narrow<calls>>;
  /** State overrides. */
  stateOverrides?: StateOverride | undefined;
  /** Whether to trace asset changes. */
  traceAssetChanges?: boolean | undefined;
};
type SimulateCallsReturnType<calls extends readonly unknown[] = readonly unknown[]> = {
  /** Asset changes. */
  assetChanges: readonly {
    token: {
      address: Address$2;
      decimals?: number | undefined;
      symbol?: string | undefined;
    };
    value: {
      pre: bigint;
      post: bigint;
      diff: bigint;
    };
  }[];
  /** Block results. */
  block: Block;
  /** Call results. */
  results: MulticallResults<Narrow<calls>, true, {
    extraProperties: {
      data: Hex$1;
      gasUsed: bigint;
      logs?: Log[] | undefined;
    };
    error: Error;
    mutability: AbiStateMutability;
  }>;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/uninstallFilter.d.ts
type UninstallFilterParameters = {
  filter: Filter<any>;
};
type UninstallFilterReturnType = boolean;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/verifyHash.d.ts
type VerifyHashParameters = Pick<CallParameters, 'blockNumber' | 'blockTag'> & {
  /** The address that signed the original message. */
  address: Address$2;
  /** The chain to use. */
  chain?: Chain$1 | null | undefined;
  /** The address of the ERC-6492 signature verifier contract. */
  erc6492VerifierAddress?: Address$2 | undefined;
  /** The hash to be verified. */
  hash: Hex$1;
  /** Multicall3 address for ERC-8010 verification. */
  multicallAddress?: Address$2 | undefined;
  /** The signature that was generated by signing the message with the address's private key. */
  signature: Hex$1 | ByteArray | Signature$1;
  /** @deprecated use `erc6492VerifierAddress` instead. */
  universalSignatureVerifierAddress?: Address$2 | undefined;
} & OneOf$1<{
  factory: Address$2;
  factoryData: Hex$1;
} | {}>;
type VerifyHashReturnType = boolean;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/verifyMessage.d.ts
type VerifyMessageParameters = Prettify<Omit<VerifyHashParameters, 'hash'> & {
  /** The address that signed the original message. */
  address: Address$2;
  /** The message to be verified. */
  message: SignableMessage;
  /** The signature that was generated by signing the message with the address's private key. */
  signature: Hex$1 | ByteArray | Signature$1;
}>;
type VerifyMessageReturnType = boolean;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/verifyTypedData.d.ts
type VerifyTypedDataParameters<typedData extends TypedData | Record<string, unknown> = TypedData, primaryType$1 extends keyof typedData | 'EIP712Domain' = keyof typedData> = Omit<VerifyHashParameters, 'hash'> & TypedDataDefinition<typedData, primaryType$1> & {
  /** The address to verify the typed data for. */
  address: Address$2;
  /** The signature to verify */
  signature: Hex$1 | ByteArray | Signature$1;
};
type VerifyTypedDataReturnType = boolean;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/watchBlocks.d.ts
type OnBlockParameter<chain$1 extends Chain$1 | undefined = Chain$1, includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'> = GetBlockReturnType<chain$1, includeTransactions, blockTag$1>;
type OnBlock<chain$1 extends Chain$1 | undefined = Chain$1, includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'> = (block: OnBlockParameter<chain$1, includeTransactions, blockTag$1>, prevBlock: OnBlockParameter<chain$1, includeTransactions, blockTag$1> | undefined) => void;
type WatchBlocksParameters<transport extends Transport$2 = Transport$2, chain$1 extends Chain$1 | undefined = Chain$1, includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'> = {
  /** The callback to call when a new block is received. */
  onBlock: OnBlock<chain$1, includeTransactions, blockTag$1>;
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
} & ((HasTransportType<transport, 'webSocket' | 'ipc'> extends true ? {
  blockTag?: undefined;
  emitMissed?: undefined;
  emitOnBegin?: undefined;
  includeTransactions?: undefined;
  /** Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`. */
  poll?: false | undefined;
  pollingInterval?: undefined;
} : never) | {
  /** The block tag. Defaults to "latest". */
  blockTag?: blockTag$1 | BlockTag | undefined;
  /** Whether or not to emit the missed blocks to the callback. */
  emitMissed?: boolean | undefined;
  /** Whether or not to emit the block to the callback when the subscription opens. */
  emitOnBegin?: boolean | undefined;
  /** Whether or not to include transaction data in the response. */
  includeTransactions?: includeTransactions | undefined;
  poll?: true | undefined;
  /** Polling frequency (in ms). Defaults to the client's pollingInterval config. */
  pollingInterval?: number | undefined;
});
type WatchBlocksReturnType = () => void;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/watchContractEvent.d.ts
type WatchContractEventOnLogsParameter<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> = ContractEventName<abi$1>, strict$1 extends boolean | undefined = undefined> = abi$1 extends Abi ? Abi extends abi$1 ? Log[] : Log<bigint, number, false, ExtractAbiEvent<abi$1, eventName$1>, strict$1>[] : Log[];
type WatchContractEventOnLogsFn<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> = ContractEventName<abi$1>, strict$1 extends boolean | undefined = undefined> = (logs: WatchContractEventOnLogsParameter<abi$1, eventName$1, strict$1>) => void;
type WatchContractEventParameters<abi$1 extends Abi | readonly unknown[] = Abi, eventName$1 extends ContractEventName<abi$1> | undefined = ContractEventName<abi$1>, strict$1 extends boolean | undefined = undefined, transport extends Transport$2 = Transport$2> = {
  /** The address of the contract. */
  address?: Address$2 | Address$2[] | undefined;
  /** Contract ABI. */
  abi: abi$1;
  args?: ContractEventArgs<abi$1, eventName$1 extends ContractEventName<abi$1> ? eventName$1 : ContractEventName<abi$1>> | undefined;
  /** Contract event. */
  eventName?: eventName$1 | ContractEventName<abi$1> | undefined;
  /** Block to start listening from. */
  fromBlock?: BlockNumber<bigint> | undefined;
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
  /** The callback to call when new event logs are received. */
  onLogs: WatchContractEventOnLogsFn<abi$1, eventName$1 extends ContractEventName<abi$1> ? eventName$1 : ContractEventName<abi$1>, strict$1>;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | boolean | undefined;
} & GetPollOptions<transport>;
type WatchContractEventReturnType = () => void;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/watchEvent.d.ts
type WatchEventOnLogsParameter<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, eventName$1 extends string | undefined = MaybeAbiEventName<abiEvent>> = Log<bigint, number, false, abiEvent, strict$1, abiEvents, eventName$1>[];
type WatchEventOnLogsFn<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, _eventName extends string | undefined = MaybeAbiEventName<abiEvent>> = (logs: WatchEventOnLogsParameter<abiEvent, abiEvents, strict$1, _eventName>) => void;
type WatchEventParameters<abiEvent extends AbiEvent | undefined = undefined, abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, transport extends Transport$2 = Transport$2, _eventName extends string | undefined = MaybeAbiEventName<abiEvent>> = {
  /** The address of the contract. */
  address?: Address$2 | Address$2[] | undefined;
  /** Block to start listening from. */
  fromBlock?: BlockNumber<bigint> | undefined;
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
  /** The callback to call when new event logs are received. */
  onLogs: WatchEventOnLogsFn<abiEvent, abiEvents, strict$1, _eventName>;
} & GetPollOptions<transport> & ({
  event: abiEvent;
  events?: undefined;
  args?: MaybeExtractEventArgsFromAbi<abiEvents, _eventName> | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  event?: undefined;
  events?: abiEvents | undefined;
  args?: undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict$1 | undefined;
} | {
  event?: undefined;
  events?: undefined;
  args?: undefined;
  strict?: undefined;
});
type WatchEventReturnType = () => void;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/watchPendingTransactions.d.ts
type OnTransactionsParameter = Hash$1[];
type OnTransactionsFn = (transactions: OnTransactionsParameter) => void;
type WatchPendingTransactionsParameters<transport extends Transport$2 = Transport$2> = {
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
  /** The callback to call when new transactions are received. */
  onTransactions: OnTransactionsFn;
} & GetPollOptions<transport>;
type WatchPendingTransactionsReturnType = () => void;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/siwe/validateSiweMessage.d.ts
type ValidateSiweMessageParameters = {
  /**
   * Ethereum address to check against.
   */
  address?: Address$2 | undefined;
  /**
   * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority to check against.
   */
  domain?: string | undefined;
  /**
   * EIP-4361 message fields.
   */
  message: ExactPartial$1<SiweMessage>;
  /**
   * Random string to check against.
   */
  nonce?: string | undefined;
  /**
   * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme to check against.
   */
  scheme?: string | undefined;
  /**
   * Current time to check optional `expirationTime` and `notBefore` fields.
   *
   * @default new Date()
   */
  time?: Date | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/siwe/verifySiweMessage.d.ts
type VerifySiweMessageParameters = Prettify<Pick<VerifyHashParameters, 'blockNumber' | 'blockTag'> & Pick<ValidateSiweMessageParameters, 'address' | 'domain' | 'nonce' | 'scheme' | 'time'> & {
  /**
   * EIP-4361 formatted message.
   */
  message: string;
  /**
   * Signature to check against.
   */
  signature: Hex$1;
}>;
type VerifySiweMessageReturnType = boolean;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/sendRawTransaction.d.ts
type SendRawTransactionParameters = {
  /** The signed serialized transaction. */
  serializedTransaction: TransactionSerializedGeneric;
};
type SendRawTransactionReturnType = Hash$1;
type SendRawTransactionErrorType = RequestErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/clients/decorators/public.d.ts
type PublicActions<transport extends Transport$2 = Transport$2, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined> = {
  /**
   * Executes a new message call immediately without submitting a transaction to the network.
   *
   * - Docs: https://viem.sh/docs/actions/public/call
   * - JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)
   *
   * @param args - {@link CallParameters}
   * @returns The call data. {@link CallReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const data = await client.call({
   *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
   *   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   * })
   */
  call: (parameters: CallParameters<chain$1>) => Promise<CallReturnType>;
  /**
   * Creates an EIP-2930 access list that you can include in a transaction.
   *
   * - Docs: https://viem.sh/docs/actions/public/createAccessList
   * - JSON-RPC Methods: `eth_createAccessList`
   *
   * @param args - {@link CreateAccessListParameters}
   * @returns The call data. {@link CreateAccessListReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const data = await client.createAccessList({
   *   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   * })
   */
  createAccessList: (parameters: CreateAccessListParameters<chain$1>) => Promise<CreateAccessListReturnType>;
  /**
   * Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
   *
   * - Docs: https://viem.sh/docs/actions/public/createBlockFilter
   * - JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)
   *
   * @returns Filter. {@link CreateBlockFilterReturnType}
   *
   * @example
   * import { createPublicClient, createBlockFilter, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await createBlockFilter(client)
   * // { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
   */
  createBlockFilter: () => Promise<CreateBlockFilterReturnType>;
  /**
   * Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).
   *
   * - Docs: https://viem.sh/docs/contract/createContractEventFilter
   *
   * @param args - {@link CreateContractEventFilterParameters}
   * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateContractEventFilterReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createContractEventFilter({
   *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
   * })
   */
  createContractEventFilter: <const abi$1 extends Abi | readonly unknown[], eventName$1 extends ContractEventName<abi$1> | undefined, args$1 extends MaybeExtractEventArgsFromAbi<abi$1, eventName$1> | undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined>(args: CreateContractEventFilterParameters<abi$1, eventName$1, args$1, strict$1, fromBlock$1, toBlock>) => Promise<CreateContractEventFilterReturnType<abi$1, eventName$1, args$1, strict$1, fromBlock$1, toBlock>>;
  /**
   * Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
   *
   * - Docs: https://viem.sh/docs/actions/public/createEventFilter
   * - JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)
   *
   * @param args - {@link CreateEventFilterParameters}
   * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateEventFilterReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createEventFilter({
   *   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
   * })
   */
  createEventFilter: <const abiEvent extends AbiEvent | undefined = undefined, const abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined, _EventName extends string | undefined = MaybeAbiEventName<abiEvent>, _Args extends MaybeExtractEventArgsFromAbi<abiEvents, _EventName> | undefined = undefined>(args?: CreateEventFilterParameters<abiEvent, abiEvents, strict$1, fromBlock$1, toBlock, _EventName, _Args> | undefined) => Promise<CreateEventFilterReturnType<abiEvent, abiEvents, strict$1, fromBlock$1, toBlock, _EventName, _Args>>;
  /**
   * Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
   *
   * - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
   * - JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)
   *
   * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createPendingTransactionFilter()
   * // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
   */
  createPendingTransactionFilter: () => Promise<CreatePendingTransactionFilterReturnType>;
  /**
   * Estimates the gas required to successfully execute a contract write function call.
   *
   * - Docs: https://viem.sh/docs/contract/estimateContractGas
   *
   * @remarks
   * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * @param args - {@link EstimateContractGasParameters}
   * @returns The gas estimate (in wei). {@link EstimateContractGasReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const gas = await client.estimateContractGas({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint() public']),
   *   functionName: 'mint',
   *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
   * })
   */
  estimateContractGas: <chain$1 extends Chain$1 | undefined, const abi$1 extends Abi | readonly unknown[], functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>>(args: EstimateContractGasParameters<abi$1, functionName$1, args$1, chain$1>) => Promise<EstimateContractGasReturnType>;
  /**
   * Estimates the gas necessary to complete a transaction without submitting it to the network.
   *
   * - Docs: https://viem.sh/docs/actions/public/estimateGas
   * - JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)
   *
   * @param args - {@link EstimateGasParameters}
   * @returns The gas estimate (in wei). {@link EstimateGasReturnType}
   *
   * @example
   * import { createPublicClient, http, parseEther } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const gasEstimate = await client.estimateGas({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: parseEther('1'),
   * })
   */
  estimateGas: (args: EstimateGasParameters<chain$1>) => Promise<EstimateGasReturnType>;
  /**
   * Fills a transaction request with the necessary fields to be signed over.
   *
   * - Docs: https://viem.sh/docs/actions/public/fillTransaction
   *
   * @param client - Client to use
   * @param parameters - {@link FillTransactionParameters}
   * @returns The filled transaction. {@link FillTransactionReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const result = await client.fillTransaction({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: parseEther('1'),
   * })
   */
  fillTransaction: <chainOverride extends Chain$1 | undefined = undefined, accountOverride extends Account$1 | Address$2 | undefined = undefined>(args: FillTransactionParameters<chain$1, account$1, chainOverride, accountOverride>) => Promise<FillTransactionReturnType<chain$1, chainOverride>>;
  /**
   * Returns the balance of an address in wei.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBalance
   * - JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)
   *
   * @remarks
   * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
   *
   * ```ts
   * const balance = await getBalance(client, {
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   blockTag: 'safe'
   * })
   * const balanceAsEther = formatEther(balance)
   * // "6.942"
   * ```
   *
   * @param args - {@link GetBalanceParameters}
   * @returns The balance of the address in wei. {@link GetBalanceReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const balance = await client.getBalance({
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   * // 10000000000000000000000n (wei)
   */
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>;
  /**
   * Returns the base fee per blob gas in wei.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
   * - JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)
   *
   * @param client - Client to use
   * @returns The blob base fee (in wei). {@link GetBlobBaseFeeReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { getBlobBaseFee } from 'viem/public'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const blobBaseFee = await client.getBlobBaseFee()
   */
  getBlobBaseFee: () => Promise<GetBlobBaseFeeReturnType>;
  /**
   * Returns information about a block at a block number, hash, or tag.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlock
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
   * - JSON-RPC Methods:
   *   - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
   *   - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.
   *
   * @param args - {@link GetBlockParameters}
   * @returns Information about the block. {@link GetBlockReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const block = await client.getBlock()
   */
  getBlock: <includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'>(args?: GetBlockParameters<includeTransactions, blockTag$1> | undefined) => Promise<GetBlockReturnType<chain$1, includeTransactions, blockTag$1>>;
  /**
   * Returns the number of the most recent block seen.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlockNumber
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
   * - JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)
   *
   * @param args - {@link GetBlockNumberParameters}
   * @returns The number of the block. {@link GetBlockNumberReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const blockNumber = await client.getBlockNumber()
   * // 69420n
   */
  getBlockNumber: (args?: GetBlockNumberParameters | undefined) => Promise<GetBlockNumberReturnType>;
  /**
   * Returns the number of Transactions at a block number, hash, or tag.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
   * - JSON-RPC Methods:
   *   - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
   *   - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.
   *
   * @param args - {@link GetBlockTransactionCountParameters}
   * @returns The block transaction count. {@link GetBlockTransactionCountReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const count = await client.getBlockTransactionCount()
   */
  getBlockTransactionCount: (args?: GetBlockTransactionCountParameters | undefined) => Promise<GetBlockTransactionCountReturnType>;
  /** @deprecated Use `getCode` instead. */
  getBytecode: (args: GetCodeParameters) => Promise<GetCodeReturnType>;
  /**
   * Returns the chain ID associated with the current network.
   *
   * - Docs: https://viem.sh/docs/actions/public/getChainId
   * - JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)
   *
   * @returns The current chain ID. {@link GetChainIdReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const chainId = await client.getChainId()
   * // 1
   */
  getChainId: () => Promise<GetChainIdReturnType>;
  /**
   * Retrieves the bytecode at an address.
   *
   * - Docs: https://viem.sh/docs/contract/getCode
   * - JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)
   *
   * @param args - {@link GetBytecodeParameters}
   * @returns The contract's bytecode. {@link GetBytecodeReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const code = await client.getCode({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   * })
   */
  getCode: (args: GetCodeParameters) => Promise<GetCodeReturnType>;
  /**
   * Returns a list of event logs emitted by a contract.
   *
   * - Docs: https://viem.sh/docs/actions/public/getContractEvents
   * - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
   *
   * @param client - Client to use
   * @param parameters - {@link GetContractEventsParameters}
   * @returns A list of event logs. {@link GetContractEventsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { wagmiAbi } from './abi'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const logs = await client.getContractEvents(client, {
   *  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *  abi: wagmiAbi,
   *  eventName: 'Transfer'
   * })
   */
  getContractEvents: <const abi$1 extends Abi | readonly unknown[], eventName$1 extends ContractEventName<abi$1> | undefined = undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined>(args: GetContractEventsParameters<abi$1, eventName$1, strict$1, fromBlock$1, toBlock>) => Promise<GetContractEventsReturnType<abi$1, eventName$1, strict$1, fromBlock$1, toBlock>>;
  /**
   * Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.
   *
   * @param client - A {@link Client} instance.
   * @param parameters - The parameters of the action. {@link GetEip712DomainParameters}
   * @returns The EIP-712 domain, fields, and extensions. {@link GetEip712DomainReturnType}
   *
   * @example
   * ```ts
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const domain = await client.getEip712Domain({
   *   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   * })
   * // {
   * //   domain: {
   * //     name: 'ExampleContract',
   * //     version: '1',
   * //     chainId: 1,
   * //     verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   * //   },
   * //   fields: '0x0f',
   * //   extensions: [],
   * // }
   * ```
   */
  getEip712Domain: (args: GetEip712DomainParameters) => Promise<GetEip712DomainReturnType>;
  /**
   * Gets address for ENS name.
   *
   * - Docs: https://viem.sh/docs/ens/actions/getEnsAddress
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
   *
   * @remarks
   * Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
   *
   * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
   *
   * @param args - {@link GetEnsAddressParameters}
   * @returns Address for ENS name or `null` if not found. {@link GetEnsAddressReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { normalize } from 'viem/ens'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const ensAddress = await client.getEnsAddress({
   *   name: normalize('wevm.eth'),
   * })
   * // '0xd2135CfB216b74109775236E36d4b433F1DF507B'
   */
  getEnsAddress: (args: GetEnsAddressParameters) => Promise<GetEnsAddressReturnType>;
  /**
   * Gets the avatar of an ENS name.
   *
   * - Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
   *
   * @remarks
   * Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.
   *
   * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
   *
   * @param args - {@link GetEnsAvatarParameters}
   * @returns Avatar URI or `null` if not found. {@link GetEnsAvatarReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { normalize } from 'viem/ens'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const ensAvatar = await client.getEnsAvatar({
   *   name: normalize('wevm.eth'),
   * })
   * // 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
   */
  getEnsAvatar: (args: GetEnsAvatarParameters) => Promise<GetEnsAvatarReturnType>;
  /**
   * Gets primary name for specified address.
   *
   * - Docs: https://viem.sh/docs/ens/actions/getEnsName
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
   *
   * @remarks
   * Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.
   *
   * @param args - {@link GetEnsNameParameters}
   * @returns Name or `null` if not found. {@link GetEnsNameReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const ensName = await client.getEnsName({
   *   address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
   * })
   * // 'wevm.eth'
   */
  getEnsName: (args: GetEnsNameParameters) => Promise<GetEnsNameReturnType>;
  /**
   * Gets resolver for ENS name.
   *
   * - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
   *
   * @remarks
   * Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.
   *
   * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
   *
   * @param args - {@link GetEnsResolverParameters}
   * @returns Address for ENS resolver. {@link GetEnsResolverReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { normalize } from 'viem/ens'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const resolverAddress = await client.getEnsResolver({
   *   name: normalize('wevm.eth'),
   * })
   * // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
   */
  getEnsResolver: (args: GetEnsResolverParameters) => Promise<GetEnsResolverReturnType>;
  /**
   * Gets a text record for specified ENS name.
   *
   * - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
   *
   * @remarks
   * Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
   *
   * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
   *
   * @param args - {@link GetEnsTextParameters}
   * @returns Address for ENS resolver. {@link GetEnsTextReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { normalize } from 'viem/ens'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const twitterRecord = await client.getEnsText({
   *   name: normalize('wevm.eth'),
   *   key: 'com.twitter',
   * })
   * // 'wevm_dev'
   */
  getEnsText: (args: GetEnsTextParameters) => Promise<GetEnsTextReturnType>;
  /**
   * Returns a collection of historical gas information.
   *
   * - Docs: https://viem.sh/docs/actions/public/getFeeHistory
   * - JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)
   *
   * @param args - {@link GetFeeHistoryParameters}
   * @returns The gas estimate (in wei). {@link GetFeeHistoryReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const feeHistory = await client.getFeeHistory({
   *   blockCount: 4,
   *   rewardPercentiles: [25, 75],
   * })
   */
  getFeeHistory: (args: GetFeeHistoryParameters) => Promise<GetFeeHistoryReturnType>;
  /**
   * Returns an estimate for the fees per gas for a transaction to be included
   * in the next block.
   *
   * - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas
   *
   * @param client - Client to use
   * @param parameters - {@link EstimateFeesPerGasParameters}
   * @returns An estimate (in wei) for the fees per gas. {@link EstimateFeesPerGasReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const maxPriorityFeePerGas = await client.estimateFeesPerGas()
   * // { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
   */
  estimateFeesPerGas: <chainOverride extends Chain$1 | undefined = undefined, type$1 extends FeeValuesType = 'eip1559'>(args?: EstimateFeesPerGasParameters<chain$1, chainOverride, type$1> | undefined) => Promise<EstimateFeesPerGasReturnType<type$1>>;
  /**
   * Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.
   *
   * - Docs: https://viem.sh/docs/actions/public/getFilterChanges
   * - JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)
   *
   * @remarks
   * A Filter can be created from the following actions:
   *
   * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
   * - [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
   * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
   * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
   *
   * Depending on the type of filter, the return value will be different:
   *
   * - If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
   * - If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
   * - If the filter was created with `createBlockFilter`, it returns a list of block hashes.
   *
   * @param args - {@link GetFilterChangesParameters}
   * @returns Logs or hashes. {@link GetFilterChangesReturnType}
   *
   * @example
   * // Blocks
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createBlockFilter()
   * const hashes = await client.getFilterChanges({ filter })
   *
   * @example
   * // Contract Events
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createContractEventFilter({
   *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
   *   eventName: 'Transfer',
   * })
   * const logs = await client.getFilterChanges({ filter })
   *
   * @example
   * // Raw Events
   * import { createPublicClient, http, parseAbiItem } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createEventFilter({
   *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
   * })
   * const logs = await client.getFilterChanges({ filter })
   *
   * @example
   * // Transactions
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createPendingTransactionFilter()
   * const hashes = await client.getFilterChanges({ filter })
   */
  getFilterChanges: <filterType extends FilterType, const abi$1 extends Abi | readonly unknown[] | undefined, eventName$1 extends string | undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined>(args: GetFilterChangesParameters<filterType, abi$1, eventName$1, strict$1, fromBlock$1, toBlock>) => Promise<GetFilterChangesReturnType<filterType, abi$1, eventName$1, strict$1, fromBlock$1, toBlock>>;
  /**
   * Returns a list of event logs since the filter was created.
   *
   * - Docs: https://viem.sh/docs/actions/public/getFilterLogs
   * - JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)
   *
   * @remarks
   * `getFilterLogs` is only compatible with **event filters**.
   *
   * @param args - {@link GetFilterLogsParameters}
   * @returns A list of event logs. {@link GetFilterLogsReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbiItem } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createEventFilter({
   *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
   * })
   * const logs = await client.getFilterLogs({ filter })
   */
  getFilterLogs: <const abi$1 extends Abi | readonly unknown[] | undefined, eventName$1 extends string | undefined, strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined>(args: GetFilterLogsParameters<abi$1, eventName$1, strict$1, fromBlock$1, toBlock>) => Promise<GetFilterLogsReturnType<abi$1, eventName$1, strict$1, fromBlock$1, toBlock>>;
  /**
   * Returns the current price of gas (in wei).
   *
   * - Docs: https://viem.sh/docs/actions/public/getGasPrice
   * - JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)
   *
   * @returns The gas price (in wei). {@link GetGasPriceReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const gasPrice = await client.getGasPrice()
   */
  getGasPrice: () => Promise<GetGasPriceReturnType>;
  /**
   * Returns a list of event logs matching the provided parameters.
   *
   * - Docs: https://viem.sh/docs/actions/public/getLogs
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
   * - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
   *
   * @param args - {@link GetLogsParameters}
   * @returns A list of event logs. {@link GetLogsReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbiItem } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const logs = await client.getLogs()
   */
  getLogs: <const abiEvent extends AbiEvent | undefined = undefined, const abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined, fromBlock$1 extends BlockNumber | BlockTag | undefined = undefined, toBlock extends BlockNumber | BlockTag | undefined = undefined>(args?: GetLogsParameters<abiEvent, abiEvents, strict$1, fromBlock$1, toBlock> | undefined) => Promise<GetLogsReturnType<abiEvent, abiEvents, strict$1, fromBlock$1, toBlock>>;
  /**
   * Returns the account and storage values of the specified account including the Merkle-proof.
   *
   * - Docs: https://viem.sh/docs/actions/public/getProof
   * - JSON-RPC Methods:
   *   - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)
   *
   * @param client - Client to use
   * @param parameters - {@link GetProofParameters}
   * @returns Proof data. {@link GetProofReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const block = await client.getProof({
   *  address: '0x...',
   *  storageKeys: ['0x...'],
   * })
   */
  getProof: (args: GetProofParameters) => Promise<GetProofReturnType>;
  /**
   * Returns an estimate for the max priority fee per gas (in wei) for a transaction
   * to be included in the next block.
   *
   * - Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas
   *
   * @param client - Client to use
   * @returns An estimate (in wei) for the max priority fee per gas. {@link EstimateMaxPriorityFeePerGasReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const maxPriorityFeePerGas = await client.estimateMaxPriorityFeePerGas()
   * // 10000000n
   */
  estimateMaxPriorityFeePerGas: <chainOverride extends Chain$1 | undefined = undefined>(args?: EstimateMaxPriorityFeePerGasParameters<chain$1, chainOverride> | undefined) => Promise<EstimateMaxPriorityFeePerGasReturnType>;
  /**
   * Returns the value from a storage slot at a given address.
   *
   * - Docs: https://viem.sh/docs/contract/getStorageAt
   * - JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)
   *
   * @param args - {@link GetStorageAtParameters}
   * @returns The value of the storage slot. {@link GetStorageAtReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { getStorageAt } from 'viem/contract'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const code = await client.getStorageAt({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   slot: toHex(0),
   * })
   */
  getStorageAt: (args: GetStorageAtParameters) => Promise<GetStorageAtReturnType>;
  /**
   * Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransaction
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
   * - JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)
   *
   * @param args - {@link GetTransactionParameters}
   * @returns The transaction information. {@link GetTransactionReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transaction = await client.getTransaction({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getTransaction: <blockTag$1 extends BlockTag = 'latest'>(args: GetTransactionParameters<blockTag$1>) => Promise<GetTransactionReturnType<chain$1, blockTag$1>>;
  /**
   * Returns the number of blocks passed (confirmations) since the transaction was processed on a block.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
   * - JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)
   *
   * @param args - {@link GetTransactionConfirmationsParameters}
   * @returns The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. {@link GetTransactionConfirmationsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const confirmations = await client.getTransactionConfirmations({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getTransactionConfirmations: (args: GetTransactionConfirmationsParameters<chain$1>) => Promise<GetTransactionConfirmationsReturnType>;
  /**
   * Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionCount
   * - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
   *
   * @param args - {@link GetTransactionCountParameters}
   * @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionCount = await client.getTransactionCount({
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  getTransactionCount: (args: GetTransactionCountParameters) => Promise<GetTransactionCountReturnType>;
  /**
   * Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
   * - JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)
   *
   * @param args - {@link GetTransactionReceiptParameters}
   * @returns The transaction receipt. {@link GetTransactionReceiptReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionReceipt = await client.getTransactionReceipt({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getTransactionReceipt: (args: GetTransactionReceiptParameters) => Promise<GetTransactionReceiptReturnType<chain$1>>;
  /**
   * Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).
   *
   * - Docs: https://viem.sh/docs/contract/multicall
   *
   * @param args - {@link MulticallParameters}
   * @returns An array of results with accompanying status. {@link MulticallReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const abi = parseAbi([
   *   'function balanceOf(address) view returns (uint256)',
   *   'function totalSupply() view returns (uint256)',
   * ])
   * const result = await client.multicall({
   *   contracts: [
   *     {
   *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *       abi,
   *       functionName: 'balanceOf',
   *       args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
   *     },
   *     {
   *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *       abi,
   *       functionName: 'totalSupply',
   *     },
   *   ],
   * })
   * // [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
   */
  multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: MulticallParameters<contracts, allowFailure>) => Promise<MulticallReturnType<contracts, allowFailure>>;
  /**
   * Prepares a transaction request for signing.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
   *
   * @param args - {@link PrepareTransactionRequestParameters}
   * @returns The transaction request. {@link PrepareTransactionRequestReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   */
  prepareTransactionRequest: <const request$1 extends PrepareTransactionRequestRequest<chain$1, chainOverride>, chainOverride extends Chain$1 | undefined = undefined, accountOverride extends Account$1 | Address$2 | undefined = undefined>(args: PrepareTransactionRequestParameters<chain$1, account$1, chainOverride, accountOverride, request$1>) => Promise<PrepareTransactionRequestReturnType<chain$1, account$1, chainOverride, accountOverride, request$1>>;
  /**
   * Calls a read-only function on a contract, and returns the response.
   *
   * - Docs: https://viem.sh/docs/contract/readContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts
   *
   * @remarks
   * A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.
   *
   * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * @param args - {@link ReadContractParameters}
   * @returns The response from the contract. Type is inferred. {@link ReadContractReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { readContract } from 'viem/contract'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const result = await client.readContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
   *   functionName: 'balanceOf',
   *   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
   * })
   * // 424122n
   */
  readContract: <const abi$1 extends Abi | readonly unknown[], functionName$1 extends ContractFunctionName<abi$1, 'pure' | 'view'>, const args$1 extends ContractFunctionArgs<abi$1, 'pure' | 'view', functionName$1>>(args: ReadContractParameters<abi$1, functionName$1, args$1>) => Promise<ReadContractReturnType<abi$1, functionName$1, args$1>>;
  /**
   * Sends a **signed** transaction to the network
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
   * - JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
   *
   * @param client - Client to use
   * @param parameters - {@link SendRawTransactionParameters}
   * @returns The transaction hash. {@link SendRawTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { sendRawTransaction } from 'viem/wallet'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const hash = await client.sendRawTransaction({
   *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
   * })
   */
  sendRawTransaction: (args: SendRawTransactionParameters) => Promise<SendRawTransactionReturnType>;
  /**
   * Sends a **signed** transaction to the network
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransactionSync
   * - JSON-RPC Method: [`eth_sendRawTransactionSync`](https://eips.ethereum.org/EIPS/eip-7966)
   *
   * @param client - Client to use
   * @param parameters - {@link SendRawTransactionSyncParameters}
   * @returns The transaction receipt. {@link SendRawTransactionSyncReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { sendRawTransactionSync } from 'viem/wallet'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const receipt = await client.sendRawTransactionSync({
   *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
   * })
   */
  sendRawTransactionSync: (args: SendRawTransactionSyncParameters) => Promise<SendRawTransactionSyncReturnType<chain$1>>;
  /**
   * @deprecated Use `simulateBlocks` instead.
   */
  simulate: <const calls extends readonly unknown[]>(args: SimulateBlocksParameters<calls>) => Promise<SimulateBlocksReturnType<calls>>;
  /**
   * Simulates a set of calls on block(s) with optional block and state overrides.
   *
   * @example
   * ```ts
   * import { createPublicClient, http, parseEther } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const result = await client.simulateBlocks({
   *   blocks: [{
   *     blockOverrides: {
   *       number: 69420n,
   *     },
   *     calls: [{
   *       {
   *         account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
   *         data: '0xdeadbeef',
   *         to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *       },
   *       {
   *         account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
   *         to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *         value: parseEther('1'),
   *       },
   *     }],
   *     stateOverrides: [{
   *       address: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
   *       balance: parseEther('10'),
   *     }],
   *   }]
   * })
   * ```
   *
   * @param client - Client to use.
   * @param parameters - {@link SimulateParameters}
   * @returns Simulated blocks. {@link SimulateReturnType}
   */
  simulateBlocks: <const calls extends readonly unknown[]>(args: SimulateBlocksParameters<calls>) => Promise<SimulateBlocksReturnType<calls>>;
  /**
   * Simulates a set of calls.
   *
   * @example
   * ```ts
   * import { createPublicClient, http, parseEther } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const result = await client.simulateCalls({
   *   account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
   *   calls: [{
   *     {
   *       data: '0xdeadbeef',
   *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *     },
   *     {
   *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *       value: parseEther('1'),
   *     },
   *   ]
   * })
   * ```
   *
   * @param client - Client to use.
   * @param parameters - {@link SimulateCallsParameters}
   * @returns Results. {@link SimulateCallsReturnType}
   */
  simulateCalls: <const calls extends readonly unknown[]>(args: SimulateCallsParameters<calls>) => Promise<SimulateCallsReturnType<calls>>;
  /**
   * Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.
   *
   * - Docs: https://viem.sh/docs/contract/simulateContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts
   *
   * @remarks
   * This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.
   *
   * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * @param args - {@link SimulateContractParameters}
   * @returns The simulation result and write request. {@link SimulateContractReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const result = await client.simulateContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32) view returns (uint32)']),
   *   functionName: 'mint',
   *   args: ['69420'],
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  simulateContract: <const abi$1 extends Abi | readonly unknown[], functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, const args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>, chainOverride extends Chain$1 | undefined, accountOverride extends Account$1 | Address$2 | undefined = undefined>(args: SimulateContractParameters<abi$1, functionName$1, args$1, chain$1, chainOverride, accountOverride>) => Promise<SimulateContractReturnType<abi$1, functionName$1, args$1, chain$1, account$1, chainOverride, accountOverride>>;
  /**
   * Verify that a hash was signed by the provided address.
   *
   * - Docs {@link https://viem.sh/docs/actions/public/verifyHash}
   *
   * @param parameters - {@link VerifyHashParameters}
   * @returns Whether or not the signature is valid. {@link VerifyHashReturnType}
   */
  verifyHash: (args: VerifyHashParameters) => Promise<VerifyHashReturnType>;
  /**
   * Verify that a message was signed by the provided address.
   *
   * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
   *
   * - Docs {@link https://viem.sh/docs/actions/public/verifyMessage}
   *
   * @param parameters - {@link VerifyMessageParameters}
   * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
   */
  verifyMessage: (args: VerifyMessageParameters) => Promise<VerifyMessageReturnType>;
  /**
   * Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.
   *
   * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
   *
   * - Docs {@link https://viem.sh/docs/siwe/actions/verifySiweMessage}
   *
   * @param parameters - {@link VerifySiweMessageParameters}
   * @returns Whether or not the signature is valid. {@link VerifySiweMessageReturnType}
   */
  verifySiweMessage: (args: VerifySiweMessageParameters) => Promise<VerifySiweMessageReturnType>;
  /**
   * Verify that typed data was signed by the provided address.
   *
   * - Docs {@link https://viem.sh/docs/actions/public/verifyTypedData}
   *
   * @param parameters - {@link VerifyTypedDataParameters}
   * @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
   */
  verifyTypedData: (args: VerifyTypedDataParameters) => Promise<VerifyTypedDataReturnType>;
  /**
   * Destroys a Filter that was created from one of the following Actions:
   *
   * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
   * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
   * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
   *
   * - Docs: https://viem.sh/docs/actions/public/uninstallFilter
   * - JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)
   *
   * @param args - {@link UninstallFilterParameters}
   * @returns A boolean indicating if the Filter was successfully uninstalled. {@link UninstallFilterReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'
   *
   * const filter = await client.createPendingTransactionFilter()
   * const uninstalled = await client.uninstallFilter({ filter })
   * // true
   */
  uninstallFilter: (args: UninstallFilterParameters) => Promise<UninstallFilterReturnType>;
  /**
   * Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.
   *
   * - Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
   * - JSON-RPC Methods:
   *   - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
   *   - If a Transaction has been replaced:
   *     - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
   *     - Checks if one of the Transactions is a replacement
   *     - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).
   *
   * @remarks
   * The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).
   *
   * Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.
   *
   * There are 3 types of Transaction Replacement reasons:
   *
   * - `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
   * - `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
   * - `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)
   *
   * @param args - {@link WaitForTransactionReceiptParameters}
   * @returns The transaction receipt. {@link WaitForTransactionReceiptReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionReceipt = await client.waitForTransactionReceipt({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  waitForTransactionReceipt: (args: WaitForTransactionReceiptParameters<chain$1>) => Promise<WaitForTransactionReceiptReturnType<chain$1>>;
  /**
   * Watches and returns incoming block numbers.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchBlockNumber
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
   * - JSON-RPC Methods:
   *   - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
   *
   * @param args - {@link WatchBlockNumberParameters}
   * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockNumberReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchBlockNumber({
   *   onBlockNumber: (blockNumber) => console.log(blockNumber),
   * })
   */
  watchBlockNumber: (args: WatchBlockNumberParameters) => WatchBlockNumberReturnType;
  /**
   * Watches and returns information for incoming blocks.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchBlocks
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
   * - JSON-RPC Methods:
   *   - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
   *
   * @param args - {@link WatchBlocksParameters}
   * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlocksReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchBlocks({
   *   onBlock: (block) => console.log(block),
   * })
   */
  watchBlocks: <includeTransactions extends boolean = false, blockTag$1 extends BlockTag = 'latest'>(args: WatchBlocksParameters<transport, chain$1, includeTransactions, blockTag$1>) => WatchBlocksReturnType;
  /**
   * Watches and returns emitted contract event logs.
   *
   * - Docs: https://viem.sh/docs/contract/watchContractEvent
   *
   * @remarks
   * This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).
   *
   * `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
   *
   * @param args - {@link WatchContractEventParameters}
   * @returns A function that can be invoked to stop watching for new event logs. {@link WatchContractEventReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = client.watchContractEvent({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
   *   eventName: 'Transfer',
   *   args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
   *   onLogs: (logs) => console.log(logs),
   * })
   */
  watchContractEvent: <const abi$1 extends Abi | readonly unknown[], eventName$1 extends ContractEventName<abi$1>, strict$1 extends boolean | undefined = undefined>(args: WatchContractEventParameters<abi$1, eventName$1, strict$1, transport>) => WatchContractEventReturnType;
  /**
   * Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).
   *
   * - Docs: https://viem.sh/docs/actions/public/watchEvent
   * - JSON-RPC Methods:
   *   - **RPC Provider supports `eth_newFilter`:**
   *     - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
   *     - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
   *   - **RPC Provider does not support `eth_newFilter`:**
   *     - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.
   *
   * @remarks
   * This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).
   *
   * `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
   *
   * @param args - {@link WatchEventParameters}
   * @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = client.watchEvent({
   *   onLogs: (logs) => console.log(logs),
   * })
   */
  watchEvent: <const abiEvent extends AbiEvent | undefined = undefined, const abiEvents extends readonly AbiEvent[] | readonly unknown[] | undefined = (abiEvent extends AbiEvent ? [abiEvent] : undefined), strict$1 extends boolean | undefined = undefined>(args: WatchEventParameters<abiEvent, abiEvents, strict$1, transport>) => WatchEventReturnType;
  /**
   * Watches and returns pending transaction hashes.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
   * - JSON-RPC Methods:
   *   - When `poll: true`
   *     - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
   *     - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.
   *
   * @remarks
   * This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).
   *
   * @param args - {@link WatchPendingTransactionsParameters}
   * @returns A function that can be invoked to stop watching for new pending transaction hashes. {@link WatchPendingTransactionsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchPendingTransactions({
   *   onTransactions: (hashes) => console.log(hashes),
   * })
   */
  watchPendingTransactions: (args: WatchPendingTransactionsParameters<transport>) => WatchPendingTransactionsReturnType;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/addChain.d.ts
type AddChainParameters = {
  /** The chain to add to the wallet. */
  chain: Chain$1;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/deployContract.d.ts
type DeployContractParameters<abi$1 extends Abi | readonly unknown[] = Abi, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, allArgs = ContractConstructorArgs<abi$1>> = UnionOmit<SendTransactionParameters<chain$1, account$1, chainOverride>, 'accessList' | 'chain' | 'to' | 'data'> & GetChainParameter<chain$1, chainOverride> & UnionEvaluate<readonly [] extends allArgs ? {
  args?: allArgs | undefined;
} : {
  args: allArgs;
}> & {
  abi: abi$1;
  bytecode: Hex$1;
};
type DeployContractReturnType = SendTransactionReturnType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/getAddresses.d.ts
type GetAddressesReturnType = Address$2[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/getCallsStatus.d.ts
type GetCallsStatusParameters = {
  id: string;
};
type GetCallsStatusReturnType = Prettify<Omit<WalletGetCallsStatusReturnType<ExtractCapabilities<'getCallsStatus', 'ReturnType'>, number, bigint, 'success' | 'reverted'>, 'status'> & {
  statusCode: number;
  status: 'pending' | 'success' | 'failure' | undefined;
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/getCapabilities.d.ts
type GetCapabilitiesParameters<chainId$1 extends number | undefined = undefined> = {
  account?: Account$1 | Address$2 | undefined;
  chainId?: chainId$1 | number | undefined;
};
type GetCapabilitiesReturnType<chainId$1 extends number | undefined = undefined> = Prettify<chainId$1 extends number ? ExtractCapabilities<'getCapabilities', 'ReturnType'> : ChainIdToCapabilities<Capabilities<ExtractCapabilities<'getCapabilities', 'ReturnType'>>, number>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/getPermissions.d.ts
type GetPermissionsReturnType = WalletPermission[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/prepareAuthorization.d.ts
type PrepareAuthorizationParameters<account$1 extends Account$1 | undefined = Account$1 | undefined> = GetAccountParameter<account$1> & PartialBy<AuthorizationRequest, 'chainId' | 'nonce'> & {
  /**
   * Whether the EIP-7702 Transaction will be executed by the EOA (signing this Authorization) or another Account.
   *
   * By default, it will be assumed that the EIP-7702 Transaction will
   * be executed by another Account.
   */
  executor?: 'self' | Account$1 | Address$2 | undefined;
};
type PrepareAuthorizationReturnType = Authorization;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/requestAddresses.d.ts
type RequestAddressesReturnType = Address$2[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/requestPermissions.d.ts
type RequestPermissionsParameters = Prettify<{
  eth_accounts: Record<string, any>;
} & {
  [key: string]: Record<string, any>;
}>;
type RequestPermissionsReturnType = WalletPermission[];
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/sendCalls.d.ts
type SendCallsParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, calls extends readonly unknown[] = readonly unknown[], _chain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = {
  chain?: chainOverride | Chain$1 | undefined;
  calls: Calls<Narrow<calls>>;
  capabilities?: ExtractCapabilities<'sendCalls', 'Request'> | undefined;
  experimental_fallback?: boolean | undefined;
  experimental_fallbackDelay?: number | undefined;
  forceAtomic?: boolean | undefined;
  id?: string | undefined;
  version?: WalletSendCallsParameters[number]['version'] | undefined;
} & GetAccountParameter<account$1, Account$1 | Address$2, false, true>;
type SendCallsReturnType = Prettify<{
  capabilities?: ExtractCapabilities<'sendCalls', 'ReturnType'> | undefined;
  id: string;
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/waitForCallsStatus.d.ts
type WaitForCallsStatusParameters = {
  /**
   * The id of the call batch to wait for.
   */
  id: string;
  /**
   * Polling frequency (in ms). Defaults to the client's pollingInterval config.
   *
   * @default client.pollingInterval
   */
  pollingInterval?: number | undefined;
  /**
   * Number of times to retry if the call bundle failed.
   * @default 4 (exponential backoff)
   */
  retryCount?: WithRetryParameters['retryCount'] | undefined;
  /**
   * Time to wait (in ms) between retries.
   * @default `({ count }) => ~~(1 << count) * 200` (exponential backoff)
   */
  retryDelay?: WithRetryParameters['delay'] | undefined;
  /**
   * The status range to wait for.
   *
   * @default (status) => status >= 200
   */
  status?: ((parameters: GetCallsStatusReturnType) => boolean) | undefined;
  /**
   * Whether to throw an error if the call bundle fails.
   *
   * @default false
   */
  throwOnFailure?: boolean | undefined;
  /**
   * Optional timeout (in milliseconds) to wait before stopping polling.
   *
   * @default 60_000
   */
  timeout?: number | undefined;
};
type WaitForCallsStatusReturnType = GetCallsStatusReturnType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/sendCallsSync.d.ts
type SendCallsSyncParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, calls extends readonly unknown[] = readonly unknown[]> = SendCallsParameters<chain$1, account$1, chainOverride, calls> & Pick<WaitForCallsStatusParameters, 'pollingInterval' | 'status' | 'throwOnFailure'> & {
  /** Timeout (ms) to wait for calls to be included in a block. @default chain.blockTime * 3 */
  timeout?: number | undefined;
};
type SendCallsSyncReturnType = GetCallsStatusReturnType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/showCallsStatus.d.ts
type ShowCallsStatusParameters = {
  id: string;
};
type ShowCallsStatusReturnType = void;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/signAuthorization.d.ts
type SignAuthorizationParameters<account$1 extends Account$1 | undefined = Account$1 | undefined> = PrepareAuthorizationParameters<account$1>;
type SignAuthorizationReturnType$1 = SignAuthorizationReturnType;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/signMessage.d.ts
type SignMessageParameters<account$1 extends Account$1 | undefined = Account$1 | undefined> = GetAccountParameter<account$1> & {
  message: SignableMessage;
};
type SignMessageReturnType = Hex$1;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/signTransaction.d.ts
type SignTransactionRequest<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'>;
type SignTransactionParameters<chain$1 extends Chain$1 | undefined, account$1 extends Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, request$1 extends SignTransactionRequest<chain$1, chainOverride> = SignTransactionRequest<chain$1, chainOverride>> = request$1 & GetAccountParameter<account$1> & GetChainParameter<chain$1, chainOverride> & GetTransactionRequestKzgParameter<request$1>;
type SignTransactionReturnType<request$1 extends SignTransactionRequest = SignTransactionRequest> = TransactionSerialized<GetTransactionType<request$1>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/signTypedData.d.ts
type SignTypedDataParameters<typedData extends TypedData | Record<string, unknown> = TypedData, primaryType$1 extends keyof typedData | 'EIP712Domain' = keyof typedData, account$1 extends Account$1 | undefined = undefined, primaryTypes = (typedData extends TypedData ? keyof typedData : string)> = TypedDataDefinition<typedData, primaryType$1, primaryTypes> & GetAccountParameter<account$1>;
type SignTypedDataReturnType = Hex$1;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/switchChain.d.ts
type SwitchChainParameters = {
  /** ID of Chain to switch to */
  id: Chain$1['id'];
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/watchAsset.d.ts
type WatchAssetParameters = WatchAssetParams;
type WatchAssetReturnType = boolean;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/writeContractSync.d.ts
type WriteContractSyncParameters<abi$1 extends Abi | readonly unknown[] = Abi, functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'> = ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1> = ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined> = WriteContractParameters<abi$1, functionName$1, args$1, chain$1, account$1, chainOverride> & Pick<SendTransactionSyncParameters<chain$1>, 'pollingInterval' | 'throwOnReceiptRevert' | 'timeout'>;
type WriteContractSyncReturnType<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = SendTransactionSyncReturnType<chain$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/clients/decorators/wallet.d.ts
type WalletActions<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined> = {
  /**
   * Adds an EVM chain to the wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/addChain
   * - JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)
   *
   * @param args - {@link AddChainParameters}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { optimism } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   transport: custom(window.ethereum),
   * })
   * await client.addChain({ chain: optimism })
   */
  addChain: (args: AddChainParameters) => Promise<void>;
  /**
   * Deploys a contract to the network, given bytecode and constructor arguments.
   *
   * - Docs: https://viem.sh/docs/contract/deployContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts
   *
   * @param args - {@link DeployContractParameters}
   * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link DeployContractReturnType}
   *
   * @example
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const hash = await client.deployContract({
   *   abi: [],
   *   account: '0x…,
   *   bytecode: '0x608060405260405161083e38038061083e833981016040819052610...',
   * })
   */
  deployContract: <const abi$1 extends Abi | readonly unknown[], chainOverride extends Chain$1 | undefined>(args: DeployContractParameters<abi$1, chain$1, account$1, chainOverride>) => Promise<DeployContractReturnType>;
  /**
   * Fills a transaction request with the necessary fields to be signed over.
   *
   * - Docs: https://viem.sh/docs/actions/public/fillTransaction
   *
   * @param client - Client to use
   * @param parameters - {@link FillTransactionParameters}
   * @returns The filled transaction. {@link FillTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const result = await client.fillTransaction({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: parseEther('1'),
   * })
   */
  fillTransaction: <chainOverride extends Chain$1 | undefined = undefined, accountOverride extends Account$1 | Address$2 | undefined = undefined>(args: FillTransactionParameters<chain$1, account$1, chainOverride, accountOverride>) => Promise<FillTransactionReturnType<chain$1, chainOverride>>;
  /**
   * Returns a list of account addresses owned by the wallet or client.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/getAddresses
   * - JSON-RPC Methods: [`eth_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts)
   *
   * @returns List of account addresses owned by the wallet or client. {@link GetAddressesReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const accounts = await client.getAddresses()
   */
  getAddresses: () => Promise<GetAddressesReturnType>;
  /**
   * Returns the status of a call batch that was sent via `sendCalls`.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/getCallsStatus
   * - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
   *
   * @param client - Client to use
   * @returns Status of the calls. {@link GetCallsStatusReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const { receipts, status } = await client.getCallsStatus({ id: '0xdeadbeef' })
   */
  getCallsStatus: (parameters: GetCallsStatusParameters) => Promise<GetCallsStatusReturnType>;
  /**
   * Extract capabilities that a connected wallet supports (e.g. paymasters, session keys, etc).
   *
   * - Docs: https://viem.sh/docs/actions/wallet/getCapabilities
   * - JSON-RPC Methods: [`wallet_getCapabilities`](https://eips.ethereum.org/EIPS/eip-5792)
   *
   * @param client - Client to use
   * @returns The wallet's capabilities. {@link GetCapabilitiesReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const capabilities = await client.getCapabilities({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  getCapabilities: <chainId$1 extends number | undefined>(parameters?: GetCapabilitiesParameters<chainId$1>) => Promise<GetCapabilitiesReturnType<chainId$1>>;
  /**
   * Returns the chain ID associated with the current network.
   *
   * - Docs: https://viem.sh/docs/actions/public/getChainId
   * - JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)
   *
   * @returns The current chain ID. {@link GetChainIdReturnType}
   *
   * @example
   * import { createWalletClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const chainId = await client.getChainId()
   * // 1
   */
  getChainId: () => Promise<GetChainIdReturnType>;
  /**
   * Gets the wallets current permissions.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/getPermissions
   * - JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
   *
   * @returns The wallet permissions. {@link GetPermissionsReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const permissions = await client.getPermissions()
   */
  getPermissions: () => Promise<GetPermissionsReturnType>;
  /**
   * Prepares an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object for signing.
   * This Action will fill the required fields of the Authorization object if they are not provided (e.g. `nonce` and `chainId`).
   *
   * With the prepared Authorization object, you can use [`signAuthorization`](https://viem.sh/docs/eip7702/signAuthorization) to sign over the Authorization object.
   *
   * @param client - Client to use
   * @param parameters - {@link PrepareAuthorizationParameters}
   * @returns The prepared Authorization object. {@link PrepareAuthorizationReturnType}
   *
   * @example
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const authorization = await client.prepareAuthorization({
   *   account: privateKeyToAccount('0x..'),
   *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const authorization = await client.prepareAuthorization({
   *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  prepareAuthorization: (parameters: PrepareAuthorizationParameters<account$1>) => Promise<PrepareAuthorizationReturnType>;
  /**
   * Prepares a transaction request for signing.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
   *
   * @param args - {@link PrepareTransactionRequestParameters}
   * @returns The transaction request. {@link PrepareTransactionRequestReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   */
  prepareTransactionRequest: <const request$1 extends PrepareTransactionRequestRequest<chain$1, chainOverride>, chainOverride extends Chain$1 | undefined = undefined, accountOverride extends Account$1 | Address$2 | undefined = undefined>(args: PrepareTransactionRequestParameters<chain$1, account$1, chainOverride, accountOverride, request$1>) => Promise<PrepareTransactionRequestReturnType<chain$1, account$1, chainOverride, accountOverride, request$1>>;
  /**
   * Requests a list of accounts managed by a wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/requestAddresses
   * - JSON-RPC Methods: [`eth_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)
   *
   * Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).
   *
   * This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.
   *
   * @returns List of accounts managed by a wallet {@link RequestAddressesReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const accounts = await client.requestAddresses()
   */
  requestAddresses: () => Promise<RequestAddressesReturnType>;
  /**
   * Requests permissions for a wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/requestPermissions
   * - JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
   *
   * @param args - {@link RequestPermissionsParameters}
   * @returns The wallet permissions. {@link RequestPermissionsReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const permissions = await client.requestPermissions({
   *   eth_accounts: {}
   * })
   */
  requestPermissions: (args: RequestPermissionsParameters) => Promise<RequestPermissionsReturnType>;
  /**
   * Requests the connected wallet to send a batch of calls.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendCalls
   * - JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)
   *
   * @param client - Client to use
   * @returns Transaction identifier. {@link SendCallsReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const id = await client.sendCalls({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   calls: [
   *     {
   *       data: '0xdeadbeef',
   *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *     },
   *     {
   *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *       value: 69420n,
   *     },
   *   ],
   * })
   */
  sendCalls: <const calls extends readonly unknown[], chainOverride extends Chain$1 | undefined = undefined>(parameters: SendCallsParameters<chain$1, account$1, chainOverride, calls>) => Promise<SendCallsReturnType>;
  /**
   * Requests the connected wallet to send a batch of calls, and waits for the calls to be included in a block.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendCallsSync
   * - JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)
   *
   * @param client - Client to use
   * @returns Calls status. {@link SendCallsSyncReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const status = await client.sendCallsSync({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   calls: [
   *     {
   *       data: '0xdeadbeef',
   *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *     },
   *     {
   *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *       value: 69420n,
   *     },
   *   ],
   * })
   */
  sendCallsSync: <const calls extends readonly unknown[], chainOverride extends Chain$1 | undefined = undefined>(parameters: SendCallsSyncParameters<chain$1, account$1, chainOverride, calls>) => Promise<SendCallsSyncReturnType>;
  /**
   * Sends a **signed** transaction to the network
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
   * - JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
   *
   * @param client - Client to use
   * @param parameters - {@link SendRawTransactionParameters}
   * @returns The transaction hash. {@link SendRawTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { sendRawTransaction } from 'viem/wallet'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const hash = await client.sendRawTransaction({
   *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
   * })
   */
  sendRawTransaction: (args: SendRawTransactionParameters) => Promise<SendRawTransactionReturnType>;
  /**
   * Sends a **signed** transaction to the network synchronously,
   * and waits for the transaction to be included in a block.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransactionSync
   * - JSON-RPC Method: [`eth_sendRawTransactionSync`](https://eips.ethereum.org/EIPS/eip-7966)
   *
   * @param client - Client to use
   * @param parameters - {@link SendRawTransactionSyncParameters}
   * @returns The transaction receipt. {@link SendRawTransactionSyncReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { sendRawTransactionSync } from 'viem/wallet'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const receipt = await client.sendRawTransactionSync({
   *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
   * })
   */
  sendRawTransactionSync: (args: SendRawTransactionSyncParameters) => Promise<SendRawTransactionSyncReturnType<chain$1>>;
  /**
   * Creates, signs, and sends a new transaction to the network.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
   *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
   *
   * @param args - {@link SendTransactionParameters}
   * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const hash = await client.sendTransaction({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const hash = await client.sendTransaction({
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   */
  sendTransaction: <const request$1 extends SendTransactionRequest<chain$1, chainOverride>, chainOverride extends Chain$1 | undefined = undefined>(args: SendTransactionParameters<chain$1, account$1, chainOverride, request$1>) => Promise<SendTransactionReturnType>;
  /**
   * Creates, signs, and sends a new transaction to the network synchronously.
   * Returns the transaction receipt.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendTransactionSync
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
   *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
   *
   * @param args - {@link SendTransactionParameters}
   * @returns The transaction receipt. {@link SendTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const receipt = await client.sendTransactionSync({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const receipt = await client.sendTransactionSync({
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   */
  sendTransactionSync: <const request$1 extends SendTransactionSyncRequest<chain$1, chainOverride>, chainOverride extends Chain$1 | undefined = undefined>(args: SendTransactionSyncParameters<chain$1, account$1, chainOverride, request$1>) => Promise<SendTransactionSyncReturnType<chain$1>>;
  /**
   * Requests for the wallet to show information about a call batch
   * that was sent via `sendCalls`.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/showCallsStatus
   * - JSON-RPC Methods: [`wallet_showCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
   *
   * @param client - Client to use
   * @returns Displays status of the calls in wallet. {@link ShowCallsStatusReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * await client.showCallsStatus({ id: '0xdeadbeef' })
   */
  showCallsStatus: (parameters: ShowCallsStatusParameters) => Promise<ShowCallsStatusReturnType>;
  /**
   * Signs an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object.
   *
   * With the calculated signature, you can:
   * - use [`verifyAuthorization`](https://viem.sh/docs/eip7702/verifyAuthorization) to verify the signed Authorization object,
   * - use [`recoverAuthorizationAddress`](https://viem.sh/docs/eip7702/recoverAuthorizationAddress) to recover the signing address from the signed Authorization object.
   *
   * @param client - Client to use
   * @param parameters - {@link SignAuthorizationParameters}
   * @returns The signed Authorization object. {@link SignAuthorizationReturnType}
   *
   * @example
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const signature = await client.signAuthorization({
   *   account: privateKeyToAccount('0x..'),
   *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const signature = await client.signAuthorization({
   *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  signAuthorization: (parameters: SignAuthorizationParameters<account$1>) => Promise<SignAuthorizationReturnType$1>;
  /**
   * Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/signMessage
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
   *   - Local Accounts: Signs locally. No JSON-RPC request.
   *
   * With the calculated signature, you can:
   * - use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
   * - use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.
   *
   * @param args - {@link SignMessageParameters}
   * @returns The signed message. {@link SignMessageReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const signature = await client.signMessage({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   message: 'hello world',
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const signature = await client.signMessage({
   *   message: 'hello world',
   * })
   */
  signMessage: (args: SignMessageParameters<account$1>) => Promise<SignMessageReturnType>;
  /**
   * Signs a transaction.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/signTransaction
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
   *   - Local Accounts: Signs locally. No JSON-RPC request.
   *
   * @param args - {@link SignTransactionParameters}
   * @returns The signed message. {@link SignTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   * const signature = await client.signTransaction(request)
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   * const signature = await client.signTransaction(request)
   */
  signTransaction: <chainOverride extends Chain$1 | undefined, const request$1 extends SignTransactionRequest<chain$1, chainOverride> = SignTransactionRequest<chain$1, chainOverride>>(args: SignTransactionParameters<chain$1, account$1, chainOverride, request$1>) => Promise<SignTransactionReturnType<request$1>>;
  /**
   * Signs typed data and calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/signTypedData
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`eth_signTypedData_v4`](https://docs.metamask.io/guide/signing-data#signtypeddata-v4)
   *   - Local Accounts: Signs locally. No JSON-RPC request.
   *
   * @param client - Client to use
   * @param args - {@link SignTypedDataParameters}
   * @returns The signed data. {@link SignTypedDataReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const signature = await client.signTypedData({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   domain: {
   *     name: 'Ether Mail',
   *     version: '1',
   *     chainId: 1,
   *     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
   *   },
   *   types: {
   *     Person: [
   *       { name: 'name', type: 'string' },
   *       { name: 'wallet', type: 'address' },
   *     ],
   *     Mail: [
   *       { name: 'from', type: 'Person' },
   *       { name: 'to', type: 'Person' },
   *       { name: 'contents', type: 'string' },
   *     ],
   *   },
   *   primaryType: 'Mail',
   *   message: {
   *     from: {
   *       name: 'Cow',
   *       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
   *     },
   *     to: {
   *       name: 'Bob',
   *       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
   *     },
   *     contents: 'Hello, Bob!',
   *   },
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const signature = await client.signTypedData({
   *   domain: {
   *     name: 'Ether Mail',
   *     version: '1',
   *     chainId: 1,
   *     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
   *   },
   *   types: {
   *     Person: [
   *       { name: 'name', type: 'string' },
   *       { name: 'wallet', type: 'address' },
   *     ],
   *     Mail: [
   *       { name: 'from', type: 'Person' },
   *       { name: 'to', type: 'Person' },
   *       { name: 'contents', type: 'string' },
   *     ],
   *   },
   *   primaryType: 'Mail',
   *   message: {
   *     from: {
   *       name: 'Cow',
   *       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
   *     },
   *     to: {
   *       name: 'Bob',
   *       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
   *     },
   *     contents: 'Hello, Bob!',
   *   },
   * })
   */
  signTypedData: <const typedData extends TypedData | {
    [key: string]: unknown;
  }, primaryType$1 extends string>(args: SignTypedDataParameters<typedData, primaryType$1, account$1>) => Promise<SignTypedDataReturnType>;
  /**
   * Switch the target chain in a wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/switchChain
   * - JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
   *
   * @param args - {@link SwitchChainParameters}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet, optimism } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * await client.switchChain({ id: optimism.id })
   */
  switchChain: (args: SwitchChainParameters) => Promise<void>;
  /**
   * Waits for the status & receipts of a call bundle that was sent via `sendCalls`.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/waitForCallsStatus
   * - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
   *
   * @param client - Client to use
   * @param parameters - {@link WaitForCallsStatusParameters}
   * @returns Status & receipts of the call bundle. {@link WaitForCallsStatusReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const { receipts, status } = await waitForCallsStatus(client, { id: '0xdeadbeef' })
   */
  waitForCallsStatus: (parameters: WaitForCallsStatusParameters) => Promise<WaitForCallsStatusReturnType>;
  /**
   * Adds an EVM chain to the wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/watchAsset
   * - JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)
   *
   * @param args - {@link WatchAssetParameters}
   * @returns Boolean indicating if the token was successfully added. {@link WatchAssetReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const success = await client.watchAsset({
   *   type: 'ERC20',
   *   options: {
   *     address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
   *     decimals: 18,
   *     symbol: 'WETH',
   *   },
   * })
   */
  watchAsset: (args: WatchAssetParameters) => Promise<WatchAssetReturnType>;
  /**
   * Executes a write function on a contract.
   *
   * - Docs: https://viem.sh/docs/contract/writeContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts
   *
   * A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.
   *
   * Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * __Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__
   *
   * @param args - {@link WriteContractParameters}
   * @returns A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). {@link WriteContractReturnType}
   *
   * @example
   * import { createWalletClient, custom, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const hash = await client.writeContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
   *   functionName: 'mint',
   *   args: [69420],
   * })
   *
   * @example
   * // With Validation
   * import { createWalletClient, custom, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const { request } = await client.simulateContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
   *   functionName: 'mint',
   *   args: [69420],
   * }
   * const hash = await client.writeContract(request)
   */
  writeContract: <const abi$1 extends Abi | readonly unknown[], functionName$1 extends ContractFunctionName<abi$1, 'payable' | 'nonpayable'>, args$1 extends ContractFunctionArgs<abi$1, 'payable' | 'nonpayable', functionName$1>, chainOverride extends Chain$1 | undefined = undefined>(args: WriteContractParameters<abi$1, functionName$1, args$1, chain$1, account$1, chainOverride>) => Promise<WriteContractReturnType>;
  /**
   * Executes a write function on a contract synchronously.
   * Returns the transaction receipt.
   *
   * - Docs: https://viem.sh/docs/contract/writeContract
   *
   * A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.
   *
   * Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * __Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__
   *
   * @param args - {@link WriteContractSyncParameters}
   * @returns A [Transaction Receipt](https://viem.sh/docs/glossary/terms#receipt). {@link WriteContractSyncReturnType}
   *
   * @example
   * import { createWalletClient, custom, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const receipt = await client.writeContractSync({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
   *   functionName: 'mint',
   *   args: [69420],
   * })
   */
  writeContractSync: <const abi$1 extends Abi | readonly unknown[], functionName$1 extends ContractFunctionName<abi$1, 'payable' | 'nonpayable'>, args$1 extends ContractFunctionArgs<abi$1, 'payable' | 'nonpayable', functionName$1>, chainOverride extends Chain$1 | undefined = undefined>(args: WriteContractSyncParameters<abi$1, functionName$1, args$1, chain$1, account$1, chainOverride>) => Promise<WriteContractSyncReturnType>;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/sendRawTransactionSync.d.ts
type SendRawTransactionSyncParameters = {
  /** The signed serialized transaction. */
  serializedTransaction: TransactionSerializedGeneric;
  /** Whether to throw an error if the transaction was detected as reverted. @default true */
  throwOnReceiptRevert?: boolean | undefined;
  /** The timeout for the transaction. */
  timeout?: number | undefined;
};
type SendRawTransactionSyncReturnType<chain$1 extends Chain$1 | undefined = undefined> = FormattedTransactionReceipt<chain$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/sendTransactionSync.d.ts
type SendTransactionSyncRequest<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'> & GetTransactionRequestKzgParameter;
type SendTransactionSyncParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, request$1 extends SendTransactionSyncRequest<chain$1, chainOverride> = SendTransactionSyncRequest<chain$1, chainOverride>> = request$1 & GetAccountParameter<account$1, Account$1 | Address$2, true, true> & GetChainParameter<chain$1, chainOverride> & GetTransactionRequestKzgParameter<request$1> & {
  /** Whether to assert that the client chain is on the correct chain. @default true */
  assertChainId?: boolean | undefined;
  /** Polling interval (ms) to poll for the transaction receipt. @default client.pollingInterval */
  pollingInterval?: number | undefined;
  /** Whether to throw an error if the transaction was detected as reverted. @default true */
  throwOnReceiptRevert?: boolean | undefined;
  /** Timeout (ms) to wait for a response. @default Math.max(chain.blockTime * 3, 5_000) */
  timeout?: number | undefined;
};
type SendTransactionSyncReturnType<chain$1 extends Chain$1 | undefined = Chain$1 | undefined> = SendRawTransactionSyncReturnType<chain$1>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/writeContract.d.ts
type WriteContractParameters<abi$1 extends Abi | readonly unknown[] = Abi, functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'> = ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1> = ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, allFunctionNames$1 = ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = ContractFunctionParameters<abi$1, 'nonpayable' | 'payable', functionName$1, args$1, false, allFunctionNames$1> & GetChainParameter<chain$1, chainOverride> & Prettify<GetAccountParameter<account$1, Account$1 | Address$2, true, true> & GetMutabilityAwareValue<abi$1, 'nonpayable' | 'payable', functionName$1, FormattedTransactionRequest<derivedChain>['value'], args$1> & {
  /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
  dataSuffix?: Hex$1 | undefined;
}> & UnionEvaluate<UnionOmit<FormattedTransactionRequest<derivedChain>, 'data' | 'from' | 'to' | 'value'>>;
type WriteContractReturnType = SendTransactionReturnType;
type WriteContractErrorType = EncodeFunctionDataErrorType | AccountNotFoundErrorType | ParseAccountErrorType | GetContractErrorReturnType<SendTransactionErrorType> | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/simulateContract.d.ts
type GetMutabilityAwareValue<abi$1 extends Abi | readonly unknown[], mutability extends AbiStateMutability = AbiStateMutability, functionName$1 extends ContractFunctionName<abi$1, mutability> = ContractFunctionName<abi$1, mutability>, valueType = TransactionRequest['value'], args$1 extends ContractFunctionArgs<abi$1, mutability, functionName$1> = ContractFunctionArgs<abi$1, mutability, functionName$1>, abiFunction$1 extends AbiFunction = (abi$1 extends Abi ? ExtractAbiFunctionForArgs<abi$1, mutability, functionName$1, args$1> : AbiFunction), _Narrowable extends boolean = IsNarrowable<abi$1, Abi>> = _Narrowable extends true ? abiFunction$1['stateMutability'] extends 'payable' ? {
  value?: NoInfer<valueType> | undefined;
} : abiFunction$1['payable'] extends true ? {
  value?: NoInfer<valueType> | undefined;
} : {
  value?: undefined;
} : {
  value?: NoInfer<valueType> | undefined;
};
type SimulateContractParameters<abi$1 extends Abi | readonly unknown[] = Abi, functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'> = ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1> = ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, accountOverride extends Account$1 | Address$2 | null | undefined = undefined, derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>, callParameters extends CallParameters<derivedChain> = CallParameters<derivedChain>> = {
  account?: accountOverride | null | undefined;
  chain?: chainOverride | undefined;
  /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
  dataSuffix?: Hex$1 | undefined;
} & ContractFunctionParameters<abi$1, 'nonpayable' | 'payable', functionName$1, args$1> & UnionOmit<callParameters, 'account' | 'batch' | 'code' | 'to' | 'data' | 'factory' | 'factoryData' | 'value'> & GetMutabilityAwareValue<abi$1, 'nonpayable' | 'payable', functionName$1, callParameters['value'], args$1>;
type SimulateContractReturnType<out abi$1 extends Abi | readonly unknown[] = Abi, in out functionName$1 extends ContractFunctionName<abi$1, 'nonpayable' | 'payable'> = ContractFunctionName<abi$1, 'nonpayable' | 'payable'>, in out args$1 extends ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1> = ContractFunctionArgs<abi$1, 'nonpayable' | 'payable', functionName$1>, /** @ts-expect-error cast variance */
out chain$1 extends Chain$1 | undefined = Chain$1 | undefined, out account$1 extends Account$1 | undefined = Account$1 | undefined, out chainOverride extends Chain$1 | undefined = Chain$1 | undefined, out accountOverride extends Account$1 | Address$2 | null | undefined = Account$1 | Address$2 | null | undefined, in out minimizedAbi extends Abi = readonly [ExtractAbiFunctionForArgs<abi$1 extends Abi ? abi$1 : Abi, 'nonpayable' | 'payable', functionName$1, args$1>], out resolvedAccount extends Account$1 | null | undefined = (accountOverride extends Account$1 | Address$2 | null ? ParseAccount<accountOverride> : account$1)> = {
  result: ContractFunctionReturnType<minimizedAbi, 'nonpayable' | 'payable', functionName$1, args$1>;
  request: Prettify<UnionEvaluate<UnionOmit<WriteContractParameters<minimizedAbi, functionName$1, args$1, chain$1, undefined, chainOverride>, 'account' | 'abi' | 'args' | 'chain' | 'functionName'>> & ContractFunctionParameters<minimizedAbi, 'nonpayable' | 'payable', functionName$1, args$1> & {
    chain: DeriveChain<chain$1, chainOverride>;
  } & (resolvedAccount extends Account$1 | null ? {
    account: resolvedAccount;
  } : {
    account?: undefined;
  })>;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/transaction/getTransactionType.d.ts
type GetTransactionType<transaction$1 extends OneOf$1<TransactionSerializableGeneric | TransactionRequestGeneric> = TransactionSerializableGeneric, result = (transaction$1 extends LegacyProperties ? 'legacy' : never) | (transaction$1 extends EIP1559Properties ? 'eip1559' : never) | (transaction$1 extends EIP2930Properties ? 'eip2930' : never) | (transaction$1 extends EIP4844Properties ? 'eip4844' : never) | (transaction$1 extends EIP7702Properties ? 'eip7702' : never) | (transaction$1['type'] extends TransactionSerializableGeneric['type'] ? Extract<transaction$1['type'], string> : never)> = IsNever<keyof transaction$1> extends true ? string : IsNever<result> extends false ? result : string;
type BaseProperties = {
  accessList?: undefined;
  authorizationList?: undefined;
  blobs?: undefined;
  blobVersionedHashes?: undefined;
  gasPrice?: undefined;
  maxFeePerBlobGas?: undefined;
  maxFeePerGas?: undefined;
  maxPriorityFeePerGas?: undefined;
  sidecars?: undefined;
};
type LegacyProperties = Assign<BaseProperties, FeeValuesLegacy>;
type EIP1559Properties = Assign<BaseProperties, OneOf$1<{
  maxFeePerGas: FeeValuesEIP1559['maxFeePerGas'];
} | {
  maxPriorityFeePerGas: FeeValuesEIP1559['maxPriorityFeePerGas'];
}, FeeValuesEIP1559> & {
  accessList?: TransactionSerializableEIP2930['accessList'] | undefined;
}>;
type EIP2930Properties = Assign<ExactPartial$1<LegacyProperties>, {
  accessList: TransactionSerializableEIP2930['accessList'];
}>;
type EIP4844Properties = Assign<ExactPartial$1<EIP1559Properties>, ExactPartial$1<FeeValuesEIP4844> & OneOf$1<{
  blobs: TransactionSerializableEIP4844['blobs'];
} | {
  blobVersionedHashes: TransactionSerializableEIP4844['blobVersionedHashes'];
} | {
  sidecars: TransactionSerializableEIP4844['sidecars'];
}, TransactionSerializableEIP4844>>;
type EIP7702Properties = Assign<ExactPartial$1<EIP1559Properties>, {
  authorizationList: TransactionSerializableEIP7702['authorizationList'];
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/accounts/utils/signTransaction.d.ts
type SignTransactionErrorType = Keccak256ErrorType | SignErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/wallet/sendTransaction.d.ts
type SendTransactionRequest<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, _derivedChain extends Chain$1 | undefined = DeriveChain<chain$1, chainOverride>> = UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'> & GetTransactionRequestKzgParameter;
type SendTransactionParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, request$1 extends SendTransactionRequest<chain$1, chainOverride> = SendTransactionRequest<chain$1, chainOverride>> = request$1 & GetAccountParameter<account$1, Account$1 | Address$2, true, true> & GetChainParameter<chain$1, chainOverride> & GetTransactionRequestKzgParameter<request$1> & {
  /** Whether to assert that the client chain is on the correct chain. @default true */
  assertChainId?: boolean | undefined;
};
type SendTransactionReturnType = Hash$1;
type SendTransactionErrorType = ParseAccountErrorType | GetTransactionErrorReturnType<AccountNotFoundErrorType | AccountTypeNotSupportedErrorType | AssertCurrentChainErrorType | AssertRequestErrorType | GetChainIdErrorType | PrepareTransactionRequestErrorType | SendRawTransactionErrorType | RecoverAuthorizationAddressErrorType | SignTransactionErrorType | RequestErrorType> | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/errors/transaction.d.ts
type FeeConflictErrorType = FeeConflictError & {
  name: 'FeeConflictError';
};
declare class FeeConflictError extends BaseError$2 {
  constructor();
}
type TransactionExecutionErrorType = TransactionExecutionError$1 & {
  name: 'TransactionExecutionError';
};
declare class TransactionExecutionError$1 extends BaseError$2 {
  cause: BaseError$2;
  constructor(cause: BaseError$2, {
    account,
    docsPath,
    chain,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value
  }: Omit<SendTransactionParameters, 'account' | 'chain'> & {
    account: Account$1 | null;
    chain?: Chain$1 | undefined;
    docsPath?: string | undefined;
  });
}
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/utils/transaction/serializeTransaction.d.ts
type SerializedTransactionReturnType<transaction$1 extends TransactionSerializable = TransactionSerializable, _transactionType extends TransactionType$2 = GetTransactionType<transaction$1>> = TransactionSerialized<_transactionType>;
type SerializeTransactionFn<transaction$1 extends TransactionSerializableGeneric = TransactionSerializable, _transactionType extends TransactionType$2 = never> = (transaction: OneOf$1<TransactionSerializable | transaction$1>, signature?: Signature$1 | undefined) => MaybePromise<SerializedTransactionReturnType<OneOf$1<TransactionSerializable | transaction$1>, _transactionType>>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/accounts/types.d.ts
type Account$1<address$1 extends Address$2 = Address$2> = OneOf$1<JsonRpcAccount<address$1> | LocalAccount<string, address$1> | SmartAccount>;
type CustomSource = {
  address: Address$2;
  nonceManager?: NonceManager | undefined;
  sign?: ((parameters: {
    hash: Hash$1;
  }) => Promise<Hex$1>) | undefined;
  signAuthorization?: ((parameters: AuthorizationRequest) => Promise<SignAuthorizationReturnType>) | undefined;
  signMessage: ({
    message
  }: {
    message: SignableMessage;
  }) => Promise<Hex$1>;
  signTransaction: <serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>, transaction$1 extends Parameters<serializer>[0] = Parameters<serializer>[0]>(transaction: transaction$1, options?: {
    serializer?: serializer | undefined;
  } | undefined) => Promise<Hex$1>;
  signTypedData: <const typedData extends TypedData | Record<string, unknown>, primaryType$1 extends keyof typedData | 'EIP712Domain' = keyof typedData>(parameters: TypedDataDefinition<typedData, primaryType$1>) => Promise<Hex$1>;
};
type JsonRpcAccount<address$1 extends Address$2 = Address$2> = {
  address: address$1;
  type: 'json-rpc';
};
type LocalAccount<source extends string = string, address$1 extends Address$2 = Address$2> = Prettify<CustomSource & {
  address: address$1;
  publicKey: Hex$1;
  source: source;
  type: 'local';
}>;
type PrivateKeyAccount = Prettify<LocalAccount<'privateKey'> & {
  sign: NonNullable<CustomSource['sign']>;
  signAuthorization: NonNullable<CustomSource['signAuthorization']>;
}>;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/clients/createClient.d.ts
type ClientConfig$1<transport extends Transport$2 = Transport$2, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, accountOrAddress extends Account$1 | Address$2 | undefined = Account$1 | Address$2 | undefined, rpcSchema extends RpcSchema | undefined = undefined> = {
  /** The Account to use for the Client. This will be used for Actions that require an account as an argument. */
  account?: accountOrAddress | Account$1 | Address$2 | undefined;
  /** Flags for batch settings. */
  batch?: {
    /** Toggle to enable `eth_call` multicall aggregation. */
    multicall?: boolean | Prettify<MulticallBatchOptions> | undefined;
  } | undefined;
  /**
   * Default block tag to use for RPC requests.
   *
   * If the chain supports a pre-confirmation mechanism
   * (set via `chain.experimental_preconfirmationTime`), defaults to `'pending'`.
   *
   * @default 'latest'
   */
  experimental_blockTag?: BlockTag | undefined;
  /**
   * Time (in ms) that cached data will remain in memory.
   * @default chain.blockTime / 3
   */
  cacheTime?: number | undefined;
  /**
   * [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.
   * If `false`, the client will not support offchain CCIP lookups.
   */
  ccipRead?: {
    /**
     * A function that will be called to make the offchain CCIP lookup request.
     * @see https://eips.ethereum.org/EIPS/eip-3668#client-lookup-protocol
     */
    request?: (parameters: CcipRequestParameters) => Promise<CcipRequestReturnType>;
  } | false | undefined;
  /** Chain for the client. */
  chain?: Chain$1 | undefined | chain$1;
  /** A key for the client. */
  key?: string | undefined;
  /** A name for the client. */
  name?: string | undefined;
  /**
   * Frequency (in ms) for polling enabled actions & events.
   * @default chain.blockTime / 3
   */
  pollingInterval?: number | undefined;
  /**
   * Typed JSON-RPC schema for the client.
   */
  rpcSchema?: rpcSchema | undefined;
  /** The RPC transport */
  transport: transport;
  /** The type of client. */
  type?: string | undefined;
};
type ExtendableProtectedActions<transport extends Transport$2 = Transport$2, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined> = Pick<PublicActions<transport, chain$1, account$1>, 'call' | 'createContractEventFilter' | 'createEventFilter' | 'estimateContractGas' | 'estimateGas' | 'getBlock' | 'getBlockNumber' | 'getChainId' | 'getContractEvents' | 'getEnsText' | 'getFilterChanges' | 'getGasPrice' | 'getLogs' | 'getTransaction' | 'getTransactionCount' | 'getTransactionReceipt' | 'prepareTransactionRequest' | 'readContract' | 'sendRawTransaction' | 'simulateContract' | 'uninstallFilter' | 'watchBlockNumber' | 'watchContractEvent'> & Pick<WalletActions<chain$1, account$1>, 'sendTransaction' | 'writeContract'>;
type Client$1<transport extends Transport$2 = Transport$2, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, rpcSchema extends RpcSchema | undefined = undefined, extended extends Extended | undefined = Extended | undefined> = Client_Base<transport, chain$1, account$1, rpcSchema> & (extended extends Extended ? extended : unknown) & {
  extend: <const client extends Extended & ExactPartial$1<ExtendableProtectedActions<transport, chain$1, account$1>>>(fn: (client: Client$1<transport, chain$1, account$1, rpcSchema, extended>) => client) => Client$1<transport, chain$1, account$1, rpcSchema, Prettify<client> & (extended extends Extended ? extended : unknown)>;
};
type Client_Base<transport extends Transport$2 = Transport$2, chain$1 extends Chain$1 | undefined = Chain$1 | undefined, account$1 extends Account$1 | undefined = Account$1 | undefined, rpcSchema extends RpcSchema | undefined = undefined> = {
  /** The Account of the Client. */
  account: account$1;
  /** Flags for batch settings. */
  batch?: ClientConfig$1['batch'] | undefined;
  /** Time (in ms) that cached data will remain in memory. */
  cacheTime: number;
  /** [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration. */
  ccipRead?: ClientConfig$1['ccipRead'] | undefined;
  /** Chain for the client. */
  chain: chain$1;
  /** Default block tag to use for RPC requests. */
  experimental_blockTag?: BlockTag | undefined;
  /** A key for the client. */
  key: string;
  /** A name for the client. */
  name: string;
  /** Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds. */
  pollingInterval: number;
  /** Request function wrapped with friendly error handling */
  request: EIP1193RequestFn$1<rpcSchema extends undefined ? EIP1474Methods : rpcSchema>;
  /** The RPC transport */
  transport: ReturnType<transport>['config'] & ReturnType<transport>['value'];
  /** The type of client. */
  type: string;
  /** A unique ID for the client. */
  uid: string;
};
type Extended = Prettify<{ [_ in keyof Client_Base]?: undefined } & {
  [key: string]: unknown;
}>;
type MulticallBatchOptions = {
  /** The maximum size (in bytes) for each calldata chunk. @default 1_024 */
  batchSize?: number | undefined;
  /** Enable deployless multicall. */
  deployless?: boolean | undefined;
  /** The maximum number of milliseconds to wait before sending a batch. @default 0 */
  wait?: number | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/actions/public/estimateFeesPerGas.d.ts
type EstimateFeesPerGasParameters<chain$1 extends Chain$1 | undefined = Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined, type$1 extends FeeValuesType = FeeValuesType> = {
  /**
   * The type of fee values to return.
   *
   * - `legacy`: Returns the legacy gas price.
   * - `eip1559`: Returns the max fee per gas and max priority fee per gas.
   *
   * @default 'eip1559'
   */
  type?: type$1 | FeeValuesType | undefined;
} & GetChainParameter<chain$1, chainOverride>;
type EstimateFeesPerGasReturnType<type$1 extends FeeValuesType = FeeValuesType> = (type$1 extends 'legacy' ? FeeValuesLegacy : never) | (type$1 extends 'eip1559' ? FeeValuesEIP1559 : never);
type EstimateFeesPerGasErrorType = BaseFeeScalarErrorType | EstimateMaxPriorityFeePerGasErrorType | GetGasPriceErrorType | Eip1559FeesNotSupportedErrorType | ErrorType$2;
//#endregion
//#region ../node_modules/.pnpm/viem@2.44.4_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@5.0.10_zod@4.3.5/node_modules/viem/_types/types/chain.d.ts
type Chain$1<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined, extendSchema extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = {
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: ChainBlockExplorer;
    default: ChainBlockExplorer;
  } | undefined;
  /** Block time in milliseconds. */
  blockTime?: number | undefined;
  /** Collection of contracts */
  contracts?: Prettify<{
    [key: string]: ChainContract | {
      [sourceId: number]: ChainContract | undefined;
    } | undefined;
  } & {
    ensRegistry?: ChainContract | undefined;
    ensUniversalResolver?: ChainContract | undefined;
    multicall3?: ChainContract | undefined;
    erc6492Verifier?: ChainContract | undefined;
  }> | undefined;
  /** Collection of ENS TLDs for the chain. */
  ensTlds?: readonly string[] | undefined;
  /** ID in number form */
  id: number;
  /** Human-readable name */
  name: string;
  /** Currency used by chain */
  nativeCurrency: ChainNativeCurrency;
  /** Preconfirmation time in milliseconds. */
  experimental_preconfirmationTime?: number | undefined;
  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: ChainRpcUrls;
    default: ChainRpcUrls;
  };
  /** Source Chain ID (ie. the L1 chain) */
  sourceId?: number | undefined;
  /** Flag for test networks */
  testnet?: boolean | undefined;
} & ChainConfig<formatters$1, extendSchema>;
type PrepareTransactionRequestPhase = 'beforeFillTransaction' | 'beforeFillParameters' | 'afterFillParameters';
type PrepareTransactionRequestFn = (args: PrepareTransactionRequestParameters, options: {
  phase: PrepareTransactionRequestPhase;
}) => Promise<PrepareTransactionRequestParameters>;
type ChainVerifyHashFn = (client: Client$1, parameters: VerifyHashParameters) => Promise<VerifyHashReturnType>;
type ChainConfig<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined, extendSchema extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = {
  /** Custom chain data. @deprecated use `.extend` instead. */
  custom?: extendSchema | undefined;
  /** Extend schema. */
  extendSchema?: extendSchema | undefined;
  /** Modifies how fees are derived. */
  fees?: ChainFees<formatters$1 | undefined> | undefined;
  /** Modifies how data is formatted and typed (e.g. blocks and transactions) */
  formatters?: formatters$1 | undefined;
  /** Function to prepare a transaction request. Runs before the transaction is filled. */
  prepareTransactionRequest?: PrepareTransactionRequestFn | [fn: PrepareTransactionRequestFn | undefined, options: {
    /**
     * Phases to run the function at.
     *
     * - `beforeFillTransaction`: Before the transaction is attempted to be filled via `eth_fillTransaction`.
     * - `beforeFillParameters`: Before missing parameters are filled.
     * - `afterFillParameters`: After missing parameters are filled.
     */
    runAt: readonly PrepareTransactionRequestPhase[];
  }] | undefined;
  /** Modifies how data is serialized (e.g. transactions). */
  serializers?: ChainSerializers<formatters$1> | undefined;
  /** Chain-specific signature verification. */
  verifyHash?: ChainVerifyHashFn | undefined;
};
type ChainFeesFnParameters<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined> = {
  /** The latest block. */
  block: Prettify<FormattedBlock<Omit<Chain$1, 'formatters'> & {
    formatters: formatters$1;
  }>>;
  client: Client$1<Transport$2, Chain$1>;
  /**
   * A transaction request. This value will be undefined if the caller
   * is outside of a transaction request context (e.g. a direct call to
   * the `estimateFeesPerGas` Action).
   */
  request?: PrepareTransactionRequestParameters<Omit<Chain$1, 'formatters'> & {
    formatters: formatters$1;
  }, Account$1 | undefined, undefined> | undefined;
};
type ChainEstimateFeesPerGasFnParameters<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined> = {
  /** A function to multiply the base fee based on the `baseFeeMultiplier` value. */
  multiply: (x: bigint) => bigint;
  /** The type of fees to return. */
  type: FeeValuesType;
} & ChainFeesFnParameters<formatters$1>;
type ChainEstimateFeesPerGasFn<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined> = (args: ChainEstimateFeesPerGasFnParameters<formatters$1>) => Promise<EstimateFeesPerGasReturnType | null>;
type ChainMaxPriorityFeePerGasFn<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined> = (args: ChainFeesFnParameters<formatters$1>) => Promise<bigint | null> | bigint | null;
type ChainFees<formatters$1 extends ChainFormatters | undefined = ChainFormatters | undefined> = {
  /**
   * The fee multiplier to use to account for fee fluctuations.
   * Used in the [`estimateFeesPerGas` Action](/docs/actions/public/estimateFeesPerGas).
   *
   * @default 1.2
   */
  baseFeeMultiplier?: number | ((args: ChainFeesFnParameters<formatters$1>) => Promise<number> | number);
  /**
   * The default `maxPriorityFeePerGas` to use when a priority
   * fee is not defined upon sending a transaction.
   *
   * Overrides the return value in the [`estimateMaxPriorityFeePerGas` Action](/docs/actions/public/estimateMaxPriorityFeePerGas).
   */
  maxPriorityFeePerGas?: bigint | ChainMaxPriorityFeePerGasFn<formatters$1> | undefined;
  /** @deprecated Use `maxPriorityFeePerGas` instead. */
  defaultPriorityFee?: bigint | ChainMaxPriorityFeePerGasFn<formatters$1> | undefined;
  /**
   * Allows customization of fee per gas values (e.g. `maxFeePerGas`/`maxPriorityFeePerGas`).
   *
   * Overrides the return value in the [`estimateFeesPerGas` Action](/docs/actions/public/estimateFeesPerGas).
   */
  estimateFeesPerGas?: ChainEstimateFeesPerGasFn<formatters$1> | undefined;
};
type ChainFormatters = {
  /** Modifies how the Block structure is formatted & typed. */
  block?: ChainFormatter<'block'> | undefined;
  /** Modifies how the Transaction structure is formatted & typed. */
  transaction?: ChainFormatter<'transaction'> | undefined;
  /** Modifies how the TransactionReceipt structure is formatted & typed. */
  transactionReceipt?: ChainFormatter<'transactionReceipt'> | undefined;
  /** Modifies how the TransactionRequest structure is formatted & typed. */
  transactionRequest?: ChainFormatter<'transactionRequest'> | undefined;
};
type ChainFormatter<type$1 extends string = string> = {
  format: (args: any, action?: string | undefined) => any;
  type: type$1;
};
type ChainSerializers<formatters$1 extends ChainFormatters | undefined = undefined, transaction$1 extends TransactionSerializableGeneric = (formatters$1 extends ChainFormatters ? formatters$1['transactionRequest'] extends ChainFormatter ? TransactionSerializableGeneric & Parameters<formatters$1['transactionRequest']['format']>[0] : TransactionSerializable : TransactionSerializable)> = {
  /** Modifies how Transactions are serialized. */
  transaction?: SerializeTransactionFn<transaction$1, TransactionSerializedGeneric> | undefined;
};
type ExtractChainFormatterExclude<chain$1 extends Chain$1 | undefined, type$1 extends keyof ChainFormatters> = chain$1 extends {
  formatters?: infer formatters extends ChainFormatters;
} ? formatters[type$1] extends {
  exclude: infer exclude;
} ? Extract<exclude, readonly string[]>[number] : '' : '';
type ExtractChainFormatterParameters<chain$1 extends Chain$1 | undefined, type$1 extends keyof ChainFormatters, fallback> = chain$1 extends {
  formatters?: infer formatters extends ChainFormatters;
} ? formatters[type$1] extends ChainFormatter ? Parameters<formatters[type$1]['format']>[0] : fallback : fallback;
type ExtractChainFormatterReturnType<chain$1 extends Chain$1 | undefined, type$1 extends keyof ChainFormatters, fallback> = IsNarrowable<chain$1, Chain$1> extends true ? chain$1 extends {
  formatters?: { [_ in type$1]?: infer formatter extends ChainFormatter } | undefined;
} ? chain$1['formatters'] extends undefined ? fallback : IsNarrowable<formatter, ChainFormatter<type$1>> extends true ? ReturnType<formatter['format']> : fallback : fallback : fallback;
type DeriveChain<chain$1 extends Chain$1 | undefined, chainOverride extends Chain$1 | undefined> = chainOverride extends Chain$1 ? chainOverride : chain$1;
type GetChainParameter<chain$1 extends Chain$1 | undefined, chainOverride extends Chain$1 | undefined = Chain$1 | undefined> = IsUndefined<chain$1> extends true ? {
  chain: chainOverride | null;
} : {
  chain?: chainOverride | null | undefined;
};
type ChainBlockExplorer = {
  name: string;
  url: string;
  apiUrl?: string | undefined;
};
type ChainContract = {
  address: Address$2;
  blockCreated?: number | undefined;
};
type ChainNativeCurrency = {
  name: string;
  /** 2-6 characters long */
  symbol: string;
  decimals: number;
};
type ChainRpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[] | undefined;
};
//#endregion
//#region ../node_modules/.pnpm/zustand@5.0.0_@types+react@19.2.7_react@19.2.3_use-sync-external-store@1.4.0_react@19.2.3_/node_modules/zustand/esm/vanilla.d.mts
type SetStateInternal<T$1> = {
  _(partial: T$1 | Partial<T$1> | {
    _(state: T$1): T$1 | Partial<T$1>;
  }['_'], replace?: false): void;
  _(state: T$1 | {
    _(state: T$1): T$1;
  }['_'], replace: true): void;
}['_'];
interface StoreApi<T$1> {
  setState: SetStateInternal<T$1>;
  getState: () => T$1;
  getInitialState: () => T$1;
  subscribe: (listener: (state: T$1, prevState: T$1) => void) => () => void;
}
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/createEmitter.d.ts
type EventMap = Record<string, object | never>;
type EventKey<eventMap extends EventMap> = string & keyof eventMap;
type EventFn<parameters extends unknown[] = any[]> = (...parameters: parameters) => void;
declare class Emitter<eventMap extends EventMap> {
  uid: string;
  _emitter: EventEmitter<string | symbol, any>;
  constructor(uid: string);
  on<key$1 extends EventKey<eventMap>>(eventName: key$1, fn: EventFn<eventMap[key$1] extends [never] ? [{
    uid: string;
  }] : [data: eventMap[key$1] & {
    uid: string;
  }]>): void;
  once<key$1 extends EventKey<eventMap>>(eventName: key$1, fn: EventFn<eventMap[key$1] extends [never] ? [{
    uid: string;
  }] : [data: eventMap[key$1] & {
    uid: string;
  }]>): void;
  off<key$1 extends EventKey<eventMap>>(eventName: key$1, fn: EventFn<eventMap[key$1] extends [never] ? [{
    uid: string;
  }] : [data: eventMap[key$1] & {
    uid: string;
  }]>): void;
  emit<key$1 extends EventKey<eventMap>>(eventName: key$1, ...params: eventMap[key$1] extends [never] ? [] : [data: eventMap[key$1]]): void;
  listenerCount<key$1 extends EventKey<eventMap>>(eventName: key$1): number;
}
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/types/utils.d.ts
/** Combines members of an intersection into a readable type. */
type Compute<type$1> = { [key in keyof type$1]: type$1[key] } & unknown;
/**
 * Makes all properties of an object optional.
 *
 * Compatible with [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes).
 */
type ExactPartial<type$1> = { [key in keyof type$1]?: type$1[key] | undefined };
/** Strict version of built-in Omit type */
type StrictOmit<type$1, keys extends keyof type$1> = Pick<type$1, Exclude<keyof type$1, keys>>;
/** Makes objects destructurable. */
type OneOf<union extends object, keys extends KeyofUnion<union> = KeyofUnion<union>> = union extends infer Item ? Compute<Item & { [K in Exclude<keys, keyof Item>]?: undefined }> : never;
type KeyofUnion<type$1> = type$1 extends type$1 ? keyof type$1 : never;
/** Makes {@link key} optional in {@link type} while preserving type inference. */
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/createStorage.d.ts
type StorageItemMap = {
  recentConnectorId: string;
  state: PartializedState;
};
type Storage<itemMap extends Record<string, unknown> = Record<string, unknown>, storageItemMap extends StorageItemMap = StorageItemMap & itemMap> = {
  key: string;
  getItem<key$1 extends keyof storageItemMap, value$1 extends storageItemMap[key$1], defaultValue$1 extends value$1 | null | undefined>(key: key$1, defaultValue?: defaultValue$1 | undefined): (defaultValue$1 extends null ? value$1 | null : value$1) | Promise<defaultValue$1 extends null ? value$1 | null : value$1>;
  setItem<key$1 extends keyof storageItemMap, value$1 extends storageItemMap[key$1] | null>(key: key$1, value: value$1): void | Promise<void>;
  removeItem(key: keyof storageItemMap): void | Promise<void>;
};
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/connectors/createConnector.d.ts
type ConnectorEventMap = {
  change: {
    accounts?: readonly Address[] | undefined;
    chainId?: number | undefined;
  };
  connect: {
    accounts: readonly Address[];
    chainId: number;
  };
  disconnect: never;
  error: {
    error: Error;
  };
  message: {
    type: string;
    data?: unknown | undefined;
  };
};
type CreateConnectorFn$1<provider = unknown, properties extends Record<string, unknown> = Record<string, unknown>, storageItem extends Record<string, unknown> = Record<string, unknown>> = (config: {
  chains: readonly [Chain, ...Chain[]];
  emitter: Emitter<ConnectorEventMap>;
  storage?: Compute<Storage<storageItem>> | null | undefined;
  transports?: Record<number, Transport$1> | undefined;
}) => Compute<{
  readonly icon?: string | undefined;
  readonly id: string;
  readonly name: string;
  readonly rdns?: string | readonly string[] | undefined;
  /** @deprecated */
  readonly supportsSimulation?: boolean | undefined;
  readonly type: string;
  setup?(): Promise<void>;
  connect<withCapabilities extends boolean = false>(parameters?: {
    chainId?: number | undefined;
    isReconnecting?: boolean | undefined;
    withCapabilities?: withCapabilities | boolean | undefined;
  } | undefined): Promise<{
    accounts: withCapabilities extends true ? readonly {
      address: Address;
      capabilities: Record<string, unknown>;
    }[] : readonly Address[];
    chainId: number;
  }>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<readonly Address[]>;
  getChainId(): Promise<number>;
  getProvider(parameters?: {
    chainId?: number | undefined;
  } | undefined): Promise<provider>;
  getClient?(parameters?: {
    chainId?: number | undefined;
  } | undefined): Promise<Client>;
  isAuthorized(): Promise<boolean>;
  switchChain?(parameters: Compute<{
    addEthereumChainParameter?: ExactPartial<StrictOmit<AddEthereumChainParameter, 'chainId'>> | undefined;
    chainId: number;
  }>): Promise<Chain>;
  onAccountsChanged(accounts: string[]): void;
  onChainChanged(chainId: string): void;
  onConnect?(connectInfo: ProviderConnectInfo): void;
  onDisconnect(error?: Error | undefined): void;
  onMessage?(message: ProviderMessage): void;
} & properties>;
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/createConfig.d.ts
type State$1<chains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]]> = {
  chainId: chains[number]['id'];
  connections: Map<string, Connection>;
  current: string | null;
  status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
};
type PartializedState = Compute<ExactPartial<Pick<State$1, 'chainId' | 'connections' | 'current' | 'status'>>>;
type Connection = {
  accounts: readonly [Address, ...Address[]];
  chainId: number;
  connector: Connector;
};
type Connector<createConnectorFn extends CreateConnectorFn$1 = CreateConnectorFn$1> = ReturnType<createConnectorFn> & {
  emitter: Emitter<ConnectorEventMap>;
  uid: string;
};
type Transport$1<type$1 extends string = string, rpcAttributes = Record<string, any>, eip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn> = (params: Parameters<Transport<type$1, rpcAttributes, eip1193RequestFn>>[0] & {
  connectors?: StoreApi<Connector[]> | undefined;
}) => ReturnType<Transport<type$1, rpcAttributes, eip1193RequestFn>>;
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/errors/base.d.ts
type ErrorType$1<name$1 extends string = 'Error'> = Error & {
  name: name$1;
};
type BaseErrorOptions = Compute<OneOf<{
  details?: string | undefined;
} | {
  cause: BaseError$1 | Error;
}> & {
  docsPath?: string | undefined;
  docsSlug?: string | undefined;
  metaMessages?: string[] | undefined;
}>;
type BaseErrorType$1 = BaseError$1 & {
  name: 'WagmiCoreError';
};
declare class BaseError$1 extends Error {
  #private;
  details: string;
  docsPath?: string | undefined;
  metaMessages?: string[] | undefined;
  shortMessage: string;
  name: string;
  get docsBaseUrl(): string;
  get version(): string;
  constructor(shortMessage: string, options?: BaseErrorOptions);
  walk(fn?: (err: unknown) => boolean): unknown;
}
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/errors/config.d.ts
type ConnectorNotConnectedErrorType = ConnectorNotConnectedError & {
  name: 'ConnectorNotConnectedError';
};
declare class ConnectorNotConnectedError extends BaseError$1 {
  name: string;
  constructor();
}
type ConnectorAccountNotFoundErrorType = ConnectorAccountNotFoundError$1 & {
  name: 'ConnectorAccountNotFoundError';
};
declare class ConnectorAccountNotFoundError$1 extends BaseError$1 {
  name: string;
  constructor({
    address,
    connector
  }: {
    address: Address;
    connector: Connector;
  });
}
type ConnectorChainMismatchErrorType = ConnectorAccountNotFoundError$1 & {
  name: 'ConnectorChainMismatchError';
};
type ConnectorUnavailableReconnectingErrorType = ConnectorUnavailableReconnectingError$1 & {
  name: 'ConnectorUnavailableReconnectingError';
};
declare class ConnectorUnavailableReconnectingError$1 extends BaseError$1 {
  name: string;
  constructor({
    connector
  }: {
    connector: {
      name: string;
    };
  });
}
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/actions/getConnectorClient.d.ts
type GetConnectorClientErrorType = ConnectorAccountNotFoundErrorType | ConnectorChainMismatchErrorType | ConnectorNotConnectedErrorType | ConnectorUnavailableReconnectingErrorType | BaseErrorType | ErrorType$1;
//#endregion
//#region ../node_modules/.pnpm/@wagmi+core@2.22.0_@tanstack+query-core@5.90.16_@types+react@19.2.7_react@19.2.3_typesc_2a5fd7b814b3a8755edf3ade7d0b4322/node_modules/@wagmi/core/dist/types/actions/writeContract.d.ts
type WriteContractErrorType$1 = GetConnectorClientErrorType | BaseErrorType$1 | ErrorType$1 | WriteContractErrorType;
//#endregion
//#region ../node_modules/.pnpm/zustand@5.0.3_@types+react@19.2.7_react@19.2.3_use-sync-external-store@1.4.0_react@19.2.3_/node_modules/zustand/esm/middleware/redux.d.mts
type Write$3<T$1, U> = Omit<T$1, keyof U> & U;
type StoreRedux<A> = {
  dispatch: (a: A) => A;
  dispatchFromDevtools: true;
};
type WithRedux<S, A> = Write$3<S, StoreRedux<A>>;
declare module '../vanilla.mjs' {
  interface StoreMutators<S, A> {
    'zustand/redux': WithRedux<S, A>;
  }
}
//#endregion
//#region ../node_modules/.pnpm/zustand@5.0.3_@types+react@19.2.7_react@19.2.3_use-sync-external-store@1.4.0_react@19.2.3_/node_modules/zustand/esm/middleware/devtools.d.mts
declare module '../vanilla.mjs' {
  interface StoreMutators<S, A> {
    'zustand/devtools': WithDevtools<S>;
  }
}
type Cast<T$1, U> = T$1 extends U ? T$1 : U;
type Write$2<T$1, U> = Omit<T$1, keyof U> & U;
type TakeTwo<T$1> = T$1 extends {
  length: 0;
} ? [undefined, undefined] : T$1 extends {
  length: 1;
} ? [...a0: Cast<T$1, unknown[]>, a1: undefined] : T$1 extends {
  length: 0 | 1;
} ? [...a0: Cast<T$1, unknown[]>, a1: undefined] : T$1 extends {
  length: 2;
} ? T$1 : T$1 extends {
  length: 1 | 2;
} ? T$1 : T$1 extends {
  length: 0 | 1 | 2;
} ? T$1 : T$1 extends [infer A0, infer A1, ...unknown[]] ? [A0, A1] : T$1 extends [infer A0, (infer A1)?, ...unknown[]] ? [A0, A1?] : T$1 extends [(infer A0)?, (infer A1)?, ...unknown[]] ? [A0?, A1?] : never;
type WithDevtools<S> = Write$2<S, StoreDevtools<S>>;
type Action = string | {
  type: string;
  [x: string | number | symbol]: unknown;
};
type StoreDevtools<S> = S extends {
  setState: {
    (...a: infer Sa1): infer Sr1;
    (...a: infer Sa2): infer Sr2;
  };
} ? {
  setState(...a: [...a: TakeTwo<Sa1>, action?: Action]): Sr1;
  setState(...a: [...a: TakeTwo<Sa2>, action?: Action]): Sr2;
} : never;
declare module '../vanilla.mjs' {
  interface StoreMutators<S, A> {
    'zustand/devtools': WithDevtools<S>;
  }
}
//#endregion
//#region ../node_modules/.pnpm/zustand@5.0.3_@types+react@19.2.7_react@19.2.3_use-sync-external-store@1.4.0_react@19.2.3_/node_modules/zustand/esm/middleware/subscribeWithSelector.d.mts
type Write$1<T$1, U> = Omit<T$1, keyof U> & U;
type WithSelectorSubscribe<S> = S extends {
  getState: () => infer T;
} ? Write$1<S, StoreSubscribeWithSelector<T>> : never;
declare module '../vanilla.mjs' {
  interface StoreMutators<S, A> {
    ['zustand/subscribeWithSelector']: WithSelectorSubscribe<S>;
  }
}
type StoreSubscribeWithSelector<T$1> = {
  subscribe: {
    (listener: (selectedState: T$1, previousSelectedState: T$1) => void): () => void;
    <U>(selector: (state: T$1) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
      equalityFn?: (a: U, b: U) => boolean;
      fireImmediately?: boolean;
    }): () => void;
  };
};
//#endregion
//#region ../node_modules/.pnpm/zustand@5.0.3_@types+react@19.2.7_react@19.2.3_use-sync-external-store@1.4.0_react@19.2.3_/node_modules/zustand/esm/middleware/persist.d.mts
type StorageValue<S> = {
  state: S;
  version?: number;
};
interface PersistStorage<S> {
  getItem: (name: string) => StorageValue<S> | null | Promise<StorageValue<S> | null>;
  setItem: (name: string, value: StorageValue<S>) => unknown | Promise<unknown>;
  removeItem: (name: string) => unknown | Promise<unknown>;
}
interface PersistOptions<S, PersistedState = S> {
  /** Name of the storage (must be unique) */
  name: string;
  /**
   * Use a custom persist storage.
   *
   * Combining `createJSONStorage` helps creating a persist storage
   * with JSON.parse and JSON.stringify.
   *
   * @default createJSONStorage(() => localStorage)
   */
  storage?: PersistStorage<PersistedState> | undefined;
  /**
   * Filter the persisted value.
   *
   * @params state The state's value
   */
  partialize?: (state: S) => PersistedState;
  /**
   * A function returning another (optional) function.
   * The main function will be called before the state rehydration.
   * The returned function will be called after the state rehydration or when an error occurred.
   */
  onRehydrateStorage?: (state: S) => ((state?: S, error?: unknown) => void) | void;
  /**
   * If the stored state's version mismatch the one specified here, the storage will not be used.
   * This is useful when adding a breaking change to your store.
   */
  version?: number;
  /**
   * A function to perform persisted state migration.
   * This function will be called when persisted state versions mismatch with the one specified here.
   */
  migrate?: (persistedState: unknown, version: number) => PersistedState | Promise<PersistedState>;
  /**
   * A function to perform custom hydration merges when combining the stored state with the current one.
   * By default, this function does a shallow merge.
   */
  merge?: (persistedState: unknown, currentState: S) => S;
  /**
   * An optional boolean that will prevent the persist middleware from triggering hydration on initialization,
   * This allows you to call `rehydrate()` at a specific point in your apps rendering life-cycle.
   *
   * This is useful in SSR application.
   *
   * @default false
   */
  skipHydration?: boolean;
}
type PersistListener<S> = (state: S) => void;
type StorePersist<S, Ps> = {
  persist: {
    setOptions: (options: Partial<PersistOptions<S, Ps>>) => void;
    clearStorage: () => void;
    rehydrate: () => Promise<void> | void;
    hasHydrated: () => boolean;
    onHydrate: (fn: PersistListener<S>) => () => void;
    onFinishHydration: (fn: PersistListener<S>) => () => void;
    getOptions: () => Partial<PersistOptions<S, Ps>>;
  };
};
declare module '../vanilla.mjs' {
  interface StoreMutators<S, A> {
    'zustand/persist': WithPersist<S, A>;
  }
}
type Write<T$1, U> = Omit<T$1, keyof U> & U;
type WithPersist<S, A> = S extends {
  getState: () => infer T;
} ? Write<S, StorePersist<T, A>> : never;
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/assets/wallet-logo.d.ts
type LogoType = 'standard' | 'circle' | 'text' | 'textWithLogo' | 'textLight' | 'textWithLogoLight';
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/core/type.d.ts
interface Tag<T$1 extends string, RealType> {
  __tag__: T$1;
  __realType__: RealType;
}
type OpaqueType<T$1 extends string, U> = U & Tag<T$1, U>;
declare function OpaqueType<T$1 extends Tag<string, unknown>>(): (value: T$1 extends Tag<string, infer U> ? U : never) => T$1;
type HexString = OpaqueType<'HexString', string>;
declare const HexString: (value: string) => HexString;
type AddressString = OpaqueType<'AddressString', string>;
declare const AddressString: (value: string) => AddressString;
type BigIntString = OpaqueType<'BigIntString', string>;
declare const BigIntString: (value: string) => BigIntString;
type IntNumber = OpaqueType<'IntNumber', number>;
declare function IntNumber(num: number): IntNumber;
type RegExpString = OpaqueType<'RegExpString', string>;
declare const RegExpString: (value: string) => RegExpString;
type Callback<T$1> = (err: Error | null, result: T$1 | null) => void;
declare enum ProviderType {
  CoinbaseWallet = "CoinbaseWallet",
  MetaMask = "MetaMask",
  Unselected = "",
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/lib/ScopedLocalStorage.d.ts
declare class ScopedLocalStorage {
  private scope;
  constructor(scope: string);
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
  private scopedKey;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/core/error/utils.d.ts
/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 */
interface SerializedEthereumRpcError {
  code: number;
  message: string;
  data?: unknown;
  stack?: string;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/core/error/serialize.d.ts
interface SerializedError extends SerializedEthereumRpcError {
  docUrl: string;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/core/error/index.d.ts
type ErrorType = Error | SerializedError;
type ErrorHandler = (error?: ErrorType) => void;
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/provider/JSONRPC.d.ts
interface JSONRPCRequest<T$1 = any> {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params: T$1;
}
interface JSONRPCResponse<T$1 = any, U = any> {
  jsonrpc: '2.0';
  id: number;
  result?: T$1;
  error?: {
    code: number;
    message: string;
    data?: U;
  } | null;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/Session.d.ts
declare class Session {
  private readonly _id;
  private readonly _secret;
  private readonly _key;
  private readonly _storage;
  private _linked;
  constructor(storage: ScopedLocalStorage, id?: string, secret?: string, linked?: boolean);
  static load(storage: ScopedLocalStorage): Session | null;
  /**
   * Takes in a session ID and returns the sha256 hash of it.
   * @param sessionId session ID
   */
  static hash(sessionId: string): string;
  get id(): string;
  get secret(): string;
  get key(): string;
  get linked(): boolean;
  set linked(val: boolean);
  save(): Session;
  private persistLinked;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/type/EthereumTransactionParams.d.ts
interface EthereumTransactionParams {
  fromAddress: AddressString;
  toAddress: AddressString | null;
  weiValue: BN;
  data: Buffer;
  nonce: IntNumber | null;
  gasPriceInWei: BN | null;
  maxFeePerGas: BN | null;
  maxPriorityFeePerGas: BN | null;
  gasLimit: BN | null;
  chainId: IntNumber;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/type/Web3Method.d.ts
declare const web3Methods: readonly ["requestEthereumAccounts", "signEthereumMessage", "signEthereumTransaction", "submitEthereumTransaction", "ethereumAddressFromSignedMessage", "scanQRCode", "generic", "childRequestEthereumAccounts", "addEthereumChain", "switchEthereumChain", "makeEthereumJSONRPCRequest", "watchAsset", "selectProvider", "connectAndSignIn"];
type Web3Method = (typeof web3Methods)[number];
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/type/Web3Request.d.ts
type Web3Request<M extends Web3Method = Web3Method> = Extract<_Web3Request, {
  method: M;
}>;
type SupportedWeb3Method = Extract<Web3Method, _Web3Request['method']>;
type _Web3Request = {
  method: 'requestEthereumAccounts';
  params: {
    appName: string;
    appLogoUrl: string | null;
  };
} | {
  method: 'childRequestEthereumAccounts';
} | {
  method: 'connectAndSignIn';
  params: {
    appName: string;
    appLogoUrl: string | null;
    domain: string;
    aud: string;
    version: string;
    type: string;
    nonce: string;
    iat: string;
    chainId: string;
    statement?: string;
    resources?: string[];
  };
} | {
  method: 'addEthereumChain';
  params: {
    chainId: string;
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    rpcUrls: string[];
    nativeCurrency?: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
} | {
  method: 'switchEthereumChain';
  params: {
    chainId: string;
    address?: string;
  };
} | {
  method: 'signEthereumMessage';
  params: {
    message: HexString;
    address: AddressString;
    addPrefix: boolean;
    typedDataJson: string | null;
  };
} | {
  method: 'signEthereumTransaction';
  params: {
    fromAddress: AddressString;
    toAddress: AddressString | null;
    weiValue: BigIntString;
    data: HexString;
    nonce: IntNumber | null;
    gasPriceInWei: BigIntString | null;
    maxFeePerGas: BigIntString | null;
    maxPriorityFeePerGas: BigIntString | null;
    gasLimit: BigIntString | null;
    chainId: IntNumber;
    shouldSubmit: boolean;
  };
} | {
  method: 'submitEthereumTransaction';
  params: {
    signedTransaction: HexString;
    chainId: IntNumber;
  };
} | {
  method: 'ethereumAddressFromSignedMessage';
  params: {
    message: HexString;
    signature: HexString;
    addPrefix: boolean;
  };
} | {
  method: 'scanQRCode';
  params: {
    regExp: RegExpString;
  };
} | {
  method: 'generic';
  params: {
    action: string;
    data: object;
  };
} | {
  method: 'selectProvider';
  params: {
    providerOptions: ProviderType[];
  };
} | {
  method: 'makeEthereumJSONRPCRequest';
  params: {
    rpcMethod: string;
    rpcParams: unknown[];
    chainId: string;
  };
} | {
  method: 'watchAsset';
  params: {
    type: string;
    options: {
      address: string;
      symbol?: string;
      decimals?: number;
      image?: string;
    };
    chainId?: string;
  };
};
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/type/Web3Response.d.ts
type Web3Response<M extends Web3Method = Web3Method> = Extract<_Web3Response, {
  method: M;
}> | ErrorResponse;
type ErrorResponse = {
  method: unknown;
  errorCode?: number;
  errorMessage: string;
};
type _Web3Response = {
  method: 'connectAndSignIn';
  result: {
    accounts: AddressString[];
    message: HexString;
    signature: HexString;
  };
} | {
  method: 'addEthereumChain';
  result: {
    isApproved: boolean;
    rpcUrl: string;
  };
} | {
  method: 'switchEthereumChain';
  result: {
    isApproved: boolean;
    rpcUrl: string;
  };
} | {
  method: 'requestEthereumAccounts';
  result: AddressString[];
} | {
  method: 'watchAsset';
  result: boolean;
} | {
  method: 'selectProvider';
  result: ProviderType;
} | {
  method: 'signEthereumMessage';
  result: HexString;
} | {
  method: 'signEthereumTransaction';
  result: HexString;
} | {
  method: 'submitEthereumTransaction';
  result: HexString;
} | {
  method: 'ethereumAddressFromSignedMessage';
  result: AddressString;
} | {
  method: 'scanQRCode';
  result: string;
} | {
  method: 'generic';
  result: string;
} | {
  method: 'makeEthereumJSONRPCRequest';
  result: unknown;
};
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/RelayAbstract.d.ts
type CancelablePromise<T$1> = {
  promise: Promise<T$1>;
  cancel: ErrorHandler;
};
declare abstract class RelayAbstract {
  abstract resetAndReload(): void;
  abstract requestEthereumAccounts(): CancelablePromise<Web3Response<'requestEthereumAccounts'>>;
  abstract addEthereumChain(chainId: string, rpcUrls: string[], iconUrls: string[], blockExplorerUrls: string[], chainName: string, nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  }): CancelablePromise<Web3Response<'addEthereumChain'>>;
  abstract watchAsset(type: string, address: string, symbol?: string, decimals?: number, image?: string, chainId?: string): CancelablePromise<Web3Response<'watchAsset'>>;
  abstract selectProvider(providerOptions: ProviderType[]): CancelablePromise<Web3Response<'selectProvider'>>;
  abstract switchEthereumChain(chainId: string, address?: string): CancelablePromise<Web3Response<'switchEthereumChain'>>;
  abstract signEthereumMessage(message: Buffer, address: AddressString, addPrefix: boolean, typedDataJson?: string | null): CancelablePromise<Web3Response<'signEthereumMessage'>>;
  abstract ethereumAddressFromSignedMessage(message: Buffer, signature: Buffer, addPrefix: boolean): CancelablePromise<Web3Response<'ethereumAddressFromSignedMessage'>>;
  abstract signEthereumTransaction(params: EthereumTransactionParams): CancelablePromise<Web3Response<'signEthereumTransaction'>>;
  abstract signAndSubmitEthereumTransaction(params: EthereumTransactionParams): CancelablePromise<Web3Response<'submitEthereumTransaction'>>;
  abstract submitEthereumTransaction(signedTransaction: Buffer, chainId: IntNumber): CancelablePromise<Web3Response<'submitEthereumTransaction'>>;
  abstract scanQRCode(regExp: RegExpString): CancelablePromise<Web3Response<'scanQRCode'>>;
  abstract genericRequest(data: object, action: string): CancelablePromise<Web3Response<'generic'>>;
  abstract sendRequest<RequestMethod extends SupportedWeb3Method, ResponseMethod extends SupportedWeb3Method = RequestMethod>(request: Web3Request<RequestMethod>): CancelablePromise<Web3Response<ResponseMethod>>;
  abstract setAppInfo(appName: string, appLogoUrl: string | null): void;
  abstract setAccountsCallback(accountsCallback: (accounts: string[], isDisconnect?: boolean) => void): void;
  abstract setChainCallback(chainIdCallback: (chainId: string, jsonRpcUrl: string) => void): void;
  abstract setDappDefaultChainCallback(chainId: number): void;
  /**
   * Whether the relay supports the add ethereum chain call without
   * needing to be connected to the mobile client.
   */
  abstract inlineAddEthereumChain(chainId: string): boolean;
  makeEthereumJSONRPCRequest(request: JSONRPCRequest, jsonRpcUrl: string): Promise<JSONRPCResponse | void>;
  abstract get session(): Session;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/RelayEventManager.d.ts
type ResponseCallback = (response: Web3Response) => void;
declare class RelayEventManager {
  _nextRequestId: number;
  callbacks: Map<string, ResponseCallback>;
  makeRequestId(): number;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/type/ServerMessage.d.ts
type ServerMessage<T$1 extends Type$1 = Type$1> = Extract<_ServerMessage, {
  type: T$1;
}>;
type Type$1 = _ServerMessage['type'];
type _ServerMessage = {
  type: 'Heartbeat';
} | {
  type: 'OK';
  id: IntNumber;
  sessionId: string;
} | {
  type: 'Fail';
  id: IntNumber;
  sessionId: string;
  error: string;
} | {
  type: 'IsLinkedOK';
  id: IntNumber;
  sessionId: string;
  linked: boolean;
  onlineGuests: number;
} | {
  type: 'Linked';
  id?: IntNumber;
  sessionId: string;
  onlineGuests: number;
} | {
  type: 'GetSessionConfigOK';
  id: IntNumber;
  sessionId: string;
  webhookId: string;
  webhookUrl: string;
  metadata: {
    [field: string]: string;
  };
} | {
  type: 'SessionConfigUpdated';
  id?: IntNumber;
  sessionId: string;
  webhookId: string;
  webhookUrl: string;
  metadata: {
    [field: string]: string;
  };
} | {
  type: 'PublishEventOK';
  id: IntNumber;
  sessionId: string;
  eventId: string;
} | {
  type: 'Event';
  id?: IntNumber;
  sessionId: string;
  eventId: string;
  event: string;
  data: string;
};
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/connection/WalletLinkWebSocket.d.ts
declare enum ConnectionState {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2,
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/walletlink/type/WalletLinkEventData.d.ts
type Type = 'SESSION_ID_REQUEST' | 'SESSION_ID_RESPONSE' | 'LINKED' | 'UNLINKED' | 'WEB3_REQUEST' | 'WEB3_REQUEST_CANCELED' | 'WEB3_RESPONSE';
type WalletLinkEventData = {
  type: Type;
  id: string;
} & ({
  type: 'WEB3_RESPONSE';
  response: Web3Response;
} | {
  type: 'WEB3_REQUEST';
  request: Web3Request;
} | {
  type: 'WEB3_REQUEST_CANCELED';
});
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/provider/DiagnosticLogger.d.ts
type LogProperties = {
  addresses_length?: number;
  alreadyDestroyed?: boolean;
  eventId?: WalletLinkEventData['id'];
  isSessionMismatched?: string;
  linked?: ServerMessage<'IsLinkedOK'>['linked'];
  message?: string;
  metadata_keys?: string[];
  method?: string;
  onlineGuests?: number;
  sessionIdHash?: string;
  sessionMetadataChange?: string;
  state?: ConnectionState;
  storedSessionIdHash?: string;
  type?: ServerMessage['type'];
  value?: string;
};
type Keys = keyof typeof EVENTS;
type EventType$1 = (typeof EVENTS)[Keys];
interface DiagnosticLogger {
  log(eventType: EventType$1, logProperties?: LogProperties): void;
}
declare const EVENTS: {
  STARTED_CONNECTING: string;
  CONNECTED_STATE_CHANGE: string;
  DISCONNECTED: string;
  METADATA_DESTROYED: string;
  LINKED: string;
  FAILURE: string;
  SESSION_CONFIG_RECEIVED: string;
  ETH_ACCOUNTS_STATE: string;
  SESSION_STATE_CHANGE: string;
  UNLINKED_ERROR_STATE: string;
  SKIPPED_CLEARING_SESSION: string;
  GENERAL_ERROR: string;
  WEB3_REQUEST: string;
  WEB3_REQUEST_PUBLISHED: string;
  WEB3_RESPONSE: string;
  METHOD_NOT_IMPLEMENTED: string;
  UNKNOWN_ADDRESS_ENCOUNTERED: string;
};
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/provider/Web3Provider.d.ts
interface Web3Provider {
  send(request: JSONRPCRequest): JSONRPCResponse;
  send(request: JSONRPCRequest[]): JSONRPCResponse[];
  send(request: JSONRPCRequest, callback: Callback<JSONRPCResponse>): void;
  send(request: JSONRPCRequest[], callback: Callback<JSONRPCResponse[]>): void;
  send<T$1 = unknown>(method: string, params?: unknown[] | unknown): Promise<T$1>;
  sendAsync(request: JSONRPCRequest, callback: Callback<JSONRPCResponse>): void;
  sendAsync(request: JSONRPCRequest[], callback: Callback<JSONRPCResponse[]>): void;
  request<T$1>(args: RequestArguments): Promise<T$1>;
  host: string;
  connected: boolean;
  chainId: string;
  supportsSubscriptions(): boolean;
  disconnect(): boolean;
}
interface RequestArguments {
  /** The RPC method to request. */
  method: string;
  /** The params of the RPC method, if any. */
  params?: unknown;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/provider/CoinbaseWalletProvider.d.ts
interface CoinbaseWalletProviderOptions {
  chainId: number;
  jsonRpcUrl: string;
  qrUrl?: string | null;
  overrideIsCoinbaseWallet?: boolean;
  overrideIsCoinbaseBrowser?: boolean;
  overrideIsMetaMask: boolean;
  relayEventManager: RelayEventManager;
  relayProvider: () => Promise<RelayAbstract>;
  storage: ScopedLocalStorage;
  diagnosticLogger?: DiagnosticLogger;
}
declare class CoinbaseWalletProvider extends EventEmitter implements Web3Provider {
  readonly isCoinbaseWallet: boolean;
  readonly isCoinbaseBrowser: boolean;
  readonly qrUrl?: string | null;
  reloadOnDisconnect: boolean;
  private readonly _filterPolyfill;
  private readonly _subscriptionManager;
  private readonly _relayProvider;
  private _relay;
  private readonly _storage;
  private readonly _relayEventManager;
  private readonly diagnostic?;
  private _chainIdFromOpts;
  private _jsonRpcUrlFromOpts;
  private readonly _overrideIsMetaMask;
  private _addresses;
  private hasMadeFirstChainChangedEmission;
  constructor(options: Readonly<CoinbaseWalletProviderOptions>);
  /** @deprecated Use `.request({ method: 'eth_accounts' })` instead. */
  get selectedAddress(): AddressString | undefined;
  /** @deprecated Use the chain ID. If you still need the network ID, use `.request({ method: 'net_version' })`. */
  get networkVersion(): string;
  /** @deprecated Use `.request({ method: 'eth_chainId' })` instead. */
  get chainId(): string;
  get isWalletLink(): boolean;
  /**
   * Some DApps (i.e. Alpha Homora) seem to require the window.ethereum object return
   * true for this method.
   */
  get isMetaMask(): boolean;
  get host(): string;
  get connected(): boolean;
  isConnected(): boolean;
  private get jsonRpcUrl();
  private set jsonRpcUrl(value);
  disableReloadOnDisconnect(): void;
  setProviderInfo(jsonRpcUrl: string, chainId: number): void;
  private updateProviderInfo;
  private watchAsset;
  private addEthereumChain;
  private switchEthereumChain;
  setAppInfo(appName: string, appLogoUrl: string | null): void;
  /** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
  enable(): Promise<AddressString[]>;
  close(): Promise<void>;
  /** @deprecated Use `.request(...)` instead. */
  send(request: JSONRPCRequest): JSONRPCResponse;
  send(request: JSONRPCRequest[]): JSONRPCResponse[];
  send(request: JSONRPCRequest, callback: Callback<JSONRPCResponse>): void;
  send(request: JSONRPCRequest[], callback: Callback<JSONRPCResponse[]>): void;
  send<T$1 = any>(method: string, params?: any[] | any): Promise<T$1>;
  private _send;
  /** @deprecated Use `.request(...)` instead. */
  sendAsync(request: JSONRPCRequest, callback: Callback<JSONRPCResponse>): void;
  sendAsync(request: JSONRPCRequest[], callback: Callback<JSONRPCResponse[]>): void;
  private _sendAsync;
  request<T$1>(args: RequestArguments): Promise<T$1>;
  private _request;
  scanQRCode(match?: RegExp): Promise<string>;
  genericRequest(data: object, action: string): Promise<string>;
  /**
   * @beta
   * This method is currently in beta. While it is available for use, please note that it is still under testing and may undergo significant changes.
   *
   * @remarks
   * IMPORTANT: Signature validation is not performed by this method. Users of this method are advised to perform their own signature validation.
   * Common web3 frontend libraries such as ethers.js and viem provide the `verifyMessage` utility function that can be used for signature validation.
   *
   * It combines `eth_requestAccounts` and "Sign-In with Ethereum" (EIP-4361) into a single call.
   * The returned account and signed message can be used to authenticate the user.
   *
   * @param {Object} params - An object with the following properties:
   * - `nonce` {string}: A unique string to prevent replay attacks.
   * - `statement` {string}: An optional human-readable ASCII assertion that the user will sign.
   * - `resources` {string[]}: An optional list of information the user wishes to have resolved as part of authentication by the relying party.
   *
   * @returns {Promise<ConnectAndSignInResponse>} A promise that resolves to an object with the following properties:
   * - `accounts` {string[]}: The Ethereum accounts of the user.
   * - `message` {string}: The overall message that the user signed. Hex encoded.
   * - `signature` {string}: The signature of the message, signed with the user's private key. Hex encoded.
   */
  connectAndSignIn(params: {
    nonce: string;
    statement?: string;
    resources?: string[];
  }): Promise<{
    accounts: AddressString[];
    message: HexString;
    signature: HexString;
  }>;
  selectProvider(providerOptions: ProviderType[]): Promise<ProviderType>;
  supportsSubscriptions(): boolean;
  subscribe(): void;
  unsubscribe(): void;
  disconnect(): boolean;
  private _sendRequest;
  protected _setAddresses(addresses: string[], _?: boolean): void;
  private _sendRequestAsync;
  private _sendMultipleRequestsAsync;
  private _handleSynchronousMethods;
  private _handleAsynchronousMethods;
  private _handleAsynchronousFilterMethods;
  private _handleSubscriptionMethods;
  private _isKnownAddress;
  private _ensureKnownAddress;
  private _prepareTransactionParams;
  protected _isAuthorized(): boolean;
  private _requireAuthorization;
  private _throwUnsupportedMethodError;
  private _signEthereumMessage;
  private _ethereumAddressFromSignedMessage;
  private _eth_accounts;
  private _eth_coinbase;
  private _net_version;
  private _eth_chainId;
  private getChainId;
  private _eth_requestAccounts;
  private _eth_sign;
  private _eth_ecRecover;
  private _personal_sign;
  private _personal_ecRecover;
  private _eth_signTransaction;
  private _eth_sendRawTransaction;
  private _eth_sendTransaction;
  private _eth_signTypedData_v1;
  private _eth_signTypedData_v3;
  private _eth_signTypedData_v4;
  /** @deprecated */
  private _cbwallet_arbitrary;
  private _wallet_addEthereumChain;
  private _wallet_switchEthereumChain;
  private _wallet_watchAsset;
  private _eth_uninstallFilter;
  private _eth_newFilter;
  private _eth_newBlockFilter;
  private _eth_newPendingTransactionFilter;
  private _eth_getFilterChanges;
  private _eth_getFilterLogs;
  private initializeRelay;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/relay/RelayUI.d.ts
interface RelayUIOptions {
  linkAPIUrl: string;
  version: string;
  darkMode: boolean;
  session: Session;
}
interface RelayUI {
  attach(): void;
  setConnected(connected: boolean): void;
  /**
   * Opens a qr code or auth page to connect with Coinbase Wallet mobile app
   * @param options onCancel callback
   *
   */
  requestEthereumAccounts(options: {
    onCancel: ErrorHandler;
    onAccounts?: (accounts: [AddressString]) => void;
  }): void;
  addEthereumChain(options: {
    onCancel: ErrorHandler;
    onApprove: (rpcUrl: string) => void;
    chainId: string;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    nativeCurrency?: {
      name: string;
      symbol: string;
      decimals: number;
    };
  }): void;
  watchAsset(options: {
    onCancel: ErrorHandler;
    onApprove: () => void;
    type: string;
    address: string;
    symbol?: string;
    decimals?: number;
    image?: string;
    chainId?: string;
  }): void;
  selectProvider?(options: {
    onCancel: ErrorHandler;
    onApprove: (selectedProviderKey: ProviderType) => void;
    providerOptions: ProviderType[];
  }): void;
  switchEthereumChain(options: {
    onCancel: ErrorHandler;
    onApprove: (rpcUrl: string) => void;
    chainId: string;
    address?: string;
  }): void;
  signEthereumMessage(options: {
    request: Web3Request<'signEthereumMessage'>;
    onSuccess: (response: Web3Response<'signEthereumMessage'>) => void;
    onCancel: ErrorHandler;
  }): void;
  signEthereumTransaction(options: {
    request: Web3Request<'signEthereumTransaction'>;
    onSuccess: (response: Web3Response<'signEthereumTransaction'>) => void;
    onCancel: ErrorHandler;
  }): void;
  submitEthereumTransaction(options: {
    request: Web3Request<'submitEthereumTransaction'>;
    onSuccess: (response: Web3Response<'submitEthereumTransaction'>) => void;
    onCancel: ErrorHandler;
  }): void;
  ethereumAddressFromSignedMessage(options: {
    request: Web3Request<'ethereumAddressFromSignedMessage'>;
    onSuccess: (response: Web3Response<'ethereumAddressFromSignedMessage'>) => void;
  }): void;
  /**
   * Hide the link flow
   */
  hideRequestEthereumAccounts(): void;
  /**
   *
   * @param options onCancel callback for user clicking cancel,
   *  onResetConnection user clicked reset connection
   *
   * @returns callback that call can call to hide the connecting ui
   */
  showConnecting(options: {
    isUnlinkedErrorState?: boolean;
    onCancel: ErrorHandler;
    onResetConnection: () => void;
  }): () => void;
  /**
   * Reload document ui
   */
  reloadUI(): void;
  /**
   * In some cases, we get the accounts response inline. This means the extension can handle
   * returning the accounts resposne.
   * (i.e. don't need to call a websocket api to get the accounts response)
   */
  inlineAccountsResponse(): boolean;
  /**
   * If the extension is available, it can handle the add ethereum chain request without
   * having to send a request to Coinbase Wallet mobile app
   */
  inlineAddEthereumChain(chainId: string): boolean;
  /**
   * If the extension is available, it can handle the watch asset request without
   * having to send a request to Coinbase Wallet mobile app
   */
  inlineWatchAsset(): boolean;
  /**
   * If the extension is available, it can handle the switch ethereum chain request without
   * having to send a request to Coinbase Wallet mobile app
   */
  inlineSwitchEthereumChain(): boolean;
  /**
   * Set whether the UI is in standalone mode, to preserve context when disconnecting
   */
  setStandalone?(status: boolean): void;
  /**
   * If the extension is in standalone mode, it can handle signing locally
   */
  isStandalone(): boolean;
  /**
   * We want to disable showing the qr code for in-page connection if the dapp hasn't provided a json rpc url
   */
  setConnectDisabled(_: boolean): void;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/CoinbaseWalletSDK.d.ts
/** Coinbase Wallet SDK Constructor Options */
interface CoinbaseWalletSDKOptions {
  /** Application name */
  appName: string;
  /** @optional Application logo image URL; favicon is used if unspecified */
  appLogoUrl?: string | null;
  /** @optional Use dark theme */
  darkMode?: boolean;
  /** @optional Coinbase Wallet link server URL; for most, leave it unspecified */
  linkAPIUrl?: string;
  /** @optional an implementation of WalletUI; for most, leave it unspecified */
  uiConstructor?: (options: Readonly<RelayUIOptions>) => RelayUI;
  /** @optional a diagnostic tool for debugging; for most, leave it unspecified  */
  diagnosticLogger?: DiagnosticLogger;
  /** @optional whether wallet link provider should override the isMetaMask property. */
  overrideIsMetaMask?: boolean;
  /** @optional whether wallet link provider should override the isCoinbaseWallet property. */
  overrideIsCoinbaseWallet?: boolean;
  /** @optional whether coinbase wallet provider should override the isCoinbaseBrowser property. */
  overrideIsCoinbaseBrowser?: boolean;
  /** @optional whether or not onboarding overlay popup should be displayed */
  headlessMode?: boolean;
  /** @optional whether or not to reload dapp automatically after disconnect, defaults to true */
  reloadOnDisconnect?: boolean;
  /** @optional whether to connect mobile web app via WalletLink, defaults to false */
  enableMobileWalletLink?: boolean;
}
declare class CoinbaseWalletSDK {
  static VERSION: string;
  private _appName;
  private _appLogoUrl;
  private _relay;
  private _relayEventManager;
  private _storage;
  private _overrideIsMetaMask;
  private _overrideIsCoinbaseWallet;
  private _overrideIsCoinbaseBrowser;
  private _diagnosticLogger?;
  private _reloadOnDisconnect?;
  /**
   * Constructor
   * @param options Coinbase Wallet SDK constructor options
   */
  constructor(options: Readonly<CoinbaseWalletSDKOptions>);
  /**
   * Create a Web3 Provider object
   * @param jsonRpcUrl Ethereum JSON RPC URL (Default: "")
   * @param chainId Ethereum Chain ID (Default: 1)
   * @returns A Web3 Provider
   */
  makeWeb3Provider(jsonRpcUrl?: string, chainId?: number): CoinbaseWalletProvider;
  /**
   * Set application information
   * @param appName Application name
   * @param appLogoUrl Application logo image URL
   */
  setAppInfo(appName: string | undefined, appLogoUrl: string | null | undefined): void;
  /**
   * Disconnect. After disconnecting, this will reload the web page to ensure
   * all potential stale state is cleared.
   */
  disconnect(): void;
  /**
   * Return QR URL for mobile wallet connection, will return null if extension is installed
   */
  getQrUrl(): string | null;
  /**
   * Official Coinbase Wallet logo for developers to use on their frontend
   * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
   * @param width Width of the logo (Optional)
   * @returns SVG Data URI
   */
  getCoinbaseWalletLogo(type: LogoType, width?: number): string;
  private get walletExtension();
  private get coinbaseBrowser();
  private isCipherProvider;
}
//#endregion
//#region ../node_modules/.pnpm/@coinbase+wallet-sdk@3.9.3/node_modules/@coinbase/wallet-sdk/dist/index.d.ts
declare global {
  interface Window {
    CoinbaseWalletSDK: typeof CoinbaseWalletSDK;
    CoinbaseWalletProvider: typeof CoinbaseWalletProvider;
    /**
     * For CoinbaseWalletSDK, window.ethereum is `CoinbaseWalletProvider`
     */
    ethereum?: any;
    coinbaseWalletExtension?: CoinbaseWalletProvider;
    /**
     * @deprecated Legacy API
     */
    WalletLink: typeof CoinbaseWalletSDK;
    /**
     * @deprecated Legacy API
     */
    WalletLinkProvider: typeof CoinbaseWalletProvider;
    /**
     * @deprecated Legacy API
     */
    walletLinkExtension?: CoinbaseWalletProvider;
  }
}
//#endregion
//#region src/react/_internal/wagmi/get-connectors.d.ts
declare function getConnectors({
  marketplaceConfig,
  sdkConfig,
  walletType,
  ssr
}: {
  marketplaceConfig: MarketplaceConfig;
  sdkConfig: SdkConfig;
  walletType: MarketplaceWalletType;
  ssr?: boolean;
}): CreateConnectorFn[];
declare function getWaasConnectors(config: SdkConfig, marketplaceConfig: MarketplaceConfig): Wallet[];
declare function getEcosystemConnector(marketplaceConfig: MarketplaceConfig, sdkConfig: SdkConfig): Wallet;
//#endregion
//#region src/react/ui/modals/_internal/types.d.ts
type ActionButton = {
  label: string;
  action: () => void;
};
//#endregion
//#region src/react/ui/modals/BuyModal/store.d.ts
type PaymentModalProps = {
  tokenId: bigint;
  marketplace: MarketplaceKind;
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
  item: {
    tokenId: bigint;
  };
};
type MarketplaceBuyModalProps = BuyModalBaseProps & {
  cardType?: 'market';
  tokenId: bigint;
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
type PropsEvent = Record<string, string>;
type NumsEvent = Record<string, number>;
type Transaction = PropsEvent & {
  chainId: string;
  txnHash: string;
};
type TradeItemsInfo = PropsEvent & {
  marketplaceKind: MarketplaceKind;
  userId: string;
  collectionAddress: string;
  currencyAddress: string;
  currencySymbol: string;
};
type TradeItemsValues = NumsEvent & {
  currencyValueDecimal: number;
  currencyValueRaw: number;
};
type BuyModalOpenedProps = Omit<BuyModalProps, 'marketplaceType' | 'customCreditCardProviderCallback' | 'chainId' | 'skipNativeBalanceCheck' | 'nativeTokenAddress' | 'successActionButtons' | 'hideQuantitySelector'> & {
  buyAnalyticsId: string;
};
type BuyModalOpenedNums = {
  chainId: number;
};
type TrackBuyModalOpened = {
  props: BuyModalOpenedProps;
  nums: BuyModalOpenedNums;
};
type TrackSellItems = {
  props: TradeItemsInfo & Transaction;
  nums: TradeItemsValues;
};
type ListOfferItemsInfo = PropsEvent & {
  orderbookKind: OrderbookKind;
  collectionAddress: string;
  currencyAddress: string;
  currencySymbol: string;
};
type ListOfferItemsValues = NumsEvent & {
  currencyValueDecimal: number;
  currencyValueRaw: number;
};
type TrackCreateListing = {
  props: ListOfferItemsInfo & Transaction;
  nums: ListOfferItemsValues;
};
type TrackCreateOffer = {
  props: ListOfferItemsInfo & Transaction;
  nums: ListOfferItemsValues;
};
type TrackTransactionFailed = Transaction & PropsEvent;
//#endregion
//#region src/react/_internal/databeat/index.d.ts
type EventTypes = keyof typeof EventType;
type Event$2 = Event$1<EventTypes>;
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
type MarketplaceConfig = {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketPage;
  shop: ShopPage;
};
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
type EcosystemWalletSettings = {
  walletUrl: string;
  walletAppName: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
};
type MarketplaceWalletOptions = {
  walletType: MarketplaceWalletType;
  oidcIssuers: {
    [key: string]: string;
  };
  connectors: Array<string>;
  includeEIP6963Wallets: boolean;
  ecosystem?: EcosystemWalletSettings;
  waas?: MarketplaceWalletWaasSettings;
};
type MarketplaceWalletWaasSettings = {
  tenantKey: string;
  emailEnabled: boolean;
  providers: Array<OpenIdProvider>;
};
type MetadataFilterRule = {
  key: string;
  condition: FilterCondition;
  value?: string;
};
type CollectionFilterSettings = {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule>;
};
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
        trails?: ApiConfig;
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
 * Transaction modes for the buy modal
 * Used to distinguish between secondary market purchases and primary sales (minting)
 */
declare enum TransactionType$1 {
  /** Secondary market purchases from existing orders */
  MARKET_BUY = "MARKET_BUY",
  /** Primary sales - direct from creator/contract (minting/shop) */
  PRIMARY_SALE = "PRIMARY_SALE",
}
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
export { EnsureAllRequiredKeys as $, serializeBigInts as A, Optional as B, useAnalytics as C, marketplaceApiURL as Ct, getWaasConnectors as D, fetchMarketplaceConfig as Dt, getEcosystemConnector as E, getQueryClient as Et, CollectableId as F, SellInput as G, QueryKeyArgs as H, CollectionType as I, TransactionType$4 as J, Transaction$2 as K, HookParamsFromApiRequest as L, ApiArgs as M, BuyInput as N, WriteContractErrorType$1 as O, marketplaceConfigOptions as Ot, CancelInput as P, BaseQueryParams as Q, ListingInput as R, EventTypes as S, indexerURL as St, getConnectors as T, SequenceMarketplace as Tt, SdkInfiniteQueryParams as U, QueryArg as V, SdkQueryParams as W, WithRequired as X, ValuesOptional as Y, BaseInfiniteQueryParams as Z, Price as _, getSequenceApiClient as _t, CheckoutMode as a, buildInfiniteQueryOptions as at, DatabeatAnalytics as b, getSequenceNodeGatewayUrl as bt, SdkConfig as c, StandardInfiniteQueryOptions as ct, CollectionFilterSettings as d, getProviderEl as dt, InfiniteQueryBuilderConfig as et, EcosystemWalletSettings as f, DEFAULT_NETWORK as ft, MetadataFilterRule as g, getMetadataClient as gt, MarketplaceWalletWaasSettings as h, getMarketplaceClient as ht, ApiConfig as i, WithOptionalParams as it, AllRequired as j, clamp as k, BuilderAPI as kt, CardType as l, StandardQueryOptions as lt, MarketplaceWalletOptions as m, getIndexerClient as mt, getWagmiChainsAndTransports as n, RequiredKeys as nt, Env as o, buildQueryOptions as ot, MarketplaceConfig as p, getBuilderClient as pt, TransactionSteps as q, TransactionType$1 as r, WithOptionalInfiniteParams as rt, MarketplaceSdkContext as s, requiredParamsFor as st, createWagmiConfig as t, QueryBuilderConfig as tt, CollectibleCardAction as u, PROVIDER_ID as ut, isMarketCollection as v, getSequenceApiUrl as vt, BuyModalProps as w, sequenceApiUrl as wt, Event$2 as x, getTrailsApiUrl as xt, isShopCollection as y, getSequenceIndexerUrl as yt, OfferInput as z };
//# sourceMappingURL=create-config.d.ts.map