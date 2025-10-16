import { CheckoutOptionsItem, CheckoutOptionsSalesContractReturn, CollectiblePrimarySaleItem, ContractType, GetCountOfPrimarySaleItemsReturn, ListPrimarySaleItemsReturn, MarketplaceSdkContext$1 as MarketplaceSdkContext, Optional, PrimarySaleItem, QueryArg, SdkConfig, TokenMetadata } from "./create-config-BpPJGqAC.js";
import { CheckoutOptionsSalesContractQueryOptions, CollectiblesResponse, ComparePricesQueryOptions, ComparePricesReturn, ConvertPriceToUSDQueryOptions, ConvertPriceToUSDReturn, ListPrimarySaleItemsQueryOptions, UseCountOfPrimarySaleItemsArgs, UseInventoryArgs, fetchCheckoutOptionsSalesContract$1 as fetchCheckoutOptionsSalesContract } from "./index-DZmZlG0I.js";
import * as react0 from "react";
import * as _tanstack_react_query97 from "@tanstack/react-query";
import * as _tanstack_react_query98 from "@tanstack/react-query";
import * as _tanstack_react_query99 from "@tanstack/react-query";
import * as _tanstack_react_query79 from "@tanstack/react-query";
import * as _tanstack_react_query34 from "@tanstack/react-query";
import * as _tanstack_react_query35 from "@tanstack/react-query";
import * as _tanstack_react_query7 from "@tanstack/react-query";
import * as _tanstack_react_query55 from "@tanstack/react-query";
import * as _tanstack_react_query100 from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";
import * as _0xsequence_indexer1 from "@0xsequence/indexer";
import { TokenMetadata as TokenMetadata$1 } from "@0xsequence/metadata";
import * as react_jsx_runtime0 from "react/jsx-runtime";
import * as viem31 from "viem";
import * as viem1 from "viem";
import * as viem13 from "viem";
import * as viem14 from "viem";
import { Address, Hex } from "viem";

