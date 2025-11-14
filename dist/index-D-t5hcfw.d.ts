import { Br as ListPrimarySaleItemsResponse, G as SdkConfig, K as CardType, Nr as ListOffersForCollectibleRequest, Qr as OrderSide, Un as GetCountOfPrimarySaleItemsResponse, Yr as Order, Zr as OrderFilter, _n as GetCollectibleLowestListingResponse, _r as ListCollectiblesRequest, bi as SortBy, dr as ListCollectibleActivitiesRequest, fr as ListCollectibleActivitiesResponse, gn as GetCollectibleLowestListingRequest, gr as ListCollectibleOffersResponse, j as ValuesOptional, mn as GetCollectibleHighestOfferRequest, mr as ListCollectibleListingsResponse, ni as Page$2, pr as ListCollectibleListingsRequest, ui as PrimarySaleItemsFilter, vr as ListCollectiblesResponse, wt as CollectiblesFilter } from "./create-config-BO68TZC5.js";
import { n as StandardQueryOptions, t as StandardInfiniteQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query206 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_indexer12 from "@0xsequence/indexer";
import * as _0xsequence_metadata86 from "@0xsequence/metadata";
import { GetTokenMetadataArgs } from "@0xsequence/metadata";
import { Address } from "viem";

//#region src/react/queries/collectible/balance.d.ts
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
}, config: SdkConfig): Promise<_0xsequence_indexer12.TokenBalance>;
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
 */
