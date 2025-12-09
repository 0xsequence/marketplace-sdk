import { vn as QueryArg } from "./create-config.js";
import { t as FeeOption } from "./waas-types.js";
import * as viem30 from "viem";
import { Address, Hex, PublicClient } from "viem";
import * as _tanstack_react_query198 from "@tanstack/react-query";

//#region src/react/hooks/utils/useAutoSelectFeeOption.d.ts
declare enum AutoSelectFeeOptionError {
  UserNotConnected = "User not connected",
  NoOptionsProvided = "No options provided",
  FailedToCheckBalances = "Failed to check balances",
  InsufficientBalanceForAnyFeeOption = "Insufficient balance for any fee option",
}
type UseAutoSelectFeeOptionArgs = {
  pendingFeeOptionConfirmation: {
    id: string;
    options: FeeOption[] | undefined;
    chainId: number;
  };
  enabled?: boolean;
};
declare function useAutoSelectFeeOption({
  pendingFeeOptionConfirmation,
  enabled
}: UseAutoSelectFeeOptionArgs): Promise<{
  selectedOption: null;
  error: AutoSelectFeeOptionError;
  isLoading?: undefined;
} | {
  selectedOption: null;
  error: null;
  isLoading: boolean;
} | {
  selectedOption: FeeOption;
  error: null;
  isLoading?: undefined;
}>;
//#endregion
//#region src/react/hooks/utils/useEnsureCorrectChain.d.ts
declare const useEnsureCorrectChain: () => {
  ensureCorrectChain: (targetChainId: number, callbacks?: {
    onSuccess?: () => void;
  }) => void;
  ensureCorrectChainAsync: (targetChainId: number) => Promise<void | {
    blockExplorers?: {
      [key: string]: {
        name: string;
        url: string;
        apiUrl?: string | undefined;
      };
      default: {
        name: string;
        url: string;
        apiUrl?: string | undefined;
      };
    } | undefined | undefined;
    blockTime?: number | undefined | undefined;
    contracts?: {
      [x: string]: viem30.ChainContract | {
        [sourceId: number]: viem30.ChainContract | undefined;
      } | undefined;
      ensRegistry?: viem30.ChainContract | undefined;
      ensUniversalResolver?: viem30.ChainContract | undefined;
      multicall3?: viem30.ChainContract | undefined;
      erc6492Verifier?: viem30.ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: number;
    name: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
      [key: string]: {
        http: readonly string[];
        webSocket?: readonly string[] | undefined;
      };
      default: {
        http: readonly string[];
        webSocket?: readonly string[] | undefined;
      };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: viem30.ChainFees<viem30.ChainFormatters | undefined> | undefined;
    formatters?: viem30.ChainFormatters | undefined;
    prepareTransactionRequest?: ((args: viem30.PrepareTransactionRequestParameters, options: {
      phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<viem30.PrepareTransactionRequestParameters>) | [fn: ((args: viem30.PrepareTransactionRequestParameters, options: {
      phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<viem30.PrepareTransactionRequestParameters>) | undefined, options: {
      runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: viem30.ChainSerializers<viem30.ChainFormatters | undefined, viem30.TransactionSerializable> | undefined;
  }>;
  currentChainId: number | undefined;
};
//#endregion
//#region src/react/hooks/utils/useGetReceiptFromHash.d.ts
/**
 * Hook to get transaction receipt from hash
 *
 * Provides a function to wait for a transaction receipt using a transaction hash.
 * This is a wagmi-based hook for direct blockchain interaction.
 *
 * @returns Object containing waitForReceipt function
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { waitForReceipt } = useGetReceiptFromHash();
 *
 * // Wait for transaction receipt
 * const receipt = await waitForReceipt('0x123...');
 * console.log('Transaction status:', receipt.status);
 * ```
 *
 * @example
 * In transaction flow:
 * ```typescript
 * const { waitForReceipt } = useGetReceiptFromHash();
 *
 * const handleTransaction = async () => {
 *   try {
 *     const hash = await writeContract({ ... });
 *     const receipt = await waitForReceipt(hash);
 *     if (receipt.status === 'success') {
 *       console.log('Transaction confirmed!');
 *     }
 *   } catch (error) {
 *     console.error('Transaction failed:', error);
 *   }
 * };
 * ```
 */
declare const useGetReceiptFromHash: () => {
  waitForReceipt: (transactionHash: Hex) => Promise<viem30.TransactionReceipt>;
};
//#endregion
//#region src/react/hooks/utils/useRoyalty.d.ts
interface RoyaltyInfo {
  percentage: bigint;
  recipient: Address;
}
interface FetchRoyaltyParams {
  chainId: number;
  collectionAddress: Address;
  tokenId: bigint;
  publicClient: PublicClient | undefined;
}
interface UseRoyaltyArgs {
  chainId: number;
  collectionAddress: Address;
  tokenId: bigint;
  query?: QueryArg;
}
declare function royaltyQueryOptions(params: FetchRoyaltyParams, query?: UseRoyaltyArgs['query']): _tanstack_react_query198.OmitKeyof<_tanstack_react_query198.UseQueryOptions<RoyaltyInfo | null, Error, RoyaltyInfo | null, readonly ["royalty-percentage", {
  chainId: string;
  contractAddress: `0x${string}`;
  tokenId: bigint;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query198.QueryFunction<RoyaltyInfo | null, readonly ["royalty-percentage", {
    chainId: string;
    contractAddress: `0x${string}`;
    tokenId: bigint;
  }], never> | undefined;
} & {
  queryKey: readonly ["royalty-percentage", {
    chainId: string;
    contractAddress: `0x${string}`;
    tokenId: bigint;
  }] & {
    [dataTagSymbol]: RoyaltyInfo | null;
    [dataTagErrorSymbol]: Error;
  };
};
/**
 * Hook to fetch royalty information for a collectible
 *
 * Reads royalty information from the blockchain using the EIP-2981 standard.
 * This hook uses TanStack Query to manage the blockchain call and caching,
 * similar to other data fetching hooks in the SDK.
 *
 * @param args - Configuration parameters
 * @param args.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param args.collectionAddress - The collection contract address
 * @param args.tokenId - The token ID within the collection
 * @param args.query - Optional TanStack Query configuration
 *
 * @returns Query result containing royalty information (percentage and recipient) or null
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useRoyalty({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 *
 * if (data) {
 *   console.log('Royalty:', data.percentage, 'Recipient:', data.recipient)
 * }
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useRoyalty({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     refetchInterval: 60000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
declare function useRoyalty(args: UseRoyaltyArgs): _tanstack_react_query198.UseQueryResult<RoyaltyInfo | null, Error>;
//#endregion
export { useRoyalty as a, useAutoSelectFeeOption as c, royaltyQueryOptions as i, RoyaltyInfo as n, useGetReceiptFromHash as o, UseRoyaltyArgs as r, useEnsureCorrectChain as s, FetchRoyaltyParams as t };
//# sourceMappingURL=index19.d.ts.map