import { At as ContractType, Cr as ListCollectionActivitiesRequest, G as SdkConfig, K as CardType, Lr as ListOrdersWithCollectiblesRequest, Qr as OrderSide, Rr as ListOrdersWithCollectiblesResponse, Wn as GetFloorOrderRequest, a as CollectionFilterSettings, bi as SortBy, bt as CollectibleOrder, c as MarketplaceConfig, ei as OrderbookKind, j as ValuesOptional, ni as Page$2, ti as OrdersFilter, wr as ListCollectionActivitiesResponse, wt as CollectiblesFilter } from "./create-config-BO68TZC5.js";
import { n as StandardQueryOptions, t as StandardInfiniteQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query267 from "@tanstack/react-query";
import { GetTokenBalancesDetailsReturn } from "@0xsequence/indexer";
import * as _0xsequence_metadata91 from "@0xsequence/metadata";
import * as viem16 from "viem";
import { Address } from "viem";

//#region src/react/queries/collection/balance-details.d.ts
interface CollectionBalanceFilter {
  accountAddresses: Array<Address>;
  contractWhitelist?: Array<Address>;
  omitNativeBalances: boolean;
}
interface FetchCollectionBalanceDetailsParams {
  chainId: number;
  filter: CollectionBalanceFilter;
  config: SdkConfig;
}
/**
 * Fetches detailed balance information for multiple accounts from the Indexer API
 */
declare function fetchCollectionBalanceDetails(params: FetchCollectionBalanceDetailsParams): Promise<GetTokenBalancesDetailsReturn>;
type CollectionBalanceDetailsQueryOptions = ValuesOptional<FetchCollectionBalanceDetailsParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionBalanceDetailsQueryKey(params: CollectionBalanceDetailsQueryOptions): readonly ["collection", "balance-details", {
  chainId: number;
  filter: CollectionBalanceFilter;
}];
declare function collectionBalanceDetailsQueryOptions(params: CollectionBalanceDetailsQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<GetTokenBalancesDetailsReturn, Error, GetTokenBalancesDetailsReturn, readonly ["collection", "balance-details", {
  chainId: number;
  filter: CollectionBalanceFilter;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<GetTokenBalancesDetailsReturn, readonly ["collection", "balance-details", {
    chainId: number;
    filter: CollectionBalanceFilter;
  }], never> | undefined;
} & {
  queryKey: readonly ["collection", "balance-details", {
    chainId: number;
    filter: CollectionBalanceFilter;
  }] & {
    [dataTagSymbol]: GetTokenBalancesDetailsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/list.d.ts
interface FetchListCollectionsParams {
  cardType?: CardType;
  marketplaceConfig: MarketplaceConfig;
  config: SdkConfig;
}
/**
 * Fetches collections from the metadata API with marketplace config filtering
 */
declare function fetchListCollections(params: FetchListCollectionsParams): Promise<({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  saleAddress: viem16.Address;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[]>;
type ListCollectionsQueryOptions = ValuesOptional<FetchListCollectionsParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectionsQueryKey(params: ListCollectionsQueryOptions): readonly ["collection", "list", {
  readonly cardType: CardType | undefined;
  readonly marketplaceConfig: MarketplaceConfig | undefined;
}];
declare function listCollectionsQueryOptions(params: ListCollectionsQueryOptions): _tanstack_react_query267.UseQueryOptions<({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  saleAddress: viem16.Address;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], Error, ({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  saleAddress: viem16.Address;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], readonly ["collection", "list", {
  readonly cardType: CardType | undefined;
  readonly marketplaceConfig: MarketplaceConfig | undefined;
}]> & {
  initialData?: ({
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  } | {
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    saleAddress: viem16.Address;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query267.InitialDataFunction<({
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  } | {
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    saleAddress: viem16.Address;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[]> | undefined;
} & {
  queryKey: readonly ["collection", "list", {
    readonly cardType: CardType | undefined;
    readonly marketplaceConfig: MarketplaceConfig | undefined;
  }] & {
    [dataTagSymbol]: ({
      chainId: number;
      address: string;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_metadata91.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata91.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem16.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    } | {
      chainId: number;
      address: string;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_metadata91.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata91.ResourceStatus;
      cardType: CardType;
      saleAddress: viem16.Address;
      bannerUrl: string;
      itemsAddress: viem16.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
declare const listCollectionsOptions: ({
  cardType,
  marketplaceConfig,
  config
}: {
  cardType?: CardType;
  marketplaceConfig: MarketplaceConfig | undefined;
  config: SdkConfig;
}) => _tanstack_react_query267.UseQueryOptions<({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  saleAddress: viem16.Address;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], Error, ({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata91.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata91.ResourceStatus;
  cardType: CardType;
  saleAddress: viem16.Address;
  bannerUrl: string;
  itemsAddress: viem16.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], (string | {
  cardType: CardType | undefined;
  marketplaceConfig: MarketplaceConfig | undefined;
  config: SdkConfig;
})[]> & {
  initialData?: ({
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  } | {
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    saleAddress: viem16.Address;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query267.InitialDataFunction<({
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  } | {
    chainId: number;
    address: string;
    source: string;
    name: string;
    type: string;
    symbol: string;
    decimals?: number;
    logoURI: string;
    deployed: boolean;
    bytecodeHash: string;
    extensions: _0xsequence_metadata91.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata91.ResourceStatus;
    cardType: CardType;
    saleAddress: viem16.Address;
    bannerUrl: string;
    itemsAddress: viem16.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[]> | undefined;
} & {
  queryKey: (string | {
    cardType: CardType | undefined;
    marketplaceConfig: MarketplaceConfig | undefined;
    config: SdkConfig;
  })[] & {
    [dataTagSymbol]: ({
      chainId: number;
      address: string;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_metadata91.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata91.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem16.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    } | {
      chainId: number;
      address: string;
      source: string;
      name: string;
      type: string;
      symbol: string;
      decimals?: number;
      logoURI: string;
      deployed: boolean;
      bytecodeHash: string;
      extensions: _0xsequence_metadata91.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata91.ResourceStatus;
      cardType: CardType;
      saleAddress: viem16.Address;
      bannerUrl: string;
      itemsAddress: viem16.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-activities.d.ts
interface FetchListCollectionActivitiesParams extends Omit<ListCollectionActivitiesRequest, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  sort?: SortBy[];
  config: SdkConfig;
}
/**
 * Fetches collection activities from the Marketplace API
 */
declare function fetchListCollectionActivities(params: FetchListCollectionActivitiesParams): Promise<ListCollectionActivitiesResponse>;
type ListCollectionActivitiesQueryOptions = ValuesOptional<FetchListCollectionActivitiesParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectionActivitiesQueryKey(params: ListCollectionActivitiesQueryOptions): readonly ["collection", "market-activities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}];
declare function listCollectionActivitiesQueryOptions(params: ListCollectionActivitiesQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<ListCollectionActivitiesResponse, Error, ListCollectionActivitiesResponse, readonly ["collection", "market-activities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<ListCollectionActivitiesResponse, readonly ["collection", "market-activities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collection", "market-activities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }] & {
    [dataTagSymbol]: ListCollectionActivitiesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-filtered-count.d.ts
interface FetchGetCountOfFilteredOrdersParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  side: OrderSide;
  filter?: OrdersFilter;
}
declare function fetchGetCountOfFilteredOrders(params: FetchGetCountOfFilteredOrdersParams): Promise<number>;
type GetCountOfFilteredOrdersQueryOptions = ValuesOptional<FetchGetCountOfFilteredOrdersParams> & {
  query?: StandardQueryOptions;
};
declare function getCountOfFilteredOrdersQueryKey(params: GetCountOfFilteredOrdersQueryOptions): readonly ["collection", "market-filtered-count", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}];
declare function getCountOfFilteredOrdersQueryOptions(params: GetCountOfFilteredOrdersQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<number, Error, number, readonly ["collection", "market-filtered-count", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<number, readonly ["collection", "market-filtered-count", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collection", "market-filtered-count", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-floor.d.ts
interface FetchFloorOrderParams extends Omit<GetFloorOrderRequest, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the floor order for a collection from the marketplace API
 */
declare function fetchFloorOrder(params: FetchFloorOrderParams): Promise<CollectibleOrder>;
type FloorOrderQueryOptions = ValuesOptional<FetchFloorOrderParams> & {
  query?: StandardQueryOptions;
};
declare function getFloorOrderQueryKey(params: FloorOrderQueryOptions): readonly ["collection", "market-floor", {
  chainId: string;
  contractAddress: string | undefined;
  filter: CollectiblesFilter | undefined;
}];
declare function floorOrderQueryOptions(params: FloorOrderQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<CollectibleOrder, Error, CollectibleOrder, readonly ["collection", "market-floor", {
  chainId: string;
  contractAddress: string | undefined;
  filter: CollectiblesFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<CollectibleOrder, readonly ["collection", "market-floor", {
    chainId: string;
    contractAddress: string | undefined;
    filter: CollectiblesFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collection", "market-floor", {
    chainId: string;
    contractAddress: string | undefined;
    filter: CollectiblesFilter | undefined;
  }] & {
    [dataTagSymbol]: CollectibleOrder;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items.d.ts
interface FetchListItemsOrdersForCollectionParams extends Omit<ListOrdersWithCollectiblesRequest, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: Address;
  config: SdkConfig;
}
declare function fetchListItemsOrdersForCollection(params: FetchListItemsOrdersForCollectionParams, page: Page$2): Promise<ListOrdersWithCollectiblesResponse>;
type ListItemsOrdersForCollectionQueryOptions = ValuesOptional<FetchListItemsOrdersForCollectionParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function getListItemsOrdersForCollectionQueryKey(params: ListItemsOrdersForCollectionQueryOptions): readonly ["collection", "market-items", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}];
declare function listItemsOrdersForCollectionQueryOptions(params: ListItemsOrdersForCollectionQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseInfiniteQueryOptions<ListOrdersWithCollectiblesResponse, Error, _tanstack_react_query267.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>, readonly ["collection", "market-items", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}], Page$2>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<ListOrdersWithCollectiblesResponse, readonly ["collection", "market-items", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }], Page$2> | undefined;
} & {
  queryKey: readonly ["collection", "market-items", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query267.InfiniteData<ListOrdersWithCollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-count.d.ts
interface FetchCountItemsOrdersForCollectionParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  side: OrderSide;
}
/**
 * Fetches count of orders for a collection from the marketplace API
 */
declare function fetchCountItemsOrdersForCollection(params: FetchCountItemsOrdersForCollectionParams): Promise<number>;
type CountItemsOrdersForCollectionQueryOptions = ValuesOptional<FetchCountItemsOrdersForCollectionParams> & {
  query?: StandardQueryOptions;
};
declare function getCountItemsOrdersForCollectionQueryKey(params: CountItemsOrdersForCollectionQueryOptions): readonly ["order", "collection-items-count", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
}];
declare function countItemsOrdersForCollectionQueryOptions(params: CountItemsOrdersForCollectionQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<number, Error, number, readonly ["order", "collection-items-count", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<number, readonly ["order", "collection-items-count", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["order", "collection-items-count", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/market-items-paginated.d.ts
interface FetchListItemsOrdersForCollectionPaginatedParams extends Omit<ListOrdersWithCollectiblesRequest, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  config: SdkConfig;
}
/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
declare function fetchListItemsOrdersForCollectionPaginated(params: FetchListItemsOrdersForCollectionPaginatedParams): Promise<ListOrdersWithCollectiblesResponse>;
type ListItemsOrdersForCollectionPaginatedQueryOptions = ValuesOptional<FetchListItemsOrdersForCollectionPaginatedParams> & {
  query?: StandardQueryOptions;
};
declare function listItemsOrdersForCollectionPaginatedQueryOptions(params: ListItemsOrdersForCollectionPaginatedQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<ListOrdersWithCollectiblesResponse, Error, ListOrdersWithCollectiblesResponse, (string | ListItemsOrdersForCollectionPaginatedQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<ListOrdersWithCollectiblesResponse, (string | ListItemsOrdersForCollectionPaginatedQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ListItemsOrdersForCollectionPaginatedQueryOptions)[] & {
    [dataTagSymbol]: ListOrdersWithCollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collection/metadata.d.ts
interface FetchCollectionParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
}
/**
 * Fetches collection information from the metadata API
 */
declare function fetchCollection(params: FetchCollectionParams): Promise<_0xsequence_metadata91.ContractInfo>;
type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionQueryKey(params: CollectionQueryOptions): readonly ["collection", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
}];
declare function collectionQueryOptions(params: CollectionQueryOptions): _tanstack_react_query267.OmitKeyof<_tanstack_react_query267.UseQueryOptions<_0xsequence_metadata91.ContractInfo, Error, _0xsequence_metadata91.ContractInfo, readonly ["collection", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query267.QueryFunction<_0xsequence_metadata91.ContractInfo, readonly ["collection", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collection", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_metadata91.ContractInfo;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { FetchListCollectionActivitiesParams as A, listCollectionsQueryOptions as B, floorOrderQueryOptions as C, fetchGetCountOfFilteredOrders as D, GetCountOfFilteredOrdersQueryOptions as E, FetchListCollectionsParams as F, fetchCollectionBalanceDetails as G, CollectionBalanceFilter as H, ListCollectionsQueryOptions as I, getCollectionBalanceDetailsQueryKey as K, fetchListCollections as L, fetchListCollectionActivities as M, getListCollectionActivitiesQueryKey as N, getCountOfFilteredOrdersQueryKey as O, listCollectionActivitiesQueryOptions as P, getListCollectionsQueryKey as R, fetchFloorOrder as S, FetchGetCountOfFilteredOrdersParams as T, FetchCollectionBalanceDetailsParams as U, CollectionBalanceDetailsQueryOptions as V, collectionBalanceDetailsQueryOptions as W, fetchListItemsOrdersForCollection as _, getCollectionQueryKey as a, FetchFloorOrderParams as b, fetchListItemsOrdersForCollectionPaginated as c, FetchCountItemsOrdersForCollectionParams as d, countItemsOrdersForCollectionQueryOptions as f, ListItemsOrdersForCollectionQueryOptions as g, FetchListItemsOrdersForCollectionParams as h, fetchCollection as i, ListCollectionActivitiesQueryOptions as j, getCountOfFilteredOrdersQueryOptions as k, listItemsOrdersForCollectionPaginatedQueryOptions as l, getCountItemsOrdersForCollectionQueryKey as m, FetchCollectionParams as n, FetchListItemsOrdersForCollectionPaginatedParams as o, fetchCountItemsOrdersForCollection as p, collectionQueryOptions as r, ListItemsOrdersForCollectionPaginatedQueryOptions as s, CollectionQueryOptions as t, CountItemsOrdersForCollectionQueryOptions as u, getListItemsOrdersForCollectionQueryKey as v, getFloorOrderQueryKey as w, FloorOrderQueryOptions as x, listItemsOrdersForCollectionQueryOptions as y, listCollectionsOptions as z };
//# sourceMappingURL=metadata-BlU2vCV8.d.ts.map