//#region src/react/hooks/data/primary-sales/useCountOfPrimarySaleItems.d.ts
declare function useCountOfPrimarySaleItems(args: UseCountOfPrimarySaleItemsArgs): _tanstack_react_query97.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/data/primary-sales/useErc721SalesData.d.ts
interface UseErc721CollectionDataProps {
  chainId: number;
  salesContractAddress: Address;
  itemsContractAddress: Address;
  enabled: boolean;
}
declare function useErc721SaleDetails({
  chainId,
  salesContractAddress,
  itemsContractAddress,
  enabled
}: UseErc721CollectionDataProps): {
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | {
    remainingSupply: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
  quantityMinted: bigint | undefined;
  quantityTotal: bigint | undefined;
  quantityRemaining: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
};
//#endregion
//#region src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.d.ts
type UseGetCountParams = Optional<ListPrimarySaleItemsQueryOptions, 'config'>;
/**
 * Hook to get the total count of primary sale items
 *
 * Retrieves the total count of primary sale items for a specific contract address
 * from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.filter - Optional filter parameters for the query
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of primary sale items
 *
 * @example
 * ```typescript
 * const { data: count, isLoading } = useGetCountOfPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 * })
 * ```
 */
declare function useGetCountOfPrimarySaleItems(params: UseGetCountParams): _tanstack_react_query98.UseQueryResult<GetCountOfPrimarySaleItemsReturn, Error>;
//#endregion
//#region src/react/hooks/data/primary-sales/useList721ShopCardData.d.ts
interface UseList721ShopCardDataProps {
  primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
}
declare function useList721ShopCardData({
  primarySaleItemsWithMetadata,
  chainId,
  contractAddress,
  salesContractAddress,
  enabled
}: UseList721ShopCardDataProps): {
  salePrice: {
    amount: string;
    currencyAddress: Address;
  } | {
    amount: string;
    currencyAddress: "0x0000000000000000000000000000000000000000";
  };
  collectibleCards: ({
    collectibleId: string;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType.ERC721;
    tokenMetadata: TokenMetadata;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: string;
      currencyAddress: Address;
    };
    quantityInitial: string;
    quantityRemaining: string;
    quantityDecimals: number;
    saleStartsAt: string;
    saleEndsAt: string;
    cardType: "shop";
  } | {
    collectibleId: string;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType.ERC721;
    tokenMetadata: TokenMetadata$1;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: string;
      currencyAddress: "0x0000000000000000000000000000000000000000";
    };
    quantityInitial: undefined;
    quantityRemaining: undefined;
    quantityDecimals: number;
    saleStartsAt: undefined;
    saleEndsAt: undefined;
    cardType: "shop";
  })[];
  saleDetailsError: viem31.ReadContractErrorType | null;
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | {
    remainingSupply: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
  isLoading: boolean;
  tokenSuppliesData: _tanstack_react_query99.InfiniteData<_0xsequence_indexer1.GetTokenSuppliesReturn, unknown> | undefined;
};
//#endregion
//#region src/react/hooks/data/primary-sales/useList1155ShopCardData.d.ts
interface UseList1155ShopCardDataProps {
  primarySaleItemsWithMetadata: Array<{
    metadata: TokenMetadata;
    primarySaleItem: PrimarySaleItem;
  }>;
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
}
declare function useList1155ShopCardData({
  primarySaleItemsWithMetadata,
  chainId,
  contractAddress,
  salesContractAddress,
  enabled
}: UseList1155ShopCardDataProps): {
  collectibleCards: {
    collectibleId: string;
    chainId: number;
    collectionAddress: `0x${string}`;
    collectionType: ContractType.ERC1155;
    tokenMetadata: TokenMetadata;
    cardLoading: boolean;
    salesContractAddress: `0x${string}`;
    salePrice: {
      amount: string;
      currencyAddress: Address;
    };
    quantityInitial: string;
    quantityDecimals: number;
    quantityRemaining: string;
    unlimitedSupply: boolean;
    saleStartsAt: string;
    saleEndsAt: string;
    cardType: "shop";
  }[];
  tokenMetadataError: null;
  tokenSaleDetailsError: null;
  isLoading: boolean;
};
//#endregion
//#region src/react/hooks/data/inventory/useInventory.d.ts
declare function useInventory(args: UseInventoryArgs): _tanstack_react_query79.UseQueryResult<CollectiblesResponse, Error>;
//#endregion
//#region src/types/waas-types.d.ts
type FeeOption = {
  gasLimit: number;
  to: string;
  token: {
    chainId: number;
    contractAddress: string | null;
    decimals: number;
    logoURL: string;
    name: string;
    symbol: string;
    tokenID: string | null;
    type: string;
  };
  value: string;
};
//#endregion
//#region src/react/hooks/utils/useWaasFeeOptions.d.ts
/**
 * Options for the useWaasFeeOptions hook
 *
 * @property {boolean} skipFeeBalanceCheck - Whether to skip checking token balances (default: false)
 */
interface WaasFeeOptionsConfig {
  /** Whether to skip checking token balances (default: false) */
  skipFeeBalanceCheck?: boolean;
}
/**
 * Hook for handling WaaS (Wallet as a Service) fee options for unsponsored transactions
 *
 * This hook provides functionality to:
 * - Get available fee options for a transaction in Native Token and ERC20's
 * - Provide user wallet balances for each fee option
 * - Confirm or reject fee selections
 *
 * @param options - Configuration options for the hook {@link WaasFeeOptionsConfig}
 * @returns Array containing the confirmation state and control functions {@link UseWaasFeeOptionsReturnType}
 *
 * @example
 * ```tsx
 *   // Use the hook with default balance checking, this will fetch the user's wallet balances for each fee option and provide them in the UseWaasFeeOptionsReturn
 *   const [
 *     pendingFeeOptionConfirmation,
 *     confirmPendingFeeOption,
 *     rejectPendingFeeOption
 *   ] = useWaasFeeOptions();
 *
 *   // Or skip balance checking if needed
 *   // const [pendingFeeOptionConfirmation, confirmPendingFeeOption, rejectPendingFeeOption] =
 *   //   useWaasFeeOptions({ skipFeeBalanceCheck: true });
 *
 *   const [selectedFeeOptionTokenName, setSelectedFeeOptionTokenName] = useState<string>();
 *   const [feeOptionAlert, setFeeOptionAlert] = useState<AlertProps>();
 *
 *   // Initialize with first option when fee options become available
 *   useEffect(() => {
 *     if (pendingFeeOptionConfirmation) {
 *       console.log('Pending fee options: ', pendingFeeOptionConfirmation.options)
 *     }
 *   }, [pendingFeeOptionConfirmation]);
 *
 * ```
 */
