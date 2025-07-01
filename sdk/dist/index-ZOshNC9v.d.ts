import { CheckoutOptionsItem, CheckoutOptionsSalesContractArgs, CheckoutOptionsSalesContractReturn, CollectibleCardAction, CollectibleOrder, CollectiblesFilter, Collection, CollectionFilterSettings, ContractType, CreateReq, Currency, CurrencyStatus, GenerateCancelTransactionArgs, GenerateListingTransactionArgs, GenerateOfferTransactionArgs, GenerateSellTransactionArgs, ListCollectibleActivitiesArgs, ListCollectibleActivitiesReturn, ListCollectibleListingsArgs, ListCollectibleListingsReturn, ListCollectibleOffersReturn, ListCollectiblesArgs, ListCollectiblesReturn, ListCollectionActivitiesArgs, ListCollectionActivitiesReturn, ListPrimarySaleItemsReturn, MarketplaceConfig, MarketplaceKind, MarketplaceSdkContext, MarketplaceType, Order, OrderFilter, OrderSide, OrderbookKind, Page, PrimarySaleItemsFilter, PropertyFilter, PropertyType, SdkConfig, SortBy, Step, TokenMetadata, WalletKind } from "./new-marketplace-types-Cggo50UM.js";
import { Optional, QueryArg, ValuesOptional } from "./index-BA8xVqOy.js";
import { CollectibleQueryOptions, CollectiblesResponse, CollectionDetailsQueryOptions, CurrencyQueryOptions, FloorOrderQueryOptions, HighestOfferQueryOptions, ListCollectiblesQueryOptions, ListCollectionsQueryOptions, ListTokenMetadataQueryOptions, LowestListingQueryOptions, MarketCurrenciesQueryOptions, StandardQueryOptions, TokenSuppliesQueryOptions, UseBalanceOfCollectibleArgs, UseCountOfPrimarySaleItemsArgs, UseInventoryArgs, UseListBalancesArgs } from "./index-9euIOML8.js";
import { MarketCollectibleCardProps } from "./CollectibleCard-cwM01fLs.js";
import * as react3 from "react";
import * as _tanstack_react_query240 from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";
import * as _0xsequence_indexer239 from "@0xsequence/indexer";
import { GetTokenBalancesDetailsReturn, GetTokenIDRangesReturn } from "@0xsequence/indexer";
import * as _0xsequence_metadata245 from "@0xsequence/metadata";
import { PropertyFilter as PropertyFilter$1 } from "@0xsequence/metadata";
import * as react_jsx_runtime4 from "react/jsx-runtime";
import * as viem298 from "viem";
import { Address } from "viem";
import * as nuqs264 from "nuqs";

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
//#region src/react/hooks/useAutoSelectFeeOption.d.ts
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
/**
 * A React hook that automatically selects the first fee option for which the user has sufficient balance.
 *
 * @param {Object} params.pendingFeeOptionConfirmation - Configuration for fee option selection
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
 * function MyComponent() {
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
 *       if (pendingFeeOptionConfirmation?.id && result.selectedOption) {
 *         confirmPendingFeeOption(
 *           pendingFeeOptionConfirmation.id,
 *           result.selectedOption.token.contractAddress
 *         );
 *       }
 *     });
 *   }, [autoSelectOptionPromise, confirmPendingFeeOption, pendingFeeOptionConfirmation]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
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
//#region src/react/hooks/useBalanceOfCollectible.d.ts
/**
 * Hook to fetch the balance of a specific collectible for a user
 *
 * @param args - The arguments for fetching the balance
 * @returns Query result containing the balance data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBalanceOfCollectible({
 *   collectionAddress: '0x123...',
 *   collectableId: '1',
 *   userAddress: '0x456...',
 *   chainId: 1,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useBalanceOfCollectible(args: UseBalanceOfCollectibleArgs): _tanstack_react_query240.UseQueryResult<_0xsequence_indexer239.TokenBalance, Error>;
//#endregion
//#region src/react/hooks/useCancelOrder.d.ts
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
//#region src/react/queries/checkoutOptionsSalesContract.d.ts
interface FetchCheckoutOptionsSalesContractParams extends Omit<CheckoutOptionsSalesContractArgs, 'chainId' | 'wallet'> {
  chainId: number;
  walletAddress: Address;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
  config: SdkConfig;
}
/**
 * Fetches checkout options for sales contract from the Marketplace API
 */
declare function fetchCheckoutOptionsSalesContract(params: FetchCheckoutOptionsSalesContractParams): Promise<CheckoutOptionsSalesContractReturn>;
type CheckoutOptionsSalesContractQueryOptions = ValuesOptional<FetchCheckoutOptionsSalesContractParams> & {
  query?: StandardQueryOptions;
};
declare function checkoutOptionsSalesContractQueryOptions(params: CheckoutOptionsSalesContractQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<CheckoutOptionsSalesContractReturn, Error, CheckoutOptionsSalesContractReturn, (string | CheckoutOptionsSalesContractQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<CheckoutOptionsSalesContractReturn, (string | CheckoutOptionsSalesContractQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | CheckoutOptionsSalesContractQueryOptions)[] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useCheckoutOptionsSalesContract.d.ts
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
declare function useCheckoutOptionsSalesContract(params: UseCheckoutOptionsSalesContractParams | typeof skipToken): _tanstack_react_query240.UseQueryResult<CheckoutOptionsSalesContractReturn, Error>;
type UseCheckoutOptionsSalesContractArgs = {
  chainId: number;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
};
type UseCheckoutOptionsSalesContractReturn = Awaited<ReturnType<typeof fetchCheckoutOptionsSalesContract>>;
//#endregion
//#region src/react/hooks/useCollectible.d.ts
type UseCollectibleParams = Optional<CollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch metadata for a specific collectible
 *
 * This hook retrieves metadata for an individual NFT from a collection,
 * including properties like name, description, image, attributes, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The token ID of the collectible
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collectible metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collectible, isLoading } = useCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   collectibleId: '12345'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   collectibleId: '12345',
 *   query: {
 *     enabled: Boolean(collectionAddress && tokenId),
 *     staleTime: 30_000
 *   }
 * })
 * ```
 */
declare function useCollectible(params: UseCollectibleParams): _tanstack_react_query240.UseQueryResult<_0xsequence_metadata245.TokenMetadata, Error>;
//#endregion
//#region src/react/queries/collection.d.ts
interface FetchCollectionParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
}
/**
 * Fetches collection information from the metadata API
 */

type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
  query?: StandardQueryOptions;
};
declare function collectionQueryOptions(params: CollectionQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<_0xsequence_metadata245.ContractInfo, Error, _0xsequence_metadata245.ContractInfo, ("collections" | "detail" | CollectionQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<_0xsequence_metadata245.ContractInfo, ("collections" | "detail" | CollectionQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "detail" | CollectionQueryOptions)[] & {
    [dataTagSymbol]: _0xsequence_metadata245.ContractInfo;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useCollection.d.ts
type UseCollectionParams = Optional<CollectionQueryOptions, 'config'>;
/**
 * Hook to fetch collection information from the metadata API
 *
 * Retrieves basic contract information including name, symbol, type,
 * and extension data for a given collection contract.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing contract information
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCollection({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: userWantsToFetch
 *   }
 * })
 * ```
 */
declare function useCollection(params: UseCollectionParams): _tanstack_react_query240.UseQueryResult<_0xsequence_metadata245.ContractInfo, Error>;
//#endregion
//#region src/react/queries/collectionBalanceDetails.d.ts
interface CollectionBalanceFilter {
  accountAddresses: Array<Address>;
  contractWhitelist?: Array<Address>;
  omitNativeBalances: boolean;
}
interface FetchCollectionBalanceDetailsParams {
  chainId: number;
  filter: CollectionBalanceFilter;
  config: SdkConfig;
}
/**
 * Fetches detailed balance information for multiple accounts from the Indexer API
 */
