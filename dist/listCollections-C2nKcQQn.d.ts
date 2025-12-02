import { CardType, Collection, CollectionFilterSettings, ContractType, Currency, GetCollectionActiveListingsCurrenciesArgs, GetCollectionActiveListingsCurrenciesReturn, GetCollectionActiveOffersCurrenciesArgs, GetCollectionActiveOffersCurrenciesReturn, GetCollectionDetailArgs, ListCollectionActivitiesArgs, ListCollectionActivitiesReturn, MarketplaceConfig, OrderbookKind, SdkConfig, SortBy, ValuesOptional } from "./create-config-CsagtMvq.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query388 from "@tanstack/react-query";
import * as _tanstack_react_query407 from "@tanstack/react-query";
import * as _tanstack_react_query395 from "@tanstack/react-query";
import * as _tanstack_react_query398 from "@tanstack/react-query";
import * as _tanstack_react_query401 from "@tanstack/react-query";
import * as _tanstack_react_query404 from "@tanstack/react-query";
import * as _tanstack_react_query391 from "@tanstack/react-query";
import { GetTokenBalancesDetailsReturn } from "@0xsequence/indexer";
import * as _0xsequence_metadata91 from "@0xsequence/metadata";
import * as _0xsequence_metadata96 from "@0xsequence/metadata";
import * as viem32 from "viem";
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
declare function fetchCollection(params: FetchCollectionParams): Promise<_0xsequence_metadata91.ContractInfo>;
type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionQueryKey(params: CollectionQueryOptions): readonly ["collections", "detail", {
  chainID: string;
  contractAddress: string | undefined;
}];
declare function collectionQueryOptions(params: CollectionQueryOptions): _tanstack_react_query388.OmitKeyof<_tanstack_react_query388.UseQueryOptions<_0xsequence_metadata91.ContractInfo, Error, _0xsequence_metadata91.ContractInfo, readonly ["collections", "detail", {
  chainID: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query388.QueryFunction<_0xsequence_metadata91.ContractInfo, readonly ["collections", "detail", {
    chainID: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "detail", {
    chainID: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_metadata91.ContractInfo;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collections/activeListingsCurrencies.d.ts
interface FetchCollectionActiveListingsCurrenciesParams extends Omit<GetCollectionActiveListingsCurrenciesArgs, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the active listings currencies for a collection from the marketplace API
 */
declare function fetchCollectionActiveListingsCurrencies(params: FetchCollectionActiveListingsCurrenciesParams): Promise<GetCollectionActiveListingsCurrenciesReturn['currencies']>;
type CollectionActiveListingsCurrenciesQueryOptions = ValuesOptional<FetchCollectionActiveListingsCurrenciesParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionActiveListingsCurrenciesQueryKey(params: CollectionActiveListingsCurrenciesQueryOptions): readonly ["collections", "activeListingsCurrencies", {
  chainId: string;
  contractAddress: string | undefined;
}];
declare function collectionActiveListingsCurrenciesQueryOptions(params: CollectionActiveListingsCurrenciesQueryOptions): _tanstack_react_query407.OmitKeyof<_tanstack_react_query407.UseQueryOptions<Currency[], Error, Currency[], readonly ["collections", "activeListingsCurrencies", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query407.QueryFunction<Currency[], readonly ["collections", "activeListingsCurrencies", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "activeListingsCurrencies", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: Currency[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collections/activeOffersCurrencies.d.ts
interface FetchCollectionActiveOffersCurrenciesParams extends Omit<GetCollectionActiveOffersCurrenciesArgs, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the active offers currencies for a collection from the marketplace API
 */
declare function fetchCollectionActiveOffersCurrencies(params: FetchCollectionActiveOffersCurrenciesParams): Promise<GetCollectionActiveOffersCurrenciesReturn['currencies']>;
type CollectionActiveOffersCurrenciesQueryOptions = ValuesOptional<FetchCollectionActiveOffersCurrenciesParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectionActiveOffersCurrenciesQueryKey(params: CollectionActiveOffersCurrenciesQueryOptions): readonly ["collections", "activeOffersCurrencies", {
  chainId: string;
  contractAddress: string | undefined;
}];
declare function collectionActiveOffersCurrenciesQueryOptions(params: CollectionActiveOffersCurrenciesQueryOptions): _tanstack_react_query395.OmitKeyof<_tanstack_react_query395.UseQueryOptions<Currency[], Error, Currency[], readonly ["collections", "activeOffersCurrencies", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query395.QueryFunction<Currency[], readonly ["collections", "activeOffersCurrencies", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "activeOffersCurrencies", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: Currency[];
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
declare function collectionBalanceDetailsQueryOptions(params: CollectionBalanceDetailsQueryOptions): _tanstack_react_query398.OmitKeyof<_tanstack_react_query398.UseQueryOptions<GetTokenBalancesDetailsReturn, Error, GetTokenBalancesDetailsReturn, readonly ["balances", "collectionBalanceDetails", {
  chainId: number;
  filter: CollectionBalanceFilter;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query398.QueryFunction<GetTokenBalancesDetailsReturn, readonly ["balances", "collectionBalanceDetails", {
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
declare function collectionDetailsQueryOptions(params: CollectionDetailsQueryOptions): _tanstack_react_query401.OmitKeyof<_tanstack_react_query401.UseQueryOptions<Collection, Error, Collection, readonly ["collections", "detail", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query401.QueryFunction<Collection, readonly ["collections", "detail", {
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
declare function listCollectionActivitiesQueryOptions(params: ListCollectionActivitiesQueryOptions): _tanstack_react_query404.OmitKeyof<_tanstack_react_query404.UseQueryOptions<ListCollectionActivitiesReturn, Error, ListCollectionActivitiesReturn, readonly ["collections", "collectionActivities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query404.QueryFunction<ListCollectionActivitiesReturn, readonly ["collections", "collectionActivities", {
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  saleAddress: viem32.Address;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
declare function listCollectionsQueryOptions(params: ListCollectionsQueryOptions): _tanstack_react_query391.UseQueryOptions<({
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  saleAddress: viem32.Address;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  saleAddress: viem32.Address;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem32.Address;
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    saleAddress: viem32.Address;
    bannerUrl: string;
    itemsAddress: viem32.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query391.InitialDataFunction<({
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem32.Address;
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    saleAddress: viem32.Address;
    bannerUrl: string;
    itemsAddress: viem32.Address;
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
      extensions: _0xsequence_metadata96.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata96.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem32.Address;
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
      extensions: _0xsequence_metadata96.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata96.ResourceStatus;
      cardType: CardType;
      saleAddress: viem32.Address;
      bannerUrl: string;
      itemsAddress: viem32.Address;
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
}) => _tanstack_react_query391.UseQueryOptions<({
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  saleAddress: viem32.Address;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
  extensions: _0xsequence_metadata96.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata96.ResourceStatus;
  cardType: CardType;
  saleAddress: viem32.Address;
  bannerUrl: string;
  itemsAddress: viem32.Address;
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem32.Address;
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    saleAddress: viem32.Address;
    bannerUrl: string;
    itemsAddress: viem32.Address;
    filterSettings?: CollectionFilterSettings;
    sortOrder?: number;
    private: boolean;
  })[] | _tanstack_react_query391.InitialDataFunction<({
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: viem32.Address;
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
    extensions: _0xsequence_metadata96.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata96.ResourceStatus;
    cardType: CardType;
    saleAddress: viem32.Address;
    bannerUrl: string;
    itemsAddress: viem32.Address;
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
      extensions: _0xsequence_metadata96.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata96.ResourceStatus;
      cardType: CardType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: viem32.Address;
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
      extensions: _0xsequence_metadata96.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata96.ResourceStatus;
      cardType: CardType;
      saleAddress: viem32.Address;
      bannerUrl: string;
      itemsAddress: viem32.Address;
      filterSettings?: CollectionFilterSettings;
      sortOrder?: number;
      private: boolean;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectionActiveListingsCurrenciesQueryOptions, CollectionActiveOffersCurrenciesQueryOptions, CollectionBalanceDetailsQueryOptions, CollectionBalanceFilter, CollectionDetailsQueryOptions, CollectionQueryOptions, FetchCollectionActiveListingsCurrenciesParams, FetchCollectionActiveOffersCurrenciesParams, FetchCollectionBalanceDetailsParams, FetchCollectionDetailsParams, FetchCollectionParams, FetchListCollectionActivitiesParams, FetchListCollectionsParams, ListCollectionActivitiesQueryOptions, ListCollectionsQueryOptions, collectionActiveListingsCurrenciesQueryOptions as collectionActiveListingsCurrenciesQueryOptions$1, collectionActiveOffersCurrenciesQueryOptions as collectionActiveOffersCurrenciesQueryOptions$1, collectionBalanceDetailsQueryOptions as collectionBalanceDetailsQueryOptions$1, collectionDetailsQueryOptions as collectionDetailsQueryOptions$1, collectionQueryOptions as collectionQueryOptions$1, fetchCollection as fetchCollection$1, fetchCollectionActiveListingsCurrencies as fetchCollectionActiveListingsCurrencies$1, fetchCollectionActiveOffersCurrencies as fetchCollectionActiveOffersCurrencies$1, fetchCollectionBalanceDetails as fetchCollectionBalanceDetails$1, fetchCollectionDetails as fetchCollectionDetails$1, fetchListCollectionActivities as fetchListCollectionActivities$1, fetchListCollections as fetchListCollections$1, getCollectionActiveListingsCurrenciesQueryKey as getCollectionActiveListingsCurrenciesQueryKey$1, getCollectionActiveOffersCurrenciesQueryKey as getCollectionActiveOffersCurrenciesQueryKey$1, getCollectionBalanceDetailsQueryKey as getCollectionBalanceDetailsQueryKey$1, getCollectionDetailsQueryKey as getCollectionDetailsQueryKey$1, getCollectionQueryKey as getCollectionQueryKey$1, getListCollectionActivitiesQueryKey as getListCollectionActivitiesQueryKey$1, getListCollectionsQueryKey as getListCollectionsQueryKey$1, listCollectionActivitiesQueryOptions as listCollectionActivitiesQueryOptions$1, listCollectionsOptions as listCollectionsOptions$1, listCollectionsQueryOptions as listCollectionsQueryOptions$1 };
//# sourceMappingURL=listCollections-C2nKcQQn.d.ts.map