//#endregion
//#region src/react/hooks/utils/useAutoSelectFeeOption.d.ts
declare enum AutoSelectFeeOptionError {
  UserNotConnected = "User not connected",
  NoOptionsProvided = "No options provided",
  FailedToCheckBalances = "Failed to check balances",
  InsufficientBalanceForAnyFeeOption = "Insufficient balance for any fee option",
}
type UseAutoSelectFeeOptionArgsInternal = {
  enabled?: boolean;
  waasFeeOptionsConfig?: WaasFeeOptionsConfig;
};
type UseAutoSelectFeeOptionArgsExternal = {
  pendingFeeOptionConfirmation: {
    id: string;
    options: FeeOption[] | undefined;
    chainId: number;
  };
  enabled?: boolean;
};
type UseAutoSelectFeeOptionArgs = UseAutoSelectFeeOptionArgsInternal | UseAutoSelectFeeOptionArgsExternal;
/**
 * A React hook that automatically selects the first fee option for which the user has sufficient balance.
 *
 * This hook can be used in two modes:
 * 1. Internal mode: Uses current wallet chain ID and fetches fee options internally
 * 2. External mode: Pass pendingFeeOptionConfirmation from useWaasFeeOptions (backwards compatible)
 *
 * @param {UseAutoSelectFeeOptionArgs} args - Configuration for fee option selection (optional)
 *
 * @returns {Promise<{
 *   selectedOption: FeeOption | null,
 *   error: AutoSelectFeeOptionError | null,
 *   isLoading?: boolean
 * }>} A promise that resolves to an object containing:
 *   - selectedOption: The first fee option with sufficient balance, or null if none found
 *   - error: Error message if selection fails, null otherwise
 *   - isLoading: True while checking balances
 *
 * @throws {AutoSelectFeeOptionError} Possible errors:
 *   - UserNotConnected: When no wallet is connected
 *   - NoOptionsProvided: When fee options array is undefined
 *   - FailedToCheckBalances: When balance checking fails
 *   - InsufficientBalanceForAnyFeeOption: When user has insufficient balance for all options
 *
 * @example
 * ```tsx
 * // New internal mode (recommended)
 * function MyComponent() {
 *   const autoSelectOptionPromise = useAutoSelectFeeOption();
 *
 *   useEffect(() => {
 *     autoSelectOptionPromise.then((result) => {
 *       if (result.isLoading) {
 *         console.log('Checking balances...');
 *         return;
 *       }
 *
 *       if (result.error) {
 *         console.error('Failed to select fee option:', result.error);
 *         return;
 *       }
 *
 *       console.log('Auto-selected option:', result.selectedOption);
 *     });
 *   }, [autoSelectOptionPromise]);
 *
 *   return <div>...</div>;
 * }
 *
 * // Backwards compatible external mode
 * function MyLegacyComponent() {
 *   const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
 *
 *   const autoSelectOptionPromise = useAutoSelectFeeOption({
 *     pendingFeeOptionConfirmation: pendingFeeOptionConfirmation
 *       ? {
 *           id: pendingFeeOptionConfirmation.id,
 *           options: pendingFeeOptionConfirmation.options,
 *           chainId: 1
 *         }
 *       : {
 *           id: '',
 *           options: undefined,
 *           chainId: 1
 *         }
 *   });
 *
 *   // ... rest of the logic
 * }
 * ```
 */
