import { CollectibleOrder, Collection, CollectionFilterSettings, ContractType, Currency, CurrencyStatus, GetCollectibleHighestOfferArgs, GetCollectibleLowestListingArgs, GetCollectibleLowestListingReturn, GetCollectionDetailArgs, GetCountOfPrimarySaleItemsArgs, GetFloorOrderArgs, ListCollectiblesArgs, ListCollectiblesReturn, MarketplaceConfig, MarketplaceType, Order, OrderbookKind, Page, PrimarySaleItemsFilter, SdkConfig } from "./new-marketplace-types-Cggo50UM.js";
import { ValuesOptional } from "./index-BA8xVqOy.js";
import * as _tanstack_react_query33 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_indexer30 from "@0xsequence/indexer";
import { ContractInfo, GetTokenBalancesReturn, GetTokenSuppliesArgs, Page as Page$1 } from "@0xsequence/indexer";
import * as _0xsequence_metadata38 from "@0xsequence/metadata";
import { GetTokenMetadataArgs } from "@0xsequence/metadata";
import { Address, Hex } from "viem";

//#region src/react/queries/balanceOfCollectible.d.ts
type UseBalanceOfCollectibleArgs = {
  collectionAddress: Address;
  collectableId: string;
  userAddress: Address | undefined;
  chainId: number;
  isLaos721?: boolean;
  query?: UseQueryParameters;
};
/**
 * Fetches the balance of a specific collectible for a user
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The balance data
 */
declare function fetchBalanceOfCollectible(args: Omit<UseBalanceOfCollectibleArgs, 'userAddress'> & {
  userAddress: Address;
}, config: SdkConfig): Promise<_0xsequence_indexer30.TokenBalance>;
/**
 * Creates a tanstack query options object for the balance query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function balanceOfCollectibleOptions(args: UseBalanceOfCollectibleArgs, config: SdkConfig): _tanstack_react_query33.UseQueryOptions<_0xsequence_indexer30.TokenBalance, Error, _0xsequence_indexer30.TokenBalance, (UseBalanceOfCollectibleArgs | "collectable" | "details" | "userBalances")[]> & {
  initialData?: _0xsequence_indexer30.TokenBalance | _tanstack_react_query33.InitialDataFunction<_0xsequence_indexer30.TokenBalance> | undefined;
} & {
  queryKey: (UseBalanceOfCollectibleArgs | "collectable" | "details" | "userBalances")[] & {
    [dataTagSymbol]: _0xsequence_indexer30.TokenBalance;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/types/query.d.ts
/**
 * Standard query options that can be used across all marketplace SDK hooks
 *
 * Based on TanStack Query v5 UseQueryOptions, but simplified, the type from TanStack is hard to modify
 */
interface StandardQueryOptions<TError = Error> {
  /** Whether the query should be enabled/disabled */
  enabled?: boolean;
  /** Time in milliseconds that  data is considered fresh */
  staleTime?: number;
  gcTime?: number;
  refetchInterval?: number | false | ((query: any) => number | false);
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: TError) => number);
  suspense?: boolean;
}
/**
 * Standard infinite query options that can be used across all marketplace SDK hooks
 * that support infinite pagination
 */
interface StandardInfiniteQueryOptions<TError = Error> extends StandardQueryOptions<TError> {
  /** Maximum number of pages to fetch */
  maxPages?: number;
}
//#endregion
//#region src/react/queries/collectible.d.ts
interface FetchCollectibleParams extends Omit<GetTokenMetadataArgs, 'chainID' | 'contractAddress' | 'tokenIDs'> {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  config: SdkConfig;
}
/**
 * Fetches collectible metadata from the metadata API
 */
