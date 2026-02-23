import { Ft as Address$1, Z as Order, l as Currency, ut as ContractInfo$1, yt as TokenMetadata$1 } from "./index2.js";
import { n as FeeStep, o as TransactionStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import * as react_jsx_runtime50 from "react/jsx-runtime";
import * as _tanstack_react_query54 from "@tanstack/react-query";

//#region src/react/ui/modals/SellModal/internal/context.d.ts
type SellModalSteps = {
  fee?: FeeStep;
  approval?: ApprovalStep;
  sell: TransactionStep;
};
declare function useSellModalContext(): {
  isOpen: boolean;
  close: () => void;
  item: {
    tokenId: bigint;
    collectionAddress: `0x${string}`;
    chainId: number;
  };
  collection: ContractInfo$1 | undefined;
  offer: {
    order: Order | null;
    currency: Currency | undefined;
    priceAmount: bigint | undefined;
  };
  steps: SellModalSteps;
  flow: FlowState<"transaction">;
  loading: {
    collectible: boolean;
    collection: boolean;
    currency: boolean;
    steps: boolean;
    collectibleApproval: boolean;
  };
  transactions: {
    approve: `0x${string}` | undefined;
    sell: `0x${string}` | undefined;
  };
  error: Error | null;
  queries: {
    collectible: _tanstack_react_query54.UseQueryResult<TokenMetadata$1 | undefined, Error>;
    collection: _tanstack_react_query54.UseQueryResult<ContractInfo$1, Error>;
    currency: _tanstack_react_query54.UseQueryResult<Currency | undefined, Error>;
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
  order: Order;
};
declare const useSellModal: () => {
  show: (args: OpenSellModalArgs) => void;
  close: () => void;
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
  isOpen: boolean;
  order: Order | null;
};
//#endregion
//#region src/react/ui/modals/SellModal/Modal.d.ts
declare const SellModal: () => react_jsx_runtime50.JSX.Element | null;
//#endregion
export { useSellModalContext as a, SellModalContext as i, OpenSellModalArgs as n, useSellModal as r, SellModal as t };
//# sourceMappingURL=index38.d.ts.map