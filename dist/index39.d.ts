import { mn as CollectionType } from "./create-config.js";
import { n as ModalCallbacks } from "./types.js";
import * as react_jsx_runtime3 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/modals/TransferModal/index.d.ts
type ShowTransferModalArgs = {
  collectionAddress: Address;
  tokenId: bigint;
  chainId: number;
  collectionType?: CollectionType;
  callbacks?: ModalCallbacks;
};
type UseTransferModalArgs = {
  prefetch?: {
    tokenId: bigint;
    chainId: number;
    collectionAddress: Address;
  };
};
declare const useTransferModal: (args?: UseTransferModalArgs) => {
  show: (args: ShowTransferModalArgs) => void;
  close: () => void;
};
declare const TransferModal: () => react_jsx_runtime3.JSX.Element | null;
//#endregion
export { useTransferModal as i, TransferModal as n, UseTransferModalArgs as r, ShowTransferModalArgs as t };
//# sourceMappingURL=index39.d.ts.map