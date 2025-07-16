import { ContractType, CreateReq, GenerateCancelTransactionArgs, GenerateListingTransactionArgs, GenerateOfferTransactionArgs, GenerateSellTransactionArgs, MarketplaceKind, SdkConfig, Step, WalletKind } from "./create-config-DxYEfdhK.js";
import { ModalCallbacks } from "./types-BYMSlTl8.js";
import * as _tanstack_react_query1 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/hooks/transactions/useCancelOrder.d.ts
interface UseCancelOrderArgs {
  collectionAddress: string;
  chainId: number;
  onSuccess?: ({
    hash,
    orderId
  }: {
    hash?: string;
    orderId?: string;
  }) => void;
  onError?: (error: Error) => void;
}
type TransactionStep = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
declare const useCancelOrder: ({
  collectionAddress,
  chainId,
  onSuccess,
  onError
}: UseCancelOrderArgs) => {
  cancelOrder: (params: {
    orderId: string;
    marketplace: MarketplaceKind;
  }) => Promise<void>;
  isExecuting: boolean;
  cancellingOrderId: string | null;
};
//#endregion
//#region src/react/hooks/transactions/useCancelTransactionSteps.d.ts
interface UseCancelTransactionStepsArgs {
  collectionAddress: string;
  chainId: number;
  callbacks?: ModalCallbacks;
  setSteps: React.Dispatch<React.SetStateAction<TransactionStep>>;
  onSuccess?: ({
    hash,
    orderId
  }: {
    hash?: string;
    orderId?: string;
  }) => void;
  onError?: (error: Error) => void;
}
declare const useCancelTransactionSteps: ({
  collectionAddress,
  chainId,
  callbacks,
  setSteps,
  onSuccess,
  onError
}: UseCancelTransactionStepsArgs) => {
  cancelOrder: ({
    orderId,
    marketplace
  }: {
    orderId: string;
    marketplace: MarketplaceKind;
  }) => Promise<void>;
};
//#endregion
//#region src/react/hooks/transactions/useGenerateCancelTransaction.d.ts
type GenerateCancelTransactionArgsWithNumberChainId = Omit<GenerateCancelTransactionArgs, 'chainId'> & {
  chainId: number;
};
interface UseGenerateCancelTransactionArgs {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
declare const generateCancelTransaction: (args: GenerateCancelTransactionArgsWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateCancelTransaction: (params: UseGenerateCancelTransactionArgs) => {
  generateCancelTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  data: undefined;
  variables: undefined;
  error: null;
  isError: false;
  isIdle: true;
  isPending: false;
  isSuccess: false;
  status: "idle";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateCancelTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  data: undefined;
  variables: GenerateCancelTransactionArgsWithNumberChainId;
  error: null;
  isError: false;
  isIdle: false;
  isPending: true;
  isSuccess: false;
  status: "pending";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateCancelTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  data: undefined;
  error: Error;
  variables: GenerateCancelTransactionArgsWithNumberChainId;
  isError: true;
  isIdle: false;
  isPending: false;
  isSuccess: false;
  status: "error";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateCancelTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  data: Step[];
  error: null;
  variables: GenerateCancelTransactionArgsWithNumberChainId;
  isError: false;
  isIdle: false;
  isPending: false;
  isSuccess: true;
  status: "success";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
};
//#endregion
//#region src/react/hooks/transactions/useGenerateListingTransaction.d.ts
type UseGenerateListingTransactionArgs = {
  chainId: number;
  onSuccess?: (data?: Step[]) => void;
};
type CreateReqWithDateExpiry$1 = Omit<CreateReq, 'expiry'> & {
  expiry: Date;
};
type GenerateListingTransactionProps = Omit<GenerateListingTransactionArgs, 'listing'> & {
  listing: CreateReqWithDateExpiry$1;
};
type GenerateListingTransactionArgsWithNumberChainId = Omit<GenerateListingTransactionArgs, 'chainId' | 'listing'> & {
  chainId: number;
  listing: CreateReqWithDateExpiry$1;
};
declare const generateListingTransaction: (params: GenerateListingTransactionArgsWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateListingTransaction: (params: UseGenerateListingTransactionArgs) => {
  generateListingTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: undefined;
  error: null;
  isError: false;
  isIdle: true;
  isPending: false;
  isSuccess: false;
  status: "idle";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateListingTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">;
  error: null;
  isError: false;
  isIdle: false;
  isPending: true;
  isSuccess: false;
  status: "pending";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateListingTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  error: Error;
  variables: Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">;
  isError: true;
  isIdle: false;
  isPending: false;
  isSuccess: false;
  status: "error";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateListingTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: Step[];
  error: null;
  variables: Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">;
  isError: false;
  isIdle: false;
  isPending: false;
  isSuccess: true;
  status: "success";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
};
//#endregion
//#region src/react/hooks/transactions/useGenerateOfferTransaction.d.ts
type UseGenerateOfferTransactionArgs = {
  chainId: number;
  onSuccess?: (data?: Step[]) => void;
};
type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
  expiry: Date;
};
type GenerateOfferTransactionProps = Omit<GenerateOfferTransactionArgs, 'offer'> & {
  offer: CreateReqWithDateExpiry;
};
type GenerateOfferTransactionArgsWithNumberChainId = Omit<GenerateOfferTransactionArgs, 'chainId' | 'offer'> & {
  chainId: number;
  offer: CreateReqWithDateExpiry;
};
declare const generateOfferTransaction: (params: GenerateOfferTransactionArgsWithNumberChainId, config: SdkConfig, walletKind?: WalletKind) => Promise<Step[]>;
declare const useGenerateOfferTransaction: (params: UseGenerateOfferTransactionArgs) => {
  generateOfferTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: undefined;
  error: null;
  isError: false;
  isIdle: true;
  isPending: false;
  isSuccess: false;
  status: "idle";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateOfferTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">;
  error: null;
  isError: false;
  isIdle: false;
  isPending: true;
  isSuccess: false;
  status: "pending";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateOfferTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  error: Error;
  variables: Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">;
  isError: true;
  isIdle: false;
  isPending: false;
  isSuccess: false;
  status: "error";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateOfferTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: Step[];
  error: null;
  variables: Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">;
  isError: false;
  isIdle: false;
  isPending: false;
  isSuccess: true;
  status: "success";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
};
//#endregion
//#region src/react/hooks/transactions/useGenerateSellTransaction.d.ts
interface UseGenerateSellTransactionArgs {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
type GenerateSellTransactionArgsWithNumberChainId = Omit<GenerateSellTransactionArgs, 'chainId'> & {
  chainId: number;
};
declare const generateSellTransaction: (args: GenerateSellTransactionArgsWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateSellTransaction: (params: UseGenerateSellTransactionArgs) => {
  generateSellTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: undefined;
  error: null;
  isError: false;
  isIdle: true;
  isPending: false;
  isSuccess: false;
  status: "idle";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateSellTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">;
  error: null;
  isError: false;
  isIdle: false;
  isPending: true;
  isSuccess: false;
  status: "pending";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateSellTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  error: Error;
  variables: Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">;
  isError: true;
  isIdle: false;
  isPending: false;
  isSuccess: false;
  status: "error";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
} | {
  generateSellTransaction: _tanstack_react_query1.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query1.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  data: Step[];
  error: null;
  variables: Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">;
  isError: false;
  isIdle: false;
  isPending: false;
  isSuccess: true;
  status: "success";
  reset: () => void;
  context: unknown;
  failureCount: number;
  failureReason: Error | null;
  isPaused: boolean;
  submittedAt: number;
};
//#endregion
//#region src/react/hooks/transactions/useOrderSteps.d.ts
declare const useOrderSteps: () => {
  executeStep: ({
    step,
    chainId
  }: {
    step: Step;
    chainId: number;
  }) => Promise<`0x${string}` | undefined>;
};
//#endregion
//#region src/react/hooks/transactions/useTransferTokens.d.ts
interface BaseTransferParams {
  chainId: number;
  collectionAddress: Address;
  tokenId: string;
  receiverAddress: Address;
}
interface ERC721TransferParams extends BaseTransferParams {
  contractType: ContractType.ERC721;
}
interface ERC1155TransferParams extends BaseTransferParams {
  contractType: ContractType.ERC1155;
  quantity: string;
}
type TransferTokensParams = ERC721TransferParams | ERC1155TransferParams;
declare const useTransferTokens: () => {
  transferTokensAsync: (params: TransferTokensParams) => Promise<`0x${string}`>;
  hash: `0x${string}` | undefined;
  transferring: boolean;
  transferFailed: boolean;
  transferSuccess: boolean;
};
//#endregion
export { CreateReqWithDateExpiry$1 as CreateReqWithDateExpiry, GenerateListingTransactionProps, GenerateOfferTransactionProps, TransactionStep, TransferTokensParams, UseGenerateListingTransactionArgs, UseGenerateOfferTransactionArgs, generateCancelTransaction, generateListingTransaction, generateOfferTransaction, generateSellTransaction, useCancelOrder, useCancelTransactionSteps, useGenerateCancelTransaction, useGenerateListingTransaction, useGenerateOfferTransaction, useGenerateSellTransaction, useOrderSteps, useTransferTokens };
//# sourceMappingURL=index-XNKX9i3v.d.ts.map