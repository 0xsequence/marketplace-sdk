import { ContractType } from "./marketplace.gen-JzNYpM0U.js";
import { ERC1155_SALES_CONTRACT_ABI_V0, ERC1155_SALES_CONTRACT_ABI_V1, ERC721_SALE_ABI_V0, ERC721_SALE_ABI_V1 } from "./primary-sale-CLjXRrDj.js";
import { useReadContract } from "wagmi";
import { useMemo } from "react";

//#region src/react/hooks/contracts/useSalesContractABI.ts
let SalesContractVersion = /* @__PURE__ */ function(SalesContractVersion$1) {
	SalesContractVersion$1["V0"] = "v0";
	SalesContractVersion$1["V1"] = "v1";
	return SalesContractVersion$1;
}({});
function useSalesContractABI({ contractAddress, contractType, chainId, enabled = true }) {
	const functionName = contractType === ContractType.ERC721 ? "saleDetails" : "tokenSaleDetails";
	const { data: v1Data, isLoading: v1Loading, error: v1Error } = useReadContract({
		address: contractAddress,
		abi: contractType === ContractType.ERC721 ? ERC721_SALE_ABI_V1 : ERC1155_SALES_CONTRACT_ABI_V1,
		functionName,
		args: contractType === ContractType.ERC1155 ? [0n] : void 0,
		chainId,
		query: {
			enabled,
			retry: false
		}
	});
	const { data: v0Data, isLoading: v0Loading, error: v0Error } = useReadContract({
		address: contractAddress,
		abi: contractType === ContractType.ERC721 ? ERC721_SALE_ABI_V0 : ERC1155_SALES_CONTRACT_ABI_V0,
		functionName,
		args: contractType === ContractType.ERC1155 ? [0n] : void 0,
		chainId,
		query: {
			enabled: enabled && !!v1Error && !v1Loading,
			retry: false
		}
	});
	return useMemo(() => {
		if (v1Loading || v1Error && v0Loading) return {
			version: null,
			abi: null,
			contractType: null,
			isLoading: true,
			error: null
		};
		if (v1Data && !v1Error) {
			if (contractType === ContractType.ERC721) return {
				version: SalesContractVersion.V1,
				abi: ERC721_SALE_ABI_V1,
				contractType: ContractType.ERC721,
				isLoading: false,
				error: null
			};
			return {
				version: SalesContractVersion.V1,
				abi: ERC1155_SALES_CONTRACT_ABI_V1,
				contractType: ContractType.ERC1155,
				isLoading: false,
				error: null
			};
		}
		if (v0Data && !v0Error) {
			if (contractType === ContractType.ERC721) return {
				version: SalesContractVersion.V0,
				abi: ERC721_SALE_ABI_V0,
				contractType: ContractType.ERC721,
				isLoading: false,
				error: null
			};
			return {
				version: SalesContractVersion.V0,
				abi: ERC1155_SALES_CONTRACT_ABI_V0,
				contractType: ContractType.ERC1155,
				isLoading: false,
				error: null
			};
		}
		const error = v0Error || v1Error;
		return {
			version: null,
			abi: null,
			contractType: null,
			isLoading: false,
			error
		};
	}, [
		v1Data,
		v1Error,
		v1Loading,
		v0Data,
		v0Error,
		v0Loading,
		contractType
	]);
}

//#endregion
export { SalesContractVersion, useSalesContractABI };
//# sourceMappingURL=contracts-DPHFT2TA.js.map