import { CardType, Collection, CollectionFilterSettings, ContractType, GetCollectionDetailArgs, ListCollectionActivitiesArgs, ListCollectionActivitiesReturn, MarketplaceConfig, OrderbookKind, SdkConfig, SortBy, ValuesOptional } from "./create-config-Cvi1W2a1.js";
import { StandardQueryOptions } from "./query-BG-MA1MB.js";
import * as _tanstack_react_query328 from "@tanstack/react-query";
import { GetTokenBalancesDetailsReturn } from "@0xsequence/indexer";
import * as _0xsequence_metadata135 from "@0xsequence/metadata";
import * as viem30 from "viem";
import { Address } from "viem";

//#region src/react/queries/collection.d.ts
interface FetchCollectionParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
}
/**
 * Fetches collection information from the metadata API
 */
declare function fetchCollection(params: FetchCollectionParams): Promise<_0xsequence_metadata135.ContractInfo>;
type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
  query?: StandardQueryOptions;
};
declare function collectionQueryOptions(params: CollectionQueryOptions): _tanstack_react_query328.OmitKeyof<_tanstack_react_query328.UseQueryOptions<_0xsequence_metadata135.ContractInfo, Error, _0xsequence_metadata135.ContractInfo, ("collections" | "detail" | CollectionQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query328.QueryFunction<_0xsequence_metadata135.ContractInfo, ("collections" | "detail" | CollectionQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "detail" | CollectionQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata135.ContractInfo;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectionBalanceDetails.d.ts
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
declare function collectionBalanceDetailsQueryOptions(params: CollectionBalanceDetailsQueryOptions): _tanstack_react_query328.OmitKeyof<_tanstack_react_query328.UseQueryOptions<GetTokenBalancesDetailsReturn, Error, GetTokenBalancesDetailsReturn, (string | CollectionBalanceDetailsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query328.QueryFunction<GetTokenBalancesDetailsReturn, (string | CollectionBalanceDetailsQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | CollectionBalanceDetailsQueryOptions)[] & {
    [dataTagSymbol]: GetTokenBalancesDetailsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectionDetails.d.ts
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
declare function collectionDetailsQueryOptions(params: CollectionDetailsQueryOptions): _tanstack_react_query328.OmitKeyof<_tanstack_react_query328.UseQueryOptions<Collection, Error, Collection, ("collections" | "detail" | CollectionDetailsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query328.QueryFunction<Collection, ("collections" | "detail" | CollectionDetailsQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "detail" | CollectionDetailsQueryOptions)[] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollectionActivities.d.ts
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
declare function listCollectionActivitiesQueryOptions(params: ListCollectionActivitiesQueryOptions): _tanstack_react_query328.OmitKeyof<_tanstack_react_query328.UseQueryOptions<ListCollectionActivitiesReturn, Error, ListCollectionActivitiesReturn, ("collections" | "collectionActivities" | ListCollectionActivitiesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query328.QueryFunction<ListCollectionActivitiesReturn, ("collections" | "collectionActivities" | ListCollectionActivitiesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "collectionActivities" | ListCollectionActivitiesQueryOptions)[] & {
    [dataTagSymbol]: ListCollectionActivitiesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollections.d.ts
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  saleAddress: viem30.Address;
  bannerUrl: string;
  itemsAddress: viem30.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[]>;
type ListCollectionsQueryOptions = ValuesOptional<FetchListCollectionsParams> & {
  query?: StandardQueryOptions;
};
declare function listCollectionsQueryOptions(params: ListCollectionsQueryOptions): _tanstack_react_query328.UseQueryOptions<({
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  saleAddress: viem30.Address;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  saleAddress: viem30.Address;
  bannerUrl: string;
  itemsAddress: viem30.Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
})[], ("collections" | "list" | ListCollectionsQueryOptions)[]> & {
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem30.Address;
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    saleAddress: viem30.Address;
    bannerUrl: string;
    itemsAddress: viem30.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query328.InitialDataFunction<({
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem30.Address;
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    saleAddress: viem30.Address;
    bannerUrl: string;
    itemsAddress: viem30.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[]> | undefined;
} & {
  queryKey: ("collections" | "list" | ListCollectionsQueryOptions)[] & {
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
      extensions: _0xsequence_metadata135.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata135.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem30.Address;
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
      extensions: _0xsequence_metadata135.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata135.ResourceStatus;
      cardType: CardType;
      saleAddress: viem30.Address;
      bannerUrl: string;
      itemsAddress: viem30.Address;
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
}) => _tanstack_react_query328.UseQueryOptions<({
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  saleAddress: viem30.Address;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
  extensions: _0xsequence_metadata135.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata135.ResourceStatus;
  cardType: CardType;
  saleAddress: viem30.Address;
  bannerUrl: string;
  itemsAddress: viem30.Address;
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem30.Address;
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    saleAddress: viem30.Address;
    bannerUrl: string;
    itemsAddress: viem30.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query328.InitialDataFunction<({
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem30.Address;
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
    extensions: _0xsequence_metadata135.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata135.ResourceStatus;
    cardType: CardType;
    saleAddress: viem30.Address;
    bannerUrl: string;
    itemsAddress: viem30.Address;
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
      extensions: _0xsequence_metadata135.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata135.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem30.Address;
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
      extensions: _0xsequence_metadata135.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata135.ResourceStatus;
      cardType: CardType;
      saleAddress: viem30.Address;
      bannerUrl: string;
      itemsAddress: viem30.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectionBalanceDetailsQueryOptions, CollectionBalanceFilter, CollectionDetailsQueryOptions, CollectionQueryOptions, FetchCollectionBalanceDetailsParams, FetchCollectionDetailsParams, FetchCollectionParams, FetchListCollectionActivitiesParams, FetchListCollectionsParams, ListCollectionActivitiesQueryOptions, ListCollectionsQueryOptions, collectionBalanceDetailsQueryOptions, collectionDetailsQueryOptions, collectionQueryOptions, fetchCollection, fetchCollectionBalanceDetails, fetchCollectionDetails, fetchListCollectionActivities, fetchListCollections, listCollectionActivitiesQueryOptions, listCollectionsOptions, listCollectionsQueryOptions };
//# sourceMappingURL=listCollections-C7EmHtPh.d.ts.map