declare function getBalanceOfCollectibleQueryKey(args: UseBalanceOfCollectibleArgs): readonly ["collectible", "balance", {
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
declare function balanceOfCollectibleOptions(args: UseBalanceOfCollectibleArgs, config: SdkConfig): _tanstack_react_query206.UseQueryOptions<_0xsequence_indexer12.TokenBalance, Error, _0xsequence_indexer12.TokenBalance, readonly ["collectible", "balance", {
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
  initialData?: _0xsequence_indexer12.TokenBalance | _tanstack_react_query206.InitialDataFunction<_0xsequence_indexer12.TokenBalance> | undefined;
} & {
  queryKey: readonly ["collectible", "balance", {
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
    [dataTagSymbol]: _0xsequence_indexer12.TokenBalance;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-activities.d.ts
interface FetchListCollectibleActivitiesParams extends Omit<ListCollectibleActivitiesRequest, 'chainId' | 'contractAddress' | 'page'> {
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
declare function fetchListCollectibleActivities(params: FetchListCollectibleActivitiesParams): Promise<ListCollectibleActivitiesResponse>;
type ListCollectibleActivitiesQueryOptions = ValuesOptional<FetchListCollectibleActivitiesParams> & {
  query?: StandardQueryOptions;
};
declare function getListCollectibleActivitiesQueryKey(params: ListCollectibleActivitiesQueryOptions): readonly ["collectible", "market-activities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}];
declare function listCollectibleActivitiesQueryOptions(params: ListCollectibleActivitiesQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<ListCollectibleActivitiesResponse, Error, ListCollectibleActivitiesResponse, readonly ["collectible", "market-activities", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  page: {
    page: number;
    pageSize: number;
    sort: SortBy[] | undefined;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<ListCollectibleActivitiesResponse, readonly ["collectible", "market-activities", {
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
  queryKey: readonly ["collectible", "market-activities", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    page: {
      page: number;
      pageSize: number;
      sort: SortBy[] | undefined;
    } | undefined;
  }] & {
    [dataTagSymbol]: ListCollectibleActivitiesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-count.d.ts
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
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-count', { chainId, contractAddress, filter?, side? }]
 */
declare function getCountOfCollectablesQueryKey(params: CountOfCollectablesQueryOptions): readonly ["collectible", "market-count", {
  chainId: string;
  contractAddress: string | undefined;
}];
declare function countOfCollectablesQueryOptions(params: CountOfCollectablesQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<number, Error, number, readonly ["collectible", "market-count", {
  chainId: string;
  contractAddress: string | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<number, readonly ["collectible", "market-count", {
    chainId: string;
    contractAddress: string | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "market-count", {
    chainId: string;
    contractAddress: string | undefined;
  }] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-highest-offer.d.ts
interface FetchHighestOfferParams extends Omit<GetCollectibleHighestOfferRequest, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the highest offer for a collectible from the marketplace API
 */
declare function fetchHighestOffer(params: FetchHighestOfferParams): Promise<Order>;
type HighestOfferQueryOptions = ValuesOptional<FetchHighestOfferParams> & {
  query?: StandardQueryOptions;
};
declare function getHighestOfferQueryKey(params: HighestOfferQueryOptions): readonly ["collectible", "market-highest-offer", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function highestOfferQueryOptions(params: HighestOfferQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<Order, Error, Order, readonly ["collectible", "market-highest-offer", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<Order, readonly ["collectible", "market-highest-offer", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "market-highest-offer", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }] & {
    [dataTagSymbol]: Order;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-list.d.ts
interface FetchListCollectiblesParams extends Omit<ListCollectiblesRequest, 'chainId' | 'contractAddress'> {
  chainId: number;
  collectionAddress: Address;
  cardType?: CardType;
  config: SdkConfig;
  enabled?: boolean;
}
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectibles(params: FetchListCollectiblesParams, page: Page$2): Promise<ListCollectiblesResponse>;
type ListCollectiblesQueryOptions = ValuesOptional<FetchListCollectiblesParams> & {
  query?: StandardInfiniteQueryOptions;
};
/**
 * Query key structure: [resource, operation, params]
 * - resource: folder name ('collectible')
 * - operation: file name ('list')
 * @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
 */
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
 */
declare function getListCollectiblesQueryKey(params: ListCollectiblesQueryOptions): readonly ["collectible", "market-list", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
}];
declare function listCollectiblesQueryOptions(params: ListCollectiblesQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseInfiniteQueryOptions<ListCollectiblesResponse, Error, _tanstack_react_query206.InfiniteData<ListCollectiblesResponse, unknown>, readonly ["collectible", "market-list", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
}], Page$2>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<ListCollectiblesResponse, readonly ["collectible", "market-list", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
  }], Page$2> | undefined;
} & {
  queryKey: readonly ["collectible", "market-list", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query206.InfiniteData<ListCollectiblesResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-list-paginated.d.ts
interface FetchListCollectiblesPaginatedParams extends Omit<ListCollectiblesRequest, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  config: SdkConfig;
}
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectiblesPaginated(params: FetchListCollectiblesPaginatedParams): Promise<ListCollectiblesResponse>;
type ListCollectiblesPaginatedQueryOptions = ValuesOptional<FetchListCollectiblesPaginatedParams> & {
  query?: StandardQueryOptions;
};
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list-paginated', { chainId, contractAddress, side, filter, page }]
 */
declare function getListCollectiblesPaginatedQueryKey(params: ListCollectiblesPaginatedQueryOptions): readonly ["collectible", "market-list-paginated", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
  page: {
    page: number;
    pageSize: number;
  } | undefined;
}];
declare function listCollectiblesPaginatedQueryOptions(params: ListCollectiblesPaginatedQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<ListCollectiblesResponse, Error, ListCollectiblesResponse, readonly ["collectible", "market-list-paginated", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  side: OrderSide | undefined;
  filter: CollectiblesFilter | undefined;
  page: {
    page: number;
    pageSize: number;
  } | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<ListCollectiblesResponse, readonly ["collectible", "market-list-paginated", {
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
  queryKey: readonly ["collectible", "market-list-paginated", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    side: OrderSide | undefined;
    filter: CollectiblesFilter | undefined;
    page: {
      page: number;
      pageSize: number;
    } | undefined;
  }] & {
    [dataTagSymbol]: ListCollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-listings.d.ts
interface FetchListListingsForCollectibleParams extends Omit<ListCollectibleListingsRequest, 'chainId' | 'contractAddress' | 'tokenId'> {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  config: SdkConfig;
}
/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
declare function fetchListListingsForCollectible(params: FetchListListingsForCollectibleParams): Promise<ListCollectibleListingsResponse>;
type ListListingsForCollectibleQueryOptions = ValuesOptional<FetchListListingsForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getListListingsForCollectibleQueryKey(params: ListListingsForCollectibleQueryOptions): readonly ["collectible", "market-listings", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page$2 | undefined;
}];
declare function listListingsForCollectibleQueryOptions(params: ListListingsForCollectibleQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<ListCollectibleListingsResponse, Error, ListCollectibleListingsResponse, readonly ["collectible", "market-listings", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page$2 | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<ListCollectibleListingsResponse, readonly ["collectible", "market-listings", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page$2 | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "market-listings", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page$2 | undefined;
  }] & {
    [dataTagSymbol]: ListCollectibleListingsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-listings-count.d.ts
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
declare function getCountListingsForCollectibleQueryKey(params: CountListingsForCollectibleQueryOptions): readonly ["order", "listings-count", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function countListingsForCollectibleQueryOptions(params: CountListingsForCollectibleQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<number, Error, number, readonly ["order", "listings-count", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<number, readonly ["order", "listings-count", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["order", "listings-count", {
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
//#region src/react/queries/collectible/market-lowest-listing.d.ts
interface FetchLowestListingParams extends Omit<GetCollectibleLowestListingRequest, 'contractAddress' | 'chainId'> {
  collectionAddress: string;
  chainId: number;
  config: SdkConfig;
}
/**
 * Fetches the lowest listing for a collectible from the marketplace API
 */
declare function fetchLowestListing(params: FetchLowestListingParams): Promise<GetCollectibleLowestListingResponse['order'] | null>;
type LowestListingQueryOptions = ValuesOptional<FetchLowestListingParams> & {
  query?: StandardQueryOptions;
};
declare function getLowestListingQueryKey(params: LowestListingQueryOptions): readonly ["collectible", "market-lowest-listing", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function lowestListingQueryOptions(params: LowestListingQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<Order | null | undefined, Error, Order | null | undefined, readonly ["collectible", "market-lowest-listing", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<Order | null | undefined, readonly ["collectible", "market-lowest-listing", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "market-lowest-listing", {
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
//#region src/react/queries/collectible/market-offers.d.ts
interface FetchListOffersForCollectibleParams extends Omit<ListOffersForCollectibleRequest, 'chainId' | 'contractAddress' | 'tokenId'> {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  config: SdkConfig;
  sort?: Array<SortBy>;
}
/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
declare function fetchListOffersForCollectible(params: FetchListOffersForCollectibleParams): Promise<ListCollectibleOffersResponse>;
type ListOffersForCollectibleQueryOptions = ValuesOptional<FetchListOffersForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function getListOffersForCollectibleQueryKey(params: ListOffersForCollectibleQueryOptions): readonly ["collectible", "market-offers", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page$2 | undefined;
}];
declare function listOffersForCollectibleQueryOptions(params: ListOffersForCollectibleQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<ListCollectibleOffersResponse, Error, ListCollectibleOffersResponse, readonly ["collectible", "market-offers", {
  chainId: string;
  contractAddress: `0x${string}` | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
  page: Page$2 | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<ListCollectibleOffersResponse, readonly ["collectible", "market-offers", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page$2 | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "market-offers", {
    chainId: string;
    contractAddress: `0x${string}` | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
    page: Page$2 | undefined;
  }] & {
    [dataTagSymbol]: ListCollectibleOffersResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/market-offers-count.d.ts
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
declare function getCountOffersForCollectibleQueryKey(params: CountOffersForCollectibleQueryOptions): readonly ["order", "offers-count", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}];
declare function countOffersForCollectibleQueryOptions(params: CountOffersForCollectibleQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<number, Error, number, readonly ["order", "offers-count", {
  chainId: string;
  contractAddress: string | undefined;
  tokenId: string | undefined;
  filter: OrderFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<number, readonly ["order", "offers-count", {
    chainId: string;
    contractAddress: string | undefined;
    tokenId: string | undefined;
    filter: OrderFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["order", "offers-count", {
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
//#region src/react/queries/collectible/metadata.d.ts
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
/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'metadata', { chainID, contractAddress, tokenIDs }]
 */
declare function getCollectibleQueryKey(params: CollectibleQueryOptions): readonly ["collectible", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[];
}];
declare function collectibleQueryOptions(params: CollectibleQueryOptions): _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<_0xsequence_metadata86.TokenMetadata, Error, _0xsequence_metadata86.TokenMetadata, readonly ["collectible", "metadata", {
  chainID: string;
  contractAddress: string | undefined;
  tokenIDs: string[];
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<_0xsequence_metadata86.TokenMetadata, readonly ["collectible", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[];
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "metadata", {
    chainID: string;
    contractAddress: string | undefined;
    tokenIDs: string[];
  }] & {
    [dataTagSymbol]: _0xsequence_metadata86.TokenMetadata;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/primary-sale-items.d.ts
interface FetchPrimarySaleItemsParams {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  page?: Page$2;
  config: SdkConfig;
}
/**
 * Fetches primary sale items from the marketplace API
 */
declare function fetchPrimarySaleItems(params: FetchPrimarySaleItemsParams): Promise<ListPrimarySaleItemsResponse>;
type ListPrimarySaleItemsQueryOptions = ValuesOptional<FetchPrimarySaleItemsParams> & {
  query?: StandardQueryOptions;
};
declare function getPrimarySaleItemsQueryKey(params: ListPrimarySaleItemsQueryOptions): readonly ["collectible", "primary-sale-items", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}];
declare const primarySaleItemsQueryOptions: (params: ListPrimarySaleItemsQueryOptions) => _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseInfiniteQueryOptions<ListPrimarySaleItemsResponse, Error, _tanstack_react_query206.InfiniteData<ListPrimarySaleItemsResponse, unknown>, readonly ["collectible", "primary-sale-items", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}], {
  page: number;
  pageSize: number;
}>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<ListPrimarySaleItemsResponse, readonly ["collectible", "primary-sale-items", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }], {
    page: number;
    pageSize: number;
  }> | undefined;
} & {
  queryKey: readonly ["collectible", "primary-sale-items", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }] & {
    [dataTagSymbol]: _tanstack_react_query206.InfiniteData<ListPrimarySaleItemsResponse, unknown>;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/primary-sale-items-count.d.ts
interface FetchPrimarySaleItemsCountParams {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  config: SdkConfig;
}
/**
 * Fetches the count of primary sale items from the marketplace API
 */
declare function fetchPrimarySaleItemsCount(params: FetchPrimarySaleItemsCountParams): Promise<GetCountOfPrimarySaleItemsResponse>;
type PrimarySaleItemsCountQueryOptions = Partial<FetchPrimarySaleItemsCountParams> & {
  query?: StandardQueryOptions;
};
declare function getPrimarySaleItemsCountQueryKey(args: PrimarySaleItemsCountQueryOptions): readonly ["collectible", "primary-sale-items-count", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}];
declare const primarySaleItemsCountQueryOptions: (args: PrimarySaleItemsCountQueryOptions) => _tanstack_react_query206.OmitKeyof<_tanstack_react_query206.UseQueryOptions<GetCountOfPrimarySaleItemsResponse, Error, GetCountOfPrimarySaleItemsResponse, readonly ["collectible", "primary-sale-items-count", {
  chainId: string;
  primarySaleContractAddress: `0x${string}` | undefined;
  filter: PrimarySaleItemsFilter | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query206.QueryFunction<GetCountOfPrimarySaleItemsResponse, readonly ["collectible", "primary-sale-items-count", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["collectible", "primary-sale-items-count", {
    chainId: string;
    primarySaleContractAddress: `0x${string}` | undefined;
    filter: PrimarySaleItemsFilter | undefined;
  }] & {
    [dataTagSymbol]: GetCountOfPrimarySaleItemsResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/collectible/token-balances.d.ts
type UseTokenBalancesArgs = {
  collectionAddress: Address;
  userAddress: Address | undefined;
  chainId: number;
  includeMetadata?: boolean;
  query?: UseQueryParameters;
};
/**
 * Fetches the token balances for a user
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The balance data
 */
declare function fetchTokenBalances(args: Omit<UseTokenBalancesArgs, 'userAddress'> & {
  userAddress: Address;
}, config: SdkConfig): Promise<_0xsequence_indexer12.TokenBalance[]>;
declare function getTokenBalancesQueryKey(args: UseTokenBalancesArgs): readonly ["collectible", "token-balances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
}];
/**
 * Creates a tanstack query options object for the token balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function tokenBalancesOptions(args: UseTokenBalancesArgs, config: SdkConfig): _tanstack_react_query206.UseQueryOptions<_0xsequence_indexer12.TokenBalance[], Error, _0xsequence_indexer12.TokenBalance[], readonly ["collectible", "token-balances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
}]> & {
  initialData?: _0xsequence_indexer12.TokenBalance[] | _tanstack_react_query206.InitialDataFunction<_0xsequence_indexer12.TokenBalance[]> | undefined;
} & {
  queryKey: readonly ["collectible", "token-balances", {
    chainId: number;
    accountAddress: `0x${string}` | undefined;
    contractAddress: `0x${string}`;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly: boolean;
      includeContracts: `0x${string}`[];
    } | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_indexer12.TokenBalance[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { getListCollectiblesQueryKey as $, FetchLowestListingParams as A, FetchListListingsForCollectibleParams as B, fetchCountOffersForCollectible as C, fetchListOffersForCollectible as D, ListOffersForCollectibleQueryOptions as E, CountListingsForCollectibleQueryOptions as F, FetchListCollectiblesPaginatedParams as G, fetchListListingsForCollectible as H, FetchCountListingsForCollectibleParams as I, getListCollectiblesPaginatedQueryKey as J, ListCollectiblesPaginatedQueryOptions as K, countListingsForCollectibleQueryOptions as L, fetchLowestListing as M, getLowestListingQueryKey as N, getListOffersForCollectibleQueryKey as O, lowestListingQueryOptions as P, fetchListCollectibles as Q, fetchCountListingsForCollectible as R, countOffersForCollectibleQueryOptions as S, FetchListOffersForCollectibleParams as T, getListListingsForCollectibleQueryKey as U, ListListingsForCollectibleQueryOptions as V, listListingsForCollectibleQueryOptions as W, FetchListCollectiblesParams as X, listCollectiblesPaginatedQueryOptions as Y, ListCollectiblesQueryOptions as Z, collectibleQueryOptions as _, balanceOfCollectibleOptions as _t, FetchPrimarySaleItemsCountParams as a, highestOfferQueryOptions as at, CountOffersForCollectibleQueryOptions as b, getPrimarySaleItemsCountQueryKey as c, countOfCollectablesQueryOptions as ct, ListPrimarySaleItemsQueryOptions as d, FetchListCollectibleActivitiesParams as dt, listCollectiblesQueryOptions as et, fetchPrimarySaleItems as f, ListCollectibleActivitiesQueryOptions as ft, FetchCollectibleParams as g, UseBalanceOfCollectibleArgs as gt, CollectibleQueryOptions as h, listCollectibleActivitiesQueryOptions as ht, tokenBalancesOptions as i, getHighestOfferQueryKey as it, LowestListingQueryOptions as j, listOffersForCollectibleQueryOptions as k, primarySaleItemsCountQueryOptions as l, fetchCountOfCollectables as lt, primarySaleItemsQueryOptions as m, getListCollectibleActivitiesQueryKey as mt, fetchTokenBalances as n, HighestOfferQueryOptions as nt, PrimarySaleItemsCountQueryOptions as o, CountOfCollectablesQueryOptions as ot, getPrimarySaleItemsQueryKey as p, fetchListCollectibleActivities as pt, fetchListCollectiblesPaginated as q, getTokenBalancesQueryKey as r, fetchHighestOffer as rt, fetchPrimarySaleItemsCount as s, FetchCountOfCollectablesParams as st, UseTokenBalancesArgs as t, FetchHighestOfferParams as tt, FetchPrimarySaleItemsParams as u, getCountOfCollectablesQueryKey as ut, fetchCollectible as v, fetchBalanceOfCollectible as vt, getCountOffersForCollectibleQueryKey as w, FetchCountOffersForCollectibleParams as x, getCollectibleQueryKey as y, getBalanceOfCollectibleQueryKey as yt, getCountListingsForCollectibleQueryKey as z };
//# sourceMappingURL=index-D-t5hcfw.d.ts.map