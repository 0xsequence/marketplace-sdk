import "../../builder.gen-D7rQ1F-y.js";
import "../../builder-api-BNmN_UEH.js";
import "../../networkconfigToWagmiChain-CnHaSTVP.js";
import "../../transaction-D6a81-bE.js";
import { t as createWagmiConfig } from "../../create-config-Bh-Z2cLI.js";
import { _ as getQueryClient } from "../../api-CMGOh-La.js";
import "../../marketplace.gen-_O21M9RA.js";
import "../../network-CbrL_hu0.js";
import "../../_internal-CadQmXdE.js";
import "../../wagmi-Bseovd6Q.js";
import { n as marketplaceConfigOptions } from "../../marketplaceConfig-BAuhFpfy.js";
import { cookieToInitialState } from "wagmi";

//#region src/react/ssr/create-ssr-client.ts
const marketplaceConfig = async (config) => {
	const configOptions = marketplaceConfigOptions(config);
	return getQueryClient().fetchQuery(configOptions);
};
const initialState = async (args) => {
	return { wagmi: cookieToInitialState(createWagmiConfig(await marketplaceConfig(args.config), args.config, true), args.cookie) };
};
const createSSRClient = (args) => {
	const getMarketplaceConfig = async () => marketplaceConfig(args.config);
	const getInitialState = async () => initialState(args);
	return {
		getInitialState,
		getMarketplaceConfig,
		config: args.config
	};
};

//#endregion
export { createSSRClient };
//# sourceMappingURL=index.js.map