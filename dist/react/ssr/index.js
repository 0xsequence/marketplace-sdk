import "../../builder.gen.js";
import "../../builder-api.js";
import "../../networkconfigToWagmiChain.js";
import "../../transaction.js";
import { t as createWagmiConfig } from "../../create-config.js";
import { _ as getQueryClient } from "../../api.js";
import "../../marketplace.gen.js";
import "../../network.js";
import "../../_internal.js";
import "../../wagmi.js";
import { n as marketplaceConfigOptions } from "../../marketplaceConfig.js";
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