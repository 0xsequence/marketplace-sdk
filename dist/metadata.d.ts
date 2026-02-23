import { Ft as Address$1, Gt as CollectiblesFilter, It as ChainId, Nt as TokenBalancesFilter$1, R as ListOrdersWithCollectiblesRequest, Rt as ProjectId, S as GetFloorOrderRequest, cn as OrderSide, dn as OrdersFilter, dt as ContractInfoExtensions$1$1, fn as Page$2, g as GetCountOfAllOrdersRequest, i as CollectibleOrder, o as CollectionFilterSettings, pt as GetContractInfoSdkArgs, st as index_d_exports$1$1, un as OrderbookKind, ut as ContractInfo$1$1, v as GetCountOfFilteredOrdersRequest, xt as GetTokenBalancesDetailsRequest, z as ListOrdersWithCollectiblesResponse, zt as TokenId } from "./index2.js";
import { U as SdkInfiniteQueryParams, W as SdkQueryParams, X as WithRequired, c as SdkConfig, it as WithOptionalParams, p as MarketplaceConfig } from "./create-config.js";
import * as _0xsequence_indexer1 from "@0xsequence/indexer";
import * as _0xsequence_metadata3 from "@0xsequence/metadata";
import * as _tanstack_react_query202 from "@tanstack/react-query";

//#region src/react/queries/collection/balance-details.d.ts
type CollectionBalanceFilter = TokenBalancesFilter$1;
type FetchCollectionBalanceDetailsParams = GetTokenBalancesDetailsRequest & {
  chainId: ChainId;
};
type CollectionBalanceDetailsQueryOptions = SdkQueryParams<FetchCollectionBalanceDetailsParams>;
/**
 * Fetches detailed balance information for multiple accounts from the Indexer API
 */
