import { r as MissingConfigError } from "./transaction-D6a81-bE.js";
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
export { getPresentableChainName as n, getNetwork as t };
//# sourceMappingURL=network-CbrL_hu0.js.map