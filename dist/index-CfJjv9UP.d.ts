import { At as ContractType, Pi as TokenMetadata$1, ai as PriceFilter, bt as CollectibleOrder, ci as PrimarySaleItem, ei as OrderbookKind, gi as PropertyFilter$1, q as CollectibleCardAction, vr as ListCollectiblesResponse, xt as CollectiblePrimarySaleItem } from "./create-config-BO68TZC5.js";
import { i as MarketCollectibleCardProps } from "./types-B9D2v5PF.js";
import * as _tanstack_react_query196 from "@tanstack/react-query";
import * as _0xsequence_indexer11 from "@0xsequence/indexer";
import { TokenMetadata } from "@0xsequence/metadata";
import * as viem2 from "viem";
import { Address } from "viem";

//#region src/react/hooks/ui/card-data/market-card-data.d.ts
interface UseMarketCardDataProps {
  collectionAddress: Address;
  chainId: number;
  orderbookKind?: OrderbookKind;
  collectionType: ContractType;
  filterOptions?: PropertyFilter$1[];
  searchText?: string;
  showListedOnly?: boolean;
  priceFilters?: PriceFilter[];
  onCollectibleClick?: (tokenId: string) => void;
  onCannotPerformAction?: (action: CollectibleCardAction) => void;
  prioritizeOwnerActions?: boolean;
  assetSrcPrefixUrl?: string;
  hideQuantitySelector?: boolean;
}
declare function useMarketCardData({
  collectionAddress,
  chainId,
  orderbookKind,
  collectionType,
  filterOptions,
  searchText,
  showListedOnly,
  priceFilters,
  onCollectibleClick,
  onCannotPerformAction,
  prioritizeOwnerActions,
  assetSrcPrefixUrl,
  hideQuantitySelector
}: UseMarketCardDataProps): {
  collectibleCards: MarketCollectibleCardProps[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: _tanstack_react_query196.FetchNextPageOptions) => Promise<_tanstack_react_query196.InfiniteQueryObserverResult<_tanstack_react_query196.InfiniteData<ListCollectiblesResponse, unknown>, Error>>;
  allCollectibles: CollectibleOrder[];
};
//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-721-card-data.d.ts
interface UsePrimarySale721CardDataProps {
  primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
}
declare function usePrimarySale721CardData({
  primarySaleItemsWithMetadata,
  chainId,
  contractAddress,
  salesContractAddress,
  enabled
}: UsePrimarySale721CardDataProps): {
  salePrice: {
    amount: string;
    currencyAddress: Address;
  } | {
    amount: string;
    currencyAddress: "0x0000000000000000000000000000000000000000";
  };
  collectibleCards: ({
    tokenId: string;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType.ERC721;
    tokenMetadata: TokenMetadata$1;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: string;
      currencyAddress: Address;
    };
    quantityInitial: string;
    quantityRemaining: string;
    quantityDecimals: number;
    saleStartsAt: string;
    saleEndsAt: string;
    cardType: "shop";
  } | {
    tokenId: string;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType.ERC721;
    tokenMetadata: TokenMetadata;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: string;
      currencyAddress: "0x0000000000000000000000000000000000000000";
    };
    quantityInitial: undefined;
    quantityRemaining: undefined;
    quantityDecimals: number;
    saleStartsAt: undefined;
    saleEndsAt: undefined;
    cardType: "shop";
  })[];
  saleDetailsError: viem2.ReadContractErrorType | null;
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | {
    remainingSupply: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
  isLoading: boolean;
  tokenSuppliesData: _tanstack_react_query196.InfiniteData<_0xsequence_indexer11.GetTokenSuppliesReturn, unknown> | undefined;
};
//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-1155-card-data.d.ts
interface UsePrimarySale1155CardDataProps {
  primarySaleItemsWithMetadata: Array<{
    metadata: TokenMetadata$1;
    primarySaleItem: PrimarySaleItem;
  }>;
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
}
declare function usePrimarySale1155CardData({
  primarySaleItemsWithMetadata,
  chainId,
  contractAddress,
  salesContractAddress,
  enabled
}: UsePrimarySale1155CardDataProps): {
  collectibleCards: {
    tokenId: string;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType.ERC1155;
    tokenMetadata: TokenMetadata$1;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: string;
      currencyAddress: Address;
    };
    quantityInitial: string;
    quantityDecimals: number;
    quantityRemaining: string;
    unlimitedSupply: boolean;
    saleStartsAt: string;
    saleEndsAt: string;
    cardType: "shop";
  }[];
  tokenMetadataError: null;
  tokenSaleDetailsError: null;
  isLoading: boolean;
};
//#endregion
export { usePrimarySale721CardData as n, useMarketCardData as r, usePrimarySale1155CardData as t };
//# sourceMappingURL=index-CfJjv9UP.d.ts.map