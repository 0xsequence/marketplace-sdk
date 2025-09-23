import { SequenceMarketplaceV1_ABI, SequenceMarketplaceV2_ABI } from "./marketplace-BYY8OloA.js";
import { ERC1155_SALES_CONTRACT_ABI_V0, ERC1155_SALES_CONTRACT_ABI_V1, ERC721_SALE_ABI_V0, ERC721_SALE_ABI_V1 } from "./primary-sale-DOmNDq2P.js";

//#region src/utils/abi/helpers.ts
/**
* Get the appropriate sales contract ABI based on token type and version
*/
const getSaleContractABI = (tokenType, version) => {
	const abiMap = {
		"ERC721-v0": ERC721_SALE_ABI_V0,
		"ERC721-v1": ERC721_SALE_ABI_V1,
		"ERC1155-v0": ERC1155_SALES_CONTRACT_ABI_V0,
		"ERC1155-v1": ERC1155_SALES_CONTRACT_ABI_V1
	};
	const key = `${tokenType}-${version}`;
	return abiMap[key];
};
/**
* Get the appropriate marketplace ABI based on version
*/
const getMarketplaceABI = (version) => {
	return version === "v1" ? SequenceMarketplaceV1_ABI : SequenceMarketplaceV2_ABI;
};

//#endregion
export { getMarketplaceABI, getSaleContractABI };
//# sourceMappingURL=abi-C5hg6Wfb.js.map