import { MissingConfigError } from "./transaction-DZUW5RHu.js";
import { networks } from "@0xsequence/network";

//#region src/utils/network.ts
const getNetwork = (nameOrId) => {
	for (const network of Object.values(networks)) if (network.name === String(nameOrId).toLowerCase() || network.chainId === Number(nameOrId)) return network;
	throw new MissingConfigError(`Network configuration for chain ${nameOrId}`);
};
const getPresentableChainName = (chainId) => {
	return networks[chainId]?.title ?? "Unknown Network";
};

//#endregion
export { getNetwork as getNetwork$1, getPresentableChainName as getPresentableChainName$1 };
//# sourceMappingURL=network-DwdZ_5-7.js.map