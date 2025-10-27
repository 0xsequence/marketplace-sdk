import { n as SequenceMarketplaceV1_ABI, t as SequenceMarketplaceV2_ABI } from "./marketplace-Bi9uz-pD.js";
import { i as ERC721_SALE_ABI_V0, n as ERC1155_SALES_CONTRACT_ABI_V0, r as ERC721_SALE_ABI_V1, t as ERC1155_SALES_CONTRACT_ABI_V1 } from "./primary-sale-CioEL3I2.js";

//#region src/utils/abi/helpers.ts
/**
* Get the appropriate sales contract ABI based on token type and version
*/
const getSaleContractABI = (tokenType, version) => {
	return {
		"ERC721-v0": ERC721_SALE_ABI_V0,
		"ERC721-v1": ERC721_SALE_ABI_V1,
		"ERC1155-v0": ERC1155_SALES_CONTRACT_ABI_V0,
		"ERC1155-v1": ERC1155_SALES_CONTRACT_ABI_V1
	}[`${tokenType}-${version}`];
};
/**
* Get the appropriate marketplace ABI based on version
*/
const getMarketplaceABI = (version) => {
	return version === "v1" ? SequenceMarketplaceV1_ABI : SequenceMarketplaceV2_ABI;
};

//#endregion
export { getSaleContractABI as n, getMarketplaceABI as t };
//# sourceMappingURL=abi-Cisl57mB.js.map