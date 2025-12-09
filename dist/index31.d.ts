import { Lt as OrderbookKind, Mt as Order, v as CardType, y as CollectibleCardAction } from "./create-config.js";
import * as react_jsx_runtime28 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/ActionButton/ActionButton.d.ts
type ActionButtonProps = {
  chainId: number;
  collectionAddress: Address;
  tokenId: bigint;
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
    amount: bigint;
    currencyAddress: Address;
  };
  quantityRemaining?: bigint;
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
  quantityRemaining,
  unlimitedSupply,
  hideQuantitySelector,
  labelOverride,
  className
}: ActionButtonProps): react_jsx_runtime28.JSX.Element | null;
//#endregion
export { ActionButton as t };
//# sourceMappingURL=index31.d.ts.map