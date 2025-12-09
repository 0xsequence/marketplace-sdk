import { J as ContractType$1, Lt as OrderbookKind$1, Mt as Order$1, W as CollectibleOrder, v as CardType, y as CollectibleCardAction } from "./create-config.js";
import { Metadata } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/types.d.ts
type CardClassNames = {
  cardRoot?: string;
  cardMedia?: string;
  cardContent?: string;
  cardTitle?: string;
  cardPrice?: string;
  cardBadge?: string;
  cardFooter?: string;
  cardActionButton?: string;
  cardSaleDetails?: string;
  cardSkeleton?: string;
};
type TokenMetadataType = Metadata.TokenMetadata;
type MarketplaceCardBaseProps = {
  tokenId: bigint;
  chainId: number;
  collectionAddress: Address$1;
  collectionType?: ContractType$1;
  assetSrcPrefixUrl?: string;
  cardLoading: boolean;
  cardType?: CardType;
  classNames?: CardClassNames;
  hideQuantitySelector?: boolean;
};
type ShopCardSpecificProps = {
  salesContractAddress: Address$1;
  tokenMetadata: TokenMetadataType;
  salePrice: {
    amount: bigint;
    currencyAddress: Address$1;
  } | undefined;
  saleStartsAt: string | undefined;
  saleEndsAt: string | undefined;
  quantityInitial: bigint | undefined;
  quantityRemaining: bigint | undefined;
  unlimitedSupply?: boolean;
};
type MarketCardSpecificProps = {
  orderbookKind?: OrderbookKind$1;
  collectible: CollectibleOrder | undefined;
  onCollectibleClick?: (tokenId: bigint) => void;
  onOfferClick?: ({
    order,
    e
  }: {
    order?: Order$1;
    e: React.MouseEvent<HTMLButtonElement>;
  }) => void;
  balance?: string;
  balanceIsLoading: boolean;
  /**
   * Callback function that is called when the user attempts to perform an action
   * (such as buying or making an offer) that they are not permitted to do.
   *
   * This function is invoked in the following scenario:
   *
   * - When a disconnected user clicks on "Buy Now" and is prompted to connect
   *   their wallet. After connecting, if it is determined that the user is
   *   already the owner of the collectible, this callback is triggered to inform
   *   them that they cannot perform the action (e.g., buying their own collectible).
   *
   * @param action - The action that the user cannot perform, which can be either
   * CollectibleCardAction.BUY or CollectibleCardAction.OFFER.
   */
  onCannotPerformAction?: (action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER) => void;
  prioritizeOwnerActions?: boolean;
};
type NonTradableInventoryCardSpecificProps = {
  balance: string;
  balanceIsLoading: boolean;
  collectibleMetadata: TokenMetadataType;
};
type MarketplaceCollectibleCardProps = MarketplaceCardBaseProps & Partial<MarketCardSpecificProps & ShopCardSpecificProps>;
type ShopCollectibleCardProps = MarketplaceCardBaseProps & ShopCardSpecificProps & {
  cardType?: 'shop';
};
type MarketCollectibleCardProps = MarketplaceCardBaseProps & MarketCardSpecificProps & {
  cardType?: 'market';
};
type NonTradableInventoryCardProps = MarketplaceCardBaseProps & NonTradableInventoryCardSpecificProps & {
  cardType?: 'inventory-non-tradable';
};
type CollectibleCardProps = ShopCollectibleCardProps | MarketCollectibleCardProps | NonTradableInventoryCardProps;
//#endregion
export { MarketplaceCardBaseProps as a, ShopCardSpecificProps as c, MarketCollectibleCardProps as i, ShopCollectibleCardProps as l, CollectibleCardProps as n, MarketplaceCollectibleCardProps as o, MarketCardSpecificProps as r, NonTradableInventoryCardProps as s, CardClassNames as t };
//# sourceMappingURL=types.d.ts.map