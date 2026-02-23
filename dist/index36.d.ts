import { Ft as Address$1, Mt as TokenBalance$1, l as Currency, un as OrderbookKind, ut as ContractInfo$1 } from "./index2.js";
import { n as FeeStep, o as TransactionStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import * as react_jsx_runtime29 from "react/jsx-runtime";
import * as _tanstack_react_query51 from "@tanstack/react-query";

//#region src/react/ui/modals/CreateListingModal/internal/helpers/validation.d.ts
type FieldValidation = {
  isValid: boolean;
  error: string | null;
};
//#endregion
//#region src/react/ui/modals/CreateListingModal/internal/context.d.ts
type CreateListingModalSteps = {
  fee?: FeeStep;
  approval?: ApprovalStep;
  listing: TransactionStep;
};
declare function useCreateListingModalContext(): {
  isOpen: boolean;
  close: () => void;
  item: {
    chainId: number;
    collectionAddress: `0x${string}`;
    tokenId: bigint;
    orderbookKind: OrderbookKind | undefined;
  };
  listing: {
    price: {
      input: string;
      amountRaw: bigint;
      currency: Currency | null;
    };
    quantity: {
      input: string;
      parsed: bigint;
    };
    expiry: Date;
  };
  form: {
    price: {
      input: string;
      update: (value: string) => void;
      touch: () => void;
      isTouched: boolean;
    };
    quantity: {
      input: string;
      update: (value: string) => void;
      touch: () => void;
      isTouched: boolean;
      validation: FieldValidation;
    };
    expiry: {
      update: (days: number) => void;
    };
    isValid: boolean;
    validation: {
      price: FieldValidation;
      quantity: FieldValidation;
      balance: FieldValidation | undefined;
    };
    errors: {
      price: string | null | undefined;
      quantity: string | null | undefined;
      balance: string | null | undefined;
    };
  };
  currencies: {
    available: Currency[];
    selected: Currency | null;
    select: (address: Address$1) => void;
    isConfigured: boolean;
  };
  steps: CreateListingModalSteps;
  flow: FlowState<"transaction">;
  loading: {
    collection: boolean;
    currencies: boolean;
    collectibleBalance: boolean;
    nftApproval: boolean;
  };
  transactions: {
    approve: `0x${string}` | undefined;
    listing: `0x${string}` | undefined;
  };
  error: Error | null;
  queries: {
    collection: _tanstack_react_query51.UseQueryResult<ContractInfo$1, Error>;
    currencies: _tanstack_react_query51.UseQueryResult<Currency[], Error>;
    collectibleBalance: _tanstack_react_query51.UseQueryResult<TokenBalance$1, Error>;
  };
  readonly formError: string | null | undefined;
  readonly actions: {
    approve: {
      label: string | undefined;
      onClick: () => void;
      loading: boolean | undefined;
      disabled: boolean;
      testid: string;
    } | undefined;
    listing: {
      label: string;
      onClick: () => Promise<void>;
      loading: boolean;
      disabled: boolean;
      variant: "ghost" | undefined;
      testid: string;
    };
  };
};
type CreateListingModalContext = ReturnType<typeof useCreateListingModalContext>;
//#endregion
//#region src/react/ui/modals/CreateListingModal/internal/store.d.ts
type OpenCreateListingModalArgs = {
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
};
//#endregion
//#region src/react/ui/modals/CreateListingModal/Modal.d.ts
declare const CreateListingModal: () => react_jsx_runtime29.JSX.Element | null;
//#endregion
//#region src/react/ui/modals/CreateListingModal/index.d.ts
type ShowCreateListingModalArgs = OpenCreateListingModalArgs;
declare const useCreateListingModal: () => {
  show: (args: ShowCreateListingModalArgs) => void;
  close: () => void;
};
//#endregion
export { CreateListingModalContext as a, OpenCreateListingModalArgs as i, useCreateListingModal as n, useCreateListingModalContext as o, CreateListingModal as r, ShowCreateListingModalArgs as t };
//# sourceMappingURL=index36.d.ts.map