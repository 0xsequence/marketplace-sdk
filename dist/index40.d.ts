import { X as Order, ht as TokenMetadata$1, l as Currency, ut as ContractInfo$1 } from "./index2.js";
import { i as TransactionStep, n as FeeStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import { Address } from "viem";
import * as react_jsx_runtime29 from "react/jsx-runtime";
import * as _tanstack_react_query47 from "@tanstack/react-query";

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
    collectible: _tanstack_react_query47.UseQueryResult<TokenMetadata$1, Error>;
    collection: _tanstack_react_query47.UseQueryResult<ContractInfo$1, Error>;
    currency: _tanstack_react_query47.UseQueryResult<Currency | undefined, Error>;
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
  collectionAddress: Address;
  chainId: number;
  tokenId: bigint;
  order: Order;
};
declare const useSellModal: () => {
  show: (args: OpenSellModalArgs) => void;
  close: () => void;
  collectionAddress: Address;
  chainId: number;
  tokenId: bigint;
  isOpen: boolean;
  order: Order | null;
};
//#endregion
//#region src/react/ui/modals/SellModal/Modal.d.ts
declare const SellModal: () => react_jsx_runtime29.JSX.Element | null;
//#endregion
export { useSellModalContext as a, SellModalContext as i, OpenSellModalArgs as n, useSellModal as r, SellModal as t };
//# sourceMappingURL=index40.d.ts.map