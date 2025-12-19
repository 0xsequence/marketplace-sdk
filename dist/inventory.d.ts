import { en as Page, gt as ContractInfo$1, qt as MetadataStatus, s as ContractType } from "./index2.js";
import { Y as SdkQueryParams, lt as WithOptionalParams, tt as WithRequired } from "./create-config.js";
import { Address } from "viem";
import * as _tanstack_react_query71 from "@tanstack/react-query";

//#region src/react/queries/inventory/inventory.d.ts
interface FetchInventoryParams {
  accountAddress: Address;
  collectionAddress: Address;
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
  contractInfo?: ContractInfo$1;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
}
interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: Page;
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
declare function inventoryOptions(params: WithOptionalParams<WithRequired<InventoryQueryOptions, 'accountAddress' | 'collectionAddress' | 'chainId' | 'config'>>): _tanstack_react_query71.OmitKeyof<_tanstack_react_query71.UseQueryOptions<CollectiblesResponse, Error, CollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query71.QueryFunction<CollectiblesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { UseInventoryArgs as a, inventoryOptions as c, InventoryQueryOptions as i, CollectiblesResponse as n, fetchInventory as o, FetchInventoryParams as r, getInventoryQueryKey as s, CollectibleWithBalance as t };
//# sourceMappingURL=inventory.d.ts.map