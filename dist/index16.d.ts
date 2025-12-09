import { Bt as PriceFilter, J as ContractType$1, _r as OrderbookKind$1, rr as CollectibleOrder, sr as ContractType$2, xr as PropertyFilter$1, y as CollectibleCardAction } from "./create-config.js";
import { i as MarketCollectibleCardProps } from "./types.js";
import * as _0xsequence_api_client25 from "@0xsequence/api-client";
import { CollectiblePrimarySaleItem, TokenMetadata } from "@0xsequence/api-client";
import * as viem27 from "viem";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query58 from "@tanstack/react-query";

//#region src/react/hooks/ui/card-data/market-card-data.d.ts
interface UseMarketCardDataProps {
  collectionAddress: Address$1;
  chainId: number;
  orderbookKind?: OrderbookKind$1;
  collectionType: ContractType$2;
  filterOptions?: PropertyFilter$1[];
  searchText?: string;
  showListedOnly?: boolean;
  priceFilters?: PriceFilter[];
  onCollectibleClick?: (tokenId: bigint) => void;
  onCannotPerformAction?: (action: CollectibleCardAction) => void;
  prioritizeOwnerActions?: boolean;
  assetSrcPrefixUrl?: string;
  hideQuantitySelector?: boolean;
  enabled?: boolean;
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
  hideQuantitySelector,
  enabled
}: UseMarketCardDataProps): {
  collectibleCards: MarketCollectibleCardProps[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  allCollectibles: CollectibleOrder[];
};
//#endregion
//#region src/react/hooks/ui/card-data/market-card-data-paged.d.ts
/**
 * Props for the useMarketCardDataPaged hook
 */
interface UseMarketCardDataPagedProps {
  /** The collection contract address */
  collectionAddress: Address$1;
  /** The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon) */
  chainId: number;
  /** Optional orderbook kind override - used to override marketplace config for internal tests */
  orderbookKind?: OrderbookKind$1;
  /** The contract type of the collection (ERC721, ERC1155, etc.) */
  collectionType: ContractType$2;
  /** Optional property filters to apply to the collectible search */
  filterOptions?: PropertyFilter$1[];
  /** Optional search text to filter collectibles by name or metadata */
  searchText?: string;
  /** Whether to show only listed collectibles (defaults to false) */
  showListedOnly?: boolean;
  /** Optional array of account addresses to filter collectibles by owner */
  inAccounts?: Address$1[];
  /** Optional price filters to apply to the collectible search */
  priceFilters?: PriceFilter[];
  /** Optional callback function called when a collectible card is clicked */
  onCollectibleClick?: (tokenId: bigint) => void;
  /** Optional callback function called when an action cannot be performed on a collectible */
  onCannotPerformAction?: (action: CollectibleCardAction) => void;
  /** Whether to prioritize owner actions in the card UI */
  prioritizeOwnerActions?: boolean;
  /** Optional URL prefix for asset images */
  assetSrcPrefixUrl?: string;
  /** Whether to hide the quantity selector on collectible cards */
  hideQuantitySelector?: boolean;
  /** The current page number (1-indexed) */
  page: number;
  /** The number of items per page */
  pageSize: number;
  /** Whether the query should be enabled (defaults to true when collectionAddress and chainId are provided) */
  enabled?: boolean;
}
/**
 * Hook to fetch paginated market card data for a collection
 *
 * This hook fetches collectibles for a specific page from the marketplace API,
 * combines them with user balance information, and generates card props ready
 * for rendering collectible cards. Unlike `useMarketCardData`, this hook
 * fetches a single page of results rather than using infinite scrolling.
 *
 * @param props - Configuration parameters
 * @param props.collectionAddress - The collection contract address
 * @param props.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param props.orderbookKind - Optional orderbook kind override for internal tests
 * @param props.collectionType - The contract type of the collection (ERC721, ERC1155, etc.)
 * @param props.filterOptions - Optional property filters to apply to the collectible search
 * @param props.searchText - Optional search text to filter collectibles by name or metadata
 * @param props.showListedOnly - Whether to show only listed collectibles (defaults to false)
 * @param props.inAccounts - Optional array of account addresses to filter collectibles by owner
 * @param props.priceFilters - Optional price filters to apply to the collectible search
 * @param props.onCollectibleClick - Optional callback function called when a collectible card is clicked
 * @param props.onCannotPerformAction - Optional callback function called when an action cannot be performed
 * @param props.prioritizeOwnerActions - Whether to prioritize owner actions in the card UI
 * @param props.assetSrcPrefixUrl - Optional URL prefix for asset images
 * @param props.hideQuantitySelector - Whether to hide the quantity selector on collectible cards
 * @param props.page - The current page number
 * @param props.pageSize - The number of items per page
 * @param props.enabled - Whether the query should be enabled
 *
 * @returns An object containing:
 * @returns collectibleCards - Array of card props ready for rendering collectible cards
 * @returns isLoading - Whether the data is currently loading
 * @returns error - Any error that occurred during fetching
 * @returns hasMore - Whether there are more pages available after the current page
 *
 * @example
 * Basic usage with pagination:
 * ```typescript
 * const [page, setPage] = useState(1);
 * const pageSize = 20;
 *
 * const {
 *   collectibleCards,
 *   isLoading,
 *   error,
 *   hasMore
 * } = useMarketCardDataPaged({
 *   collectionAddress: '0x1234...',
 *   chainId: 137,
 *   collectionType: 'ERC721',
 *   page,
 *   pageSize
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {collectibleCards.map(card => (
 *       <CollectibleCard key={card.tokenId} {...card} />
 *     ))}
 *     {hasMore && (
 *       <button onClick={() => setPage(p => p + 1)}>Next Page</button>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * With filters and search:
 * ```typescript
 * const { collectibleCards, isLoading } = useMarketCardDataPaged({
 *   collectionAddress: '0x5678...',
 *   chainId: 1,
 *   collectionType: 'ERC1155',
 *   searchText: 'rare',
 *   showListedOnly: true,
 *   filterOptions: [
 *     { name: 'Rarity', values: ['Legendary'], type: PropertyType.STRING }
 *   ],
 *   priceFilters: [
 *     { min: '0', max: '1', currency: 'ETH' }
 *   ],
 *   page: 1,
 *   pageSize: 30,
 *   onCollectibleClick: (tokenId) => {
 *     console.log('Clicked collectible:', tokenId);
 *   }
 * });
 * ```
 *
 * @example
 * With owner filtering and custom callbacks:
 * ```typescript
 * const { collectibleCards } = useMarketCardDataPaged({
 *   collectionAddress: '0x9abc...',
 *   chainId: 137,
 *   collectionType: 'ERC721',
 *   inAccounts: ['0xowner1...', '0xowner2...'],
 *   prioritizeOwnerActions: true,
 *   onCannotPerformAction: (action) => {
 *     console.warn(`Cannot perform action: ${action}`);
 *   },
 *   page: 2,
 *   pageSize: 25,
 *   enabled: Boolean(collectionAddress && chainId)
 * });
 * ```
 */
declare function useMarketCardDataPaged({
  collectionAddress,
  chainId,
  orderbookKind,
  collectionType,
  filterOptions,
  searchText,
  showListedOnly,
  inAccounts,
  priceFilters,
  onCollectibleClick,
  onCannotPerformAction,
  prioritizeOwnerActions,
  assetSrcPrefixUrl,
  hideQuantitySelector,
  page,
  pageSize,
  enabled
}: UseMarketCardDataPagedProps): {
  collectibleCards: MarketCollectibleCardProps[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
};
//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-721-card-data.d.ts
interface UsePrimarySale721CardDataProps {
  primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
  chainId: number;
  contractAddress: Address$1;
  salesContractAddress: Address$1;
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
    amount: bigint;
    currencyAddress: `0x${string}`;
  } | {
    amount: bigint;
    currencyAddress: "0x0000000000000000000000000000000000000000";
  };
  collectibleCards: ({
    tokenId: bigint;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType$1.ERC721;
    tokenMetadata: {
      tokenId: bigint;
      source: string;
      name: string;
      description?: string;
      image?: string;
      video?: string;
      audio?: string;
      properties?: {
        [key: string]: any;
      };
      attributes: Array<{
        [key: string]: any;
      }>;
      image_data?: string;
      external_url?: string;
      background_color?: string;
      animation_url?: string;
      decimals?: number;
      updatedAt?: string;
      assets?: Array<_0xsequence_api_client25.MarketplaceAsset>;
      status: _0xsequence_api_client25.MetadataStatus;
    };
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: bigint;
      currencyAddress: `0x${string}`;
    };
    quantityInitial: bigint;
    quantityRemaining: bigint;
    saleStartsAt: string;
    saleEndsAt: string;
    cardType: "shop";
  } | {
    tokenId: bigint;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType$1.ERC721;
    tokenMetadata: TokenMetadata;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: bigint;
      currencyAddress: "0x0000000000000000000000000000000000000000";
    };
    quantityInitial: undefined;
    quantityRemaining: undefined;
    saleStartsAt: undefined;
    saleEndsAt: undefined;
    cardType: "shop";
  })[];
  saleDetailsError: viem27.ReadContractErrorType | null;
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
  tokenSuppliesData: _tanstack_react_query58.InfiniteData<_0xsequence_api_client25.GetTokenSuppliesResponse, unknown> | undefined;
};
//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-1155-card-data.d.ts
interface UsePrimarySale1155CardDataProps {
  primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
  chainId: number;
  contractAddress: Address$1;
  salesContractAddress: Address$1;
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
    tokenId: bigint;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType$1.ERC1155;
    tokenMetadata: {
      source: string;
      tokenId: bigint;
      name: string;
      description?: string;
      image?: string;
      video?: string;
      audio?: string;
      properties?: {
        [key: string]: any;
      };
      attributes: Array<{
        [key: string]: any;
      }>;
      image_data?: string;
      external_url?: string;
      background_color?: string;
      animation_url?: string;
      decimals?: number;
      updatedAt?: string;
      assets?: Array<_0xsequence_api_client25.MarketplaceAsset>;
      status: _0xsequence_api_client25.MetadataStatus;
    };
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: bigint;
      currencyAddress: `0x${string}`;
    };
    quantityInitial: bigint;
    quantityRemaining: bigint;
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
export { useMarketCardData as a, useMarketCardDataPaged as i, usePrimarySale721CardData as n, UseMarketCardDataPagedProps as r, usePrimarySale1155CardData as t };
//# sourceMappingURL=index16.d.ts.map