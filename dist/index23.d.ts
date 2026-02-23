import { $ as PrimarySaleItem, Ft as Address$1, Lt as Hash$1, Z as Order, it as Step, l as Currency, s as ContractType, ut as ContractInfo$1, yt as TokenMetadata$1 } from "./index2.js";
import { B as Optional, I as CollectionType, a as CheckoutMode, l as CardType, s as MarketplaceSdkContext, u as CollectibleCardAction, w as BuyModalProps } from "./create-config.js";
import { R as useCollectibleBalance } from "./index11.js";
import { f as useCollectionMetadata } from "./index12.js";
import { t as CardClassNames } from "./types.js";
import { _ as ComparePricesQueryOptions, d as ConvertPriceToUSDQueryOptions, f as ConvertPriceToUSDReturn, n as MarketCurrenciesQueryOptions, o as CurrencyQueryOptions, v as ComparePricesReturn } from "./index28.js";
import { u as CollectibleMetadata } from "./index34.js";
import { a as ModalSteps, i as ModalContext } from "./steps.js";
import { ReactNode } from "react";
import * as react_jsx_runtime58 from "react/jsx-runtime";
import * as _tanstack_react_query232 from "@tanstack/react-query";

//#region src/react/providers/modal-provider.d.ts
interface ModalProviderProps {
  children?: ReactNode;
}
declare const ModalProvider: ({
  children
}: ModalProviderProps) => react_jsx_runtime58.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCardPresentation.d.ts
interface MarketCardPresentationProps {
  /** Token identification */
  tokenId: bigint;
  chainId: number;
  collectionAddress: Address$1;
  collectionType: ContractType;
  /** Display data */
  collectibleMetadata: CollectibleMetadata;
  currency?: Currency;
  lowestListing?: Order;
  highestOffer?: Order;
  balance?: string;
  /** Asset configuration */
  assetSrcPrefixUrl?: string;
  /** Interaction handlers */
  onCollectibleClick?: (tokenId: bigint) => void;
  onOfferClick?: (params: {
    order: Order;
    e: React.MouseEvent<HTMLButtonElement>;
  }) => void;
  /** Action button configuration */
  action: CollectibleCardAction;
  showActionButton?: boolean;
  onCannotPerformAction?: (action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER) => void;
  prioritizeOwnerActions?: boolean;
  hideQuantitySelector?: boolean;
  classNames?: CardClassNames;
}
/**
 * MarketCardPresentation - Pure presentation component for market cards
 *
 * This is a "dumb" component that receives all data as props and handles no data fetching.
 * Use this when you want full control over data fetching, or for SSR/SSG scenarios.
 *
 * For a convenient "smart" component with built-in data fetching, use MarketCard instead.
 *
 * @example
 * ```tsx
 * // With pre-fetched data
 * <MarketCardPresentation
 *   tokenId="123"
 *   chainId={1}
 *   collectibleMetadata={metadata}
 *   currency={currency}
 *   lowestListing={listing}
 * />
 * ```
 */
declare function MarketCardPresentation({
  tokenId,
  chainId,
  collectionAddress,
  collectionType,
  collectibleMetadata,
  currency,
  lowestListing,
  highestOffer,
  balance,
  assetSrcPrefixUrl,
  onCollectibleClick,
  onOfferClick,
  action,
  showActionButton,
  onCannotPerformAction,
  prioritizeOwnerActions,
  hideQuantitySelector,
  classNames
}: MarketCardPresentationProps): react_jsx_runtime58.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCardPresentation.d.ts
interface ShopCardPresentationProps {
  /** Token identification */
  tokenId: bigint;
  chainId: number;
  collectionAddress: Address$1;
  collectionType: ContractType;
  /** Display data */
  tokenMetadata: CollectibleMetadata;
  saleCurrency?: Currency;
  /** Sale information */
  salePrice?: {
    amount: bigint;
    currencyAddress: Address$1;
  };
  /** Asset configuration */
  assetSrcPrefixUrl?: string;
  /** Shop card state */
  shopState: {
    mediaClassName?: string;
    titleClassName?: string;
    showActionButton: boolean;
  };
  /** Action button configuration */
  cardType: CardType;
  salesContractAddress?: Address$1;
  quantityRemaining?: bigint;
  unlimitedSupply?: boolean;
  hideQuantitySelector?: boolean;
  classNames?: CardClassNames;
}
/**
 * ShopCardPresentation - Pure presentation component for shop/primary sale cards
 *
 * This is a "dumb" component that receives all data as props and handles no data fetching.
 * Use this when you want full control over data fetching, or for SSR/SSG scenarios.
 *
 * For a convenient "smart" component with built-in data fetching, use ShopCard instead.
 *
 * @example
 * ```tsx
 * // With pre-fetched data
 * <ShopCardPresentation
 *   tokenId="123"
 *   chainId={1}
 *   tokenMetadata={metadata}
 *   saleCurrency={currency}
 *   shopState={shopState}
 * />
 * ```
 */
