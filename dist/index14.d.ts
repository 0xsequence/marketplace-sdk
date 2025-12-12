import { Jn as ContractType } from "./create-config.js";
import * as viem47 from "viem";
import { Address } from "viem";

//#region src/react/hooks/contracts/useERC721Owner.d.ts
interface UseERC721OwnerParams {
  chainId: number;
  collectionAddress?: Address;
  tokenId?: bigint;
  contractType: ContractType;
  enabled?: boolean;
}
declare function useERC721Owner({
  chainId,
  collectionAddress,
  tokenId,
  contractType,
  enabled
}: UseERC721OwnerParams): {
  owner: Address | undefined;
  isLoading: boolean;
  error: viem47.ReadContractErrorType | null;
};
//#endregion
export { useERC721Owner as t };
//# sourceMappingURL=index14.d.ts.map