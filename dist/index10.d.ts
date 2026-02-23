import { Ut as CheckoutOptionsSalesContractResponse, n as CheckoutOptionsItem } from "./index2.js";
import { L as HookParamsFromApiRequest } from "./create-config.js";
import { n as PrimarySaleCheckoutOptionsQueryOptions, r as fetchPrimarySaleCheckoutOptions, t as FetchPrimarySaleCheckoutOptionsParams } from "./primary-sale-checkout-options.js";
import * as _tanstack_react_query410 from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";

//#region src/react/hooks/checkout/primary-sale-checkout-options.d.ts
type UsePrimarySaleCheckoutOptionsParams = Omit<HookParamsFromApiRequest<FetchPrimarySaleCheckoutOptionsParams, Pick<PrimarySaleCheckoutOptionsQueryOptions, 'query' | 'config'>>, 'walletAddress'>;
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
declare function usePrimarySaleCheckoutOptions(params: UsePrimarySaleCheckoutOptionsParams | typeof skipToken): _tanstack_react_query410.UseQueryResult<CheckoutOptionsSalesContractResponse, Error>;
type UsePrimarySaleCheckoutOptionsArgs = {
  chainId: number;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
};
type UsePrimarySaleCheckoutOptionsReturn = Awaited<ReturnType<typeof fetchPrimarySaleCheckoutOptions>>;
//#endregion
export { usePrimarySaleCheckoutOptions as i, UsePrimarySaleCheckoutOptionsParams as n, UsePrimarySaleCheckoutOptionsReturn as r, UsePrimarySaleCheckoutOptionsArgs as t };
//# sourceMappingURL=index10.d.ts.map