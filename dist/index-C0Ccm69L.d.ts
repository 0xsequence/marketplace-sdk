import { $ as SdkConfig } from "./create-config-nZqvb8A7.js";
import * as _tanstack_react_query399 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import { Address } from "viem";
import * as xtrails6 from "xtrails";

//#region src/react/queries/collectibles/tokenBalances.d.ts
type UseTokenBalancesArgs = {
  collectionAddress: Address;
  userAddress: Address | undefined;
  chainId: number;
  includeMetadata?: boolean;
  query?: UseQueryParameters;
};
/**
 * Fetches the token balances for a user
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The balance data
 */
declare function fetchTokenBalances(args: Omit<UseTokenBalancesArgs, 'userAddress'> & {
  userAddress: Address;
}, config: SdkConfig): Promise<xtrails6.TokenBalance[]>;
declare function getTokenBalancesQueryKey(args: UseTokenBalancesArgs): readonly ["collectable", "collectable", "details", "userBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
}];
/**
 * Creates a tanstack query options object for the token balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function tokenBalancesOptions(args: UseTokenBalancesArgs, config: SdkConfig): _tanstack_react_query399.UseQueryOptions<xtrails6.TokenBalance[], Error, xtrails6.TokenBalance[], readonly ["collectable", "collectable", "details", "userBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
}]> & {
  initialData?: xtrails6.TokenBalance[] | _tanstack_react_query399.InitialDataFunction<xtrails6.TokenBalance[]> | undefined;
} & {
  queryKey: readonly ["collectable", "collectable", "details", "userBalances", {
    chainId: number;
    accountAddress: `0x${string}` | undefined;
    contractAddress: `0x${string}`;
    includeMetadata: boolean | undefined;
    metadataOptions: {
      verifiedOnly: boolean;
      includeContracts: `0x${string}`[];
    } | undefined;
  }] & {
    [dataTagSymbol]: xtrails6.TokenBalance[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { tokenBalancesOptions as i, fetchTokenBalances as n, getTokenBalancesQueryKey as r, UseTokenBalancesArgs as t };
//# sourceMappingURL=index-C0Ccm69L.d.ts.map