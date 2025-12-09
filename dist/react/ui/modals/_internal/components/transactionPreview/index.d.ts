import { k as Price } from "../../../../../../create-config.js";
import { TokenMetadata } from "@0xsequence/api-client";
import * as react_jsx_runtime20 from "react/jsx-runtime";
import { Address as Address$1 } from "viem";

//#region src/react/ui/modals/_internal/components/transactionPreview/index.d.ts
type TransactionPreviewProps = {
  orderId?: string;
  price?: Price;
  collectionAddress: Address$1;
  chainId: number;
  collectible: TokenMetadata | undefined;
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
}: TransactionPreviewProps) => react_jsx_runtime20.JSX.Element;
//#endregion
export { TransactionPreview as default };
//# sourceMappingURL=index.d.ts.map