declare function fetchCollectionBalanceDetails(params: WithRequired<CollectionBalanceDetailsQueryOptions, 'chainId' | 'filter' | 'config'>): Promise<index_d_exports$1$1.GetTokenBalancesDetailsResponse>;
declare function getCollectionBalanceDetailsQueryKey(params: CollectionBalanceDetailsQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  filter: index_d_exports$1$1.TokenBalancesFilter | undefined;
}];
declare function collectionBalanceDetailsQueryOptions(params: WithOptionalParams<WithRequired<CollectionBalanceDetailsQueryOptions, 'chainId' | 'filter' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<index_d_exports$1$1.GetTokenBalancesDetailsResponse, Error, index_d_exports$1$1.GetTokenBalancesDetailsResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<index_d_exports$1$1.GetTokenBalancesDetailsResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: index_d_exports$1$1.GetTokenBalancesDetailsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/list.d.ts
type FetchListCollectionsParams = {
  collectionType?: 'market' | 'shop';
  marketplaceConfig: MarketplaceConfig;
};
type ListCollectionsQueryOptions = SdkQueryParams<FetchListCollectionsParams>;
/**
 * Fetches collections from the metadata API with marketplace config filtering
 */
declare function fetchListCollections(params: WithRequired<ListCollectionsQueryOptions, 'marketplaceConfig' | 'config'>): Promise<({
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "market";
  projectId: ProjectId;
  itemsAddress: Address$1;
  contractType: _0xsequence_indexer1.ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
} | {
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "shop";
  projectId: ProjectId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
})[]>;
declare function getListCollectionsQueryKey(params: ListCollectionsQueryOptions): readonly ["collection", string, {
  readonly collectionType: "market" | "shop" | undefined;
  readonly marketplaceConfig: MarketplaceConfig | undefined;
}];
declare function listCollectionsQueryOptions(params: WithOptionalParams<WithRequired<ListCollectionsQueryOptions, 'marketplaceConfig' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<({
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "market";
  projectId: ProjectId;
  itemsAddress: Address$1;
  contractType: _0xsequence_indexer1.ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
} | {
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "shop";
  projectId: ProjectId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
})[], Error, ({
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "market";
  projectId: ProjectId;
  itemsAddress: Address$1;
  contractType: _0xsequence_indexer1.ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
} | {
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "shop";
  projectId: ProjectId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
})[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<({
    symbol: string;
    type: string;
    name: string;
    status: _0xsequence_metadata3.ResourceStatus;
    updatedAt: string;
    decimals?: number | undefined;
    source: string;
    queuedAt?: string | undefined;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    chainId: ChainId;
    address: Address$1;
    extensions: ContractInfoExtensions$1$1;
    id: number;
    createdAt?: string | undefined;
    bannerUrl: string;
    feePercentage: number;
    currencyOptions: Array<string>;
    sortOrder?: number | undefined;
    private: boolean;
    marketplaceCollectionType: "market";
    projectId: ProjectId;
    itemsAddress: Address$1;
    contractType: _0xsequence_indexer1.ContractType;
    destinationMarketplace: OrderbookKind;
    filterSettings?: CollectionFilterSettings;
  } | {
    symbol: string;
    type: string;
    name: string;
    status: _0xsequence_metadata3.ResourceStatus;
    updatedAt: string;
    decimals?: number | undefined;
    source: string;
    queuedAt?: string | undefined;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    chainId: ChainId;
    address: Address$1;
    extensions: ContractInfoExtensions$1$1;
    id: number;
    createdAt?: string | undefined;
    bannerUrl: string;
    sortOrder?: number | undefined;
    private: boolean;
    marketplaceCollectionType: "shop";
    projectId: ProjectId;
    itemsAddress: Address$1;
    saleAddress: Address$1;
    tokenIds: TokenId[];
    customTokenIds: TokenId[];
  })[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ({
      symbol: string;
      type: string;
      name: string;
      status: _0xsequence_metadata3.ResourceStatus;
      updatedAt: string;
      decimals?: number | undefined;
      source: string;
      queuedAt?: string | undefined;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      chainId: ChainId;
      address: Address$1;
      extensions: ContractInfoExtensions$1$1;
      id: number;
      createdAt?: string | undefined;
      bannerUrl: string;
      feePercentage: number;
      currencyOptions: Array<string>;
      sortOrder?: number | undefined;
      private: boolean;
      marketplaceCollectionType: "market";
      projectId: ProjectId;
      itemsAddress: Address$1;
      contractType: _0xsequence_indexer1.ContractType;
      destinationMarketplace: OrderbookKind;
      filterSettings?: CollectionFilterSettings;
    } | {
      symbol: string;
      type: string;
      name: string;
      status: _0xsequence_metadata3.ResourceStatus;
      updatedAt: string;
      decimals?: number | undefined;
      source: string;
      queuedAt?: string | undefined;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      chainId: ChainId;
      address: Address$1;
      extensions: ContractInfoExtensions$1$1;
      id: number;
      createdAt?: string | undefined;
      bannerUrl: string;
      sortOrder?: number | undefined;
      private: boolean;
      marketplaceCollectionType: "shop";
      projectId: ProjectId;
      itemsAddress: Address$1;
      saleAddress: Address$1;
      tokenIds: TokenId[];
      customTokenIds: TokenId[];
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
declare const listCollectionsOptions: ({
  collectionType,
  marketplaceConfig,
  config,
  query
}: ListCollectionsQueryOptions) => _tanstack_react_query202.UseQueryOptions<({
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "market";
  projectId: ProjectId;
  itemsAddress: Address$1;
  contractType: _0xsequence_indexer1.ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
} | {
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "shop";
  projectId: ProjectId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
})[], Error, ({
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: Array<string>;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "market";
  projectId: ProjectId;
  itemsAddress: Address$1;
  contractType: _0xsequence_indexer1.ContractType;
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
} | {
  symbol: string;
  type: string;
  name: string;
  status: _0xsequence_metadata3.ResourceStatus;
  updatedAt: string;
  decimals?: number | undefined;
  source: string;
  queuedAt?: string | undefined;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  chainId: ChainId;
  address: Address$1;
  extensions: ContractInfoExtensions$1$1;
  id: number;
  createdAt?: string | undefined;
  bannerUrl: string;
  sortOrder?: number | undefined;
  private: boolean;
  marketplaceCollectionType: "shop";
  projectId: ProjectId;
  itemsAddress: Address$1;
  saleAddress: Address$1;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
})[], (string | {
  collectionType: "market" | "shop" | undefined;
  marketplaceConfig: MarketplaceConfig | undefined;
  config: SdkConfig | undefined;
})[]> & {
  initialData?: ({
    symbol: string;
    type: string;
    name: string;
    status: _0xsequence_metadata3.ResourceStatus;
    updatedAt: string;
    decimals?: number | undefined;
    source: string;
    queuedAt?: string | undefined;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    chainId: ChainId;
    address: Address$1;
    extensions: ContractInfoExtensions$1$1;
    id: number;
    createdAt?: string | undefined;
    bannerUrl: string;
    feePercentage: number;
    currencyOptions: Array<string>;
    sortOrder?: number | undefined;
    private: boolean;
    marketplaceCollectionType: "market";
    projectId: ProjectId;
    itemsAddress: Address$1;
    contractType: _0xsequence_indexer1.ContractType;
    destinationMarketplace: OrderbookKind;
    filterSettings?: CollectionFilterSettings;
  } | {
    symbol: string;
    type: string;
    name: string;
    status: _0xsequence_metadata3.ResourceStatus;
    updatedAt: string;
    decimals?: number | undefined;
    source: string;
    queuedAt?: string | undefined;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    chainId: ChainId;
    address: Address$1;
    extensions: ContractInfoExtensions$1$1;
    id: number;
    createdAt?: string | undefined;
    bannerUrl: string;
    sortOrder?: number | undefined;
    private: boolean;
    marketplaceCollectionType: "shop";
    projectId: ProjectId;
    itemsAddress: Address$1;
    saleAddress: Address$1;
    tokenIds: TokenId[];
    customTokenIds: TokenId[];
  })[] | _tanstack_react_query202.InitialDataFunction<({
    symbol: string;
    type: string;
    name: string;
    status: _0xsequence_metadata3.ResourceStatus;
    updatedAt: string;
    decimals?: number | undefined;
    source: string;
    queuedAt?: string | undefined;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    chainId: ChainId;
    address: Address$1;
    extensions: ContractInfoExtensions$1$1;
    id: number;
    createdAt?: string | undefined;
    bannerUrl: string;
    feePercentage: number;
    currencyOptions: Array<string>;
    sortOrder?: number | undefined;
    private: boolean;
    marketplaceCollectionType: "market";
    projectId: ProjectId;
    itemsAddress: Address$1;
    contractType: _0xsequence_indexer1.ContractType;
    destinationMarketplace: OrderbookKind;
    filterSettings?: CollectionFilterSettings;
  } | {
    symbol: string;
    type: string;
    name: string;
    status: _0xsequence_metadata3.ResourceStatus;
    updatedAt: string;
    decimals?: number | undefined;
    source: string;
    queuedAt?: string | undefined;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    chainId: ChainId;
    address: Address$1;
    extensions: ContractInfoExtensions$1$1;
    id: number;
    createdAt?: string | undefined;
    bannerUrl: string;
    sortOrder?: number | undefined;
    private: boolean;
    marketplaceCollectionType: "shop";
    projectId: ProjectId;
    itemsAddress: Address$1;
    saleAddress: Address$1;
    tokenIds: TokenId[];
    customTokenIds: TokenId[];
  })[]> | undefined;
} & {
  queryKey: (string | {
    collectionType: "market" | "shop" | undefined;
    marketplaceConfig: MarketplaceConfig | undefined;
    config: SdkConfig | undefined;
  })[] & {
    [dataTagSymbol]: ({
      symbol: string;
      type: string;
      name: string;
      status: _0xsequence_metadata3.ResourceStatus;
      updatedAt: string;
      decimals?: number | undefined;
      source: string;
      queuedAt?: string | undefined;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      chainId: ChainId;
      address: Address$1;
      extensions: ContractInfoExtensions$1$1;
      id: number;
      createdAt?: string | undefined;
      bannerUrl: string;
      feePercentage: number;
      currencyOptions: Array<string>;
      sortOrder?: number | undefined;
      private: boolean;
      marketplaceCollectionType: "market";
      projectId: ProjectId;
      itemsAddress: Address$1;
      contractType: _0xsequence_indexer1.ContractType;
      destinationMarketplace: OrderbookKind;
      filterSettings?: CollectionFilterSettings;
    } | {
      symbol: string;
      type: string;
      name: string;
      status: _0xsequence_metadata3.ResourceStatus;
      updatedAt: string;
      decimals?: number | undefined;
      source: string;
      queuedAt?: string | undefined;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      chainId: ChainId;
      address: Address$1;
      extensions: ContractInfoExtensions$1$1;
      id: number;
      createdAt?: string | undefined;
      bannerUrl: string;
      sortOrder?: number | undefined;
      private: boolean;
      marketplaceCollectionType: "shop";
      projectId: ProjectId;
      itemsAddress: Address$1;
      saleAddress: Address$1;
      tokenIds: TokenId[];
      customTokenIds: TokenId[];
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-filtered-count.d.ts
type FetchGetCountOfFilteredOrdersParams = GetCountOfFilteredOrdersRequest;
type GetCountOfFilteredOrdersQueryOptions = SdkQueryParams<FetchGetCountOfFilteredOrdersParams>;
declare function fetchGetCountOfFilteredOrders(params: WithRequired<GetCountOfFilteredOrdersQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<number>;
declare function getCountOfFilteredOrdersQueryKey(params: GetCountOfFilteredOrdersQueryOptions): readonly ["collection", "market-filtered-count", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly side: OrderSide | undefined;
  readonly filter: OrdersFilter | undefined;
}];
declare function getCountOfFilteredOrdersQueryOptions(params: WithOptionalParams<WithRequired<GetCountOfFilteredOrdersQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<number, readonly unknown[], never> | undefined;
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
declare function floorOrderQueryOptions(params: WithOptionalParams<WithRequired<FloorOrderQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<CollectibleOrder, Error, CollectibleOrder, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<CollectibleOrder, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CollectibleOrder;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items.d.ts
type ListItemsOrdersForCollectionQueryOptions = SdkInfiniteQueryParams<ListOrdersWithCollectiblesRequest>;
declare function fetchListItemsOrdersForCollection(params: WithRequired<ListItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>, page: Page$2): Promise<ListOrdersWithCollectiblesResponse>;
declare function getListItemsOrdersForCollectionQueryKey(params: ListItemsOrdersForCollectionQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  collectionAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}];
declare function listItemsOrdersForCollectionQueryOptions(params: WithOptionalParams<WithRequired<ListItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseInfiniteQueryOptions<ListOrdersWithCollectiblesResponse, Error, _tanstack_react_query202.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>, readonly unknown[], Page$2>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<ListOrdersWithCollectiblesResponse, readonly unknown[], Page$2> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query202.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-count.d.ts
type FetchCountItemsOrdersForCollectionParams = GetCountOfAllOrdersRequest;
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
declare function countItemsOrdersForCollectionQueryOptions(params: WithOptionalParams<WithRequired<CountItemsOrdersForCollectionQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-paginated.d.ts
type FetchListItemsOrdersForCollectionPaginatedParams = Omit<ListOrdersWithCollectiblesRequest, 'page'> & {
  page?: number;
  pageSize?: number;
};
type ListItemsOrdersForCollectionPaginatedQueryOptions = SdkQueryParams<FetchListItemsOrdersForCollectionPaginatedParams>;
/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
declare function fetchListItemsOrdersForCollectionPaginated(params: WithRequired<ListItemsOrdersForCollectionPaginatedQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<ListOrdersWithCollectiblesResponse>;
declare function getListItemsOrdersForCollectionPaginatedQueryKey(params: ListItemsOrdersForCollectionPaginatedQueryOptions): readonly ["order", "collection-items-paginated", ListItemsOrdersForCollectionPaginatedQueryOptions];
declare function listItemsOrdersForCollectionPaginatedQueryOptions(params: WithOptionalParams<WithRequired<ListItemsOrdersForCollectionPaginatedQueryOptions, 'collectionAddress' | 'chainId' | 'config' | 'side'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<ListOrdersWithCollectiblesResponse, Error, ListOrdersWithCollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<ListOrdersWithCollectiblesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListOrdersWithCollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/metadata.d.ts
type FetchCollectionParams = GetContractInfoSdkArgs;
type CollectionQueryOptions = SdkQueryParams<FetchCollectionParams>;
/**
 * Fetches collection information from the metadata API
 */
declare function fetchCollection(params: WithRequired<CollectionQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<ContractInfo$1$1>;
declare function getCollectionQueryKey(params: CollectionQueryOptions): readonly ["collection", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
}];
declare function collectionQueryOptions(params: WithOptionalParams<WithRequired<CollectionQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query202.OmitKeyof<_tanstack_react_query202.UseQueryOptions<ContractInfo$1$1, Error, ContractInfo$1$1, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query202.QueryFunction<ContractInfo$1$1, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ContractInfo$1$1;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ListCollectionsQueryOptions as A, getCollectionBalanceDetailsQueryKey as B, getFloorOrderQueryKey as C, getCountOfFilteredOrdersQueryKey as D, fetchGetCountOfFilteredOrders as E, CollectionBalanceDetailsQueryOptions as F, CollectionBalanceFilter as I, FetchCollectionBalanceDetailsParams as L, getListCollectionsQueryKey as M, listCollectionsOptions as N, getCountOfFilteredOrdersQueryOptions as O, listCollectionsQueryOptions as P, collectionBalanceDetailsQueryOptions as R, floorOrderQueryOptions as S, GetCountOfFilteredOrdersQueryOptions as T, fetchListItemsOrdersForCollection as _, getCollectionQueryKey as a, FloorOrderQueryOptions as b, fetchListItemsOrdersForCollectionPaginated as c, CountItemsOrdersForCollectionQueryOptions as d, FetchCountItemsOrdersForCollectionParams as f, ListItemsOrdersForCollectionQueryOptions as g, getCountItemsOrdersForCollectionQueryKey as h, fetchCollection as i, fetchListCollections as j, FetchListCollectionsParams as k, getListItemsOrdersForCollectionPaginatedQueryKey as l, fetchCountItemsOrdersForCollection as m, FetchCollectionParams as n, FetchListItemsOrdersForCollectionPaginatedParams as o, countItemsOrdersForCollectionQueryOptions as p, collectionQueryOptions as r, ListItemsOrdersForCollectionPaginatedQueryOptions as s, CollectionQueryOptions as t, listItemsOrdersForCollectionPaginatedQueryOptions as u, getListItemsOrdersForCollectionQueryKey as v, FetchGetCountOfFilteredOrdersParams as w, fetchFloorOrder as x, listItemsOrdersForCollectionQueryOptions as y, fetchCollectionBalanceDetails as z };
//# sourceMappingURL=metadata.d.ts.map