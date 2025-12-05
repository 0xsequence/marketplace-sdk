import { Lt as ContractType } from "./create-config.js";
import { i as ERC721_SALE_ABI_V0, n as ERC1155_SALES_CONTRACT_ABI_V0, r as ERC721_SALE_ABI_V1, t as ERC1155_SALES_CONTRACT_ABI_V1 } from "./index5.js";
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
export { useSalesContractABI as n, SalesContractVersion as t };
//# sourceMappingURL=index9.d.ts.map