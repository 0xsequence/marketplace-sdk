import { CheckoutOptionsItem, CheckoutOptionsMarketplaceArgs, CheckoutOptionsMarketplaceReturn, CheckoutOptionsSalesContractArgs, CheckoutOptionsSalesContractReturn, MarketplaceKind, SdkConfig, ValuesOptional } from "./create-config-BJwAgEA2.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query348 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/market/checkoutOptions.d.ts
interface FetchCheckoutOptionsParams extends Omit<CheckoutOptionsMarketplaceArgs, 'chainId' | 'wallet' | 'orders'> {
  chainId: number;
  walletAddress: Address;
  orders: Array<{
    collectionAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }>;
  config: SdkConfig;
}
/**
 * Fetches checkout options from the Marketplace API
 */
declare function fetchCheckoutOptions(params: FetchCheckoutOptionsParams): Promise<CheckoutOptionsMarketplaceReturn>;
type CheckoutOptionsQueryOptions = ValuesOptional<FetchCheckoutOptionsParams> & {
  query?: StandardQueryOptions;
};
declare function getCheckoutOptionsQueryKey(params: CheckoutOptionsQueryOptions): readonly ["checkouts", "options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  orders: {
    contractAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }[] | undefined;
  additionalFee: number | undefined;
}];
declare function checkoutOptionsQueryOptions(params: CheckoutOptionsQueryOptions): _tanstack_react_query348.OmitKeyof<_tanstack_react_query348.UseQueryOptions<CheckoutOptionsMarketplaceReturn, Error, CheckoutOptionsMarketplaceReturn, readonly ["checkouts", "options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  orders: {
    contractAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }[] | undefined;
  additionalFee: number | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query348.QueryFunction<CheckoutOptionsMarketplaceReturn, readonly ["checkouts", "options", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    orders: {
      contractAddress: string;
      orderId: string;
      marketplace: MarketplaceKind;
    }[] | undefined;
    additionalFee: number | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["checkouts", "options", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    orders: {
      contractAddress: string;
      orderId: string;
      marketplace: MarketplaceKind;
    }[] | undefined;
    additionalFee: number | undefined;
  }] & {
    [dataTagSymbol]: CheckoutOptionsMarketplaceReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/market/checkoutOptionsSalesContract.d.ts
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
declare function getCheckoutOptionsSalesContractQueryKey(params: CheckoutOptionsSalesContractQueryOptions): readonly ["checkouts", "options", "salesContract", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  contractAddress: string | undefined;
  collectionAddress: string | undefined;
  items: CheckoutOptionsItem[] | undefined;
}];
declare function checkoutOptionsSalesContractQueryOptions(params: CheckoutOptionsSalesContractQueryOptions): _tanstack_react_query348.OmitKeyof<_tanstack_react_query348.UseQueryOptions<CheckoutOptionsSalesContractReturn, Error, CheckoutOptionsSalesContractReturn, readonly ["checkouts", "options", "salesContract", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  contractAddress: string | undefined;
  collectionAddress: string | undefined;
  items: CheckoutOptionsItem[] | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query348.QueryFunction<CheckoutOptionsSalesContractReturn, readonly ["checkouts", "options", "salesContract", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    contractAddress: string | undefined;
    collectionAddress: string | undefined;
    items: CheckoutOptionsItem[] | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["checkouts", "options", "salesContract", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    contractAddress: string | undefined;
    collectionAddress: string | undefined;
    items: CheckoutOptionsItem[] | undefined;
  }] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { CheckoutOptionsQueryOptions, CheckoutOptionsSalesContractQueryOptions, FetchCheckoutOptionsParams, FetchCheckoutOptionsSalesContractParams, checkoutOptionsQueryOptions, checkoutOptionsSalesContractQueryOptions, fetchCheckoutOptions, fetchCheckoutOptionsSalesContract, getCheckoutOptionsQueryKey, getCheckoutOptionsSalesContractQueryKey };
//# sourceMappingURL=index-C4OcZd8X.d.ts.map