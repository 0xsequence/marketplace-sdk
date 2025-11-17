import { $ as SdkConfig, Mt as CheckoutOptionsSalesContractArgs, Nt as CheckoutOptionsSalesContractReturn, Ot as CheckoutOptionsItem, jt as CheckoutOptionsMarketplaceReturn, kt as CheckoutOptionsMarketplaceArgs, ti as MarketplaceKind, z as ValuesOptional } from "./create-config.js";
import { n as StandardQueryOptions } from "./query.js";
import * as _tanstack_react_query302 from "@tanstack/react-query";
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
declare function checkoutOptionsQueryOptions(params: CheckoutOptionsQueryOptions): _tanstack_react_query302.OmitKeyof<_tanstack_react_query302.UseQueryOptions<CheckoutOptionsMarketplaceReturn, Error, CheckoutOptionsMarketplaceReturn, readonly ["checkouts", "options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  orders: {
    contractAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }[] | undefined;
  additionalFee: number | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query302.QueryFunction<CheckoutOptionsMarketplaceReturn, readonly ["checkouts", "options", {
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
declare function checkoutOptionsSalesContractQueryOptions(params: CheckoutOptionsSalesContractQueryOptions): _tanstack_react_query302.OmitKeyof<_tanstack_react_query302.UseQueryOptions<CheckoutOptionsSalesContractReturn, Error, CheckoutOptionsSalesContractReturn, readonly ["checkouts", "options", "salesContract", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  contractAddress: string | undefined;
  collectionAddress: string | undefined;
  items: CheckoutOptionsItem[] | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query302.QueryFunction<CheckoutOptionsSalesContractReturn, readonly ["checkouts", "options", "salesContract", {
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
export { getCheckoutOptionsSalesContractQueryKey as a, checkoutOptionsQueryOptions as c, fetchCheckoutOptionsSalesContract as i, fetchCheckoutOptions as l, FetchCheckoutOptionsSalesContractParams as n, CheckoutOptionsQueryOptions as o, checkoutOptionsSalesContractQueryOptions as r, FetchCheckoutOptionsParams as s, CheckoutOptionsSalesContractQueryOptions as t, getCheckoutOptionsQueryKey as u };
//# sourceMappingURL=index17.d.ts.map