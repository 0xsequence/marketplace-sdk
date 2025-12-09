import { Dn as WithRequired, Et as ListOrdersWithCollectiblesResponse, Fn as WithOptionalParams, Kt as SortBy, T as MarketplaceConfig, Tt as ListOrdersWithCollectiblesRequest, _ as SdkConfig, bn as SdkInfiniteQueryParams, bt as ListCollectionActivitiesResponse, lt as GetFloorOrderRequest, vr as Page$1, xn as SdkQueryParams, yt as ListCollectionActivitiesRequest } from "./create-config.js";
import * as _0xsequence_api_client38 from "@0xsequence/api-client";
import { Address, GetCountOfAllOrdersRequest, GetCountOfFilteredOrdersRequest, Indexer, OrderSide, OrdersFilter } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query86 from "@tanstack/react-query";
import * as _0xsequence_indexer0 from "@0xsequence/indexer";

//#region src/react/queries/collection/balance-details.d.ts
interface CollectionBalanceFilter {
  accountAddresses: Array<Address$1>;
  contractWhitelist?: Array<Address$1>;
  omitNativeBalances: boolean;
}
interface FetchCollectionBalanceDetailsParams {
  chainId: number;
  filter: CollectionBalanceFilter;
}
type CollectionBalanceDetailsQueryOptions = SdkQueryParams<FetchCollectionBalanceDetailsParams>;
/**
 * Fetches detailed balance information for multiple accounts from the Indexer API
 */
