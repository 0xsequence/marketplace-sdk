import { Cn as Order, Er as Page, J as SdkInfiniteQueryParams, Jt as GetCountOfAllCollectiblesRequest, Mr as SortBy, Qt as GetCountOfOffersForCollectibleRequest, Sr as OrderSide, Vn as TokenMetadata$1, Y as SdkQueryParams, Yn as Address$1, Zt as GetCountOfListingsForCollectibleRequest, _n as ListPrimarySaleItemsRequest, an as ListCollectibleListingsResponse, ar as CollectiblesFilter, cn as ListCollectiblesResponse, dn as ListListingsForCollectibleRequest, dt as buildQueryOptions, h as CardType, hr as ListCollectibleActivitiesResponse, in as ListCollectibleActivitiesRequest, kr as PrimarySaleItemsFilter, lt as WithOptionalParams, nn as GetLowestPriceListingForCollectibleRequest, on as ListCollectibleOffersResponse, pn as ListOffersForCollectibleRequest, qn as TokenBalance$1, rn as GetPrimarySaleItemResponse, sn as ListCollectiblesRequest, tn as GetHighestPriceOfferForCollectibleRequest, tt as WithRequired, vn as ListPrimarySaleItemsResponse, xr as OrderFilter } from "./create-config.js";
import { Address } from "viem";
import * as _tanstack_react_query286 from "@tanstack/react-query";

//#region src/react/queries/collectible/balance.d.ts
interface FetchBalanceOfCollectibleParams {
  collectionAddress?: Address;
  tokenId?: bigint;
  userAddress?: Address;
  chainId?: number;
  includeMetadata?: boolean;
}
type BalanceOfCollectibleQueryOptions = SdkQueryParams<FetchBalanceOfCollectibleParams>;
/**
 * Fetches the balance of a specific collectible for a user
 *
 * @param params - Parameters for the API call
 * @returns The balance data
 */
declare function fetchBalanceOfCollectible(params: WithRequired<BalanceOfCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'userAddress' | 'config'>): Promise<TokenBalance$1>;
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
 */
declare function getBalanceOfCollectibleQueryKey(params: BalanceOfCollectibleQueryOptions): readonly ["collectible", string, {
  chainId: number | undefined;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenId: bigint | undefined;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
  } | undefined;
}];
/**
 * Creates a tanstack query options object for the balance query
 *
 * @param params - The query parameters
 * @returns Query options configuration
 */
