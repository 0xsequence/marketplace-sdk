// Importing OrderbookKind from marketplace.gen, to avoid multiple enums
import { OrderbookKind } from "./marketplace.gen";

// Extracted from builder webrpc

export interface LookupMarketplaceConfigArgs {
  projectId?: number;
  hostname?: string;
}

export interface LookupMarketplaceConfigReturn {
  settings: MarketplaceSettings;
}

export interface MarketplaceSettings {
  projectId: number;
  publisherId: string;
  title: string;
  shortDescription: string;
  socials: MarketplaceSocials;
  faviconUrl: string;
  landingBannerUrl: string;
  collections: Array<MarketplaceCollection>;
  walletOptions: MarketplaceWalletOptions;
  landingPageLayout: string;
  logoUrl: string;
  bannerUrl: string;
  fontUrl?: string;
  ogImage?: string;
  accessKey?: string;
}

export interface MarketplaceSocials {
  twitter: string;
  discord: string;
  website: string;
  tiktok: string;
  instagram: string;
  youtube: string;
}

export interface MarketplaceCollection {
  marketplaceType: MarketplaceType;
  chainId: number;
  address: string;
  exchanges: Array<string>;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  isLAOSERC721?: boolean;
}

export interface CollectionFilterSettings {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule>;
}

export interface OpenIdProvider {
  iss: string;
  aud: Array<string>;
}
export interface MetadataFilterRule {
  key: string;
  condition: FilterCondition;
  value?: string;
}

export interface MarketplaceWalletWaasSettings {
  tenantKey: string;
  emailEnabled: boolean;
  providers: Array<OpenIdProvider>;
}

export interface MarketplaceWalletOptions {
  walletType: MarketplaceWallet;
  oidcIssuers: { [key: string]: string };
  connectors: Array<string>;
  includeEIP6963Wallets: boolean;
  ecosystem?: EcosystemWalletSettings;
  waas?: MarketplaceWalletWaasSettings;
}

export interface EcosystemWalletSettings {
  walletUrl: string;
  walletAppName: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
}

export enum MarketplaceWallet {
  UNIVERSAL = "UNIVERSAL",
  EMBEDDED = "EMBEDDED",
  ECOSYSTEM = "ECOSYSTEM",
}

export enum MarketplaceType {
  AMM = "AMM",
  P2P = "P2P",
  SEQUENCE = "SEQUENCE",
  ORDERBOOK = "ORDERBOOK",
}

export enum FilterCondition {
  ENTIRE_KEY = "ENTIRE_KEY",
  SPECIFIC_VALUE = "SPECIFIC_VALUE",
}

export type Fetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

export class WebrpcRequestFailedError extends Error {
  name: string;
  code: number;
  message: string;
  status: number;
  cause?: string;

  constructor(
    name = "WebrpcRequestFailed",
    code = -1,
    message = `request failed`,
    status = 0,
    cause?: string
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.message = message;
    this.status = status;
    this.cause = cause;
    Object.setPrototypeOf(this, WebrpcRequestFailedError.prototype);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  static new(payload: any): WebrpcRequestFailedError {
    return new WebrpcRequestFailedError(
      payload.name,
      payload.code,
      payload.msg || payload.message,
      payload.status,
      payload.cause
    );
  }
}

const createHTTPRequest = (
  body: object = {},
  headers: object = {},
  signal: AbortSignal | null = null
): object => {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body || {}),
    mode: "cors",
    signal: signal || null,
  };
};

const buildResponse = (res: Response): Promise<any> => {
  if (!res.ok) {
    return res.json().then((errData) => {
      throw WebrpcRequestFailedError.new(errData);
    });
  }
  return res.json();
};

export class API {
  protected hostname: string;
  protected fetch: Fetch;
  protected path = "/rpc/Builder/";

  constructor(hostname: string, fetch: Fetch) {
    this.hostname = hostname;
    this.fetch = fetch;
  }

  private url(name: string): string {
    return this.hostname + this.path + name;
  }

  lookupMarketplaceConfig = (
    args: LookupMarketplaceConfigArgs,
    headers?: object,
    signal?: AbortSignal
  ): Promise<LookupMarketplaceConfigReturn> => {
    return this.fetch(
      this.url("LookupMarketplaceConfig"),
      createHTTPRequest(args, headers, signal)
    ).then(
      (res) => {
        return buildResponse(res).then((_data) => {
          return {
            projectId: <number>_data.projectId,
            settings: <MarketplaceSettings>_data.settings,
          };
        });
      },
      (error) => {
        throw WebrpcRequestFailedError.new({
          cause: `fetch(): ${error.message || ""}`,
        });
      }
    );
  };
}
