import { SdkConfig } from "./create-config-DoEY40YQ.js";
import * as _tanstack_react_query135 from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";
import * as _0xsequence_indexer8 from "@0xsequence/indexer";
import { Address } from "viem";

//#region src/react/queries/collectibles/tokenBalances.d.ts
type UseTokenBalancesArgs = {
  collectionAddress: Address;
  userAddress: Address | undefined;
  chainId: number;
  isLaos721?: boolean;
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
}, config: SdkConfig): Promise<_0xsequence_indexer8.TokenBalance[]>;
declare function getTokenBalancesQueryKey(args: UseTokenBalancesArgs): readonly ["collectable", "collectable", "details", "userBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
  isLaos721: boolean | undefined;
}];
/**
 * Creates a tanstack query options object for the token balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
declare function tokenBalancesOptions(args: UseTokenBalancesArgs, config: SdkConfig): _tanstack_react_query135.UseQueryOptions<_0xsequence_indexer8.TokenBalance[], Error, _0xsequence_indexer8.TokenBalance[], readonly ["collectable", "collectable", "details", "userBalances", {
  chainId: number;
  accountAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}`;
  includeMetadata: boolean | undefined;
  metadataOptions: {
    verifiedOnly: boolean;
    includeContracts: `0x${string}`[];
  } | undefined;
  isLaos721: boolean | undefined;
}]> & {
  initialData?: _0xsequence_indexer8.TokenBalance[] | _tanstack_react_query135.InitialDataFunction<_0xsequence_indexer8.TokenBalance[]> | undefined;
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
    isLaos721: boolean | undefined;
  }] & {
    [dataTagSymbol]: _0xsequence_indexer8.TokenBalance[];
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { UseTokenBalancesArgs, fetchTokenBalances, getTokenBalancesQueryKey, tokenBalancesOptions };
//# sourceMappingURL=index-DFCRz4Tk.d.ts.map