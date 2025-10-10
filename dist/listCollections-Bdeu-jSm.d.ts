import { CardType, Collection, CollectionFilterSettings, ContractType, GetCollectionDetailArgs, ListCollectionActivitiesArgs, ListCollectionActivitiesReturn, MarketplaceConfig, OrderbookKind, SdkConfig, SortBy, ValuesOptional } from "./create-config-DoEY40YQ.js";
import { StandardQueryOptions } from "./query-BWbCsXLY.js";
import * as _tanstack_react_query179 from "@tanstack/react-query";
import { GetTokenBalancesDetailsReturn } from "@0xsequence/indexer";
import * as _0xsequence_metadata53 from "@0xsequence/metadata";
import * as viem26 from "viem";
import { Address } from "viem";

//#region src/react/queries/collections/collection.d.ts
interface FetchCollectionParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
}
/**
 * Fetches collection information from the metadata API
 */
declare function fetchCollection(params: FetchCollectionParams): Promise<_0xsequence_metadata53.ContractInfo>;
type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionQueryKey(params: CollectionQueryOptions): readonly ["collections", "detail", {
  chainID: string;
  contractAddress: string | undefined;
}];
declare function collectionQueryOptions(params: CollectionQueryOptions): _tanstack_react_query179.OmitKeyof<_tanstack_react_query179.UseQueryOptions<_0xsequence_metadata53.ContractInfo, Error, _0xsequence_metadata53.ContractInfo, readonly ["collections", "detail", {
  chainID: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query179.QueryFunction<_0xsequence_metadata53.ContractInfo, readonly ["collections", "detail", {
    chainID: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "detail", {
    chainID: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_metadata53.ContractInfo;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collections/collectionBalanceDetails.d.ts
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
declare function getCollectionBalanceDetailsQueryKey(params: CollectionBalanceDetailsQueryOptions): readonly ["balances", "collectionBalanceDetails", {
  chainId: number;
  filter: CollectionBalanceFilter;
}];
declare function collectionBalanceDetailsQueryOptions(params: CollectionBalanceDetailsQueryOptions): _tanstack_react_query179.OmitKeyof<_tanstack_react_query179.UseQueryOptions<GetTokenBalancesDetailsReturn, Error, GetTokenBalancesDetailsReturn, readonly ["balances", "collectionBalanceDetails", {
  chainId: number;
  filter: CollectionBalanceFilter;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query179.QueryFunction<GetTokenBalancesDetailsReturn, readonly ["balances", "collectionBalanceDetails", {
    chainId: number;
    filter: CollectionBalanceFilter;
  }], never> | undefined;
} & {
  queryKey: readonly ["balances", "collectionBalanceDetails", {
    chainId: number;
    filter: CollectionBalanceFilter;
  }] & {
    [dataTagSymbol]: GetTokenBalancesDetailsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collections/collectionDetails.d.ts
interface FetchCollectionDetailsParams extends Omit<GetCollectionDetailArgs, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
}
/**
 * Fetches collection details from the marketplace API
 */
declare function fetchCollectionDetails(params: FetchCollectionDetailsParams): Promise<Collection>;
type CollectionDetailsQueryOptions = ValuesOptional<FetchCollectionDetailsParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionDetailsQueryKey(params: CollectionDetailsQueryOptions): readonly ["collections", "detail", {
  chainId: string;
  contractAddress: string | undefined;
}];
declare function collectionDetailsQueryOptions(params: CollectionDetailsQueryOptions): _tanstack_react_query179.OmitKeyof<_tanstack_react_query179.UseQueryOptions<Collection, Error, Collection, readonly ["collections", "detail", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query179.QueryFunction<Collection, readonly ["collections", "detail", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "detail", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collections/listCollectionActivities.d.ts
interface FetchListCollectionActivitiesParams extends Omit<ListCollectionActivitiesArgs, 'chainId' | 'contractAddress' | 'page'> {
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
declare function fetchListCollectionActivities(params: FetchListCollectionActivitiesParams): Promise<ListCollectionActivitiesReturn>;
type ListCollectionActivitiesQueryOptions = ValuesOptional<FetchListCollectionActivitiesParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectionActivitiesQueryKey(params: ListCollectionActivitiesQueryOptions): readonly ["collections", "collectionActivities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}];
declare function listCollectionActivitiesQueryOptions(params: ListCollectionActivitiesQueryOptions): _tanstack_react_query179.OmitKeyof<_tanstack_react_query179.UseQueryOptions<ListCollectionActivitiesReturn, Error, ListCollectionActivitiesReturn, readonly ["collections", "collectionActivities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query179.QueryFunction<ListCollectionActivitiesReturn, readonly ["collections", "collectionActivities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "collectionActivities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }] & {
    [dataTagSymbol]: ListCollectionActivitiesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collections/listCollections.d.ts
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  saleAddress: viem26.Address;
  bannerUrl: string;
  itemsAddress: viem26.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[]>;
type ListCollectionsQueryOptions = ValuesOptional<FetchListCollectionsParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectionsQueryKey(params: ListCollectionsQueryOptions): readonly ["collections", "list", {
  readonly cardType: CardType | undefined;
  readonly marketplaceConfig: MarketplaceConfig | undefined;
}];
declare function listCollectionsQueryOptions(params: ListCollectionsQueryOptions): _tanstack_react_query179.UseQueryOptions<({
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  saleAddress: viem26.Address;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  saleAddress: viem26.Address;
  bannerUrl: string;
  itemsAddress: viem26.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], readonly ["collections", "list", {
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem26.Address;
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    saleAddress: viem26.Address;
    bannerUrl: string;
    itemsAddress: viem26.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query179.InitialDataFunction<({
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem26.Address;
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    saleAddress: viem26.Address;
    bannerUrl: string;
    itemsAddress: viem26.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[]> | undefined;
} & {
  queryKey: readonly ["collections", "list", {
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
      extensions: _0xsequence_metadata53.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata53.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem26.Address;
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
      extensions: _0xsequence_metadata53.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata53.ResourceStatus;
      cardType: CardType;
      saleAddress: viem26.Address;
      bannerUrl: string;
      itemsAddress: viem26.Address;
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
}) => _tanstack_react_query179.UseQueryOptions<({
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  saleAddress: viem26.Address;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem26.Address;
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
  extensions: _0xsequence_metadata53.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata53.ResourceStatus;
  cardType: CardType;
  saleAddress: viem26.Address;
  bannerUrl: string;
  itemsAddress: viem26.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], ("collections" | "list" | {
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem26.Address;
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    saleAddress: viem26.Address;
    bannerUrl: string;
    itemsAddress: viem26.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query179.InitialDataFunction<({
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem26.Address;
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
    extensions: _0xsequence_metadata53.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata53.ResourceStatus;
    cardType: CardType;
    saleAddress: viem26.Address;
    bannerUrl: string;
    itemsAddress: viem26.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[]> | undefined;
} & {
  queryKey: ("collections" | "list" | {
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
      extensions: _0xsequence_metadata53.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata53.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem26.Address;
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
      extensions: _0xsequence_metadata53.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata53.ResourceStatus;
      cardType: CardType;
      saleAddress: viem26.Address;
      bannerUrl: string;
      itemsAddress: viem26.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectionBalanceDetailsQueryOptions, CollectionBalanceFilter, CollectionDetailsQueryOptions, CollectionQueryOptions, FetchCollectionBalanceDetailsParams, FetchCollectionDetailsParams, FetchCollectionParams, FetchListCollectionActivitiesParams, FetchListCollectionsParams, ListCollectionActivitiesQueryOptions, ListCollectionsQueryOptions, collectionBalanceDetailsQueryOptions, collectionDetailsQueryOptions, collectionQueryOptions, fetchCollection, fetchCollectionBalanceDetails, fetchCollectionDetails, fetchListCollectionActivities, fetchListCollections, getCollectionBalanceDetailsQueryKey, getCollectionDetailsQueryKey, getCollectionQueryKey, getListCollectionActivitiesQueryKey, getListCollectionsQueryKey, listCollectionActivitiesQueryOptions, listCollectionsOptions, listCollectionsQueryOptions };
//# sourceMappingURL=listCollections-Bdeu-jSm.d.ts.map