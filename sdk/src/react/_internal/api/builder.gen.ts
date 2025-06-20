// Relevant parts for lookupMarketplace & common Webrpc utilities
// sequence-builder v0.1.0 52bd730f3b821fe99051d69ced824442369efe4a
// --
// Code generated by webrpc-gen@v0.26.0 with typescript generator. DO NOT EDIT.
//
// webrpc-gen -schema=builder.main.ridl -target=typescript -client -out=../../webapp/src/rpc/proto/builder.gen.ts

import type { OrderbookKind } from "./marketplace.gen";

export const WebrpcHeader = "Webrpc";
export const WebrpcHeaderValue =
  "webrpc@v0.26.0;gen-typescript@v0.17.0;sequence-builder@v0.1.0";

//
// Types for lookupMarketplace
//

export enum MarketplaceWalletType {
  UNIVERSAL = "UNIVERSAL",
  EMBEDDED = "EMBEDDED",
  ECOSYSTEM = "ECOSYSTEM",
}

export enum FilterCondition {
  ENTIRE_KEY = "ENTIRE_KEY",
  SPECIFIC_VALUE = "SPECIFIC_VALUE",
}

export interface LookupMarketplaceArgs {
  projectId?: number;
  domain?: string;
}

export interface LookupMarketplaceReturn {
  marketplace: Marketplace;
  marketCollections: Array<MarketCollection>;
  shopCollections: Array<ShopCollection>;
}

export interface Marketplace {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketplacePage;
  shop: MarketplacePage;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketplaceSettings {
  style: { [key: string]: any };
  publisherId: string;
  title: string;
  socials: MarketplaceSocials;
  faviconUrl: string;
  walletOptions: MarketplaceWallet;
  logoUrl: string;
  fontUrl: string;
  accessKey?: string;
}

export interface MarketplacePage {
  enabled: boolean
  bannerUrl: string
  ogImage: string
  private: boolean
}

export interface MarketplaceSocials {
  twitter: string;
  discord: string;
  website: string;
  tiktok: string;
  instagram: string;
  youtube: string;
}

export interface MarketplaceWallet {
  walletType: MarketplaceWalletType;
  oidcIssuers: { [key: string]: string };
  connectors: Array<string>;
  includeEIP6963Wallets: boolean;
  ecosystem?: MarketplaceWalletEcosystem;
  embedded?: MarketplaceWalletEmbedded;
}

export interface MarketplaceWalletEcosystem {
  walletUrl: string;
  walletAppName: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
}

export interface MarketplaceWalletEmbedded {
  tenantKey: string;
  emailEnabled: boolean;
  providers: Array<OpenIdProvider>;
}

export interface OpenIdProvider {
  iss: string;
  aud: Array<string>;
}

export interface MarketCollection {
  id: number;
  projectId: number;
  chainId: number;
  itemsAddress: string;
  contractType: string;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionFilterSettings {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule>;
}

export interface MetadataFilterRule {
  key: string;
  condition: FilterCondition;
  value?: string;
}

export interface ShopCollection {
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

//
// Service Interface Definition for MarketplaceService (relevant part)
//
export interface MarketplaceService {
  /**
   * Public Methods
   */
  lookupMarketplace(
    args: LookupMarketplaceArgs,
    headers?: object,
    signal?: AbortSignal
  ): Promise<LookupMarketplaceReturn>;
}

//
// Errors (Complete set from original)
//

export class WebrpcError extends Error {
  name: string;
  code: number;
  message: string;
  status: number;
  cause?: string;

  /** @deprecated Use message instead of msg. Deprecated in webrpc v0.11.0. */
  msg: string;

  constructor(
    name: string,
    code: number,
    message: string,
    status: number,
    cause?: string
  ) {
    super(message);
    this.name = name || "WebrpcError";
    this.code = typeof code === "number" ? code : 0;
    this.message = message || `endpoint error ${this.code}`;
    this.msg = this.message;
    this.status = typeof status === "number" ? status : 0;
    this.cause = cause;
    Object.setPrototypeOf(this, WebrpcError.prototype);
  }

  static new(payload: any): WebrpcError {
    return new this(
      payload.error,
      payload.code,
      payload.message || payload.msg,
      payload.status,
      payload.cause
    );
  }
}

// Webrpc errors

export class WebrpcEndpointError extends WebrpcError {
  constructor(
    name: string = "WebrpcEndpoint",
    code: number = 0,
    message: string = `endpoint error`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcEndpointError.prototype);
  }
}

export class WebrpcRequestFailedError extends WebrpcError {
  constructor(
    name: string = "WebrpcRequestFailed",
    code: number = -1,
    message: string = `request failed`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcRequestFailedError.prototype);
  }
}

export class WebrpcBadRouteError extends WebrpcError {
  constructor(
    name: string = "WebrpcBadRoute",
    code: number = -2,
    message: string = `bad route`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcBadRouteError.prototype);
  }
}