declare function fetchCollectible(params: FetchCollectibleParams): Promise<_0xsequence_metadata38.TokenMetadata>;
type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function collectibleQueryOptions(params: CollectibleQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<_0xsequence_metadata38.TokenMetadata, Error, _0xsequence_metadata38.TokenMetadata, ("collectable" | "details" | CollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<_0xsequence_metadata38.TokenMetadata, ("collectable" | "details" | CollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "details" | CollectibleQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata38.TokenMetadata;
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
declare function collectionDetailsQueryOptions(params: CollectionDetailsQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<Collection, Error, Collection, ("collections" | "detail" | CollectionDetailsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<Collection, ("collections" | "detail" | CollectionDetailsQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "detail" | CollectionDetailsQueryOptions)[] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/countOfPrimarySaleItems.d.ts
interface UseCountOfPrimarySaleItemsArgs extends Omit<GetCountOfPrimarySaleItemsArgs, 'chainId' | 'primarySaleContractAddress'> {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  query?: {
    enabled?: boolean;
  };
}
declare function fetchCountOfPrimarySaleItems(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): Promise<number>;
declare function countOfPrimarySaleItemsOptions(args: UseCountOfPrimarySaleItemsArgs, config: SdkConfig): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<number, Error, number, (string | UseCountOfPrimarySaleItemsArgs)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<number, (string | UseCountOfPrimarySaleItemsArgs)[], never> | undefined;
} & {
  queryKey: (string | UseCountOfPrimarySaleItemsArgs)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/currency.d.ts
interface FetchCurrencyParams {
  chainId: number;
  currencyAddress: Address;
  config: SdkConfig;
}
/**
 * Fetches currency details from the marketplace API
 */
declare function fetchCurrency(params: FetchCurrencyParams): Promise<Currency | undefined>;
type CurrencyQueryOptions = ValuesOptional<FetchCurrencyParams> & {
  query?: StandardQueryOptions;
};
declare function currencyQueryOptions(params: CurrencyQueryOptions): _tanstack_react_query33.UseQueryOptions<Currency | undefined, Error, Currency | undefined, ("details" | "currencies" | CurrencyQueryOptions)[]> & {
  initialData?: Currency | _tanstack_react_query33.InitialDataFunction<Currency> | undefined;
} & {
  queryKey: ("details" | "currencies" | CurrencyQueryOptions)[] & {
    [dataTagSymbol]: Currency | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/floorOrder.d.ts
interface FetchFloorOrderParams extends Omit<GetFloorOrderArgs, 'contractAddress' | 'chainId'> {
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
declare function floorOrderQueryOptions(params: FloorOrderQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<CollectibleOrder, Error, CollectibleOrder, ("collectable" | "floorOrders" | FloorOrderQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<CollectibleOrder, ("collectable" | "floorOrders" | FloorOrderQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "floorOrders" | FloorOrderQueryOptions)[] & {
    [dataTagSymbol]: CollectibleOrder;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/highestOffer.d.ts
interface FetchHighestOfferParams extends Omit<GetCollectibleHighestOfferArgs, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the highest offer for a collectible from the marketplace API
 */
declare function fetchHighestOffer(params: FetchHighestOfferParams): Promise<Order | null>;
type HighestOfferQueryOptions = ValuesOptional<FetchHighestOfferParams> & {
  query?: StandardQueryOptions;
};
declare function highestOfferQueryOptions(params: HighestOfferQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<Order | null, Error, Order | null, ("collectable" | "details" | "highestOffers" | HighestOfferQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<Order | null, ("collectable" | "details" | "highestOffers" | HighestOfferQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "details" | "highestOffers" | HighestOfferQueryOptions)[] & {
    [dataTagSymbol]: Order | null;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/inventory.d.ts
interface UseInventoryArgs {
  accountAddress: Address;
  collectionAddress: Address;
  chainId: number;
  isLaos721?: boolean;
  query?: {
    enabled?: boolean;
  };
}
declare const clearInventoryState: () => void;
interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
  isLaos721: boolean;
}
interface CollectibleWithBalance extends CollectibleOrder {
  balance: string;
  contractInfo?: ContractInfo;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
}
interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: Page;
}
declare function fetchInventory(args: GetInventoryArgs, config: SdkConfig, page: Page): Promise<CollectiblesResponse>;
declare function inventoryOptions(args: UseInventoryArgs, config: SdkConfig): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseInfiniteQueryOptions<CollectiblesResponse, Error, _tanstack_react_query33.InfiniteData<CollectiblesResponse, unknown>, (string | number)[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<CollectiblesResponse, (string | number)[], Page> | undefined;
} & {
  queryKey: (string | number)[] & {
    [dataTagSymbol]: _tanstack_react_query33.InfiniteData<CollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listBalances.d.ts
type UseListBalancesArgs = {
  chainId: number;
  accountAddress?: Address;
  contractAddress?: Address;
  tokenId?: string;
  includeMetadata?: boolean;
  metadataOptions?: {
    verifiedOnly?: boolean;
    unverifiedOnly?: boolean;
    includeContracts?: Hex[];
  };
  includeCollectionTokens?: boolean;
  page?: Page$1;
  isLaos721?: boolean;
  query?: {
    enabled?: boolean;
  };
};
declare function fetchBalances(args: UseListBalancesArgs, config: SdkConfig, page: Page$1): Promise<GetTokenBalancesReturn>;
/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function listBalancesOptions(args: UseListBalancesArgs, config: SdkConfig): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseInfiniteQueryOptions<GetTokenBalancesReturn, Error, _tanstack_react_query33.InfiniteData<GetTokenBalancesReturn, unknown>, (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[], any>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<GetTokenBalancesReturn, (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[], any> | undefined;
} & {
  queryKey: (SdkConfig | UseListBalancesArgs | "balances" | "tokenBalances")[] & {
    [dataTagSymbol]: _tanstack_react_query33.InfiniteData<GetTokenBalancesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollectibles.d.ts
interface FetchListCollectiblesParams extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: Address;
  isLaos721?: boolean;
  marketplaceType?: MarketplaceType;
  config: SdkConfig;
}
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectibles(params: FetchListCollectiblesParams, marketplaceConfig: MarketplaceConfig, page: Page): Promise<ListCollectiblesReturn>;
type ListCollectiblesQueryOptions = ValuesOptional<FetchListCollectiblesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function listCollectiblesQueryOptions(params: ListCollectiblesQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseInfiniteQueryOptions<ListCollectiblesReturn, Error, _tanstack_react_query33.InfiniteData<ListCollectiblesReturn, unknown>, ("collectable" | "list" | ListCollectiblesQueryOptions)[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<ListCollectiblesReturn, ("collectable" | "list" | ListCollectiblesQueryOptions)[], Page> | undefined;
} & {
  queryKey: ("collectable" | "list" | ListCollectiblesQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query33.InfiniteData<ListCollectiblesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollections.d.ts
interface FetchListCollectionsParams {
  marketplaceType?: MarketplaceType;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  saleAddress: string;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
})[]>;
type ListCollectionsQueryOptions = ValuesOptional<FetchListCollectionsParams> & {
  query?: StandardQueryOptions;
};
declare function listCollectionsQueryOptions(params: ListCollectionsQueryOptions): _tanstack_react_query33.UseQueryOptions<({
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  saleAddress: string;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  saleAddress: string;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    saleAddress: string;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
  })[] | _tanstack_react_query33.InitialDataFunction<({
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    saleAddress: string;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
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
      extensions: _0xsequence_metadata38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata38.ResourceStatus;
      marketplaceType: MarketplaceType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: string;
      filterSettings?: CollectionFilterSettings;
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
      extensions: _0xsequence_metadata38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata38.ResourceStatus;
      marketplaceType: MarketplaceType;
      saleAddress: string;
      bannerUrl: string;
      itemsAddress: string;
      filterSettings?: CollectionFilterSettings;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
declare const listCollectionsOptions: ({
  marketplaceType,
  marketplaceConfig,
  config
}: {
  marketplaceType?: MarketplaceType;
  marketplaceConfig: MarketplaceConfig | undefined;
  config: SdkConfig;
}) => _tanstack_react_query33.UseQueryOptions<({
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  saleAddress: string;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
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
  extensions: _0xsequence_metadata38.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata38.ResourceStatus;
  marketplaceType: MarketplaceType;
  saleAddress: string;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
})[], ("collections" | "list" | {
  marketplaceType: MarketplaceType | undefined;
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    saleAddress: string;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
  })[] | _tanstack_react_query33.InitialDataFunction<({
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    contractType: ContractType;
    feePercentage: number;
    destinationMarketplace: OrderbookKind;
    currencyOptions: Array<string>;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
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
    extensions: _0xsequence_metadata38.ContractInfoExtensions;
    updatedAt: string;
    queuedAt?: string;
    status: _0xsequence_metadata38.ResourceStatus;
    marketplaceType: MarketplaceType;
    saleAddress: string;
    bannerUrl: string;
    itemsAddress: string;
    filterSettings?: CollectionFilterSettings;
  })[]> | undefined;
} & {
  queryKey: ("collections" | "list" | {
    marketplaceType: MarketplaceType | undefined;
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
      extensions: _0xsequence_metadata38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata38.ResourceStatus;
      marketplaceType: MarketplaceType;
      contractType: ContractType;
      feePercentage: number;
      destinationMarketplace: OrderbookKind;
      currencyOptions: Array<string>;
      bannerUrl: string;
      itemsAddress: string;
      filterSettings?: CollectionFilterSettings;
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
      extensions: _0xsequence_metadata38.ContractInfoExtensions;
      updatedAt: string;
      queuedAt?: string;
      status: _0xsequence_metadata38.ResourceStatus;
      marketplaceType: MarketplaceType;
      saleAddress: string;
      bannerUrl: string;
      itemsAddress: string;
      filterSettings?: CollectionFilterSettings;
    })[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listTokenMetadata.d.ts
interface FetchListTokenMetadataParams {
  chainId: number;
  contractAddress: string;
  tokenIds: string[];
  config: SdkConfig;
}
/**
 * Fetches token metadata from the metadata API
 */
declare function fetchListTokenMetadata(params: FetchListTokenMetadataParams): Promise<_0xsequence_metadata38.TokenMetadata[]>;
type ListTokenMetadataQueryOptions = ValuesOptional<FetchListTokenMetadataParams> & {
  query?: StandardQueryOptions;
};
declare function listTokenMetadataQueryOptions(params: ListTokenMetadataQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<_0xsequence_metadata38.TokenMetadata[], Error, _0xsequence_metadata38.TokenMetadata[], ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<_0xsequence_metadata38.TokenMetadata[], ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[], never> | undefined;
} & {
  queryKey: ("metadata" | "tokens" | ListTokenMetadataQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata38.TokenMetadata[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/lowestListing.d.ts
interface FetchLowestListingParams extends Omit<GetCollectibleLowestListingArgs, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the lowest listing for a collectible from the marketplace API
 */
declare function fetchLowestListing(params: FetchLowestListingParams): Promise<GetCollectibleLowestListingReturn['order'] | null>;
type LowestListingQueryOptions = ValuesOptional<FetchLowestListingParams> & {
  query?: StandardQueryOptions;
};
declare function lowestListingQueryOptions(params: LowestListingQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<Order | null | undefined, Error, Order | null | undefined, ("collectable" | "details" | "lowestListings" | LowestListingQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<Order | null | undefined, ("collectable" | "details" | "lowestListings" | LowestListingQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "details" | "lowestListings" | LowestListingQueryOptions)[] & {
    [dataTagSymbol]: Order | null | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/marketCurrencies.d.ts
interface FetchMarketCurrenciesParams {
  chainId: number;
  includeNativeCurrency?: boolean;
  collectionAddress?: Address;
  config: SdkConfig;
}
/**
 * Fetches supported currencies for a marketplace
 */
declare function fetchMarketCurrencies(params: FetchMarketCurrenciesParams): Promise<{
  contractAddress: string;
  chainId: number;
  status: CurrencyStatus;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
  exchangeRate: number;
  defaultChainCurrency: boolean;
  nativeCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[]>;
type MarketCurrenciesQueryOptions = ValuesOptional<FetchMarketCurrenciesParams> & {
  query?: StandardQueryOptions;
};
declare function marketCurrenciesQueryOptions(params: MarketCurrenciesQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<{
  contractAddress: string;
  chainId: number;
  status: CurrencyStatus;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
  exchangeRate: number;
  defaultChainCurrency: boolean;
  nativeCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[], Error, {
  contractAddress: string;
  chainId: number;
  status: CurrencyStatus;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
  exchangeRate: number;
  defaultChainCurrency: boolean;
  nativeCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[], ("currencies" | "list" | MarketCurrenciesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<{
    contractAddress: string;
    chainId: number;
    status: CurrencyStatus;
    name: string;
    symbol: string;
    decimals: number;
    imageUrl: string;
    exchangeRate: number;
    defaultChainCurrency: boolean;
    nativeCurrency: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  }[], ("currencies" | "list" | MarketCurrenciesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("currencies" | "list" | MarketCurrenciesQueryOptions)[] & {
    [dataTagSymbol]: {
      contractAddress: string;
      chainId: number;
      status: CurrencyStatus;
      name: string;
      symbol: string;
      decimals: number;
      imageUrl: string;
      exchangeRate: number;
      defaultChainCurrency: boolean;
      nativeCurrency: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string;
    }[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/tokenSupplies.d.ts
interface FetchTokenSuppliesParams extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  isLaos721?: boolean;
}
/**
 * Fetches token supplies with support for both indexer and LAOS APIs
 * Uses the more efficient single-contract APIs from both services
 */
declare function fetchTokenSupplies(params: FetchTokenSuppliesParams): Promise<_0xsequence_indexer30.GetTokenSuppliesReturn>;
type TokenSuppliesQueryOptions = ValuesOptional<FetchTokenSuppliesParams> & {
  query?: StandardQueryOptions;
};
declare function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions): _tanstack_react_query33.OmitKeyof<_tanstack_react_query33.UseQueryOptions<_0xsequence_indexer30.GetTokenSuppliesReturn, Error, _0xsequence_indexer30.GetTokenSuppliesReturn, ("tokens" | "supplies" | TokenSuppliesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query33.QueryFunction<_0xsequence_indexer30.GetTokenSuppliesReturn, ("tokens" | "supplies" | TokenSuppliesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("tokens" | "supplies" | TokenSuppliesQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_indexer30.GetTokenSuppliesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectibleQueryOptions, CollectiblesResponse, CollectionDetailsQueryOptions, CurrencyQueryOptions, FetchCollectibleParams, FetchCollectionDetailsParams, FetchCurrencyParams, FetchFloorOrderParams, FetchHighestOfferParams, FetchListCollectiblesParams, FetchListCollectionsParams, FetchListTokenMetadataParams, FetchLowestListingParams, FetchMarketCurrenciesParams, FetchTokenSuppliesParams, FloorOrderQueryOptions, HighestOfferQueryOptions, ListCollectiblesQueryOptions, ListCollectionsQueryOptions, ListTokenMetadataQueryOptions, LowestListingQueryOptions, MarketCurrenciesQueryOptions, StandardInfiniteQueryOptions, StandardQueryOptions, TokenSuppliesQueryOptions, UseBalanceOfCollectibleArgs, UseCountOfPrimarySaleItemsArgs, UseInventoryArgs, UseListBalancesArgs, balanceOfCollectibleOptions, clearInventoryState, collectibleQueryOptions, collectionDetailsQueryOptions, countOfPrimarySaleItemsOptions, currencyQueryOptions, fetchBalanceOfCollectible, fetchBalances, fetchCollectible, fetchCollectionDetails, fetchCountOfPrimarySaleItems, fetchCurrency, fetchFloorOrder, fetchHighestOffer, fetchInventory, fetchListCollectibles, fetchListCollections, fetchListTokenMetadata, fetchLowestListing, fetchMarketCurrencies, fetchTokenSupplies, floorOrderQueryOptions, highestOfferQueryOptions, inventoryOptions, listBalancesOptions, listCollectiblesQueryOptions, listCollectionsOptions, listCollectionsQueryOptions, listTokenMetadataQueryOptions, lowestListingQueryOptions, marketCurrenciesQueryOptions, tokenSuppliesQueryOptions };
//# sourceMappingURL=index-9euIOML8.d.ts.map