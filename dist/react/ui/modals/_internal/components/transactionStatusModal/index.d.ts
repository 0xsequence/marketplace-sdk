import { Tn as TransactionType, k as Price } from "../../../../../../create-config.js";
import * as react_jsx_runtime0 from "react/jsx-runtime";
import { Address, Hex } from "viem";
import { QueryKey } from "@tanstack/react-query";

//#region src/react/ui/modals/_internal/components/transactionStatusModal/index.d.ts
type ShowTransactionStatusModalArgs = {
  hash?: Hex;
  orderId?: string;
  price?: Price;
  collectionAddress: Address;
  chainId: number;
  tokenId: bigint;
  type: TransactionType;
  queriesToInvalidate?: QueryKey[];
};
declare const useTransactionStatusModal: () => {
  show: (args: ShowTransactionStatusModalArgs) => void;
  close: () => void;
};
declare const TransactionStatusModal: () => react_jsx_runtime0.JSX.Element | null;
//#endregion
export { ShowTransactionStatusModalArgs, TransactionStatusModal as default, useTransactionStatusModal };
//# sourceMappingURL=index.d.ts.map