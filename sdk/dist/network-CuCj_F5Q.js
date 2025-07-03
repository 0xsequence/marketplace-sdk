import { networks } from '@0xsequence/network';
import { MissingConfigError } from './transaction-B7pHesqY.js';

//#region src/utils/network.ts
const getNetwork = (nameOrId) => {
	for (const network of Object.values(networks))
		if (
			network.name === String(nameOrId).toLowerCase() ||
			network.chainId === Number(nameOrId)
		)
			return network;
	throw new MissingConfigError(`Network configuration for chain ${nameOrId}`);
};
const getPresentableChainName = (chainId) => {
	return networks[chainId]?.title ?? 'Unknown Network';
};

//#endregion
export { getNetwork, getPresentableChainName };
//# sourceMappingURL=network-CuCj_F5Q.js.map
