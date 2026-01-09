import { Et as AdditionalFee, Wt as MarketplaceKind, c as CreateReq, d as GenerateListingTransactionRequest, f as GenerateOfferTransactionRequest, ln as WalletKind, p as GenerateSellTransactionRequest, rt as Step, s as ContractType, u as GenerateCancelTransactionRequest } from "./index2.js";
import { A as BuyModalProps, P as WriteContractErrorType, l as TransactionType, m as SdkConfig } from "./create-config.js";
import * as viem45 from "viem";
import { Address, Hex } from "viem";
import * as _tanstack_react_query213 from "@tanstack/react-query";

//#region src/react/hooks/transactions/useBuyTransaction.d.ts
interface UseBuyTransactionOptions {
  modalProps: BuyModalProps;
  primarySalePrice?: {
    amount: bigint | undefined;
    currencyAddress: Address | undefined;
  };
  contractType: ContractType.ERC721 | ContractType.ERC1155;
}
/**
 * Unified hook that handles both market and primary sale transactions
 * Automatically selects the appropriate transaction type based on modal props
 */
declare function useBuyTransaction(options: UseBuyTransactionOptions): {
  data: {
    steps: Step[];
    canBeUsedWithTrails: boolean;
  } | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  refetch: (options?: _tanstack_react_query213.RefetchOptions) => Promise<_tanstack_react_query213.QueryObserverResult<{
    steps: Step[];
    canBeUsedWithTrails: boolean;
  }, Error>>;
};
//#endregion
//#region src/react/hooks/transactions/useCancelOrder.d.ts
interface UseCancelOrderArgs {
  collectionAddress: Address;
  chainId: number;
}
type TransactionStep = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
declare const useCancelOrder: ({
  collectionAddress,
  chainId
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
  generateCancelTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateListingTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query213.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query213.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
//#region src/react/hooks/transactions/useMarketTransactionSteps.d.ts
interface UseMarketTransactionStepsParams {
  chainId: number;
  collectionAddress: Address;
  buyer: Address;
  marketplace: MarketplaceKind;
  orderId: string;
  tokenId: bigint;
  quantity: bigint;
  additionalFees?: AdditionalFee[];
  enabled?: boolean;
}
/**
 * Hook to generate transaction steps for market transactions (secondary sales)
 * This directly calls the marketplace API without using generators
 */
declare function useMarketTransactionSteps({
  chainId,
  collectionAddress,
  buyer,
  marketplace,
  orderId,
  tokenId,
  quantity,
  additionalFees,
  enabled
}: UseMarketTransactionStepsParams): _tanstack_react_query213.UseQueryResult<{
  steps: Step[];
  canBeUsedWithTrails: boolean;
}, Error>;
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
//#region src/react/hooks/transactions/usePrimarySaleTransactionSteps.d.ts
interface UsePrimarySaleTransactionStepsParams {
  chainId: number;
  buyer: Address;
  recipient?: Address;
  salesContractAddress: Address;
  tokenIds: bigint[];
  amounts: number[];
  maxTotal: bigint;
  paymentToken: Address;
  merkleProof?: string[];
  contractType: ContractType.ERC721 | ContractType.ERC1155;
  enabled?: boolean;
}
/**
 * Hook to generate transaction steps for primary sale transactions (minting/shop)
 * This directly creates steps without using generators
 */
declare function usePrimarySaleTransactionSteps({
  chainId,
  buyer,
  recipient,
  salesContractAddress,
  tokenIds,
  amounts,
  maxTotal,
  paymentToken,
  merkleProof,
  contractType,
  enabled
}: UsePrimarySaleTransactionStepsParams): _tanstack_react_query213.UseQueryResult<{
  steps: Step[];
  canBeUsedWithTrails: boolean;
}, Error>;
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
//#region src/react/hooks/transactions/useTransactionExecution.d.ts
declare function useTransactionExecution(): {
  executeSteps: (steps: Step[], chainId: number) => Promise<({
    type: "transaction";
    hash: viem45.Hex;
  } | {
    type: "signature";
    orderId?: string;
    signature?: viem45.Hex;
  })[]>;
};
//#endregion
//#region src/react/hooks/transactions/useTransactionType.d.ts
/**
 * Hook to detect transaction type from modal props
 * Returns TransactionType.PRIMARY_SALE for shop transactions,
 * otherwise returns TransactionType.MARKET_BUY
 */
declare function useTransactionType(modalProps: BuyModalProps): TransactionType;
//#endregion
//#region src/react/hooks/transactions/useTransferTokens.d.ts
interface BaseTransferParams {
  chainId: number;
  collectionAddress: Address;
  tokenId: bigint;
  receiverAddress: Address;
}
interface ERC721TransferParams extends BaseTransferParams {
  contractType: ContractType.ERC721;
}
interface ERC1155TransferParams extends BaseTransferParams {
  contractType: ContractType.ERC1155;
  quantity: bigint;
}
type TransferTokensParams = ERC721TransferParams | ERC1155TransferParams;
interface UseTransferTokensResult {
  transferTokensAsync: (params: TransferTokensParams) => Promise<Address>;
  hash: Address | undefined;
  transferring: boolean;
  transferFailed: boolean;
  transferSuccess: boolean;
  error: WriteContractErrorType | null;
}
declare const useTransferTokens: () => UseTransferTokensResult;
//#endregion
export { generateCancelTransaction as C, useCancelOrder as D, TransactionStep as E, UseBuyTransactionOptions as O, useGenerateListingTransaction as S, useCancelTransactionSteps as T, useGenerateOfferTransaction as _, useTransactionExecution as a, UseGenerateListingTransactionRequest as b, usePrimarySaleTransactionSteps as c, useMarketTransactionSteps as d, generateSellTransaction as f, generateOfferTransaction as g, UseGenerateOfferTransactionRequest as h, useTransactionType as i, useBuyTransaction as k, useOrderSteps as l, GenerateOfferTransactionProps as m, UseTransferTokensResult as n, useProcessStep as o, useGenerateSellTransaction as p, useTransferTokens as r, UsePrimarySaleTransactionStepsParams as s, TransferTokensParams as t, UseMarketTransactionStepsParams as u, CreateReqWithDateExpiry$1 as v, useGenerateCancelTransaction as w, generateListingTransaction as x, GenerateListingTransactionProps as y };
//# sourceMappingURL=index18.d.ts.map