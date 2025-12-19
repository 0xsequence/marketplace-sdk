import { jt as CheckoutOptionsSalesContractResponse, n as CheckoutOptionsItem } from "./index2.js";
import { Y as SdkQueryParams, lt as WithOptionalParams, tt as WithRequired } from "./create-config.js";
import { Address } from "viem";
import * as _tanstack_react_query149 from "@tanstack/react-query";

//#region src/react/queries/checkout/primary-sale-checkout-options.d.ts
interface FetchPrimarySaleCheckoutOptionsParams {
  chainId: number;
  walletAddress: Address;
  contractAddress: Address;
  collectionAddress: Address;
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
declare function primarySaleCheckoutOptionsQueryOptions(params: WithOptionalParams<WithRequired<PrimarySaleCheckoutOptionsQueryOptions, 'chainId' | 'walletAddress' | 'contractAddress' | 'collectionAddress' | 'items' | 'config'>>): _tanstack_react_query149.OmitKeyof<_tanstack_react_query149.UseQueryOptions<CheckoutOptionsSalesContractResponse, Error, CheckoutOptionsSalesContractResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query149.QueryFunction<CheckoutOptionsSalesContractResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { primarySaleCheckoutOptionsQueryOptions as a, getPrimarySaleCheckoutOptionsQueryKey as i, PrimarySaleCheckoutOptionsQueryOptions as n, fetchPrimarySaleCheckoutOptions as r, FetchPrimarySaleCheckoutOptionsParams as t };
//# sourceMappingURL=primary-sale-checkout-options.d.ts.map