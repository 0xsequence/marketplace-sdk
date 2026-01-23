import { Ft as Address$1, s as ContractType } from "./index2.js";
import * as viem50 from "viem";

//#region src/react/hooks/contracts/useERC721Owner.d.ts
interface UseERC721OwnerParams {
  chainId: number;
  collectionAddress?: Address$1;
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
  owner: `0x${string}` | undefined;
  isLoading: boolean;
  error: viem50.ReadContractErrorType | null;
};
//#endregion
export { useERC721Owner as t };
//# sourceMappingURL=index15.d.ts.map