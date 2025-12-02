import { CardType, CollectiblesFilter, ListCollectibleActivitiesArgs, ListCollectibleActivitiesReturn, ListCollectiblesArgs, ListCollectiblesReturn, OrderSide, Page, SdkConfig, SortBy, ValuesOptional } from "./create-config-CsagtMvq.js";
import { StandardInfiniteQueryOptions, StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query354 from "@tanstack/react-query";
import * as _tanstack_react_query356 from "@tanstack/react-query";
import * as _tanstack_react_query359 from "@tanstack/react-query";
import * as _tanstack_react_query362 from "@tanstack/react-query";
import * as _tanstack_react_query365 from "@tanstack/react-query";
import * as _tanstack_react_query371 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_indexer13 from "@0xsequence/indexer";
import * as _0xsequence_metadata85 from "@0xsequence/metadata";
import { GetTokenMetadataArgs } from "@0xsequence/metadata";
import { Address } from "viem";

//#region src/react/queries/collectibles/balanceOfCollectible.d.ts
type UseBalanceOfCollectibleArgs = {
  collectionAddress: Address;
  collectableId: string;
  userAddress: Address | undefined;
  chainId: number;
  includeMetadata?: boolean;
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
}, config: SdkConfig): Promise<_0xsequence_indexer13.TokenBalance>;
declare function getBalanceOfCollectibleQueryKey(args: UseBalanceOfCollectibleArgs): readonly ["collectable", "collectable", "details", "userBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  tokenID: string;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
}];
/**
 * Creates a tanstack query options object for the balance query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function balanceOfCollectibleOptions(args: UseBalanceOfCollectibleArgs, config: SdkConfig): _tanstack_react_query354.UseQueryOptions<_0xsequence_indexer13.TokenBalance, Error, _0xsequence_indexer13.TokenBalance, readonly ["collectable", "collectable", "details", "userBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  tokenID: string;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
}]> & {
  initialData?: _0xsequence_indexer13.TokenBalance | _tanstack_react_query354.InitialDataFunction<_0xsequence_indexer13.TokenBalance> | undefined;
} & {
  queryKey: readonly ["collectable", "collectable", "details", "userBalances", {
    chainId: number;
    accountAddress: `0x${string}` | undefined;
    contractAddress: `0x${string}`;
    tokenID: string;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly: boolean;
      includeContracts: `0x${string}`[];
    } | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_indexer13.TokenBalance;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectibles/collectible.d.ts
interface FetchCollectibleParams extends Omit<GetTokenMetadataArgs, 'chainID' | 'contractAddress' | 'tokenIDs'> {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  config: SdkConfig;
}
/**
 * Fetches collectible metadata from the metadata API
 */
declare function fetchCollectible(params: FetchCollectibleParams): Promise<_0xsequence_metadata85.TokenMetadata>;
type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectibleQueryKey(params: CollectibleQueryOptions): readonly ["collectable", "details", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[];
}];
declare function collectibleQueryOptions(params: CollectibleQueryOptions): _tanstack_react_query356.OmitKeyof<_tanstack_react_query356.UseQueryOptions<_0xsequence_metadata85.TokenMetadata, Error, _0xsequence_metadata85.TokenMetadata, readonly ["collectable", "details", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[];
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query356.QueryFunction<_0xsequence_metadata85.TokenMetadata, readonly ["collectable", "details", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[];
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "details", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[];
  }] & {
    [dataTagSymbol]: _0xsequence_metadata85.TokenMetadata;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectibles/countOfCollectables.d.ts
interface FetchCountOfCollectablesParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  filter?: CollectiblesFilter;
  side?: OrderSide;
}
/**
 * Fetches count of collectibles from the marketplace API
 */
