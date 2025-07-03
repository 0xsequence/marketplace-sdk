import { Env, Marketplace, SdkConfig } from "./new-marketplace-types-Cggo50UM.js";
import { BuilderAPI } from "./builder-api-7g5a_lFO.js";
import { QueryClient } from "@tanstack/react-query";
import { SequenceAPIClient } from "@0xsequence/api";
import { GetTokenBalancesReturn, GetTokenSuppliesReturn, SequenceIndexer } from "@0xsequence/indexer";
import { SequenceMetadata } from "@0xsequence/metadata";

//#region src/react/_internal/api/get-query-client.d.ts
declare function getQueryClient(): QueryClient;
//#endregion
//#region src/react/_internal/api/laos-api.d.ts
type SortOption = {
  column: string;
  order: 'ASC' | 'DESC';
};
type PaginationOptions = {
  sort: SortOption[];
};
type TokenSuppliesParams = {
  chainId: string;
  contractAddress: string;
  includeMetadata?: boolean;
  page?: PaginationOptions;
};
type TokenBalancesParams = {
  chainId: string;
  accountAddress: string;
  contractAddress: string;
  includeMetadata?: boolean;
  page?: PaginationOptions;
};
declare class LaosAPI {
  private baseUrl;
  constructor(baseUrl?: string);
  getTokenSupplies({
    chainId,
    contractAddress,
    includeMetadata,
    page
  }: TokenSuppliesParams): Promise<GetTokenSuppliesReturn>;
  getTokenBalances({
    chainId,
    accountAddress,
    contractAddress,
    includeMetadata,
    page
  }: TokenBalancesParams): Promise<GetTokenBalancesReturn>;
}
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
  static filter: readonly ["collectable", "filter"];
  static counts: readonly ["collectable", "counts"];
  static collectibleActivities: readonly ["collectable", "collectibleActivities"];
}
declare class CollectionKeys {
  static all: readonly ["collections"];
  static list: readonly ["collections", "list"];
  static detail: readonly ["collections", "detail"];
  static collectionActivities: readonly ["collections", "collectionActivities"];
}
declare class BalanceQueries {
  static all: readonly ["balances"];
  static lists: readonly ["balances", "tokenBalances"];
  static collectionBalanceDetails: readonly ["balances", "collectionBalanceDetails"];
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
//#region src/react/_internal/api/services.d.ts
type ChainNameOrId = string | number;
declare const sequenceApiUrl: (env?: Env) => string;
declare const getBuilderClient: (config: SdkConfig) => BuilderAPI;
declare const getMetadataClient: (config: SdkConfig) => SequenceMetadata;
declare const getIndexerClient: (chain: ChainNameOrId, config: SdkConfig) => SequenceIndexer;
declare const getMarketplaceClient: (config: SdkConfig) => SequenceMarketplace;
declare const getSequenceApiClient: (config: SdkConfig) => SequenceAPIClient;
//#endregion
export { LaosAPI, PaginationOptions, SequenceMarketplace, SortOption, TokenBalancesParams, TokenSuppliesParams, balanceQueries, checkoutKeys, collectableKeys, collectionKeys, configKeys, currencyKeys, getBuilderClient, getIndexerClient, getMarketplaceClient, getMetadataClient, getQueryClient, getSequenceApiClient, sequenceApiUrl, tokenKeys, tokenSuppliesKeys };
//# sourceMappingURL=index-CMZWWb2s.d.ts.map