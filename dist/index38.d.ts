import { n as ModalCallbacks } from "./types.js";
import { Metadata } from "@0xsequence/api-client";
import { ComponentType } from "react";
import { IconProps } from "@0xsequence/design-system";
import * as react_jsx_runtime2 from "react/jsx-runtime";
import "@xstate/store";

//#region src/react/ui/modals/SuccessfulPurchaseModal/store.d.ts
type TokenMetadata$1 = Metadata.TokenMetadata;
interface SuccessfulPurchaseModalState {
  isOpen: boolean;
  state: {
    collectibles: TokenMetadata$1[];
    totalPrice: string;
    explorerName: string;
    explorerUrl: string;
    ctaOptions?: {
      ctaLabel: string;
      ctaOnClick: () => void;
      ctaIcon?: ComponentType<IconProps>;
    };
  };
  callbacks?: ModalCallbacks;
}
//#endregion
//#region src/react/ui/modals/SuccessfulPurchaseModal/index.d.ts
declare const useSuccessfulPurchaseModal: (callbacks?: ModalCallbacks) => {
  show: (args: SuccessfulPurchaseModalState["state"]) => void;
  close: () => void;
};
declare const SuccessfulPurchaseModal: () => react_jsx_runtime2.JSX.Element | null;
//#endregion
export { useSuccessfulPurchaseModal as n, SuccessfulPurchaseModal as t };
//# sourceMappingURL=index38.d.ts.map