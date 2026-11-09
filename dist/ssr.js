import { t as createWagmiConfig } from "./create-config.js";
import { g as getQueryClient } from "./api.js";
import { n as marketplaceConfigOptions } from "./config.js";
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
export { createSSRClient as t };
//# sourceMappingURL=ssr.js.map