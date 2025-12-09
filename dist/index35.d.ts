import { _r as OrderbookKind$1 } from "./create-config.js";
import { i as TransactionStep, n as FeeStep, r as FlowState, t as ApprovalStep } from "./steps.js";
import * as _0xsequence_api_client15 from "@0xsequence/api-client";
import * as react_jsx_runtime30 from "react/jsx-runtime";
import "dnum";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query54 from "@tanstack/react-query";
import "@xstate/store";

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
    orderbookKind: _0xsequence_api_client15.OrderbookKind | undefined;
  };
  listing: {
    price: {
      input: string;
      amountRaw: bigint;
      currency: _0xsequence_api_client15.Currency | null;
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
    available: _0xsequence_api_client15.Currency[];
    selected: _0xsequence_api_client15.Currency | null;
    select: (address: Address$1) => void;
    isConfigured: boolean;
  };
  steps: CreateListingModalSteps;
  flow: FlowState<"transaction">;
  loading: {
    collectible: boolean;
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
    collectible: _tanstack_react_query54.UseQueryResult<_0xsequence_api_client15.TokenMetadata, Error>;
    collection: _tanstack_react_query54.UseQueryResult<_0xsequence_api_client15.ContractInfo, Error>;
    currencies: _tanstack_react_query54.UseQueryResult<_0xsequence_api_client15.Currency[], Error>;
    collectibleBalance: _tanstack_react_query54.UseQueryResult<_0xsequence_api_client15.IndexerTokenBalance, Error>;
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
  orderbookKind?: OrderbookKind$1;
};
//#endregion
//#region src/react/ui/modals/CreateListingModal/Modal.d.ts
declare const CreateListingModal: () => react_jsx_runtime30.JSX.Element | null;
//#endregion
//#region src/react/ui/modals/CreateListingModal/index.d.ts
type ShowCreateListingModalArgs = OpenCreateListingModalArgs;
declare const useCreateListingModal: () => {
  show: (args: ShowCreateListingModalArgs) => void;
  close: () => void;
};
//#endregion
export { CreateListingModalContext as a, OpenCreateListingModalArgs as i, useCreateListingModal as n, useCreateListingModalContext as o, CreateListingModal as r, ShowCreateListingModalArgs as t };
//# sourceMappingURL=index35.d.ts.map