export class WebrpcBadMethodError extends WebrpcError {
  constructor(
    name: string = "WebrpcBadMethod",
    code: number = -3,
    message: string = `bad method`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcBadMethodError.prototype);
  }
}

export class WebrpcBadRequestError extends WebrpcError {
  constructor(
    name: string = "WebrpcBadRequest",
    code: number = -4,
    message: string = `bad request`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcBadRequestError.prototype);
  }
}

export class WebrpcBadResponseError extends WebrpcError {
  constructor(
    name: string = "WebrpcBadResponse",
    code: number = -5,
    message: string = `bad response`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcBadResponseError.prototype);
  }
}

export class WebrpcServerPanicError extends WebrpcError {
  constructor(
    name: string = "WebrpcServerPanic",
    code: number = -6,
    message: string = `server panic`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcServerPanicError.prototype);
  }
}

export class WebrpcInternalErrorError extends WebrpcError {
  // Name as per original
  constructor(
    name: string = "WebrpcInternalError",
    code: number = -7,
    message: string = `internal error`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcInternalErrorError.prototype);
  }
}

export class WebrpcClientDisconnectedError extends WebrpcError {
  constructor(
    name: string = "WebrpcClientDisconnected",
    code: number = -8,
    message: string = `client disconnected`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcClientDisconnectedError.prototype);
  }
}

export class WebrpcStreamLostError extends WebrpcError {
  constructor(
    name: string = "WebrpcStreamLost",
    code: number = -9,
    message: string = `stream lost`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcStreamLostError.prototype);
  }
}

export class WebrpcStreamFinishedError extends WebrpcError {
  constructor(
    name: string = "WebrpcStreamFinished",
    code: number = -10,
    message: string = `stream finished`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, WebrpcStreamFinishedError.prototype);
  }
}

// Schema errors

export class UnauthorizedError extends WebrpcError {
  constructor(
    name: string = "Unauthorized",
    code: number = 1000,
    message: string = `Unauthorized access`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class PermissionDeniedError extends WebrpcError {
  constructor(
    name: string = "PermissionDenied",
    code: number = 1001,
    message: string = `Permission denied`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}

export class SessionExpiredError extends WebrpcError {
  constructor(
    name: string = "SessionExpired",
    code: number = 1002,
    message: string = `Session expired`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, SessionExpiredError.prototype);
  }
}

export class MethodNotFoundError extends WebrpcError {
  constructor(
    name: string = "MethodNotFound",
    code: number = 1003,
    message: string = `Method not found`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, MethodNotFoundError.prototype);
  }
}

export class RequestConflictError extends WebrpcError {
  constructor(
    name: string = "RequestConflict",
    code: number = 1004,
    message: string = `Conflict with target resource`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, RequestConflictError.prototype);
  }
}

export class ServiceDisabledError extends WebrpcError {
  constructor(
    name: string = "ServiceDisabled",
    code: number = 1005,
    message: string = `Service disabled`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, ServiceDisabledError.prototype);
  }
}

export class TimeoutError extends WebrpcError {
  constructor(
    name: string = "Timeout",
    code: number = 2000,
    message: string = `Request timed out`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class InvalidArgumentError extends WebrpcError {
  constructor(
    name: string = "InvalidArgument",
    code: number = 2001,
    message: string = `Invalid argument`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}

export class NotFoundError extends WebrpcError {
  constructor(
    name: string = "NotFound",
    code: number = 3000,
    message: string = `Resource not found`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UserNotFoundError extends WebrpcError {
  constructor(
    name: string = "UserNotFound",
    code: number = 3001,
    message: string = `User not found`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class ProjectNotFoundError extends WebrpcError {
  constructor(
    name: string = "ProjectNotFound",
    code: number = 3002,
    message: string = `Project not found`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, ProjectNotFoundError.prototype);
  }
}

export class InvalidTierError extends WebrpcError {
  constructor(
    name: string = "InvalidTier",
    code: number = 3003,
    message: string = `Invalid subscription tier`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, InvalidTierError.prototype);
  }
}

export class EmailTemplateExistsError extends WebrpcError {
  constructor(
    name: string = "EmailTemplateExists",
    code: number = 3004,
    message: string = `Email Template exists`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, EmailTemplateExistsError.prototype);
  }
}

export class SubscriptionLimitError extends WebrpcError {
  constructor(
    name: string = "SubscriptionLimit",
    code: number = 3005,
    message: string = `Subscription limit reached`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, SubscriptionLimitError.prototype);
  }
}

export class FeatureNotIncludedError extends WebrpcError {
  constructor(
    name: string = "FeatureNotIncluded",
    code: number = 3006,
    message: string = `Feature not included`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, FeatureNotIncludedError.prototype);
  }
}

export class InvalidNetworkError extends WebrpcError {
  constructor(
    name: string = "InvalidNetwork",
    code: number = 3007,
    message: string = `Invalid network`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, InvalidNetworkError.prototype);
  }
}

export class InvitationExpiredError extends WebrpcError {
  constructor(
    name: string = "InvitationExpired",
    code: number = 4000,
    message: string = `Invitation code is expired`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, InvitationExpiredError.prototype);
  }
}

