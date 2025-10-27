import { CollectibleOrder, GetCollectibleHighestOfferArgs, GetCollectibleLowestListingArgs, GetCollectibleLowestListingReturn, GetFloorOrderArgs, ListCollectibleListingsArgs, ListCollectibleListingsReturn, ListCollectibleOffersReturn, ListOffersForCollectibleArgs, Order, OrderFilter, SdkConfig, SortBy, ValuesOptional } from "./create-config-DcoJTklJ.js";
import { StandardQueryOptions } from "./query-BG-MA1MB.js";
import * as _tanstack_react_query295 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/countListingsForCollectible.d.ts
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
declare function countListingsForCollectibleQueryOptions(params: CountListingsForCollectibleQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<number, Error, number, ("collectable" | "listingsCount" | CountListingsForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<number, ("collectable" | "listingsCount" | CountListingsForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "listingsCount" | CountListingsForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/countOffersForCollectible.d.ts
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
declare function countOffersForCollectibleQueryOptions(params: CountOffersForCollectibleQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<number, Error, number, ("collectable" | "offersCount" | CountOffersForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<number, ("collectable" | "offersCount" | CountOffersForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "offersCount" | CountOffersForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: number;
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
declare function floorOrderQueryOptions(params: FloorOrderQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<CollectibleOrder, Error, CollectibleOrder, ("collectable" | "floorOrders" | FloorOrderQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<CollectibleOrder, ("collectable" | "floorOrders" | FloorOrderQueryOptions)[], never> | undefined;
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
declare function highestOfferQueryOptions(params: HighestOfferQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<Order | null, Error, Order | null, ("collectable" | "details" | "highestOffers" | HighestOfferQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<Order | null, ("collectable" | "details" | "highestOffers" | HighestOfferQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "details" | "highestOffers" | HighestOfferQueryOptions)[] & {
    [dataTagSymbol]: Order | null;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listListingsForCollectible.d.ts
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
declare function listListingsForCollectibleQueryOptions(params: ListListingsForCollectibleQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<ListCollectibleListingsReturn, Error, ListCollectibleListingsReturn, ("collectable" | "listings" | ListListingsForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<ListCollectibleListingsReturn, ("collectable" | "listings" | ListListingsForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "listings" | ListListingsForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: ListCollectibleListingsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/listOffersForCollectible.d.ts
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
declare function listOffersForCollectibleQueryOptions(params: ListOffersForCollectibleQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<ListCollectibleOffersReturn, Error, ListCollectibleOffersReturn, ("collectable" | "offers" | ListOffersForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<ListCollectibleOffersReturn, ("collectable" | "offers" | ListOffersForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "offers" | ListOffersForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: ListCollectibleOffersReturn;
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
declare function lowestListingQueryOptions(params: LowestListingQueryOptions): _tanstack_react_query295.OmitKeyof<_tanstack_react_query295.UseQueryOptions<Order | null | undefined, Error, Order | null | undefined, ("collectable" | "details" | "lowestListings" | LowestListingQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query295.QueryFunction<Order | null | undefined, ("collectable" | "details" | "lowestListings" | LowestListingQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "details" | "lowestListings" | LowestListingQueryOptions)[] & {
    [dataTagSymbol]: Order | null | undefined;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CountListingsForCollectibleQueryOptions, CountOffersForCollectibleQueryOptions, FetchCountListingsForCollectibleParams, FetchCountOffersForCollectibleParams, FetchFloorOrderParams, FetchHighestOfferParams, FetchListListingsForCollectibleParams, FetchListOffersForCollectibleParams, FetchLowestListingParams, FloorOrderQueryOptions, HighestOfferQueryOptions, ListListingsForCollectibleQueryOptions, ListOffersForCollectibleQueryOptions, LowestListingQueryOptions, countListingsForCollectibleQueryOptions, countOffersForCollectibleQueryOptions, fetchCountListingsForCollectible, fetchCountOffersForCollectible, fetchFloorOrder, fetchHighestOffer, fetchListListingsForCollectible, fetchListOffersForCollectible, fetchLowestListing, floorOrderQueryOptions, highestOfferQueryOptions, listListingsForCollectibleQueryOptions, listOffersForCollectibleQueryOptions, lowestListingQueryOptions };
//# sourceMappingURL=lowestListing-Dqaj8tEa.d.ts.map