declare function useAutoSelectFeeOption(args?: UseAutoSelectFeeOptionArgs): Promise<{
  selectedOption: null;
  error: AutoSelectFeeOptionError;
  isLoading?: undefined;
} | {
  selectedOption: null;
  error: null;
  isLoading: boolean;
} | {
  selectedOption: any;
  error: null;
  isLoading?: undefined;
}>;
//#endregion
//#region src/react/hooks/utils/useCheckoutOptionsSalesContract.d.ts
type UseCheckoutOptionsSalesContractParams = Optional<CheckoutOptionsSalesContractQueryOptions, 'config' | 'walletAddress'>;
/**
 * Hook to fetch checkout options for sales contract items
 *
 * Retrieves checkout options including available payment methods, fees, and transaction details
 * for items from a sales contract. Requires a connected wallet to calculate wallet-specific options.
 *
 * @param params - Configuration parameters or skipToken to skip the query
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The sales contract address
 * @param params.collectionAddress - The collection contract address
 * @param params.items - Array of items to purchase with tokenId and quantity
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing checkout options with payment methods and fees
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: checkoutOptions, isLoading } = useCheckoutOptionsSalesContract({
 *   chainId: 137,
 *   contractAddress: '0x1234...',
 *   collectionAddress: '0x5678...',
 *   items: [{
 *     tokenId: '1',
 *     quantity: '1'
 *   }]
 * })
 * ```
 *
 * @example
 * With skipToken to conditionally skip:
 * ```typescript
 * const { data: checkoutOptions } = useCheckoutOptionsSalesContract(
 *   items.length > 0 ? {
 *     chainId: 1,
 *     contractAddress: contractAddress,
 *     collectionAddress: collectionAddress,
 *     items: items
 *   } : skipToken
 * )
 * ```
 */
declare function useCheckoutOptionsSalesContract(params: UseCheckoutOptionsSalesContractParams | typeof skipToken): _tanstack_react_query34.UseQueryResult<CheckoutOptionsSalesContractReturn, Error>;
type UseCheckoutOptionsSalesContractArgs = {
  chainId: number;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
};
type UseCheckoutOptionsSalesContractReturn = Awaited<ReturnType<typeof fetchCheckoutOptionsSalesContract>>;
//#endregion
//#region src/react/hooks/utils/useComparePrices.d.ts
type UseComparePricesParams = Optional<ComparePricesQueryOptions, 'config'>;
/**
 * Hook to compare prices between different currencies by converting both to USD
 *
 * Compares two prices by converting both to USD using real-time exchange rates
 * and returns the percentage difference with comparison status.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.priceAmountRaw - The raw amount of the first price (wei format)
 * @param params.priceCurrencyAddress - The currency address of the first price
 * @param params.compareToPriceAmountRaw - The raw amount of the second price to compare against (wei format)
 * @param params.compareToPriceCurrencyAddress - The currency address of the second price
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing percentage difference and comparison status
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: comparison, isLoading } = useComparePrices({
 *   chainId: 1,
 *   priceAmountRaw: '1000000000000000000', // 1 ETH in wei
 *   priceCurrencyAddress: '0x0000000000000000000000000000000000000000', // ETH
 *   compareToPriceAmountRaw: '2000000000', // 2000 USDC in wei (6 decimals)
 *   compareToPriceCurrencyAddress: '0xA0b86a33E6B8DbF5E71Eaa9bfD3F6fD8e8Be3F69' // USDC
 * })
 *
 * if (data) {
 *   console.log(`${data.percentageDifferenceFormatted}% ${data.status}`);
 *   // e.g., "25.50% above" or "10.25% below"
 * }
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data: comparison } = useComparePrices({
 *   chainId: 137,
 *   priceAmountRaw: price1,
 *   priceCurrencyAddress: currency1Address,
 *   compareToPriceAmountRaw: price2,
 *   compareToPriceCurrencyAddress: currency2Address,
 *   query: {
 *     enabled: Boolean(price1 && price2),
 *     refetchInterval: 30000 // Refresh every 30 seconds
 *   }
 * })
 * ```
 */
