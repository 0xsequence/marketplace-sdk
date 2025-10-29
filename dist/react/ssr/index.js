import "../../builder.gen-D7rQ1F-y.js";
import "../../builder-api-BNmN_UEH.js";
import "../../networkconfigToWagmiChain-CZRw46-K.js";
import "../../transaction-D6a81-bE.js";
import { t as createWagmiConfig } from "../../create-config-C-WNZAW4.js";
import { _ as getQueryClient } from "../../api-D_M2JwE1.js";
import "../../marketplace.gen-Cjbln5Lz.js";
import "../../network-CbrL_hu0.js";
import "../../_internal-CadQmXdE.js";
import "../../wagmi-Bseovd6Q.js";
import { n as marketplaceConfigOptions } from "../../marketplaceConfig-CNVyg7Cu.js";
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