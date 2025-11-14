import { At as ContractType, Ci as Step, G as SdkConfig, Ki as WalletKind, Ur as MarketplaceKind, cn as GenerateOfferTransactionRequest, in as GenerateCancelTransactionRequest, nt as ModalCallbacks, on as GenerateListingTransactionRequest, un as GenerateSellTransactionRequest, zt as CreateReq } from "./create-config-BO68TZC5.js";
import * as _tanstack_react_query312 from "@tanstack/react-query";
import { Address, Hex } from "viem";

//#region src/react/hooks/transactions/useCancelOrder.d.ts
interface UseCancelOrderArgs {
  collectionAddress: Address;
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
  collectionAddress: Address;
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
type GenerateCancelTransactionRequestWithNumberChainId = Omit<GenerateCancelTransactionRequest, 'chainId'> & {
  chainId: number;
};
interface UseGenerateCancelTransactionRequest {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
declare const generateCancelTransaction: (args: GenerateCancelTransactionRequestWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateCancelTransaction: (params: UseGenerateCancelTransactionRequest) => {
  generateCancelTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  data: undefined;
  variables: GenerateCancelTransactionRequestWithNumberChainId;
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
  generateCancelTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  data: undefined;
  error: Error;
  variables: GenerateCancelTransactionRequestWithNumberChainId;
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
  generateCancelTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  data: Step[];
  error: null;
  variables: GenerateCancelTransactionRequestWithNumberChainId;
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
type UseGenerateListingTransactionRequest = {
  chainId: number;
  onSuccess?: (data?: Step[]) => void;
};
type CreateReqWithDateExpiry$1 = Omit<CreateReq, 'expiry'> & {
  expiry: Date;
};
type GenerateListingTransactionProps = Omit<GenerateListingTransactionRequest, 'listing'> & {
  listing: CreateReqWithDateExpiry$1;
};
type GenerateListingTransactionRequestWithNumberChainId = Omit<GenerateListingTransactionRequest, 'chainId' | 'listing'> & {
  chainId: number;
  listing: CreateReqWithDateExpiry$1;
};
declare const generateListingTransaction: (params: GenerateListingTransactionRequestWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateListingTransaction: (params: UseGenerateListingTransactionRequest) => {
  generateListingTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">;
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
  generateListingTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  error: Error;
  variables: Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">;
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
  generateListingTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: Step[];
  error: null;
  variables: Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">;
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
type UseGenerateOfferTransactionRequest = {
  chainId: number;
  onSuccess?: (data?: Step[]) => void;
};
type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
  expiry: Date;
};
type GenerateOfferTransactionProps = Omit<GenerateOfferTransactionRequest, 'offer'> & {
  offer: CreateReqWithDateExpiry;
};
type GenerateOfferTransactionRequestWithNumberChainId = Omit<GenerateOfferTransactionRequest, 'chainId' | 'offer'> & {
  chainId: number;
  offer: CreateReqWithDateExpiry;
};
declare const generateOfferTransaction: (params: GenerateOfferTransactionRequestWithNumberChainId, config: SdkConfig, walletKind?: WalletKind) => Promise<Step[]>;
declare const useGenerateOfferTransaction: (params: UseGenerateOfferTransactionRequest) => {
  generateOfferTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">;
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
  generateOfferTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  error: Error;
  variables: Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">;
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
  generateOfferTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: Step[];
  error: null;
  variables: Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">;
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
interface UseGenerateSellTransactionRequest {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
type GenerateSellTransactionRequestWithNumberChainId = Omit<GenerateSellTransactionRequest, 'chainId'> & {
  chainId: number;
};
declare const generateSellTransaction: (args: GenerateSellTransactionRequestWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateSellTransaction: (params: UseGenerateSellTransactionRequest) => {
  generateSellTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  variables: Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">;
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
  generateSellTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: undefined;
  error: Error;
  variables: Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">;
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
  generateSellTransaction: _tanstack_react_query312.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query312.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: Step[];
  error: null;
  variables: Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">;
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
//#region src/react/hooks/transactions/useProcessStep.d.ts
type ProcessStepResult = {
  type: 'transaction';
  hash: Hex;
} | {
  type: 'signature';
  orderId?: string;
  signature?: Hex;
};
declare const useProcessStep: () => {
  processStep: (step: Step, chainId: number) => Promise<ProcessStepResult>;
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
export { useGenerateCancelTransaction as _, generateSellTransaction as a, useCancelOrder as b, UseGenerateOfferTransactionRequest as c, CreateReqWithDateExpiry$1 as d, GenerateListingTransactionProps as f, generateCancelTransaction as g, useGenerateListingTransaction as h, useOrderSteps as i, generateOfferTransaction as l, generateListingTransaction as m, useTransferTokens as n, useGenerateSellTransaction as o, UseGenerateListingTransactionRequest as p, useProcessStep as r, GenerateOfferTransactionProps as s, TransferTokensParams as t, useGenerateOfferTransaction as u, useCancelTransactionSteps as v, TransactionStep as y };
//# sourceMappingURL=index-Cq5DWN3N.d.ts.map