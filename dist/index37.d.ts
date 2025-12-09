import { Mt as Order$1 } from "./create-config.js";
import { i as TransactionStep, n as FeeStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import * as _0xsequence_api_client9 from "@0xsequence/api-client";
import * as react_jsx_runtime29 from "react/jsx-runtime";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query51 from "@tanstack/react-query";
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
  item: {
    tokenId: bigint;
    collectionAddress: `0x${string}`;
    chainId: number;
  };
  collection: _0xsequence_api_client9.ContractInfo | undefined;
  offer: {
    order: _0xsequence_api_client9.Order | null;
    currency: _0xsequence_api_client9.Currency | undefined;
    priceAmount: bigint | undefined;
  };
  steps: SellModalSteps;
  flow: FlowState<"transaction">;
  loading: {
    collectible: boolean;
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
    collectible: _tanstack_react_query51.UseQueryResult<_0xsequence_api_client9.TokenMetadata, Error>;
    collection: _tanstack_react_query51.UseQueryResult<_0xsequence_api_client9.ContractInfo, Error>;
    currency: _tanstack_react_query51.UseQueryResult<_0xsequence_api_client9.Currency | undefined, Error>;
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
};
declare const useSellModal: () => {
  show: (args: OpenSellModalArgs) => void;
  close: () => void;
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
  isOpen: boolean;
  order: Order$1 | null;
};
//#endregion
//#region src/react/ui/modals/SellModal/Modal.d.ts
declare const SellModal: () => react_jsx_runtime29.JSX.Element | null;
//#endregion
export { useSellModalContext as a, SellModalContext as i, OpenSellModalArgs as n, useSellModal as r, SellModal as t };
//# sourceMappingURL=index37.d.ts.map