export class AlreadyCollaboratorError extends WebrpcError {
  constructor(
    name: string = "AlreadyCollaborator",
    code: number = 4001,
    message: string = `Already a collaborator`,
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause);
    Object.setPrototypeOf(this, AlreadyCollaboratorError.prototype);
  }
}

export enum errors {
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

export enum WebrpcErrorCodes {
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

export const webrpcErrorByCode: { [code: number]: any } = {
  [0]: WebrpcEndpointError,
  [-1]: WebrpcRequestFailedError,
  [-2]: WebrpcBadRouteError,
  [-3]: WebrpcBadMethodError,
  [-4]: WebrpcBadRequestError,
  [-5]: WebrpcBadResponseError,
  [-6]: WebrpcServerPanicError,
  [-7]: WebrpcInternalErrorError, // Name as per original
  [-8]: WebrpcClientDisconnectedError,
  [-9]: WebrpcStreamLostError,
  [-10]: WebrpcStreamFinishedError,
  [1000]: UnauthorizedError,
  [1001]: PermissionDeniedError,
  [1002]: SessionExpiredError,
  [1003]: MethodNotFoundError,
  [1004]: RequestConflictError,
  [1005]: ServiceDisabledError,
  [2000]: TimeoutError,
  [2001]: InvalidArgumentError,
  [3000]: NotFoundError,
  [3001]: UserNotFoundError,
  [3002]: ProjectNotFoundError,
  [3003]: InvalidTierError,
  [3004]: EmailTemplateExistsError,
  [3005]: SubscriptionLimitError,
  [3006]: FeatureNotIncludedError,
  [3007]: InvalidNetworkError,
  [4000]: InvitationExpiredError,
  [4001]: AlreadyCollaboratorError,
};

//
// Client Implementation for MarketplaceService (relevant part)
//
export type Fetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

export class MarketplaceService {
  protected hostname: string;
  protected fetch: Fetch;
  protected path = "/rpc/MarketplaceService/";

  constructor(hostname: string, fetch: Fetch) {
    this.hostname = hostname.replace(/\/*$/, "");
    this.fetch = (input: RequestInfo, init?: RequestInit) => fetch(input, init);
  }

  private url(name: string): string {
    return this.hostname + this.path + name;
  }

  lookupMarketplace = (
    args: LookupMarketplaceArgs,
    headers?: object,
    signal?: AbortSignal
  ): Promise<LookupMarketplaceReturn> => {
    return this.fetch(
      this.url("LookupMarketplace"),
      createHTTPRequest(args, headers, signal)
    ).then(
      (res) => {
        return buildResponse(res).then((_data) => {
          return {
            marketplace: <Marketplace>_data.marketplace,
            marketCollections: <Array<MarketCollection>>_data.marketCollections,
            shopCollections: <Array<ShopCollection>>_data.shopCollections,
          };
        });
      },
      (error) => {
        throw WebrpcRequestFailedError.new({
          cause: `lookupMarketplace(): ${error.message || ""}`,
        });
      }
    );
  };
}

//
// Helper Functions
//
const createHTTPRequest = (
  body: object = {},
  headers: object = {},
  signal: AbortSignal | null = null
): object => {
  const reqHeaders: { [key: string]: string } = {
    ...headers,
    "Content-Type": "application/json",
  };
  reqHeaders[WebrpcHeader] = WebrpcHeaderValue;

  return {
    method: "POST",
    headers: reqHeaders,
    body: JSON.stringify(body || {}),
    signal,
  };
};

const buildResponse = (res: Response): Promise<any> => {
  return res.text().then((text) => {
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      let message = "";
      if (error instanceof Error) {
        message = error.message;
      }
      throw WebrpcBadResponseError.new({
        status: res.status,
        cause: `JSON.parse(): ${message}: response text: ${text}`,
      });
    }
    if (!res.ok) {
      const code: number = typeof data.code === "number" ? data.code : 0;
      throw (webrpcErrorByCode[code] || WebrpcError).new(data);
    }
    return data;
  });
};
