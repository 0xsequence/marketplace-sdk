import { X as Order } from "./index2.js";
import { g as CollectibleCardAction, h as CardType } from "./create-config.js";
import * as react_jsx_runtime26 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/ActionButton/ActionButton.d.ts
type ActionButtonProps = {
  chainId: number;
  collectionAddress: Address;
  tokenId: bigint;
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
}: ActionButtonProps): react_jsx_runtime26.JSX.Element | null;
//#endregion
export { ActionButton as t };
//# sourceMappingURL=index34.d.ts.map