declare function ShopCardPresentation({
  tokenId,
  chainId,
  collectionAddress,
  collectionType,
  tokenMetadata,
  saleCurrency,
  salePrice,
  assetSrcPrefixUrl,
  shopState,
  cardType,
  salesContractAddress,
  quantityRemaining,
  unlimitedSupply,
  hideQuantitySelector,
  classNames
}: ShopCardPresentationProps): react_jsx_runtime58.JSX.Element;
//#endregion
//#region src/react/ui/components/media/types.d.ts
type MediaProps = {
  name?: string;
  assets: (string | undefined)[];
  assetSrcPrefixUrl?: string;
  /**
   * @deprecated Use containerClassName instead
   */
  className?: string;
  containerClassName?: string;
  mediaClassname?: string;
  isLoading?: boolean;
  fallbackContent?: ReactNode;
  shouldListenForLoad?: boolean;
};
//#endregion
//#region src/react/ui/components/media/Media.d.ts
/**
 * @description This component is used to display a collectible asset.
 * It will display the first valid asset from the assets array.
 * If no valid asset is found, it will display the fallback content or the default placeholder image.
 *
 * @example
 * <Media
 *  name="Collectible"
 *  assets={[undefined, "some-image-url", undefined]} // undefined assets will be ignored, "some-image-url" will be rendered
 *  assetSrcPrefixUrl="https://example.com/"
 *  className="w-full h-full"
 *  fallbackContent={<YourCustomFallbackComponent />} // Optional custom fallback content
 * />
 */
