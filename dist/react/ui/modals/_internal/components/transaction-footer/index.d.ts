import * as react_jsx_runtime13 from "react/jsx-runtime";
import { Hex } from "viem";

//#region src/react/ui/modals/_internal/components/transaction-footer/index.d.ts
type TransactionFooterProps = {
  transactionHash: Hex | undefined;
  orderId?: string;
  isConfirming: boolean;
  isConfirmed: boolean;
  isFailed: boolean;
  isTimeout: boolean;
  chainId: number;
};
declare function TransactionFooter({
  transactionHash,
  orderId,
  isConfirming,
  isConfirmed,
  isFailed,
  isTimeout,
  chainId
}: TransactionFooterProps): react_jsx_runtime13.JSX.Element;
declare const PositiveCircle: () => react_jsx_runtime13.JSX.Element;
//#endregion
export { PositiveCircle, TransactionFooter as default };
//# sourceMappingURL=index.d.ts.map