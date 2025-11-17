import { Ft as CollectibleOrder, Gt as ContractType, Ki as TokenMetadata$1, et as CardType, fi as OrderbookKind, si as Order, tt as CollectibleCardAction } from "./create-config-Cws5O44a.js";
import { TokenMetadata } from "@0xsequence/metadata";
import { Address } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/types.d.ts
type MarketplaceCardBaseProps = {
  collectibleId: string;
  chainId: number;
  collectionAddress: Address;
  collectionType?: ContractType;
  assetSrcPrefixUrl?: string;
  cardLoading: boolean;
  cardType?: CardType;
  hideQuantitySelector?: boolean;
};
type ShopCardSpecificProps = {
  salesContractAddress: Address;
  tokenMetadata: TokenMetadata$1 | TokenMetadata;
  salePrice: {
    amount: string;
    currencyAddress: Address;
  } | undefined;
  saleStartsAt: string | undefined;
  saleEndsAt: string | undefined;
  quantityDecimals: number | undefined;
  quantityInitial: string | undefined;
  quantityRemaining: string | undefined;
  unlimitedSupply?: boolean;
};
type MarketCardSpecificProps = {
  orderbookKind?: OrderbookKind;
  collectible: CollectibleOrder | undefined;
  onCollectibleClick?: (tokenId: string) => void;
  onOfferClick?: ({
    order,
    e
  }: {
    order?: Order;
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
  collectibleMetadata: TokenMetadata$1 | TokenMetadata;
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
export { MarketplaceCollectibleCardProps as a, ShopCollectibleCardProps as c, MarketplaceCardBaseProps as i, MarketCardSpecificProps as n, NonTradableInventoryCardProps as o, MarketCollectibleCardProps as r, ShopCardSpecificProps as s, CollectibleCardProps as t };
//# sourceMappingURL=types-Bh-6hY2l.d.ts.map