declare function balanceOfCollectibleOptions(params: WithOptionalParams<WithRequired<BalanceOfCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'userAddress' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<TokenBalance$1, Error, TokenBalance$1, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<TokenBalance$1, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TokenBalance$1;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-activities.d.ts
type ListCollectibleActivitiesQueryOptions = SdkQueryParams<Omit<ListCollectibleActivitiesRequest, 'page'> & {
  page?: number;
  pageSize?: number;
  sort?: SortBy[];
}>;
/**
 * Fetches collectible activities from the Marketplace API
 */
declare function fetchListCollectibleActivities(params: WithRequired<ListCollectibleActivitiesQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<ListCollectibleActivitiesResponse>;
declare function getListCollectibleActivitiesQueryKey(params: ListCollectibleActivitiesQueryOptions): readonly ["collectible", "market-activities", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly page: number | undefined;
  readonly pageSize: number | undefined;
  readonly sort: SortBy[] | undefined;
}];
declare function listCollectibleActivitiesQueryOptions(params: WithOptionalParams<WithRequired<ListCollectibleActivitiesQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<ListCollectibleActivitiesResponse, Error, ListCollectibleActivitiesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<ListCollectibleActivitiesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListCollectibleActivitiesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-count.d.ts
interface FetchCountOfCollectablesParams extends GetCountOfAllCollectiblesRequest {
  filter?: CollectiblesFilter;
  side?: OrderSide;
}
type CountOfCollectablesQueryOptions = SdkQueryParams<FetchCountOfCollectablesParams>;
/**
 * Fetches count of collectibles from the marketplace API
 */
declare function fetchCountOfCollectables(params: WithRequired<CountOfCollectablesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>): Promise<number>;
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-count', { chainId, contractAddress, filter?, side? }]
 */
declare function getCountOfCollectablesQueryKey(params: CountOfCollectablesQueryOptions): readonly ["collectible", "market-count", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly filter: CollectiblesFilter | undefined;
  readonly side: OrderSide | undefined;
}];
declare function countOfCollectablesQueryOptions(params: WithOptionalParams<WithRequired<CountOfCollectablesQueryOptions, 'chainId' | 'collectionAddress' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-highest-offer.d.ts
type HighestOfferQueryOptions = SdkQueryParams<GetHighestPriceOfferForCollectibleRequest>;
/**
 * Fetches the highest offer for a collectible from the marketplace API
 */
declare function fetchHighestOffer(params: WithRequired<HighestOfferQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<Order | undefined>;
declare function getHighestOfferQueryKey(params: HighestOfferQueryOptions): readonly ["collectible", "market-highest-offer", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly filter: OrderFilter | undefined;
}];
declare function highestOfferQueryOptions(params: WithOptionalParams<WithRequired<HighestOfferQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): ReturnType<typeof buildQueryOptions<WithRequired<HighestOfferQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>, Order | undefined, readonly ['chainId', 'collectionAddress', 'tokenId', 'config']>>;
//#endregion
//#region src/react/queries/collectible/market-list.d.ts
type ListCollectiblesQueryOptions = SdkInfiniteQueryParams<ListCollectiblesRequest & {
  cardType?: CardType;
  enabled?: boolean;
}>;
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectibles(params: WithRequired<ListCollectiblesQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>, page: Page): Promise<ListCollectiblesResponse>;
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
 */
declare function getListCollectiblesQueryKey(params: ListCollectiblesQueryOptions): readonly ["collectible", "market-list", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly side: OrderSide | undefined;
  readonly filter: CollectiblesFilter | undefined;
}];
declare function listCollectiblesQueryOptions(params: WithOptionalParams<WithRequired<ListCollectiblesQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseInfiniteQueryOptions<ListCollectiblesResponse, Error, _tanstack_react_query286.InfiniteData<ListCollectiblesResponse, unknown>, readonly unknown[], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<ListCollectiblesResponse, readonly unknown[], Page> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: _tanstack_react_query286.InfiniteData<ListCollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-list-paginated.d.ts
interface FetchListCollectiblesPaginatedParams extends Omit<ListCollectiblesRequest, 'page'> {
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
}
type ListCollectiblesPaginatedQueryOptions = SdkQueryParams<FetchListCollectiblesPaginatedParams>;
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectiblesPaginated(params: WithRequired<ListCollectiblesPaginatedQueryOptions, 'chainId' | 'collectionAddress' | 'side' | 'config'>): Promise<ListCollectiblesResponse>;
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list-paginated', { chainId, contractAddress, side, filter, page }]
 */
declare function getListCollectiblesPaginatedQueryKey(params: ListCollectiblesPaginatedQueryOptions): readonly ["collectible", "market-list-paginated", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly side: OrderSide | undefined;
  readonly filter: CollectiblesFilter | undefined;
  readonly page: number | undefined;
  readonly pageSize: number | undefined;
}];
declare function listCollectiblesPaginatedQueryOptions(params: WithOptionalParams<WithRequired<ListCollectiblesPaginatedQueryOptions, 'collectionAddress' | 'chainId' | 'side' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<ListCollectiblesResponse, Error, ListCollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<ListCollectiblesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListCollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-listings.d.ts
type ListListingsForCollectibleQueryOptions = SdkQueryParams<ListListingsForCollectibleRequest>;
/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
declare function fetchListListingsForCollectible(params: WithRequired<ListListingsForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<ListCollectibleListingsResponse>;
declare function getListListingsForCollectibleQueryKey(params: ListListingsForCollectibleQueryOptions): readonly ["collectible", "market-listings", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly filter: OrderFilter | undefined;
  readonly page: Page | undefined;
}];
declare function listListingsForCollectibleQueryOptions(params: WithOptionalParams<WithRequired<ListListingsForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<ListCollectibleListingsResponse, Error, ListCollectibleListingsResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<ListCollectibleListingsResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListCollectibleListingsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-listings-count.d.ts
interface FetchCountListingsForCollectibleParams extends GetCountOfListingsForCollectibleRequest {
  filter?: OrderFilter;
}
type CountListingsForCollectibleQueryOptions = SdkQueryParams<FetchCountListingsForCollectibleParams>;
/**
 * Fetches count of listings for a collectible from the marketplace API
 */
declare function fetchCountListingsForCollectible(params: WithRequired<CountListingsForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<number>;
declare function getCountListingsForCollectibleQueryKey(params: CountListingsForCollectibleQueryOptions): readonly ["collectible", "market-listings-count", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly filter: OrderFilter | undefined;
}];
declare function countListingsForCollectibleQueryOptions(params: WithOptionalParams<WithRequired<CountListingsForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-lowest-listing.d.ts
type LowestListingQueryOptions = SdkQueryParams<GetLowestPriceListingForCollectibleRequest>;
declare function fetchLowestListing(params: WithRequired<LowestListingQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<Order | undefined>;
declare function getLowestListingQueryKey(params: LowestListingQueryOptions): readonly ["collectible", "market-lowest-listing", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly filter: OrderFilter | undefined;
}];
declare function lowestListingQueryOptions(params: WithOptionalParams<WithRequired<LowestListingQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): ReturnType<typeof buildQueryOptions<WithRequired<LowestListingQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>, Order | undefined, readonly ['chainId', 'collectionAddress', 'tokenId', 'config']>>;
//#endregion
//#region src/react/queries/collectible/market-offers.d.ts
type ListOffersForCollectibleQueryOptions = SdkQueryParams<ListOffersForCollectibleRequest & {
  sort?: Array<SortBy>;
}>;
/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
declare function fetchListOffersForCollectible(params: WithRequired<ListOffersForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<ListCollectibleOffersResponse>;
declare function getListOffersForCollectibleQueryKey(params: ListOffersForCollectibleQueryOptions): readonly ["collectible", "market-offers", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly filter: OrderFilter | undefined;
  readonly page: Page | undefined;
}];
declare function listOffersForCollectibleQueryOptions(params: WithOptionalParams<WithRequired<ListOffersForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<ListCollectibleOffersResponse, Error, ListCollectibleOffersResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<ListCollectibleOffersResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: ListCollectibleOffersResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-offers-count.d.ts
interface FetchCountOffersForCollectibleParams extends GetCountOfOffersForCollectibleRequest {
  filter?: OrderFilter;
}
type CountOffersForCollectibleQueryOptions = SdkQueryParams<FetchCountOffersForCollectibleParams>;
/**
 * Fetches count of offers for a collectible from the marketplace API
 */
declare function fetchCountOffersForCollectible(params: WithRequired<CountOffersForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<number>;
declare function getCountOffersForCollectibleQueryKey(params: CountOffersForCollectibleQueryOptions): readonly ["collectible", "market-offers-count", {
  readonly chainId: number;
  readonly collectionAddress: "" | `0x${string}`;
  readonly tokenId: bigint;
  readonly filter: OrderFilter | undefined;
}];
declare function countOffersForCollectibleQueryOptions(params: WithOptionalParams<WithRequired<CountOffersForCollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<number, Error, number, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<number, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/metadata.d.ts
interface FetchCollectibleParams {
  chainId: number;
  collectionAddress: Address$1;
  tokenId: bigint;
}
type CollectibleQueryOptions = SdkQueryParams<FetchCollectibleParams>;
/**
 * Fetches collectible metadata from the metadata API
 */
declare function fetchCollectible(params: WithRequired<CollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>): Promise<TokenMetadata$1>;
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'metadata', { chainId, contractAddress, tokenIds }]
 */
declare function getCollectibleQueryKey(params: CollectibleQueryOptions): readonly ["collectible", string, {
  chainId: number | undefined;
  contractAddress: `0x${string}` | undefined;
  tokenIds: bigint[];
}];
declare function collectibleQueryOptions(params: WithOptionalParams<WithRequired<CollectibleQueryOptions, 'chainId' | 'collectionAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<TokenMetadata$1, Error, TokenMetadata$1, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<TokenMetadata$1, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TokenMetadata$1;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/primary-sale-item.d.ts
interface FetchPrimarySaleItemParams {
  chainId: number;
  primarySaleContractAddress: string;
  tokenId: string | bigint;
}
type PrimarySaleItemQueryOptions = SdkQueryParams<FetchPrimarySaleItemParams>;
/**
 * Fetches a single primary sale item from the marketplace API
 */
declare function fetchPrimarySaleItem(params: WithRequired<PrimarySaleItemQueryOptions, 'chainId' | 'primarySaleContractAddress' | 'tokenId' | 'config'>): Promise<GetPrimarySaleItemResponse>;
declare function getPrimarySaleItemQueryKey(params: PrimarySaleItemQueryOptions): readonly ["collectible", string, {
  chainId: number;
  primarySaleContractAddress: string;
  tokenId: string;
}];
declare function primarySaleItemQueryOptions(params: WithOptionalParams<WithRequired<PrimarySaleItemQueryOptions, 'chainId' | 'primarySaleContractAddress' | 'tokenId' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<GetPrimarySaleItemResponse, Error, GetPrimarySaleItemResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<GetPrimarySaleItemResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: GetPrimarySaleItemResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/primary-sale-items.d.ts
interface FetchPrimarySaleItemsParams extends Omit<ListPrimarySaleItemsRequest, 'page'> {
  filter?: PrimarySaleItemsFilter;
  page?: Page;
}
type ListPrimarySaleItemsQueryOptions = SdkInfiniteQueryParams<FetchPrimarySaleItemsParams>;
/**
 * Fetches primary sale items from the marketplace API
 */
declare function fetchPrimarySaleItems(params: WithRequired<ListPrimarySaleItemsQueryOptions, 'chainId' | 'primarySaleContractAddress' | 'config'>): Promise<ListPrimarySaleItemsResponse>;
declare function getPrimarySaleItemsQueryKey(params: ListPrimarySaleItemsQueryOptions): readonly ["collectible", "primary-sale-items", {
  readonly chainId: number;
  readonly primarySaleContractAddress: string;
  readonly filter: PrimarySaleItemsFilter | undefined;
}];
declare const primarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseInfiniteQueryOptions<ListPrimarySaleItemsResponse, Error, _tanstack_react_query286.InfiniteData<ListPrimarySaleItemsResponse, unknown>, readonly ["collectible", "primary-sale-items", {
  readonly chainId: number;
  readonly primarySaleContractAddress: string;
  readonly filter: PrimarySaleItemsFilter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<ListPrimarySaleItemsResponse, readonly ["collectible", "primary-sale-items", {
    readonly chainId: number;
    readonly primarySaleContractAddress: string;
    readonly filter: PrimarySaleItemsFilter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["collectible", "primary-sale-items", {
    readonly chainId: number;
    readonly primarySaleContractAddress: string;
    readonly filter: PrimarySaleItemsFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query286.InfiniteData<ListPrimarySaleItemsResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/token-balances.d.ts
interface FetchTokenBalancesParams {
  collectionAddress: Address;
  userAddress: Address;
  chainId: number;
  includeMetadata?: boolean;
}
type TokenBalancesQueryOptions = SdkQueryParams<FetchTokenBalancesParams>;
/**
 * Fetches the token balances for a user
 *
 * @param params - Parameters for the API call
 * @returns The balance data
 */
declare function fetchTokenBalances(params: WithRequired<TokenBalancesQueryOptions, 'chainId' | 'collectionAddress' | 'userAddress' | 'config'>): Promise<TokenBalance$1[]>;
declare function getTokenBalancesQueryKey(params: TokenBalancesQueryOptions): readonly ["collectible", string, {
  chainId: number | undefined;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
  } | undefined;
}];
/**
 * Creates a tanstack query options object for the token balances query
 *
 * @param params - The query parameters
 * @returns Query options configuration
 */
declare function tokenBalancesOptions(params: WithOptionalParams<WithRequired<TokenBalancesQueryOptions, 'chainId' | 'collectionAddress' | 'userAddress' | 'config'>>): _tanstack_react_query286.OmitKeyof<_tanstack_react_query286.UseQueryOptions<TokenBalance$1[], Error, TokenBalance$1[], readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query286.QueryFunction<TokenBalance$1[], readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: TokenBalance$1[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { fetchHighestOffer as $, LowestListingQueryOptions as A, fetchListListingsForCollectible as B, countOffersForCollectibleQueryOptions as C, fetchListOffersForCollectible as D, ListOffersForCollectibleQueryOptions as E, FetchCountListingsForCollectibleParams as F, fetchListCollectiblesPaginated as G, listListingsForCollectibleQueryOptions as H, countListingsForCollectibleQueryOptions as I, ListCollectiblesQueryOptions as J, getListCollectiblesPaginatedQueryKey as K, fetchCountListingsForCollectible as L, getLowestListingQueryKey as M, lowestListingQueryOptions as N, getListOffersForCollectibleQueryKey as O, CountListingsForCollectibleQueryOptions as P, HighestOfferQueryOptions as Q, getCountListingsForCollectibleQueryKey as R, FetchCountOffersForCollectibleParams as S, getCountOffersForCollectibleQueryKey as T, FetchListCollectiblesPaginatedParams as U, getListListingsForCollectibleQueryKey as V, ListCollectiblesPaginatedQueryOptions as W, getListCollectiblesQueryKey as X, fetchListCollectibles as Y, listCollectiblesQueryOptions as Z, FetchCollectibleParams as _, tokenBalancesOptions as a, fetchCountOfCollectables as at, getCollectibleQueryKey as b, fetchPrimarySaleItems as c, fetchListCollectibleActivities as ct, FetchPrimarySaleItemParams as d, BalanceOfCollectibleQueryOptions as dt, getHighestOfferQueryKey as et, PrimarySaleItemQueryOptions as f, FetchBalanceOfCollectibleParams as ft, CollectibleQueryOptions as g, primarySaleItemQueryOptions as h, getBalanceOfCollectibleQueryKey as ht, getTokenBalancesQueryKey as i, countOfCollectablesQueryOptions as it, fetchLowestListing as j, listOffersForCollectibleQueryOptions as k, getPrimarySaleItemsQueryKey as l, getListCollectibleActivitiesQueryKey as lt, getPrimarySaleItemQueryKey as m, fetchBalanceOfCollectible as mt, TokenBalancesQueryOptions as n, CountOfCollectablesQueryOptions as nt, FetchPrimarySaleItemsParams as o, getCountOfCollectablesQueryKey as ot, fetchPrimarySaleItem as p, balanceOfCollectibleOptions as pt, listCollectiblesPaginatedQueryOptions as q, fetchTokenBalances as r, FetchCountOfCollectablesParams as rt, ListPrimarySaleItemsQueryOptions as s, ListCollectibleActivitiesQueryOptions as st, FetchTokenBalancesParams as t, highestOfferQueryOptions as tt, primarySaleItemsQueryOptions as u, listCollectibleActivitiesQueryOptions as ut, collectibleQueryOptions as v, fetchCountOffersForCollectible as w, CountOffersForCollectibleQueryOptions as x, fetchCollectible as y, ListListingsForCollectibleQueryOptions as z };
//# sourceMappingURL=token-balances.d.ts.map