declare function fetchCollectionBalanceDetails(params: FetchCollectionBalanceDetailsParams): Promise<GetTokenBalancesDetailsReturn>;
type CollectionBalanceDetailsQueryOptions = ValuesOptional<FetchCollectionBalanceDetailsParams> & {
  query?: StandardQueryOptions;
};
declare function collectionBalanceDetailsQueryOptions(params: CollectionBalanceDetailsQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<GetTokenBalancesDetailsReturn, Error, GetTokenBalancesDetailsReturn, (string | CollectionBalanceDetailsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<GetTokenBalancesDetailsReturn, (string | CollectionBalanceDetailsQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | CollectionBalanceDetailsQueryOptions)[] & {
    [dataTagSymbol]: GetTokenBalancesDetailsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useCollectionBalanceDetails.d.ts
type UseCollectionBalanceDetailsParams = Optional<CollectionBalanceDetailsQueryOptions, 'config'>;
/**
 * Hook to fetch detailed balance information for multiple accounts
 *
 * Retrieves token balances and native balances for multiple account addresses,
 * with support for contract whitelisting and optional native balance exclusion.
 * Aggregates results from multiple account addresses into a single response.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.filter - Filter configuration for balance queries
 * @param params.filter.accountAddresses - Array of account addresses to query balances for
 * @param params.filter.contractWhitelist - Optional array of contract addresses to filter by
 * @param params.filter.omitNativeBalances - Whether to exclude native token balances
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing aggregated balance details for all accounts
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: balanceDetails, isLoading } = useCollectionBalanceDetails({
 *   chainId: 137,
 *   filter: {
 *     accountAddresses: ['0x1234...', '0x5678...'],
 *     omitNativeBalances: false
 *   }
 * })
 *
 * if (data) {
 *   console.log(`Found ${data.balances.length} token balances`);
 *   console.log(`Found ${data.nativeBalances.length} native balances`);
 * }
 * ```
 *
 * @example
 * With contract whitelist:
 * ```typescript
 * const { data: balanceDetails } = useCollectionBalanceDetails({
 *   chainId: 1,
 *   filter: {
 *     accountAddresses: [userAddress],
 *     contractWhitelist: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC only
 *     omitNativeBalances: true
 *   },
 *   query: {
 *     enabled: Boolean(userAddress),
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
declare function useCollectionBalanceDetails(params: UseCollectionBalanceDetailsParams): _tanstack_react_query240.UseQueryResult<_0xsequence_indexer239.GetTokenBalancesDetailsReturn, Error>;
type UseCollectionBalanceDetailsArgs = {
  chainId: number;
  filter: CollectionBalanceFilter;
  query?: {
    enabled?: boolean;
  };
};
type UseCollectionBalanceDetailsReturn = Awaited<ReturnType<typeof fetchCollectionBalanceDetails>>;
//#endregion
//#region src/react/hooks/useCollectionDetails.d.ts
type UseCollectionDetailsParams = Optional<CollectionDetailsQueryOptions, 'config'>;
/**
 * Hook to fetch detailed information about a collection
 *
 * This hook retrieves comprehensive metadata and details for an NFT collection,
 * including collection name, description, banner, avatar, social links, stats, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collection details
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collection, isLoading } = useCollectionDetails({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectionDetails({
 *   chainId: 137,
 *   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   query: {
 *     enabled: Boolean(collectionAddress),
 *     staleTime: 60_000
 *   }
 * })
 * ```
 */
declare function useCollectionDetails(params: UseCollectionDetailsParams): _tanstack_react_query240.UseQueryResult<Collection, Error>;
//#endregion
//#region src/react/hooks/useCollectionDetailsPolling.d.ts
type UseCollectionDetailsPolling = {
  collectionAddress: string;
  chainId: number;
  query?: {
    enabled?: boolean;
  };
};
declare const collectionDetailsPollingOptions: (args: UseCollectionDetailsPolling, config: SdkConfig) => _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<Collection, Error, Collection, ("collections" | "detail" | CollectionDetailsQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<Collection, ("collections" | "detail" | CollectionDetailsQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "detail" | CollectionDetailsQueryOptions)[] & {
    [dataTagSymbol]: Collection;
    [dataTagErrorSymbol]: Error;
  };
};
declare const useCollectionDetailsPolling: (args: UseCollectionDetailsPolling) => _tanstack_react_query240.UseQueryResult<Collection, Error>;
//#endregion
//#region src/react/queries/comparePrices.d.ts
interface FetchComparePricesParams {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: Address;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address;
  config: SdkConfig;
}
type ComparePricesReturn$1 = {
  percentageDifference: number;
  percentageDifferenceFormatted: string;
  status: 'above' | 'same' | 'below';
};
/**
 * Compares prices between different currencies by converting both to USD
 */

type ComparePricesQueryOptions = ValuesOptional<FetchComparePricesParams> & {
  query?: StandardQueryOptions;
};
declare function comparePricesQueryOptions(params: ComparePricesQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ComparePricesReturn$1, Error, ComparePricesReturn$1, (string | ComparePricesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ComparePricesReturn$1, (string | ComparePricesQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ComparePricesQueryOptions)[] & {
    [dataTagSymbol]: ComparePricesReturn$1;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useComparePrices.d.ts
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
declare function useComparePrices(params: UseComparePricesParams): _tanstack_react_query240.UseQueryResult<ComparePricesReturn$1, Error>;
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
type ComparePricesReturn = UseComparePricesReturn;
//#endregion
//#region src/react/hooks/useConfig.d.ts
declare function useConfig(): MarketplaceSdkContext;
//#endregion
//#region src/react/queries/convertPriceToUSD.d.ts
interface FetchConvertPriceToUSDParams {
  chainId: number;
  currencyAddress: Address;
  amountRaw: string;
  config: SdkConfig;
}
interface ConvertPriceToUSDReturn {
  usdAmount: number;
  usdAmountFormatted: string;
}
/**
 * Converts a price amount from a specific currency to USD using exchange rates
 */

type ConvertPriceToUSDQueryOptions = ValuesOptional<FetchConvertPriceToUSDParams> & {
  query?: StandardQueryOptions;
};
declare function convertPriceToUSDQueryOptions(params: ConvertPriceToUSDQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ConvertPriceToUSDReturn, Error, ConvertPriceToUSDReturn, (string | ConvertPriceToUSDQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ConvertPriceToUSDReturn, (string | ConvertPriceToUSDQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ConvertPriceToUSDQueryOptions)[] & {
    [dataTagSymbol]: ConvertPriceToUSDReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useConvertPriceToUSD.d.ts
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
declare function useConvertPriceToUSD(params: UseConvertPriceToUSDParams): _tanstack_react_query240.UseQueryResult<ConvertPriceToUSDReturn, Error>;
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
//#region src/react/queries/countListingsForCollectible.d.ts
interface FetchCountListingsForCollectibleParams {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  config: SdkConfig;
  filter?: OrderFilter;
}
/**
 * Fetches count of listings for a collectible from the marketplace API
 */

type CountListingsForCollectibleQueryOptions = ValuesOptional<FetchCountListingsForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function countListingsForCollectibleQueryOptions(params: CountListingsForCollectibleQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<number, Error, number, ("collectable" | "listingsCount" | CountListingsForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<number, ("collectable" | "listingsCount" | CountListingsForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "listingsCount" | CountListingsForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useCountListingsForCollectible.d.ts
type UseCountListingsForCollectibleParams = Optional<CountListingsForCollectibleQueryOptions, 'config'>;
/**
 * Hook to get the count of listings for a specific collectible
 *
 * Counts the number of active listings for a given collectible in the marketplace.
 * Useful for displaying listing counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for listings
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of listings
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: listingCount, isLoading } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCountListingsForCollectible(params: UseCountListingsForCollectibleParams): _tanstack_react_query240.UseQueryResult<number, Error>;
//#endregion
//#region src/react/queries/countOfCollectables.d.ts
interface FetchCountOfCollectablesParams {
  chainId: number;
  collectionAddress: string;
  config: SdkConfig;
  filter?: CollectiblesFilter;
  side?: OrderSide;
}
/**
 * Fetches count of collectibles from the marketplace API
 */

type CountOfCollectablesQueryOptions = ValuesOptional<FetchCountOfCollectablesParams> & {
  query?: StandardQueryOptions;
};
declare function countOfCollectablesQueryOptions(params: CountOfCollectablesQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<number, Error, number, ("collectable" | "counts" | CountOfCollectablesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<number, ("collectable" | "counts" | CountOfCollectablesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "counts" | CountOfCollectablesQueryOptions)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useCountOfCollectables.d.ts
type UseCountOfCollectablesParams = Optional<CountOfCollectablesQueryOptions, 'config'>;
/**
 * Hook to get the count of collectibles in a market collection
 *
 * Counts either all collectibles or filtered collectibles based on provided parameters.
 * When filter and side parameters are provided, returns count of filtered collectibles.
 * Otherwise returns count of all collectibles in the collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filter criteria for collectibles
 * @param params.side - Optional order side (BUY/SELL) when using filters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of collectibles
 *
 * @example
 * Basic usage (count all collectibles):
 * ```typescript
 * const { data: totalCount, isLoading } = useCountOfCollectables({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filters (count filtered collectibles):
 * ```typescript
 * const { data: filteredCount } = useCountOfCollectables({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: { priceRange: { min: '1000000000000000000' } },
 *   side: OrderSide.SELL
 * })
 * ```
 */
declare function useCountOfCollectables(params: UseCountOfCollectablesParams): _tanstack_react_query240.UseQueryResult<number, Error>;
//#endregion
//#region src/react/queries/countOffersForCollectible.d.ts
interface FetchCountOffersForCollectibleParams {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  config: SdkConfig;
  filter?: OrderFilter;
}
/**
 * Fetches count of offers for a collectible from the marketplace API
 */

type CountOffersForCollectibleQueryOptions = ValuesOptional<FetchCountOffersForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function countOffersForCollectibleQueryOptions(params: CountOffersForCollectibleQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<number, Error, number, ("collectable" | "offersCount" | CountOffersForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<number, ("collectable" | "offersCount" | CountOffersForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "offersCount" | CountOffersForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: number;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useCountOffersForCollectible.d.ts
type UseCountOffersForCollectibleParams = Optional<CountOffersForCollectibleQueryOptions, 'config'>;
/**
 * Hook to get the count of offers for a specific collectible
 *
 * Counts the number of active offers for a given collectible in the marketplace.
 * Useful for displaying offer counts in UI components.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific collectible/token ID
 * @param params.filter - Optional filter criteria for offers
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the count of offers
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: offerCount, isLoading } = useCountOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With filter:
 * ```typescript
 * const { data: filteredCount } = useCountOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: { priceRange: { min: '1000000000000000000' } }
 * })
 * ```
 */
declare function useCountOffersForCollectible(params: UseCountOffersForCollectibleParams): _tanstack_react_query240.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/useCountOfPrimarySaleItems.d.ts
declare function useCountOfPrimarySaleItems(args: UseCountOfPrimarySaleItemsArgs): _tanstack_react_query240.UseQueryResult<number, Error>;
//#endregion
//#region src/react/hooks/useCurrency.d.ts
type UseCurrencyParams = Optional<CurrencyQueryOptions, 'config'>;
/**
 * Hook to fetch currency details from the marketplace
 *
 * Retrieves detailed information about a specific currency by its contract address.
 * The currency data is cached from previous currency list calls when possible.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.currencyAddress - The currency contract address
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing currency details
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCurrency({
 *   chainId: 137,
 *   currencyAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useCurrency({
 *   chainId: 1,
 *   currencyAddress: '0x...',
 *   query: {
 *     enabled: Boolean(selectedCurrency)
 *   }
 * })
 * ```
 */
declare function useCurrency(params: UseCurrencyParams): _tanstack_react_query240.UseQueryResult<Currency | undefined, Error>;
//#endregion
//#region src/react/hooks/useERC721SaleMintedTokens.d.ts
interface UseERC721SaleMintedTokensProps {
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
  tokenIds: string[];
}
declare function useERC721SaleMintedTokens({
  chainId,
  contractAddress,
  salesContractAddress,
  tokenIds,
  enabled
}: UseERC721SaleMintedTokensProps): {
  ownedCount: number;
  totalSupplyCap: number;
  remainingCount: number;
  isLoading: boolean;
  error: viem298.ReadContractErrorType | null;
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
};
//#endregion
//#region src/react/hooks/useFilterState.d.ts
interface StringFilterValues {
  type: PropertyType.STRING;
  values: string[];
}
interface IntFilterValues {
  type: PropertyType.INT;
  min: number;
  max: number;
}
type FilterValues = StringFilterValues | IntFilterValues;
declare function useFilterState(): {
  serialize: {
    (values: Partial<{
      filters: PropertyFilter[] | null;
      search: string | null;
      listedOnly: boolean | null;
    }>): string;
    (base: string | URLSearchParams | URL, values: Partial<{
      filters: PropertyFilter[] | null;
      search: string | null;
      listedOnly: boolean | null;
    }> | null): string;
  };
  getFilter: (name: string) => PropertyFilter | undefined;
  getFilterValues: (name: string) => FilterValues | undefined;
  isFilterActive: (name: string) => boolean;
  isStringValueSelected: (name: string, value: string) => boolean;
  isIntFilterActive: (name: string) => boolean;
  getIntFilterRange: (name: string) => [number, number] | undefined;
  deleteFilter: (name: string) => void;
  toggleStringFilterValue: (name: string, value: string) => void;
  setIntFilterValue: (name: string, min: number, max: number) => void;
  clearAllFilters: () => void;
  filterOptions: PropertyFilter[];
  searchText: string;
  showListedOnly: boolean;
  setFilterOptions: (value: PropertyFilter[] | ((old: PropertyFilter[]) => PropertyFilter[] | null) | null, options?: nuqs264.Options) => Promise<URLSearchParams>;
  setSearchText: (value: string | ((old: string) => string | null) | null, options?: nuqs264.Options) => Promise<URLSearchParams>;
  setShowListedOnly: (value: boolean | ((old: boolean) => boolean | null) | null, options?: nuqs264.Options) => Promise<URLSearchParams>;
};
//#endregion
//#region src/react/queries/filters.d.ts
interface FetchFiltersParams {
  chainId: number;
  collectionAddress: string;
  showAllFilters?: boolean;
  excludePropertyValues?: boolean;
  config: SdkConfig;
}
/**
 * Fetches collection filters from the Metadata API with optional marketplace filtering
 */

type FiltersQueryOptions = ValuesOptional<FetchFiltersParams> & {
  query?: StandardQueryOptions;
};
declare function filtersQueryOptions(params: FiltersQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<PropertyFilter$1[], Error, PropertyFilter$1[], (string | FiltersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<PropertyFilter$1[], (string | FiltersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | FiltersQueryOptions)[] & {
    [dataTagSymbol]: PropertyFilter$1[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useFilters.d.ts
type UseFiltersParams = Optional<FiltersQueryOptions, 'config'>;
/**
 * Hook to fetch metadata filters for a collection
 *
 * Retrieves property filters for a collection from the metadata service,
 * with support for marketplace-specific filter configuration including
 * exclusion rules and custom ordering.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address to fetch filters for
 * @param params.showAllFilters - Whether to show all filters or apply marketplace filtering
 * @param params.excludePropertyValues - Whether to exclude property values from the response
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing property filters for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: filters, isLoading } = useFilters({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`Found ${data.length} filters`);
 *   data.forEach(filter => {
 *     console.log(`${filter.name}: ${filter.values?.join(', ')}`);
 *   });
 * }
 * ```
 *
 * @example
 * With marketplace filtering disabled:
 * ```typescript
 * const { data: allFilters } = useFilters({
 *   chainId: 1,
 *   collectionAddress: '0x5678...',
 *   showAllFilters: true, // Bypass marketplace filter rules
 *   query: {
 *     enabled: Boolean(selectedCollection),
 *     staleTime: 300000 // Cache for 5 minutes
 *   }
 * })
 * ```
 *
 * @example
 * Exclude property values for faster loading:
 * ```typescript
 * const { data: filterNames } = useFilters({
 *   chainId: 137,
 *   collectionAddress: collectionAddress,
 *   excludePropertyValues: true, // Only get filter names, not values
 *   query: {
 *     enabled: Boolean(collectionAddress)
 *   }
 * })
 * ```
 */
declare function useFilters(params: UseFiltersParams): _tanstack_react_query240.UseQueryResult<PropertyFilter$1[], Error>;
/**
 * Hook to progressively load collection filters
 *
 * First loads filter names only for fast initial display, then loads full filter
 * data with values. Uses placeholder data to provide immediate feedback while
 * full data loads in the background.
 *
 * @param params - Configuration parameters (same as useFilters)
 *
 * @returns Query result with additional loading states
 * @returns result.isLoadingNames - Whether filter names are still loading
 * @returns result.isFetchingValues - Whether filter values are being fetched
 *
 * @example
 * Progressive filter loading:
 * ```typescript
 * const {
 *   data: filters,
 *   isLoadingNames,
 *   isFetchingValues,
 *   isLoading
 * } = useFiltersProgressive({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (isLoadingNames) {
 *   return <div>Loading filters...</div>;
 * }
 *
 * return (
 *   <div>
 *     {filters?.map(filter => (
 *       <FilterComponent
 *         key={filter.name}
 *         filter={filter}
 *         isLoadingValues={isFetchingValues}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 */
declare function useFiltersProgressive(params: UseFiltersParams): {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: PropertyFilter$1[];
  error: Error;
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
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<PropertyFilter$1[], Error>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<PropertyFilter$1[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: PropertyFilter$1[];
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
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<PropertyFilter$1[], Error>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<PropertyFilter$1[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: undefined;
  error: Error;
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
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<PropertyFilter$1[], Error>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<PropertyFilter$1[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: undefined;
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
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<PropertyFilter$1[], Error>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<PropertyFilter$1[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: undefined;
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
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<PropertyFilter$1[], Error>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<PropertyFilter$1[]>;
} | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
  data: PropertyFilter$1[];
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
  failureReason: Error | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<PropertyFilter$1[], Error>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<PropertyFilter$1[]>;
};
type UseFiltersArgs = {
  chainId: number;
  collectionAddress: string;
  showAllFilters?: boolean;
  excludePropertyValues?: boolean;
  query?: {
    enabled?: boolean;
  };
};
type UseFilterReturn = PropertyFilter$1[];
//#endregion
//#region src/react/hooks/useFloorOrder.d.ts
type UseFloorOrderParams = Optional<FloorOrderQueryOptions, 'config'>;
/**
 * Hook to fetch the floor order for a collection
 *
 * Retrieves the lowest priced order (listing) currently available for any token
 * in the specified collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Optional filter criteria for collectibles
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the floor order data for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useFloorOrder({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With filters and custom query options:
 * ```typescript
 * const { data, isLoading } = useFloorOrder({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     minPrice: '1000000000000000000' // 1 ETH in wei
 *   },
 *   query: {
 *     refetchInterval: 30000,
 *     enabled: hasCollectionAddress
 *   }
 * })
 * ```
 */
declare function useFloorOrder(params: UseFloorOrderParams): _tanstack_react_query240.UseQueryResult<CollectibleOrder, Error>;
//#endregion
//#region src/react/hooks/useGenerateCancelTransaction.d.ts
type GenerateCancelTransactionArgsWithNumberChainId = Omit<GenerateCancelTransactionArgs, 'chainId'> & {
  chainId: number;
};
interface UseGenerateCancelTransactionArgs {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
declare const generateCancelTransaction: (args: GenerateCancelTransactionArgsWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateCancelTransaction: (params: UseGenerateCancelTransactionArgs) => {
  generateCancelTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
  generateCancelTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
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
//#region src/react/hooks/useGenerateListingTransaction.d.ts
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
  generateListingTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateListingTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
//#region src/react/hooks/useGenerateOfferTransaction.d.ts
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
  generateOfferTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateOfferTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
//#region src/react/hooks/useGenerateSellTransaction.d.ts
interface UseGenerateSellTransactionArgs {
  chainId: number;
  onSuccess?: (steps?: Step[]) => void;
}
type GenerateSellTransactionArgsWithNumberChainId = Omit<GenerateSellTransactionArgs, 'chainId'> & {
  chainId: number;
};
declare const generateSellTransaction: (args: GenerateSellTransactionArgsWithNumberChainId, config: SdkConfig) => Promise<Step[]>;
declare const useGenerateSellTransaction: (params: UseGenerateSellTransactionArgs) => {
  generateSellTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
  generateSellTransaction: _tanstack_react_query240.UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: _tanstack_react_query240.UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
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
//#region src/react/queries/primarySaleItems.d.ts
interface FetchPrimarySaleItemsParams {
  chainId: number;
  primarySaleContractAddress: Address;
  filter?: PrimarySaleItemsFilter;
  page?: Page;
  config: SdkConfig;
}
/**
 * Fetches primary sale items from the marketplace API
 */

type ListPrimarySaleItemsQueryOptions = ValuesOptional<FetchPrimarySaleItemsParams> & {
  query?: StandardQueryOptions;
};
//#endregion
//#region src/react/hooks/useGetCountOfPrimarySaleItems.d.ts
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
declare function useGetCountOfPrimarySaleItems(params: UseGetCountParams): _tanstack_react_query240.UseInfiniteQueryResult<_tanstack_react_query240.InfiniteData<ListPrimarySaleItemsReturn, unknown>, Error>;
//#endregion
//#region src/react/queries/getTokenRanges.d.ts
interface FetchGetTokenRangesParams {
  chainId: number;
  collectionAddress: Address;
  config: SdkConfig;
}
/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
declare function fetchGetTokenRanges(params: FetchGetTokenRangesParams): Promise<GetTokenIDRangesReturn>;
type GetTokenRangesQueryOptions = ValuesOptional<FetchGetTokenRangesParams> & {
  query?: StandardQueryOptions;
};
declare function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<GetTokenIDRangesReturn, Error, GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<GetTokenIDRangesReturn, (string | GetTokenRangesQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | GetTokenRangesQueryOptions)[] & {
    [dataTagSymbol]: GetTokenIDRangesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useGetTokenRanges.d.ts
type UseGetTokenRangesParams = Optional<GetTokenRangesQueryOptions, 'config'>;
/**
 * Hook to fetch token ID ranges for a collection
 *
 * Retrieves the available token ID ranges for a specific collection,
 * which is useful for understanding the token distribution and
 * available tokens within a collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address to fetch ranges for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token ID ranges for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: tokenRanges, isLoading } = useGetTokenRanges({
 *   chainId: 137,
 *   collectionAddress: '0x1234...'
 * })
 *
 * if (data) {
 *   console.log(`Token ranges: ${JSON.stringify(data.tokenIDRanges)}`);
 *   data.tokenIDRanges?.forEach(range => {
 *     console.log(`Range: ${range.start} - ${range.end}`);
 *   });
 * }
 * ```
 *
 * @example
 * With conditional enabling:
 * ```typescript
 * const { data: tokenRanges } = useGetTokenRanges({
 *   chainId: 1,
 *   collectionAddress: selectedCollection?.address,
 *   query: {
 *     enabled: Boolean(selectedCollection?.address),
 *     staleTime: 300000, // Cache for 5 minutes
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
declare function useGetTokenRanges(params: UseGetTokenRangesParams): _tanstack_react_query240.UseQueryResult<_0xsequence_indexer239.GetTokenIDRangesReturn, Error>;
type UseGetTokenRangesProps = {
  chainId: number;
  collectionAddress: Address;
  query?: {
    enabled?: boolean;
  };
};
type UseGetTokenRangesReturn = Awaited<ReturnType<typeof fetchGetTokenRanges>>;
//#endregion
//#region src/react/hooks/useHighestOffer.d.ts
type UseHighestOfferParams = Optional<HighestOfferQueryOptions, 'config'>;
/**
 * Hook to fetch the highest offer for a collectible
 *
 * Retrieves the highest offer currently available for a specific token
 * in a collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The token ID within the collection
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the highest offer data or null if no offers exist
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useHighestOffer({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useHighestOffer({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     refetchInterval: 15000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
declare function useHighestOffer(params: UseHighestOfferParams): _tanstack_react_query240.UseQueryResult<Order | null, Error>;
//#endregion
//#region src/react/provider.d.ts
declare const MarketplaceSdkContext$1: react3.Context<MarketplaceSdkContext>;
type MarketplaceSdkProviderProps = {
  config: SdkConfig;
  children: React.ReactNode;
  openConnectModal?: () => void;
};
declare function MarketplaceProvider({
  config,
  children,
  openConnectModal
}: MarketplaceSdkProviderProps): react_jsx_runtime4.JSX.Element;
declare function MarketplaceQueryClientProvider({
  children
}: {
  children: React.ReactNode;
}): react_jsx_runtime4.JSX.Element;
//#endregion
//#region src/react/hooks/useInventory.d.ts
declare function useInventory(args: UseInventoryArgs): _tanstack_react_query240.UseInfiniteQueryResult<_tanstack_react_query240.InfiniteData<CollectiblesResponse, unknown>, Error>;
//#endregion
//#region src/react/hooks/useList721ShopCardData.d.ts
interface UseList721ShopCardDataProps {
  tokenIds: string[];
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
}
declare function useList721ShopCardData({
  tokenIds,
  chainId,
  contractAddress,
  salesContractAddress,
  enabled
}: UseList721ShopCardDataProps): {
  salePrice: {
    amount: string;
    currencyAddress: Address;
  };
  collectibleCards: {
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
    quantityInitial: string | undefined;
    quantityRemaining: string | undefined;
    quantityDecimals: number;
    saleStartsAt: string | undefined;
    saleEndsAt: string | undefined;
    marketplaceType: "shop";
  }[];
  saleDetailsError: viem298.ReadContractErrorType | null;
  primarySaleItemsError: Error | null;
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
  primarySaleItems: _tanstack_react_query240.InfiniteData<ListPrimarySaleItemsReturn, unknown> | undefined;
  isLoading: boolean;
};
//#endregion
//#region src/react/hooks/useList1155ShopCardData.d.ts
interface UseList1155ShopCardDataProps {
  tokenIds: string[];
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  enabled?: boolean;
}
declare function useList1155ShopCardData({
  tokenIds,
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
    quantityInitial: string | undefined;
    quantityDecimals: number;
    quantityRemaining: string | undefined;
    unlimitedSupply: boolean | undefined;
    saleStartsAt: string | undefined;
    saleEndsAt: string | undefined;
    marketplaceType: "shop";
  }[];
  tokenMetadataError: Error | null;
  tokenSaleDetailsError: null;
  isLoading: boolean;
};
//#endregion
//#region src/react/hooks/useListBalances.d.ts
/**
 * Hook to fetch a list of token balances with pagination support
 *
 * @param args - The arguments for fetching the balances
 * @returns Infinite query result containing the balances data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, fetchNextPage } = useListBalances({
 *   chainId: 1,
 *   accountAddress: '0x123...',
 *   includeMetadata: true,
 *   query: {
 *     enabled: true,
 *     refetchInterval: 10000,
 *   }
 * });
 * ```
 */
declare function useListBalances(args: UseListBalancesArgs): _tanstack_react_query240.UseInfiniteQueryResult<_tanstack_react_query240.InfiniteData<_0xsequence_indexer239.GetTokenBalancesReturn, unknown>, Error>;
//#endregion
//#region src/react/queries/listCollectibleActivities.d.ts
interface FetchListCollectibleActivitiesParams extends Omit<ListCollectibleActivitiesArgs, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  sort?: SortBy[];
  config: SdkConfig;
}
/**
 * Fetches collectible activities from the Marketplace API
 */
declare function fetchListCollectibleActivities(params: FetchListCollectibleActivitiesParams): Promise<ListCollectibleActivitiesReturn>;
type ListCollectibleActivitiesQueryOptions = ValuesOptional<FetchListCollectibleActivitiesParams> & {
  query?: StandardQueryOptions;
};
declare function listCollectibleActivitiesQueryOptions(params: ListCollectibleActivitiesQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ListCollectibleActivitiesReturn, Error, ListCollectibleActivitiesReturn, ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ListCollectibleActivitiesReturn, ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "collectibleActivities" | ListCollectibleActivitiesQueryOptions)[] & {
    [dataTagSymbol]: ListCollectibleActivitiesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useListCollectibleActivities.d.ts
type UseListCollectibleActivitiesParams = Optional<ListCollectibleActivitiesQueryOptions, 'config'>;
/**
 * Hook to fetch a list of activities for a specific collectible
 *
 * Fetches activities (transfers, sales, offers, etc.) for a specific token
 * from the marketplace with support for pagination and sorting.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The specific token ID to fetch activities for
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of activities per page (default: 10)
 * @param params.sort - Sort order for activities
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing activities data
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListCollectibleActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListCollectibleActivities({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '456',
 *   page: 2,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With sorting:
 * ```typescript
 * const { data } = useListCollectibleActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '789',
 *   sort: 'timestamp_desc',
 *   pageSize: 50
 * })
 * ```
 */
declare function useListCollectibleActivities(params: UseListCollectibleActivitiesParams): _tanstack_react_query240.UseQueryResult<ListCollectibleActivitiesReturn, Error>;
type UseListCollectibleActivitiesArgs = UseListCollectibleActivitiesParams;
type UseListCollectibleActivitiesReturn = Awaited<ReturnType<typeof fetchListCollectibleActivities>>;
//#endregion
//#region src/react/hooks/useListCollectibles.d.ts
type UseListCollectiblesParams = Optional<ListCollectiblesQueryOptions, 'config'>;
/**
 * Hook to fetch a list of collectibles with infinite pagination support
 *
 * Fetches collectibles from the marketplace with support for filtering, pagination,
 * and special handling for shop marketplace types and LAOS721 contracts.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters
 * @param params.isLaos721 - Whether the collection is a LAOS721 contract
 * @param params.marketplaceType - Type of marketplace (shop, etc.)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing collectibles data with pagination
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useListCollectibles({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data, fetchNextPage } = useListCollectibles({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   filter: {
 *     searchText: 'dragon',
 *     includeEmpty: false,
 *     marketplaces: [MarketplaceKind.sequence_marketplace_v2]
 *   }
 * })
 * ```
 *
 * @example
 * For LAOS721 collections:
 * ```typescript
 * const { data } = useListCollectibles({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   isLaos721: true,
 *   filter: {
 *     inAccounts: ['0x...']
 *   }
 * })
 * ```
 */
declare function useListCollectibles(params: UseListCollectiblesParams): _tanstack_react_query240.UseInfiniteQueryResult<_tanstack_react_query240.InfiniteData<ListCollectiblesReturn, unknown>, Error>;
type UseListCollectiblesArgs = UseListCollectiblesParams;
//#endregion
//#region src/react/queries/listCollectiblesPaginated.d.ts
interface FetchListCollectiblesPaginatedParams extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  config: SdkConfig;
}
/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
declare function fetchListCollectiblesPaginated(params: FetchListCollectiblesPaginatedParams): Promise<ListCollectiblesReturn>;
type ListCollectiblesPaginatedQueryOptions = ValuesOptional<FetchListCollectiblesPaginatedParams> & {
  query?: StandardQueryOptions;
};
declare function listCollectiblesPaginatedQueryOptions(params: ListCollectiblesPaginatedQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ListCollectiblesReturn, Error, ListCollectiblesReturn, (string | ListCollectiblesPaginatedQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ListCollectiblesReturn, (string | ListCollectiblesPaginatedQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | ListCollectiblesPaginatedQueryOptions)[] & {
    [dataTagSymbol]: ListCollectiblesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useListCollectiblesPaginated.d.ts
type UseListCollectiblesPaginatedParams = Optional<ListCollectiblesPaginatedQueryOptions, 'config'>;
/**
 * Hook to fetch a list of collectibles with pagination support
 *
 * Fetches collectibles from the marketplace with support for filtering and pagination.
 * Unlike the infinite query version, this hook fetches a specific page of results.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of items per page (default: 30)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing collectibles data for the specific page
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListCollectiblesPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 1,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useListCollectiblesPaginated({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 2,
 *   pageSize: 50,
 *   filter: {
 *     searchText: 'rare',
 *     includeEmpty: false
 *   }
 * })
 * ```
 *
 * @example
 * Controlled pagination:
 * ```typescript
 * const [currentPage, setCurrentPage] = useState(1);
 * const { data, isLoading } = useListCollectiblesPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: currentPage,
 *   pageSize: 25
 * });
 *
 * const hasMorePages = data?.page?.more;
 * ```
 */
declare function useListCollectiblesPaginated(params: UseListCollectiblesPaginatedParams): _tanstack_react_query240.UseQueryResult<ListCollectiblesReturn, Error>;
type UseListCollectiblesPaginatedArgs = UseListCollectiblesPaginatedParams;
type UseListCollectiblesPaginatedReturn = Awaited<ReturnType<typeof fetchListCollectiblesPaginated>>;
//#endregion
//#region src/react/queries/listCollectionActivities.d.ts
interface FetchListCollectionActivitiesParams extends Omit<ListCollectionActivitiesArgs, 'chainId' | 'contractAddress' | 'page'> {
  chainId: number;
  collectionAddress: Address;
  page?: number;
  pageSize?: number;
  sort?: SortBy[];
  config: SdkConfig;
}
/**
 * Fetches collection activities from the Marketplace API
 */
declare function fetchListCollectionActivities(params: FetchListCollectionActivitiesParams): Promise<ListCollectionActivitiesReturn>;
type ListCollectionActivitiesQueryOptions = ValuesOptional<FetchListCollectionActivitiesParams> & {
  query?: StandardQueryOptions;
};
declare function listCollectionActivitiesQueryOptions(params: ListCollectionActivitiesQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ListCollectionActivitiesReturn, Error, ListCollectionActivitiesReturn, ("collections" | "collectionActivities" | ListCollectionActivitiesQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ListCollectionActivitiesReturn, ("collections" | "collectionActivities" | ListCollectionActivitiesQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collections" | "collectionActivities" | ListCollectionActivitiesQueryOptions)[] & {
    [dataTagSymbol]: ListCollectionActivitiesReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useListCollectionActivities.d.ts
type UseListCollectionActivitiesParams = Optional<ListCollectionActivitiesQueryOptions, 'config'>;
/**
 * Hook to fetch a list of activities for an entire collection
 *
 * Fetches activities (transfers, sales, offers, etc.) for all tokens
 * in a collection from the marketplace with support for pagination and sorting.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of activities per page (default: 10)
 * @param params.sort - Sort order for activities
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing activities data for the collection
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListCollectionActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListCollectionActivities({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   page: 2,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With sorting:
 * ```typescript
 * const { data } = useListCollectionActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   sort: [{ column: 'createdAt', order: SortOrder.DESC }],
 *   pageSize: 50
 * })
 * ```
 */
declare function useListCollectionActivities(params: UseListCollectionActivitiesParams): _tanstack_react_query240.UseQueryResult<ListCollectionActivitiesReturn, Error>;
type UseListCollectionActivitiesArgs = UseListCollectionActivitiesParams;
type UseListCollectionActivitiesReturn = Awaited<ReturnType<typeof fetchListCollectionActivities>>;
//#endregion
//#region src/react/hooks/useListCollections.d.ts
type UseListCollectionsParams = Optional<ListCollectionsQueryOptions, 'config' | 'marketplaceConfig'>;
/**
 * Hook to fetch collections from marketplace configuration
 *
 * Retrieves all collections configured in the marketplace, with optional filtering
 * by marketplace type. Combines metadata from the metadata API with marketplace
 * configuration to provide complete collection information.
 *
 * @param params - Configuration parameters
 * @param params.marketplaceType - Optional filter by marketplace type
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing array of collections with metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collections, isLoading } = useListCollections();
 *
 * if (isLoading) return <div>Loading collections...</div>;
 *
 * return (
 *   <div>
 *     {collections?.map(collection => (
 *       <div key={collection.itemsAddress}>
 *         {collection.name}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * Filtering by marketplace type:
 * ```typescript
 * const { data: marketCollections } = useListCollections({
 *   marketplaceType: 'market'
 * });
 * ```
 */
declare function useListCollections(params?: UseListCollectionsParams): _tanstack_react_query240.UseQueryResult<({
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata245.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata245.ResourceStatus;
  marketplaceType: MarketplaceType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
} | {
  chainId: number;
  address: string;
  source: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: _0xsequence_metadata245.ContractInfoExtensions;
  updatedAt: string;
  queuedAt?: string;
  status: _0xsequence_metadata245.ResourceStatus;
  marketplaceType: MarketplaceType;
  saleAddress: string;
  bannerUrl: string;
  itemsAddress: string;
  filterSettings?: CollectionFilterSettings;
})[], Error>;
//#endregion
//#region src/react/queries/listListingsForCollectible.d.ts
interface FetchListListingsForCollectibleParams extends Omit<ListCollectibleListingsArgs, 'chainId' | 'contractAddress' | 'tokenId'> {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  config: SdkConfig;
}
/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
declare function fetchListListingsForCollectible(params: FetchListListingsForCollectibleParams): Promise<ListCollectibleListingsReturn>;
type ListListingsForCollectibleQueryOptions = ValuesOptional<FetchListListingsForCollectibleParams> & {
  query?: StandardQueryOptions;
};
declare function listListingsForCollectibleQueryOptions(params: ListListingsForCollectibleQueryOptions): _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ListCollectibleListingsReturn, Error, ListCollectibleListingsReturn, ("collectable" | "listings" | ListListingsForCollectibleQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ListCollectibleListingsReturn, ("collectable" | "listings" | ListListingsForCollectibleQueryOptions)[], never> | undefined;
} & {
  queryKey: ("collectable" | "listings" | ListListingsForCollectibleQueryOptions)[] & {
    [dataTagSymbol]: ListCollectibleListingsReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/hooks/useListListingsForCollectible.d.ts
type UseListListingsForCollectibleParams = Optional<ListListingsForCollectibleQueryOptions, 'config'>;
/**
 * Hook to fetch listings for a specific collectible
 *
 * Fetches active listings (sales) for a specific token from the marketplace
 * with support for filtering and pagination.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.collectibleId - The specific token ID to fetch listings for
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the collectible
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * })
 * ```
 *
 * @example
 * With pagination:
 * ```typescript
 * const { data } = useListListingsForCollectible({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '456',
 *   page: {
 *     page: 2,
 *     pageSize: 20
 *   }
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '789',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Specific currency addresses
 *   }
 * })
 * ```
 */
declare function useListListingsForCollectible(params: UseListListingsForCollectibleParams): _tanstack_react_query240.UseQueryResult<ListCollectibleListingsReturn, Error>;
type UseListListingsForCollectibleArgs = UseListListingsForCollectibleParams;
type UseListListingsForCollectibleReturn = Awaited<ReturnType<typeof fetchListListingsForCollectible>>;
//#endregion
//#region src/react/hooks/useListMarketCardData.d.ts
interface UseListMarketCardDataProps {
  collectionAddress: Address;
  chainId: number;
  orderbookKind: OrderbookKind;
  collectionType: ContractType;
  filterOptions?: PropertyFilter[];
  searchText?: string;
  showListedOnly?: boolean;
  onCollectibleClick?: (tokenId: string) => void;
  onCannotPerformAction?: (action: CollectibleCardAction) => void;
  prioritizeOwnerActions?: boolean;
  assetSrcPrefixUrl?: string;
}
declare function useListMarketCardData({
  collectionAddress,
  chainId,
  orderbookKind,
  collectionType,
  filterOptions,
  searchText,
  showListedOnly,
  onCollectibleClick,
  onCannotPerformAction,
  prioritizeOwnerActions,
  assetSrcPrefixUrl
}: UseListMarketCardDataProps): {
  collectibleCards: MarketCollectibleCardProps[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: _tanstack_react_query240.FetchNextPageOptions) => Promise<_tanstack_react_query240.InfiniteQueryObserverResult<_tanstack_react_query240.InfiniteData<ListCollectiblesReturn, unknown>, Error>>;
  allCollectibles: CollectibleOrder[];
};
//#endregion
//#region src/react/hooks/useListOffersForCollectible.d.ts
interface UseListOffersForCollectibleArgs {
  chainId: number;
  collectionAddress: string;
  collectibleId: string;
  filter?: OrderFilter;
  page?: Page;
}
type UseListOffersForCollectibleReturn = Awaited<ReturnType<typeof fetchListOffersForCollectible>>;
declare const fetchListOffersForCollectible: (config: SdkConfig, args: UseListOffersForCollectibleArgs) => Promise<ListCollectibleOffersReturn>;
declare const listOffersForCollectibleOptions: (args: UseListOffersForCollectibleArgs, config: SdkConfig) => _tanstack_react_query240.OmitKeyof<_tanstack_react_query240.UseQueryOptions<ListCollectibleOffersReturn, Error, ListCollectibleOffersReturn, (SdkConfig | "collectable" | UseListOffersForCollectibleArgs | "offers")[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query240.QueryFunction<ListCollectibleOffersReturn, (SdkConfig | "collectable" | UseListOffersForCollectibleArgs | "offers")[], never> | undefined;
} & {
  queryKey: (SdkConfig | "collectable" | UseListOffersForCollectibleArgs | "offers")[] & {
    [dataTagSymbol]: ListCollectibleOffersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
declare const useListOffersForCollectible: (args: UseListOffersForCollectibleArgs) => _tanstack_react_query240.UseQueryResult<ListCollectibleOffersReturn, Error>;
//#endregion
//#region src/react/hooks/useListPrimarySaleItems.d.ts
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
declare function useListPrimarySaleItems(params: UseListPrimarySaleItemsParams): _tanstack_react_query240.UseInfiniteQueryResult<_tanstack_react_query240.InfiniteData<ListPrimarySaleItemsReturn, unknown>, Error>;
//#endregion
//#region src/react/hooks/useListShopCardData.d.ts
interface UseListShopCardDataProps {
  tokenIds: string[];
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
  contractType: ContractType | undefined;
  enabled?: boolean;
}
declare function useListShopCardData({
  tokenIds,
  chainId,
  contractAddress,
  salesContractAddress,
  contractType,
  enabled
}: UseListShopCardDataProps): {
  salePrice: {
    amount: string;
    currencyAddress: Address;
  };
  collectibleCards: {
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
    quantityInitial: string | undefined;
    quantityRemaining: string | undefined;
    quantityDecimals: number;
    saleStartsAt: string | undefined;
    saleEndsAt: string | undefined;
    marketplaceType: "shop";
  }[];
  saleDetailsError: viem298.ReadContractErrorType | null;
  primarySaleItemsError: Error | null;
  saleDetails: {
    supplyCap: bigint;
    cost: bigint;
    paymentToken: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
  } | undefined;
  primarySaleItems: _tanstack_react_query240.InfiniteData<ListPrimarySaleItemsReturn, unknown> | undefined;
  isLoading: boolean;
} | {
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
    quantityInitial: string | undefined;
    quantityDecimals: number;
    quantityRemaining: string | undefined;
    unlimitedSupply: boolean | undefined;
    saleStartsAt: string | undefined;
    saleEndsAt: string | undefined;
    marketplaceType: "shop";
  }[];
  isLoading: boolean;
  saleDetailsError: null;
  primarySaleItemsError: Error | null;
  saleDetails: undefined;
  primarySaleItems: undefined;
  salePrice: {
    amount: string;
    currencyAddress: Address;
  };
  collectionDetailsError?: undefined;
} | {
  collectibleCards: never[];
  isLoading: boolean;
  collectionDetailsError: null;
  saleDetailsError: null;
  primarySaleItemsError: null;
  saleDetails: undefined;
  primarySaleItems: undefined;
  salePrice: undefined;
};
//#endregion
//#region src/react/hooks/useListTokenMetadata.d.ts
type UseListTokenMetadataParams = Optional<ListTokenMetadataQueryOptions, 'config'>;
/**
 * Hook to fetch token metadata from the metadata API
 *
 * Retrieves metadata for a batch of tokens from a specific contract.
 * Useful for getting token names, descriptions, images, and other attributes.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The contract address containing the tokens
 * @param params.tokenIds - Array of token IDs to fetch metadata for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token metadata array
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useListTokenMetadata({
 *   chainId: 1,
 *   contractAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0
 *   }
 * })
 * ```
 */
declare function useListTokenMetadata(params: UseListTokenMetadataParams): _tanstack_react_query240.UseQueryResult<_0xsequence_metadata245.TokenMetadata[], Error>;
//#endregion
//#region src/react/hooks/useLowestListing.d.ts
type UseLowestListingParams = Optional<LowestListingQueryOptions, 'config'>;
/**
 * Hook to fetch the lowest listing for a collectible
 *
 * Retrieves the lowest priced listing currently available for a specific token
 * in a collection from the marketplace.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenId - The token ID within the collection
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the lowest listing data or null if no listings exist
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useLowestListing({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '1'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useLowestListing({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   tokenId: '42',
 *   query: {
 *     refetchInterval: 15000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
declare function useLowestListing(params: UseLowestListingParams): _tanstack_react_query240.UseQueryResult<Order | null | undefined, Error>;
//#endregion
//#region src/react/hooks/useMarketCurrencies.d.ts
type UseMarketCurrenciesParams = Optional<MarketCurrenciesQueryOptions, 'config'>;
/**
 * Hook to fetch supported currencies for a marketplace
 *
 * Retrieves the list of currencies supported by the marketplace for a specific chain.
 * Can optionally filter to exclude native currency or filter by collection.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.includeNativeCurrency - Whether to include native currency (default: true)
 * @param params.collectionAddress - Optional collection address to filter currencies
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing supported currencies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useMarketCurrencies({
 *   chainId: 137
 * })
 * ```
 *
 * @example
 * Exclude native currency:
 * ```typescript
 * const { data, isLoading } = useMarketCurrencies({
 *   chainId: 1,
 *   includeNativeCurrency: false
 * })
 * ```
 */
declare function useMarketCurrencies(params: UseMarketCurrenciesParams): _tanstack_react_query240.UseQueryResult<{
  contractAddress: string;
  chainId: number;
  status: CurrencyStatus;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
  exchangeRate: number;
  defaultChainCurrency: boolean;
  nativeCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}[], Error>;
//#endregion
//#region src/react/hooks/useMarketplaceConfig.d.ts
declare const useMarketplaceConfig: () => _tanstack_react_query240.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
//#region src/react/hooks/useOpenConnectModal.d.ts
declare const useOpenConnectModal: () => {
  openConnectModal: () => void;
};
//#endregion
//#region src/react/hooks/useRoyalty.d.ts
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
  error: viem298.ReadContractErrorType;
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
  failureReason: viem298.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<readonly [`0x${string}`, bigint], viem298.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query240.QueryKey;
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
  failureReason: viem298.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<readonly [`0x${string}`, bigint], viem298.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query240.QueryKey;
} | {
  data: {
    percentage: bigint;
    recipient: Address;
  } | null;
  error: viem298.ReadContractErrorType;
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
  failureReason: viem298.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<readonly [`0x${string}`, bigint], viem298.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query240.QueryKey;
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
  failureReason: viem298.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<readonly [`0x${string}`, bigint], viem298.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query240.QueryKey;
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
  failureReason: viem298.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<readonly [`0x${string}`, bigint], viem298.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query240.QueryKey;
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
  failureReason: viem298.ReadContractErrorType | null;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  isStale: boolean;
  refetch: (options?: _tanstack_react_query240.RefetchOptions) => Promise<_tanstack_react_query240.QueryObserverResult<readonly [`0x${string}`, bigint], viem298.ReadContractErrorType>>;
  fetchStatus: _tanstack_react_query240.FetchStatus;
  promise: Promise<readonly [`0x${string}`, bigint]>;
  queryKey: _tanstack_react_query240.QueryKey;
};
//#endregion
//#region src/react/hooks/useShopCollectibleSaleData.d.ts
interface ShopCollectibleSaleData {
  salePrice: {
    amount: string;
    currencyAddress: Address;
  } | null;
  paymentToken: Address | null;
  supplyCap: string;
  totalMinted: string;
  quantityRemaining: string;
  startTime: number | null;
  endTime: number | null;
  isActive: boolean;
  isLoading: boolean;
  error: Error | null;
  isAvailable: boolean;
}
interface BaseShopCollectibleSaleDataProps {
  chainId: number;
  salesContractAddress: Address;
  itemsContractAddress: Address;
  enabled?: boolean;
}
interface ERC721ShopCollectibleSaleDataProps extends BaseShopCollectibleSaleDataProps {
  collectionType: ContractType.ERC721;
  tokenId?: string;
}
interface ERC1155ShopCollectibleSaleDataProps extends BaseShopCollectibleSaleDataProps {
  collectionType: ContractType.ERC1155;
  tokenId: string;
}
type UseShopCollectibleSaleDataProps = ERC721ShopCollectibleSaleDataProps | ERC1155ShopCollectibleSaleDataProps;
declare function useShopCollectibleSaleData({
  chainId,
  salesContractAddress,
  itemsContractAddress,
  tokenId,
  collectionType,
  enabled
}: UseShopCollectibleSaleDataProps): ShopCollectibleSaleData;
//#endregion
//#region src/react/hooks/useTokenSupplies.d.ts
type UseTokenSuppliesParams = Optional<TokenSuppliesQueryOptions, 'config'>;
/**
 * Hook to fetch token supplies from the indexer or LAOS API
 *
 * Retrieves supply information for tokens from a specific collection.
 * Automatically chooses between indexer and LAOS APIs based on the isLaos721 flag.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.isLaos721 - Whether to use LAOS API instead of indexer
 * @param params.includeMetadata - Whether to include token metadata
 * @param params.page - Pagination options
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * })
 * ```
 *
 * @example
 * With LAOS API:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   isLaos721: true
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useTokenSupplies({
 *   chainId: 1,
 *   collectionAddress: selectedCollection,
 *   query: {
 *     enabled: !!selectedCollection
 *   }
 * })
 * ```
 */
declare function useTokenSupplies(params: UseTokenSuppliesParams): _tanstack_react_query240.UseQueryResult<_0xsequence_indexer239.GetTokenSuppliesReturn, Error>;
//#endregion
//#region src/react/hooks/useTransferTokens.d.ts
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
export { CheckoutOptionsSalesContractQueryOptions, CollectionBalanceDetailsQueryOptions, CollectionBalanceFilter, CollectionQueryOptions, ComparePricesQueryOptions, ComparePricesReturn, ConvertPriceToUSDQueryOptions, ConvertPriceToUSDReturn, CountListingsForCollectibleQueryOptions, CountOfCollectablesQueryOptions, CountOffersForCollectibleQueryOptions, CreateReqWithDateExpiry$1 as CreateReqWithDateExpiry, FetchCheckoutOptionsSalesContractParams, FetchCollectionBalanceDetailsParams, FetchCollectionParams, FetchComparePricesParams, FetchConvertPriceToUSDParams, FetchCountListingsForCollectibleParams, FetchCountOfCollectablesParams, FetchCountOffersForCollectibleParams, FetchFiltersParams, FetchGetTokenRangesParams, FetchListCollectibleActivitiesParams, FetchListCollectiblesPaginatedParams, FetchListCollectionActivitiesParams, FetchListListingsForCollectibleParams, FiltersQueryOptions, GenerateListingTransactionProps, GenerateOfferTransactionProps, GetTokenRangesQueryOptions, ListCollectibleActivitiesQueryOptions, ListCollectiblesPaginatedQueryOptions, ListCollectionActivitiesQueryOptions, ListListingsForCollectibleQueryOptions, ListPrimarySaleItemsQueryOptions, MarketplaceProvider, MarketplaceQueryClientProvider, MarketplaceSdkContext$1 as MarketplaceSdkContext, MarketplaceSdkProviderProps, TransactionStep, TransferTokensParams, UseCheckoutOptionsSalesContractArgs, UseCheckoutOptionsSalesContractParams, UseCheckoutOptionsSalesContractReturn, UseCollectibleParams, UseCollectionBalanceDetailsArgs, UseCollectionBalanceDetailsParams, UseCollectionBalanceDetailsReturn, UseCollectionDetailsParams, UseCollectionParams, UseComparePricesArgs, UseComparePricesParams, UseComparePricesReturn, UseConvertPriceToUSDArgs, UseConvertPriceToUSDParams, UseConvertPriceToUSDReturn, UseCountListingsForCollectibleParams, UseCountOfCollectablesParams, UseCountOffersForCollectibleParams, UseCurrencyParams, UseFilterReturn, UseFiltersArgs, UseFiltersParams, UseFloorOrderParams, UseGenerateListingTransactionArgs, UseGenerateOfferTransactionArgs, UseGetCountParams, UseGetTokenRangesParams, UseGetTokenRangesProps, UseGetTokenRangesReturn, UseHighestOfferParams, UseListCollectibleActivitiesArgs, UseListCollectibleActivitiesParams, UseListCollectibleActivitiesReturn, UseListCollectiblesArgs, UseListCollectiblesPaginatedArgs, UseListCollectiblesPaginatedParams, UseListCollectiblesPaginatedReturn, UseListCollectiblesParams, UseListCollectionActivitiesArgs, UseListCollectionActivitiesParams, UseListCollectionActivitiesReturn, UseListCollectionsParams, UseListListingsForCollectibleArgs, UseListListingsForCollectibleParams, UseListListingsForCollectibleReturn, UseListOffersForCollectibleReturn, UseListPrimarySaleItemsParams, UseListTokenMetadataParams, UseLowestListingParams, UseMarketCurrenciesParams, UseRoyaltyArgs, UseTokenSuppliesParams, checkoutOptionsSalesContractQueryOptions, collectionBalanceDetailsQueryOptions, collectionDetailsPollingOptions, collectionQueryOptions, comparePricesQueryOptions, convertPriceToUSDQueryOptions, countListingsForCollectibleQueryOptions, countOfCollectablesQueryOptions, countOffersForCollectibleQueryOptions, filtersQueryOptions, generateCancelTransaction, generateListingTransaction, generateOfferTransaction, generateSellTransaction, getTokenRangesQueryOptions, listCollectibleActivitiesQueryOptions, listCollectiblesPaginatedQueryOptions, listCollectionActivitiesQueryOptions, listListingsForCollectibleQueryOptions, listOffersForCollectibleOptions, useAutoSelectFeeOption, useBalanceOfCollectible, useCancelOrder, useCheckoutOptionsSalesContract, useCollectible, useCollection, useCollectionBalanceDetails, useCollectionDetails, useCollectionDetailsPolling, useComparePrices, useConfig, useConvertPriceToUSD, useCountListingsForCollectible, useCountOfCollectables, useCountOfPrimarySaleItems, useCountOffersForCollectible, useCurrency, useERC721SaleMintedTokens, useFilterState, useFilters, useFiltersProgressive, useFloorOrder, useGenerateCancelTransaction, useGenerateListingTransaction, useGenerateOfferTransaction, useGenerateSellTransaction, useGetCountOfPrimarySaleItems, useGetTokenRanges, useHighestOffer, useInventory, useList1155ShopCardData, useList721ShopCardData, useListBalances, useListCollectibleActivities, useListCollectibles, useListCollectiblesPaginated, useListCollectionActivities, useListCollections, useListListingsForCollectible, useListMarketCardData, useListOffersForCollectible, useListPrimarySaleItems, useListShopCardData, useListTokenMetadata, useLowestListing, useMarketCurrencies, useMarketplaceConfig, useOpenConnectModal, useRoyalty, useShopCollectibleSaleData, useTokenSupplies, useTransferTokens };
//# sourceMappingURL=index-ZOshNC9v.d.ts.map