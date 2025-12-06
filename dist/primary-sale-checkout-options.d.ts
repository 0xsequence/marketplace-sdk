import { Dn as WithRequired, xn as SdkQueryParams } from "./create-config.js";
import { CheckoutOptionsItem, CheckoutOptionsSalesContractResponse } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query136 from "@tanstack/react-query";

//#region src/react/queries/checkout/primary-sale-checkout-options.d.ts
interface FetchPrimarySaleCheckoutOptionsParams {
  chainId: number;
  walletAddress: Address$1;
  contractAddress: Address$1;
  collectionAddress: Address$1;
  items: CheckoutOptionsItem[];
}
/**
 * Fetches checkout options for primary sales contract from the Marketplace API
 */
declare function fetchPrimarySaleCheckoutOptions(params: WithRequired<PrimarySaleCheckoutOptionsQueryOptions, 'chainId' | 'walletAddress' | 'contractAddress' | 'collectionAddress' | 'items' | 'config'>): Promise<CheckoutOptionsSalesContractResponse>;
type PrimarySaleCheckoutOptionsQueryOptions = SdkQueryParams<FetchPrimarySaleCheckoutOptionsParams>;
declare function getPrimarySaleCheckoutOptionsQueryKey(params: PrimarySaleCheckoutOptionsQueryOptions): readonly ["checkout", "primary-sale", {
  readonly chainId: number;
  readonly walletAddress: `0x${string}`;
  readonly contractAddress: "" | `0x${string}`;
  readonly collectionAddress: "" | `0x${string}`;
  readonly items: CheckoutOptionsItem[];
}];
declare function primarySaleCheckoutOptionsQueryOptions(params: PrimarySaleCheckoutOptionsQueryOptions): _tanstack_react_query136.OmitKeyof<_tanstack_react_query136.UseQueryOptions<CheckoutOptionsSalesContractResponse, Error, CheckoutOptionsSalesContractResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query136.QueryFunction<CheckoutOptionsSalesContractResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { primarySaleCheckoutOptionsQueryOptions as a, getPrimarySaleCheckoutOptionsQueryKey as i, PrimarySaleCheckoutOptionsQueryOptions as n, fetchPrimarySaleCheckoutOptions as r, FetchPrimarySaleCheckoutOptionsParams as t };
//# sourceMappingURL=primary-sale-checkout-options.d.ts.map