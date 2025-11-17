import { $ as SdkConfig, Cn as GenerateOfferTransactionArgs, Fi as Step, Gt as ContractType, Tn as GenerateSellTransactionArgs, en as CreateReq, ia as WalletKind, l as TransactionType, lt as BuyModalProps, ti as MarketplaceKind, ut as ModalCallbacks, wt as AdditionalFee, xn as GenerateListingTransactionArgs, yn as GenerateCancelTransactionArgs } from "./create-config-CrbgqkBr.js";
import * as _tanstack_react_query107 from "@tanstack/react-query";
import * as viem36 from "viem";
import { Address, Hex } from "viem";

//#region src/react/hooks/transactions/useBuyTransaction.d.ts
/**
 * Unified hook that handles both market and primary sale transactions
 * Automatically selects the appropriate transaction type based on modal props
 */
declare function useBuyTransaction(modalProps: BuyModalProps): {
  data: Step[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  refetch: (options?: _tanstack_react_query107.RefetchOptions) => Promise<_tanstack_react_query107.QueryObserverResult<Step[], Error>>;
};
//#endregion
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
type GenerateCancelTransactionArgsWithNumberChainId = Omit<GenerateCancelTransactionArgs, 'chainId'> & {
  chainId: number;
};
interface UseGenerateCancelTransactionArgs {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
declare const generateCancelTransaction: (args: GenerateCancelTransactionArgsWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateCancelTransaction: (params: UseGenerateCancelTransactionArgs) => {
  generateCancelTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateListingTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query107.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query107.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
//#region src/react/hooks/transactions/useMarketTransactionSteps.d.ts
interface UseMarketTransactionStepsParams {
  chainId: number;
  collectionAddress: Address;
  buyer: Address;
  marketplace: MarketplaceKind;
  orderId: string;
  collectibleId: string;
  quantity: string;
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
  collectibleId,
  quantity,
  additionalFees,
  enabled
}: UseMarketTransactionStepsParams): _tanstack_react_query107.UseQueryResult<Step[], Error>;
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
  tokenIds: string[];
  amounts: number[];
  maxTotal: string;
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
}: UsePrimarySaleTransactionStepsParams): _tanstack_react_query107.UseQueryResult<Step[], Error>;
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
    hash: viem36.Hex;
  } | {
    type: "signature";
    orderId?: string;
    signature?: viem36.Hex;
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
export { useGenerateCancelTransaction as C, useBuyTransaction as D, useCancelOrder as E, generateCancelTransaction as S, TransactionStep as T, CreateReqWithDateExpiry$1 as _, useProcessStep as a, generateListingTransaction as b, useOrderSteps as c, generateSellTransaction as d, useGenerateSellTransaction as f, useGenerateOfferTransaction as g, generateOfferTransaction as h, useTransactionExecution as i, UseMarketTransactionStepsParams as l, UseGenerateOfferTransactionArgs as m, useTransferTokens as n, UsePrimarySaleTransactionStepsParams as o, GenerateOfferTransactionProps as p, useTransactionType as r, usePrimarySaleTransactionSteps as s, TransferTokensParams as t, useMarketTransactionSteps as u, GenerateListingTransactionProps as v, useCancelTransactionSteps as w, useGenerateListingTransaction as x, UseGenerateListingTransactionArgs as y };
//# sourceMappingURL=index-DN9n2gJQ.d.ts.map