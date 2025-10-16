import { CardType, CollectiblesFilter, ListCollectibleActivitiesArgs, ListCollectibleActivitiesReturn, ListCollectiblesArgs, ListCollectiblesReturn, OrderSide, Page, SdkConfig, SortBy, ValuesOptional } from "./create-config-BpPJGqAC.js";
import { StandardInfiniteQueryOptions, StandardQueryOptions } from "./query-BG-MA1MB.js";
import * as _tanstack_react_query268 from "@tanstack/react-query";
import * as _tanstack_react_query276 from "@tanstack/react-query";
import * as _tanstack_react_query297 from "@tanstack/react-query";
import * as _tanstack_react_query328 from "@tanstack/react-query";
import * as _tanstack_react_query331 from "@tanstack/react-query";
import * as _tanstack_react_query336 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_indexer5 from "@0xsequence/indexer";
import * as _0xsequence_metadata81 from "@0xsequence/metadata";
import { GetTokenMetadataArgs } from "@0xsequence/metadata";
import { Address } from "viem";

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
}, config: SdkConfig): Promise<_0xsequence_indexer5.TokenBalance>;
/**
 * Creates a tanstack query options object for the balance query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function balanceOfCollectibleOptions(args: UseBalanceOfCollectibleArgs, config: SdkConfig): _tanstack_react_query268.UseQueryOptions<_0xsequence_indexer5.TokenBalance, Error, _0xsequence_indexer5.TokenBalance, ("details" | "collectable" | UseBalanceOfCollectibleArgs | "userBalances")[]> & {
  initialData?: _0xsequence_indexer5.TokenBalance | _tanstack_react_query268.InitialDataFunction<_0xsequence_indexer5.TokenBalance> | undefined;
} & {
  queryKey: ("details" | "collectable" | UseBalanceOfCollectibleArgs | "userBalances")[] & {
    [dataTagSymbol]: _0xsequence_indexer5.TokenBalance;
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
declare function fetchCollectible(params: FetchCollectibleParams): Promise<_0xsequence_metadata81.TokenMetadata>;
type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function collectibleQueryOptions(params: CollectibleQueryOptions): _tanstack_react_query276.OmitKeyof<_tanstack_react_query276.UseQueryOptions<_0xsequence_metadata81.TokenMetadata, Error, _0xsequence_metadata81.TokenMetadata, ("details" | "collectable" | CollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query276.QueryFunction<_0xsequence_metadata81.TokenMetadata, ("details" | "collectable" | CollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("details" | "collectable" | CollectibleQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata81.TokenMetadata;
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
declare function countOfCollectablesQueryOptions(params: CountOfCollectablesQueryOptions): _tanstack_react_query297.OmitKeyof<_tanstack_react_query297.UseQueryOptions<number, Error, number, ("collectable" | "counts" | CountOfCollectablesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query297.QueryFunction<number, ("collectable" | "counts" | CountOfCollectablesQueryOptions)[], never> | undefined;
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
declare function listCollectibleActivitiesQueryOptions(params: ListCollectibleActivitiesQueryOptions): _tanstack_react_query328.OmitKeyof<_tanstack_react_query328.UseQueryOptions<ListCollectibleActivitiesReturn, Error, ListCollectibleActivitiesReturn, ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query328.QueryFunction<ListCollectibleActivitiesReturn, ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[], never> | undefined;
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
declare function fetchListCollectibles(params: FetchListCollectiblesParams, page: Page): Promise<ListCollectiblesReturn>;
type ListCollectiblesQueryOptions = ValuesOptional<FetchListCollectiblesParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function listCollectiblesQueryOptions(params: ListCollectiblesQueryOptions): _tanstack_react_query331.OmitKeyof<_tanstack_react_query331.UseInfiniteQueryOptions<ListCollectiblesReturn, Error, _tanstack_react_query331.InfiniteData<ListCollectiblesReturn, unknown>, ("collectable" | "list" | ListCollectiblesQueryOptions)[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query331.QueryFunction<ListCollectiblesReturn, ("collectable" | "list" | ListCollectiblesQueryOptions)[], Page> | undefined;
} & {
  queryKey: ("collectable" | "list" | ListCollectiblesQueryOptions)[] & {
    [dataTagSymbol]: _tanstack_react_query331.InfiniteData<ListCollectiblesReturn, unknown>;
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
declare function listCollectiblesPaginatedQueryOptions(params: ListCollectiblesPaginatedQueryOptions): _tanstack_react_query336.OmitKeyof<_tanstack_react_query336.UseQueryOptions<ListCollectiblesReturn, Error, ListCollectiblesReturn, (string | ListCollectiblesPaginatedQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query336.QueryFunction<ListCollectiblesReturn, (string | ListCollectiblesPaginatedQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ListCollectiblesPaginatedQueryOptions)[] & {
    [dataTagSymbol]: ListCollectiblesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CollectibleQueryOptions, CountOfCollectablesQueryOptions, FetchCollectibleParams, FetchCountOfCollectablesParams, FetchListCollectibleActivitiesParams, FetchListCollectiblesPaginatedParams, FetchListCollectiblesParams, ListCollectibleActivitiesQueryOptions, ListCollectiblesPaginatedQueryOptions, ListCollectiblesQueryOptions, UseBalanceOfCollectibleArgs, balanceOfCollectibleOptions as balanceOfCollectibleOptions$1, collectibleQueryOptions as collectibleQueryOptions$1, countOfCollectablesQueryOptions as countOfCollectablesQueryOptions$1, fetchBalanceOfCollectible as fetchBalanceOfCollectible$1, fetchCollectible as fetchCollectible$1, fetchCountOfCollectables as fetchCountOfCollectables$1, fetchListCollectibleActivities as fetchListCollectibleActivities$1, fetchListCollectibles as fetchListCollectibles$1, fetchListCollectiblesPaginated as fetchListCollectiblesPaginated$1, listCollectibleActivitiesQueryOptions as listCollectibleActivitiesQueryOptions$1, listCollectiblesPaginatedQueryOptions as listCollectiblesPaginatedQueryOptions$1, listCollectiblesQueryOptions as listCollectiblesQueryOptions$1 };
//# sourceMappingURL=listCollectiblesPaginated-C4qjwk5o.d.ts.map