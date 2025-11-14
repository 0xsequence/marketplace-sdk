import { G as SdkConfig, Ur as MarketplaceKind, _t as CheckoutOptionsSalesContractRequest, gt as CheckoutOptionsMarketplaceResponse, ht as CheckoutOptionsMarketplaceRequest, j as ValuesOptional, pt as CheckoutOptionsItem, vt as CheckoutOptionsSalesContractResponse } from "./create-config-BO68TZC5.js";
import { n as StandardQueryOptions } from "./query-nV5nNWRA.js";
import * as _tanstack_react_query253 from "@tanstack/react-query";
import { Address } from "viem";

//#region src/react/queries/checkout/market-checkout-options.d.ts
interface FetchMarketCheckoutOptionsParams extends Omit<CheckoutOptionsMarketplaceRequest, 'chainId' | 'wallet' | 'orders'> {
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
declare function fetchMarketCheckoutOptions(params: FetchMarketCheckoutOptionsParams): Promise<CheckoutOptionsMarketplaceResponse>;
type MarketCheckoutOptionsQueryOptions = ValuesOptional<FetchMarketCheckoutOptionsParams> & {
  query?: StandardQueryOptions;
};
declare function getMarketCheckoutOptionsQueryKey(params: MarketCheckoutOptionsQueryOptions): readonly ["checkout", "market-checkout-options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  orders: {
    contractAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }[] | undefined;
  additionalFee: number | undefined;
}];
declare function marketCheckoutOptionsQueryOptions(params: MarketCheckoutOptionsQueryOptions): _tanstack_react_query253.OmitKeyof<_tanstack_react_query253.UseQueryOptions<CheckoutOptionsMarketplaceResponse, Error, CheckoutOptionsMarketplaceResponse, readonly ["checkout", "market-checkout-options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  orders: {
    contractAddress: string;
    orderId: string;
    marketplace: MarketplaceKind;
  }[] | undefined;
  additionalFee: number | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query253.QueryFunction<CheckoutOptionsMarketplaceResponse, readonly ["checkout", "market-checkout-options", {
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
  queryKey: readonly ["checkout", "market-checkout-options", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    orders: {
      contractAddress: string;
      orderId: string;
      marketplace: MarketplaceKind;
    }[] | undefined;
    additionalFee: number | undefined;
  }] & {
    [dataTagSymbol]: CheckoutOptionsMarketplaceResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
//#region src/react/queries/checkout/primary-sale-checkout-options.d.ts
interface FetchPrimarySaleCheckoutOptionsParams extends Omit<CheckoutOptionsSalesContractRequest, 'chainId' | 'wallet'> {
  chainId: number;
  walletAddress: Address;
  contractAddress: string;
  collectionAddress: string;
  items: Array<CheckoutOptionsItem>;
  config: SdkConfig;
}
/**
 * Fetches checkout options for primary sales contract from the Marketplace API
 */
declare function fetchPrimarySaleCheckoutOptions(params: FetchPrimarySaleCheckoutOptionsParams): Promise<CheckoutOptionsSalesContractResponse>;
type PrimarySaleCheckoutOptionsQueryOptions = ValuesOptional<FetchPrimarySaleCheckoutOptionsParams> & {
  query?: StandardQueryOptions;
};
declare function getPrimarySaleCheckoutOptionsQueryKey(params: PrimarySaleCheckoutOptionsQueryOptions): readonly ["checkout", "primary-sale-checkout-options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  contractAddress: string | undefined;
  collectionAddress: string | undefined;
  items: CheckoutOptionsItem[] | undefined;
}];
declare function primarySaleCheckoutOptionsQueryOptions(params: PrimarySaleCheckoutOptionsQueryOptions): _tanstack_react_query253.OmitKeyof<_tanstack_react_query253.UseQueryOptions<CheckoutOptionsSalesContractResponse, Error, CheckoutOptionsSalesContractResponse, readonly ["checkout", "primary-sale-checkout-options", {
  chainId: string;
  wallet: `0x${string}` | undefined;
  contractAddress: string | undefined;
  collectionAddress: string | undefined;
  items: CheckoutOptionsItem[] | undefined;
}]>, "queryFn"> & {
  queryFn?: _tanstack_react_query253.QueryFunction<CheckoutOptionsSalesContractResponse, readonly ["checkout", "primary-sale-checkout-options", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    contractAddress: string | undefined;
    collectionAddress: string | undefined;
    items: CheckoutOptionsItem[] | undefined;
  }], never> | undefined;
} & {
  queryKey: readonly ["checkout", "primary-sale-checkout-options", {
    chainId: string;
    wallet: `0x${string}` | undefined;
    contractAddress: string | undefined;
    collectionAddress: string | undefined;
    items: CheckoutOptionsItem[] | undefined;
  }] & {
    [dataTagSymbol]: CheckoutOptionsSalesContractResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { primarySaleCheckoutOptionsQueryOptions as a, fetchMarketCheckoutOptions as c, getPrimarySaleCheckoutOptionsQueryKey as i, getMarketCheckoutOptionsQueryKey as l, PrimarySaleCheckoutOptionsQueryOptions as n, FetchMarketCheckoutOptionsParams as o, fetchPrimarySaleCheckoutOptions as r, MarketCheckoutOptionsQueryOptions as s, FetchPrimarySaleCheckoutOptionsParams as t, marketCheckoutOptionsQueryOptions as u };
//# sourceMappingURL=primary-sale-checkout-options-DUXWGOey.d.ts.map