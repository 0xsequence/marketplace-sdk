import { Ft as Address$1, Z as Order } from "./index2.js";
import { l as CardType, u as CollectibleCardAction } from "./create-config.js";
import * as react_jsx_runtime21 from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-collectible-card/ActionButton/ActionButton.d.ts
type ActionButtonProps = {
  chainId: number;
  collectionAddress: Address$1;
  tokenId: bigint;
  isTransfer?: boolean;
  action: CollectibleCardAction;
  owned?: boolean;
  highestOffer?: Order;
  lowestListing?: Order;
  onCannotPerformAction?: (action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER) => void;
  cardType: CardType;
  salesContractAddress?: Address$1;
  prioritizeOwnerActions?: boolean;
  salePrice?: {
    amount: bigint;
    currencyAddress: Address$1;
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
}: ActionButtonProps): react_jsx_runtime21.JSX.Element | null;
//#endregion
export { ActionButton as t };
//# sourceMappingURL=index33.d.ts.map