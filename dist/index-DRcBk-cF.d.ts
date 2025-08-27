import { ContractType } from "./create-config-Cg2OSDO8.js";
import { ERC1155_SALES_CONTRACT_ABI_V0, ERC1155_SALES_CONTRACT_ABI_V1, ERC721_SALE_ABI_V0, ERC721_SALE_ABI_V1 } from "./index-DX0Vm8HY.js";
import { Address } from "viem";

//#region src/react/hooks/contracts/useSalesContractABI.d.ts
declare enum SalesContractVersion {
  V0 = "v0",
  V1 = "v1",
}
interface UseSalesContractABIProps {
  contractAddress: Address;
  contractType: ContractType.ERC721 | ContractType.ERC1155;
  chainId: number;
  enabled?: boolean;
}
type UseSalesContractABIResult = {
  version: null;
  abi: null;
  contractType: null;
  isLoading: true;
  error: null;
} | {
  version: SalesContractVersion.V0;
  abi: typeof ERC721_SALE_ABI_V0;
  contractType: ContractType.ERC721;
  isLoading: false;
  error: null;
} | {
  version: SalesContractVersion.V0;
  abi: typeof ERC1155_SALES_CONTRACT_ABI_V0;
  contractType: ContractType.ERC1155;
  isLoading: false;
  error: null;
} | {
  version: SalesContractVersion.V1;
  abi: typeof ERC721_SALE_ABI_V1;
  contractType: ContractType.ERC721;
  isLoading: false;
  error: null;
} | {
  version: SalesContractVersion.V1;
  abi: typeof ERC1155_SALES_CONTRACT_ABI_V1;
  contractType: ContractType.ERC1155;
  isLoading: false;
  error: null;
} | {
  version: null;
  abi: null;
  contractType: null;
  isLoading: false;
  error: Error;
};
declare function useSalesContractABI({
  contractAddress,
  contractType,
  chainId,
  enabled
}: UseSalesContractABIProps): UseSalesContractABIResult;
//#endregion
export { SalesContractVersion, useSalesContractABI };
//# sourceMappingURL=index-DRcBk-cF.d.ts.map