import { Ur as MarketplaceKind, gt as CheckoutOptionsMarketplaceResponse, pt as CheckoutOptionsItem, vt as CheckoutOptionsSalesContractResponse, w as Optional } from "./create-config-BO68TZC5.js";
import { c as fetchMarketCheckoutOptions, n as PrimarySaleCheckoutOptionsQueryOptions, r as fetchPrimarySaleCheckoutOptions, s as MarketCheckoutOptionsQueryOptions } from "./primary-sale-checkout-options-DUXWGOey.js";
import * as _tanstack_react_query169 from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";

//#region src/react/hooks/checkout/market-checkout-options.d.ts
type UseMarketCheckoutOptionsParams = Optional<MarketCheckoutOptionsQueryOptions, 'config' | 'walletAddress'>;
/**
 * Hook to fetch checkout options for marketplace orders
 *
 * Retrieves checkout options including available payment methods, fees, and transaction details
 * for a set of marketplace orders. Requires a connected wallet to calculate wallet-specific options.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.orders - Array of orders to checkout containing collection address, order ID, and marketplace
 * @param params.additionalFee - Additional fee to include in checkout (defaults to 0)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing checkout options with payment methods and fees
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: checkoutOptions, isLoading } = useMarketCheckoutOptions({
 *   chainId: 137,
 *   orders: [{
 *     collectionAddress: '0x1234...',
 *     orderId: '123',
 *     marketplace: MarketplaceKind.sequence_marketplace_v2
 *   }],
 *   additionalFee: 0
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data: checkoutOptions } = useMarketCheckoutOptions({
 *   chainId: 1,
 *   orders: orders,
 *   query: {
 *     enabled: orders.length > 0,
 *     staleTime: 30000
 *   }
 * })
 * ```
 */
declare function useMarketCheckoutOptions(params: UseMarketCheckoutOptionsParams): _tanstack_react_query169.UseQueryResult<CheckoutOptionsMarketplaceResponse, Error>;
type UseMarketCheckoutOptionsArgs = {
  chainId: number;
  orders: Array<{
    collectionAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }>;
  query?: {
    enabled?: boolean;
  };
};
type UseMarketCheckoutOptionsReturn = Awaited<ReturnType<typeof fetchMarketCheckoutOptions>>;
//#endregion
//#region src/react/hooks/checkout/primary-sale-checkout-options.d.ts
type UsePrimarySaleCheckoutOptionsParams = Optional<PrimarySaleCheckoutOptionsQueryOptions, 'config' | 'walletAddress'>;
/**
 * Hook to fetch checkout options for primary sale contract items
 *
 * Retrieves checkout options including available payment methods, fees, and transaction details
 * for items from a primary sales contract. Requires a connected wallet to calculate wallet-specific options.
 *
 * @param params - Configuration parameters or skipToken to skip the query
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The primary sales contract address
 * @param params.collectionAddress - The collection contract address
 * @param params.items - Array of items to purchase with tokenId and quantity
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing checkout options with payment methods and fees
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: checkoutOptions, isLoading } = usePrimarySaleCheckoutOptions({
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
 * const { data: checkoutOptions } = usePrimarySaleCheckoutOptions(
 *   items.length > 0 ? {
 *     chainId: 1,
 *     contractAddress: contractAddress,
 *     collectionAddress: collectionAddress,
 *     items: items
 *   } : skipToken
 * )
 * ```
 */
declare function usePrimarySaleCheckoutOptions(params: UsePrimarySaleCheckoutOptionsParams | typeof skipToken): _tanstack_react_query169.UseQueryResult<CheckoutOptionsSalesContractResponse, Error>;
type UsePrimarySaleCheckoutOptionsArgs = {
  chainId: number;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
};
type UsePrimarySaleCheckoutOptionsReturn = Awaited<ReturnType<typeof fetchPrimarySaleCheckoutOptions>>;
//#endregion
export { UseMarketCheckoutOptionsArgs as a, useMarketCheckoutOptions as c, usePrimarySaleCheckoutOptions as i, UsePrimarySaleCheckoutOptionsParams as n, UseMarketCheckoutOptionsParams as o, UsePrimarySaleCheckoutOptionsReturn as r, UseMarketCheckoutOptionsReturn as s, UsePrimarySaleCheckoutOptionsArgs as t };
//# sourceMappingURL=index-DAge1nkD.d.ts.map