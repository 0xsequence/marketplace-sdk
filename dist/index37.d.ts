import { Mt as Order$1 } from "./create-config.js";
import { n as ModalCallbacks } from "./types.js";
import { i as TransactionStep, n as FeeStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import * as _0xsequence_api_client0 from "@0xsequence/api-client";
import * as react_jsx_runtime30 from "react/jsx-runtime";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query47 from "@tanstack/react-query";
import "@xstate/store";

//#region src/react/ui/modals/SellModal/internal/context.d.ts
type SellModalSteps = {
  fee?: FeeStep;
  approval?: ApprovalStep;
  sell: TransactionStep;
};
declare function useSellModalContext(): {
  isOpen: boolean;
  close: () => void;
  tokenId: bigint;
  collectionAddress: `0x${string}`;
  chainId: number;
  collection: _0xsequence_api_client0.ContractInfo | undefined;
  offer: {
    order: _0xsequence_api_client0.Order | null;
    currency: _0xsequence_api_client0.Currency | undefined;
    priceAmount: bigint | undefined;
  };
  steps: SellModalSteps;
  flow: FlowState<"transaction">;
  loading: {
    collection: boolean;
    currency: boolean;
    steps: boolean;
  };
  transactions: {
    approve: `0x${string}` | undefined;
    sell: `0x${string}` | undefined;
  };
  error: Error | null;
  queries: {
    collection: _tanstack_react_query47.UseQueryResult<_0xsequence_api_client0.ContractInfo, Error>;
    currency: _tanstack_react_query47.UseQueryResult<_0xsequence_api_client0.Currency | undefined, Error>;
  };
  readonly actions: {
    approve: {
      label: string | undefined;
      onClick: () => void;
      loading: boolean | undefined;
      disabled: boolean | undefined;
      testid: string;
    } | undefined;
    sell: {
      label: string;
      onClick: () => Promise<void>;
      loading: boolean;
      disabled: boolean;
      testid: string;
    };
  };
};
type SellModalContext = ReturnType<typeof useSellModalContext>;
//#endregion
//#region src/react/ui/modals/SellModal/internal/store.d.ts
type OpenSellModalArgs = {
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
  order: Order$1;
  callbacks?: ModalCallbacks;
};
declare const useSellModal: () => {
  show: (args: OpenSellModalArgs) => void;
  close: () => void;
  callbacks?: ModalCallbacks | undefined;
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
  isOpen: boolean;
  order: Order$1 | null;
};
//#endregion
//#region src/react/ui/modals/SellModal/Modal.d.ts
declare function SellModal(): react_jsx_runtime30.JSX.Element | null;
//#endregion
export { useSellModalContext as a, SellModalContext as i, OpenSellModalArgs as n, useSellModal as r, SellModal as t };
//# sourceMappingURL=index37.d.ts.map