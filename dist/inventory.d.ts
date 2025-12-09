import { At as MetadataStatus, Dn as WithRequired, Fn as WithOptionalParams, J as ContractType$1, vr as Page$1, xn as SdkQueryParams } from "./create-config.js";
import { IndexerContractInfo } from "@0xsequence/api-client";
import { Address as Address$1 } from "viem";
import * as _tanstack_react_query80 from "@tanstack/react-query";

//#region src/react/queries/inventory/inventory.d.ts
interface FetchInventoryParams {
  accountAddress: Address$1;
  collectionAddress: Address$1;
  chainId: number;
  includeNonTradable?: boolean;
  page?: number;
  pageSize?: number;
}
interface CollectibleWithBalance {
  metadata: {
    tokenId: bigint;
    attributes: Array<any>;
    image?: string;
    name: string;
    description?: string;
    video?: string;
    audio?: string;
    status: MetadataStatus;
  };
  balance: string;
  contractInfo?: IndexerContractInfo;
  contractType: ContractType$1.ERC1155 | ContractType$1.ERC721;
}
interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: Page$1;
  isTradable: boolean;
}
type InventoryQueryOptions = SdkQueryParams<FetchInventoryParams, {
  enabled?: boolean;
}>;
/**
 * @deprecated Use InventoryQueryOptions instead
 */
type UseInventoryArgs = Omit<InventoryQueryOptions, 'config'> & {
  config?: InventoryQueryOptions['config'];
};
declare function fetchInventory(params: WithRequired<InventoryQueryOptions, 'accountAddress' | 'collectionAddress' | 'chainId' | 'config'>): Promise<CollectiblesResponse>;
declare function getInventoryQueryKey(params: InventoryQueryOptions): readonly ["inventory", `0x${string}` | undefined, `0x${string}` | undefined, number | undefined, number, number];
declare function inventoryOptions(params: WithOptionalParams<WithRequired<InventoryQueryOptions, 'accountAddress' | 'collectionAddress' | 'chainId' | 'config'>>): _tanstack_react_query80.OmitKeyof<_tanstack_react_query80.UseQueryOptions<CollectiblesResponse, Error, CollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query80.QueryFunction<CollectiblesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { UseInventoryArgs as a, inventoryOptions as c, InventoryQueryOptions as i, CollectiblesResponse as n, fetchInventory as o, FetchInventoryParams as r, getInventoryQueryKey as s, CollectibleWithBalance as t };
//# sourceMappingURL=inventory.d.ts.map