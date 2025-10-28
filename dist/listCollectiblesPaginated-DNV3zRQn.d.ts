import { $ as SdkConfig, Ar as ListCollectiblesArgs, Mi as SortBy, Tr as ListCollectibleActivitiesReturn, et as CardType, jr as ListCollectiblesReturn, mi as Page$1, ui as OrderSide, wr as ListCollectibleActivitiesArgs, z as ValuesOptional, zt as CollectiblesFilter } from "./create-config-nZqvb8A7.js";
import { n as StandardQueryOptions, t as StandardInfiniteQueryOptions } from "./query-D8sokOq-.js";
import * as _tanstack_react_query397 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_metadata135 from "@0xsequence/metadata";
import { GetTokenMetadataArgs } from "@0xsequence/metadata";
import { Address } from "viem";
import * as xtrails0 from "xtrails";

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
}, config: SdkConfig): Promise<xtrails0.TokenBalance>;
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
declare function balanceOfCollectibleOptions(args: UseBalanceOfCollectibleArgs, config: SdkConfig): _tanstack_react_query397.UseQueryOptions<xtrails0.TokenBalance, Error, xtrails0.TokenBalance, readonly ["collectable", "collectable", "details", "userBalances", {
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
  initialData?: xtrails0.TokenBalance | _tanstack_react_query397.InitialDataFunction<xtrails0.TokenBalance> | undefined;
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
    [dataTagSymbol]: xtrails0.TokenBalance;
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
declare function fetchCollectible(params: FetchCollectibleParams): Promise<_0xsequence_metadata135.TokenMetadata>;
type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getCollectibleQueryKey(params: CollectibleQueryOptions): readonly ["collectable", "details", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[];
}];
declare function collectibleQueryOptions(params: CollectibleQueryOptions): _tanstack_react_query397.OmitKeyof<_tanstack_react_query397.UseQueryOptions<_0xsequence_metadata135.TokenMetadata, Error, _0xsequence_metadata135.TokenMetadata, readonly ["collectable", "details", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[];
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query397.QueryFunction<_0xsequence_metadata135.TokenMetadata, readonly ["collectable", "details", {
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
    [dataTagSymbol]: _0xsequence_metadata135.TokenMetadata;
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
declare function countOfCollectablesQueryOptions(params: CountOfCollectablesQueryOptions): _tanstack_react_query397.OmitKeyof<_tanstack_react_query397.UseQueryOptions<number, Error, number, readonly ["collectable", "counts", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query397.QueryFunction<number, readonly ["collectable", "counts", {
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
declare function listCollectibleActivitiesQueryOptions(params: ListCollectibleActivitiesQueryOptions): _tanstack_react_query397.OmitKeyof<_tanstack_react_query397.UseQueryOptions<ListCollectibleActivitiesReturn, Error, ListCollectibleActivitiesReturn, readonly ["collectable", "collectibleActivities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query397.QueryFunction<ListCollectibleActivitiesReturn, readonly ["collectable", "collectibleActivities", {
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
declare function fetchListCollectibles(params: FetchListCollectiblesParams, page: Page$1): Promise<ListCollectiblesReturn>;
type ListCollectiblesQueryOptions = ValuesOptional<FetchListCollectiblesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function getListCollectiblesQueryKey(params: ListCollectiblesQueryOptions): readonly ["collectable", "list", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
}];
declare function listCollectiblesQueryOptions(params: ListCollectiblesQueryOptions): _tanstack_react_query397.OmitKeyof<_tanstack_react_query397.UseInfiniteQueryOptions<ListCollectiblesReturn, Error, _tanstack_react_query397.InfiniteData<ListCollectiblesReturn, unknown>, readonly ["collectable", "list", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
}], Page$1>, "queryFn"> & {
  queryFn?: _tanstack_react_query397.QueryFunction<ListCollectiblesReturn, readonly ["collectable", "list", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
  }], Page$1> | undefined;
} & {
  queryKey: readonly ["collectable", "list", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query397.InfiniteData<ListCollectiblesReturn, unknown>;
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
declare function listCollectiblesPaginatedQueryOptions(params: ListCollectiblesPaginatedQueryOptions): _tanstack_react_query397.OmitKeyof<_tanstack_react_query397.UseQueryOptions<ListCollectiblesReturn, Error, ListCollectiblesReturn, readonly ["collectable", "list", "paginated", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
  page: {
    page: number;
    pageSize: number;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query397.QueryFunction<ListCollectiblesReturn, readonly ["collectable", "list", "paginated", {
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
export { collectibleQueryOptions as C, balanceOfCollectibleOptions as D, UseBalanceOfCollectibleArgs as E, fetchBalanceOfCollectible as O, FetchCollectibleParams as S, getCollectibleQueryKey as T, FetchCountOfCollectablesParams as _, listCollectiblesPaginatedQueryOptions as a, getCountOfCollectablesQueryKey as b, fetchListCollectibles as c, FetchListCollectibleActivitiesParams as d, ListCollectibleActivitiesQueryOptions as f, CountOfCollectablesQueryOptions as g, listCollectibleActivitiesQueryOptions as h, getListCollectiblesPaginatedQueryKey as i, getBalanceOfCollectibleQueryKey as k, getListCollectiblesQueryKey as l, getListCollectibleActivitiesQueryKey as m, ListCollectiblesPaginatedQueryOptions as n, FetchListCollectiblesParams as o, fetchListCollectibleActivities as p, fetchListCollectiblesPaginated as r, ListCollectiblesQueryOptions as s, FetchListCollectiblesPaginatedParams as t, listCollectiblesQueryOptions as u, countOfCollectablesQueryOptions as v, fetchCollectible as w, CollectibleQueryOptions as x, fetchCountOfCollectables as y };
//# sourceMappingURL=listCollectiblesPaginated-DNV3zRQn.d.ts.map