declare function useComparePrices(params: UseComparePricesParams): _tanstack_react_query35.UseQueryResult<ComparePricesReturn, Error>;
type UseComparePricesArgs = {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: Address;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address;
  query?: {
    enabled?: boolean;
  };
};
type UseComparePricesReturn = {
  percentageDifference: number;
  percentageDifferenceFormatted: string;
  status: 'above' | 'same' | 'below';
};
//#endregion
//#region src/react/hooks/utils/useConvertPriceToUSD.d.ts
type UseConvertPriceToUSDParams = Optional<ConvertPriceToUSDQueryOptions, 'config'>;
/**
 * Hook to convert a price amount from a specific currency to USD
 *
 * Converts cryptocurrency amounts to their USD equivalent using current exchange rates.
 * Fetches currency data and calculates the USD value based on the provided amount
 * and currency address.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.currencyAddress - The currency contract address to convert from
 * @param params.amountRaw - The raw amount in smallest units (e.g., wei for ETH)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing USD amount and formatted USD amount
 *
 * @example
 * Basic ETH to USD conversion:
 * ```typescript
 * const { data: conversion, isLoading } = useConvertPriceToUSD({
 *   chainId: 1,
 *   currencyAddress: '0x0000000000000000000000000000000000000000', // ETH
 *   amountRaw: '1000000000000000000' // 1 ETH in wei
 * })
 *
 * if (data) {
 *   console.log(`$${data.usdAmountFormatted}`); // e.g., "$2000.00"
 *   console.log(data.usdAmount); // e.g., 2000
 * }
 * ```
 *
 * @example
 * ERC-20 token conversion with conditional enabling:
 * ```typescript
 * const { data: conversion } = useConvertPriceToUSD({
 *   chainId: 137,
 *   currencyAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Polygon
 *   amountRaw: '1000000', // 1 USDC (6 decimals)
 *   query: {
 *     enabled: Boolean(userHasTokens),
 *     refetchInterval: 30000 // Update price every 30 seconds
 *   }
 * })
 * ```
 */
declare function useConvertPriceToUSD(params: UseConvertPriceToUSDParams): _tanstack_react_query7.UseQueryResult<ConvertPriceToUSDReturn, Error>;
type UseConvertPriceToUSDArgs = {
  chainId: number;
  currencyAddress: Address;
  amountRaw: string;
  query?: {
    enabled?: boolean;
  };
};
type UseConvertPriceToUSDReturn = ConvertPriceToUSDReturn;
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
      [x: string]: viem1.ChainContract | {
        [sourceId: number]: viem1.ChainContract | undefined;
      } | undefined;
      ensRegistry?: viem1.ChainContract | undefined;
      ensUniversalResolver?: viem1.ChainContract | undefined;
      multicall3?: viem1.ChainContract | undefined;
      erc6492Verifier?: viem1.ChainContract | undefined;
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
    fees?: viem1.ChainFees<viem1.ChainFormatters | undefined> | undefined;
    formatters?: viem1.ChainFormatters | undefined;
    serializers?: viem1.ChainSerializers<viem1.ChainFormatters | undefined, viem1.TransactionSerializable> | undefined;
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
  waitForReceipt: (transactionHash: Hex) => Promise<viem13.TransactionReceipt>;
};
//#endregion
//#region src/react/hooks/utils/useRoyalty.d.ts
interface UseRoyaltyArgs {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  query?: QueryArg;
}
/**
 * Hook to fetch royalty information for a collectible
 *
 * Reads royalty information from the blockchain using the EIP-2981 standard.
 * This hook queries the contract directly to get royalty percentage and recipient
 * address for a specific token.
 *
 * @param args - Configuration parameters
 * @param args.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param args.collectionAddress - The collection contract address
 * @param args.collectibleId - The token ID within the collection
 * @param args.query - Optional React Query configuration
 *
 * @returns Query result containing royalty information (percentage and recipient) or null
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useRoyalty({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '1'
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
 *   collectibleId: '42',
 *   query: {
 *     refetchInterval: 60000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
declare function useRoyalty(args: UseRoyaltyArgs): {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  error: viem14.ReadContractErrorType;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: viem14.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query55.RefetchOptions) => Promise<_tanstack_react_query55.QueryObserverResult<readonly [`0x${string}`, bigint], viem14.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query55.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query55.QueryKey;
} | {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  error: null;
  isError: false;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: "success";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: viem14.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query55.RefetchOptions) => Promise<_tanstack_react_query55.QueryObserverResult<readonly [`0x${string}`, bigint], viem14.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query55.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query55.QueryKey;
} | {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  error: viem14.ReadContractErrorType;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: true;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "error";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: viem14.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query55.RefetchOptions) => Promise<_tanstack_react_query55.QueryObserverResult<readonly [`0x${string}`, bigint], viem14.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query55.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query55.QueryKey;
} | {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  error: null;
  isError: false;
  isPending: true;
  isLoading: true;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: viem14.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query55.RefetchOptions) => Promise<_tanstack_react_query55.QueryObserverResult<readonly [`0x${string}`, bigint], viem14.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query55.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query55.QueryKey;
} | {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  error: null;
  isError: false;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: "pending";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: viem14.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query55.RefetchOptions) => Promise<_tanstack_react_query55.QueryObserverResult<readonly [`0x${string}`, bigint], viem14.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query55.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query55.QueryKey;
} | {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  isError: false;
  error: null;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  status: "success";
  dataUpdatedAt: number;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: viem14.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isEnabled: boolean;
  refetch: (options?: _tanstack_react_query55.RefetchOptions) => Promise<_tanstack_react_query55.QueryObserverResult<readonly [`0x${string}`, bigint], viem14.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query55.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query55.QueryKey;
};
//#endregion
//#region src/react/providers/index.d.ts
declare const MarketplaceSdkContext$1: react0.Context<MarketplaceSdkContext>;
type MarketplaceSdkProviderProps = {
  config: SdkConfig;
  children: React.ReactNode;
  openConnectModal?: () => void;
};
declare function MarketplaceProvider({
  config,
  children,
  openConnectModal
}: MarketplaceSdkProviderProps): react_jsx_runtime0.JSX.Element;
declare function MarketplaceQueryClientProvider({
  children
}: {
  children: React.ReactNode;
}): react_jsx_runtime0.JSX.Element;
//#endregion
//#region src/react/hooks/data/primary-sales/useListPrimarySaleItems.d.ts
type UseListPrimarySaleItemsParams = Optional<ListPrimarySaleItemsQueryOptions, 'config'>;
/**
 * Hook to fetch primary sale items with pagination support
 *
 * Retrieves a paginated list of primary sale items for a specific contract address
 * from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.primarySaleContractAddress - The primary sale contract address
 * @param params.filter - Optional filter parameters for the query
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing the primary sale items data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListPrimarySaleItems({
 *   chainId: 137,
 *   primarySaleContractAddress: '0x...',
 * })
 * ```
 *
 * @example
 * With filters and pagination:
 * ```typescript
 * const { data, isLoading } = useListPrimarySaleItems({
 *   chainId: 1,
 *   primarySaleContractAddress: '0x...',
 *   filter: { status: 'active' },
 *   page: { page: 1, pageSize: 20 },
 *   query: {
 *     enabled: isReady
 *   }
 * })
 * ```
 */
