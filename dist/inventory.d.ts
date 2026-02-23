import { It as ChainId, Mt as TokenBalance$1, Pt as TokenMetadata$1, an as MetadataStatus, fn as Page, kt as GetUserCollectionBalancesRequest, s as ContractType } from "./index2.js";
import { W as SdkQueryParams, X as WithRequired, it as WithOptionalParams } from "./create-config.js";
import * as _tanstack_react_query58 from "@tanstack/react-query";

//#region src/react/queries/inventory/inventory.d.ts
type FetchInventoryParams = GetUserCollectionBalancesRequest & {
  chainId: ChainId;
  includeNonTradable?: boolean;
  page?: number;
  pageSize?: number;
};
type CollectibleMetadata = Pick<TokenMetadata$1, 'tokenId' | 'attributes' | 'image' | 'name' | 'description' | 'video' | 'audio'> & {
  status: MetadataStatus;
};
type CollectibleWithBalance = Pick<TokenBalance$1, 'contractInfo'> & {
  metadata: CollectibleMetadata;
  balance: string;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
};
type CollectiblesResponse = {
  collectibles: CollectibleWithBalance[];
  page: Page;
  isTradable: boolean;
};
type InventoryQueryOptions = SdkQueryParams<FetchInventoryParams, {
  enabled?: boolean;
}>;
/**
 * @deprecated Use InventoryQueryOptions instead
 */
type UseInventoryArgs = Omit<InventoryQueryOptions, 'config'> & {
  config?: InventoryQueryOptions['config'];
};
declare function fetchInventory(params: WithRequired<InventoryQueryOptions, 'userAddress' | 'collectionAddress' | 'chainId' | 'config'>): Promise<CollectiblesResponse>;
declare function getInventoryQueryKey(params: InventoryQueryOptions): readonly ["inventory", `0x${string}` | undefined, `0x${string}` | undefined, number | undefined, number, number];
declare function inventoryOptions(params: WithOptionalParams<WithRequired<InventoryQueryOptions, 'userAddress' | 'collectionAddress' | 'chainId' | 'config'>>): _tanstack_react_query58.OmitKeyof<_tanstack_react_query58.UseQueryOptions<CollectiblesResponse, Error, CollectiblesResponse, readonly unknown[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query58.QueryFunction<CollectiblesResponse, readonly unknown[], never> | undefined;
} & {
  queryKey: readonly unknown[] & {
    [dataTagSymbol]: CollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { InventoryQueryOptions as a, getInventoryQueryKey as c, FetchInventoryParams as i, inventoryOptions as l, CollectibleWithBalance as n, UseInventoryArgs as o, CollectiblesResponse as r, fetchInventory as s, CollectibleMetadata as t };
//# sourceMappingURL=inventory.d.ts.map