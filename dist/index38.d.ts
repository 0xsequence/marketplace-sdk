import { mn as CollectionType } from "./create-config.js";
import * as react_jsx_runtime2 from "react/jsx-runtime";
import { Address } from "viem";
import "@xstate/store";

//#region src/react/ui/modals/TransferModal/internal/store.d.ts
type ShowTransferModalArgs = {
  collectionAddress: Address;
  tokenId: bigint;
  chainId: number;
  collectionType?: CollectionType;
};
type UseTransferModalArgs = {
  prefetch?: {
    tokenId: bigint;
    chainId: number;
    collectionAddress: Address;
  };
};
declare const useTransferModal: (args?: UseTransferModalArgs) => {
  show: (openArgs: ShowTransferModalArgs) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/TransferModal/index.d.ts
declare const TransferModal: () => react_jsx_runtime2.JSX.Element | null;
//#endregion
export { useTransferModal as i, ShowTransferModalArgs as n, UseTransferModalArgs as r, TransferModal as t };
//# sourceMappingURL=index38.d.ts.map