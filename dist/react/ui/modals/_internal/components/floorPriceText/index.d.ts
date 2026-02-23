import "../../../../../../index2.js";
import { _ as Price } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import * as react_jsx_runtime8 from "react/jsx-runtime";
import { Hex } from "viem";

//#region src/react/ui/modals/_internal/components/floorPriceText/index.d.ts
declare function FloorPriceText({
  chainId,
  collectionAddress,
  tokenId,
  price,
  onBuyNow
}: {
  chainId: number;
  collectionAddress: Hex;
  tokenId: bigint;
  price: Price;
  onBuyNow?: () => void;
}): react_jsx_runtime8.JSX.Element | null;
//#endregion
export { FloorPriceText as default };
//# sourceMappingURL=index.d.ts.map