import { Ft as Address$1 } from "../../../../../../index2.js";
import { J as TransactionType, _ as Price } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import * as react_jsx_runtime20 from "react/jsx-runtime";
import { Hex } from "viem";
import { QueryKey } from "@tanstack/react-query";

//#region src/react/ui/modals/_internal/components/transactionStatusModal/index.d.ts
type ShowTransactionStatusModalArgs = {
  hash?: Hex;
  orderId?: string;
  price?: Price;
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
  type: TransactionType;
  queriesToInvalidate?: QueryKey[];
};
declare const useTransactionStatusModal: () => {
  show: (args: ShowTransactionStatusModalArgs) => void;
  close: () => void;
};
declare const TransactionStatusModal: () => react_jsx_runtime20.JSX.Element | null;
//#endregion
export { ShowTransactionStatusModalArgs, TransactionStatusModal as default, useTransactionStatusModal };
//# sourceMappingURL=index.d.ts.map