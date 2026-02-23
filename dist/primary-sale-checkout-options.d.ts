import { Ft as Address$1, T as GetPrimarySaleCheckoutOptionsRequest, Ut as CheckoutOptionsSalesContractResponse, n as CheckoutOptionsItem } from "./index2.js";
import { W as SdkQueryParams, X as WithRequired, it as WithOptionalParams } from "./create-config.js";
import * as _tanstack_react_query137 from "@tanstack/react-query";

//#region src/react/queries/checkout/primary-sale-checkout-options.d.ts
type FetchPrimarySaleCheckoutOptionsParams = GetPrimarySaleCheckoutOptionsRequest;
/**
 * Fetches checkout options for primary sales contract from the Marketplace API
 */
declare function fetchPrimarySaleCheckoutOptions(params: WithRequired<PrimarySaleCheckoutOptionsQueryOptions, 'chainId' | 'walletAddress' | 'contractAddress' | 'collectionAddress' | 'items' | 'config'>): Promise<CheckoutOptionsSalesContractResponse>;
type PrimarySaleCheckoutOptionsQueryOptions = SdkQueryParams<FetchPrimarySaleCheckoutOptionsParams>;
declare function getPrimarySaleCheckoutOptionsQueryKey(params: PrimarySaleCheckoutOptionsQueryOptions): readonly ['checkout', 'primary-sale', {
  chainId: number;
  walletAddress: Address$1;
  contractAddress: Address$1;
  collectionAddress: Address$1;
  items: ReadonlyArray<CheckoutOptionsItem>;
}];
declare function primarySaleCheckoutOptionsQueryOptions(params: WithOptionalParams<WithRequired<PrimarySaleCheckoutOptionsQueryOptions, 'chainId' | 'walletAddress' | 'contractAddress' | 'collectionAddress' | 'items' | 'config'>>): _tanstack_react_query137.OmitKeyof<_tanstack_react_query137.UseQueryOptions<CheckoutOptionsSalesContractResponse, Error, CheckoutOptionsSalesContractResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query137.QueryFunction<CheckoutOptionsSalesContractResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { primarySaleCheckoutOptionsQueryOptions as a, getPrimarySaleCheckoutOptionsQueryKey as i, PrimarySaleCheckoutOptionsQueryOptions as n, fetchPrimarySaleCheckoutOptions as r, FetchPrimarySaleCheckoutOptionsParams as t };
//# sourceMappingURL=primary-sale-checkout-options.d.ts.map