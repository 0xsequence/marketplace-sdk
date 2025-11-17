import { $ as SdkConfig, An as GetCollectibleHighestOfferArgs, Dr as ListCollectibleListingsReturn, Er as ListCollectibleListingsArgs, Ft as CollectibleOrder, Mi as SortBy, Mn as GetCollectibleLowestListingArgs, Nn as GetCollectibleLowestListingReturn, Xr as ListOrdersWithCollectiblesArgs, Zr as ListOrdersWithCollectiblesReturn, ar as GetFloorOrderArgs, kr as ListCollectibleOffersReturn, li as OrderFilter, mi as Page, pi as OrdersFilter, qr as ListOffersForCollectibleArgs, si as Order, ui as OrderSide, z as ValuesOptional, zt as CollectiblesFilter } from "./create-config-Cws5O44a.js";
import { n as StandardQueryOptions, t as StandardInfiniteQueryOptions } from "./query-C2OTGyRy.js";
import * as _tanstack_react_query251 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/orders/countItemsOrdersForCollection.d.ts
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
declare function getCountItemsOrdersForCollectionQueryKey(params: CountItemsOrdersForCollectionQueryOptions): readonly ["collections", "collectionItemsOrdersCount", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
}];
declare function countItemsOrdersForCollectionQueryOptions(params: CountItemsOrdersForCollectionQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<number, Error, number, readonly ["collections", "collectionItemsOrdersCount", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<number, readonly ["collections", "collectionItemsOrdersCount", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "collectionItemsOrdersCount", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/countListingsForCollectible.d.ts
interface FetchCountListingsForCollectibleParams {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  config: SdkConfig;
  filter?: OrderFilter;
}
/**
 * Fetches count of listings for a collectible from the marketplace API
 */
declare function fetchCountListingsForCollectible(params: FetchCountListingsForCollectibleParams): Promise<number>;
type CountListingsForCollectibleQueryOptions = ValuesOptional<FetchCountListingsForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getCountListingsForCollectibleQueryKey(params: CountListingsForCollectibleQueryOptions): readonly ["collectable", "listingsCount", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function countListingsForCollectibleQueryOptions(params: CountListingsForCollectibleQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<number, Error, number, readonly ["collectable", "listingsCount", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<number, readonly ["collectable", "listingsCount", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "listingsCount", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/countOffersForCollectible.d.ts
interface FetchCountOffersForCollectibleParams {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  config: SdkConfig;
  filter?: OrderFilter;
}
/**
 * Fetches count of offers for a collectible from the marketplace API
 */
declare function fetchCountOffersForCollectible(params: FetchCountOffersForCollectibleParams): Promise<number>;
type CountOffersForCollectibleQueryOptions = ValuesOptional<FetchCountOffersForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getCountOffersForCollectibleQueryKey(params: CountOffersForCollectibleQueryOptions): readonly ["collectable", "offersCount", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function countOffersForCollectibleQueryOptions(params: CountOffersForCollectibleQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<number, Error, number, readonly ["collectable", "offersCount", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<number, readonly ["collectable", "offersCount", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "offersCount", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/floorOrder.d.ts
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
declare function getFloorOrderQueryKey(params: FloorOrderQueryOptions): readonly ["collectable", "floorOrders", {
  chainId: string;
  contractAddress: string | undefined;
  filter: CollectiblesFilter | undefined;
}];
declare function floorOrderQueryOptions(params: FloorOrderQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<CollectibleOrder, Error, CollectibleOrder, readonly ["collectable", "floorOrders", {
  chainId: string;
  contractAddress: string | undefined;
  filter: CollectiblesFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<CollectibleOrder, readonly ["collectable", "floorOrders", {
    chainId: string;
    contractAddress: string | undefined;
    filter: CollectiblesFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "floorOrders", {
    chainId: string;
    contractAddress: string | undefined;
    filter: CollectiblesFilter | undefined;
  }] & {
    [dataTagSymbol]: CollectibleOrder;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/getCountOfFilteredOrders.d.ts
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
declare function getCountOfFilteredOrdersQueryKey(params: GetCountOfFilteredOrdersQueryOptions): readonly ["collections", "getCountOfFilteredOrders", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}];
declare function getCountOfFilteredOrdersQueryOptions(params: GetCountOfFilteredOrdersQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<number, Error, number, readonly ["collections", "getCountOfFilteredOrders", {
  chainId: string;
  contractAddress: string | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<number, readonly ["collections", "getCountOfFilteredOrders", {
    chainId: string;
    contractAddress: string | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collections", "getCountOfFilteredOrders", {
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
//#region src/react/queries/orders/highestOffer.d.ts
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
declare function getHighestOfferQueryKey(params: HighestOfferQueryOptions): readonly ["collectable", "collectable", "details", "highestOffers", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function highestOfferQueryOptions(params: HighestOfferQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<Order | null, Error, Order | null, readonly ["collectable", "collectable", "details", "highestOffers", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<Order | null, readonly ["collectable", "collectable", "details", "highestOffers", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "collectable", "details", "highestOffers", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }] & {
    [dataTagSymbol]: Order | null;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/listItemsOrdersForCollection.d.ts
interface FetchListItemsOrdersForCollectionParams extends Omit<ListOrdersWithCollectiblesArgs, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: Address;
  config: SdkConfig;
}
declare function fetchListItemsOrdersForCollection(params: FetchListItemsOrdersForCollectionParams, page: Page): Promise<ListOrdersWithCollectiblesReturn>;
type ListItemsOrdersForCollectionQueryOptions = ValuesOptional<FetchListItemsOrdersForCollectionParams> & {
  query?: StandardInfiniteQueryOptions;
};
declare function getListItemsOrdersForCollectionQueryKey(params: ListItemsOrdersForCollectionQueryOptions): readonly ["collections", "collectionItemsOrders", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}];
declare function listItemsOrdersForCollectionQueryOptions(params: ListItemsOrdersForCollectionQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseInfiniteQueryOptions<ListOrdersWithCollectiblesReturn, Error, _tanstack_react_query251.InfiniteData<ListOrdersWithCollectiblesReturn, unknown>, readonly ["collections", "collectionItemsOrders", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: OrdersFilter | undefined;
}], Page>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<ListOrdersWithCollectiblesReturn, readonly ["collections", "collectionItemsOrders", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }], Page> | undefined;
} & {
  queryKey: readonly ["collections", "collectionItemsOrders", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: OrdersFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query251.InfiniteData<ListOrdersWithCollectiblesReturn, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/listItemsOrdersForCollectionPaginated.d.ts
interface FetchListItemsOrdersForCollectionPaginatedParams extends Omit<ListOrdersWithCollectiblesArgs, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  config: SdkConfig;
}
/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
declare function fetchListItemsOrdersForCollectionPaginated(params: FetchListItemsOrdersForCollectionPaginatedParams): Promise<ListOrdersWithCollectiblesReturn>;
type ListItemsOrdersForCollectionPaginatedQueryOptions = ValuesOptional<FetchListItemsOrdersForCollectionPaginatedParams> & {
  query?: StandardQueryOptions;
};
declare function listItemsOrdersForCollectionPaginatedQueryOptions(params: ListItemsOrdersForCollectionPaginatedQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<ListOrdersWithCollectiblesReturn, Error, ListOrdersWithCollectiblesReturn, (string | ListItemsOrdersForCollectionPaginatedQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<ListOrdersWithCollectiblesReturn, (string | ListItemsOrdersForCollectionPaginatedQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ListItemsOrdersForCollectionPaginatedQueryOptions)[] & {
    [dataTagSymbol]: ListOrdersWithCollectiblesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/listListingsForCollectible.d.ts
interface FetchListListingsForCollectibleParams extends Omit<ListCollectibleListingsArgs, 'chainId' | 'contractAddress' | 'tokenId'> {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  config: SdkConfig;
}
/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
declare function fetchListListingsForCollectible(params: FetchListListingsForCollectibleParams): Promise<ListCollectibleListingsReturn>;
type ListListingsForCollectibleQueryOptions = ValuesOptional<FetchListListingsForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getListListingsForCollectibleQueryKey(params: ListListingsForCollectibleQueryOptions): readonly ["collectable", "listings", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page | undefined;
}];
declare function listListingsForCollectibleQueryOptions(params: ListListingsForCollectibleQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<ListCollectibleListingsReturn, Error, ListCollectibleListingsReturn, readonly ["collectable", "listings", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<ListCollectibleListingsReturn, readonly ["collectable", "listings", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "listings", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page | undefined;
  }] & {
    [dataTagSymbol]: ListCollectibleListingsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/listOffersForCollectible.d.ts
interface FetchListOffersForCollectibleParams extends Omit<ListOffersForCollectibleArgs, 'chainId' | 'contractAddress' | 'tokenId'> {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  config: SdkConfig;
  sort?: Array<SortBy>;
}
/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
declare function fetchListOffersForCollectible(params: FetchListOffersForCollectibleParams): Promise<ListCollectibleOffersReturn>;
type ListOffersForCollectibleQueryOptions = ValuesOptional<FetchListOffersForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getListOffersForCollectibleQueryKey(params: ListOffersForCollectibleQueryOptions): readonly ["collectable", "offers", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page | undefined;
}];
declare function listOffersForCollectibleQueryOptions(params: ListOffersForCollectibleQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<ListCollectibleOffersReturn, Error, ListCollectibleOffersReturn, readonly ["collectable", "offers", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<ListCollectibleOffersReturn, readonly ["collectable", "offers", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "offers", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page | undefined;
  }] & {
    [dataTagSymbol]: ListCollectibleOffersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/orders/lowestListing.d.ts
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
declare function getLowestListingQueryKey(params: LowestListingQueryOptions): readonly ["collectable", "collectable", "details", "lowestListings", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function lowestListingQueryOptions(params: LowestListingQueryOptions): _tanstack_react_query251.OmitKeyof<_tanstack_react_query251.UseQueryOptions<Order | null | undefined, Error, Order | null | undefined, readonly ["collectable", "collectable", "details", "lowestListings", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query251.QueryFunction<Order | null | undefined, readonly ["collectable", "collectable", "details", "lowestListings", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectable", "collectable", "details", "lowestListings", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }] & {
    [dataTagSymbol]: Order | null | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { fetchCountItemsOrdersForCollection as $, FetchGetCountOfFilteredOrdersParams as A, CountOffersForCollectibleQueryOptions as B, getListItemsOrdersForCollectionQueryKey as C, fetchHighestOffer as D, HighestOfferQueryOptions as E, FetchFloorOrderParams as F, CountListingsForCollectibleQueryOptions as G, countOffersForCollectibleQueryOptions as H, FloorOrderQueryOptions as I, fetchCountListingsForCollectible as J, FetchCountListingsForCollectibleParams as K, fetchFloorOrder as L, fetchGetCountOfFilteredOrders as M, getCountOfFilteredOrdersQueryKey as N, getHighestOfferQueryKey as O, getCountOfFilteredOrdersQueryOptions as P, countItemsOrdersForCollectionQueryOptions as Q, floorOrderQueryOptions as R, fetchListItemsOrdersForCollection as S, FetchHighestOfferParams as T, fetchCountOffersForCollectible as U, FetchCountOffersForCollectibleParams as V, getCountOffersForCollectibleQueryKey as W, CountItemsOrdersForCollectionQueryOptions as X, getCountListingsForCollectibleQueryKey as Y, FetchCountItemsOrdersForCollectionParams as Z, ListItemsOrdersForCollectionPaginatedQueryOptions as _, lowestListingQueryOptions as a, FetchListItemsOrdersForCollectionParams as b, fetchListOffersForCollectible as c, FetchListListingsForCollectibleParams as d, getCountItemsOrdersForCollectionQueryKey as et, ListListingsForCollectibleQueryOptions as f, FetchListItemsOrdersForCollectionPaginatedParams as g, listListingsForCollectibleQueryOptions as h, getLowestListingQueryKey as i, GetCountOfFilteredOrdersQueryOptions as j, highestOfferQueryOptions as k, getListOffersForCollectibleQueryKey as l, getListListingsForCollectibleQueryKey as m, LowestListingQueryOptions as n, FetchListOffersForCollectibleParams as o, fetchListListingsForCollectible as p, countListingsForCollectibleQueryOptions as q, fetchLowestListing as r, ListOffersForCollectibleQueryOptions as s, FetchLowestListingParams as t, listOffersForCollectibleQueryOptions as u, fetchListItemsOrdersForCollectionPaginated as v, listItemsOrdersForCollectionQueryOptions as w, ListItemsOrdersForCollectionQueryOptions as x, listItemsOrdersForCollectionPaginatedQueryOptions as y, getFloorOrderQueryKey as z };
//# sourceMappingURL=lowestListing-CT7PkirJ.d.ts.map