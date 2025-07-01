import { CollectibleCardAction, CollectibleOrder, ContractType, MarketplaceType, Order, OrderbookKind, TokenMetadata } from "./new-marketplace-types-Cggo50UM.js";
import * as react_jsx_runtime213 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/types.d.ts
type MarketplaceCardBaseProps = {
  collectibleId: string;
  chainId: number;
  collectionAddress: Address;
  collectionType?: ContractType;
  assetSrcPrefixUrl?: string;
  cardLoading?: boolean;
  marketplaceType?: MarketplaceType;
};
type ShopCardSpecificProps = {
  salesContractAddress: Address;
  tokenMetadata: TokenMetadata;
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
type MarketplaceCollectibleCardProps = MarketplaceCardBaseProps & Partial<MarketCardSpecificProps & ShopCardSpecificProps>;
type ShopCollectibleCardProps = MarketplaceCardBaseProps & ShopCardSpecificProps & {
  marketplaceType: 'shop';
};
type MarketCollectibleCardProps = MarketplaceCardBaseProps & MarketCardSpecificProps & {
  marketplaceType?: 'market';
};
type CollectibleCardProps = ShopCollectibleCardProps | MarketCollectibleCardProps;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/CollectibleCard.d.ts
declare function CollectibleCard(props: CollectibleCardProps): react_jsx_runtime213.JSX.Element;
//#endregion
export { CollectibleCard, CollectibleCardProps, MarketCardSpecificProps, MarketCollectibleCardProps, MarketplaceCardBaseProps, MarketplaceCollectibleCardProps, ShopCardSpecificProps, ShopCollectibleCardProps };
//# sourceMappingURL=CollectibleCard-cwM01fLs.d.ts.map