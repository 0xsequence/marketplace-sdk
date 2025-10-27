import { CardType, CollectiblesFilter, ListCollectibleActivitiesArgs, ListCollectibleActivitiesReturn, ListCollectiblesArgs, ListCollectiblesReturn, OrderSide, Page as Page$1, SdkConfig, SortBy, ValuesOptional } from "./create-config-DcoJTklJ.js";
import { StandardInfiniteQueryOptions, StandardQueryOptions } from "./query-BG-MA1MB.js";
import * as _tanstack_react_query272 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_metadata86 from "@0xsequence/metadata";
import { GetTokenMetadataArgs } from "@0xsequence/metadata";
import { Address } from "viem";
import * as xtrails0 from "xtrails";

//#region src/react/queries/balanceOfCollectible.d.ts
type UseBalanceOfCollectibleArgs = {
  collectionAddress: Address;
  collectableId: string;
  userAddress: Address | undefined;
  chainId: number;
  isLaos721?: boolean;
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
/**
 * Creates a tanstack query options object for the balance query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function balanceOfCollectibleOptions(args: UseBalanceOfCollectibleArgs, config: SdkConfig): _tanstack_react_query272.UseQueryOptions<xtrails0.TokenBalance, Error, xtrails0.TokenBalance, ("collectable" | "details" | "userBalances" | UseBalanceOfCollectibleArgs)[]> & {
  initialData?: xtrails0.TokenBalance | _tanstack_react_query272.InitialDataFunction<xtrails0.TokenBalance> | undefined;
} & {
  queryKey: ("collectable" | "details" | "userBalances" | UseBalanceOfCollectibleArgs)[] & {
    [dataTagSymbol]: xtrails0.TokenBalance;
    [dataTagErrorSymbol]: Error;
  };
};
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
declare function fetchCollectible(params: FetchCollectibleParams): Promise<_0xsequence_metadata86.TokenMetadata>;
type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function collectibleQueryOptions(params: CollectibleQueryOptions): _tanstack_react_query272.OmitKeyof<_tanstack_react_query272.UseQueryOptions<_0xsequence_metadata86.TokenMetadata, Error, _0xsequence_metadata86.TokenMetadata, ("collectable" | "details" | CollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query272.QueryFunction<_0xsequence_metadata86.TokenMetadata, ("collectable" | "details" | CollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "details" | CollectibleQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata86.TokenMetadata;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/countOfCollectables.d.ts
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
declare function countOfCollectablesQueryOptions(params: CountOfCollectablesQueryOptions): _tanstack_react_query272.OmitKeyof<_tanstack_react_query272.UseQueryOptions<number, Error, number, ("collectable" | "counts" | CountOfCollectablesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query272.QueryFunction<number, ("collectable" | "counts" | CountOfCollectablesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "counts" | CountOfCollectablesQueryOptions)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollectibleActivities.d.ts
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
declare function listCollectibleActivitiesQueryOptions(params: ListCollectibleActivitiesQueryOptions): _tanstack_react_query272.OmitKeyof<_tanstack_react_query272.UseQueryOptions<ListCollectibleActivitiesReturn, Error, ListCollectibleActivitiesReturn, ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query272.QueryFunction<ListCollectibleActivitiesReturn, ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[] & {
    [dataTagSymbol]: ListCollectibleActivitiesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollectibles.d.ts
interface FetchListCollectiblesParams extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: Address;
  isLaos721?: boolean;
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
declare function listCollectiblesQueryOptions(params: ListCollectiblesQueryOptions): _tanstack_react_query272.OmitKeyof<_tanstack_react_query272.UseInfiniteQueryOptions<ListCollectiblesReturn, Error, _tanstack_react_query272.InfiniteData<ListCollectiblesReturn, unknown>, ("collectable" | "list" | ListCollectiblesQueryOptions)[], Page$1>, "queryFn"> & {
  queryFn?: _tanstack_react_query272.QueryFunction<ListCollectiblesReturn, ("collectable" | "list" | ListCollectiblesQueryOptions)[], Page$1> | undefined;
} & {
  queryKey: ("collectable" | "list" | ListCollectiblesQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query272.InfiniteData<ListCollectiblesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listCollectiblesPaginated.d.ts
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
declare function listCollectiblesPaginatedQueryOptions(params: ListCollectiblesPaginatedQueryOptions): _tanstack_react_query272.OmitKeyof<_tanstack_react_query272.UseQueryOptions<ListCollectiblesReturn, Error, ListCollectiblesReturn, (string | ListCollectiblesPaginatedQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query272.QueryFunction<ListCollectiblesReturn, (string | ListCollectiblesPaginatedQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ListCollectiblesPaginatedQueryOptions)[] & {
    [dataTagSymbol]: ListCollectiblesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectibleQueryOptions, CountOfCollectablesQueryOptions, FetchCollectibleParams, FetchCountOfCollectablesParams, FetchListCollectibleActivitiesParams, FetchListCollectiblesPaginatedParams, FetchListCollectiblesParams, ListCollectibleActivitiesQueryOptions, ListCollectiblesPaginatedQueryOptions, ListCollectiblesQueryOptions, UseBalanceOfCollectibleArgs, balanceOfCollectibleOptions, collectibleQueryOptions, countOfCollectablesQueryOptions, fetchBalanceOfCollectible, fetchCollectible, fetchCountOfCollectables, fetchListCollectibleActivities, fetchListCollectibles, fetchListCollectiblesPaginated, listCollectibleActivitiesQueryOptions, listCollectiblesPaginatedQueryOptions, listCollectiblesQueryOptions };
//# sourceMappingURL=listCollectiblesPaginated-tUNlhpxd.d.ts.map