declare function Media({
  name,
  assets,
  assetSrcPrefixUrl,
  className,
  containerClassName,
  mediaClassname,
  isLoading,
  fallbackContent,
  shouldListenForLoad
}: MediaProps): react_jsx_runtime58.JSX.Element;
//#endregion
//#region src/react/ui/modals/BuyModal/internal/buyModalContext.d.ts
declare function useBuyModalContext(): {
  config: MarketplaceSdkContext;
  modalProps: BuyModalProps;
  close: () => void;
  steps: Step[] | undefined;
  collectible: TokenMetadata$1 | undefined;
  collection: ContractInfo$1 | undefined;
  primarySaleItem: PrimarySaleItem | undefined;
  marketOrder: Order | undefined;
  isShop: boolean;
  buyStep: Step | undefined;
  isLoading: boolean;
  checkoutMode: CheckoutMode | undefined;
  formattedAmount: string | undefined;
  handleTransactionSuccess: (hash: Hash$1) => void;
  handleTrailsSuccess: (data: {
    txHash: string;
    chainId: number;
    sessionId: string;
  }) => void;
  error: Error | null;
  refetchAll: () => Promise<void>;
};
type BuyModalContext = ReturnType<typeof useBuyModalContext>;
//#endregion
//#region src/react/ui/modals/BuyModal/index.d.ts
declare const useBuyModal: () => {
  show: (args: BuyModalProps) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/TransferModal/internal/store.d.ts
type ShowTransferModalArgs = {
  collectionAddress: Address$1;
  tokenId: bigint;
  chainId: number;
  collectionType?: CollectionType;
};
type UseTransferModalArgs = {
  prefetch?: {
    tokenId: bigint;
    chainId: number;
    collectionAddress: Address$1;
  };
};
declare const useTransferModal: (args?: UseTransferModalArgs) => {
  show: (openArgs: ShowTransferModalArgs) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/TransferModal/internal/context.d.ts
type TransferModalSteps = ModalSteps<'transfer'>;
type TransferModalContext = ModalContext<'transfer', TransferModalSteps> & {
  item: {
    chainId: number;
    collectionAddress: Address$1;
    tokenId: bigint;
  };
  form: {
    receiver: {
      input: string;
      update: (value: string) => void;
      touch: () => void;
      isTouched: boolean;
      validation: {
        isValid: boolean;
        error: string | null;
      };
    };
    quantity: {
      input: bigint;
      update: (value: bigint) => void;
      touch: () => void;
      isTouched: boolean;
      validation: {
        isValid: boolean;
        error: string | null;
      };
    };
    isValid: boolean;
    errors: {
      receiver?: string;
      quantity?: string;
      contractType?: string | null;
    };
  };
  queries: {
    collection: ReturnType<typeof useCollectionMetadata>;
    collectibleBalance: ReturnType<typeof useCollectibleBalance>;
  };
  transactions: {
    transfer: string | undefined;
  };
  loading: {
    collection: boolean;
    collectibleBalance: boolean;
  };
  formError: string | undefined;
  actions: {
    transfer: {
      label: string;
      onClick: () => Promise<void>;
      loading: boolean;
      disabled: boolean;
      testid: string;
    };
  };
};
declare function useTransferModalContext(): TransferModalContext;
//#endregion
//#region src/react/ui/modals/TransferModal/index.d.ts
declare const TransferModal: () => react_jsx_runtime58.JSX.Element | null;
//#endregion
//#region src/react/hooks/currency/compare-prices.d.ts
type UseCurrencyComparePricesParams = Optional<ComparePricesQueryOptions, 'config'>;
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
 * const { data: comparison, isLoading } = useCurrencyComparePrices({
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
 * const { data: comparison } = useCurrencyComparePrices({
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
declare function useCurrencyComparePrices(params: UseCurrencyComparePricesParams): _tanstack_react_query232.UseQueryResult<ComparePricesReturn, Error>;
type UseComparePricesArgs = {
  chainId: number;
  priceAmountRaw: string;
  priceCurrencyAddress: Address$1;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address$1;
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
//#region src/react/hooks/currency/convert-to-usd.d.ts
type UseCurrencyConvertToUSDParams = Optional<ConvertPriceToUSDQueryOptions, 'config'>;
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
 * const { data: conversion, isLoading } = useCurrencyConvertToUSD({
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
 * const { data: conversion } = useCurrencyConvertToUSD({
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
declare function useCurrencyConvertToUSD(params: UseCurrencyConvertToUSDParams): _tanstack_react_query232.UseQueryResult<ConvertPriceToUSDReturn, Error>;
type UseConvertPriceToUSDArgs = {
  chainId: number;
  currencyAddress: Address$1;
  amountRaw: string;
  query?: {
    enabled?: boolean;
  };
};
type UseConvertPriceToUSDReturn = ConvertPriceToUSDReturn;
//#endregion
//#region src/react/hooks/currency/currency.d.ts
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
declare function useCurrency(params: UseCurrencyParams): _tanstack_react_query232.UseQueryResult<Currency | undefined, Error>;
//#endregion
//#region src/react/hooks/currency/list.d.ts
type UseCurrencyListParams = Optional<MarketCurrenciesQueryOptions, 'config'>;
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
 * const { data, isLoading } = useCurrencyList({
 *   chainId: 137
 * })
 * ```
 *
 * @example
 * Exclude native currency:
 * ```typescript
 * const { data, isLoading } = useCurrencyList({
 *   chainId: 1,
 *   includeNativeCurrency: false
 * })
 * ```
 */
declare function useCurrencyList(params: UseCurrencyListParams): _tanstack_react_query232.UseQueryResult<Currency[], Error>;
//#endregion
export { ShopCardPresentation as C, ModalProvider as D, MarketCardPresentationProps as E, Media as S, MarketCardPresentation as T, UseTransferModalArgs as _, UseConvertPriceToUSDArgs as a, BuyModalContext as b, useCurrencyConvertToUSD as c, UseCurrencyComparePricesParams as d, useCurrencyComparePrices as f, ShowTransferModalArgs as g, useTransferModalContext as h, useCurrency as i, UseComparePricesArgs as l, TransferModalContext as m, useCurrencyList as n, UseConvertPriceToUSDReturn as o, TransferModal as p, UseCurrencyParams as r, UseCurrencyConvertToUSDParams as s, UseCurrencyListParams as t, UseComparePricesReturn as u, useTransferModal as v, ShopCardPresentationProps as w, useBuyModalContext as x, useBuyModal as y };
//# sourceMappingURL=index23.d.ts.map