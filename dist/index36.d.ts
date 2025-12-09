import { _r as OrderbookKind$1 } from "./create-config.js";
import { i as TransactionStep, n as FeeStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import * as _0xsequence_api_client0 from "@0xsequence/api-client";
import "dnum";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query47 from "@tanstack/react-query";
import "@xstate/store";

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
    orderbookKind: _0xsequence_api_client0.OrderbookKind | undefined;
  };
  tokenId: bigint;
  collectionAddress: `0x${string}`;
  chainId: number;
  collectible: _0xsequence_api_client0.TokenMetadata | undefined;
  collection: _0xsequence_api_client0.ContractInfo | undefined;
  offer: {
    price: {
      input: string;
      amountRaw: bigint;
      currency: _0xsequence_api_client0.Currency | null;
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
    available: _0xsequence_api_client0.Currency[];
    selected: _0xsequence_api_client0.Currency | null;
    select: (address: Address$1) => void;
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
    collectible: _tanstack_react_query47.UseQueryResult<_0xsequence_api_client0.TokenMetadata, Error>;
    collection: _tanstack_react_query47.UseQueryResult<_0xsequence_api_client0.ContractInfo, Error>;
    currencies: _tanstack_react_query47.UseQueryResult<_0xsequence_api_client0.Currency[], Error>;
    lowestListing: _tanstack_react_query47.UseQueryResult<_0xsequence_api_client0.Order | undefined, Error>;
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
  collectionAddress: Address$1;
  chainId: number;
  tokenId: bigint;
  orderbookKind?: OrderbookKind$1;
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
//# sourceMappingURL=index36.d.ts.map