declare function fetchCountOfCollectables(params: FetchCountOfCollectablesParams): Promise<number>;
type CountOfCollectablesQueryOptions = ValuesOptional<FetchCountOfCollectablesParams> & {
  query?: StandardQueryOptions;
};
declare function getCountOfCollectablesQueryKey(params: CountOfCollectablesQueryOptions): readonly ["collectable", "counts", {
  chainId: string;
  contractAddress: string | undefined;
}];
declare function countOfCollectablesQueryOptions(params: CountOfCollectablesQueryOptions): _tanstack_react_query359.OmitKeyof<_tanstack_react_query359.UseQueryOptions<number, Error, number, readonly ["collectable", "counts", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query359.QueryFunction<number, readonly ["collectable", "counts", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "counts", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectibles/listCollectibleActivities.d.ts
interface FetchListCollectibleActivitiesParams extends Omit<ListCollectibleActivitiesArgs, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  sort?: SortBy[];
  config: SdkConfig;
}
/**
 * Fetches collectible activities from the Marketplace API
 */
declare function fetchListCollectibleActivities(params: FetchListCollectibleActivitiesParams): Promise<ListCollectibleActivitiesReturn>;
type ListCollectibleActivitiesQueryOptions = ValuesOptional<FetchListCollectibleActivitiesParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectibleActivitiesQueryKey(params: ListCollectibleActivitiesQueryOptions): readonly ["collectable", "collectibleActivities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}];
declare function listCollectibleActivitiesQueryOptions(params: ListCollectibleActivitiesQueryOptions): _tanstack_react_query362.OmitKeyof<_tanstack_react_query362.UseQueryOptions<ListCollectibleActivitiesReturn, Error, ListCollectibleActivitiesReturn, readonly ["collectable", "collectibleActivities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query362.QueryFunction<ListCollectibleActivitiesReturn, readonly ["collectable", "collectibleActivities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "collectibleActivities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }] & {
    [dataTagSymbol]: ListCollectibleActivitiesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectibles/listCollectibles.d.ts
interface FetchListCollectiblesParams extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: Address;
  cardType?: CardType;
  config: SdkConfig;
  enabled?: boolean;
}
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectibles(params: FetchListCollectiblesParams, page: Page): Promise<ListCollectiblesReturn>;
type ListCollectiblesQueryOptions = ValuesOptional<FetchListCollectiblesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function getListCollectiblesQueryKey(params: ListCollectiblesQueryOptions): readonly ["collectable", "list", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
}];
declare function listCollectiblesQueryOptions(params: ListCollectiblesQueryOptions): _tanstack_react_query365.OmitKeyof<_tanstack_react_query365.UseInfiniteQueryOptions<ListCollectiblesReturn, Error, _tanstack_react_query365.InfiniteData<ListCollectiblesReturn, unknown>, readonly ["collectable", "list", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
}], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query365.QueryFunction<ListCollectiblesReturn, readonly ["collectable", "list", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
  }], Page> | undefined;
} & {
  queryKey: readonly ["collectable", "list", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query365.InfiniteData<ListCollectiblesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectibles/listCollectiblesPaginated.d.ts
interface FetchListCollectiblesPaginatedParams extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  config: SdkConfig;
}
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectiblesPaginated(params: FetchListCollectiblesPaginatedParams): Promise<ListCollectiblesReturn>;
type ListCollectiblesPaginatedQueryOptions = ValuesOptional<FetchListCollectiblesPaginatedParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectiblesPaginatedQueryKey(params: ListCollectiblesPaginatedQueryOptions): readonly ["collectable", "list", "paginated", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
  page: {
    page: number;
    pageSize: number;
  } | undefined;
}];
declare function listCollectiblesPaginatedQueryOptions(params: ListCollectiblesPaginatedQueryOptions): _tanstack_react_query371.OmitKeyof<_tanstack_react_query371.UseQueryOptions<ListCollectiblesReturn, Error, ListCollectiblesReturn, readonly ["collectable", "list", "paginated", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
  page: {
    page: number;
    pageSize: number;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query371.QueryFunction<ListCollectiblesReturn, readonly ["collectable", "list", "paginated", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
    page: {
      page: number;
      pageSize: number;
    } | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "list", "paginated", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
    page: {
      page: number;
      pageSize: number;
    } | undefined;
  }] & {
    [dataTagSymbol]: ListCollectiblesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectibleQueryOptions, CountOfCollectablesQueryOptions, FetchCollectibleParams, FetchCountOfCollectablesParams, FetchListCollectibleActivitiesParams, FetchListCollectiblesPaginatedParams, FetchListCollectiblesParams, ListCollectibleActivitiesQueryOptions, ListCollectiblesPaginatedQueryOptions, ListCollectiblesQueryOptions, UseBalanceOfCollectibleArgs, balanceOfCollectibleOptions as balanceOfCollectibleOptions$1, collectibleQueryOptions as collectibleQueryOptions$1, countOfCollectablesQueryOptions as countOfCollectablesQueryOptions$1, fetchBalanceOfCollectible as fetchBalanceOfCollectible$1, fetchCollectible as fetchCollectible$1, fetchCountOfCollectables as fetchCountOfCollectables$1, fetchListCollectibleActivities as fetchListCollectibleActivities$1, fetchListCollectibles as fetchListCollectibles$1, fetchListCollectiblesPaginated as fetchListCollectiblesPaginated$1, getBalanceOfCollectibleQueryKey as getBalanceOfCollectibleQueryKey$1, getCollectibleQueryKey as getCollectibleQueryKey$1, getCountOfCollectablesQueryKey as getCountOfCollectablesQueryKey$1, getListCollectibleActivitiesQueryKey as getListCollectibleActivitiesQueryKey$1, getListCollectiblesPaginatedQueryKey as getListCollectiblesPaginatedQueryKey$1, getListCollectiblesQueryKey as getListCollectiblesQueryKey$1, listCollectibleActivitiesQueryOptions as listCollectibleActivitiesQueryOptions$1, listCollectiblesPaginatedQueryOptions as listCollectiblesPaginatedQueryOptions$1, listCollectiblesQueryOptions as listCollectiblesQueryOptions$1 };
//# sourceMappingURL=listCollectiblesPaginated-CkYQ9Quo.d.ts.map