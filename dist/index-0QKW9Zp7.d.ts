import { $ as SdkConfig, Gt as ContractType, mi as Page$1, ni as MetadataStatus } from "./create-config-DMM2szLh.js";
import * as _tanstack_react_query246 from "@tanstack/react-query";
import { ContractInfo } from "@0xsequence/indexer";
import { Address } from "viem";

//#region src/react/queries/inventory/inventory.d.ts
interface UseInventoryArgs {
  accountAddress: Address;
  collectionAddress: Address;
  chainId: number;
  includeNonTradable?: boolean;
  query?: {
    enabled?: boolean;
    page?: number;
    pageSize?: number;
  };
}
type GetInventoryArgs = Omit<UseInventoryArgs, 'query'>;
interface CollectibleWithBalance {
  metadata: {
    tokenId: string;
    attributes: Array<any>;
    image?: string;
    name: string;
    description?: string;
    video?: string;
    audio?: string;
    status: MetadataStatus;
  };
  balance: string;
  contractInfo?: ContractInfo;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
}
interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: Page$1;
  isTradable: boolean;
}
declare function fetchInventory(args: GetInventoryArgs, config: SdkConfig, page: Page$1): Promise<CollectiblesResponse>;
declare function inventoryOptions(args: UseInventoryArgs, config: SdkConfig): _tanstack_react_query246.OmitKeyof<_tanstack_react_query246.UseQueryOptions<CollectiblesResponse, Error, CollectiblesResponse, (string | number)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query246.QueryFunction<CollectiblesResponse, (string | number)[], never> | undefined;
} & {
  queryKey: (string | number)[] & {
    [dataTagSymbol]: CollectiblesResponse;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { inventoryOptions as i, UseInventoryArgs as n, fetchInventory as r, CollectiblesResponse as t };
//# sourceMappingURL=index-0QKW9Zp7.d.ts.map