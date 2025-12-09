import { $ as GenerateCancelTransactionRequest, Er as Step$2, J as ContractType$1, Jt as Step$1, Qt as WalletKind$1, R as BuyModalProps, Y as CreateReq$1, _ as SdkConfig, et as GenerateListingTransactionRequest, f as TransactionType, kt as MarketplaceKind$1, nt as GenerateSellTransactionRequest, tt as GenerateOfferTransactionRequest } from "./create-config.js";
import * as _0xsequence_api_client225 from "@0xsequence/api-client";
import { AdditionalFee, MarketplaceKind, Step } from "@0xsequence/api-client";
import * as viem28 from "viem";
import { Address as Address$1, Hex } from "viem";
import * as _tanstack_react_query196 from "@tanstack/react-query";
import { WriteContractErrorType } from "wagmi/actions";

//#region src/react/hooks/transactions/useBuyTransaction.d.ts
/**
 * Unified hook that handles both market and primary sale transactions
 * Automatically selects the appropriate transaction type based on modal props
 */
declare function useBuyTransaction(modalProps: BuyModalProps): {
  data: _0xsequence_api_client225.Step[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  refetch: (options?: _tanstack_react_query196.RefetchOptions) => Promise<_tanstack_react_query196.QueryObserverResult<_0xsequence_api_client225.Step[], Error>>;
};
//#endregion
//#region src/react/hooks/transactions/useCancelOrder.d.ts
interface UseCancelOrderArgs {
  collectionAddress: Address$1;
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
    marketplace: MarketplaceKind$1;
  }) => Promise<void>;
  isExecuting: boolean;
  cancellingOrderId: string | null;
};
//#endregion
//#region src/react/hooks/transactions/useCancelTransactionSteps.d.ts
interface UseCancelTransactionStepsArgs {
  collectionAddress: Address$1;
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
    marketplace: MarketplaceKind$1;
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
  generateCancelTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionRequestWithNumberChainId, unknown>;
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
  onSuccess?: (data?: Step$1[]) => void;
};
type CreateReqWithDateExpiry$1 = Omit<CreateReq$1, 'expiry'> & {
  expiry: Date;
};
type GenerateListingTransactionProps = Omit<GenerateListingTransactionRequest, 'listing'> & {
  listing: CreateReqWithDateExpiry$1;
};
type GenerateListingTransactionRequestWithNumberChainId = Omit<GenerateListingTransactionRequest, 'chainId' | 'listing'> & {
  chainId: number;
  listing: CreateReqWithDateExpiry$1;
};
declare const generateListingTransaction: (params: GenerateListingTransactionRequestWithNumberChainId, config: SdkConfig) => Promise<Step$1[]>;
declare const useGenerateListingTransaction: (params: UseGenerateListingTransactionRequest) => {
  generateListingTransaction: _tanstack_react_query196.UseMutateFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query196.UseMutateFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query196.UseMutateFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query196.UseMutateFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$2[], Error, Omit<GenerateListingTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: Step$2[];
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
  onSuccess?: (data?: Step$1[]) => void;
};
type CreateReqWithDateExpiry = Omit<CreateReq$1, 'expiry'> & {
  expiry: Date;
};
type GenerateOfferTransactionProps = Omit<GenerateOfferTransactionRequest, 'offer'> & {
  offer: CreateReqWithDateExpiry;
};
type GenerateOfferTransactionRequestWithNumberChainId = Omit<GenerateOfferTransactionRequest, 'chainId' | 'offer'> & {
  chainId: number;
  offer: CreateReqWithDateExpiry;
};
declare const generateOfferTransaction: (params: GenerateOfferTransactionRequestWithNumberChainId, config: SdkConfig, walletKind?: WalletKind$1) => Promise<Step$1[]>;
declare const useGenerateOfferTransaction: (params: UseGenerateOfferTransactionRequest) => {
  generateOfferTransaction: _tanstack_react_query196.UseMutateFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query196.UseMutateFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query196.UseMutateFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query196.UseMutateFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step$1[], Error, Omit<GenerateOfferTransactionRequestWithNumberChainId, "chainId">, unknown>;
  data: Step$1[];
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
  generateSellTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query196.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query196.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionRequestWithNumberChainId, "chainId">, unknown>;
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
  collectionAddress: Address$1;
  buyer: Address$1;
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
}: UseMarketTransactionStepsParams): _tanstack_react_query196.UseQueryResult<Step[], Error>;
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
  buyer: Address$1;
  recipient?: Address$1;
  salesContractAddress: Address$1;
  tokenIds: bigint[];
  amounts: number[];
  maxTotal: bigint;
  paymentToken: Address$1;
  merkleProof?: string[];
  contractType: ContractType$1.ERC721 | ContractType$1.ERC1155;
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
}: UsePrimarySaleTransactionStepsParams): _tanstack_react_query196.UseQueryResult<Step[], Error>;
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
  processStep: (step: Step$1, chainId: number) => Promise<ProcessStepResult>;
};
//#endregion
//#region src/react/hooks/transactions/useTransactionExecution.d.ts
declare function useTransactionExecution(): {
  executeSteps: (steps: Step$1[], chainId: number) => Promise<({
    type: "transaction";
    hash: viem28.Hex;
  } | {
    type: "signature";
    orderId?: string;
    signature?: viem28.Hex;
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
  collectionAddress: Address$1;
  tokenId: bigint;
  receiverAddress: Address$1;
}
interface ERC721TransferParams extends BaseTransferParams {
  contractType: ContractType$1.ERC721;
}
interface ERC1155TransferParams extends BaseTransferParams {
  contractType: ContractType$1.ERC1155;
  quantity: bigint;
}
type TransferTokensParams = ERC721TransferParams | ERC1155TransferParams;
interface UseTransferTokensResult {
  transferTokensAsync: (params: TransferTokensParams) => Promise<Address$1>;
  hash: Address$1 | undefined;
  transferring: boolean;
  transferFailed: boolean;
  transferSuccess: boolean;
  error: WriteContractErrorType | null;
}
declare const useTransferTokens: () => UseTransferTokensResult;
//#endregion
export { generateCancelTransaction as C, useCancelOrder as D, TransactionStep as E, useBuyTransaction as O, useGenerateListingTransaction as S, useCancelTransactionSteps as T, useGenerateOfferTransaction as _, useTransactionExecution as a, UseGenerateListingTransactionRequest as b, usePrimarySaleTransactionSteps as c, useMarketTransactionSteps as d, generateSellTransaction as f, generateOfferTransaction as g, UseGenerateOfferTransactionRequest as h, useTransactionType as i, useOrderSteps as l, GenerateOfferTransactionProps as m, UseTransferTokensResult as n, useProcessStep as o, useGenerateSellTransaction as p, useTransferTokens as r, UsePrimarySaleTransactionStepsParams as s, TransferTokensParams as t, UseMarketTransactionStepsParams as u, CreateReqWithDateExpiry$1 as v, useGenerateCancelTransaction as w, generateListingTransaction as x, GenerateListingTransactionProps as y };
//# sourceMappingURL=index15.d.ts.map