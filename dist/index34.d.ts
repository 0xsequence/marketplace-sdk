import { R as BuyModalProps } from "./create-config.js";
import { n as ModalCallbacks } from "./types.js";

//#region src/react/ui/modals/BuyModal/index.d.ts
declare const useBuyModal: (callbacks?: ModalCallbacks) => {
  show: (args: BuyModalProps) => void;
  close: () => void;
};
//#endregion
export { useBuyModal as t };
//# sourceMappingURL=index34.d.ts.map