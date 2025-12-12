import { Cn as Order, Ht as Currency, In as ContractInfo$1, Vn as TokenMetadata$1, wr as OrderbookKind } from "./create-config.js";
import { i as TransactionStep, n as FeeStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import { Address } from "viem";
import * as _tanstack_react_query90 from "@tanstack/react-query";

//#region src/react/ui/modals/MakeOfferModal/internal/helpers/validation.d.ts
type FieldValidation = {
  isValid: boolean;
  error: string | null;
};
//#endregion
//#region src/react/ui/modals/MakeOfferModal/internal/context.d.ts
type MakeOfferModalSteps = {
  fee?: FeeStep;
  approval?: ApprovalStep;
  offer: TransactionStep;
};
declare function useMakeOfferModalContext(): {
  isOpen: boolean;
  close: () => void;
  item: {
    chainId: number;
    collectionAddress: `0x${string}`;
    tokenId: bigint;
    orderbookKind: OrderbookKind | undefined;
  };
  tokenId: bigint;
  collectionAddress: `0x${string}`;
  chainId: number;
  collectible: TokenMetadata$1 | undefined;
  collection: ContractInfo$1 | undefined;
  offer: {
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
      balance: FieldValidation;
      openseaCriteria: FieldValidation | undefined;
    };
    errors: {
      price: string | null | undefined;
      quantity: string | null | undefined;
      balance: string | null | undefined;
      openseaCriteria: string | null | undefined;
    };
  };
  currencies: {
    available: Currency[];
    selected: Currency | null;
    select: (address: Address) => void;
    isConfigured: boolean;
  };
  steps: MakeOfferModalSteps;
  flow: FlowState<"transaction">;
  loading: {
    collectible: boolean;
    collection: boolean;
    currencies: boolean;
    allowance: boolean;
  };
  transactions: {
    approve: `0x${string}` | undefined;
    offer: `0x${string}` | undefined;
  };
  error: Error | null;
  queries: {
    collectible: _tanstack_react_query90.UseQueryResult<TokenMetadata$1, Error>;
    collection: _tanstack_react_query90.UseQueryResult<ContractInfo$1, Error>;
    currencies: _tanstack_react_query90.UseQueryResult<Currency[], Error>;
    lowestListing: _tanstack_react_query90.UseQueryResult<Order | undefined, Error>;
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
    offer: {
      label: string;
      onClick: () => Promise<void>;
      loading: boolean;
      disabled: boolean;
      variant: "ghost" | undefined;
      testid: string;
    };
  };
};
type MakeOfferModalContext = ReturnType<typeof useMakeOfferModalContext>;
//#endregion
//#region src/react/ui/modals/MakeOfferModal/internal/store.d.ts
type OpenMakeOfferModalArgs = {
  collectionAddress: Address;
  chainId: number;
  tokenId: bigint;
  orderbookKind?: OrderbookKind;
};
//#endregion
//#region src/react/ui/modals/MakeOfferModal/index.d.ts
type ShowMakeOfferModalArgs = OpenMakeOfferModalArgs;
declare const useMakeOfferModal: () => {
  show: (args: ShowMakeOfferModalArgs) => void;
  close: () => void;
};
//#endregion
export { useMakeOfferModalContext as i, useMakeOfferModal as n, MakeOfferModalContext as r, ShowMakeOfferModalArgs as t };
//# sourceMappingURL=index39.d.ts.map