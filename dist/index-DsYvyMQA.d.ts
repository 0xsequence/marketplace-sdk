import { K as CardType, Yr as Order, ei as OrderbookKind, q as CollectibleCardAction } from "./create-config-BO68TZC5.js";
import * as react_jsx_runtime23 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/ActionButton/ActionButton.d.ts
type ActionButtonProps = {
  chainId: number;
  collectionAddress: Address;
  tokenId: string;
  orderbookKind?: OrderbookKind;
  isTransfer?: boolean;
  action: CollectibleCardAction;
  owned?: boolean;
  highestOffer?: Order;
  lowestListing?: Order;
  onCannotPerformAction?: (action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER) => void;
  cardType: CardType;
  salesContractAddress?: Address;
  prioritizeOwnerActions?: boolean;
  salePrice?: {
    amount: string;
    currencyAddress: Address;
  };
  quantityDecimals?: number;
  quantityRemaining?: number;
  unlimitedSupply?: boolean;
  hideQuantitySelector?: boolean;
  labelOverride?: {
    listing?: string;
    offer?: string;
    buy?: string;
    sell?: string;
    transfer?: string;
  };
  className?: string;
};
declare function ActionButton({
  collectionAddress,
  chainId,
  tokenId,
  orderbookKind,
  action,
  owned,
  highestOffer,
  lowestListing,
  onCannotPerformAction,
  cardType,
  salesContractAddress,
  prioritizeOwnerActions,
  salePrice,
  quantityDecimals,
  quantityRemaining,
  unlimitedSupply,
  hideQuantitySelector,
  labelOverride,
  className
}: ActionButtonProps): react_jsx_runtime23.JSX.Element | null;
//#endregion
export { ActionButton as t };
//# sourceMappingURL=index-DsYvyMQA.d.ts.map