declare function useListPrimarySaleItems(params: UseListPrimarySaleItemsParams): _tanstack_react_query100.UseInfiniteQueryResult<_tanstack_react_query100.InfiniteData<ListPrimarySaleItemsReturn, unknown>, Error>;
//#endregion
export { MarketplaceProvider as MarketplaceProvider$1, MarketplaceQueryClientProvider as MarketplaceQueryClientProvider$1, MarketplaceSdkContext$1 as MarketplaceSdkContext$2, MarketplaceSdkProviderProps, UseCheckoutOptionsSalesContractArgs, UseCheckoutOptionsSalesContractParams, UseCheckoutOptionsSalesContractReturn, UseComparePricesArgs, UseComparePricesParams, UseComparePricesReturn, UseConvertPriceToUSDArgs, UseConvertPriceToUSDParams, UseConvertPriceToUSDReturn, UseGetCountParams, UseListPrimarySaleItemsParams, UseRoyaltyArgs, useAutoSelectFeeOption as useAutoSelectFeeOption$1, useCheckoutOptionsSalesContract as useCheckoutOptionsSalesContract$1, useComparePrices as useComparePrices$1, useConvertPriceToUSD as useConvertPriceToUSD$1, useCountOfPrimarySaleItems as useCountOfPrimarySaleItems$1, useEnsureCorrectChain as useEnsureCorrectChain$1, useErc721SaleDetails as useErc721SaleDetails$1, useGetCountOfPrimarySaleItems as useGetCountOfPrimarySaleItems$1, useGetReceiptFromHash as useGetReceiptFromHash$1, useInventory as useInventory$1, useList1155ShopCardData as useList1155ShopCardData$1, useList721ShopCardData as useList721ShopCardData$1, useListPrimarySaleItems as useListPrimarySaleItems$1, useRoyalty as useRoyalty$1 };
//# sourceMappingURL=index-Cc1PqdXI.d.ts.map