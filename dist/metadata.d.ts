import { Bt as CollectionFilterSettings, Er as Page, In as ContractInfo$1, J as SdkInfiniteQueryParams, Jn as ContractType, Ln as ContractInfoExtensions, Mn as index_d_exports$1$1, Mr as SortBy, Qn as TokenId, Rt as CollectibleOrder, Sr as OrderSide, Tr as OrdersFilter, Xn as ChainId, Xt as GetCountOfFilteredOrdersRequest, Y as SdkQueryParams, Yn as Address$1, Yt as GetCountOfAllOrdersRequest, Zn as ProjectId, _r as ListCollectionActivitiesResponse, ar as CollectiblesFilter, en as GetFloorOrderRequest, gn as ListOrdersWithCollectiblesResponse, hn as ListOrdersWithCollectiblesRequest, ln as ListCollectionActivitiesRequest, lt as WithOptionalParams, m as SdkConfig, tt as WithRequired, wr as OrderbookKind, y as MarketplaceConfig } from "./create-config.js";
import { Address } from "viem";
import * as _tanstack_react_query98 from "@tanstack/react-query";

//#region src/react/queries/collection/balance-details.d.ts
interface CollectionBalanceFilter {
  accountAddresses: Array<Address>;
  contractWhitelist?: Array<Address>;
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
declare function fetchCollectionBalanceDetails(params: WithRequired<CollectionBalanceDetailsQueryOptions, 'chainId' | 'filter' | 'config'>): Promise<index_d_exports$1$1.GetTokenBalancesDetailsResponse>;
declare function getCollectionBalanceDetailsQueryKey(params: CollectionBalanceDetailsQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  filter: CollectionBalanceFilter | undefined;
}];
declare function collectionBalanceDetailsQueryOptions(params: WithOptionalParams<WithRequired<CollectionBalanceDetailsQueryOptions, 'chainId' | 'filter' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<index_d_exports$1$1.GetTokenBalancesDetailsResponse, Error, index_d_exports$1$1.GetTokenBalancesDetailsResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<index_d_exports$1$1.GetTokenBalancesDetailsResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: index_d_exports$1$1.GetTokenBalancesDetailsResponse;
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
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[]>;
declare function getListCollectionsQueryKey(params: ListCollectionsQueryOptions): readonly ["collection", string, {
  readonly collectionType: "market" | "shop" | undefined;
  readonly marketplaceConfig: MarketplaceConfig | undefined;
}];
declare function listCollectionsQueryOptions(params: WithOptionalParams<WithRequired<ListCollectionsQueryOptions, 'marketplaceConfig' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<({
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], Error, ({
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<({
    chainId: ChainId;
    address: Address$1;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "market";
    contractType: ContractType;
    feePercentage: number;
    currencyOptions: string[];
    destinationMarketplace: OrderbookKind;
    filterSettings?: CollectionFilterSettings;
    id: number;
    projectId: ProjectId;
    itemsAddress: Address$1;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  } | {
    chainId: ChainId;
    address: Address$1;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "shop";
    saleAddress: Address$1;
    tokenIds: TokenId[];
    customTokenIds: TokenId[];
    id: number;
    projectId: ProjectId;
    itemsAddress: Address$1;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  })[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ({
      chainId: ChainId;
      address: Address$1;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "market";
      contractType: ContractType;
      feePercentage: number;
      currencyOptions: string[];
      destinationMarketplace: OrderbookKind;
      filterSettings?: CollectionFilterSettings;
      id: number;
      projectId: ProjectId;
      itemsAddress: Address$1;
      bannerUrl: string;
      sortOrder?: number;
      private: boolean;
      createdAt?: string;
    } | {
      chainId: ChainId;
      address: Address$1;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "shop";
      saleAddress: Address$1;
      tokenIds: TokenId[];
      customTokenIds: TokenId[];
      id: number;
      projectId: ProjectId;
      itemsAddress: Address$1;
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
}: ListCollectionsQueryOptions) => _tanstack_react_query98.UseQueryOptions<({
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
})[], Error, ({
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "market";
  contractType: ContractType;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
  bannerUrl: string;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
} | {
  chainId: ChainId;
  address: Address$1;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: string;
  marketplaceCollectionType: "shop";
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
  id: number;
  projectId: ProjectId;
  itemsAddress: Address$1;
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
    chainId: ChainId;
    address: Address$1;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "market";
    contractType: ContractType;
    feePercentage: number;
    currencyOptions: string[];
    destinationMarketplace: OrderbookKind;
    filterSettings?: CollectionFilterSettings;
    id: number;
    projectId: ProjectId;
    itemsAddress: Address$1;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  } | {
    chainId: ChainId;
    address: Address$1;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "shop";
    saleAddress: Address$1;
    tokenIds: TokenId[];
    customTokenIds: TokenId[];
    id: number;
    projectId: ProjectId;
    itemsAddress: Address$1;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  })[] | _tanstack_react_query98.InitialDataFunction<({
    chainId: ChainId;
    address: Address$1;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "market";
    contractType: ContractType;
    feePercentage: number;
    currencyOptions: string[];
    destinationMarketplace: OrderbookKind;
    filterSettings?: CollectionFilterSettings;
    id: number;
    projectId: ProjectId;
    itemsAddress: Address$1;
    bannerUrl: string;
    sortOrder?: number;
    private: boolean;
    createdAt?: string;
  } | {
    chainId: ChainId;
    address: Address$1;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: string;
    marketplaceCollectionType: "shop";
    saleAddress: Address$1;
    tokenIds: TokenId[];
    customTokenIds: TokenId[];
    id: number;
    projectId: ProjectId;
    itemsAddress: Address$1;
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
      chainId: ChainId;
      address: Address$1;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "market";
      contractType: ContractType;
      feePercentage: number;
      currencyOptions: string[];
      destinationMarketplace: OrderbookKind;
      filterSettings?: CollectionFilterSettings;
      id: number;
      projectId: ProjectId;
      itemsAddress: Address$1;
      bannerUrl: string;
      sortOrder?: number;
      private: boolean;
      createdAt?: string;
    } | {
      chainId: ChainId;
      address: Address$1;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: string;
      marketplaceCollectionType: "shop";
      saleAddress: Address$1;
      tokenIds: TokenId[];
      customTokenIds: TokenId[];
      id: number;
      projectId: ProjectId;
      itemsAddress: Address$1;
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
declare function listCollectionActivitiesQueryOptions(params: WithOptionalParams<WithRequired<ListCollectionActivitiesQueryOptions, 'collectionAddress' | 'chainId' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<ListCollectionActivitiesResponse, Error, ListCollectionActivitiesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<ListCollectionActivitiesResponse, readonly unknown[], never> | undefined;
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
declare function getCountOfFilteredOrdersQueryOptions(params: WithOptionalParams<WithRequired<GetCountOfFilteredOrdersQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<number, readonly unknown[], never> | undefined;
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
declare function fetchFloorOrder(params: WithRequired<FloorOrderQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<CollectibleOrder>;
declare function getFloorOrderQueryKey(params: FloorOrderQueryOptions): readonly ["collection", "market-floor", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly filter: CollectiblesFilter | undefined;
}];
declare function floorOrderQueryOptions(params: WithOptionalParams<WithRequired<FloorOrderQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<CollectibleOrder, Error, CollectibleOrder, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<CollectibleOrder, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CollectibleOrder;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items.d.ts
type FetchListItemsOrdersForCollectionParams = ListOrdersWithCollectiblesRequest;
type ListItemsOrdersForCollectionQueryOptions = SdkInfiniteQueryParams<FetchListItemsOrdersForCollectionParams>;
declare function fetchListItemsOrdersForCollection(params: WithRequired<ListItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>, page: Page): Promise<ListOrdersWithCollectiblesResponse>;
declare function getListItemsOrdersForCollectionQueryKey(params: ListItemsOrdersForCollectionQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}];
declare function listItemsOrdersForCollectionQueryOptions(params: WithOptionalParams<WithRequired<ListItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseInfiniteQueryOptions<ListOrdersWithCollectiblesResponse, Error, _tanstack_react_query98.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>, readonly unknown[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<ListOrdersWithCollectiblesResponse, readonly unknown[], Page> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query98.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>;
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
declare function countItemsOrdersForCollectionQueryOptions(params: WithOptionalParams<WithRequired<CountItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-paginated.d.ts
interface FetchListItemsOrdersForCollectionPaginatedParams extends Omit<ListOrdersWithCollectiblesRequest, 'page'> {
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
}
type ListItemsOrdersForCollectionPaginatedQueryOptions = SdkQueryParams<FetchListItemsOrdersForCollectionPaginatedParams>;
/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
declare function fetchListItemsOrdersForCollectionPaginated(params: WithRequired<ListItemsOrdersForCollectionPaginatedQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<ListOrdersWithCollectiblesResponse>;
declare function getListItemsOrdersForCollectionPaginatedQueryKey(params: ListItemsOrdersForCollectionPaginatedQueryOptions): readonly ["order", "collection-items-paginated", ListItemsOrdersForCollectionPaginatedQueryOptions];
declare function listItemsOrdersForCollectionPaginatedQueryOptions(params: WithOptionalParams<WithRequired<ListItemsOrdersForCollectionPaginatedQueryOptions, 'collectionAddress' | 'chainId' | 'config' | 'side'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<ListOrdersWithCollectiblesResponse, Error, ListOrdersWithCollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<ListOrdersWithCollectiblesResponse, readonly unknown[], never> | undefined;
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
  collectionAddress: Address$1;
}
type CollectionQueryOptions = SdkQueryParams<FetchCollectionParams>;
/**
 * Fetches collection information from the metadata API
 */
declare function fetchCollection(params: WithRequired<CollectionQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<ContractInfo$1>;
declare function getCollectionQueryKey(params: CollectionQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
}];
declare function collectionQueryOptions(params: WithOptionalParams<WithRequired<CollectionQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query98.OmitKeyof<_tanstack_react_query98.UseQueryOptions<ContractInfo$1, Error, ContractInfo$1, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query98.QueryFunction<ContractInfo$1, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ContractInfo$1;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListCollectionActivitiesQueryOptions as A, CollectionBalanceDetailsQueryOptions as B, floorOrderQueryOptions as C, fetchGetCountOfFilteredOrders as D, GetCountOfFilteredOrdersQueryOptions as E, ListCollectionsQueryOptions as F, getCollectionBalanceDetailsQueryKey as G, FetchCollectionBalanceDetailsParams as H, fetchListCollections as I, getListCollectionsQueryKey as L, getListCollectionActivitiesQueryKey as M, listCollectionActivitiesQueryOptions as N, getCountOfFilteredOrdersQueryKey as O, FetchListCollectionsParams as P, listCollectionsOptions as R, fetchFloorOrder as S, FetchGetCountOfFilteredOrdersParams as T, collectionBalanceDetailsQueryOptions as U, CollectionBalanceFilter as V, fetchCollectionBalanceDetails as W, ListItemsOrdersForCollectionQueryOptions as _, getCollectionQueryKey as a, listItemsOrdersForCollectionQueryOptions as b, fetchListItemsOrdersForCollectionPaginated as c, CountItemsOrdersForCollectionQueryOptions as d, FetchCountItemsOrdersForCollectionParams as f, FetchListItemsOrdersForCollectionParams as g, getCountItemsOrdersForCollectionQueryKey as h, fetchCollection as i, fetchListCollectionActivities as j, getCountOfFilteredOrdersQueryOptions as k, getListItemsOrdersForCollectionPaginatedQueryKey as l, fetchCountItemsOrdersForCollection as m, FetchCollectionParams as n, FetchListItemsOrdersForCollectionPaginatedParams as o, countItemsOrdersForCollectionQueryOptions as p, collectionQueryOptions as r, ListItemsOrdersForCollectionPaginatedQueryOptions as s, CollectionQueryOptions as t, listItemsOrdersForCollectionPaginatedQueryOptions as u, fetchListItemsOrdersForCollection as v, getFloorOrderQueryKey as w, FloorOrderQueryOptions as x, getListItemsOrdersForCollectionQueryKey as y, listCollectionsQueryOptions as z };
//# sourceMappingURL=metadata.d.ts.map