import { Ft as Address$1, yt as TokenMetadata$1 } from "../../../../../../index2.js";
import { _ as Price } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import * as react_jsx_runtime19 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/transactionPreview/index.d.ts
type TransactionPreviewProps = {
  orderId?: string;
  price?: Price;
  collectionAddress: Address$1;
  chainId: number;
  collectible: TokenMetadata$1 | undefined;
  collectibleLoading: boolean;
  currencyImageUrl?: string;
  isConfirming: boolean;
  isConfirmed: boolean;
  isFailed: boolean;
  isTimeout: boolean;
};
declare const TransactionPreview: ({
  orderId,
  price,
  collectionAddress,
  chainId,
  collectible,
  collectibleLoading,
  currencyImageUrl,
  isConfirming,
  isConfirmed,
  isFailed,
  isTimeout
}: TransactionPreviewProps) => react_jsx_runtime19.JSX.Element;
//#endregion
export { TransactionPreview as default };
//# sourceMappingURL=index.d.ts.map