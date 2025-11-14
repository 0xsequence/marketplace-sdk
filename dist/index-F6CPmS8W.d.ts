import { ContractType } from "./create-config-rrEYvm6u.js";
import { ERC1155_SALES_CONTRACT_ABI_V0$1 as ERC1155_SALES_CONTRACT_ABI_V0, ERC1155_SALES_CONTRACT_ABI_V1$1 as ERC1155_SALES_CONTRACT_ABI_V1, ERC721_SALE_ABI_V0$1 as ERC721_SALE_ABI_V0, ERC721_SALE_ABI_V1$1 as ERC721_SALE_ABI_V1 } from "./index-isFvc5gd.js";
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
export { SalesContractVersion as SalesContractVersion$1, useSalesContractABI as useSalesContractABI$1 };
//# sourceMappingURL=index-F6CPmS8W.d.ts.map