declare function fetchCollectionBalanceDetails(params: WithRequired<CollectionBalanceDetailsQueryOptions, 'chainId' | 'filter' | 'config'>): Promise<Indexer.GetTokenBalancesDetailsResponse>;
declare function getCollectionBalanceDetailsQueryKey(params: CollectionBalanceDetailsQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  filter: CollectionBalanceFilter | undefined;
}];
declare function collectionBalanceDetailsQueryOptions(params: WithOptionalParams<WithRequired<CollectionBalanceDetailsQueryOptions, 'chainId' | 'filter' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<Indexer.GetTokenBalancesDetailsResponse, Error, Indexer.GetTokenBalancesDetailsResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<Indexer.GetTokenBalancesDetailsResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: Indexer.GetTokenBalancesDetailsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/list.d.ts
interface FetchListCollectionsParams {
  collectionType?: 'market' | 'shop';
  marketplaceConfig: MarketplaceConfig;
}
type ListCollectionsQueryOptions = SdkQueryParams<FetchListCollectionsParams>;
/**
 * Fetches collections from the metadata API with marketplace config filtering
 */
declare function fetchListCollections(params: WithRequired<ListCollectionsQueryOptions, 'marketplaceConfig' | 'config'>): Promise<({
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: _0xsequence_indexer0.ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
  filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: _0xsequence_api_client38.Address;
  tokenIds: _0xsequence_api_client38.TokenId[];
  customTokenIds: _0xsequence_api_client38.TokenId[];
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[]>;
declare function getListCollectionsQueryKey(params: ListCollectionsQueryOptions): readonly ["collection", string, {
  readonly collectionType: "market" | "shop" | undefined;
  readonly marketplaceConfig: MarketplaceConfig | undefined;
}];
declare function listCollectionsQueryOptions(params: WithOptionalParams<WithRequired<ListCollectionsQueryOptions, 'marketplaceConfig' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<({
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: _0xsequence_indexer0.ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
  filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: _0xsequence_api_client38.Address;
  tokenIds: _0xsequence_api_client38.TokenId[];
  customTokenIds: _0xsequence_api_client38.TokenId[];
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], Error, ({
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: _0xsequence_indexer0.ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
  filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: _0xsequence_api_client38.Address;
  tokenIds: _0xsequence_api_client38.TokenId[];
  customTokenIds: _0xsequence_api_client38.TokenId[];
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<({
    chainId: _0xsequence_api_client38.ChainId;
    address: _0xsequence_api_client38.Address;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_api_client38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "market";
    contractType: _0xsequence_indexer0.ContractType;
    feePercentage: number;
    currencyOptions: string[];
    destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
    filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
    id: number;
    projectId: _0xsequence_api_client38.ProjectId;
    itemsAddress: _0xsequence_api_client38.Address;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  } | {
    chainId: _0xsequence_api_client38.ChainId;
    address: _0xsequence_api_client38.Address;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_api_client38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "shop";
    saleAddress: _0xsequence_api_client38.Address;
    tokenIds: _0xsequence_api_client38.TokenId[];
    customTokenIds: _0xsequence_api_client38.TokenId[];
    id: number;
    projectId: _0xsequence_api_client38.ProjectId;
    itemsAddress: _0xsequence_api_client38.Address;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  })[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ({
      chainId: _0xsequence_api_client38.ChainId;
      address: _0xsequence_api_client38.Address;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_api_client38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "market";
      contractType: _0xsequence_indexer0.ContractType;
      feePercentage: number;
      currencyOptions: string[];
      destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
      filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
      id: number;
      projectId: _0xsequence_api_client38.ProjectId;
      itemsAddress: _0xsequence_api_client38.Address;
      bannerUrl: string;
      sortOrder?: number;
      private: boolean;
      createdAt?: string;
    } | {
      chainId: _0xsequence_api_client38.ChainId;
      address: _0xsequence_api_client38.Address;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_api_client38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "shop";
      saleAddress: _0xsequence_api_client38.Address;
      tokenIds: _0xsequence_api_client38.TokenId[];
      customTokenIds: _0xsequence_api_client38.TokenId[];
      id: number;
      projectId: _0xsequence_api_client38.ProjectId;
      itemsAddress: _0xsequence_api_client38.Address;
      bannerUrl: string;
      sortOrder?: number;
      private: boolean;
      createdAt?: string;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
declare const listCollectionsOptions: ({
  collectionType,
  marketplaceConfig,
  config,
  query
}: ListCollectionsQueryOptions) => _tanstack_react_query86.UseQueryOptions<({
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: _0xsequence_indexer0.ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
  filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: _0xsequence_api_client38.Address;
  tokenIds: _0xsequence_api_client38.TokenId[];
  customTokenIds: _0xsequence_api_client38.TokenId[];
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], Error, ({
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: _0xsequence_indexer0.ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
  filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: _0xsequence_api_client38.ChainId;
  address: _0xsequence_api_client38.Address;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_api_client38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: _0xsequence_api_client38.Address;
  tokenIds: _0xsequence_api_client38.TokenId[];
  customTokenIds: _0xsequence_api_client38.TokenId[];
  id: number;
  projectId: _0xsequence_api_client38.ProjectId;
  itemsAddress: _0xsequence_api_client38.Address;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], (string | {
  collectionType: "market" | "shop" | undefined;
  marketplaceConfig: MarketplaceConfig | undefined;
  config: SdkConfig | undefined;
})[]> & {
  initialData?: ({
    chainId: _0xsequence_api_client38.ChainId;
    address: _0xsequence_api_client38.Address;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_api_client38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "market";
    contractType: _0xsequence_indexer0.ContractType;
    feePercentage: number;
    currencyOptions: string[];
    destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
    filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
    id: number;
    projectId: _0xsequence_api_client38.ProjectId;
    itemsAddress: _0xsequence_api_client38.Address;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  } | {
    chainId: _0xsequence_api_client38.ChainId;
    address: _0xsequence_api_client38.Address;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_api_client38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "shop";
    saleAddress: _0xsequence_api_client38.Address;
    tokenIds: _0xsequence_api_client38.TokenId[];
    customTokenIds: _0xsequence_api_client38.TokenId[];
    id: number;
    projectId: _0xsequence_api_client38.ProjectId;
    itemsAddress: _0xsequence_api_client38.Address;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  })[] | _tanstack_react_query86.InitialDataFunction<({
    chainId: _0xsequence_api_client38.ChainId;
    address: _0xsequence_api_client38.Address;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_api_client38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "market";
    contractType: _0xsequence_indexer0.ContractType;
    feePercentage: number;
    currencyOptions: string[];
    destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
    filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
    id: number;
    projectId: _0xsequence_api_client38.ProjectId;
    itemsAddress: _0xsequence_api_client38.Address;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  } | {
    chainId: _0xsequence_api_client38.ChainId;
    address: _0xsequence_api_client38.Address;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_api_client38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "shop";
    saleAddress: _0xsequence_api_client38.Address;
    tokenIds: _0xsequence_api_client38.TokenId[];
    customTokenIds: _0xsequence_api_client38.TokenId[];
    id: number;
    projectId: _0xsequence_api_client38.ProjectId;
    itemsAddress: _0xsequence_api_client38.Address;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  })[]> | undefined;
} & {
  queryKey: (string | {
    collectionType: "market" | "shop" | undefined;
    marketplaceConfig: MarketplaceConfig | undefined;
    config: SdkConfig | undefined;
  })[] & {
    [dataTagSymbol]: ({
      chainId: _0xsequence_api_client38.ChainId;
      address: _0xsequence_api_client38.Address;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_api_client38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "market";
      contractType: _0xsequence_indexer0.ContractType;
      feePercentage: number;
      currencyOptions: string[];
      destinationMarketplace: _0xsequence_api_client38.OrderbookKind;
      filterSettings?: _0xsequence_api_client38.CollectionFilterSettings;
      id: number;
      projectId: _0xsequence_api_client38.ProjectId;
      itemsAddress: _0xsequence_api_client38.Address;
      bannerUrl: string;
      sortOrder?: number;
      private: boolean;
      createdAt?: string;
    } | {
      chainId: _0xsequence_api_client38.ChainId;
      address: _0xsequence_api_client38.Address;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_api_client38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "shop";
      saleAddress: _0xsequence_api_client38.Address;
      tokenIds: _0xsequence_api_client38.TokenId[];
      customTokenIds: _0xsequence_api_client38.TokenId[];
      id: number;
      projectId: _0xsequence_api_client38.ProjectId;
      itemsAddress: _0xsequence_api_client38.Address;
      bannerUrl: string;
      sortOrder?: number;
      private: boolean;
      createdAt?: string;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-activities.d.ts
type ListCollectionActivitiesQueryOptions = SdkQueryParams<Omit<ListCollectionActivitiesRequest, 'page'> & {
  page?: number;
  pageSize?: number;
  sort?: SortBy[];
}>;
/**
 * Fetches collection activities from the Marketplace API
 */
declare function fetchListCollectionActivities(params: WithRequired<ListCollectionActivitiesQueryOptions, 'collectionAddress' | 'chainId' | 'config'>): Promise<ListCollectionActivitiesResponse>;
declare function getListCollectionActivitiesQueryKey(params: ListCollectionActivitiesQueryOptions): readonly ["collection", "market-activities", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly page: number | undefined;
  readonly pageSize: number | undefined;
  readonly sort: SortBy[] | undefined;
}];
declare function listCollectionActivitiesQueryOptions(params: WithOptionalParams<WithRequired<ListCollectionActivitiesQueryOptions, 'collectionAddress' | 'chainId' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<ListCollectionActivitiesResponse, Error, ListCollectionActivitiesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<ListCollectionActivitiesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListCollectionActivitiesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-filtered-count.d.ts
interface FetchGetCountOfFilteredOrdersParams extends GetCountOfFilteredOrdersRequest {
  side: OrderSide;
  filter?: OrdersFilter;
}
type GetCountOfFilteredOrdersQueryOptions = SdkQueryParams<FetchGetCountOfFilteredOrdersParams>;
declare function fetchGetCountOfFilteredOrders(params: WithRequired<GetCountOfFilteredOrdersQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<number>;
declare function getCountOfFilteredOrdersQueryKey(params: GetCountOfFilteredOrdersQueryOptions): readonly ["collection", "market-filtered-count", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly side: OrderSide | undefined;
  readonly filter: OrdersFilter | undefined;
}];
declare function getCountOfFilteredOrdersQueryOptions(params: WithOptionalParams<WithRequired<GetCountOfFilteredOrdersQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-floor.d.ts
type FloorOrderQueryOptions = SdkQueryParams<GetFloorOrderRequest>;
/**
 * Fetches the floor order for a collection from the marketplace API
 */
declare function fetchFloorOrder(params: WithRequired<FloorOrderQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<_0xsequence_api_client38.CollectibleOrder>;
declare function getFloorOrderQueryKey(params: FloorOrderQueryOptions): readonly ["collection", "market-floor", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly filter: _0xsequence_api_client38.CollectiblesFilter | undefined;
}];
declare function floorOrderQueryOptions(params: WithOptionalParams<WithRequired<FloorOrderQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<_0xsequence_api_client38.CollectibleOrder, Error, _0xsequence_api_client38.CollectibleOrder, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<_0xsequence_api_client38.CollectibleOrder, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _0xsequence_api_client38.CollectibleOrder;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items.d.ts
type FetchListItemsOrdersForCollectionParams = ListOrdersWithCollectiblesRequest;
type ListItemsOrdersForCollectionQueryOptions = SdkInfiniteQueryParams<FetchListItemsOrdersForCollectionParams>;
declare function fetchListItemsOrdersForCollection(params: WithRequired<ListItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>, page: Page$1): Promise<ListOrdersWithCollectiblesResponse>;
declare function getListItemsOrdersForCollectionQueryKey(params: ListItemsOrdersForCollectionQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
  side: _0xsequence_api_client38.OrderSide | undefined;
  filter: _0xsequence_api_client38.OrdersFilter | undefined;
}];
declare function listItemsOrdersForCollectionQueryOptions(params: WithOptionalParams<WithRequired<ListItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseInfiniteQueryOptions<ListOrdersWithCollectiblesResponse, Error, _tanstack_react_query86.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>, readonly unknown[], Page$1>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<ListOrdersWithCollectiblesResponse, readonly unknown[], Page$1> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query86.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-count.d.ts
interface FetchCountItemsOrdersForCollectionParams extends GetCountOfAllOrdersRequest {
  side: OrderSide;
}
type CountItemsOrdersForCollectionQueryOptions = SdkQueryParams<FetchCountItemsOrdersForCollectionParams>;
/**
 * Fetches count of orders for a collection from the marketplace API
 */
declare function fetchCountItemsOrdersForCollection(params: WithRequired<CountItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<number>;
declare function getCountItemsOrdersForCollectionQueryKey(params: CountItemsOrdersForCollectionQueryOptions): readonly ["collection", "market-items-count", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly side: OrderSide | undefined;
}];
declare function countItemsOrdersForCollectionQueryOptions(params: WithOptionalParams<WithRequired<CountItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-paginated.d.ts
interface FetchListItemsOrdersForCollectionPaginatedParams extends Omit<ListOrdersWithCollectiblesRequest, 'page'> {
  collectionAddress: Address$1;
  page?: number;
  pageSize?: number;
}
type ListItemsOrdersForCollectionPaginatedQueryOptions = SdkQueryParams<FetchListItemsOrdersForCollectionPaginatedParams>;
/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
declare function fetchListItemsOrdersForCollectionPaginated(params: WithRequired<ListItemsOrdersForCollectionPaginatedQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<ListOrdersWithCollectiblesResponse>;
declare function getListItemsOrdersForCollectionPaginatedQueryKey(params: ListItemsOrdersForCollectionPaginatedQueryOptions): readonly ["order", "collection-items-paginated", ListItemsOrdersForCollectionPaginatedQueryOptions];
declare function listItemsOrdersForCollectionPaginatedQueryOptions(params: WithOptionalParams<WithRequired<ListItemsOrdersForCollectionPaginatedQueryOptions, 'collectionAddress' | 'chainId' | 'config' | 'side'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<ListOrdersWithCollectiblesResponse, Error, ListOrdersWithCollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<ListOrdersWithCollectiblesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListOrdersWithCollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/metadata.d.ts
interface FetchCollectionParams {
  chainId: number;
  collectionAddress: Address;
}
type CollectionQueryOptions = SdkQueryParams<FetchCollectionParams>;
/**
 * Fetches collection information from the metadata API
 */
declare function fetchCollection(params: WithRequired<CollectionQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<_0xsequence_api_client38.ContractInfo>;
declare function getCollectionQueryKey(params: CollectionQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
}];
declare function collectionQueryOptions(params: WithOptionalParams<WithRequired<CollectionQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query86.OmitKeyof<_tanstack_react_query86.UseQueryOptions<_0xsequence_api_client38.ContractInfo, Error, _0xsequence_api_client38.ContractInfo, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query86.QueryFunction<_0xsequence_api_client38.ContractInfo, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _0xsequence_api_client38.ContractInfo;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListCollectionActivitiesQueryOptions as A, CollectionBalanceDetailsQueryOptions as B, floorOrderQueryOptions as C, fetchGetCountOfFilteredOrders as D, GetCountOfFilteredOrdersQueryOptions as E, ListCollectionsQueryOptions as F, getCollectionBalanceDetailsQueryKey as G, FetchCollectionBalanceDetailsParams as H, fetchListCollections as I, getListCollectionsQueryKey as L, getListCollectionActivitiesQueryKey as M, listCollectionActivitiesQueryOptions as N, getCountOfFilteredOrdersQueryKey as O, FetchListCollectionsParams as P, listCollectionsOptions as R, fetchFloorOrder as S, FetchGetCountOfFilteredOrdersParams as T, collectionBalanceDetailsQueryOptions as U, CollectionBalanceFilter as V, fetchCollectionBalanceDetails as W, ListItemsOrdersForCollectionQueryOptions as _, getCollectionQueryKey as a, listItemsOrdersForCollectionQueryOptions as b, fetchListItemsOrdersForCollectionPaginated as c, CountItemsOrdersForCollectionQueryOptions as d, FetchCountItemsOrdersForCollectionParams as f, FetchListItemsOrdersForCollectionParams as g, getCountItemsOrdersForCollectionQueryKey as h, fetchCollection as i, fetchListCollectionActivities as j, getCountOfFilteredOrdersQueryOptions as k, getListItemsOrdersForCollectionPaginatedQueryKey as l, fetchCountItemsOrdersForCollection as m, FetchCollectionParams as n, FetchListItemsOrdersForCollectionPaginatedParams as o, countItemsOrdersForCollectionQueryOptions as p, collectionQueryOptions as r, ListItemsOrdersForCollectionPaginatedQueryOptions as s, CollectionQueryOptions as t, listItemsOrdersForCollectionPaginatedQueryOptions as u, fetchListItemsOrdersForCollection as v, getFloorOrderQueryKey as w, FloorOrderQueryOptions as x, getListItemsOrdersForCollectionQueryKey as y, listCollectionsQueryOptions as z };
//# sourceMappingURL=metadata.d.ts.map